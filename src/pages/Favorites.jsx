import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import { useFavorites } from "../context/useFavorites.js";
import { useAuth } from "../context/useAuth.js";

function Favorites() {
  const { favorites, count, clearFavorites } = useFavorites();
  const { isConfigured, email } = useAuth();

  if (!count) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-art heart-art" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="52" height="52">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M12 20.5l-1.3-1.2C5.6 14.7 2.4 11.8 2.4 8.2 2.4 5.3 4.7 3 7.5 3c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2 2.8 0 5.1 2.3 5.1 5.2 0 3.6-3.2 6.5-8.3 11.2L12 20.5z"
              />
            </svg>
          </div>
          <h2>No favorites yet</h2>
          <p>
            Your collection is empty. Search for anime and tap the heart to save
            it here.
          </p>
          {isConfigured && !email && (
            <p className="empty-sync-hint">
              Tip: sign in to keep your favorites on every device you use.
            </p>
          )}
          <Link to="/" className="btn-primary">
            Browse anime
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="results-bar">
        <h2 className="results-heading">
          Your favorites <span className="count-pill">{count}</span>
        </h2>
        <button type="button" className="btn-ghost" onClick={clearFavorites}>
          Clear all
        </button>
      </div>

      <div className="movie-grid">
        {favorites.map((anime, i) => (
          <Card key={anime.id} anime={anime} index={i} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
