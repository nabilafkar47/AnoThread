-- ============================================================
-- AnoThread — Complete Supabase Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. PROFILES TABLE
-- Extends auth.users with an editable username
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Anyone can read profiles (needed to resolve usernames)
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users can update only their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (on signup)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. THREADS TABLE
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  is_public boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.threads enable row level security;

-- Public threads are readable by everyone; private threads only by owner
create policy "Public threads are readable by everyone"
  on public.threads for select
  using (is_public = true or auth.uid() = owner_id);

-- Only the owner can insert threads
create policy "Owner can insert threads"
  on public.threads for insert
  with check (auth.uid() = owner_id);

-- Only the owner can update threads
create policy "Owner can update threads"
  on public.threads for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Only the owner can delete threads
create policy "Owner can delete threads"
  on public.threads for delete
  using (auth.uid() = owner_id);

-- 3. MESSAGES TABLE
-- CRITICAL: No user_id, no IP, no session — fully anonymous
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Anyone can read messages on threads they can see
create policy "Messages are readable on visible threads"
  on public.messages for select
  using (
    exists (
      select 1 from public.threads t
      where t.id = thread_id
      and (t.is_public = true or auth.uid() = t.owner_id)
    )
  );

-- Anyone can insert messages (anonymous)
create policy "Anyone can insert messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.threads t
      where t.id = thread_id
      and (t.is_public = true or auth.uid() = t.owner_id)
    )
  );

-- 4. REPLIES TABLE
-- is_owner flag is set server-side; anonymous replies have is_owner = false
create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  content text not null,
  is_owner boolean default false not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.replies enable row level security;

-- Anyone can read replies on messages they can see
create policy "Replies are readable on visible messages"
  on public.replies for select
  using (
    exists (
      select 1 from public.messages m
      join public.threads t on t.id = m.thread_id
      where m.id = message_id
      and (t.is_public = true or auth.uid() = t.owner_id)
    )
  );

-- Anyone can insert replies
create policy "Anyone can insert replies"
  on public.replies for insert
  with check (
    exists (
      select 1 from public.messages m
      join public.threads t on t.id = m.thread_id
      where m.id = message_id
      and (t.is_public = true or auth.uid() = t.owner_id)
    )
  );

-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- This function runs when a new user signs up via auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  base_username text;
  final_username text;
  suffix text;
begin
  -- Extract username from email (part before @)
  base_username := split_part(new.email, '@', 1);
  -- Remove non-alphanumeric characters
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9]', '', 'g');
  -- Lowercase
  base_username := lower(base_username);

  -- Try the base username first
  final_username := base_username;

  -- If taken, append random 4-digit suffix
  if exists (select 1 from public.profiles where username = final_username) then
    suffix := lpad(floor(random() * 10000)::text, 4, '0');
    final_username := base_username || suffix;
  end if;

  -- If still taken (unlikely), try again with different suffix
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := lpad(floor(random() * 10000)::text, 4, '0');
    final_username := base_username || suffix;
  end loop;

  insert into public.profiles (id, username)
  values (new.id, final_username);

  return new;
end;
$$;

-- Trigger: auto-create profile after signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. INDEXES for performance
create index if not exists idx_threads_owner_id on public.threads(owner_id);
create index if not exists idx_messages_thread_id on public.messages(thread_id);
create index if not exists idx_replies_message_id on public.replies(message_id);
create index if not exists idx_profiles_username on public.profiles(username);
