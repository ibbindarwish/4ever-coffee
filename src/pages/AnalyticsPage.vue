<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Period } from '../stores/stats'

const period = ref<Period>('weekly')

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily',   label: 'Daily'   },
  { key: 'weekly',  label: 'Weekly'  },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly',  label: 'Yearly'  },
]

interface DataPoint { label: string; revenue: number; orders: number }

const chartData: Record<Period, DataPoint[]> = {
  daily: [
    { label: '7 AM',  revenue: 88,  orders: 12 },
    { label: '9 AM',  revenue: 210, orders: 28 },
    { label: '11 AM', revenue: 175, orders: 24 },
    { label: '1 PM',  revenue: 195, orders: 26 },
    { label: '3 PM',  revenue: 145, orders: 20 },
    { label: '5 PM',  revenue: 235, orders: 32 },
    { label: '7 PM',  revenue: 148, orders: 22 },
    { label: '9 PM',  revenue: 52,  orders: 8  },
  ],
  weekly: [
    { label: 'Mon', revenue: 820,  orders: 120 },
    { label: 'Tue', revenue: 1040, orders: 154 },
    { label: 'Wed', revenue: 980,  orders: 142 },
    { label: 'Thu', revenue: 1200, orders: 178 },
    { label: 'Fri', revenue: 1480, orders: 210 },
    { label: 'Sat', revenue: 1650, orders: 235 },
    { label: 'Sun', revenue: 1248, orders: 184 },
  ],
  monthly: [
    { label: 'Week 1', revenue: 7800,  orders: 1120 },
    { label: 'Week 2', revenue: 8200,  orders: 1180 },
    { label: 'Week 3', revenue: 9100,  orders: 1310 },
    { label: 'Week 4', revenue: 9500,  orders: 1280 },
  ],
  yearly: [
    { label: 'Jan', revenue: 28000, orders: 4100 },
    { label: 'Feb', revenue: 25500, orders: 3750 },
    { label: 'Mar', revenue: 31200, orders: 4600 },
    { label: 'Apr', revenue: 33800, orders: 4980 },
    { label: 'May', revenue: 35600, orders: 5240 },
    { label: 'Jun', revenue: 38400, orders: 5650 },
    { label: 'Jul', revenue: 36200, orders: 5320 },
    { label: 'Aug', revenue: 37800, orders: 5560 },
    { label: 'Sep', revenue: 34500, orders: 5080 },
    { label: 'Oct', revenue: 39100, orders: 5750 },
    { label: 'Nov', revenue: 41200, orders: 6060 },
    { label: 'Dec', revenue: 30700, orders: 4510 },
  ],
}

const kpiData: Record<Period, { revenue: string; orders: string; avg: string; repeat: string; revChange: string; ordChange: string; avgChange: string; repChange: string; revLabel: string; ordLabel: string }> = {
  daily:   { revenue: '£1,248',   orders: '184',    avg: '£6.78', repeat: '74%', revChange: '+18.4%', ordChange: '+11.2%', avgChange: '-1.2%',  repChange: '+2.1%',  revLabel: "Today's Revenue",  ordLabel: 'Orders Today'   },
  weekly:  { revenue: '£8,420',   orders: '1,223',  avg: '£6.88', repeat: '74%', revChange: '+14.3%', ordChange: '+9.7%',  avgChange: '+1.5%',  repChange: '+3.2%',  revLabel: 'Weekly Revenue',   ordLabel: 'Weekly Orders'  },
  monthly: { revenue: '£34,600',  orders: '4,890',  avg: '£7.05', repeat: '76%', revChange: '+22.1%', ordChange: '+18.4%', avgChange: '+2.8%',  repChange: '+4.1%',  revLabel: 'Monthly Revenue',  ordLabel: 'Monthly Orders' },
  yearly:  { revenue: '£412,000', orders: '58,700', avg: '£7.12', repeat: '71%', revChange: '+31.2%', ordChange: '+27.6%', avgChange: '+5.0%',  repChange: '-1.8%',  revLabel: 'Yearly Revenue',   ordLabel: 'Yearly Orders'  },
}

const pageTitle: Record<Period, string> = {
  daily:   "Today's Analytics",
  weekly:  'Weekly Analytics',
  monthly: 'Monthly Analytics',
  yearly:  'Yearly Analytics',
}
const pageSub: Record<Period, string> = {
  daily:   'Revenue, orders and trends for today',
  weekly:  'Revenue, orders and trends for this week',
  monthly: 'Revenue, orders and trends for this month',
  yearly:  'Revenue, orders and trends for this year',
}

