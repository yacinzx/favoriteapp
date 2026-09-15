import fallbackAnime from "../data/fallbackAnime.js";

const ANILIST_URL = "https://graphql.anilist.co";

const MEDIA_FIELDS = `
  id
  title { romaji english }
  coverImage { extraLarge color }
  averageScore
  episodes
  seasonYear
  genres
  description(asHtml: false)
`;

const QUERY = `
  query ($search: String, $perPage: Int, $sort: [MediaSort]) {
    Page(page: 1, perPage: $perPage) {
      media(search: $search, type: ANIME, sort: $sort) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

function clip(text, max = 180) {
  if (!text) return "";
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max * 0.7 ? cut.slice(0, space) : cut) + "…";
}

function mapMedia(m) {
  return {
    id: m.id,
    title: m.title?.english || m.title?.romaji || "Untitled",
    romaji: m.title?.romaji || "",
    image: m.coverImage?.extraLarge || m.coverImage?.large || null,
    color: m.coverImage?.color || null,
    score: m.averageScore ?? null,
    episodes: m.episodes ?? null,
    year: m.seasonYear ?? null,
    genres: (m.genres || []).slice(0, 4).join(", "),
    description: clip(m.description),
  };
}

/**
 * Query the AniList GraphQL API.
 * @param {string} search - search term (empty string -> trending)
 * @returns {Promise<Array>} mapped anime list
 */
export async function searchAnime(search) {
  const sort = search.trim() ? "SEARCH_MATCH" : "TRENDING_DESC";
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { search: search.trim() || null, perPage: 18, sort },
    }),
  });

  if (!res.ok) throw new Error(`AniList request failed (${res.status})`);

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "AniList returned an error");
  }

  const media = json.data?.Page?.media || [];
  return media
    .filter((m) => m.title?.english || m.title?.romaji)
    .map(mapMedia);
}

/** Local filter over the curated fallback list. */
export function searchLocal(search) {
  const q = search.trim().toLowerCase();
  if (!q) return fallbackAnime;
  return fallbackAnime.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.romaji.toLowerCase().includes(q) ||
      a.genres.toLowerCase().includes(q),
  );
}

/**
 * Live search with graceful offline fallback.
 * @returns {Promise<{ results: Array, source: "anilist" | "offline" }>}
 */
export async function searchAnimeWithFallback(search) {
  try {
    const results = await searchAnime(search);
    if (results.length) return { results, source: "anilist" };
    return { results: searchLocal(search), source: "offline" };
  } catch {
    return { results: searchLocal(search), source: "offline" };
  }
}

export { fallbackAnime };
