import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from './products'

export type CupSize = 'small' | 'medium' | 'large'

export const SIZE_LABEL: Record<CupSize, string>  = { small: 'S', medium: 'M', large: 'L' }
export const SIZE_NAME:  Record<CupSize, string>  = { small: 'Small', medium: 'Medium', large: 'Large' }
export const SIZE_PRICE: Record<CupSize, number>  = { small: -0.50, medium: 0, large: 0.50 }

export interface CartItem { product: MenuItem; qty: number; size: CupSize }

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const count    = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + (i.product.price + SIZE_PRICE[i.size]) * i.qty, 0))
  const shipping = computed(() => subtotal.value >= 30 ? 0 : 2.99)
  const total    = computed(() => subtotal.value + shipping.value)

  function addToCart(product: MenuItem, size: CupSize = 'medium') {
    const existing = items.value.find(i => i.product.id === product.id && i.size === size)
    if (existing) existing.qty++
    else items.value.push({ product, qty: 1, size })
  }

  function removeFromCart(id: number, size: CupSize) {
    items.value = items.value.filter(i => !(i.product.id === id && i.size === size))
  }

  function setQty(id: number, size: CupSize, qty: number) {
    const item = items.value.find(i => i.product.id === id && i.size === size)
    if (item) {
      if (qty <= 0) removeFromCart(id, size)
      else item.qty = qty
    }
  }

  function effectivePrice(item: CartItem) {
    return item.product.price + SIZE_PRICE[item.size]
  }

  function clearCart() { items.value = [] }

  return { items, count, subtotal, shipping, total, addToCart, removeFromCart, setQty, effectivePrice, clearCart }
})