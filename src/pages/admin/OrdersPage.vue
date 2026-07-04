<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'
import type { OrderStatus } from '../../stores/orders'
import { SIZE_NAME } from '../../stores/cart'

const store = useOrdersStore()
const tab = ref<OrderStatus | 'all'>('all')
const expandedId = ref<string | null>(null)
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval>

onMounted(() => { ticker = setInterval(() => { now.value = Date.now() }, 30_000) })
onUnmounted(() => clearInterval(ticker))

const STAGES: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered']

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
const statusIcon: Record<string, string> = {
  pending: '⏳', preparing: '☕', ready: '✅', delivered: '🚀', cancelled: '✕'
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

const activeOrders = computed(() =>
  store.orders
    .filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready')
    .slice(0, 5)
)

function stageIndex(s: OrderStatus) { return STAGES.indexOf(s) }

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function advanceStatus(id: string, next: OrderStatus) {
  store.updateStatus(id, next)
}
</script>

<template>
  <div class="page">

    <!-- ── Live Pipeline Bar ── -->
    <div class="pipeline-card">
      <div class="pipeline-header">
        <div class="live-dot"></div>
        <span class="pipeline-title">Live Kitchen Status</span>
        <span class="pipeline-sub">{{ activeOrders.length }} active order{{ activeOrders.length !== 1 ? 's' : '' }}</span>
      </div>

      <div v-if="activeOrders.length === 0" class="pipeline-empty">
        All caught up — no active orders right now.
      </div>

      <div v-else class="pipeline-rows">
        <div v-for="o in activeOrders" :key="o.id" class="pipeline-row">
          <div class="pr-id">#{{ o.id.slice(-5).toUpperCase() }}</div>
          <div class="pr-name">{{ o.customer.name }}</div>
          <div class="pr-steps">
            <template v-for="(stage, si) in STAGES" :key="stage">
              <div class="pr-step"
                :class="{
                  done:    stageIndex(o.status) > si,
                  current: o.status === stage,
                  future:  stageIndex(o.status) < si,
                }">
                <span class="step-dot"></span>
                <span class="step-label">{{ stage }}</span>
              </div>
              <div v-if="si < STAGES.length - 1" class="pr-line"
                :class="{ filled: stageIndex(o.status) > si }">
              </div>
            </template>
          </div>
          <button v-if="nextStatus[o.status]"
            class="pr-advance"
            @click="store.updateStatus(o.id, nextStatus[o.status]!)"
          >→ {{ nextStatus[o.status] }}</button>
        </div>
      </div>
    </div>

    <!-- ── Summary Cards ── -->
    <div class="summary-cards">
      <div class="sum-card pending">
        <div class="sum-icon">⏳</div>
        <div class="sum-val">{{ summary.pending }}</div>
        <div class="sum-label">Pending</div>
      </div>
      <div class="sum-card preparing">
        <div class="sum-icon">☕</div>
        <div class="sum-val">{{ summary.preparing }}</div>
        <div class="sum-label">Preparing</div>
      </div>
      <div class="sum-card ready">
        <div class="sum-icon">✅</div>
        <div class="sum-val">{{ summary.ready }}</div>
        <div class="sum-label">Ready</div>
      </div>
      <div class="sum-card delivered">
        <div class="sum-icon">🚀</div>
        <div class="sum-val">{{ summary.delivered }}</div>
        <div class="sum-label">Delivered</div>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: tab === t.key }" @click="tab = t.key">
        {{ t.label }}
        <span v-if="t.key !== 'all' && t.key !== 'cancelled' && summary[t.key as keyof typeof summary]"
          class="tab-count" :style="{ background: statusColor[t.key] }">
          {{ summary[t.key as keyof typeof summary] }}
        </span>
      </button>
    </div>

    <!-- ── Table ── -->
    <div class="panel">
      <table class="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="o in filtered" :key="o.id">
            <tr class="order-row" :class="{ expanded: expandedId === o.id }" @click="toggleExpand(o.id)">
              <td class="expand-cell">
                <span class="expand-icon">{{ expandedId === o.id ? '▾' : '▸' }}</span>
              </td>
              <td class="mono">#{{ o.id.slice(-6).toUpperCase() }}</td>
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
              <td class="muted">{{ o.items.length }} item{{ o.items.length !== 1 ? 's' : '' }}</td>
              <td class="bold">£{{ o.total.toFixed(2) }}</td>
              <td>
                <span class="status-pill" :style="{ background: statusColor[o.status] + '22', color: statusColor[o.status] }">
                  {{ statusIcon[o.status] }} {{ o.status }}
                </span>
              </td>
              <td @click.stop>
                <div class="actions">
                  <button v-if="nextStatus[o.status]" class="act-btn advance"
                    @click="advanceStatus(o.id, nextStatus[o.status]!)">
                    → {{ nextStatus[o.status] }}
                  </button>
                  <button v-if="o.status !== 'cancelled' && o.status !== 'delivered'" class="act-btn cancel"
                    @click="store.updateStatus(o.id, 'cancelled')">
                    Cancel
                  </button>
                </div>
              </td>
            </tr>

            <!-- Expanded detail row -->
            <tr v-if="expandedId === o.id" class="detail-row">
              <td colspan="8" class="detail-cell">
                <div class="detail-inner">

                  <!-- Status pipeline -->
                  <div class="detail-pipeline">
                    <template v-for="(stage, si) in STAGES" :key="stage">
                      <div class="dp-step"
                        :class="{
                          done:    stageIndex(o.status) > si,
                          current: o.status === stage,
                          future:  stageIndex(o.status) < si,
                        }">
                        <div class="dp-dot"></div>
                        <div class="dp-label">{{ stage }}</div>
                      </div>
                      <div v-if="si < STAGES.length - 1" class="dp-line"
                        :class="{ filled: stageIndex(o.status) > si }"></div>
                    </template>
                  </div>

                  <!-- Order items -->
                  <div class="detail-items">
                    <div v-for="item in o.items" :key="`${item.productId}-${item.size}-${item.name}`" class="detail-item">
                      <div class="di-icon">☕</div>
                      <div class="di-info">
                        <span class="di-name">{{ item.name }}</span>
                        <span class="di-size">{{ SIZE_NAME[item.size] }}</span>
                      </div>
                      <span class="di-qty">× {{ item.qty }}</span>
                      <span class="di-price">£{{ (item.price * item.qty).toFixed(2) }}</span>
                    </div>
                  </div>

                  <!-- Delivery address -->
                  <div class="detail-addr">
                    <strong>Deliver to:</strong>
                    {{ o.customer.address }}, {{ o.customer.city }}
                    &nbsp;·&nbsp;{{ o.customer.phone }}
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="filtered.length === 0">
            <td colspan="8" class="empty">No orders found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 18px; }

