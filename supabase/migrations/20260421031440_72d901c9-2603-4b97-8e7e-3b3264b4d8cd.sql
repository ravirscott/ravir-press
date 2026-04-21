
-- Roles enum
create type public.app_role as enum ('admin', 'editor', 'user');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User roles (separate table)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role security definer fn
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "User roles viewable by self or admin"
  on public.user_roles for select
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Only admins can insert roles"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update roles"
  on public.user_roles for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete roles"
  on public.user_roles for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Categories
create table public.categories (
  slug text primary key,
  name text not null,
  tagline text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

create policy "Categories are public"
  on public.categories for select using (true);

create policy "Admins manage categories"
  on public.categories for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Posts
create type public.post_status as enum ('draft', 'published', 'scheduled');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  meta_description text,
  category_slug text references public.categories(slug),
  tags text[] not null default '{}',
  author text,
  author_id uuid references auth.users(id) on delete set null,
  status post_status not null default 'draft',
  published_at timestamptz,
  scheduled_for timestamptz,
  reading_minutes int default 5,
  hero_eyebrow text,
  hero_image_url text,
  body jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  is_ai_generated boolean not null default false,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;

create index posts_status_published_idx on public.posts(status, published_at desc);
create index posts_category_idx on public.posts(category_slug);

create policy "Published posts are public"
  on public.posts for select
  using (status = 'published' or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));

create policy "Admins/editors insert posts"
  on public.posts for insert
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));

create policy "Admins/editors update posts"
  on public.posts for update
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));

create policy "Only admins delete posts"
  on public.posts for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Activity log
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.activity_logs enable row level security;

create policy "Admins view all logs"
  on public.activity_logs for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Authenticated insert logs"
  on public.activity_logs for insert
  with check (auth.uid() is not null);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_posts_updated before update on public.posts
  for each row execute function public.set_updated_at();
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile + assign role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  -- Bootstrap: if email matches the seeded admin OR is the very first user, grant admin
  if new.email = 'ravishkxz@gmail.com' or (select count(*) from public.user_roles) = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;

  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
