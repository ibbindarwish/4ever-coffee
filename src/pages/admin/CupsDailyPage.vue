<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrdersStore } from '../../stores/orders'
import type { Order } from '../../stores/orders'

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily',   label: 'Daily'   },
  { key: 'weekly',  label: 'Weekly'  },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly',  label: 'Yearly'  },
]

const period = ref<Period>('weekly')

const orders = useOrdersStore()

function cupsFromOrder(o: Order): number {
  if (o.items.length > 0) return o.items.reduce((s, i) => s + i.qty, 0)
  return Math.max(1, Math.round(o.subtotal / 5))
}

function damagedFromOrder(o: Order): number { return o.damagedCups ?? 0 }
function returnedFromOrder(o: Order): number { return o.returnedCups ?? 0 }

// Use the latest order date as the anchor so demo data always looks current
const latestDate = computed(() => {
  const dates = orders.orders.map(o => o.date).sort()
  return dates[dates.length - 1] ?? new Date().toISOString().slice(0, 10)
})

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const daysBack: Record<Period, number> = { daily: 0, weekly: 6, monthly: 29, yearly: 364 }

const dateRange = computed(() => ({
  from: shiftDate(latestDate.value, -daysBack[period.value]),
  to:   latestDate.value,
}))

const filteredOrders = computed(() =>
  orders.orders.filter(o => o.date >= dateRange.value.from && o.date <= dateRange.value.to)
)

const allDates = computed(() =>
  [...new Set(filteredOrders.value.map(o => o.date))].sort()
)

interface CustomerStat {
  name: string; email: string; initials: string; color: string
  totalCups: number; damagedCups: number; returnedCups: number; netCups: number
  orderCount: number; daysMap: Record<string, number>; damagedMap: Record<string, number>; returnedMap: Record<string, number>; topDay: string
}

const AVATAR_COLORS = [
  '#d4a060', '#7c3aed', '#0284c7', '#16a34a',
  '#dc2626', '#9333ea', '#ea580c', '#0d9488',
]

const customerStats = computed((): CustomerStat[] => {
  const map = new Map<string, CustomerStat>()
  let colorIdx = 0

  for (const o of filteredOrders.value) {
    const key      = o.customer.email || o.customer.name
    const cups     = cupsFromOrder(o)
    const damaged  = damagedFromOrder(o)
    const returned = returnedFromOrder(o)

    if (!map.has(key)) {
      const parts    = o.customer.name.trim().split(' ')
      const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)
      map.set(key, {
        name: o.customer.name, email: o.customer.email,
        initials: initials.toUpperCase(),
        color: AVATAR_COLORS[colorIdx++ % AVATAR_COLORS.length],
        totalCups: 0, damagedCups: 0, returnedCups: 0, netCups: 0,
        orderCount: 0, daysMap: {}, damagedMap: {}, returnedMap: {}, topDay: '',
      })
    }

    const entry            = map.get(key)!
    entry.totalCups       += cups
    entry.damagedCups     += damaged
    entry.returnedCups    += returned
    entry.orderCount++
    entry.daysMap[o.date]    = (entry.daysMap[o.date]    ?? 0) + cups
    entry.damagedMap[o.date] = (entry.damagedMap[o.date] ?? 0) + damaged
    entry.returnedMap[o.date]= (entry.returnedMap[o.date]?? 0) + returned
  }

  const list = [...map.values()].sort((a, b) => b.totalCups - a.totalCups)
  for (const c of list) {
    const best = Object.entries(c.daysMap).sort((a, b) => b[1] - a[1])[0]
    c.topDay  = best ? best[0] : ''
    c.netCups = c.totalCups - c.damagedCups - c.returnedCups
  }
  return list
})

const dailyTotals = computed(() => {
  const map: Record<string, number> = {}
  for (const o of filteredOrders.value) {
    map[o.date] = (map[o.date] ?? 0) + cupsFromOrder(o)
  }
  return map
})

const dailyDamaged = computed(() => {
  const map: Record<string, number> = {}
  for (const o of filteredOrders.value) {
    const d = damagedFromOrder(o)
    if (d) map[o.date] = (map[o.date] ?? 0) + d
  }
  return map
})

