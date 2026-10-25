-- Instagram clone schema for Supabase.
-- Paste this whole file into the Supabase SQL Editor and run it once.
--
-- Every user is an anonymous Supabase Auth user (no login screen). A
-- trigger on auth.users creates the matching public.users profile row.
-- Tables mirror the shape of the original Firestore documents so the UI
-- can keep reading the same fields (followers arrays, comments arrays...).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  name text not null default '',
  profile_picture text not null default '',
  bio text not null default '',
  link text not null default '',
  gender text[] not null default array['Prefer not to say', ''],
  country text,
  followers uuid[] not null default '{}',
  following uuid[] not null default '{}',
  followers_request uuid[] not null default '{}',
  following_request uuid[] not null default '{}',
  saved_posts uuid[] not null default '{}',
  close_friends uuid[] not null default '{}',
  favorite_users uuid[] not null default '{}',
  muted_users uuid[] not null default '{}',
  event_notification integer not null default 0,
  chat_notification integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  username text not null,
  profile_picture text not null default '',
  image_url text not null,
  caption text not null default '',
  likes_by_users uuid[] not null default '{}',
  -- [username, profile_picture] of the latest liker, shown in notifications
  new_likes text[] not null default '{}',
  -- [{ email, username, profile_picture, comment, createdAt: { seconds }, likes_by_users: [] }]
  comments jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_owner_id_idx on public.posts (owner_id, created_at desc);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  username text not null,
  name text not null default '',
  profile_picture text not null default '',
  image_url text not null,
  likes_by_users uuid[] not null default '{}',
  new_likes text[] not null default '{}',
  seen_by_users uuid[] not null default '{}',
  created_at timestamptz not null default now()
);
create index stories_owner_id_idx on public.stories (owner_id);

create table public.reels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  username text not null,
  profile_picture text not null default '',
  video_url text not null,
  caption text not null default '',
  likes_by_users uuid[] not null default '{}',
  comments jsonb not null default '[]',
  shared integer not null default 0,
  created_at timestamptz not null default now()
);

-- One row per conversation per side (owner sees peer in their inbox).
create table public.chats (
  owner_id uuid not null references public.users (id) on delete cascade,
  peer_id uuid not null references public.users (id) on delete cascade,
  username text not null,
  name text not null default '',
  profile_picture text not null default '',
  status text not null default 'seen' check (status in ('seen', 'unseen')),
  primary key (owner_id, peer_id)
);

-- Each message is stored once per side, like the original Firestore layout.
create table public.messages (
  id bigint generated always as identity primary key,
  owner_id uuid not null references public.users (id) on delete cascade,
  peer_id uuid not null references public.users (id) on delete cascade,
  message text not null,
  who text not null check (who in ('current', 'user')),
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on public.messages (owner_id, peer_id, created_at);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid not null default auth.uid() references public.users (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profile row for every new (anonymous) auth user
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, username, name, profile_picture)
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 8),
    'New user',
    'https://randomuser.me/api/portraits/'
      || (array['men', 'women'])[1 + floor(random() * 2)::int]
      || '/' || floor(random() * 100)::int || '.jpg'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.stories enable row level security;
alter table public.reels enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

create policy "users: read all" on public.users
  for select to authenticated using (true);
create policy "users: update own" on public.users
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "posts: read all" on public.posts
  for select to authenticated using (true);
create policy "posts: insert own" on public.posts
  for insert to authenticated with check (owner_id = auth.uid());
create policy "posts: update own" on public.posts
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "posts: delete own" on public.posts
  for delete to authenticated using (owner_id = auth.uid());

create policy "stories: read all" on public.stories
  for select to authenticated using (true);
create policy "stories: insert own" on public.stories
  for insert to authenticated with check (owner_id = auth.uid());
create policy "stories: update own" on public.stories
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "stories: delete own" on public.stories
  for delete to authenticated using (owner_id = auth.uid());

create policy "reels: read all" on public.reels
  for select to authenticated using (true);
create policy "reels: insert own" on public.reels
  for insert to authenticated with check (owner_id = auth.uid());
create policy "reels: update own" on public.reels
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "reels: delete own" on public.reels
  for delete to authenticated using (owner_id = auth.uid());

