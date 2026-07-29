-- Atomic stock decrement, called by the Stripe webhook after a confirmed
-- payment — avoids a read-then-write race between concurrent orders.
create or replace function public.decrement_stock(p_product_id bigint, p_qty int)
returns void
language sql
security definer
as $$
  update public.products
  set stock = greatest(0, stock - p_qty), updated_at = now()
  where id = p_product_id;
$$;
