import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsStore } from './products'

export interface LoyaltyEvent {
  id: string
  date: string
  description: string
  points: number
  orderId?: string
}

const LS_KEY          = 'fc_loyalty'
const LS_COLLECTED_KEY = 'fc_loyalty_collected'
const LS_BADGE_KEY     = 'fc_loyalty_badge'
const POINTS_PER_POUND = 10
const REDEEM_RATE = 500   // 500 pts = £5 off
const REDEEM_VALUE = 5
const COLLECTION_BONUS = 250   // pts awarded once all 4 seasonal items are ordered

function loadEvents(): LoyaltyEvent[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function loadCollected(): number[] {
  try {
    const raw = localStorage.getItem(LS_COLLECTED_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function loadBadgeDate(): string | null {
  return localStorage.getItem(LS_BADGE_KEY)
}

export const useLoyaltyStore = defineStore('loyalty', () => {
  const events = ref<LoyaltyEvent[]>(loadEvents())
  const collectedProductIds = ref<number[]>(loadCollected())
  const collectorBadgeDate  = ref<string | null>(loadBadgeDate())

  // "The 4 Collection" — this season's 4 featured items, tracked via the seasonal flag
  const seasonalItems = computed(() => {
    const products = useProductsStore()
    return products.products.filter(p => p.seasonal).slice(0, 4)
  })
  const collectedSeasonalIds = computed(() =>
    seasonalItems.value.filter(p => collectedProductIds.value.includes(p.id)).map(p => p.id)
  )
  const isCollectionComplete = computed(() =>
    seasonalItems.value.length > 0 && collectedSeasonalIds.value.length === seasonalItems.value.length
  )
  const hasCollectorBadge = computed(() => !!collectorBadgeDate.value)

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

  function earnFromOrder(total: number, orderId: string, productIds: number[] = []) {
    const pts = Math.floor(total * POINTS_PER_POUND)
    const ev: LoyaltyEvent = {
      id:          crypto.randomUUID(),
      date:        new Date().toISOString().split('T')[0],
      description: `Order #${orderId.slice(-6).toUpperCase()}`,
      points:      pts,
      orderId,
    }
    events.value.push(ev)

    const newIds = productIds.filter(id => !collectedProductIds.value.includes(id))
    if (newIds.length) {
      collectedProductIds.value.push(...newIds)
      localStorage.setItem(LS_COLLECTED_KEY, JSON.stringify(collectedProductIds.value))
    }

    if (isCollectionComplete.value && !hasCollectorBadge.value) {
      collectorBadgeDate.value = ev.date
      localStorage.setItem(LS_BADGE_KEY, ev.date)
      events.value.push({
        id:          crypto.randomUUID(),
        date:        ev.date,
        description: '🏅 The 4 Collection complete — 4ever Member bonus',
        points:      COLLECTION_BONUS,
      })
    }

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
    seasonalItems, collectedSeasonalIds, isCollectionComplete, hasCollectorBadge, collectorBadgeDate,
    COLLECTION_BONUS,
  }
})