const chartTitles: Record<Period, string> = {
  daily: "Today's Revenue by Hour", weekly: 'Weekly Revenue', monthly: 'Monthly Revenue', yearly: 'Yearly Revenue',
}
const barLabel: Record<Period, string> = {
  daily: 'Hour', weekly: 'Day', monthly: 'Week', yearly: 'Month',
}

// Category breakdown per period
interface CatRow { name: string; pct: number; color: string }
const catData: Record<Period, CatRow[]> = {
  daily:   [ { name: 'Hot Coffee', pct: 55, color: '#d4a060' }, { name: 'Cold Coffee', pct: 25, color: '#3b82f6' }, { name: 'Specialty', pct: 20, color: '#8b5cf6' } ],
  weekly:  [ { name: 'Hot Coffee', pct: 52, color: '#d4a060' }, { name: 'Cold Coffee', pct: 28, color: '#3b82f6' }, { name: 'Specialty', pct: 20, color: '#8b5cf6' } ],
  monthly: [ { name: 'Hot Coffee', pct: 50, color: '#d4a060' }, { name: 'Cold Coffee', pct: 30, color: '#3b82f6' }, { name: 'Specialty', pct: 20, color: '#8b5cf6' } ],
  yearly:  [ { name: 'Hot Coffee', pct: 48, color: '#d4a060' }, { name: 'Cold Coffee', pct: 32, color: '#3b82f6' }, { name: 'Specialty', pct: 20, color: '#8b5cf6' } ],
}

// Customer metrics per period
interface CustomerMetric { newCust: number; returning: number; total: number; newPct: number }
const custData: Record<Period, CustomerMetric> = {
  daily:   { newCust: 26,   returning: 158,    total: 184,    newPct: 14 },
  weekly:  { newCust: 182,  returning: 1041,   total: 1223,   newPct: 15 },
  monthly: { newCust: 710,  returning: 4180,   total: 4890,   newPct: 15 },
  yearly:  { newCust: 8400, returning: 50300,  total: 58700,  newPct: 14 },
}

// Top products per period
interface TopProduct { name: string; category: string; revenue: string; orders: number; growth: string; positive: boolean }
const topProducts: Record<Period, TopProduct[]> = {
  daily: [
    { name: 'Flat White',        category: 'Hot Coffee',  revenue: '£218', orders: 32, growth: '+8%',  positive: true  },
    { name: 'Iced Latte',        category: 'Cold Coffee', revenue: '£175', orders: 25, growth: '+14%', positive: true  },
    { name: 'Cappuccino',        category: 'Hot Coffee',  revenue: '£154', orders: 22, growth: '+5%',  positive: true  },
    { name: 'Vanilla Latte',     category: 'Specialty',   revenue: '£138', orders: 18, growth: '+22%', positive: true  },
    { name: 'Cold Brew',         category: 'Cold Coffee', revenue: '£112', orders: 14, growth: '-3%',  positive: false },
  ],
  weekly: [
    { name: 'Flat White',        category: 'Hot Coffee',  revenue: '£1,540', orders: 224, growth: '+12%', positive: true  },
    { name: 'Cappuccino',        category: 'Hot Coffee',  revenue: '£1,280', orders: 186, growth: '+7%',  positive: true  },
    { name: 'Iced Latte',        category: 'Cold Coffee', revenue: '£1,120', orders: 160, growth: '+18%', positive: true  },
    { name: 'Vanilla Latte',     category: 'Specialty',   revenue: '£980',   orders: 128, growth: '+25%', positive: true  },
    { name: 'Croissant',         category: 'Pastry',      revenue: '£740',   orders: 148, growth: '-2%',  positive: false },
  ],
  monthly: [
    { name: 'Flat White',        category: 'Hot Coffee',  revenue: '£6,200',  orders: 908,  growth: '+14%', positive: true  },
    { name: 'Cappuccino',        category: 'Hot Coffee',  revenue: '£5,100',  orders: 742,  growth: '+9%',  positive: true  },
    { name: 'Iced Latte',        category: 'Cold Coffee', revenue: '£4,480',  orders: 640,  growth: '+21%', positive: true  },
    { name: 'Vanilla Latte',     category: 'Specialty',   revenue: '£3,920',  orders: 512,  growth: '+28%', positive: true  },
    { name: 'Espresso Brownie',  category: 'Dessert',     revenue: '£2,860',  orders: 572,  growth: '+6%',  positive: true  },
  ],
  yearly: [
    { name: 'Flat White',        category: 'Hot Coffee',  revenue: '£74,400', orders: 10912, growth: '+18%', positive: true  },
    { name: 'Cappuccino',        category: 'Hot Coffee',  revenue: '£61,200', orders: 8906,  growth: '+12%', positive: true  },
    { name: 'Iced Latte',        category: 'Cold Coffee', revenue: '£53,760', orders: 7680,  growth: '+26%', positive: true  },
    { name: 'Vanilla Latte',     category: 'Specialty',   revenue: '£47,040', orders: 6144,  growth: '+34%', positive: true  },
    { name: 'Cold Brew',         category: 'Cold Coffee', revenue: '£38,400', orders: 4800,  growth: '+15%', positive: true  },
  ],
}