/* ── Live Pipeline ── */
.pipeline-card { background: #0f1c0f; border-radius: 14px; padding: 20px 22px; }
.pipeline-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.live-dot {
  width: 9px; height: 9px; border-radius: 50%; background: #22c55e; flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(34,197,94,0.5);
  animation: pulse-green 1.6s ease infinite;
}
@keyframes pulse-green {
  0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
  70%  { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
}
.pipeline-title { font-size: 14px; font-weight: 800; color: #fdf6ec; }
.pipeline-sub   { font-size: 12px; color: #4ade80; margin-left: auto; }
.pipeline-empty { font-size: 13px; color: #4b5563; text-align: center; padding: 12px 0; }

.pipeline-rows  { display: flex; flex-direction: column; gap: 10px; }
.pipeline-row   { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 14px; }
.pr-id   { font-family: monospace; font-size: 11px; color: #d4a060; font-weight: 700; min-width: 60px; }
.pr-name { font-size: 12px; color: #fdf6ec; font-weight: 600; min-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pr-steps { display: flex; align-items: center; flex: 1; }
.pr-step  { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.step-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #374151; border: 2px solid #4b5563;
  transition: all 0.3s;
}
.pr-step.done    .step-dot { background: #22c55e; border-color: #22c55e; }
.pr-step.current .step-dot { background: #d4a060; border-color: #d4a060; box-shadow: 0 0 0 4px rgba(212,160,96,0.25); animation: pulse-gold 1.4s infinite; }
.pr-step.future  .step-dot { background: #1f2937; border-color: #374151; }
@keyframes pulse-gold {
  0%,100% { box-shadow: 0 0 0 3px rgba(212,160,96,0.25); }
  50%      { box-shadow: 0 0 0 7px rgba(212,160,96,0.08); }
}
.step-label { font-size: 9px; font-weight: 600; text-transform: capitalize; color: #6b7280; white-space: nowrap; }
.pr-step.current .step-label { color: #d4a060; }
.pr-step.done    .step-label { color: #4ade80; }
.pr-line { flex: 1; height: 2px; background: #374151; margin: 0 3px; margin-bottom: 12px; transition: background 0.3s; }
.pr-line.filled  { background: #22c55e; }
.pr-advance { flex-shrink: 0; padding: 5px 12px; background: rgba(212,160,96,0.15); border: 1px solid rgba(212,160,96,0.4); border-radius: 7px; color: #d4a060; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.pr-advance:hover { background: rgba(212,160,96,0.28); }

/* ── Summary Cards ── */
.summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.sum-card { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid #f0ebe4; text-align: center; }
.sum-icon  { font-size: 20px; margin-bottom: 6px; }
.sum-val   { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
.sum-label { font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
.sum-card.pending   .sum-val { color: #f59e0b; }
.sum-card.preparing .sum-val { color: #3b82f6; }
.sum-card.ready     .sum-val { color: #8b5cf6; }
.sum-card.delivered .sum-val { color: #10b981; }

/* ── Tabs ── */
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab { padding: 7px 16px; border-radius: 8px; border: 1px solid #e7e5e4; background: #fff; font-size: 13px; cursor: pointer; color: #78716c; display: flex; align-items: center; gap: 6px; }
.tab.active { background: #1a0a04; color: #d4a060; border-color: #1a0a04; font-weight: 600; }
.tab-count { border-radius: 10px; padding: 1px 6px; font-size: 10px; font-weight: 800; color: #fff; }

/* ── Panel / Table ── */
.panel { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #f0ebe4; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 760px; }
.data-table th { text-align: left; padding: 10px 12px; font-size: 11px; color: #a8a29e; border-bottom: 1px solid #f5f0ea; text-transform: uppercase; letter-spacing: 0.05em; }
.data-table td { padding: 13px 12px; border-bottom: 1px solid #faf7f2; vertical-align: middle; }

.order-row { cursor: pointer; transition: background 0.12s; }
.order-row:hover { background: #fdf9f5; }
.order-row.expanded { background: #fdf3e7; }
.expand-cell { width: 28px; }
.expand-icon { font-size: 11px; color: #a8a29e; }

.mono { font-family: monospace; font-size: 12px; color: #78716c; }
.muted { color: #78716c; font-size: 13px; }
.bold { font-weight: 700; color: #1c1917; }
.cust-cell   { display: flex; align-items: center; gap: 10px; }
.cust-avatar { width: 32px; height: 32px; border-radius: 50%; background: #d4a060; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cust-name   { font-size: 13px; font-weight: 600; color: #1c1917; }
.cust-email  { font-size: 11px; color: #a8a29e; }
.status-pill { border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; white-space: nowrap; }
.actions     { display: flex; gap: 6px; flex-wrap: wrap; }
.act-btn     { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid; white-space: nowrap; }
.act-btn.advance { background: #fdf3e7; color: #92400e; border-color: #fcd34d; }
.act-btn.advance:hover { background: #fef3c7; }
.act-btn.cancel  { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
.act-btn.cancel:hover  { background: #fecaca; }

/* ── Expanded Detail ── */
.detail-row td { padding: 0; border-bottom: 1px solid #fdf3e7; }
.detail-cell   { background: #fffbf5; }
.detail-inner  { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 14px; }

/* Detail pipeline */
.detail-pipeline { display: flex; align-items: center; }
.dp-step  { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.dp-dot   { width: 14px; height: 14px; border-radius: 50%; background: #e7e5e4; border: 2px solid #d1ccc5; transition: all 0.3s; }
.dp-step.done    .dp-dot { background: #22c55e; border-color: #22c55e; }
.dp-step.current .dp-dot { background: #d4a060; border-color: #d4a060; box-shadow: 0 0 0 5px rgba(212,160,96,0.2); animation: pulse-gold 1.4s infinite; }
.dp-label { font-size: 10px; font-weight: 700; text-transform: capitalize; color: #a8a29e; }
.dp-step.done    .dp-label { color: #16a34a; }
.dp-step.current .dp-label { color: #92400e; }
.dp-line  { flex: 1; height: 2px; background: #e7e5e4; margin: 0 6px; margin-bottom: 14px; }
.dp-line.filled  { background: #22c55e; }

/* Detail items */
.detail-items { display: flex; flex-direction: column; gap: 6px; }
.no-items { font-size: 12px; color: #a8a29e; }
.detail-item { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 9px; padding: 8px 12px; border: 1px solid #f0ebe4; }
.di-icon { width: 34px; height: 34px; border-radius: 8px; background: linear-gradient(135deg, #1a0a04, #3d1a08); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.di-info { flex: 1; display: flex; align-items: center; gap: 8px; }
.di-name { font-size: 13px; font-weight: 600; color: #1c1917; }
.di-size { font-size: 10px; font-weight: 800; background: #1c1917; color: #d4a060; border-radius: 4px; padding: 1px 6px; }
.di-qty  { font-size: 12px; color: #78716c; white-space: nowrap; }
.di-price{ font-size: 13px; font-weight: 700; color: #1c1917; white-space: nowrap; min-width: 56px; text-align: right; }

.detail-addr { font-size: 12px; color: #78716c; background: #fff; border-radius: 8px; padding: 10px 14px; border: 1px solid #f0ebe4; }
.detail-addr strong { color: #1c1917; }

.empty { text-align: center; padding: 40px; color: #a8a29e; }
</style>