<script setup lang="ts">
import { computed } from 'vue'
import { useOrdersStore } from '../../stores/orders'
import type { Order } from '../../stores/orders'

const orders = useOrdersStore()

function cupsFromOrder(o: Order): number {
  if (o.items.length > 0) return o.items.reduce((s, i) => s + i.qty, 0)
  return Math.max(1, Math.round(o.subtotal / 5))
}

const allDates = computed(() => {
  const dates = [...new Set(orders.orders.map(o => o.date))].sort()
  return dates
})

interface CustomerStat {
  name: string
  email: string
  initials: string
  color: string
  totalCups: number
  orderCount: number
  daysMap: Record<string, number>
  topDay: string
}

const AVATAR_COLORS = [
  '#d4a060', '#7c3aed', '#0284c7', '#16a34a',
  '#dc2626', '#9333ea', '#ea580c', '#0d9488',
]

const customerStats = computed((): CustomerStat[] => {
  const map = new Map<string, CustomerStat>()
  let colorIdx = 0

  for (const o of orders.orders) {
    const key  = o.customer.email || o.customer.name
    const cups = cupsFromOrder(o)

    if (!map.has(key)) {
      const parts    = o.customer.name.trim().split(' ')
      const initials = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : parts[0].slice(0, 2)
      map.set(key, {
        name:       o.customer.name,
        email:      o.customer.email,
        initials:   initials.toUpperCase(),
        color:      AVATAR_COLORS[colorIdx++ % AVATAR_COLORS.length],
        totalCups:  0,
        orderCount: 0,
        daysMap:    {},
        topDay:     '',
      })
    }

    const entry      = map.get(key)!
    entry.totalCups += cups
    entry.orderCount++
    entry.daysMap[o.date] = (entry.daysMap[o.date] ?? 0) + cups
  }

  const list = [...map.values()].sort((a, b) => b.totalCups - a.totalCups)
  for (const c of list) {
    const best = Object.entries(c.daysMap).sort((a, b) => b[1] - a[1])[0]
    c.topDay   = best ? best[0] : ''
  }
  return list
})

const dailyTotals = computed(() => {
  const map: Record<string, number> = {}
  for (const o of orders.orders) {
    map[o.date] = (map[o.date] ?? 0) + cupsFromOrder(o)
  }
  return map
})

const maxDailyTotal = computed(() => Math.max(...Object.values(dailyTotals.value), 1))

const totalCups    = computed(() => customerStats.value.reduce((s, c) => s + c.totalCups, 0))
const peakDay      = computed(() => {
  const best = Object.entries(dailyTotals.value).sort((a, b) => b[1] - a[1])[0]
  return best ? best[0] : '—'
})
const topCustomer  = computed(() => customerStats.value[0] ?? null)

