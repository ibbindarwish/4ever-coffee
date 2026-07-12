<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCrmStore, type EmailTag } from '../../stores/crm'
import { useReviewsStore } from '../../stores/reviews'
import { useProductsStore } from '../../stores/products'
import { usePromoStore } from '../../stores/promo'

const crm     = useCrmStore()
const reviews = useReviewsStore()
const products = useProductsStore()
const promo   = usePromoStore()

type Tab = 'subscribers' | 'compose' | 'campaigns' | 'templates'
const tab = ref<Tab>('subscribers')

// ── Subscribers ──────────────────────────────────────────────
const search    = ref('')
const filterTag = ref('')
const showAdd   = ref(false)
const addName   = ref('')
const addEmail  = ref('')
const addTags   = ref<EmailTag[]>(['deals'])
const addError  = ref('')
const addOk     = ref(false)

const filteredSubs = computed(() => {
  let list = [...crm.subscribers]
  if (search.value)    list = list.filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()) || s.email.toLowerCase().includes(search.value.toLowerCase()))
  if (filterTag.value) list = list.filter(s => s.tags.includes(filterTag.value as EmailTag))
  return list
})

function toggleAddTag(t: EmailTag) {
  const i = addTags.value.indexOf(t)
  if (i === -1) addTags.value.push(t)
  else addTags.value.splice(i, 1)
}

function submitAdd() {
  addError.value = ''
  if (!addName.value.trim() || !addEmail.value.trim()) { addError.value = 'Name and email are required.'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addEmail.value)) { addError.value = 'Enter a valid email address.'; return }
  const ok = crm.addSubscriber(addName.value.trim(), addEmail.value.trim(), addTags.value.length ? [...addTags.value] : ['deals'])
  if (!ok) { addError.value = 'This email is already subscribed.'; return }
  addOk.value = true
  setTimeout(() => { showAdd.value = false; addOk.value = false; addName.value = ''; addEmail.value = ''; addTags.value = ['deals'] }, 1600)
}

// ── Compose ───────────────────────────────────────────────────
type CampaignType = 'customer-review' | 'roastery-update' | 'new-deals' | 'discount'
const composeType    = ref<CampaignType>('customer-review')
const composeSubject = ref('')
const composeTags    = ref<EmailTag[]>([])
const composeSent    = ref(false)
const composeSending = ref(false)
const composeError   = ref('')
const composePartial = ref('')
const showPreview    = ref(false)

// ── Email service status check ──────────────────────────────
interface EmailStatus { ok: boolean; configured: boolean; message: string; fromWarning?: string | null }
const emailStatus        = ref<EmailStatus | null>(null)
const checkingEmailStatus = ref(false)

async function checkEmailStatus() {
  checkingEmailStatus.value = true
  emailStatus.value = null
  try {
    const res  = await fetch('/api/email-status')
    emailStatus.value = await res.json()
  } catch {
    emailStatus.value = { ok: false, configured: false, message: 'Could not reach the email service — check your connection and try again.' }
  } finally {
    checkingEmailStatus.value = false
  }
}

const DEFAULT_SUBJECTS: Record<CampaignType, string> = {
  'customer-review': '⭐ See What Our Coffee Lovers Are Saying About 4ever',
  'roastery-update': '🌍 Fresh From The Roastery — New Origins Have Arrived',
  'new-deals':       '🆕 Exciting New Arrivals Just Landed in Our Menu',
  'discount':        '🎁 An Exclusive Deal Just For You — This Week Only',
}

watch(composeType, (t) => { composeSubject.value = DEFAULT_SUBJECTS[t] }, { immediate: true })

const recipientPreview = computed(() => {
  const pool = composeTags.value.length
    ? crm.activeSubscribers.filter(s => composeTags.value.some(t => s.tags.includes(t)))
    : crm.activeSubscribers
  return pool.length
})

async function sendCampaign() {
  const subject = composeSubject.value.trim() || DEFAULT_SUBJECTS[composeType.value]
  const code = composeType.value === 'discount'
    ? promo.activeCodes.filter(c => !c.staffRole)[0]?.code
    : undefined

  const pool = composeTags.value.length
    ? crm.activeSubscribers.filter(s => composeTags.value.some(t => s.tags.includes(t)))
    : crm.activeSubscribers

  if (pool.length === 0) {
    composeError.value = 'No subscribers match this audience.'
    return
  }

  composeSending.value = true
  composeError.value   = ''
  composePartial.value = ''
  showPreview.value = false

  // The API caps each call at 10 sends to stay inside the serverless timeout,
  // so we chunk the full audience into multiple calls rather than silently
  // dropping everyone past the first 10.
  const CHUNK_SIZE = 10
  const chunks: (typeof pool)[] = []
  for (let i = 0; i < pool.length; i += CHUNK_SIZE) chunks.push(pool.slice(i, i + CHUNK_SIZE))

  let totalSent = 0
  let totalFailed = 0
  let firstError = ''

  try {
    for (const chunk of chunks) {
      const res = await fetch('/api/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: composeType.value,
          subject,
          recipients: chunk.map(s => ({ email: s.email, name: s.name })),
          promoCode: code,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || data.error) {
        firstError = firstError || data.error || `Email service returned an error (HTTP ${res.status}).`
        totalFailed += chunk.length
      } else if (data.note && !data.sent) {
        // API responded 200 but didn't actually send anything (e.g. RESEND_API_KEY not configured)
        firstError = firstError || data.note
        totalFailed += chunk.length
      } else {
        // data.sent may be a partial count even when a note is also present (e.g. a
        // direct API call exceeding the per-call cap) — count what actually sent
        if (data.note) firstError = firstError || data.note
        totalSent   += data.sent   ?? 0
        totalFailed += data.failed ?? 0
      }
    }

    if (totalSent === 0) {
      composeError.value = firstError || 'No emails were sent.'
    } else {
      crm.sendCampaign(composeType.value, subject, [...composeTags.value], code)
      composeSent.value = true
      if (totalFailed > 0) {
        composePartial.value = `${totalFailed} of ${pool.length} subscribers couldn't be reached${firstError ? ` (${firstError})` : ''}.`
      }
      setTimeout(() => { composeSent.value = false; composePartial.value = ''; composeTags.value = [] }, 4500)
    }
  } catch (err: any) {
    composeError.value = 'Could not reach the email service — check your connection and try again.'
  } finally {
    composeSending.value = false
  }
}