create policy "chats: read own" on public.chats
  for select to authenticated using (owner_id = auth.uid());
create policy "chats: insert own" on public.chats
  for insert to authenticated with check (owner_id = auth.uid());
create policy "chats: update own" on public.chats
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "messages: read own" on public.messages
  for select to authenticated using (owner_id = auth.uid());

create policy "reports: insert own" on public.reports
  for insert to authenticated with check (reported_by = auth.uid());

grant select, insert, update, delete on all tables in schema public to authenticated;

-- ---------------------------------------------------------------------------
-- Functions for writes that touch other users' rows
-- ---------------------------------------------------------------------------

create function public.require_uid()
returns uuid
language plpgsql
stable
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  return auth.uid();
end;
$$;

create function public.toggle_post_like(p_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
  v_owner uuid;
  v_liked boolean;
  v_username text;
  v_picture text;
begin
  select owner_id, v_uid = any (likes_by_users) into v_owner, v_liked
  from posts where id = p_post_id for update;
  if not found then return; end if;

  if v_liked then
    update posts
    set likes_by_users = array_remove(likes_by_users, v_uid), new_likes = '{}'
    where id = p_post_id;
    update users set event_notification = greatest(event_notification - 1, 0)
    where id = v_owner;
  else
    select username, profile_picture into v_username, v_picture from users where id = v_uid;
    update posts
    set likes_by_users = array_append(likes_by_users, v_uid),
        new_likes = array[v_username, v_picture]
    where id = p_post_id;
    update users set event_notification = event_notification + 1 where id = v_owner;
  end if;
end;
$$;

create function public.toggle_story_like(p_story_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  update stories
  set likes_by_users = case
    when v_uid = any (likes_by_users) then array_remove(likes_by_users, v_uid)
    else array_append(likes_by_users, v_uid)
  end
  where id = p_story_id;
end;
$$;

create function public.mark_story_seen(p_story_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  update stories
  set seen_by_users = array_append(seen_by_users, v_uid)
  where id = p_story_id and not (v_uid = any (seen_by_users));
end;
$$;

create function public.add_comment(p_post_id uuid, p_comment text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
  v_owner uuid;
  v_comment jsonb;
begin
  select jsonb_build_object(
    'email', id,
    'username', username,
    'profile_picture', profile_picture,
    'comment', p_comment,
    'createdAt', jsonb_build_object('seconds', floor(extract(epoch from now()))::bigint),
    'likes_by_users', '[]'::jsonb
  ) into v_comment
  from users where id = v_uid;

  update posts set comments = comments || jsonb_build_array(v_comment)
  where id = p_post_id
  returning owner_id into v_owner;

  if v_owner is not null and v_owner <> v_uid then
    update users set event_notification = event_notification + 1 where id = v_owner;
  end if;
end;
$$;

create function public.toggle_comment_like(p_post_id uuid, p_index integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid text := require_uid()::text;
  v_likes jsonb;
begin
  select comments -> p_index -> 'likes_by_users' into v_likes
  from posts where id = p_post_id and jsonb_array_length(comments) > p_index
  for update;
  if not found then return; end if;

  if v_likes is null or jsonb_typeof(v_likes) <> 'array' then
    v_likes := '[]'::jsonb;
  end if;

  if v_likes ? v_uid then
    v_likes := v_likes - v_uid;
  else
    v_likes := v_likes || to_jsonb(v_uid);
  end if;

  update posts
  set comments = jsonb_set(comments, array[p_index::text, 'likes_by_users'], v_likes)
  where id = p_post_id;
end;
$$;

-- The comment author or the post owner can delete a comment.
create function public.delete_comment(p_post_id uuid, p_index integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  update posts
  set comments = comments - p_index
  where id = p_post_id
    and (owner_id = v_uid or comments -> p_index ->> 'email' = v_uid::text);
end;
$$;

create function public.toggle_follow_request(p_target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
  v_pending boolean;
begin
  if p_target = v_uid then return; end if;

  select p_target = any (following_request) into v_pending from users where id = v_uid;

  if v_pending then
    update users set following_request = array_remove(following_request, p_target)
    where id = v_uid;
    update users set followers_request = array_remove(followers_request, v_uid)
    where id = p_target;
  else
    update users set following_request = array_append(following_request, p_target)
    where id = v_uid;
    update users set followers_request = array_append(array_remove(followers_request, v_uid), v_uid)
    where id = p_target;
  end if;
end;
$$;

create function public.respond_follow_request(p_requester uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  if not exists (
    select 1 from users where id = v_uid and p_requester = any (followers_request)
  ) then
    return;
  end if;

  update users
  set following_request = array_remove(following_request, v_uid),
      following = case
        when p_accept then array_append(array_remove(following, v_uid), v_uid)
        else following
      end,
      event_notification = event_notification + case when p_accept then 1 else 0 end
  where id = p_requester;

  update users
  set followers_request = array_remove(followers_request, p_requester),
      followers = case
        when p_accept then array_append(array_remove(followers, p_requester), p_requester)
        else followers
      end
  where id = v_uid;
end;
$$;

create function public.unfollow(p_target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  update users set following = array_remove(following, p_target) where id = v_uid;
  update users set followers = array_remove(followers, v_uid) where id = p_target;
end;
$$;

create function public.remove_follower(p_follower uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  update users set followers = array_remove(followers, p_follower) where id = v_uid;
  update users set following = array_remove(following, v_uid) where id = p_follower;
end;
$$;

create function public.send_message(p_to uuid, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  -- Sender's inbox entry for the recipient.
  insert into chats (owner_id, peer_id, username, name, profile_picture, status)
  select v_uid, u.id, u.username, u.name, u.profile_picture, 'seen'
  from users u where u.id = p_to
  on conflict (owner_id, peer_id) do nothing;

  -- Recipient's inbox entry for the sender, marked unseen.
  insert into chats (owner_id, peer_id, username, name, profile_picture, status)
  select p_to, u.id, u.username, u.name, u.profile_picture, 'unseen'
  from users u where u.id = v_uid
  on conflict (owner_id, peer_id) do update
  set username = excluded.username,
      name = excluded.name,
      profile_picture = excluded.profile_picture,
      status = 'unseen';

  insert into messages (owner_id, peer_id, message, who)
  values (v_uid, p_to, p_message, 'current'), (p_to, v_uid, p_message, 'user');

  update users set chat_notification = chat_notification + 1 where id = p_to;
end;
$$;

-- Toggles a value in one of the current user's own list columns.
create function public.toggle_own_list(p_column text, p_value uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  if p_column not in ('saved_posts', 'close_friends', 'favorite_users', 'muted_users') then
    raise exception 'unsupported column %', p_column;
  end if;

  execute format(
    'update users set %1$I = case when $1 = any (%1$I) then array_remove(%1$I, $1) '
    'else array_append(%1$I, $1) end where id = $2',
    p_column
  ) using p_value, v_uid;
end;
$$;

-- Returns false when the username is already taken.
create function public.change_username(p_username text)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  if exists (select 1 from users where username = p_username and id <> v_uid) then
    return false;
  end if;

  update users set username = p_username where id = v_uid;
  update posts set username = p_username where owner_id = v_uid;
  update stories set username = p_username where owner_id = v_uid;
  update reels set username = p_username where owner_id = v_uid;
  return true;
end;
$$;

create function public.update_profile_picture(p_url text)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := require_uid();
begin
  update users set profile_picture = p_url where id = v_uid;
  update posts set profile_picture = p_url where owner_id = v_uid;
  update stories set profile_picture = p_url where owner_id = v_uid;
  update reels set profile_picture = p_url where owner_id = v_uid;
end;
$$;

-- Deletes the caller's auth user; their profile and content cascade.
-- Uploaded files must be removed through the Storage API first.
create function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = require_uid();
end;
$$;

revoke execute on all functions in schema public from public, anon;
grant execute on all functions in schema public to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime (live feed, chat, profile updates)
-- ---------------------------------------------------------------------------

alter publication supabase_realtime
  add table public.users, public.posts, public.stories, public.reels,
            public.chats, public.messages;

-- ---------------------------------------------------------------------------
-- Storage bucket for uploaded pictures: media/<user id>/<file>
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media: upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media: update own folder" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media: delete own folder" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
