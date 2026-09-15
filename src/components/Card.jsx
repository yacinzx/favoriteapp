import { useState } from "react";
import { useFavorites } from "../context/useFavorites.js";

function Card({ anime, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(anime.id);
  const [imgOk, setImgOk] = useState(Boolean(anime.image));

  const initial = (anime.title || "?").charAt(0).toUpperCase();
  const tint = anime.color || "#8b5cf6";

  return (
    <article
      className="card"
      style={{ animationDelay: `${Math.min(index, 14) * 55}ms` }}
    >
      <div className="poster">
        {imgOk ? (
          <img
            className="poster-img"
            src={anime.image}
            alt={anime.title}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div
            className="poster-fallback"
            style={{
              background: `linear-gradient(140deg, ${tint}, #14121f)`,
            }}
          >
            <span aria-hidden="true">{initial}</span>
          </div>
        )}

        <div className="poster-shine" aria-hidden="true" />

        {anime.score && (
          <span className="score-badge">
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2l2.94 5.95 6.57.95-4.75 4.63 1.12 6.54L12 17.02 6.12 20.07l1.12-6.54L2.49 8.9l6.57-.95z"
              />
            </svg>
            {anime.score}
          </span>
        )}

        <button
          type="button"
          className={"fav-btn" + (fav ? " is-fav" : "")}
          onClick={() => toggleFavorite(anime)}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
            <path
              fill={fav ? "currentColor" : "none"
              }
              stroke="currentColor"
              strokeWidth="2"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>

        {anime.description && (
          <div className="poster-overlay">
            <p className="poster-desc">{anime.description}</p>
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title" title={anime.title}>
          {anime.title}
        </h3>
        <div className="card-meta">
          {anime.year && <span>{anime.year}</span>}
          {anime.episodes && (
            <>
              <span className="dot" aria-hidden="true" />
              <span>{anime.episodes} eps</span>
            </>
          )}
        </div>
        {anime.genres && (
          <p className="card-genres">{anime.genres}</p>
        )}
      </div>
    </article>
  );
}

export default Card;
