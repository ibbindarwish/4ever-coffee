import { describe, it, expect } from 'vitest'
import { calcSubtotal, calcShipping, calcDiscount, isFreeShip, validatePromo, calcTotals, type ProductPriceLookup, type PromoRow } from './pricing'

const products: ProductPriceLookup[] = [
  { id: 1, price: 3.50 }, // Espresso
  { id: 2, price: 4.50 }, // Cappuccino
]

function promo(overrides: Partial<PromoRow> = {}): PromoRow {
  return {
    code: 'TESTCODE', type: 'percent', value: 10, min_order: 0, active: true, staff_role: null,
    ...overrides,
  }
}

describe('calcSubtotal', () => {
  it('sums price * qty for medium size (no offset)', () => {
    expect(calcSubtotal([{ productId: 1, size: 'medium', qty: 2 }], products)).toBe(7.00)
  })

  it('applies small/large size offsets', () => {
    expect(calcSubtotal([{ productId: 1, size: 'small', qty: 1 }], products)).toBeCloseTo(3.00)
    expect(calcSubtotal([{ productId: 1, size: 'large', qty: 1 }], products)).toBeCloseTo(4.00)
  })

  it('sums multiple distinct line items', () => {
    const total = calcSubtotal(
      [{ productId: 1, size: 'medium', qty: 1 }, { productId: 2, size: 'medium', qty: 2 }],
      products,
    )
    expect(total).toBeCloseTo(3.50 + 4.50 * 2)
  })

  it('throws on an unknown product id — never silently prices at zero', () => {
    expect(() => calcSubtotal([{ productId: 999, size: 'medium', qty: 1 }], products)).toThrow()
  })

  it('throws on a non-positive quantity', () => {
    expect(() => calcSubtotal([{ productId: 1, size: 'medium', qty: 0 }], products)).toThrow()
  })
})

describe('calcShipping', () => {
  it('is free at or above £30', () => {
    expect(calcShipping(30)).toBe(0)
    expect(calcShipping(35)).toBe(0)
  })

  it('charges £2.99 below £30', () => {
    expect(calcShipping(29.99)).toBe(2.99)
    expect(calcShipping(0)).toBe(2.99)
  })
})

describe('validatePromo', () => {
  it('rejects a null promo (code not found)', () => {
    expect(validatePromo(null, 50).valid).toBe(false)
  })

  it('rejects an inactive code', () => {
    expect(validatePromo(promo({ active: false }), 50).valid).toBe(false)
  })

  it('rejects a staff/admin auto-apply code from arbitrary client input', () => {
    expect(validatePromo(promo({ staff_role: 'staff' }), 50).valid).toBe(false)
    expect(validatePromo(promo({ staff_role: 'admin' }), 50).valid).toBe(false)
  })

  it('rejects when subtotal is below min_order', () => {
    const result = validatePromo(promo({ min_order: 20 }), 10)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/minimum order/i)
  })

  it('accepts a valid, active, non-staff code meeting min_order', () => {
    expect(validatePromo(promo({ min_order: 10 }), 10).valid).toBe(true)
  })
})

describe('calcDiscount', () => {
  it('computes a percent discount', () => {
    expect(calcDiscount(100, promo({ type: 'percent', value: 15 }))).toBe(15)
  })

  it('computes a fixed discount', () => {
    expect(calcDiscount(100, promo({ type: 'fixed', value: 5 }))).toBe(5)
  })

  it('caps a fixed discount at the subtotal — never goes negative', () => {
    expect(calcDiscount(3, promo({ type: 'fixed', value: 5 }))).toBe(3)
  })

  it('is zero for a shipping-type promo (handled separately) or no promo', () => {
    expect(calcDiscount(100, promo({ type: 'shipping', value: 0 }))).toBe(0)
    expect(calcDiscount(100, null)).toBe(0)
  })
})

describe('isFreeShip', () => {
  it('is true only for shipping-type promos', () => {
    expect(isFreeShip(promo({ type: 'shipping' }))).toBe(true)
    expect(isFreeShip(promo({ type: 'percent' }))).toBe(false)
    expect(isFreeShip(null)).toBe(false)
  })
})

describe('calcTotals', () => {
  it('applies a valid percent promo end-to-end', () => {
    const result = calcTotals(
      [{ productId: 2, size: 'medium', qty: 1 }], // £4.50
      products,
      promo({ type: 'percent', value: 20, min_order: 0 }),
    )
    expect(result.subtotal).toBeCloseTo(4.50)
    expect(result.discount).toBeCloseTo(0.90)
    expect(result.shipping).toBe(2.99) // below £30 free-shipping threshold
    expect(result.total).toBeCloseTo(4.50 - 0.90 + 2.99)
  })

  it('silently ignores an invalid promo instead of erroring the whole order', () => {
    const result = calcTotals(
      [{ productId: 2, size: 'medium', qty: 1 }],
      products,
      promo({ staff_role: 'admin' }), // never valid from client input
    )
    expect(result.discount).toBe(0)
  })

  it('never produces a negative total', () => {
    const result = calcTotals(
      [{ productId: 1, size: 'medium', qty: 1 }], // £3.50
      products,
      promo({ type: 'fixed', value: 999, min_order: 0 }),
    )
    expect(result.total).toBeGreaterThanOrEqual(0)
  })

  it('applies free shipping for a shipping-type promo', () => {
    const result = calcTotals(
      [{ productId: 1, size: 'medium', qty: 1 }],
      products,
      promo({ type: 'shipping', value: 0, min_order: 0 }),
    )
    expect(result.shipping).toBe(0)
  })
})
