# AniFav · Anime Favorites

Search, discover and save your favorite anime. Built with React + Vite.

- **Live data** from the [AniList](https://anilist.co) API, with an offline
  fallback collection baked in (works even when the API is unreachable).
- **Accounts & cloud sync** via [Supabase](https://supabase.com) — sign in on
  any device and your favorites follow you.
- **Device-only mode**: with no Supabase keys configured, favorites are stored
  in the browser via `localStorage`, so the app always works.

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL (default <http://localhost:5173>).

## Enabling accounts & cross-device sync

Favorites are device-only until you connect a free Supabase project. This is
what lets a user sign in on another phone and see their list.

1. **Create a project** — go to <https://supabase.com>, sign up, and create a
   new project (the free tier is plenty).

2. **Create the database table** — in your project dashboard open
   **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**. This
   creates the `favorites` table with Row Level Security so users can only
   read/write their own rows.

3. **Add your API keys** — in the dashboard go to
   **Project Settings → API** and copy the **Project URL** and the
   **anon public** key. Copy `.env.example` to `.env` and fill them in:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. **Restart the dev server** (`npm run dev`). A **Sign in** button appears in
   the navbar and a "Synced" badge shows when favorites are saved to the cloud.

> The **anon public** key is designed to be used in the browser. It is not a
> secret — access is enforced by Row Level Security, so a user can ever only
> touch their own favorites. Keep the `service_role` key out of this repo.

### Email confirmation

By default Supabase requires new accounts to confirm their email before signing
in. After signing up, the app tells you to check your inbox. To disable this
for local testing: **Authentication → Sign In / Providers → Email → turn off
"Confirm email"**, or invite test users from the Users panel.

## How favorites sync works

- **Signed out** → favorites are saved to `localStorage` on the device.
- **Sign in** → any favorites saved only on that device are merged up into the
  account first, so nothing is lost on your first login.
- **Signed in** → every heart tap writes through to the database immediately
  (optimistically, with rollback + a toast if the request fails).
- **Sign out** → the device shows no favorites; sign back in to restore them.

## Project structure

```
src/
  api/animeApi.js          AniList search + offline fallback
  data/fallbackAnime.js    Curated offline collection
  lib/supabaseClient.js    Supabase client (null until configured)
  lib/favoritesApi.js      Remote favorites CRUD
  context/AuthContext.jsx  Session, sign up / in / out
  context/FavoritesContext.jsx  Local + cloud favorites, toasts
  components/              NavBar, Card, AuthModal, Skeleton
  pages/                   Home, Favorites
supabase/schema.sql        Run this in the Supabase SQL editor
```

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # oxlint
npm run preview  # preview the production build
```