const dailyReturned = computed(() => {
  const map: Record<string, number> = {}
  for (const o of filteredOrders.value) {
    const r = returnedFromOrder(o)
    if (r) map[o.date] = (map[o.date] ?? 0) + r
  }
  return map
})

const maxDailyTotal    = computed(() => Math.max(...Object.values(dailyTotals.value), 1))
const totalCups        = computed(() => customerStats.value.reduce((s, c) => s + c.totalCups, 0))
const totalDamagedCups = computed(() => customerStats.value.reduce((s, c) => s + c.damagedCups, 0))
const totalReturnedCups= computed(() => customerStats.value.reduce((s, c) => s + c.returnedCups, 0))
const topCustomer      = computed(() => customerStats.value[0] ?? null)
const peakDay       = computed(() => {
  const best = Object.entries(dailyTotals.value).sort((a, b) => b[1] - a[1])[0]
  return best ? best[0] : '—'
})

// ── Charts ────────────────────────────────────────────────────────────────────
const svgH = 140
const svgW = 500

const cupsChartPoints = computed(() => {
  const dates = allDates.value
  if (dates.length < 2) return []
  const maxCups = Math.max(...dates.map(d => dailyTotals.value[d] ?? 0), 1)
  return dates.map((d, i) => ({
    x: 40 + i * ((svgW - 60) / (dates.length - 1)),
    y: svgH - 20 - ((dailyTotals.value[d] ?? 0) / maxCups) * (svgH - 40),
    label: fmtDate(d),
    cups:  dailyTotals.value[d] ?? 0,
  }))
})

const cupsPolyline = computed(() => cupsChartPoints.value.map(p => `${p.x},${p.y}`).join(' '))
const cupsAreaPath = computed(() => {
  const pts = cupsChartPoints.value
  if (!pts.length) return ''
  return `M${pts[0].x},${svgH - 20} ${pts.map(p => `L${p.x},${p.y}`).join(' ')} L${pts[pts.length - 1].x},${svgH - 20} Z`
})

const maxCustomerCups = computed(() => Math.max(...customerStats.value.map(c => c.totalCups), 1))
// ──────────────────────────────────────────────────────────────────────────────

const cupsLabel: Record<Period, string>   = { daily: "Today's Cups", weekly: 'Weekly Cups', monthly: 'Monthly Cups', yearly: 'Yearly Cups' }
const busiestLabel: Record<Period, string> = { daily: 'Busiest Day', weekly: 'Busiest Day', monthly: 'Busiest Day', yearly: 'Busiest Day' }
const heatTitle: Record<Period, string>    = {
  daily:   "Today's Cup Activity",
  weekly:  'Weekly Cup Activity Heatmap',
  monthly: 'Monthly Cup Activity Heatmap',
  yearly:  'Yearly Cup Activity Heatmap',
}
const lbTitle: Record<Period, string> = {
  daily:   'Top Customers Today',
  weekly:  'Weekly Leaderboard',
  monthly: 'Monthly Leaderboard',
  yearly:  'All-Time Leaderboard',
}

