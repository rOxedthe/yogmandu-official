-- ─────────────────────────────────────────────────────────────────────────────
-- Yogmandu Website — Supabase Schema
-- Run this SQL in the Supabase SQL Editor once to set up all required tables.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Class Sessions ────────────────────────────────────────────────────────────
create table if not exists yogmandu_sessions (
  id            text         primary key,
  slug          text         not null,
  name          text         not null,
  type          text,
  status        text         not null default 'Active',
  display_order integer      not null default 100,
  data          jsonb        not null,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now()
);

create index if not exists yogmandu_sessions_status_idx on yogmandu_sessions (status);
create index if not exists yogmandu_sessions_order_idx  on yogmandu_sessions (display_order);

-- ── Blog Posts ────────────────────────────────────────────────────────────────
create table if not exists yogmandu_blogs (
  id           text         primary key,
  slug         text         not null unique,
  title        text         not null,
  status       text         not null default 'Draft',
  published_at timestamptz,
  data         jsonb        not null,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

create index if not exists yogmandu_blogs_status_idx on yogmandu_blogs (status);
create index if not exists yogmandu_blogs_slug_idx   on yogmandu_blogs (slug);
create index if not exists yogmandu_blogs_pub_idx    on yogmandu_blogs (published_at desc);

-- ── Media Library ─────────────────────────────────────────────────────────────
create table if not exists yogmandu_media (
  id         text         primary key,
  url        text         not null,
  caption    text         not null default '',
  used_by    text         not null default '',
  data       jsonb        not null,
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now()
);

-- ── Contact Submissions ───────────────────────────────────────────────────────
-- Stores enquiries submitted via the /contact form.
create table if not exists yogmandu_contacts (
  id         bigserial    primary key,
  name       text         not null,
  email      text         not null,
  program    text,
  message    text         not null,
  ip_hash    text,
  created_at timestamptz  not null default now()
);

create index if not exists yogmandu_contacts_created_idx on yogmandu_contacts (created_at desc);
create index if not exists yogmandu_contacts_email_idx   on yogmandu_contacts (email);

-- ── User Accounts ─────────────────────────────────────────────────────────────
create table if not exists yogmandu_users (
  id               uuid         primary key default gen_random_uuid(),
  email            text         not null unique,
  password_hash    text         not null,
  full_name        text         not null,
  phone            text         not null default '',
  nationality      text         not null default '',
  experience_level text         not null default 'Beginner',
  bio              text         not null default '',
  avatar_url       text         not null default '',
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);

create index if not exists yogmandu_users_email_idx on yogmandu_users (email);

-- ── Row Level Security (RLS) ──────────────────────────────────────────────────
-- All tables are accessed exclusively via the service role key (server-side).
-- RLS is enabled to block any direct browser/anon access.

alter table yogmandu_sessions  enable row level security;
alter table yogmandu_blogs     enable row level security;
alter table yogmandu_media     enable row level security;
alter table yogmandu_contacts  enable row level security;
alter table yogmandu_users     enable row level security;

-- Service role bypasses RLS automatically — no policies needed for server-side calls.

-- ── Storage Bucket ────────────────────────────────────────────────────────────
-- Create a public bucket named "yogmandu-media" in Supabase Storage:
--   Dashboard → Storage → New bucket → Name: yogmandu-media → Public: on
-- No SQL needed; this is done via the Supabase dashboard.
