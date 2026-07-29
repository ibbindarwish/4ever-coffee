-- 4ever Coffee — initial schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)

create type staff_role as enum ('admin', 'supervisor');

create table public.staff (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  role       staff_role not null default 'supervisor',
  created_at timestamptz not null default now()
);

create table public.customer_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  username   text unique not null,
  phone      text,
  created_at timestamptz not null default now()
);

create table public.products (
  id                  bigint generated always as identity primary key,
  name                text not null,
  description         text not null,
  price               numeric(10,2) not null check (price >= 0),
  original_price      numeric(10,2),
  category            text not null,
  scent_type          text,
  stock               int not null default 0,
  low_stock_threshold int not null default 10,
  gradient            text,
  accent              text,
  image               text,
  rating              numeric(2,1),
  reviews             int default 0,
  featured            boolean default false,
  is_new              boolean default false,
  seasonal            boolean default false,
  updated_at          timestamptz not null default now()
);

create type order_status as enum ('pending','preparing','ready','delivered','cancelled');

create table public.orders (
  id                       text primary key,
  customer_id              uuid references auth.users(id),
  customer_name            text not null,
  customer_email           text not null,
  customer_phone           text not null,
  customer_address         text not null,
  customer_city            text not null,
  subtotal                 numeric(10,2) not null,
  shipping                 numeric(10,2) not null default 0,
  discount                 numeric(10,2) not null default 0,
  promo_code               text,
  total                    numeric(10,2) not null,
  status                   order_status not null default 'pending',
  stripe_payment_intent_id text unique,
  note                     text,
  created_at               timestamptz not null default now()
);

create table public.order_items (
  id         bigint generated always as identity primary key,
  order_id   text not null references public.orders(id) on delete cascade,
  product_id bigint not null references public.products(id),
  name       text not null,
  price      numeric(10,2) not null,
  size       text not null,
  qty        int not null check (qty > 0)
);

create table public.promo_codes (
  id         bigint generated always as identity primary key,
  code       text unique not null,
  label      text not null,
  type       text not null check (type in ('percent','fixed','shipping')),
  value      numeric(10,2) not null,
  min_order  numeric(10,2) not null default 0,
  active     boolean not null default true,
  staff_role text check (staff_role in ('staff','admin'))
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.staff             enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.products          enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.promo_codes       enable row level security;

-- SECURITY DEFINER: checks staff membership without re-triggering RLS on
-- public.staff itself. A plain `exists (select 1 from public.staff where ...)`
-- inside a policy ON public.staff would recurse into its own policy forever —
-- this function runs as its (superuser) owner, bypassing RLS for this one check.
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.staff where id = auth.uid());
$$;

-- products: public read, staff-only write
create policy "products are publicly readable"
  on public.products for select
  using (true);

create policy "only staff can write products"
  on public.products for all
  using (public.is_staff())
  with check (public.is_staff());

-- promo_codes: public read (checkout needs to validate codes), staff-only write
create policy "promo codes are publicly readable"
  on public.promo_codes for select
  using (true);

create policy "only staff can write promo codes"
  on public.promo_codes for all
  using (public.is_staff())
  with check (public.is_staff());

-- orders / order_items: customers see only their own, staff see everything.
-- No insert policy at all — orders are only ever written by the service-role
-- webhook (api/stripe-webhook.ts), which bypasses RLS entirely.
create policy "customers and staff can read their relevant orders"
  on public.orders for select
  using (customer_id = auth.uid() or public.is_staff());

create policy "staff can update order status"
  on public.orders for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "customers and staff can read relevant order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_staff())
    )
  );

-- staff: readable by staff, no client insert (provisioned manually — see below)
create policy "staff can read staff table"
  on public.staff for select
  using (public.is_staff());

-- customer_profiles: own-row read/update only
create policy "customers can read their own profile"
  on public.customer_profiles for select
  using (id = auth.uid());

create policy "customers can update their own profile"
  on public.customer_profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- auto-create a customer_profiles row when someone signs up via supabase.auth.signUp()
-- with { options: { data: { name, username, phone } } }. Staff accounts created
-- manually in the Supabase dashboard won't carry this metadata, so they're skipped.
create function public.handle_new_user()
returns trigger as $$
begin
  if new.raw_user_meta_data ? 'username' then
    insert into public.customer_profiles (id, name, username, phone)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'phone'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
