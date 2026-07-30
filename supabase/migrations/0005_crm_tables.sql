-- CRM: real subscriber list + campaign history, replacing localStorage
-- (which reset every time an admin cleared their browser).

create table public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text unique not null,
  tags       text[] not null default '{}',
  active     boolean not null default true,
  joined_at  timestamptz not null default now()
);

create table public.campaigns (
  id               uuid primary key default gen_random_uuid(),
  type             text not null,
  subject          text not null,
  promo_code       text,
  recipient_count  int not null default 0,
  opens            int not null default 0,
  clicks           int not null default 0,
  sent_at          timestamptz not null default now()
);

alter table public.subscribers enable row level security;
alter table public.campaigns   enable row level security;

-- Public storefront visitors can subscribe without being staff or logged in.
create policy "anyone can subscribe"
  on public.subscribers for insert
  with check (true);

-- Only staff can see/manage the subscriber list itself.
create policy "staff can read subscribers"
  on public.subscribers for select
  using (public.is_staff());

create policy "staff can update subscribers"
  on public.subscribers for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff can delete subscribers"
  on public.subscribers for delete
  using (public.is_staff());

-- Campaigns are an entirely internal/admin concern.
create policy "staff can manage campaigns"
  on public.campaigns for all
  using (public.is_staff())
  with check (public.is_staff());