function fmtDate(d: string) {
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
          <h1 class="hdr-title">Daily Cup Tracker</h1>
          <p class="hdr-sub">How many cups each customer enjoyed — every day</p>
        </div>
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
        <span class="stat-lbl">Total Cups</span>
        <div class="stat-icon">☕</div>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ topCustomer?.totalCups ?? 0 }}</span>
        <span class="stat-lbl">Top Customer · {{ topCustomer?.name.split(' ')[0] ?? '—' }}</span>
        <div class="stat-icon">🏆</div>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ fmtDate(peakDay) }}</span>
        <span class="stat-lbl">Busiest Day</span>
        <div class="stat-icon">📅</div>
      </div>
    </div>

    <!-- Heatmap table -->
    <div class="section">
      <h2 class="section-title">Cup Activity Heatmap</h2>
      <p class="section-sub">Warmer colour = more cups ordered that day</p>
      <div class="heatmap-wrap">
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
            <!-- Daily totals row -->
            <tr class="totals-row">
              <td class="cell-name"><strong>Daily total</strong></td>
              <td v-for="d in allDates" :key="d" class="cell-cup cell-total-day">
                {{ dailyTotals[d] ?? 0 }}
              </td>
              <td class="cell-total"><strong>{{ totalCups }} ☕</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer leaderboard -->
    <div class="section">
      <h2 class="section-title">Customer Leaderboard</h2>
      <p class="section-sub">Ranked by total cups ordered across all time</p>
      <div class="leaderboard">
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
              <span class="lstat-lbl">Cups</span>
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

          <!-- Mini bar chart: cups per day -->
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
.page-hdr  { display: flex; align-items: center; background: #fff; border-radius: 14px; padding: 20px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.hdr-left  { display: flex; align-items: center; gap: 14px; }
.hdr-icon  { font-size: 36px; }
.hdr-title { font-size: 22px; font-weight: 900; color: #1c1917; margin: 0; }
.hdr-sub   { font-size: 12px; color: #a8a29e; margin: 2px 0 0; }

/* Stat cards */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
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

/* Heatmap */
.heatmap-wrap  { overflow-x: auto; border-radius: 10px; border: 1px solid #f0ebe4; }
.heatmap       { border-collapse: collapse; width: 100%; font-size: 12px; }
.heatmap th    { background: #faf7f2; padding: 8px 6px; font-size: 10px; font-weight: 700; color: #a8a29e; text-align: center; border-bottom: 1px solid #f0ebe4; white-space: nowrap; }
.col-name  { text-align: left; padding-left: 12px; min-width: 140px; }
.col-date  { min-width: 48px; }
.col-total { min-width: 72px; }

.cell-name {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 8px 8px 12px; font-size: 12px; font-weight: 600; color: #1c1917;
  border-bottom: 1px solid #faf7f2; white-space: nowrap;
}
.mini-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  color: #fff; font-size: 9px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cell-cup {
  text-align: center; padding: 6px 4px; border-bottom: 1px solid #faf7f2;
  border-left: 1px solid #f0ebe4; transition: opacity 0.15s;
}
.heat-num   { font-size: 11px; font-weight: 700; color: #1c1917; }
.heat-empty { font-size: 14px; color: #e7e5e4; }
.cell-total { text-align: center; padding: 8px; border-bottom: 1px solid #faf7f2; border-left: 2px solid #f0ebe4; }
.total-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }

.totals-row .cell-name { font-size: 11px; color: #78716c; font-weight: 700; background: #faf7f2; }
.totals-row .cell-cup  { font-size: 11px; font-weight: 700; color: #57534e; background: #faf7f2; border-top: 2px solid #e7e5e4; }
.totals-row .cell-total { background: #faf7f2; border-top: 2px solid #e7e5e4; font-size: 12px; }
.cell-total-day        { background: #faf7f2; }

/* Leaderboard */
.leaderboard { display: flex; flex-direction: column; gap: 12px; }
.leader-card {
  display: flex; align-items: center; gap: 14px;
  border: 1.5px solid #f0ebe4; border-radius: 12px;
  padding: 14px 18px; position: relative; overflow: hidden;
  transition: box-shadow 0.15s;
}
.leader-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

.rank-num { font-size: 18px; font-weight: 900; color: #a8a29e; min-width: 32px; text-align: center; }
.rank-num.gold   { color: #d97706; }
.rank-num.silver { color: #6b7280; }
.rank-num.bronze { color: #92400e; }

.leader-avatar {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  color: #fff; font-size: 14px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.leader-info  { flex: 1; min-width: 120px; }
.leader-name  { font-size: 14px; font-weight: 700; color: #1c1917; }
.leader-email { font-size: 11px; color: #a8a29e; margin-top: 1px; }
.leader-cups  { font-size: 16px; margin-top: 4px; line-height: 1; }

.leader-stats { display: flex; gap: 16px; }
.lstat        { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.lstat-val    { font-size: 16px; font-weight: 900; color: #1c1917; line-height: 1; }
.lstat-lbl    { font-size: 9px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.06em; }

/* Mini bar chart */
.mini-bars    { display: flex; align-items: flex-end; gap: 3px; height: 44px; min-width: 80px; }
.mini-bar-wrap { flex: 1; display: flex; align-items: flex-end; }
.mini-bar     { width: 100%; min-width: 6px; border-radius: 3px 3px 0 0; transition: height 0.3s; }

/* Badges */
.champion-badge {
  background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff;
  border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700;
  white-space: nowrap;
}
.regular-badge {
  background: #dcfce7; color: #16a34a;
  border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 700;
  white-space: nowrap;
}
</style>