// ── Email template generators ─────────────────────────────────
function brandHeader(subtitle: string, headline: string, subline: string) {
  return `<div style="background:linear-gradient(135deg,#2c1008 0%,#4a1e0a 100%);padding:48px 40px 40px;text-align:center;">
    <div style="font-family:Georgia,serif;font-size:38px;font-weight:900;color:#fdf6ec;letter-spacing:-1.5px;line-height:1;">4<span style="color:#d4a060;">ever</span></div>
    <div style="font-size:10px;letter-spacing:.18em;color:#78716c;margin:3px 0 0;text-transform:uppercase;">Coffee Roastery</div>
    <div style="height:1px;background:rgba(212,160,96,.25);margin:24px auto;max-width:200px;"></div>
    <div style="font-size:11px;letter-spacing:.14em;color:#d4a060;text-transform:uppercase;font-weight:700;margin-bottom:10px;">${subtitle}</div>
    <div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fdf6ec;line-height:1.3;">${headline}</div>
    <div style="font-size:13px;color:#a8a29e;margin-top:10px;">${subline}</div>
  </div>`
}

function emailFooter() {
  return `<div style="background:#faf7f2;padding:32px 40px;text-align:center;border-top:1px solid #ede8e0;">
    <div style="font-size:11px;color:#a8a29e;line-height:1.8;">
      You're receiving this because you subscribed at <strong style="color:#78716c;">4ever Coffee</strong>.<br>
      <a href="#" style="color:#c8813a;text-decoration:none;font-weight:600;">Unsubscribe</a> &nbsp;·&nbsp;
      <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Visit Shop</a> &nbsp;·&nbsp;
      <a href="#" style="color:#c8813a;text-decoration:none;font-weight:600;">Privacy Policy</a>
    </div>
    <div style="margin-top:16px;font-size:10px;color:#c0bab4;">© 2026 4ever Coffee. All rights reserved.</div>
  </div>`
}

