<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useStatsStore, type Period } from '../stores/stats'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'

const stats = useStatsStore()
const orders = useOrdersStore()
const products = useProductsStore()

const period = ref<Period>('weekly')

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily',   label: 'Today'   },
  { key: 'weekly',  label: 'This Week'  },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly',  label: 'Yearly'  },
]

const currentCards = computed(() =>
  stats.statCards.map(c => ({
    icon:       c.icon,
    label:      c.labels[period.value],
    value:      c.data[period.value].value,
    change:     c.data[period.value].change,
    positive:   c.data[period.value].positive,
    compLabel:  c.data[period.value].compLabel,
  }))
)

const recentOrders = computed(() => orders.orders.slice(0, 6))
const bestSellers = computed(() =>
  [...products.products].sort((a, b) => b.reviews - a.reviews).slice(0, 5)
)
const maxReviews = computed(() => bestSellers.value[0]?.reviews ?? 1)

const statusColor: Record<string, string> = {
  pending: '#f59e0b', preparing: '#3b82f6', ready: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444'
}

const cardGradients = [
  'linear-gradient(135deg,#c8813a,#d4a060)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
]

// Animated SVG revenue chart
const chartPoints = computed(() => {
  const vals = [42, 58, 47, 73, 65, 89, 78, 94, 82, 110, 96, 128]
  const max = Math.max(...vals)
  const w = 420, h = 100
  return vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - (v / max) * h}`)
})
const polyline = computed(() => chartPoints.value.join(' '))
const areaPath = computed(() => {
  const pts = chartPoints.value
  return `M${pts[0]} ${pts.slice(1).map(p => 'L' + p).join(' ')} L420,100 L0,100 Z`
})

// Animate numbers on mount
const animatedVals = ref<number[]>([0, 0, 0, 0])
onMounted(() => {
  setTimeout(() => {
    animatedVals.value = [1, 1, 1, 1]
  }, 100)
})

const quickActions = [
  { svg: `<path d="M12 5v14M5 12h14"/>`, label: 'Add Product',   to: '/menu' },
  { svg: `<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>`, label: 'View Orders',  to: '/orders' },
  { svg: `<circle cx="12" cy="12" r="10"/><path d="M8 12h4l3-7"/>`, label: 'Cup Designer',  to: '/cup-designer' },
  { svg: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>`, label: 'Packaging',    to: '/packaging-designer' },
  { svg: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`, label: 'Schedule',     to: '/schedule' },
  { svg: `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`, label: 'Promo Codes',  to: '/promo-codes' },
]
</script>

<template>
  <div class="dashboard">

    <!-- ── HEADER ROW ─────────────────────────────── -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Dashboard</h1>
        <p class="dash-sub">Welcome back — here's what's happening at 4ever Coffee.</p>
      </div>
      <div class="period-bar">
        <button
          v-for="p in PERIODS" :key="p.key"
          class="period-btn" :class="{ active: period === p.key }"
          @click="period = p.key"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- ── STAT CARDS ─────────────────────────────── -->
    <div class="stat-grid">
      <div
        v-for="(card, i) in currentCards" :key="card.label"
        class="stat-card"
        :style="{ '--accent': cardGradients[i] }"
      >
        <div class="stat-accent-bar" :style="{ background: cardGradients[i] }"></div>
        <div class="stat-top">
          <div class="stat-icon-wrap" :style="{ background: cardGradients[i] }">
            <span class="stat-icon">{{ card.icon }}</span>
          </div>
          <div class="stat-change-badge" :class="{ positive: card.positive, negative: !card.positive }">
            {{ card.positive ? '↑' : '↓' }} {{ card.change }}
          </div>
        </div>
        <div class="stat-value">{{ card.value }}</div>
        <div class="stat-label">{{ card.label }}</div>
        <div class="stat-comp">{{ card.compLabel }}</div>
      </div>
    </div>

    <!-- ── REVENUE CHART + QUICK ACTIONS ─────────── -->
    <div class="chart-actions-row">

      <!-- Revenue chart -->
      <div class="panel chart-panel">
        <div class="panel-head">
          <div>
            <h3>Revenue Overview</h3>
            <p class="panel-sub">Last 12 months performance</p>
          </div>
          <div class="chart-legend">
            <span class="legend-dot gold"></span> Revenue
          </div>
        </div>
        <div class="chart-wrap">
          <svg viewBox="0 0 420 110" class="rev-chart" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stop-color="#d4a060" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#d4a060" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line v-for="n in 4" :key="n" x1="0" :y1="n * 25" x2="420" :y2="n * 25"
                  stroke="#f0ebe4" stroke-width="1"/>
            <!-- Area fill -->
            <path :d="areaPath" fill="url(#chartGrad)" class="chart-area"/>
            <!-- Line -->
            <polyline :points="polyline" fill="none" stroke="#d4a060" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round" class="chart-line"/>
            <!-- Data points -->
            <circle v-for="(pt, i) in chartPoints" :key="i"
                    :cx="pt.split(',')[0]" :cy="pt.split(',')[1]"
                    r="3.5" fill="#d4a060" class="chart-dot"/>
          </svg>
          <div class="chart-labels">
            <span v-for="m in ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']" :key="m">{{ m }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="panel actions-panel">
        <div class="panel-head">
          <h3>Quick Actions</h3>
        </div>
        <div class="actions-grid">
          <RouterLink
            v-for="a in quickActions" :key="a.label"
            :to="a.to" class="action-btn"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="a.svg"></svg>
            <span class="action-label">{{ a.label }}</span>
          </RouterLink>
        </div>
        <!-- Live status -->
        <div class="live-strip">
          <div class="live-dot"></div>
          <span class="live-text">Kitchen is <strong>Live</strong> — {{ orders.orders.filter(o => o.status === 'preparing').length }} orders in progress</span>
        </div>
      </div>

    </div>

    <!-- ── ORDERS + STOCK ─────────────────────────── -->
    <div class="row-2">
      <!-- Recent Orders -->
      <div class="panel orders-panel">
        <div class="panel-head">
          <h3>Recent Orders</h3>
          <RouterLink to="/orders" class="see-all">See all →</RouterLink>
        </div>
        <div class="orders-list">
          <div v-for="o in recentOrders" :key="o.id" class="order-row">
            <div class="order-avatar" :style="{ background: statusColor[o.status] + '22', color: statusColor[o.status] }">
              {{ o.customer.name.charAt(0) }}
            </div>
            <div class="order-info">
              <div class="order-name">{{ o.customer.name }}</div>
              <div class="order-id">{{ o.id }}</div>
            </div>
            <div class="order-total">£{{ o.total.toFixed(2) }}</div>
            <span class="status-pill" :style="{ background: statusColor[o.status] + '22', color: statusColor[o.status] }">
              {{ o.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stock Alerts -->
      <div class="panel alert-panel">
        <div class="panel-head">
          <h3>Stock Alerts</h3>
          <RouterLink to="/menu" class="see-all">Manage →</RouterLink>
        </div>
        <div v-if="products.lowStockProducts.length === 0" class="empty-state">
          <span class="empty-icon">✓</span> All items fully stocked
        </div>
        <div v-for="p in products.lowStockProducts" :key="p.id" class="alert-row">
          <div class="alert-info">
            <span class="alert-name">{{ p.name }}</span>
            <span class="alert-qty">{{ p.stock }} left</span>
          </div>
          <div class="stock-bar-wrap">
            <div class="stock-bar" :style="{ width: Math.min(p.stock / p.lowStockThreshold * 100, 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── BEST SELLERS TABLE ─────────────────────── -->
    <div class="panel">
      <div class="panel-head">
        <h3>Best Sellers</h3>
        <RouterLink to="/menu" class="see-all">View Menu →</RouterLink>
      </div>
      <div class="bs-list">
        <div v-for="(p, i) in bestSellers" :key="p.id" class="bs-row" :class="{ 'bs-top': i === 0 }">
          <div class="bs-rank">
            {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}` }}
          </div>
          <div class="bs-swatch" :style="{ background: p.gradient }"></div>
          <div class="bs-info">
            <div class="bs-name">{{ p.name }}</div>
            <div class="bs-cat">{{ p.category }}</div>
          </div>
          <div class="bs-stars" :style="{ color: p.accent }">
            {{ '★'.repeat(Math.round(p.rating)) }}{{ '☆'.repeat(5 - Math.round(p.rating)) }}
          </div>
          <div class="bs-bar-wrap">
            <div class="bs-bar" :style="{ width: (p.reviews / maxReviews * 100) + '%', background: p.accent }"></div>
          </div>
          <div class="bs-reviews">{{ p.reviews.toLocaleString() }} reviews</div>
          <div class="bs-price">£{{ p.price.toFixed(2) }}</div>
          <span class="stock-tag" :class="p.stock <= p.lowStockThreshold ? 'low' : 'ok'">
            {{ p.stock <= p.lowStockThreshold ? 'Low' : 'OK' }} · {{ p.stock }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

/* ── HEADER ────────────────────────────────────── */
.dash-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 16px;
}
.dash-title { font-size: 28px; font-weight: 700; color: #1c1917; margin: 0 0 4px; font-family: 'Playfair Display', serif; }
.dash-sub   { font-size: 13px; color: #a8a29e; margin: 0; }

.period-bar {
  display: flex; gap: 3px;
  background: #f5f0ea; border-radius: 12px;
  padding: 4px;
}
.period-btn {
  padding: 7px 16px; border: none; border-radius: 9px;
  font-size: 12.5px; font-weight: 600; cursor: pointer;
  background: none; color: #78716c; transition: all 0.18s; font-family: inherit;
  white-space: nowrap;
}
.period-btn:hover  { color: #1c1917; background: rgba(255,255,255,0.7); }
.period-btn.active { background: #1c1917; color: #fdf6ec; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }

/* ── STAT CARDS ────────────────────────────────── */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1100px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .stat-grid { grid-template-columns: 1fr; } }

.stat-card {
  background: #fff; border-radius: 16px; padding: 20px;
  box-shadow: 0 2px 12px rgba(44,16,8,0.07);
  border: 1px solid #f0ebe4; position: relative; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,16,8,0.12); }
.stat-accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }

.stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.stat-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon { font-size: 22px; }
.stat-change-badge {
  font-size: 11px; font-weight: 700; padding: 3px 9px;
  border-radius: 20px;
}
.stat-change-badge.positive { background: #d1fae5; color: #065f46; }
.stat-change-badge.negative { background: #fee2e2; color: #991b1b; }

.stat-value { font-size: 30px; font-weight: 900; color: #1c1917; letter-spacing: -1.5px; margin-bottom: 4px; }
.stat-label { font-size: 12px; color: #78716c; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
.stat-comp  { font-size: 11px; color: #a8a29e; }

/* ── CHART + ACTIONS ROW ───────────────────────── */
.chart-actions-row { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
@media (max-width: 1000px) { .chart-actions-row { grid-template-columns: 1fr; } }

.chart-panel { flex: 1; }
.panel-sub { font-size: 12px; color: #a8a29e; margin: 2px 0 0; }
.chart-legend { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #78716c; font-weight: 600; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-dot.gold { background: #d4a060; }

.chart-wrap { margin-top: 16px; }
.rev-chart { width: 100%; height: 110px; overflow: visible; }
.chart-area  { animation: fadeIn 0.8s ease; }
.chart-line  { animation: drawLine 1.2s ease; stroke-dasharray: 1000; stroke-dashoffset: 0; }
.chart-dot   { animation: fadeIn 1s ease; }
@keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
@keyframes drawLine { from { stroke-dashoffset: 1000 } to { stroke-dashoffset: 0 } }

.chart-labels {
  display: flex; justify-content: space-between;
  margin-top: 8px; font-size: 10px; color: #a8a29e; font-weight: 600;
}

/* Quick Actions */
.actions-panel { display: flex; flex-direction: column; gap: 16px; }
.actions-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.action-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 14px 8px; border-radius: 12px; border: 1.5px solid #f0ebe4;
  text-decoration: none; transition: all 0.18s; background: #faf7f2;
  cursor: pointer;
}
.action-btn:hover { border-color: #d4a060; background: #fff9f0; transform: translateY(-1px); }
.action-icon  { width: 22px; height: 22px; color: #d4a060; flex-shrink: 0; }
.action-label { font-size: 11px; font-weight: 700; color: #44403c; text-align: center; }

.live-strip {
  display: flex; align-items: center; gap: 8px;
  background: #ecfdf5; border-radius: 10px; padding: 10px 14px;
}
.live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex-shrink: 0;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
.live-text { font-size: 12px; color: #065f46; }
.live-text strong { color: #047857; }

/* ── PANELS ─────────────────────────────────────── */
.panel {
  background: #fff; border-radius: 16px; padding: 22px;
  box-shadow: 0 2px 12px rgba(44,16,8,0.06);
  border: 1px solid #f0ebe4;
}
.panel-head {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px;
}
.panel-head h3 { font-size: 15px; font-weight: 700; color: #1c1917; margin: 0; }
.see-all { font-size: 12px; color: #d4a060; font-weight: 600; text-decoration: none; }
.see-all:hover { color: #c8813a; }

/* ── ORDERS ──────────────────────────────────────── */
.row-2 { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; }
@media (max-width: 900px) { .row-2 { grid-template-columns: 1fr; } }

.orders-list { display: flex; flex-direction: column; gap: 4px; }
.order-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px; border-radius: 10px; transition: background 0.15s;
}
.order-row:hover { background: #faf7f2; }
.order-avatar {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800;
}
.order-info { flex: 1; min-width: 0; }
.order-name { font-size: 13px; font-weight: 700; color: #1c1917; }
.order-id   { font-size: 11px; color: #a8a29e; font-family: monospace; }
.order-total { font-size: 14px; font-weight: 800; color: #1c1917; margin-right: 4px; }
.status-pill {
  border-radius: 20px; padding: 3px 10px; font-size: 11px;
  font-weight: 600; text-transform: capitalize; white-space: nowrap;
}

/* ── STOCK ALERTS ────────────────────────────────── */
.empty-state {
  display: flex; align-items: center; gap: 8px;
  color: #10b981; font-size: 13px; font-weight: 600; padding: 12px 0;
}
.empty-icon { font-size: 18px; }
.alert-row { padding: 8px 0; border-bottom: 1px solid #faf7f2; }
.alert-info { display: flex; justify-content: space-between; margin-bottom: 6px; }
.alert-name { font-size: 13px; font-weight: 600; color: #1c1917; }
.alert-qty  { font-size: 12px; font-weight: 700; color: #d97706; }
.stock-bar-wrap { height: 6px; background: #fef3c7; border-radius: 4px; overflow: hidden; }
.stock-bar      { height: 100%; background: linear-gradient(90deg,#f59e0b,#ef4444); border-radius: 4px; transition: width 0.6s; }

/* ── BEST SELLERS ────────────────────────────────── */
.bs-list { display: flex; flex-direction: column; gap: 4px; }
.bs-row {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 12px; border-radius: 10px; transition: background 0.15s;
}
.bs-row:hover { background: #faf7f2; }
.bs-row.bs-top { background: linear-gradient(90deg, rgba(212,160,96,0.06), transparent); }
.bs-rank   { font-size: 18px; width: 28px; flex-shrink: 0; }
.bs-swatch { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
.bs-info   { flex: 1; min-width: 0; }
.bs-name   { font-size: 13px; font-weight: 700; color: #1c1917; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bs-cat    { font-size: 11px; color: #a8a29e; }
.bs-stars  { font-size: 12px; letter-spacing: 1px; flex-shrink: 0; }
.bs-bar-wrap { width: 100px; height: 6px; background: #f5f0ea; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.bs-bar      { height: 100%; border-radius: 4px; transition: width 0.6s; }
.bs-reviews  { font-size: 11px; color: #78716c; width: 80px; flex-shrink: 0; }
.bs-price    { font-size: 14px; font-weight: 800; color: #1c1917; width: 50px; flex-shrink: 0; }
.stock-tag   { border-radius: 8px; padding: 3px 9px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.stock-tag.ok  { background: #d1fae5; color: #065f46; }
.stock-tag.low { background: #fef3c7; color: #92400e; }
</style>