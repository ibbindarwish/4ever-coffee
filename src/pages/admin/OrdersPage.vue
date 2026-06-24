<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrdersStore } from '../../stores/orders'
import type { OrderStatus } from '../../stores/orders'

const store = useOrdersStore()
const tab = ref<OrderStatus | 'all'>('all')

const tabs: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const filtered = computed(() =>
  tab.value === 'all' ? store.orders : store.orders.filter(o => o.status === tab.value)
)

const statusColor: Record<string, string> = {
  pending: '#f59e0b', preparing: '#3b82f6', ready: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444'
}

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing', preparing: 'ready', ready: 'delivered', delivered: null, cancelled: null
}

const summary = computed(() => ({
  pending:   store.orders.filter(o => o.status === 'pending').length,
  preparing: store.orders.filter(o => o.status === 'preparing').length,
  ready:     store.orders.filter(o => o.status === 'ready').length,
  delivered: store.orders.filter(o => o.status === 'delivered').length,
}))
</script>

<template>
  <div class="page">
    <div class="summary-cards">
      <div class="sum-card pending">
        <div class="sum-val">{{ summary.pending }}</div>
        <div class="sum-label">Pending</div>
      </div>
      <div class="sum-card preparing">
        <div class="sum-val">{{ summary.preparing }}</div>
        <div class="sum-label">Preparing</div>
      </div>
      <div class="sum-card ready">
        <div class="sum-val">{{ summary.ready }}</div>
        <div class="sum-label">Ready</div>
      </div>
      <div class="sum-card delivered">
        <div class="sum-val">{{ summary.delivered }}</div>
        <div class="sum-label">Delivered</div>
      </div>
    </div>

    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: tab === t.key }" @click="tab = t.key">
        {{ t.label }}
      </button>
    </div>

    <div class="panel">
      <table class="data-table">
        <thead>
          <tr>
            <th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id">
            <td class="mono">{{ o.id }}</td>
            <td>
              <div class="cust-cell">
                <div class="cust-avatar">{{ o.customer.name[0] }}</div>
                <div>
                  <div class="cust-name">{{ o.customer.name }}</div>
                  <div class="cust-email">{{ o.customer.email }}</div>
                </div>
              </div>
            </td>
            <td class="muted">{{ o.date }}</td>
            <td class="bold">£{{ o.total.toFixed(2) }}</td>
            <td>
              <span class="status-pill" :style="{ background: statusColor[o.status] + '22', color: statusColor[o.status] }">
                {{ o.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button v-if="nextStatus[o.status]" class="act-btn advance" @click="store.updateStatus(o.id, nextStatus[o.status]!)">
                  → {{ nextStatus[o.status] }}
                </button>
                <button v-if="o.status !== 'cancelled' && o.status !== 'delivered'" class="act-btn cancel" @click="store.updateStatus(o.id, 'cancelled')">
                  Cancel
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="empty">No orders found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 18px; }
.summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.sum-card { background: #fff; border-radius: 10px; padding: 16px 18px; border: 1px solid #f0ebe4; text-align: center; }
.sum-val { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
.sum-label { font-size: 12px; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
.sum-card.pending   .sum-val { color: #f59e0b; }
.sum-card.preparing .sum-val { color: #3b82f6; }
.sum-card.ready     .sum-val { color: #8b5cf6; }
.sum-card.delivered .sum-val { color: #10b981; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab { padding: 7px 16px; border-radius: 8px; border: 1px solid #e7e5e4; background: #fff; font-size: 13px; cursor: pointer; color: #78716c; }
.tab.active { background: #1a0a04; color: #d4a060; border-color: #1a0a04; font-weight: 600; }
.panel { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #f0ebe4; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 700px; }
.data-table th { text-align: left; padding: 10px 12px; font-size: 11px; color: #a8a29e; border-bottom: 1px solid #f5f0ea; text-transform: uppercase; letter-spacing: 0.05em; }
.data-table td { padding: 14px 12px; border-bottom: 1px solid #faf7f2; vertical-align: middle; }
.mono { font-family: monospace; font-size: 12px; color: #78716c; }
.muted { color: #78716c; font-size: 13px; }
.bold { font-weight: 700; color: #1c1917; }
.cust-cell { display: flex; align-items: center; gap: 10px; }
.cust-avatar { width: 32px; height: 32px; border-radius: 50%; background: #d4a060; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cust-name  { font-size: 13px; font-weight: 600; color: #1c1917; }
.cust-email { font-size: 11px; color: #a8a29e; }
.status-pill { border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.actions { display: flex; gap: 6px; flex-wrap: wrap; }
.act-btn { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid; }
.act-btn.advance { background: #fdf3e7; color: #92400e; border-color: #fcd34d; }
.act-btn.advance:hover { background: #fef3c7; }
.act-btn.cancel  { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
.act-btn.cancel:hover { background: #fecaca; }
.empty { text-align: center; padding: 40px; color: #a8a29e; }
</style>
