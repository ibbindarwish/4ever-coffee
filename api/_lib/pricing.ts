// Server-side pricing recompute — the single source of truth for order totals.
// Never trust subtotal/discount/total values submitted by the client; only
// product ids/sizes/quantities and a promo code string are trusted as input,
// and even those are validated against the database here.

export type CupSize = 'small' | 'medium' | 'large'

export const SIZE_PRICE: Record<CupSize, number> = { small: -0.50, medium: 0, large: 0.50 }

export interface CartItemInput {
  productId: number
  size: CupSize
  qty: number
}

export interface ProductPriceLookup {
  id: number
  price: number
}

export interface PromoRow {
  code: string
  type: 'percent' | 'fixed' | 'shipping'
  value: number
  min_order: number
  active: boolean
  staff_role: 'staff' | 'admin' | null
}

export interface PricingResult {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function calcSubtotal(items: CartItemInput[], products: ProductPriceLookup[]): number {
  let subtotal = 0
  for (const item of items) {
    const product = products.find(p => p.id === item.productId)
    if (!product) throw new Error(`Unknown product id ${item.productId}`)
    if (item.qty <= 0) throw new Error(`Invalid quantity for product ${item.productId}`)
    subtotal += (product.price + SIZE_PRICE[item.size]) * item.qty
  }
  return round2(subtotal)
}

export function calcShipping(subtotal: number): number {
  return subtotal >= 30 ? 0 : 2.99
}

export function isFreeShip(promo: PromoRow | null): boolean {
  return promo?.type === 'shipping'
}

export function calcDiscount(subtotal: number, promo: PromoRow | null): number {
  if (!promo) return 0
  if (promo.type === 'percent') return round2(subtotal * promo.value / 100)
  if (promo.type === 'fixed')   return Math.min(promo.value, subtotal)
  return 0
}

// Staff/admin auto-apply codes (staff_role set) are intentionally never
// accepted here — this endpoint has no notion of who the caller is, so it
// cannot verify a staff claim. Only plain, customer-enterable codes qualify.
export function validatePromo(promo: PromoRow | null, subtotal: number): { valid: boolean; error?: string } {
  if (!promo)            return { valid: false, error: 'Invalid or expired promo code.' }
  if (promo.staff_role)  return { valid: false, error: 'Invalid or expired promo code.' }
  if (!promo.active)     return { valid: false, error: 'Invalid or expired promo code.' }
  if (subtotal < promo.min_order) {
    return { valid: false, error: `Minimum order of £${promo.min_order.toFixed(2)} required for this code.` }
  }
  return { valid: true }
}

export function calcTotals(
  items: CartItemInput[],
  products: ProductPriceLookup[],
  promo: PromoRow | null,
): PricingResult {
  const subtotal = calcSubtotal(items, products)
  const validPromo = promo && validatePromo(promo, subtotal).valid ? promo : null
  const discount = calcDiscount(subtotal, validPromo)
  const shipping = isFreeShip(validPromo) ? 0 : calcShipping(subtotal)
  const total = Math.max(0, round2(subtotal - discount + shipping))
  return { subtotal, discount, shipping, total }
}
