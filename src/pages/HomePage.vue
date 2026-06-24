<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useStatsStore } from '../stores/stats'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'

const stats = useStatsStore()
const orders = useOrdersStore()
const products = useProductsStore()

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
    <!-- Stat cards -->
    <div class="stat-grid">
      <div v-for="card in stats.statCards" :key="card.label" class="stat-card">
        <div class="stat-icon">{{ card.icon }}</div>
        <div class="stat-body">
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.value }}</div>
          <div class="stat-change" :class="{ positive: card.positive, negative: !card.positive }">
            {{ card.change }} vs last week
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
</style>
