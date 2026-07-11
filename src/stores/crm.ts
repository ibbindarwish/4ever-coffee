import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type EmailTag = 'reviews' | 'roastery' | 'deals' | 'discounts'

export interface Subscriber {
  id: string
  name: string
  email: string
  joinedAt: string
  tags: EmailTag[]
  active: boolean
}

export interface Campaign {
  id: string
  type: 'customer-review' | 'roastery-update' | 'new-deals' | 'discount'
  subject: string
  sentAt: string
  recipientCount: number
  opens: number
  clicks: number
  promoCode?: string
}

const SEED_SUBSCRIBERS: Subscriber[] = [
  { id: 's1',  name: 'Sarah Mitchell',    email: 'sarah.m@gmail.com',    joinedAt: '2026-05-10', tags: ['reviews', 'deals', 'discounts'],              active: true  },
  { id: 's2',  name: 'James Thornton',    email: 'james.t@outlook.com',  joinedAt: '2026-05-15', tags: ['roastery', 'deals'],                          active: true  },
  { id: 's3',  name: 'Nour Al-Hassan',   email: 'nour.h@gmail.com',     joinedAt: '2026-05-20', tags: ['reviews', 'roastery', 'deals', 'discounts'],   active: true  },
  { id: 's4',  name: 'Tom Bradley',       email: 'tom.b@hotmail.com',    joinedAt: '2026-05-25', tags: ['discounts'],                                  active: true  },
  { id: 's5',  name: 'Layla Hassan',      email: 'layla.h@gmail.com',    joinedAt: '2026-06-01', tags: ['reviews', 'roastery'],                        active: true  },
  { id: 's6',  name: 'Ahmed Said',        email: 'ahmed.s@gmail.com',    joinedAt: '2026-06-05', tags: ['deals', 'discounts'],                         active: true  },
  { id: 's7',  name: 'Priya Nair',        email: 'priya.n@yahoo.com',    joinedAt: '2026-06-10', tags: ['reviews', 'deals'],                           active: true  },
  { id: 's8',  name: 'Carlos Reyes',      email: 'carlos.r@gmail.com',   joinedAt: '2026-06-15', tags: ['roastery', 'discounts'],                      active: true  },
  { id: 's9',  name: 'Emma Watson',       email: 'emma.w@example.com',   joinedAt: '2026-06-20', tags: ['reviews', 'deals', 'discounts'],              active: false },
  { id: 's10', name: 'David Chen',        email: 'david.c@gmail.com',    joinedAt: '2026-06-25', tags: ['roastery', 'deals'],                          active: true  },
  { id: 's11', name: 'Fatima Al-Zahraa', email: 'fatima.z@outlook.com', joinedAt: '2026-07-01', tags: ['reviews', 'roastery', 'discounts'],           active: true  },
  { id: 's12', name: 'Oliver Smith',      email: 'oliver.s@gmail.com',   joinedAt: '2026-07-05', tags: ['deals', 'discounts'],                         active: true  },
  { id: 's13', name: 'Aisha Rahman',      email: 'aisha.r@gmail.com',    joinedAt: '2026-07-07', tags: ['reviews', 'roastery', 'deals', 'discounts'],  active: true  },
  { id: 's14', name: 'Luke Harrison',     email: 'luke.h@icloud.com',    joinedAt: '2026-07-09', tags: ['deals', 'roastery'],                          active: true  },
]

const SEED_CAMPAIGNS: Campaign[] = [
  { id: 'c1', type: 'discount',        subject: '☕ 20% Off This Weekend — Exclusively For You',         sentAt: '2026-06-15T10:00:00', recipientCount: 10, opens: 7, clicks: 4, promoCode: 'SAVE20'   },
  { id: 'c2', type: 'roastery-update', subject: '🌍 New Ethiopian Lot Just Arrived at the Roastery',     sentAt: '2026-06-22T09:00:00', recipientCount: 8,  opens: 6, clicks: 3                        },
  { id: 'c3', type: 'customer-review', subject: '⭐ Our Customers Love Us — See What They\'re Saying',   sentAt: '2026-07-01T11:00:00', recipientCount: 12, opens: 9, clicks: 5                        },
  { id: 'c4', type: 'new-deals',       subject: '🆕 New Summer Menu Just Dropped',                       sentAt: '2026-07-08T10:00:00', recipientCount: 11, opens: 8, clicks: 6                        },
]

const LS_KEY = '4ever_crm'

function loadSaved() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as { subscribers: Subscriber[]; campaigns: Campaign[] }
  } catch { /* ignore */ }
  return null
}

export const useCrmStore = defineStore('crm', () => {
  const saved = loadSaved()
  const subscribers = ref<Subscriber[]>(saved?.subscribers ?? [...SEED_SUBSCRIBERS])
  const campaigns   = ref<Campaign[]>(saved?.campaigns   ?? [...SEED_CAMPAIGNS])

  const activeSubscribers = computed(() => subscribers.value.filter(s => s.active))
  const totalSubscribers  = computed(() => subscribers.value.length)
  const totalActive       = computed(() => activeSubscribers.value.length)
  const avgOpenRate       = computed(() => {
    if (!campaigns.value.length) return 0
    const sum = campaigns.value.reduce((acc, c) => acc + (c.recipientCount ? c.opens / c.recipientCount : 0), 0)
    return Math.round((sum / campaigns.value.length) * 100)
  })

  function tagCount(tag: EmailTag): number {
    return activeSubscribers.value.filter(s => s.tags.includes(tag)).length
  }

  function addSubscriber(name: string, email: string, tags: EmailTag[]): boolean {
    if (subscribers.value.some(s => s.email.toLowerCase() === email.toLowerCase())) return false
    subscribers.value.push({
      id: crypto.randomUUID(), name, email, tags,
      joinedAt: new Date().toISOString().split('T')[0],
      active: true,
    })
    persist()
    return true
  }

  function removeSubscriber(id: string) {
    subscribers.value = subscribers.value.filter(s => s.id !== id)
    persist()
  }

  function toggleSubscriber(id: string) {
    const s = subscribers.value.find(s => s.id === id)
    if (s) { s.active = !s.active; persist() }
  }

  function sendCampaign(type: Campaign['type'], subject: string, tags: EmailTag[], promoCode?: string) {
    const pool = tags.length
      ? activeSubscribers.value.filter(s => tags.some(t => s.tags.includes(t)))
      : activeSubscribers.value
    const recipientCount = pool.length
    campaigns.value.unshift({
      id: crypto.randomUUID(), type, subject, promoCode,
      sentAt: new Date().toISOString(),
      recipientCount,
      opens:  Math.floor(recipientCount * (0.52 + Math.random() * 0.28)),
      clicks: Math.floor(recipientCount * (0.22 + Math.random() * 0.22)),
    })
    persist()
  }

  function persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ subscribers: subscribers.value, campaigns: campaigns.value })) } catch { /* ignore */ }
  }

  return {
    subscribers, campaigns, activeSubscribers,
    totalSubscribers, totalActive, avgOpenRate,
    tagCount, addSubscriber, removeSubscriber, toggleSubscriber, sendCampaign,
  }
})