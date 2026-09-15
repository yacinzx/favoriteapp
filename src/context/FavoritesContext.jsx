import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import { supabase } from "../lib/supabaseClient.js";
import {
  addRemoteFavorite,
  fetchRemoteFavorites,
  removeRemoteFavorite,
} from "../lib/favoritesApi.js";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "anifav.favorites";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStored(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [favorites, setFavorites] = useState(readStored);
  const [toasts, setToasts] = useState([]);
  const [syncing, setSyncing] = useState(false);

  /* ----- Sync with the cloud whenever the signed-in account changes -----
   * Guest  -> localStorage is the source of truth.
   * Signed in -> the account is the source of truth. Any favorites saved
   *              only on this device are pushed up first so nothing is lost,
   *              then device staging is cleared (keeps accounts separate).
   */
  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (!supabase || !userId) {
        setFavorites(readStored());
        return;
      }

      setSyncing(true);
      try {
        const remote = await fetchRemoteFavorites(userId);
        if (cancelled) return;

        const local = readStored();
        const remoteIds = new Set(remote.map((a) => a.id));
        const deviceOnly = local.filter((a) => !remoteIds.has(a.id));

        if (deviceOnly.length) {
          await Promise.all(
            deviceOnly.map((a) => addRemoteFavorite(userId, a)),
          );
        }
        if (cancelled) return;

        setFavorites([...remote, ...deviceOnly]);
        writeStored([]);
      } catch {
        if (!cancelled) setFavorites(readStored());
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* Persist to localStorage while browsing as a guest. */
  useEffect(() => {
    if (!userId) writeStored(favorites);
  }, [favorites, userId]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "add") => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), 2600);
    },
    [dismissToast],
  );

  const isFavorite = useCallback(
    (id) => favorites.some((a) => a.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (anime) => {
      const exists = favorites.some((a) => a.id === anime.id);
      const next = exists
        ? favorites.filter((a) => a.id !== anime.id)
        : [...favorites, anime];

      // Optimistic update — UI reacts instantly.
      setFavorites(next);

      if (supabase && userId) {
        const op = exists
          ? removeRemoteFavorite(userId, anime.id)
          : addRemoteFavorite(userId, anime);
        op.catch(() => {
          setFavorites(favorites);
          showToast(
            `Could not sync “${anime.title}” — kept on this device only`,
            "remove",
          );
        });
      }

      showToast(
        exists
          ? `Removed “${anime.title}” from favorites`
          : `Added “${anime.title}” to favorites`,
        exists ? "remove" : "add",
      );
    },
    [favorites, userId, showToast],
  );

  const clearFavorites = useCallback(() => {
    if (!favorites.length) return;
    const prev = favorites;
    setFavorites([]);

    if (supabase && userId) {
      Promise.all(prev.map((a) => removeRemoteFavorite(userId, a.id))).catch(
        () => {
          setFavorites(prev);
          showToast("Could not clear cloud favorites", "remove");
        },
      );
    }

    showToast("Favorites cleared", "remove");
  }, [favorites, userId, showToast]);

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      syncing,
      cloudEnabled: Boolean(supabase && userId),
    }),
    [
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      syncing,
      userId,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </FavoritesContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <button
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => onDismiss(t.id)}
          type="button"
        >
          <span className="toast-icon">{t.type === "add" ? "❤" : "✕"}</span>
          <span className="toast-msg">{t.message}</span>
        </button>
      ))}
    </div>
  );
}

export { FavoritesContext };
