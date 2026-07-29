-- Fixes "infinite recursion detected in policy for relation staff".
-- Cause: policies checked staff membership via a plain subquery on public.staff,
-- but that subquery is itself subject to staff's own RLS policy, which runs the
-- same subquery again, forever. Fix: a SECURITY DEFINER function bypasses RLS
-- on its internal query, breaking the loop. Run this in the SQL Editor.

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.staff where id = auth.uid());
$$;

drop policy if exists "only staff can write products" on public.products;
create policy "only staff can write products"
  on public.products for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "only staff can write promo codes" on public.promo_codes;
create policy "only staff can write promo codes"
  on public.promo_codes for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "customers and staff can read their relevant orders" on public.orders;
create policy "customers and staff can read their relevant orders"
  on public.orders for select
  using (customer_id = auth.uid() or public.is_staff());

drop policy if exists "staff can update order status" on public.orders;
create policy "staff can update order status"
  on public.orders for update
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "customers and staff can read relevant order items" on public.order_items;
create policy "customers and staff can read relevant order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "staff can read staff table" on public.staff;
create policy "staff can read staff table"
  on public.staff for select
  using (public.is_staff());
