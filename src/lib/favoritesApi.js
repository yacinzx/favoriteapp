import { supabase } from "./supabaseClient.js";

const TABLE = "favorites";

/** Load all favorites belonging to the given user. */
export async function fetchRemoteFavorites(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("anime")
    .eq("user_id", userId);

  if (error) throw error;
  return (data || []).map((row) => row.anime);
}

/** Save (or overwrite) one favorite for the given user. */
export async function addRemoteFavorite(userId, anime) {
  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      anime_id: anime.id,
      anime,
    },
    { onConflict: "user_id,anime_id" },
  );
  if (error) throw error;
}

/** Remove one favorite for the given user. */
export async function removeRemoteFavorite(userId, animeId) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("anime_id", animeId);
  if (error) throw error;
}
