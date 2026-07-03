<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useStatsStore, type Period } from '../stores/stats'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'

const stats = useStatsStore()
const orders = useOrdersStore()
const products = useProductsStore()

const period = ref<Period>('weekly')

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily',   label: 'Daily'   },
  { key: 'weekly',  label: 'Weekly'  },
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

const recentOrders = computed(() => orders.orders.slice(0, 5))
const bestSellers = computed(() =>
  [...products.products].sort((a, b) => b.reviews - a.reviews).slice(0, 5)
)
const maxReviews = computed(() => bestSellers.value[0]?.reviews ?? 1)

const statusColor: Record<string, string> = {
  pending: '#f59e0b', preparing: '#3b82f6', ready: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444'
}

</script>

<template>
  <div class="dashboard">
    <!-- Period toggle + Stat cards -->
    <div class="stats-section">
      <div class="period-bar">
        <button
          v-for="p in PERIODS" :key="p.key"
          class="period-btn" :class="{ active: period === p.key }"
          @click="period = p.key"
        >{{ p.label }}</button>
      </div>

      <div class="stat-grid">
        <div v-for="card in currentCards" :key="card.label" class="stat-card">
          <div class="stat-icon">{{ card.icon }}</div>
          <div class="stat-body">
            <div class="stat-label">{{ card.label }}</div>
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-change" :class="{ positive: card.positive, negative: !card.positive }">
              {{ card.change }} {{ card.compLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row-2">
      <!-- Recent Orders -->
      <div class="panel orders-panel">
        <div class="panel-head">
          <h3>Recent Orders</h3>
          <RouterLink to="/orders" class="see-all">See all →</RouterLink>
        </div>
        <table class="mini-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="o in recentOrders" :key="o.id">
              <td class="mono">{{ o.id }}</td>
              <td>{{ o.customer.name }}</td>
              <td class="bold">£{{ o.total.toFixed(2) }}</td>
              <td>
                <span class="status-pill" :style="{ background: statusColor[o.status] + '22', color: statusColor[o.status] }">
                  {{ o.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Inventory Alert -->
      <div class="panel alert-panel">
        <div class="panel-head">
          <h3>Stock Alerts</h3>
          <RouterLink to="/menu" class="see-all">Manage →</RouterLink>
        </div>
        <div v-if="products.lowStockProducts.length === 0" class="empty-state">All items stocked ✓</div>
        <div v-for="p in products.lowStockProducts" :key="p.id" class="alert-row">
          <span class="alert-name">{{ p.name }}</span>
          <div class="stock-bar-wrap">
            <div class="stock-bar" :style="{ width: (p.stock / p.lowStockThreshold * 100) + '%' }"></div>
          </div>
          <span class="alert-qty">{{ p.stock }} left</span>
        </div>
      </div>
    </div>

    <!-- Best Sellers -->
    <div class="panel">
      <div class="panel-head">
        <h3>☕ Best Sellers</h3>
        <RouterLink to="/menu" class="see-all">View Menu →</RouterLink>
      </div>
      <table class="bs-table">
        <thead>
          <tr>
            <th>#</th><th>Item</th><th>Category</th><th>Rating</th><th>Popularity</th><th>Reviews</th><th>Price</th><th>Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in bestSellers" :key="p.id">
            <td>
              <span class="rank" :class="'rank-' + (i + 1)">
                {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1) }}
              </span>
            </td>
            <td>
              <div class="item-cell">
                <div class="swatch" :style="{ background: p.gradient }"></div>
                <div>
                  <div class="item-name">{{ p.name }}</div>
                  <div class="item-brand">{{ p.scentType }}</div>
                </div>
              </div>
            </td>
            <td><span class="cat-tag">{{ p.category }}</span></td>
            <td class="stars" :style="{ color: p.accent }">
              {{ '★'.repeat(Math.round(p.rating)) }}{{ '☆'.repeat(5 - Math.round(p.rating)) }}
            </td>
            <td class="bar-cell">
              <div class="pop-bar-bg">
                <div class="pop-bar" :style="{ width: (p.reviews / maxReviews * 100) + '%', background: p.accent }"></div>
              </div>
            </td>
            <td class="bold">{{ p.reviews.toLocaleString() }}</td>
            <td class="bold">£{{ p.price.toFixed(2) }}</td>
            <td>
              <span class="stock-tag" :class="p.stock <= p.lowStockThreshold ? 'low' : 'ok'">
                {{ p.stock }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 22px; }

/* Period toggle */
.stats-section { display: flex; flex-direction: column; gap: 12px; }
.period-bar {
  display: flex; gap: 4px;
  background: #fff; border: 1px solid #f0ebe4; border-radius: 10px;
  padding: 4px; width: fit-content;
  box-shadow: 0 1px 4px rgba(44,16,8,0.05);
}
.period-btn {
  padding: 6px 18px; border: none; border-radius: 7px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  background: none; color: #a8a29e; transition: all 0.18s; font-family: inherit;
}
.period-btn:hover  { color: #1c1917; background: #faf7f2; }
.period-btn.active { background: #1c1917; color: #fdf6ec; }

.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card { background: #fff; border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; box-shadow: 0 1px 4px rgba(44,16,8,0.06); border: 1px solid #f0ebe4; }
.stat-icon { font-size: 28px; flex-shrink: 0; }
.stat-label { font-size: 12px; color: #a8a29e; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.stat-value { font-size: 26px; font-weight: 800; color: #1c1917; letter-spacing: -1px; margin-bottom: 4px; }
.stat-change { font-size: 12px; font-weight: 600; }
.stat-change.positive { color: #16a34a; }
.stat-change.negative { color: #dc2626; }

.row-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
@media (max-width: 900px) { .row-2 { grid-template-columns: 1fr; } }

.panel { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(44,16,8,0.06); border: 1px solid #f0ebe4; }
.panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-head h3 { font-size: 15px; font-weight: 700; color: #1c1917; }
.see-all { font-size: 12px; color: #d4a060; font-weight: 600; text-decoration: none; }
.see-all:hover { color: #c8813a; }

.mini-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.mini-table th { text-align: left; font-size: 11px; color: #a8a29e; padding: 6px 8px; border-bottom: 1px solid #f5f0ea; text-transform: uppercase; letter-spacing: 0.05em; }
.mini-table td { padding: 10px 8px; border-bottom: 1px solid #faf7f2; }
.mono { font-family: monospace; font-size: 12px; color: #78716c; }
.bold { font-weight: 700; color: #1c1917; }
.status-pill { border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 600; text-transform: capitalize; }

.alert-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #faf7f2; }
.alert-name { font-size: 13px; font-weight: 500; color: #1c1917; width: 100px; flex-shrink: 0; }
.stock-bar-wrap { flex: 1; height: 6px; background: #fef3c7; border-radius: 4px; overflow: hidden; }
.stock-bar { height: 100%; background: #f59e0b; border-radius: 4px; }
.alert-qty { font-size: 12px; font-weight: 700; color: #d97706; width: 50px; text-align: right; }
.empty-state { color: #10b981; font-size: 13px; font-weight: 600; padding: 12px 0; }

.bs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.bs-table th { text-align: left; font-size: 11px; color: #a8a29e; padding: 8px 10px; border-bottom: 1px solid #f5f0ea; text-transform: uppercase; letter-spacing: 0.05em; }
.bs-table td { padding: 12px 10px; border-bottom: 1px solid #faf7f2; }
.rank { font-size: 16px; }
.item-cell { display: flex; align-items: center; gap: 10px; }
.swatch { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; }
.item-name { font-size: 13px; font-weight: 700; color: #1c1917; }
.item-brand { font-size: 11px; color: #a8a29e; }
.cat-tag { background: #fdf3e7; color: #92400e; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.stars { font-size: 12px; letter-spacing: 1px; }
.bar-cell { width: 120px; }
.pop-bar-bg { height: 6px; background: #f5f0ea; border-radius: 4px; overflow: hidden; }
.pop-bar { height: 100%; border-radius: 4px; }
.stock-tag { border-radius: 6px; padding: 2px 8px; font-size: 12px; font-weight: 700; }
.stock-tag.ok  { background: #d1fae5; color: #065f46; }
.stock-tag.low { background: #fef3c7; color: #92400e; }

/* ── Roastery & Grinder Room ──────────────────────────────────────────── */
.roastery-section { display: flex; flex-direction: column; gap: 18px; }

.roastery-hdr {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}
.roastery-title { font-size: 20px; font-weight: 800; color: #1c1917; margin: 0 0 4px; }
.roastery-sub   { font-size: 13px; color: #a8a29e; margin: 0; }

.live-badge {
  display: flex; align-items: center; gap: 6px;
  background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 20px;
  padding: 5px 12px; font-size: 11px; font-weight: 800; color: #065f46; white-space: nowrap;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #10b981;
  animation: pulse-live 1.4s ease-in-out infinite;
}
@keyframes pulse-live {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.75); }
}

/* Process pipeline */
.process-panel {
  background: #1c1917; border-radius: 14px; padding: 24px 28px;
  border: 1px solid #2d2825;
}
.process-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  color: #78716c; margin-bottom: 24px;
}
.pipeline-track {
  display: flex; align-items: flex-start; gap: 0;
  overflow-x: auto; padding-bottom: 4px;
}
.pipe-stage {
  display: flex; flex-direction: column; align-items: center;
  flex: 1; min-width: 90px; position: relative; padding-top: 4px;
}
.pipe-connector {
  position: absolute; top: 20px; right: 50%; width: 100%;
  height: 2px; background: #3a3430;
}
.pipe-connector.done   { background: #d4a060; }
.pipe-connector.active { background: linear-gradient(90deg, #d4a060, #f59e0b); }

.pipe-node {
  width: 40px; height: 40px; border-radius: 50%; border: 2px solid #3a3430;
  display: flex; align-items: center; justify-content: center;
  background: #231f1c; position: relative; z-index: 2; transition: all 0.3s;
}
.pipe-node.done    { border-color: #d4a060; background: rgba(212,160,96,0.15); }
.pipe-node.active  { border-color: #f59e0b; background: rgba(245,158,11,0.2); box-shadow: 0 0 0 6px rgba(245,158,11,0.12); }
.pipe-node.pending { opacity: 0.5; }
.pipe-icon { font-size: 17px; line-height: 1; }

.pipe-pulse {
  position: absolute; inset: -6px; border-radius: 50%;
  border: 2px solid #f59e0b; opacity: 0;
  animation: pipe-ring 1.6s ease-out infinite;
}
@keyframes pipe-ring {
  0%   { opacity: 0.7; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(1.5); }
}

.pipe-label  { font-size: 11px; font-weight: 700; color: #fdf6ec; margin-top: 10px; text-align: center; line-height: 1.3; }
.pipe-detail { font-size: 10px; color: #78716c; text-align: center; margin-top: 3px; line-height: 1.3; padding: 0 4px; }

.pipeline-legend {
  display: flex; gap: 20px; margin-top: 22px; justify-content: center;
}
.legend-item { font-size: 11px; font-weight: 600; }
.legend-item.done    { color: #d4a060; }
.legend-item.active  { color: #f59e0b; }
.legend-item.pending { color: #44403c; }

/* Roastery body 2-col layout */
.roastery-body {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
}
@media (max-width: 1100px) { .roastery-body { grid-template-columns: 1fr; } }

.col-hdr {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.col-title { font-size: 14px; font-weight: 700; color: #1c1917; }
.col-count { font-size: 12px; color: #a8a29e; font-weight: 600; }

/* Bean catalog */
.beans-col, .grinder-col { display: flex; flex-direction: column; }

.bean-list { display: flex; flex-direction: column; gap: 10px; }

.bean-card {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 12px;
  padding: 14px 16px; cursor: pointer; transition: all 0.2s;
}
.bean-card:hover         { border-color: #d4a060; box-shadow: 0 2px 10px rgba(212,160,96,0.12); }
.bean-card.bean-active   { border-color: #d4a060; background: #fffbf5; box-shadow: 0 4px 16px rgba(212,160,96,0.15); }

.bean-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.bean-flag { font-size: 24px; flex-shrink: 0; }
.bean-info { flex: 1; min-width: 0; }
.bean-name { font-size: 13px; font-weight: 700; color: #1c1917; }
.bean-origin { font-size: 11px; color: #a8a29e; margin-top: 1px; }

.bean-badges { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
.batch-badge { background: rgba(245,158,11,0.12); color: #d97706; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 700; white-space: nowrap; }
.stock-badge { border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 700; }
.stock-badge.ok  { background: #d1fae5; color: #065f46; }
.stock-badge.low { background: #fef3c7; color: #92400e; }

.roast-level-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.roast-lvl-label { font-size: 11px; font-weight: 700; color: #78716c; width: 90px; flex-shrink: 0; }
.roast-bar-bg { flex: 1; height: 6px; background: #f5f0ea; border-radius: 4px; overflow: hidden; }
.roast-bar    { height: 100%; border-radius: 4px; transition: width 0.6s ease; }

.flavor-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.flavor-tag  { background: #fdf3e7; color: #92400e; border-radius: 20px; padding: 2px 9px; font-size: 10px; font-weight: 600; }

/* Expanded roast params */
.roast-params {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 8px; margin-top: 12px; padding-top: 12px;
  border-top: 1px solid #f0ebe4;
}
.param { display: flex; flex-direction: column; align-items: center; }
.param-key { font-size: 10px; color: #a8a29e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.param-val { font-size: 14px; font-weight: 800; color: #1c1917; margin-top: 2px; }

.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; max-height: 80px; overflow: hidden; }
.expand-enter-from, .expand-leave-to       { opacity: 0; max-height: 0; }

/* Grinder cards */
.grinder-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }

.grinder-card {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 12px;
  padding: 14px 16px; transition: box-shadow 0.2s;
}
.grinder-card.active      { border-left: 3px solid #10b981; }
.grinder-card.idle        { border-left: 3px solid #f59e0b; }
.grinder-card.maintenance { border-left: 3px solid #ef4444; opacity: 0.75; }

.gr-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.gr-id  { font-size: 11px; font-weight: 700; color: #a8a29e; font-family: monospace; }

.gr-status {
  display: flex; align-items: center; gap: 5px;
  border-radius: 20px; padding: 2px 9px; font-size: 10px; font-weight: 700; text-transform: capitalize;
}
.gr-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.gr-model { font-size: 14px; font-weight: 700; color: #1c1917; margin-bottom: 2px; }
.gr-bean  { font-size: 12px; color: #78716c; margin-bottom: 10px; }

.gr-specs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
.gr-spec { text-align: center; }
.gr-spec-v { font-size: 13px; font-weight: 800; color: #1c1917; }
.gr-spec-k { font-size: 10px; color: #a8a29e; font-weight: 500; }

.gr-grind-size { font-size: 11px; color: #78716c; font-weight: 600; }
.gr-maintenance-note { font-size: 11px; color: #ef4444; font-weight: 600; }

/* Output summary */
.output-summary {
  background: #1c1917; border-radius: 12px; padding: 16px 18px;
}
.output-title { font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
.output-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.out-stat { text-align: center; }
.out-val { font-size: 18px; font-weight: 800; color: #d4a060; }
.out-key { font-size: 10px; color: #78716c; font-weight: 600; margin-top: 2px; }
</style>
