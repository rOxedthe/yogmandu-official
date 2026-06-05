-- Custom sitemap URLs (admin-managed)
-- Run in Supabase SQL editor after 007_bookings.sql
-- Lets the admin add standalone landing pages to /sitemap.xml without a code change.

create table if not exists public.yogmandu_sitemap_urls (
  id               uuid         primary key default gen_random_uuid(),
  path             text         not null unique,          -- e.g. '/yoga-for-beginners'
  priority         numeric(2,1) not null default 0.5,     -- 0.0–1.0
  change_frequency text         not null default 'monthly',
  created_at       timestamptz  not null default now()
);

create index if not exists yogmandu_sitemap_urls_created_idx
  on public.yogmandu_sitemap_urls(created_at desc);

alter table public.yogmandu_sitemap_urls enable row level security;
