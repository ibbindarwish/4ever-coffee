import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface PromoCode {
  id: number
  code: string
  label: string
  type: 'percent' | 'fixed' | 'shipping'
  value: number
  minOrder: number
  active: boolean
  staffRole?: 'staff' | 'admin'  // system codes auto-applied by role; not customer-enterable
}

const SEED: PromoCode[] = [
  { id: 1, code: 'WELCOME10', label: '10% welcome discount',          type: 'percent',  value: 10, minOrder: 0,  active: true  },
  { id: 2, code: 'SAVE20',    label: '20% off everything',            type: 'percent',  value: 20, minOrder: 20, active: true  },
  { id: 3, code: 'FREESHIP',  label: 'Free delivery applied',         type: 'shipping', value: 0,  minOrder: 0,  active: true  },
  { id: 4, code: '4EVER15',   label: '15% loyalty reward',            type: 'percent',  value: 15, minOrder: 15, active: true  },
  { id: 5, code: 'SUMMER25',  label: '25% summer special',            type: 'percent',  value: 25, minOrder: 30, active: false },
  { id: 6, code: 'FLAT5',     label: '£5 off your order',             type: 'fixed',    value: 5,  minOrder: 25, active: true  },
  { id: 7, code: 'STAFF15',   label: '15% staff benefit — auto-applied', type: 'percent', value: 15, minOrder: 0, active: true, staffRole: 'staff' },
  { id: 8, code: 'ADMIN50',   label: '50% admin benefit — auto-applied', type: 'percent', value: 50, minOrder: 0, active: true, staffRole: 'admin' },
]

let _nextId = SEED.length + 1

export const usePromoStore = defineStore('promo', () => {
  const codes   = ref<PromoCode[]>(SEED.map(c => ({ ...c })))
  const applied = ref<PromoCode | null>(null)
  const error   = ref('')

  const activeCodes   = computed(() => codes.value.filter(c => c.active))
  const inactiveCodes = computed(() => codes.value.filter(c => !c.active))

  /* ── Staff auto-apply (called on checkout mount when admin auth is present) ── */
  function autoApplyForRole(role: string) {
    if (role === 'Admin') {
      const code = codes.value.find(c => c.staffRole === 'admin' && c.active)
      if (code) { applied.value = code; error.value = '' }
    } else {
      const code = codes.value.find(c => c.staffRole === 'staff' && c.active)
      if (code) { applied.value = code; error.value = '' }
    }
  }

  /* ── Customer-facing ── */
  function apply(inputCode: string, subtotal = 0): boolean {
    error.value = ''
    // Block direct entry of staff-role codes — they are auto-applied only
    const staffCode = codes.value.find(c => c.code === inputCode.trim().toUpperCase() && c.staffRole)
    if (staffCode) {
      error.value = 'Invalid or expired promo code.'
      applied.value = null
      return false
    }
    const found = activeCodes.value.find(c => c.code === inputCode.trim().toUpperCase())
    if (!found) {
      error.value = 'Invalid or expired promo code.'
      applied.value = null
      return false
    }
    if (subtotal < found.minOrder) {
      error.value = `Minimum order of £${found.minOrder.toFixed(2)} required for this code.`
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
    if (applied.value.type === 'fixed')
      return Math.min(applied.value.value, subtotal)
    return 0
  }

  function isFreeShip(): boolean {
    return applied.value?.type === 'shipping'
  }

  function clear() {
    applied.value = null
    error.value   = ''
  }

  /* ── Admin CRUD ── */
  function addCode(draft: Omit<PromoCode, 'id'>): { ok: boolean; msg?: string } {
    const norm = draft.code.trim().toUpperCase()
    if (!norm) return { ok: false, msg: 'Code cannot be empty.' }
    if (codes.value.some(c => c.code === norm))
      return { ok: false, msg: 'A code with that name already exists.' }
    codes.value.push({ ...draft, code: norm, id: _nextId++ })
    return { ok: true }
  }

  function updateCode(id: number, patch: Partial<Omit<PromoCode, 'id'>>): { ok: boolean; msg?: string } {
    const idx = codes.value.findIndex(c => c.id === id)
    if (idx === -1) return { ok: false, msg: 'Code not found.' }
    if (patch.code) {
      const norm = patch.code.trim().toUpperCase()
      if (codes.value.some(c => c.code === norm && c.id !== id))
        return { ok: false, msg: 'A code with that name already exists.' }
      patch.code = norm
    }
    codes.value[idx] = { ...codes.value[idx], ...patch }
    if (applied.value?.id === id) applied.value = { ...codes.value[idx] }
    return { ok: true }
  }

  function deleteCode(id: number) {
    codes.value = codes.value.filter(c => c.id !== id)
    if (applied.value?.id === id) clear()
  }

  function toggleCode(id: number) {
    const c = codes.value.find(c => c.id === id)
    if (c) {
      c.active = !c.active
      if (!c.active && applied.value?.id === id) clear()
    }
  }

  return {
    codes, applied, error,
    activeCodes, inactiveCodes,
    apply, autoApplyForRole, calcDiscount, isFreeShip, clear,
    addCode, updateCode, deleteCode, toggleCode,
  }
})