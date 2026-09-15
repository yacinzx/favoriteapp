import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useFavorites } from "../context/useFavorites.js";
import { useAuth } from "../context/useAuth.js";
import AuthModal from "./AuthModal.jsx";

function NavBar() {
  const { count, syncing, cloudEnabled } = useFavorites();
  const { isConfigured, email, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <NavLink to="/" className="logo" aria-label="AniFav home">
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </span>
          <span className="logo-text">
            Ani<span className="gradient-text">Fav</span>
          </span>
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Discover
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Favorites
            {count > 0 && <span className="fav-badge">{count}</span>}
          </NavLink>
        </div>

        <div className="navbar-auth">
          {syncing && (
            <span className="sync-pill" title="Loading your cloud favorites">
              <span className="sync-spinner" aria-hidden="true" />
              Syncing
            </span>
          )}

          {isConfigured && !syncing && cloudEnabled && (
            <span
              className="sync-pill synced"
              title="Favorites are synced to your account"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 12.5l5 5L20 6.5"
                />
              </svg>
              Synced
            </span>
          )}

          {isConfigured && email ? (
            <div className="user-chip">
              <span className="user-avatar" aria-hidden="true">
                {email.charAt(0).toUpperCase()}
              </span>
              <span className="user-email" title={email}>
                {email}
              </span>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          ) : (
            isConfigured && (
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => openAuth("signin")}
              >
                Sign in
              </button>
            )
          )}

          {!isConfigured && (
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => openAuth("signin")}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {authOpen && (
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode={authMode}
        />
      )}
    </header>
  );
}

export default NavBar;
