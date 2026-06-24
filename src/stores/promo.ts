import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PromoCode {
  code: string
  label: string
  type: 'percent' | 'shipping'
  value: number
}

const VALID: PromoCode[] = [
  { code: 'WELCOME10', label: '10% welcome discount',    type: 'percent',  value: 10 },
  { code: 'SAVE20',    label: '20% off everything',      type: 'percent',  value: 20 },
  { code: 'FREESHIP',  label: 'Free delivery applied',   type: 'shipping', value: 0  },
  { code: '4EVER15',   label: '15% loyalty reward',      type: 'percent',  value: 15 },
  { code: 'SUMMER25',  label: '25% summer special',      type: 'percent',  value: 25 },
]

export const usePromoStore = defineStore('promo', () => {
  const applied = ref<PromoCode | null>(null)
  const error   = ref('')

  function apply(code: string): boolean {
    error.value = ''
    const found = VALID.find(c => c.code === code.trim().toUpperCase())
    if (!found) {
      error.value = 'Invalid code. Try WELCOME10 or FREESHIP.'
      applied.value = null
      return false
    }
    applied.value = found
    return true
  }

  function calcDiscount(subtotal: number): number {
    if (!applied.value) return 0
    if (applied.value.type === 'percent')
      return +(subtotal * applied.value.value / 100).toFixed(2)
    return 0
  }

  function isFreeShip(): boolean {
    return applied.value?.type === 'shipping'
  }

  function clear() {
    applied.value = null
    error.value   = ''
  }

  return { applied, error, apply, calcDiscount, isFreeShip, clear }
})