function reviewEmailHtml() {
  const top = [...reviews.reviews].sort((a, b) => b.rating - a.rating || b.helpful - a.helpful).slice(0, 3)
  const cards = top.map(r => `
    <div style="padding:24px 0;border-bottom:1px solid #f0ece6;">
      <div style="font-size:20px;color:#d4a060;margin-bottom:10px;line-height:1;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p style="font-size:15px;color:#292524;line-height:1.8;margin:0 0 14px;font-style:italic;">"${r.comment}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#c8813a,#d4a060);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;">${r.author[0]}</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:#1c1917;">${r.author}</div>
          <div style="font-size:11px;color:#a8a29e;">${r.date} &nbsp;·&nbsp; ${r.helpful} found helpful</div>
        </div>
      </div>
    </div>`).join('')
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.1);">
    ${brandHeader('Customer Reviews', 'What Our Coffee Lovers Are Saying', 'Real experiences from our community of 2,400+ subscribers')}
    <div style="padding:8px 40px 24px;">${cards}</div>
    <div style="padding:36px 40px;text-align:center;background:#fff;">
      <p style="font-size:15px;color:#44403c;margin:0 0 20px;line-height:1.7;">Love our coffee? Share your experience and earn <strong style="color:#c8813a;">50 loyalty points</strong> for your very first review!</p>
      <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 44px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:-.3px;">Shop & Leave a Review →</a>
    </div>
    ${emailFooter()}
  </div>`
}

function roasteryEmailHtml() {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.1);">
    ${brandHeader("Roastery Update", 'Fresh From The Roastery', 'New origins. New stories. New flavours.')}
    <div style="padding:36px 40px;">
      <div style="background:#faf7f2;border-radius:14px;padding:28px;margin-bottom:24px;border:1px solid #ede8e0;">
        <div style="display:flex;align-items:flex-start;gap:16px;">
          <div style="font-size:48px;flex-shrink:0;">🇪🇹</div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">Now Roasting</div>
            <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#1c1917;margin-bottom:4px;">Ethiopian Yirgacheffe</div>
            <div style="font-size:12px;color:#78716c;margin-bottom:14px;">Gedeo Zone, Southern Ethiopia · Altitude: 1,750–2,200m</div>
            <div style="font-size:14px;color:#44403c;line-height:1.75;margin-bottom:16px;">This washed lot from the Yirgacheffe region delivers a vibrant and complex cup — expect bright citrus acidity, jasmine florals, and a clean, tea-like finish that defines why Ethiopia remains the birthplace of coffee.</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <span style="background:#fff;border:1px solid #ede8e0;border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;color:#78716c;">🍋 Citrus</span>
              <span style="background:#fff;border:1px solid #ede8e0;border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;color:#78716c;">🌸 Jasmine</span>
              <span style="background:#fff;border:1px solid #ede8e0;border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;color:#78716c;">🍵 Black Tea</span>
              <span style="background:#fff;border:1px solid #ede8e0;border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;color:#78716c;">🍇 Stone Fruit</span>
            </div>
          </div>
        </div>
      </div>
      <div style="background:#1c1008;border-radius:14px;padding:24px 28px;margin-bottom:24px;">
        <div style="font-size:12px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Roaster's Notes</div>
        <p style="font-size:14px;color:#e7e0d8;line-height:1.8;margin:0;font-style:italic;">"This lot roasted beautifully at a medium light profile. We let the natural sugars develop slowly over 9 minutes to preserve the delicate florals. Pull it as a pour-over at 92°C for the full experience."</p>
        <div style="margin-top:12px;font-size:12px;color:#78716c;font-weight:600;">— James, Head Roaster at 4ever Coffee</div>
      </div>
      <div style="display:flex;gap:12px;">
        <div style="flex:1;background:#faf7f2;border-radius:12px;padding:18px;text-align:center;border:1px solid #ede8e0;">
          <div style="font-size:22px;font-weight:900;color:#c8813a;font-family:Georgia,serif;">94.2°</div>
          <div style="font-size:11px;color:#78716c;font-weight:600;margin-top:4px;">Charge Temp</div>
        </div>
        <div style="flex:1;background:#faf7f2;border-radius:12px;padding:18px;text-align:center;border:1px solid #ede8e0;">
          <div style="font-size:22px;font-weight:900;color:#c8813a;font-family:Georgia,serif;">9:14</div>
          <div style="font-size:11px;color:#78716c;font-weight:600;margin-top:4px;">Roast Time</div>
        </div>
        <div style="flex:1;background:#faf7f2;border-radius:12px;padding:18px;text-align:center;border:1px solid #ede8e0;">
          <div style="font-size:22px;font-weight:900;color:#c8813a;font-family:Georgia,serif;">3.2kg</div>
          <div style="font-size:11px;color:#78716c;font-weight:600;margin-top:4px;">Available</div>
        </div>
      </div>
    </div>
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://4ever-roastery.vercel.app/shop/roastery" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 44px;border-radius:12px;font-weight:700;font-size:15px;">Explore the Roastery →</a>
    </div>
    ${emailFooter()}
  </div>`
}

function dealsEmailHtml() {
  const items = products.products.filter(p => p.featured || p.isNew).slice(0, 4)
  const cards = items.map(p => `
    <div style="flex:1;min-width:220px;background:#faf7f2;border-radius:14px;overflow:hidden;border:1px solid #ede8e0;">
      <img src="${p.image}" alt="${p.name}" style="width:100%;height:150px;object-fit:cover;display:block;" />
      <div style="padding:16px;">
        ${p.isNew ? '<span style="font-size:10px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.1em;">New ✦</span>' : ''}
        <div style="font-size:16px;font-weight:700;color:#1c1917;margin:4px 0 6px;font-family:Georgia,serif;">${p.name}</div>
        <div style="font-size:12px;color:#78716c;line-height:1.6;margin-bottom:12px;">${p.description.slice(0, 80)}…</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <span style="font-size:18px;font-weight:900;color:#c8813a;">£${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span style="font-size:13px;color:#a8a29e;text-decoration:line-through;margin-left:6px;">£${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div style="font-size:12px;color:#78716c;">⭐ ${p.rating}</div>
        </div>
      </div>
    </div>`).join('')
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.1);">
    ${brandHeader("New Arrivals", 'What\'s New at 4ever Coffee', 'Freshly added to our menu — discover your next favourite')}
    <div style="padding:32px 28px;">
      <div style="display:flex;gap:16px;flex-wrap:wrap;">${cards}</div>
    </div>
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 44px;border-radius:12px;font-weight:700;font-size:15px;">Browse Full Menu →</a>
    </div>
    ${emailFooter()}
  </div>`
}

function discountEmailHtml() {
  const codes = promo.activeCodes.filter(c => !c.staffRole).slice(0, 2)
  const codeCards = codes.map(c => `
    <div style="background:linear-gradient(135deg,#2c1008,#4a1e0a);border-radius:16px;padding:28px;margin-bottom:16px;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(212,160,96,.08);border-radius:50%;"></div>
      <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px;">${c.label}</div>
      <div style="font-size:36px;font-weight:900;color:#fdf6ec;letter-spacing:.06em;font-family:Georgia,serif;margin-bottom:12px;">${c.code}</div>
      <div style="display:inline-block;background:rgba(212,160,96,.15);border:1px dashed rgba(212,160,96,.4);border-radius:8px;padding:8px 20px;font-size:14px;color:#d4a060;font-weight:700;margin-bottom:16px;">
        ${c.type === 'percent' ? `${c.value}% OFF` : c.type === 'fixed' ? `£${c.value} OFF` : 'FREE DELIVERY'}
      </div>
      ${c.minOrder > 0 ? `<div style="font-size:12px;color:#78716c;">Minimum order: £${c.minOrder.toFixed(2)}</div>` : '<div style="font-size:12px;color:#78716c;">No minimum order required</div>'}
    </div>`).join('')
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.1);">
    ${brandHeader("Exclusive Offer", 'A Special Deal Just For You', 'Subscriber-only discounts — valid this week only')}
    <div style="padding:36px 32px;">
      <p style="font-size:15px;color:#44403c;line-height:1.75;margin:0 0 24px;text-align:center;">As one of our valued subscribers, we're sharing these exclusive discount codes. Apply at checkout and enjoy your favourite coffee for less.</p>
      ${codeCards}
      <div style="background:#fef9f0;border:1px solid #ede8e0;border-radius:12px;padding:16px 20px;margin-top:8px;">
        <div style="font-size:12px;color:#78716c;line-height:1.8;"><strong style="color:#44403c;">How to use:</strong> Add items to your cart → proceed to checkout → enter the promo code in the discount field → savings applied instantly.</div>
      </div>
    </div>
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 44px;border-radius:12px;font-weight:700;font-size:15px;">Claim Your Discount →</a>
      <div style="margin-top:14px;font-size:12px;color:#a8a29e;">Offer expires 7 days from receipt. One code per order.</div>
    </div>
    ${emailFooter()}
  </div>`
}