const current      = computed(() => chartData[period.value])
const currentKpi   = computed(() => kpiData[period.value])
const currentCat   = computed(() => catData[period.value])
const currentCust  = computed(() => custData[period.value])
const currentTop   = computed(() => topProducts[period.value])
const maxOrders    = computed(() => Math.max(...current.value.map(d => d.orders)))
const maxCatPct    = computed(() => Math.max(...currentCat.value.map(c => c.pct)))

const svgH = 140
const svgW = 500

const chartPoints = computed(() => {
  const data = current.value
  const maxRev = Math.max(...data.map(d => d.revenue))
  return data.map((d, i) => ({
    x: 40 + i * ((svgW - 60) / (data.length - 1)),
    y: svgH - 20 - (d.revenue / maxRev) * (svgH - 40),
    label: d.label,
    revenue: d.revenue,
  }))
})

const polylinePoints = computed(() => chartPoints.value.map(p => `${p.x},${p.y}`).join(' '))

const areaPath = computed(() => {
  const pts = chartPoints.value
  return `M${pts[0].x},${svgH - 20} ${pts.map(p => `L${p.x},${p.y}`).join(' ')} L${pts[pts.length - 1].x},${svgH - 20} Z`
})

const isPositive = (v: string) => v.startsWith('+')
</script>