function fmtDate(d: string) {
  if (!d || d === '—') return '—'
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function heatColor(cups: number, max: number): string {
  if (!cups) return 'transparent'
  const t = Math.min(cups / max, 1)
  if (t < 0.25) return '#fef3c7'
  if (t < 0.5)  return '#fcd34d'
  if (t < 0.75) return '#d97706'
  return '#92400e'
}

function cupEmojis(n: number): string {
  return '☕'.repeat(Math.min(n, 7)) + (n > 7 ? ` +${n - 7}` : '')
}
</script>

<template>
  <div class="page">

    <!-- Header -->
    <div class="page-hdr">
      <div class="hdr-left">
        <div class="hdr-icon">☕</div>
        <div>
          <h1 class="hdr-title">Cup Tracker</h1>
          <p class="hdr-sub">How many cups each customer enjoyed — track by period</p>
        </div>
      </div>

      <!-- Period toggle -->
      <div class="period-bar">
        <button
          v-for="p in PERIODS" :key="p.key"
          class="period-btn" :class="{ active: period === p.key }"
          @click="period = p.key"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-val">{{ customerStats.length }}</span>
        <span class="stat-lbl">Customers</span>
        <div class="stat-icon">👥</div>
      </div>
      <div class="stat-card accent">
        <span class="stat-val">{{ totalCups }}</span>
        <span class="stat-lbl">{{ cupsLabel[period] }}</span>
        <div class="stat-icon">☕</div>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ topCustomer?.totalCups ?? 0 }}</span>
        <span class="stat-lbl">Top Customer · {{ topCustomer?.name.split(' ')[0] ?? '—' }}</span>
        <div class="stat-icon">🏆</div>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ fmtDate(peakDay) }}</span>
        <span class="stat-lbl">{{ busiestLabel[period] }}</span>
        <div class="stat-icon">📅</div>
      </div>
      <div class="stat-card damaged">
        <span class="stat-val">{{ totalDamagedCups }}</span>
        <span class="stat-lbl">Damaged Cups</span>
        <div class="stat-icon">🔴</div>
      </div>
      <div class="stat-card returned">
        <span class="stat-val">{{ totalReturnedCups }}</span>
        <span class="stat-lbl">Returned Cups</span>
        <div class="stat-icon">↩️</div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row" v-if="allDates.length >= 2">

      <!-- Cups over time – line chart -->
      <div class="section">
        <div class="chart-head">
          <div>
            <h2 class="section-title">Cups Over Time</h2>
            <p class="section-sub">Total cups ordered per day in this period</p>
          </div>
          <span class="ctotal-badge">{{ totalCups }} ☕</span>
        </div>
        <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="cups-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cupsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4a060" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#d4a060" stop-opacity="0.02"/>
            </linearGradient>
          </defs>
          <path :d="cupsAreaPath" fill="url(#cupsGrad)"/>
          <polyline :points="cupsPolyline" fill="none" stroke="#d4a060" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          <circle v-for="(p, i) in cupsChartPoints" :key="i"
            :cx="p.x" :cy="p.y" r="4" fill="#d4a060" stroke="#fff" stroke-width="2">
            <title>{{ p.label }}: {{ p.cups }} cups</title>
          </circle>
        </svg>
        <div class="cups-x-labels">
          <span v-for="(p, i) in cupsChartPoints" :key="i">{{ p.label }}</span>
        </div>
      </div>

      <!-- Cups per customer – bar chart -->
      <div class="section">
        <div class="chart-head">
          <div>
            <h2 class="section-title">Cups by Customer</h2>
            <p class="section-sub">Total cups per customer in this period</p>
          </div>
          <span class="ctotal-badge">{{ customerStats.length }} customers</span>
        </div>
        <div class="cust-bar-chart">
          <div v-for="c in customerStats" :key="c.email" class="cust-bar-item">
            <div class="cust-bar-col">
              <div class="cust-bar-fill"
                :style="{ height: Math.max(6, (c.totalCups / maxCustomerCups) * 100) + 'px', background: c.color }"
                :title="`${c.name}: ${c.totalCups} cups`">
              </div>
            </div>
            <div class="cust-bar-avatar" :style="{ background: c.color }">{{ c.initials }}</div>
            <span class="cust-bar-val">{{ c.totalCups }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Heatmap table -->
    <div class="section">
      <h2 class="section-title">{{ heatTitle[period] }}</h2>
      <p class="section-sub">Warmer colour = more cups ordered that day</p>

      <div v-if="allDates.length === 0" class="empty-msg">No orders in this period.</div>

      <div v-else class="heatmap-wrap">
        <table class="heatmap">
          <thead>
            <tr>
              <th class="col-name">Customer</th>
              <th v-for="d in allDates" :key="d" class="col-date">{{ fmtDate(d) }}</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in customerStats" :key="c.email">
              <td class="cell-name">
                <div class="mini-avatar" :style="{ background: c.color }">{{ c.initials }}</div>
                <span>{{ c.name }}</span>
              </td>
              <td v-for="d in allDates" :key="d" class="cell-cup"
                  :style="{ background: heatColor(c.daysMap[d] ?? 0, maxDailyTotal) }"
                  :title="c.daysMap[d] ? `${c.daysMap[d]} cup${c.daysMap[d]>1?'s':''}` : 'No order'">
                <span v-if="c.daysMap[d]" class="heat-num">{{ c.daysMap[d] }}</span>
                <span v-else class="heat-empty">·</span>
              </td>
              <td class="cell-total">
                <span class="total-badge" :style="{ background: c.color + '22', color: c.color }">
                  {{ c.totalCups }} ☕
                </span>
              </td>
            </tr>
            <tr class="totals-row">
              <td class="cell-name"><strong>Daily total</strong></td>
              <td v-for="d in allDates" :key="d" class="cell-cup cell-total-day">
                {{ dailyTotals[d] ?? 0 }}
              </td>
              <td class="cell-total"><strong>{{ totalCups }} ☕</strong></td>
            </tr>
            <tr class="damaged-row">
              <td class="cell-name">
                <span class="row-tag damaged-tag">🔴 Damaged</span>
              </td>
              <td v-for="d in allDates" :key="d" class="cell-cup cell-damage-day">
                <span v-if="dailyDamaged[d]" class="dmg-num">{{ dailyDamaged[d] }}</span>
                <span v-else class="heat-empty">·</span>
              </td>
              <td class="cell-total">
                <span class="dmg-badge">{{ totalDamagedCups }} 🔴</span>
              </td>
            </tr>
            <tr class="returned-row">
              <td class="cell-name">
                <span class="row-tag returned-tag">↩️ Returned</span>
              </td>
              <td v-for="d in allDates" :key="d" class="cell-cup cell-return-day">
                <span v-if="dailyReturned[d]" class="ret-num">{{ dailyReturned[d] }}</span>
                <span v-else class="heat-empty">·</span>
              </td>
              <td class="cell-total">
                <span class="ret-badge">{{ totalReturnedCups }} ↩️</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer leaderboard -->
    <div class="section">
      <h2 class="section-title">{{ lbTitle[period] }}</h2>
      <p class="section-sub">Ranked by total cups in the selected period</p>

      <div v-if="customerStats.length === 0" class="empty-msg">No orders in this period.</div>

      <div v-else class="leaderboard">
        <div v-for="(c, idx) in customerStats" :key="c.email" class="leader-card">
          <div class="rank-num" :class="{ gold: idx===0, silver: idx===1, bronze: idx===2 }">
            {{ idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}` }}
          </div>
          <div class="leader-avatar" :style="{ background: c.color }">{{ c.initials }}</div>
          <div class="leader-info">
            <div class="leader-name">{{ c.name }}</div>
            <div class="leader-email">{{ c.email }}</div>
            <div class="leader-cups">{{ cupEmojis(c.totalCups) }}</div>
          </div>
          <div class="leader-stats">
            <div class="lstat">
              <span class="lstat-val">{{ c.totalCups }}</span>
              <span class="lstat-lbl">Ordered</span>
            </div>
            <div class="lstat" v-if="c.damagedCups">
              <span class="lstat-val lstat-dmg">{{ c.damagedCups }}</span>
              <span class="lstat-lbl">Damaged</span>
            </div>
            <div class="lstat" v-if="c.returnedCups">
              <span class="lstat-val lstat-ret">{{ c.returnedCups }}</span>
              <span class="lstat-lbl">Returned</span>
            </div>
            <div class="lstat">
              <span class="lstat-val">{{ c.netCups }}</span>
              <span class="lstat-lbl">Net Cups</span>
            </div>
            <div class="lstat">
              <span class="lstat-val">{{ c.orderCount }}</span>
              <span class="lstat-lbl">Orders</span>
            </div>
            <div class="lstat">
              <span class="lstat-val">{{ c.topDay ? fmtDate(c.topDay) : '—' }}</span>
              <span class="lstat-lbl">Peak day</span>
            </div>
          </div>
          <div class="mini-bars">
            <div v-for="d in allDates" :key="d" class="mini-bar-wrap" :title="`${fmtDate(d)}: ${c.daysMap[d]??0} cups`">
              <div class="mini-bar"
                :style="{
                  height: c.daysMap[d] ? Math.max(4, (c.daysMap[d] / maxDailyTotal) * 40) + 'px' : '2px',
                  background: c.daysMap[d] ? c.color : '#e7e5e4'
                }">
              </div>
            </div>
          </div>
          <div v-if="idx === 0" class="champion-badge">Champion ☕</div>
          <div v-else-if="c.orderCount >= 3" class="regular-badge">Regular</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

/* Header */
.page-hdr  { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: #fff; border-radius: 14px; padding: 20px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.hdr-left  { display: flex; align-items: center; gap: 14px; }
.hdr-icon  { font-size: 36px; }
.hdr-title { font-size: 22px; font-weight: 900; color: #1c1917; margin: 0; }
.hdr-sub   { font-size: 12px; color: #a8a29e; margin: 2px 0 0; }

/* Period toggle */
.period-bar {
  display: flex; gap: 4px;
  background: #faf7f2; border: 1px solid #f0ebe4; border-radius: 10px; padding: 4px;
}
.period-btn {
  padding: 7px 18px; border: none; border-radius: 7px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  background: none; color: #a8a29e; transition: all .18s; font-family: inherit;
}
.period-btn:hover  { color: #1c1917; background: #fff; }
.period-btn.active { background: #1c1917; color: #fdf6ec; }

/* Stat cards */
.stats-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
@media (max-width: 1000px) { .stats-row { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 600px)  { .stats-row { grid-template-columns: repeat(2,1fr); } }
.stat-card {
  background: #fff; border-radius: 14px; padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden;
}
.stat-card.accent { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; }
.stat-val  { font-size: 28px; font-weight: 900; color: #1c1917; line-height: 1; }
.stat-card.accent .stat-val { color: #fff; }
.stat-lbl  { font-size: 11px; color: #a8a29e; font-weight: 600; }
.stat-card.accent .stat-lbl { color: rgba(255,255,255,0.8); }
.stat-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.15; }

/* Section */
.section       { background: #fff; border-radius: 14px; padding: 22px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.section-title { font-size: 16px; font-weight: 800; color: #1c1917; margin: 0 0 4px; }
.section-sub   { font-size: 12px; color: #a8a29e; margin: 0 0 18px; }
.empty-msg     { text-align: center; color: #a8a29e; font-size: 14px; padding: 32px 0; }

/* Heatmap */
.heatmap-wrap  { overflow-x: auto; border-radius: 10px; border: 1px solid #f0ebe4; }
.heatmap       { border-collapse: collapse; width: 100%; font-size: 12px; }
.heatmap th    { background: #faf7f2; padding: 8px 6px; font-size: 10px; font-weight: 700; color: #a8a29e; text-align: center; border-bottom: 1px solid #f0ebe4; white-space: nowrap; }
.col-name  { text-align: left; padding-left: 12px; min-width: 140px; }
.col-date  { min-width: 48px; }
.col-total { min-width: 72px; }
.cell-name { display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 12px; font-size: 12px; font-weight: 600; color: #1c1917; border-bottom: 1px solid #faf7f2; white-space: nowrap; }
.mini-avatar { width: 24px; height: 24px; border-radius: 50%; color: #fff; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cell-cup { text-align: center; padding: 6px 4px; border-bottom: 1px solid #faf7f2; border-left: 1px solid #f0ebe4; transition: opacity .15s; }
.heat-num   { font-size: 11px; font-weight: 700; color: #1c1917; }
.heat-empty { font-size: 14px; color: #e7e5e4; }
.cell-total { text-align: center; padding: 8px; border-bottom: 1px solid #faf7f2; border-left: 2px solid #f0ebe4; }
.total-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.totals-row .cell-name  { font-size: 11px; color: #78716c; font-weight: 700; background: #faf7f2; }
.totals-row .cell-cup   { font-size: 11px; font-weight: 700; color: #57534e; background: #faf7f2; border-top: 2px solid #e7e5e4; }
.totals-row .cell-total { background: #faf7f2; border-top: 2px solid #e7e5e4; font-size: 12px; }
.cell-total-day { background: #faf7f2; }

/* Charts row */
.charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 700px) { .charts-row { grid-template-columns: 1fr; } }

.chart-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 4px; }
.ctotal-badge { background: #fdf3e7; color: #92400e; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }

.cups-svg { width: 100%; height: 150px; }
.cups-x-labels { display: flex; justify-content: space-between; padding: 4px 32px 0; }
.cups-x-labels span { font-size: 10px; color: #a8a29e; }

.cust-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 130px; padding: 0 4px; }
.cust-bar-item  { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; height: 100%; justify-content: flex-end; }
.cust-bar-col   { width: 100%; display: flex; align-items: flex-end; flex: 1; }
.cust-bar-fill  { width: 100%; border-radius: 4px 4px 0 0; transition: height .35s ease; min-height: 4px; }
.cust-bar-avatar { width: 22px; height: 22px; border-radius: 50%; color: #fff; font-size: 8px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cust-bar-val   { font-size: 10px; font-weight: 700; color: #57534e; }

/* Damaged & Returned stat cards */
.stat-card.damaged { border-left: 3px solid #fca5a5; }
.stat-card.damaged .stat-val { color: #dc2626; }
.stat-card.returned { border-left: 3px solid #93c5fd; }
.stat-card.returned .stat-val { color: #2563eb; }

/* Damaged / Returned heatmap rows */
.damaged-row .cell-name, .returned-row .cell-name { background: #faf7f2; border-top: 1px solid #e7e5e4; }
.row-tag   { display: inline-block; border-radius: 6px; padding: 2px 8px; font-size: 10px; font-weight: 700; }
.damaged-tag  { background: #fee2e2; color: #b91c1c; }
.returned-tag { background: #dbeafe; color: #1d4ed8; }
.cell-damage-day  { background: #fff5f5; border-top: 1px solid #e7e5e4; text-align: center; padding: 6px 4px; border-left: 1px solid #f0ebe4; }
.cell-return-day  { background: #eff6ff; border-top: 1px solid #e7e5e4; text-align: center; padding: 6px 4px; border-left: 1px solid #f0ebe4; }
.dmg-num  { font-size: 11px; font-weight: 700; color: #dc2626; }
.ret-num  { font-size: 11px; font-weight: 700; color: #2563eb; }
.dmg-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 700; white-space: nowrap; }
.ret-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; white-space: nowrap; }

/* Leaderboard damaged/returned stat colours */
.lstat-dmg { color: #dc2626; }
.lstat-ret { color: #2563eb; }

/* Leaderboard */
.leaderboard { display: flex; flex-direction: column; gap: 12px; }
.leader-card { display: flex; align-items: center; gap: 14px; border: 1.5px solid #f0ebe4; border-radius: 12px; padding: 14px 18px; position: relative; overflow: hidden; transition: box-shadow .15s; }
.leader-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.rank-num { font-size: 18px; font-weight: 900; color: #a8a29e; min-width: 32px; text-align: center; }
.rank-num.gold   { color: #d97706; }
.rank-num.silver { color: #6b7280; }
.rank-num.bronze { color: #92400e; }
.leader-avatar { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; color: #fff; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.leader-info  { flex: 1; min-width: 120px; }
.leader-name  { font-size: 14px; font-weight: 700; color: #1c1917; }
.leader-email { font-size: 11px; color: #a8a29e; margin-top: 1px; }
.leader-cups  { font-size: 16px; margin-top: 4px; line-height: 1; }
.leader-stats { display: flex; gap: 16px; }
.lstat        { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.lstat-val    { font-size: 16px; font-weight: 900; color: #1c1917; line-height: 1; }
.lstat-lbl    { font-size: 9px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: .06em; }
.mini-bars    { display: flex; align-items: flex-end; gap: 3px; height: 44px; min-width: 80px; }
.mini-bar-wrap { flex: 1; display: flex; align-items: flex-end; }
.mini-bar     { width: 100%; min-width: 6px; border-radius: 3px 3px 0 0; transition: height .3s; }
.champion-badge { background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.regular-badge  { background: #dcfce7; color: #16a34a; border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 700; white-space: nowrap; }
</style>