const previewHtml = computed(() => {
  if (composeType.value === 'customer-review') return reviewEmailHtml()
  if (composeType.value === 'roastery-update') return roasteryEmailHtml()
  if (composeType.value === 'new-deals')       return dealsEmailHtml()
  return discountEmailHtml()
})

// ── Campaigns helpers ─────────────────────────────────────────
const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  'customer-review': { icon: '⭐', label: 'Customer Reviews', color: '#d97706' },
  'roastery-update': { icon: '🌍', label: 'Roastery Update',  color: '#059669' },
  'new-deals':       { icon: '🆕', label: 'New Deals',        color: '#7c3aed' },
  'discount':        { icon: '🏷', label: 'Discount',         color: '#dc2626' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function openRate(c: { opens: number; recipientCount: number }) {
  if (!c.recipientCount) return 0
  return Math.round((c.opens / c.recipientCount) * 100)
}

const TAG_LABELS: Record<EmailTag, string> = {
  reviews:   'Reviews',
  roastery:  'Roastery',
  deals:     'New Deals',
  discounts: 'Discounts',
}
const TAG_COLORS: Record<EmailTag, string> = {
  reviews:   '#d97706',
  roastery:  '#059669',
  deals:     '#7c3aed',
  discounts: '#dc2626',
}
const ALL_TAGS: EmailTag[] = ['reviews', 'roastery', 'deals', 'discounts']
</script>

<template>
  <div class="crm-page">
    <!-- Header -->
    <div class="crm-header">
      <div class="crm-title-block">
        <h1 class="crm-title">CRM &amp; Email Marketing</h1>
        <p class="crm-sub">Manage subscribers, send campaigns and track engagement</p>
      </div>
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-val">{{ crm.totalSubscribers }}</div>
          <div class="stat-label">Total Subscribers</div>
        </div>
        <div class="stat-card accent">
          <div class="stat-val">{{ crm.totalActive }}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ crm.campaigns.length }}</div>
          <div class="stat-label">Campaigns Sent</div>
        </div>
        <div class="stat-card green">
          <div class="stat-val">{{ crm.avgOpenRate }}%</div>
          <div class="stat-label">Avg Open Rate</div>
        </div>
      </div>
    </div>

    <!-- Segment stats -->
    <div class="segment-row">
      <div v-for="t in ALL_TAGS" :key="t" class="segment-chip">
        <span class="seg-dot" :style="{ background: TAG_COLORS[t] }"></span>
        <span class="seg-label">{{ TAG_LABELS[t] }}</span>
        <span class="seg-count">{{ crm.tagCount(t) }}</span>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="tab-bar">
      <button v-for="t in (['subscribers','compose','campaigns','templates'] as Tab[])" :key="t"
        class="tab-btn" :class="{ active: tab === t }" @click="tab = t">
        <span v-if="t==='subscribers'">👥 Subscribers</span>
        <span v-else-if="t==='compose'">✉️ Compose</span>
        <span v-else-if="t==='campaigns'">📊 Campaigns</span>
        <span v-else>📧 Email Templates</span>
      </button>
    </div>

    <!-- ── SUBSCRIBERS TAB ── -->
    <div v-if="tab === 'subscribers'" class="tab-content">
      <div class="sub-toolbar">
        <input v-model="search" class="search-input" placeholder="Search name or email…" />
        <select v-model="filterTag" class="filter-select">
          <option value="">All Tags</option>
          <option v-for="t in ALL_TAGS" :key="t" :value="t">{{ TAG_LABELS[t] }}</option>
        </select>
        <button class="add-btn" @click="showAdd = !showAdd">+ Add Subscriber</button>
      </div>

      <!-- Add form -->
      <Transition name="slide-down">
        <div v-if="showAdd" class="add-form">
          <div v-if="addOk" class="add-success">✓ Subscriber added successfully!</div>
          <template v-else>
            <div class="add-form-row">
              <div class="add-field">
                <label>Full Name</label>
                <input v-model="addName" class="add-input" placeholder="e.g. Emma Johnson" />
              </div>
              <div class="add-field">
                <label>Email Address</label>
                <input v-model="addEmail" class="add-input" placeholder="email@example.com" type="email" />
              </div>
            </div>
            <div class="add-tags-row">
              <span class="add-tags-label">Subscribe to:</span>
              <button v-for="t in ALL_TAGS" :key="t" class="tag-toggle" :class="{ selected: addTags.includes(t) }" @click="toggleAddTag(t)">
                {{ TAG_LABELS[t] }}
              </button>
            </div>
            <div v-if="addError" class="add-error">{{ addError }}</div>
            <div class="add-actions">
              <button class="cancel-btn" @click="showAdd = false">Cancel</button>
              <button class="submit-btn" @click="submitAdd">Add Subscriber</button>
            </div>
          </template>
        </div>
      </Transition>

      <!-- Subscriber table -->
      <div class="sub-table-wrap">
        <table class="sub-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Tags</th>
              <th>Joined</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in filteredSubs" :key="s.id" :class="{ inactive: !s.active }">
              <td>
                <div class="sub-info">
                  <div class="sub-avatar" :style="{ background: s.active ? 'linear-gradient(135deg,#c8813a,#d4a060)' : '#44403c' }">{{ s.name[0] }}</div>
                  <div>
                    <div class="sub-name">{{ s.name }}</div>
                    <div class="sub-email">{{ s.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="tag-chips">
                  <span v-for="t in s.tags" :key="t" class="tag-chip" :style="{ background: TAG_COLORS[t] + '22', color: TAG_COLORS[t], borderColor: TAG_COLORS[t] + '44' }">{{ TAG_LABELS[t] }}</span>
                </div>
              </td>
              <td class="td-date">{{ s.joinedAt }}</td>
              <td>
                <button class="toggle-btn" :class="{ on: s.active }" @click="crm.toggleSubscriber(s.id)">
                  {{ s.active ? 'Active' : 'Paused' }}
                </button>
              </td>
              <td>
                <button class="del-btn" @click="crm.removeSubscriber(s.id)" title="Remove">✕</button>
              </td>
            </tr>
            <tr v-if="!filteredSubs.length">
              <td colspan="5" class="empty-row">No subscribers match your filter.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── COMPOSE TAB ── -->
    <div v-else-if="tab === 'compose'" class="tab-content">
      <Transition name="fade" mode="out-in">
        <div v-if="composeSent" class="sent-banner">
          <div class="sent-icon">✓</div>
          <div>
            <div class="sent-title">Campaign Sent!</div>
            <div class="sent-sub">Your email is on its way to {{ recipientPreview }} subscriber{{ recipientPreview !== 1 ? 's' : '' }}.</div>
            <div v-if="composePartial" class="sent-warning">⚠ {{ composePartial }}</div>
          </div>
        </div>
        <div v-else class="compose-layout">
          <div v-if="composeError" class="error-banner">
            <div class="error-icon">⚠</div>
            <div>
              <div class="error-title">Campaign not sent</div>
              <div class="error-sub">{{ composeError }}</div>
            </div>
          </div>

          <!-- Email setup check -->
          <div class="status-check-row">
            <button class="status-check-btn" :disabled="checkingEmailStatus" @click="checkEmailStatus">
              {{ checkingEmailStatus ? 'Checking…' : '🔎 Check Email Setup' }}
            </button>
            <div v-if="emailStatus" class="status-result" :class="emailStatus.ok ? (emailStatus.fromWarning ? 'warn' : 'ok') : 'bad'">
              <template v-if="!emailStatus.configured">❌ {{ emailStatus.message }}</template>
              <template v-else-if="!emailStatus.ok">❌ {{ emailStatus.message }}</template>
              <template v-else-if="emailStatus.fromWarning">⚠ {{ emailStatus.fromWarning }}</template>
              <template v-else>✅ {{ emailStatus.message }}</template>
            </div>
          </div>

          <!-- Type picker -->
          <div class="compose-section">
            <div class="compose-label">Campaign Type</div>
            <div class="type-grid">
              <button v-for="(meta, key) in TYPE_META" :key="key" class="type-card" :class="{ selected: composeType === key }" @click="composeType = key as CampaignType">
                <span class="type-icon">{{ meta.icon }}</span>
                <span class="type-name">{{ meta.label }}</span>
              </button>
            </div>
          </div>

          <!-- Subject -->
          <div class="compose-section">
            <div class="compose-label">Email Subject Line</div>
            <input v-model="composeSubject" class="subject-input" :placeholder="DEFAULT_SUBJECTS[composeType]" />
          </div>

          <!-- Segments -->
          <div class="compose-section">
            <div class="compose-label">Send To <span class="compose-hint">(leave blank = all active subscribers)</span></div>
            <div class="seg-toggles">
              <button v-for="t in ALL_TAGS" :key="t" class="seg-toggle"
                :class="{ selected: composeTags.includes(t) }"
                :style="composeTags.includes(t) ? { background: TAG_COLORS[t] + '22', borderColor: TAG_COLORS[t], color: TAG_COLORS[t] } : {}"
                @click="composeTags.includes(t) ? composeTags.splice(composeTags.indexOf(t),1) : composeTags.push(t)">
                {{ TAG_LABELS[t] }} ({{ crm.tagCount(t) }})
              </button>
            </div>
            <div class="recipients-preview">
              📬 This campaign will reach <strong>{{ recipientPreview }}</strong> active subscriber{{ recipientPreview !== 1 ? 's' : '' }}.
            </div>
          </div>

          <!-- Preview toggle -->
          <div class="compose-section">
            <div class="preview-toggle-row">
              <button class="preview-toggle-btn" @click="showPreview = !showPreview">
                {{ showPreview ? '▲ Hide Email Preview' : '▼ Preview Email' }}
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="showPreview" class="email-preview-wrap">
                <div class="email-chrome">
                  <div class="chrome-bar">
                    <div class="chrome-dots"><span></span><span></span><span></span></div>
                    <div class="chrome-addr">📧 Email Preview — {{ composeSubject || DEFAULT_SUBJECTS[composeType] }}</div>
                  </div>
                  <div class="email-viewport">
                    <div class="email-scale-wrap" v-html="previewHtml"></div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="compose-send-row">
            <button class="send-btn" :disabled="composeSending" @click="sendCampaign">
              {{ composeSending ? 'Sending emails…' : `Send Campaign to ${recipientPreview} Subscriber${recipientPreview !== 1 ? 's' : ''} →` }}
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ── CAMPAIGNS TAB ── -->
    <div v-else-if="tab === 'campaigns'" class="tab-content">
      <div class="campaigns-table-wrap">
        <table class="campaigns-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Subject</th>
              <th>Sent</th>
              <th>Recipients</th>
              <th>Opens</th>
              <th>Clicks</th>
              <th>Open Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in crm.campaigns" :key="c.id">
              <td>
                <span class="type-badge" :style="{ background: TYPE_META[c.type].color + '22', color: TYPE_META[c.type].color, borderColor: TYPE_META[c.type].color + '44' }">
                  {{ TYPE_META[c.type].icon }} {{ TYPE_META[c.type].label }}
                </span>
              </td>
              <td class="td-subject">{{ c.subject }}</td>
              <td class="td-date">{{ fmtDate(c.sentAt) }}</td>
              <td class="td-num">{{ c.recipientCount }}</td>
              <td class="td-num">{{ c.opens }}</td>
              <td class="td-num">{{ c.clicks }}</td>
              <td>
                <div class="rate-wrap">
                  <div class="rate-bar"><div class="rate-fill" :style="{ width: openRate(c) + '%' }"></div></div>
                  <span class="rate-pct">{{ openRate(c) }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="!crm.campaigns.length">
              <td colspan="7" class="empty-row">No campaigns sent yet. Go to Compose to send your first.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── TEMPLATES TAB ── -->
    <div v-else class="tab-content">
      <div class="templates-intro">
        <p>These are the live email templates your subscribers receive. Each pulls real data from your menu, reviews and promo codes.</p>
      </div>
      <div class="templates-grid">
        <div v-for="(meta, key) in TYPE_META" :key="key" class="template-card">
          <div class="template-header" :style="{ borderColor: meta.color }">
            <span class="template-icon">{{ meta.icon }}</span>
            <div>
              <div class="template-name">{{ meta.label }}</div>
              <div class="template-sub">
                <span v-if="key==='customer-review'">Showcases your top-rated reviews</span>
                <span v-else-if="key==='roastery-update'">Current roasting batches &amp; origins</span>
                <span v-else-if="key==='new-deals'">New &amp; featured menu items</span>
                <span v-else>Active promo codes &amp; discounts</span>
              </div>
            </div>
          </div>
          <div class="template-preview-box">
            <div class="template-scale-wrap"
              v-html="key==='customer-review' ? reviewEmailHtml() : key==='roastery-update' ? roasteryEmailHtml() : key==='new-deals' ? dealsEmailHtml() : discountEmailHtml()">
            </div>
          </div>
          <div class="template-footer">
            <button class="use-template-btn"
              @click="composeType = key as CampaignType; composeSubject = DEFAULT_SUBJECTS[key as CampaignType]; tab = 'compose'; showPreview = true">
              Use This Template →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crm-page { padding: 28px 32px; min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }

/* Header */
.crm-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 20px; }
.crm-title { font-size: 26px; font-weight: 900; color: #1c1917; margin: 0 0 4px; font-family: 'Playfair Display', serif; }
.crm-sub { font-size: 13px; color: #78716c; margin: 0; }
.stat-cards { display: flex; gap: 12px; flex-wrap: wrap; }
.stat-card { background: #fff; border: 1px solid #ede8e0; border-radius: 12px; padding: 14px 20px; min-width: 110px; text-align: center; }
.stat-card.accent { border-color: rgba(200,129,58,0.3); background: rgba(200,129,58,0.06); }
.stat-card.green  { border-color: rgba(5,150,105,0.3); background: rgba(5,150,105,0.06); }
.stat-val   { font-size: 24px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; }
.stat-card.accent .stat-val { color: #c8813a; }
.stat-card.green .stat-val  { color: #059669; }
.stat-label { font-size: 11px; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-top: 2px; }

/* Segment row */
.segment-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.segment-chip { display: flex; align-items: center; gap: 7px; background: #fff; border: 1px solid #ede8e0; border-radius: 20px; padding: 6px 14px; }
.seg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.seg-label { font-size: 12px; font-weight: 600; color: #44403c; }
.seg-count { font-size: 12px; font-weight: 800; color: #1c1917; background: #f0ece6; border-radius: 10px; padding: 1px 7px; }

/* Tabs */
.tab-bar { display: flex; gap: 4px; background: #fff; border: 1px solid #ede8e0; border-radius: 12px; padding: 4px; margin-bottom: 24px; }
.tab-btn { flex: 1; padding: 10px 14px; border: none; border-radius: 9px; background: transparent; font-size: 13px; font-weight: 600; color: #78716c; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.tab-btn:hover { color: #1c1917; background: #f5f0ea; }
.tab-btn.active { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; }

/* Tab content */
.tab-content { background: #fff; border: 1px solid #ede8e0; border-radius: 16px; padding: 28px; }

/* Subscribers */
.sub-toolbar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; padding: 10px 14px; border: 1px solid #ede8e0; border-radius: 10px; font-size: 13px; font-family: inherit; background: #faf7f2; color: #1c1917; }
.search-input:focus { outline: none; border-color: #d4a060; }
.filter-select { padding: 10px 14px; border: 1px solid #ede8e0; border-radius: 10px; font-size: 13px; font-family: inherit; background: #faf7f2; color: #1c1917; cursor: pointer; }
.add-btn { padding: 10px 20px; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.add-btn:hover { transform: translateY(-1px); }

.add-form { background: #faf7f2; border: 1px solid #ede8e0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
.add-form-row { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
.add-field { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 5px; }
.add-field label { font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.add-input { padding: 10px 13px; border: 1px solid #ede8e0; border-radius: 9px; font-size: 13px; font-family: inherit; background: #fff; color: #1c1917; }
.add-input:focus { outline: none; border-color: #d4a060; }
.add-tags-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.add-tags-label { font-size: 12px; font-weight: 600; color: #78716c; }
.tag-toggle { padding: 5px 13px; border: 1px solid #ede8e0; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; background: #fff; color: #78716c; font-family: inherit; transition: all 0.15s; }
.tag-toggle.selected { background: rgba(200,129,58,0.12); border-color: #d4a060; color: #c8813a; }
.add-error { font-size: 12px; color: #dc2626; margin-bottom: 10px; }
.add-success { text-align: center; color: #059669; font-weight: 700; font-size: 15px; padding: 16px; }
.add-actions { display: flex; gap: 10px; justify-content: flex-end; }
.cancel-btn { padding: 9px 18px; border: 1px solid #ede8e0; border-radius: 9px; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; color: #78716c; font-family: inherit; }
.submit-btn { padding: 9px 20px; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; }

.sub-table-wrap { overflow-x: auto; }
.sub-table { width: 100%; border-collapse: collapse; }
.sub-table th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #78716c; padding: 10px 12px; text-align: left; border-bottom: 1px solid #ede8e0; }
.sub-table td { padding: 13px 12px; border-bottom: 1px solid #f5f0ea; vertical-align: middle; }
.sub-table tr.inactive td { opacity: 0.55; }
.sub-info { display: flex; align-items: center; gap: 10px; }
.sub-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px; flex-shrink: 0; }
.sub-name { font-size: 14px; font-weight: 600; color: #1c1917; }
.sub-email { font-size: 12px; color: #78716c; }
.tag-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.tag-chip { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 12px; border: 1px solid; }
.td-date { font-size: 12px; color: #78716c; white-space: nowrap; }
.toggle-btn { padding: 5px 13px; border-radius: 20px; border: none; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; background: #f0ece6; color: #78716c; }
.toggle-btn.on { background: rgba(5,150,105,0.12); color: #059669; }
.del-btn { background: none; border: none; font-size: 14px; color: #a8a29e; cursor: pointer; transition: color 0.15s; }
.del-btn:hover { color: #dc2626; }
.empty-row { text-align: center; color: #a8a29e; font-size: 13px; padding: 32px !important; }

/* Compose */
.compose-layout { display: flex; flex-direction: column; gap: 24px; }
.compose-section {}
.compose-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #78716c; margin-bottom: 10px; }
.compose-hint { font-size: 11px; color: #a8a29e; font-weight: 500; text-transform: none; letter-spacing: 0; }
.type-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.type-card { flex: 1; min-width: 120px; padding: 16px 12px; border: 1.5px solid #ede8e0; border-radius: 12px; background: #faf7f2; cursor: pointer; text-align: center; font-family: inherit; transition: all 0.18s; display: flex; flex-direction: column; align-items: center; gap: 7px; }
.type-card:hover { border-color: #d4a060; }
.type-card.selected { border-color: #c8813a; background: rgba(200,129,58,0.08); }
.type-icon { font-size: 24px; }
.type-name { font-size: 12px; font-weight: 700; color: #44403c; }
.subject-input { width: 100%; padding: 12px 16px; border: 1.5px solid #ede8e0; border-radius: 10px; font-size: 14px; font-family: inherit; color: #1c1917; background: #faf7f2; box-sizing: border-box; }
.subject-input:focus { outline: none; border-color: #d4a060; }
.seg-toggles { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.seg-toggle { padding: 8px 16px; border: 1.5px solid #ede8e0; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; background: #faf7f2; color: #78716c; font-family: inherit; transition: all 0.18s; }
.recipients-preview { font-size: 13px; color: #78716c; background: #faf7f2; border: 1px solid #ede8e0; border-radius: 10px; padding: 11px 16px; }
.recipients-preview strong { color: #c8813a; }
.preview-toggle-row { margin-bottom: 12px; }
.preview-toggle-btn { padding: 9px 18px; border: 1.5px solid #d4a060; border-radius: 10px; background: rgba(212,160,96,0.08); color: #c8813a; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.preview-toggle-btn:hover { background: rgba(212,160,96,0.15); }

.email-preview-wrap { margin-top: 4px; }
.email-chrome { border-radius: 12px; overflow: hidden; border: 1px solid #ede8e0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.chrome-bar { background: #f5f0ea; padding: 10px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #ede8e0; }
.chrome-dots { display: flex; gap: 5px; }
.chrome-dots span { width: 10px; height: 10px; border-radius: 50%; background: #e0d8d0; }
.chrome-dots span:nth-child(1) { background: #fc5f57; }
.chrome-dots span:nth-child(2) { background: #febe2c; }
.chrome-dots span:nth-child(3) { background: #27c840; }
.chrome-addr { font-size: 11px; color: #78716c; font-family: monospace; flex: 1; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.email-viewport { background: #e8e0d8; padding: 24px; overflow-y: auto; max-height: 560px; }
.email-scale-wrap { max-width: 600px; margin: 0 auto; }

.compose-send-row { display: flex; justify-content: flex-end; }
.send-btn { padding: 14px 32px; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 6px 20px rgba(200,129,58,0.35); transition: all 0.2s; }
.send-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,129,58,0.48); }

.sent-banner { display: flex; align-items: center; gap: 20px; background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.25); border-radius: 14px; padding: 28px 32px; }
.sent-icon { width: 52px; height: 52px; border-radius: 50%; background: #059669; color: #fff; font-size: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sent-title { font-size: 18px; font-weight: 800; color: #059669; margin-bottom: 4px; }
.sent-sub { font-size: 13px; color: #44403c; }

.error-banner { display: flex; align-items: center; gap: 16px; background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.25); border-radius: 14px; padding: 18px 22px; margin-bottom: 20px; }
.error-icon { width: 40px; height: 40px; border-radius: 50%; background: #dc2626; color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.error-title { font-size: 14px; font-weight: 800; color: #dc2626; margin-bottom: 2px; }
.error-sub { font-size: 12px; color: #57534e; line-height: 1.5; }
.sent-warning { font-size: 12px; color: #b45309; margin-top: 6px; font-weight: 600; }

.status-check-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.status-check-btn {
  padding: 9px 16px; border-radius: 10px; border: 1.5px solid #e7e5e4; background: #fff;
  color: #44403c; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.status-check-btn:hover:not(:disabled) { border-color: #d4a060; color: #c8813a; }
.status-check-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.status-result { font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 8px; line-height: 1.5; }
.status-result.ok   { color: #059669; background: rgba(5,150,105,0.08); }
.status-result.warn { color: #b45309; background: rgba(180,83,9,0.08); }
.status-result.bad  { color: #dc2626; background: rgba(220,38,38,0.08); }

/* Campaigns */
.campaigns-table-wrap { overflow-x: auto; }
.campaigns-table { width: 100%; border-collapse: collapse; }
.campaigns-table th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #78716c; padding: 10px 12px; text-align: left; border-bottom: 1px solid #ede8e0; white-space: nowrap; }
.campaigns-table td { padding: 14px 12px; border-bottom: 1px solid #f5f0ea; vertical-align: middle; }
.type-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; border: 1px solid; white-space: nowrap; }
.td-subject { font-size: 13px; color: #1c1917; max-width: 280px; }
.td-num { font-size: 14px; font-weight: 700; color: #1c1917; text-align: right; }
.rate-wrap { display: flex; align-items: center; gap: 8px; min-width: 100px; }
.rate-bar { flex: 1; height: 6px; background: #f0ece6; border-radius: 3px; overflow: hidden; }
.rate-fill { height: 100%; background: linear-gradient(90deg, #c8813a, #d4a060); border-radius: 3px; transition: width 0.5s ease; }
.rate-pct { font-size: 12px; font-weight: 700; color: #c8813a; white-space: nowrap; }

/* Templates */
.templates-intro { font-size: 13px; color: #78716c; margin-bottom: 24px; line-height: 1.6; }
.templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.template-card { border: 1px solid #ede8e0; border-radius: 16px; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
.template-header { display: flex; align-items: flex-start; gap: 12px; padding: 18px; border-bottom: 2px solid; }
.template-icon { font-size: 28px; flex-shrink: 0; }
.template-name { font-size: 15px; font-weight: 800; color: #1c1917; margin-bottom: 2px; }
.template-sub { font-size: 12px; color: #78716c; }
.template-preview-box { flex: 1; overflow: hidden; background: #e8e0d8; padding: 16px; max-height: 340px; position: relative; }
.template-scale-wrap { transform: scale(0.45); transform-origin: top left; width: calc(100% / 0.45); pointer-events: none; }
.template-footer { padding: 14px 18px; border-top: 1px solid #f5f0ea; }
.use-template-btn { width: 100%; padding: 10px; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.use-template-btn:hover { transform: translateY(-1px); }

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>