<template>
  <div class="analytics">

    <!-- Header -->
    <div class="page-hdr">
      <div class="hdr-left">
        <div class="hdr-icon">📊</div>
        <div>
          <h1 class="hdr-title">{{ pageTitle[period] }}</h1>
          <p class="hdr-sub">{{ pageSub[period] }}</p>
        </div>
      </div>
      <div class="period-bar">
        <button
          v-for="p in PERIODS" :key="p.key"
          class="period-btn" :class="{ active: period === p.key }"
          @click="period = p.key"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi">
        <span class="kpi-val">{{ currentKpi.revenue }}</span>
        <span class="kpi-label">{{ currentKpi.revLabel }}</span>
        <span class="kpi-change" :class="isPositive(currentKpi.revChange) ? 'pos' : 'neg'">
          {{ currentKpi.revChange }} vs prev
        </span>
      </div>
      <div class="kpi">
        <span class="kpi-val">{{ currentKpi.orders }}</span>
        <span class="kpi-label">{{ currentKpi.ordLabel }}</span>
        <span class="kpi-change" :class="isPositive(currentKpi.ordChange) ? 'pos' : 'neg'">
          {{ currentKpi.ordChange }} vs prev
        </span>
      </div>
      <div class="kpi">
        <span class="kpi-val">{{ currentKpi.avg }}</span>
        <span class="kpi-label">Avg. Order Value</span>
        <span class="kpi-change" :class="isPositive(currentKpi.avgChange) ? 'pos' : 'neg'">
          {{ currentKpi.avgChange }} vs prev
        </span>
      </div>
      <div class="kpi">
        <span class="kpi-val">{{ currentKpi.repeat }}</span>
        <span class="kpi-label">Repeat Customers</span>
        <span class="kpi-change" :class="isPositive(currentKpi.repChange) ? 'pos' : 'neg'">
          {{ currentKpi.repChange }} vs prev
        </span>
      </div>
    </div>

    <!-- Revenue Line Chart -->
    <div class="panel chart-panel">
      <div class="panel-head">
        <h3>{{ chartTitles[period] }}</h3>
        <span class="chart-total">Total: {{ currentKpi.revenue }}</span>
      </div>
      <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d4a060" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#d4a060" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path :d="areaPath" fill="url(#areaGrad)"/>
        <polyline :points="polylinePoints" fill="none" stroke="#d4a060" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <circle v-for="(p, i) in chartPoints" :key="i"
          :cx="p.x" :cy="p.y"
          r="4" fill="#d4a060" stroke="#fff" stroke-width="2"/>
      </svg>
      <div class="chart-labels">
        <span v-for="(p, i) in chartPoints" :key="i">{{ p.label }}</span>
      </div>
    </div>

    <!-- Orders + Category row -->
    <div class="row-2">
      <!-- Orders Bar Chart -->
      <div class="panel">
        <div class="panel-head">
          <h3>Orders by {{ barLabel[period] }}</h3>
          <span class="chart-total">{{ currentKpi.orders }} total</span>
        </div>
        <div class="bar-chart">
          <div v-for="(d, i) in current" :key="i" class="bar-item">
            <div class="bar-fill" :style="{ height: (d.orders / maxOrders * 100) + '%' }"></div>
            <span class="bar-label">{{ d.label }}</span>
          </div>
        </div>
      </div>

      <!-- Category Breakdown (period-specific) -->
      <div class="panel">
        <div class="panel-head"><h3>Category Breakdown</h3></div>
        <div class="cat-list">
          <div v-for="cat in currentCat" :key="cat.name" class="cat-row">
            <div class="cat-top">
              <span class="cat-dot" :style="{ background: cat.color }"></span>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-pct">{{ cat.pct }}%</span>
            </div>
            <div class="cat-bar-bg">
              <div class="cat-bar-fill"
                :style="{ width: (cat.pct / maxCatPct * 100) + '%', background: cat.color }">
              </div>
            </div>
          </div>
        </div>

        <!-- Donut visual -->
        <svg viewBox="0 0 120 120" class="donut-svg">
          <circle cx="60" cy="60" r="44" fill="none" stroke="#f0ebe4" stroke-width="14"/>
          <circle v-for="(cat, i) in currentCat" :key="cat.name"
            cx="60" cy="60" r="44" fill="none"
            :stroke="cat.color" stroke-width="14"
            stroke-linecap="butt"
            :stroke-dasharray="`${cat.pct * 2.765} ${276.5 - cat.pct * 2.765}`"
            :stroke-dashoffset="-(currentCat.slice(0, i).reduce((s, c) => s + c.pct, 0) * 2.765 - 69.1)"
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="56" text-anchor="middle" font-size="13" font-weight="800" fill="#1c1917">{{ currentCat[0].pct }}%</text>
          <text x="60" y="70" text-anchor="middle" font-size="8" fill="#a8a29e">Hot Coffee</text>
        </svg>
      </div>
    </div>

    <!-- Customer Metrics -->
    <div class="panel">
      <div class="panel-head">
        <h3>Customer Metrics</h3>
        <span class="chart-total">{{ currentKpi.repeat }} repeat rate</span>
      </div>
      <div class="cust-grid">
        <div class="cust-card cust-total">
          <div class="cust-val">{{ currentCust.total.toLocaleString() }}</div>
          <div class="cust-lbl">Total Customers</div>
          <div class="cust-bar-wrap">
            <div class="cust-bar-fill" style="width:100%; background:#1c1917"></div>
          </div>
        </div>
        <div class="cust-card cust-returning">
          <div class="cust-val">{{ currentCust.returning.toLocaleString() }}</div>
          <div class="cust-lbl">Returning</div>
          <div class="cust-bar-wrap">
            <div class="cust-bar-fill"
              :style="{ width: ((currentCust.returning / currentCust.total) * 100) + '%', background: '#d4a060' }">
            </div>
          </div>
        </div>
        <div class="cust-card cust-new">
          <div class="cust-val">{{ currentCust.newCust.toLocaleString() }}</div>
          <div class="cust-lbl">New Customers</div>
          <div class="cust-bar-wrap">
            <div class="cust-bar-fill"
              :style="{ width: (currentCust.newPct) + '%', background: '#10b981' }">
            </div>
          </div>
        </div>
        <div class="cust-card cust-rate">
          <div class="cust-val">{{ currentCust.newPct }}%</div>
          <div class="cust-lbl">New Customer Rate</div>
          <div class="cust-bar-wrap">
            <div class="cust-bar-fill"
              :style="{ width: currentCust.newPct + '%', background: '#3b82f6' }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products -->
    <div class="panel">
      <div class="panel-head">
        <h3>Top Products</h3>
        <span class="chart-total">by {{ period }} revenue</span>
      </div>
      <table class="top-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Category</th>
            <th>Revenue</th>
            <th>Orders</th>
            <th>Growth</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in currentTop" :key="item.name">
            <td class="rank-cell">
              <span class="rank-num">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1) }}</span>
            </td>
            <td class="name-cell">{{ item.name }}</td>
            <td><span class="cat-tag">{{ item.category }}</span></td>
            <td class="rev-cell">{{ item.revenue }}</td>
            <td class="ord-cell">{{ item.orders.toLocaleString() }}</td>
            <td>
              <span class="growth-pill" :class="item.positive ? 'growth-pos' : 'growth-neg'">
                {{ item.growth }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.analytics { display: flex; flex-direction: column; gap: 20px; }

/* Page header */
.page-hdr  { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: #fff; border-radius: 14px; padding: 20px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.hdr-left  { display: flex; align-items: center; gap: 14px; }
.hdr-icon  { font-size: 36px; }
.hdr-title { font-size: 22px; font-weight: 900; color: #1c1917; margin: 0; }
.hdr-sub   { font-size: 12px; color: #a8a29e; margin: 2px 0 0; }

/* Period toggle */
.period-bar {
  display: flex; gap: 4px;
  background: #faf7f2; border: 1px solid #f0ebe4; border-radius: 10px;
  padding: 4px;
}
.period-btn {
  padding: 7px 22px; border: none; border-radius: 7px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  background: none; color: #a8a29e; transition: all .18s; font-family: inherit;
}
.period-btn:hover  { color: #1c1917; background: #faf7f2; }
.period-btn.active { background: #1c1917; color: #fdf6ec; }

/* KPI cards */
.kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
@media (max-width: 700px) { .kpi-grid { grid-template-columns: repeat(2,1fr); } }
.kpi { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #f0ebe4; text-align: center; display: flex; flex-direction: column; gap: 4px; }
.kpi-val    { display: block; font-size: 28px; font-weight: 900; color: #1c1917; letter-spacing: -1px; }
.kpi-label  { font-size: 12px; color: #a8a29e; text-transform: uppercase; letter-spacing: .06em; }
.kpi-change { font-size: 11px; font-weight: 700; }
.kpi-change.pos { color: #16a34a; }
.kpi-change.neg { color: #dc2626; }

/* Panel */
.panel { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #f0ebe4; }
.panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-head h3 { font-size: 15px; font-weight: 700; color: #1c1917; }
.chart-total { font-size: 12px; color: #a8a29e; font-weight: 600; }

/* Revenue line chart */
.chart-svg { width: 100%; height: 160px; }
.chart-labels { display: flex; justify-content: space-between; padding: 0 32px; margin-top: 8px; }
.chart-labels span { font-size: 12px; color: #a8a29e; }

/* Bottom row */
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 640px) { .row-2 { grid-template-columns: 1fr; } }

/* Orders bar chart */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
.bar-item  { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.bar-fill  { width: 100%; background: linear-gradient(180deg,#d4a060,#c8813a); border-radius: 4px 4px 0 0; transition: height .35s ease; min-height: 4px; }
.bar-label { font-size: 10px; color: #a8a29e; white-space: nowrap; }

/* Category breakdown */
.cat-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.cat-row  { display: flex; flex-direction: column; gap: 5px; }
.cat-top  { display: flex; align-items: center; gap: 8px; }
.cat-dot  { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.cat-name { font-size: 13px; color: #1c1917; font-weight: 500; flex: 1; }
.cat-pct  { font-size: 13px; font-weight: 800; color: #1c1917; }
.cat-bar-bg   { height: 6px; background: #f0ebe4; border-radius: 4px; overflow: hidden; }
.cat-bar-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }

/* Donut */
.donut-svg { width: 120px; height: 120px; display: block; margin: 0 auto; }

/* Customer metrics */
.cust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 700px) { .cust-grid { grid-template-columns: repeat(2, 1fr); } }
.cust-card { background: #faf7f2; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.cust-val  { font-size: 22px; font-weight: 900; color: #1c1917; letter-spacing: -0.5px; }
.cust-lbl  { font-size: 11px; color: #78716c; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.cust-bar-wrap { height: 5px; background: #e7e5e4; border-radius: 3px; overflow: hidden; margin-top: 4px; }
.cust-bar-fill { height: 100%; border-radius: 3px; transition: width .4s ease; }

/* Top products table */
.top-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.top-table th {
  text-align: left; font-size: 11px; color: #a8a29e; padding: 8px 10px;
  border-bottom: 1px solid #f0ebe4; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;
}
.top-table td { padding: 11px 10px; border-bottom: 1px solid #faf7f2; vertical-align: middle; }
.top-table tr:last-child td { border-bottom: none; }
.rank-cell { width: 36px; }
.rank-num  { font-size: 16px; }
.name-cell { font-weight: 700; color: #1c1917; }
.cat-tag   { background: #fdf3e7; color: #92400e; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.rev-cell  { font-weight: 700; color: #1c1917; }
.ord-cell  { color: #57534e; }
.growth-pill { display: inline-block; border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
.growth-pos  { background: rgba(22,163,74,0.1);  color: #15803d; }
.growth-neg  { background: rgba(220,38,38,0.08); color: #dc2626; }
</style>