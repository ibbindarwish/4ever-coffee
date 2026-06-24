import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from './products'

export interface CartItem { product: MenuItem; qty: number }

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.product.price * i.qty, 0))
  const shipping = computed(() => subtotal.value >= 30 ? 0 : 2.99)
  const total = computed(() => subtotal.value + shipping.value)

  function addToCart(product: MenuItem) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) existing.qty++
    else items.value.push({ product, qty: 1 })
  }

  function removeFromCart(id: number) {
    items.value = items.value.filter(i => i.product.id !== id)
  }

  function setQty(id: number, qty: number) {
    const item = items.value.find(i => i.product.id === id)
    if (item) {
      if (qty <= 0) removeFromCart(id)
      else item.qty = qty
    }
  }

  function clearCart() {
    items.value = []
  }

  return { items, count, subtotal, shipping, total, addToCart, removeFromCart, setQty, clearCart }
})
