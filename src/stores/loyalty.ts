import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LoyaltyEvent {
  id: string
  date: string
  description: string
  points: number
  orderId?: string
}

const LS_KEY = 'fc_loyalty'
const POINTS_PER_POUND = 10
const REDEEM_RATE = 500   // 500 pts = £5 off
const REDEEM_VALUE = 5

function loadEvents(): LoyaltyEvent[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

export const useLoyaltyStore = defineStore('loyalty', () => {
  const events = ref<LoyaltyEvent[]>(loadEvents())

  const balance = computed(() => events.value.reduce((s, e) => s + e.points, 0))
  const tier = computed(() => {
    const b = balance.value
    if (b >= 5000) return { name: 'Gold',     color: '#d4a060', min: 5000 }
    if (b >= 1500) return { name: 'Silver',   color: '#9ca3af', min: 1500 }
    return              { name: 'Bronze',    color: '#c8813a', min: 0    }
  })
  const nextTier = computed(() => {
    const b = balance.value
    if (b >= 5000) return null
    if (b >= 1500) return { name: 'Gold',   need: 5000 - b }
    return              { name: 'Silver', need: 1500 - b }
  })
  const canRedeem = computed(() => balance.value >= REDEEM_RATE)

  function earnFromOrder(total: number, orderId: string) {
    const pts = Math.floor(total * POINTS_PER_POUND)
    const ev: LoyaltyEvent = {
      id:          crypto.randomUUID(),
      date:        new Date().toISOString().split('T')[0],
      description: `Order #${orderId.slice(-6).toUpperCase()}`,
      points:      pts,
      orderId,
    }
    events.value.push(ev)
    persist()
  }

  function redeem() {
    if (!canRedeem.value) return 0
    const ev: LoyaltyEvent = {
      id:          crypto.randomUUID(),
      date:        new Date().toISOString().split('T')[0],
      description: `Redeemed £${REDEEM_VALUE} reward`,
      points:      -REDEEM_RATE,
    }
    events.value.push(ev)
    persist()
    return REDEEM_VALUE
  }

  function persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(events.value))
  }

  return {
    events, balance, tier, nextTier, canRedeem,
    earnFromOrder, redeem,
    POINTS_PER_POUND, REDEEM_RATE, REDEEM_VALUE,
  }
})