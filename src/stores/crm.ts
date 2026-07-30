import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

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

interface SubscriberRow {
  id: string; name: string; email: string; tags: EmailTag[]; active: boolean; joined_at: string
}
interface CampaignRow {
  id: string; type: Campaign['type']; subject: string; promo_code: string | null
  recipient_count: number; opens: number; clicks: number; sent_at: string
}

function subscriberFromRow(r: SubscriberRow): Subscriber {
  return { id: r.id, name: r.name, email: r.email, tags: r.tags, active: r.active, joinedAt: r.joined_at.split('T')[0] }
}
function campaignFromRow(r: CampaignRow): Campaign {
  return {
    id: r.id, type: r.type, subject: r.subject, promoCode: r.promo_code ?? undefined,
    recipientCount: r.recipient_count, opens: r.opens, clicks: r.clicks, sentAt: r.sent_at,
  }
}

export const useCrmStore = defineStore('crm', () => {
  const subscribers = ref<Subscriber[]>([])
  const campaigns   = ref<Campaign[]>([])
  const loaded      = ref(false)

  // Staff-only reads (RLS) — silently empty for anonymous storefront visitors,
  // which is fine since they never display this list, only add themselves to it.
  async function fetchSubscribers() {
    const { data, error } = await supabase.from('subscribers').select('*').order('joined_at', { ascending: false })
    if (error) { console.error('[crm] fetchSubscribers failed:', error.message); return }
    subscribers.value = (data as SubscriberRow[]).map(subscriberFromRow)
  }

  async function fetchCampaigns() {
    const { data, error } = await supabase.from('campaigns').select('*').order('sent_at', { ascending: false })
    if (error) { console.error('[crm] fetchCampaigns failed:', error.message); return }
    campaigns.value = (data as CampaignRow[]).map(campaignFromRow)
  }

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

  async function addSubscriber(name: string, email: string, tags: EmailTag[]): Promise<boolean> {
    const { error } = await supabase.from('subscribers').insert({ name, email, tags, active: true })
    if (error) {
      if (error.code !== '23505') console.error('[crm] addSubscriber failed:', error.message)
      return false // duplicate email (23505) or any other failure
    }
    await fetchSubscribers() // no-op for anonymous callers — RLS hides the list from them
    return true
  }

  async function removeSubscriber(id: string) {
    const { error } = await supabase.from('subscribers').delete().eq('id', id)
    if (error) { console.error('[crm] removeSubscriber failed:', error.message); return }
    subscribers.value = subscribers.value.filter(s => s.id !== id)
  }

  async function toggleSubscriber(id: string) {
    const s = subscribers.value.find(s => s.id === id)
    if (!s) return
    const { error } = await supabase.from('subscribers').update({ active: !s.active }).eq('id', id)
    if (error) { console.error('[crm] toggleSubscriber failed:', error.message); return }
    s.active = !s.active
  }

  // Open/click counts remain simulated placeholder engagement numbers — real
  // tracking would need pixel/link-click infrastructure, out of scope here.
  // What's real now is that the campaign history itself persists centrally.
  async function sendCampaign(type: Campaign['type'], subject: string, tags: EmailTag[], promoCode?: string) {
    const pool = tags.length
      ? activeSubscribers.value.filter(s => tags.some(t => s.tags.includes(t)))
      : activeSubscribers.value
    const recipientCount = pool.length
    const opens  = Math.floor(recipientCount * (0.52 + Math.random() * 0.28))
    const clicks = Math.floor(recipientCount * (0.22 + Math.random() * 0.22))

    const { error } = await supabase.from('campaigns').insert({
      type, subject, promo_code: promoCode ?? null, recipient_count: recipientCount, opens, clicks,
    })
    if (error) { console.error('[crm] sendCampaign failed:', error.message); return }
    await fetchCampaigns()
  }

  if (!loaded.value) {
    loaded.value = true
    fetchSubscribers()
    fetchCampaigns()
  }

  return {
    subscribers, campaigns, activeSubscribers,
    totalSubscribers, totalActive, avgOpenRate,
    tagCount, addSubscriber, removeSubscriber, toggleSubscriber, sendCampaign,
    fetchSubscribers, fetchCampaigns,
  }
})
