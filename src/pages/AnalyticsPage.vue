<script setup lang="ts">
const weekly = [
  { day: 'Mon', revenue: 820, orders: 120 },
  { day: 'Tue', revenue: 1040, orders: 154 },
  { day: 'Wed', revenue: 980, orders: 142 },
  { day: 'Thu', revenue: 1200, orders: 178 },
  { day: 'Fri', revenue: 1480, orders: 210 },
  { day: 'Sat', revenue: 1650, orders: 235 },
  { day: 'Sun', revenue: 1248, orders: 184 },
]
const maxRev = Math.max(...weekly.map(w => w.revenue))
const svgH = 140
const svgW = 500
const pts = weekly.map((w, i) => {
  const x = 40 + i * ((svgW - 60) / (weekly.length - 1))
  const y = svgH - 20 - (w.revenue / maxRev) * (svgH - 40)
  return `${x},${y}`
}).join(' ')
const area = `M40,${svgH - 20} L${pts.split(' ').map(p => p).join(' L')} L${40 + 6 * ((svgW - 60) / 6)},${svgH - 20} Z`
</script>

<template>
  <div class="analytics">
    <div class="kpi-grid">
      <div class="kpi"><span class="kpi-val">£8,420</span><span class="kpi-label">Weekly Revenue</span></div>
      <div class="kpi"><span class="kpi-val">1,223</span><span class="kpi-label">Weekly Orders</span></div>
      <div class="kpi"><span class="kpi-val">£6.88</span><span class="kpi-label">Avg. Order Value</span></div>
      <div class="kpi"><span class="kpi-val">74%</span><span class="kpi-label">Repeat Customers</span></div>
    </div>

    <div class="panel chart-panel">
      <div class="panel-head"><h3>Weekly Revenue</h3></div>
      <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d4a060" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#d4a060" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path :d="area" fill="url(#areaGrad)"/>
        <polyline :points="pts" fill="none" stroke="#d4a060" stroke-width="2.5" stroke-linejoin="round"/>
        <circle v-for="(w, i) in weekly" :key="w.day"
          :cx="40 + i * ((svgW - 60) / (weekly.length - 1))"
          :cy="svgH - 20 - (w.revenue / maxRev) * (svgH - 40)"
          r="4" fill="#d4a060" stroke="#fff" stroke-width="2"/>
      </svg>
      <div class="chart-labels">
        <span v-for="w in weekly" :key="w.day">{{ w.day }}</span>
      </div>
    </div>

    <div class="row-2">
      <div class="panel">
        <div class="panel-head"><h3>Orders by Day</h3></div>
        <div class="bar-chart">
          <div v-for="w in weekly" :key="w.day" class="bar-item">
            <div class="bar-fill" :style="{ height: (w.orders / 235 * 100) + '%' }"></div>
            <span class="bar-label">{{ w.day }}</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Category Breakdown</h3></div>
        <div class="donut-list">
          <div class="donut-row"><span class="dot" style="background:#d4a060"></span>Hot Coffee<span class="pct">52%</span></div>
          <div class="donut-row"><span class="dot" style="background:#3b82f6"></span>Cold Coffee<span class="pct">28%</span></div>
          <div class="donut-row"><span class="dot" style="background:#8b5cf6"></span>Specialty<span class="pct">20%</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics { display: flex; flex-direction: column; gap: 20px; }
.kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.kpi { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #f0ebe4; text-align: center; }
.kpi-val { display: block; font-size: 28px; font-weight: 900; color: #1c1917; letter-spacing: -1px; }
.kpi-label { font-size: 12px; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.06em; }
.panel { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #f0ebe4; }
.panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-head h3 { font-size: 15px; font-weight: 700; color: #1c1917; }
.chart-panel {}
.chart-svg { width: 100%; height: 160px; }
.chart-labels { display: flex; justify-content: space-between; padding: 0 32px; margin-top: 8px; }
.chart-labels span { font-size: 12px; color: #a8a29e; }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bar-chart { display: flex; align-items: flex-end; gap: 10px; height: 120px; }
.bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.bar-fill { width: 100%; background: linear-gradient(180deg,#d4a060,#c8813a); border-radius: 4px 4px 0 0; transition: height 0.3s; }
.bar-label { font-size: 11px; color: #a8a29e; }
.donut-list { display: flex; flex-direction: column; gap: 14px; }
.donut-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #1c1917; }
.dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.pct { margin-left: auto; font-weight: 700; color: #1c1917; }
</style>
