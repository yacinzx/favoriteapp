-- ============================================================
-- AniFav · Favorites table + Row Level Security
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Storage for a user's saved anime. The full anime object is stored as JSONB
-- so the app has everything it needs to render a card without extra queries.
create table if not exists public.favorites (
  user_id   uuid        references auth.users(id) on delete cascade not null,
  anime_id  integer                                                not null,
  anime     jsonb                                                 not null,
  created_at timestamptz default now(),
  primary key (user_id, anime_id)
);

comment on table public.favorites is
  'Anime saved by a user. One row per (user, anime).';

-- Enable Row Level Security so a user can only ever touch their own rows.
alter table public.favorites enable row level security;

drop policy if exists "favorites_select_own" on public.favorites;
drop policy if exists "favorites_insert_own" on public.favorites;
drop policy if exists "favorites_update_own" on public.favorites;
drop policy if exists "favorites_delete_own" on public.favorites;

create policy "favorites_select_own"
  on public.favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "favorites_update_own"
  on public.favorites for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  to authenticated
  using (auth.uid() = user_id);
