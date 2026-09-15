import { useCallback, useEffect, useRef, useState } from "react";
import Card from "../components/Card.jsx";
import { GridSkeleton } from "../components/Skeleton.jsx";
import { searchAnimeWithFallback } from "../api/animeApi.js";
import { useFavorites } from "../context/useFavorites.js";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("anilist");
  const { count } = useFavorites();
  const heroRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      const el = heroRef.current;
      if (!el) return;
      const y = Math.min(window.scrollY, 520);
      el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      el.style.opacity = String(Math.max(1 - y / 560, 0));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const load = useCallback(async (q) => {
    setLoading(true);
    const { results: data, source: src } = await searchAnimeWithFallback(q);
    setResults(data);
    setSource(src);
    setLoading(false);
  }, []);

  useEffect(() => {
    const delay = query.trim() ? 420 : 0;
    const timer = setTimeout(() => load(query), delay);
    return () => clearTimeout(timer);
  }, [query, load]);

  function handleSubmit(e) {
    e.preventDefault();
    load(query);
  }

  const heading = query.trim() ? `Results for “${query.trim()}”` : "Trending now";
  const showEmpty = !loading && results.length === 0;

  return (
    <div className="page">
      <section className="hero" ref={heroRef}>
        <span className="hero-chip">
          <span className="pulse-dot" aria-hidden="true" />
          {count} saved {count === 1 ? "anime" : "anime"} in your list
        </span>
        <h1 className="hero-title">
          Discover &amp; save the anime you <span className="gradient-text">love</span>
        </h1>
        <p className="hero-sub">
          Search thousands of titles, check scores and build your personal
          favorites collection — it stays saved on your device.
        </p>

        <form className="search-form" onSubmit={handleSubmit} role="search">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm6.5-2.5L21 21"
            />
          </svg>
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an anime title or genre…"
            aria-label="Search anime"
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </section>

      <div className="results-bar">
        <h2 className="results-heading">{heading}</h2>
        <span
          className={`source-badge${source === "offline" ? " offline" : ""}`}
          title={
            source === "offline"
              ? "Live API unreachable — showing the local offline collection"
              : "Live data from AniList"
          }
        >
          {source === "offline" ? "● Offline collection" : "● Live · AniList"}
        </span>
      </div>

      {loading ? (
        <GridSkeleton count={12} />
      ) : showEmpty ? (
        <div className="empty">
          <div className="empty-art" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="46" height="46">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm6.5-2.5L21 21"
              />
            </svg>
          </div>
          <h3>No anime found</h3>
          <p>Try a different title, or clear the search to browse trending picks.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setQuery("")}
          >
            Back to trending
          </button>
        </div>
      ) : (
        <div className="movie-grid">
          {results.map((anime, i) => (
            <Card key={anime.id} anime={anime} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
