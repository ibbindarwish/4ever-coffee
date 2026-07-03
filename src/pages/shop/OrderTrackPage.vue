<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '../../stores/orders'
import type { Order } from '../../stores/orders'

const route  = useRoute()
const store  = useOrdersStore()

const query   = ref((route.query.id as string) ?? '')
const order   = ref<Order | null>(null)
const notFound = ref(false)

const STEPS = [
  { key: 'pending',   label: 'Order Received', icon: '✓',  desc: 'We have your order' },
  { key: 'preparing', label: 'Preparing',       icon: '☕', desc: 'Being crafted now'  },
  { key: 'ready',     label: 'Ready',           icon: '🎉', desc: 'Ready for delivery' },
  { key: 'delivered', label: 'Delivered',       icon: '🚴', desc: 'On its way to you'  },
]

const STATUS_ORDER = ['pending', 'preparing', 'ready', 'delivered']

const currentStep = computed(() =>
  order.value ? STATUS_ORDER.indexOf(order.value.status) : -1
)

const eta = computed(() => {
  if (!order.value) return ''
  const etaMap: Record<string, string> = {
    pending:   'Est. 25 – 40 min',
    preparing: 'Est. 15 – 25 min',
    ready:     'Est. 5 – 10 min',
    delivered: 'Delivered!',
    cancelled: 'Order cancelled',
  }
  return etaMap[order.value.status] ?? ''
})

function search() {
  notFound.value = false
  order.value = null
  if (!query.value.trim()) return
  const found = store.findById(query.value)
  if (found) { order.value = found }
  else { notFound.value = true }
}

let refreshTimer: ReturnType<typeof setInterval>

onMounted(() => {
  if (query.value) search()
  refreshTimer = setInterval(() => {
    if (order.value) {
      const fresh = store.findById(order.value.id)
      if (fresh) order.value = fresh
    }
  }, 8000)
})

onUnmounted(() => clearInterval(refreshTimer))
</script>

<template>
  <div class="track-page">

    <!-- Hero -->
    <div class="track-hero">
      <div class="track-hero-inner">
        <p class="track-eyebrow">4ever Coffee</p>
        <h1 class="track-title">Track Your Order</h1>
        <p class="track-sub">Enter your order ID to see live status updates</p>

        <div class="search-bar">
          <input
            v-model="query"
            class="track-input"
            placeholder="e.g. ORD-1004"
            @keydown.enter="search"
          />
          <button class="track-btn" @click="search">Track →</button>
        </div>

        <p v-if="notFound" class="not-found">
          Order not found. Please check your order ID and try again.
        </p>
      </div>
    </div>

    <!-- Result -->
    <div v-if="order" class="result-wrap">
      <div class="result-inner">

        <!-- Status card -->
        <div class="status-card" :class="order.status">
          <div class="status-top">
            <div>
              <div class="order-id">{{ order.id }}</div>
              <div class="order-date">Placed on {{ order.date }}</div>
            </div>
            <div class="eta-pill" :class="order.status">{{ eta }}</div>
          </div>

          <!-- Progress steps -->
          <div class="steps" v-if="order.status !== 'cancelled'">
            <template v-for="(step, i) in STEPS" :key="step.key">
              <div class="step" :class="{
                done:   i < currentStep,
                active: i === currentStep,
                future: i > currentStep
              }">
                <div class="step-circle">
                  <span v-if="i < currentStep" class="step-check">✓</span>
                  <span v-else>{{ step.icon }}</span>
                </div>
                <div class="step-label">{{ step.label }}</div>
                <div class="step-desc">{{ step.desc }}</div>
              </div>
              <div v-if="i < STEPS.length - 1" class="step-line" :class="{ filled: i < currentStep }"></div>
            </template>
          </div>

          <div v-else class="cancelled-msg">
            ✕ This order has been cancelled.
          </div>
        </div>

        <!-- Order details -->
        <div class="details-grid">

          <!-- Items -->
          <div class="detail-panel">
            <h3 class="dp-title">Items Ordered</h3>
            <div v-if="order.items.length === 0" class="dp-empty">
              Items unavailable for demo orders
            </div>
            <div v-for="item in order.items" :key="item.product.id" class="item-row">
              <div class="item-img">
                <div class="item-img-bg" :style="{ background: item.product.gradient }"></div>
                <img :src="item.product.image" :alt="item.product.name" class="item-photo"
                     @error="() => {}"/>
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.product.name }}</div>
                <div class="item-meta">× {{ item.qty }}</div>
              </div>
              <div class="item-price">£{{ (item.product.price * item.qty).toFixed(2) }}</div>
            </div>
          </div>

          <!-- Summary + Customer -->
          <div>
            <!-- Price summary -->
            <div class="detail-panel" style="margin-bottom: 16px;">
              <h3 class="dp-title">Order Summary</h3>
              <div class="sum-row"><span>Subtotal</span><span>£{{ order.subtotal.toFixed(2) }}</span></div>
              <div v-if="order.discount" class="sum-row green">
                <span>Promo ({{ order.promoCode }})</span>
                <span>−£{{ order.discount.toFixed(2) }}</span>
              </div>
              <div class="sum-row"><span>Delivery</span>
                <span :class="{ green: order.shipping === 0 }">
                  {{ order.shipping === 0 ? 'FREE' : '£' + order.shipping.toFixed(2) }}
                </span>
              </div>
              <div class="sum-total"><span>Total</span><span>£{{ order.total.toFixed(2) }}</span></div>
            </div>

            <!-- Customer info -->
            <div class="detail-panel">
              <h3 class="dp-title">Delivery To</h3>
              <div class="cust-name">{{ order.customer.name }}</div>
              <div class="cust-line">{{ order.customer.address }}</div>
              <div class="cust-line">{{ order.customer.city }}</div>
              <div class="cust-line">{{ order.customer.phone }}</div>
            </div>
          </div>
        </div>

        <p class="refresh-note">Status updates every 8 seconds automatically</p>

      </div>
    </div>

  </div>
</template>

<style scoped>
.track-page { min-height: 70vh; }

/* Hero */
.track-hero {
  background:
    linear-gradient(135deg, rgba(10,4,2,0.88), rgba(28,12,4,0.82)),
    url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1400&fit=crop&auto=format&q=70') center/cover no-repeat;
  padding: 80px 24px 60px;
}
.track-hero-inner { max-width: 560px; margin: 0 auto; text-align: center; }
.track-eyebrow { font-size: 12px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 12px; }
.track-title   { font-size: clamp(32px,5vw,52px); font-weight: 900; color: #fdf6ec; margin: 0 0 12px; letter-spacing: -1.5px; }
.track-sub     { font-size: 15px; color: #a8a29e; margin: 0 0 32px; }

.search-bar  { display: flex; gap: 0; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.track-input { flex: 1; padding: 16px 20px; border: none; outline: none; font-size: 16px; background: #fff; color: #1c1917; }
.track-input::placeholder { color: #a8a29e; }
.track-btn   { padding: 16px 28px; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; font-size: 15px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: opacity 0.15s; }
.track-btn:hover { opacity: 0.9; }

.not-found { margin-top: 16px; color: #fca5a5; font-size: 14px; font-weight: 500; }

/* Result */
.result-wrap  { background: #faf7f2; padding: 48px 24px 72px; }
.result-inner { max-width: 960px; margin: 0 auto; }

/* Status card */
.status-card {
  background: #fff; border-radius: 20px; padding: 28px 32px 36px;
  margin-bottom: 24px; border: 1px solid #f0ebe4;
  box-shadow: 0 4px 20px rgba(44,16,8,0.07);
}
.status-top  { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 12px; }
.order-id    { font-size: 20px; font-weight: 900; color: #1c1917; letter-spacing: -0.5px; }
.order-date  { font-size: 13px; color: #a8a29e; margin-top: 4px; }

.eta-pill { border-radius: 20px; padding: 8px 18px; font-size: 13px; font-weight: 700; }
.eta-pill.pending   { background: #fef3c7; color: #92400e; }
.eta-pill.preparing { background: #dbeafe; color: #1e40af; }
.eta-pill.ready     { background: #d1fae5; color: #065f46; }
.eta-pill.delivered { background: #d1fae5; color: #065f46; }
.eta-pill.cancelled { background: #fee2e2; color: #991b1b; }

/* Steps */
.steps { display: flex; align-items: flex-start; gap: 0; }
.step  { display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1; position: relative; }
.step-circle {
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; margin-bottom: 10px;
  border: 2.5px solid #e7e5e4; background: #fff; color: #a8a29e;
  transition: all 0.3s;
}
.step.done   .step-circle { background: #d1fae5; border-color: #22c55e; color: #15803d; font-size: 16px; }
.step.active .step-circle { background: linear-gradient(135deg,#c8813a,#d4a060); border-color: #d4a060; color: #fff; box-shadow: 0 4px 16px rgba(200,129,58,0.4); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 4px 16px rgba(200,129,58,0.4)} 50%{box-shadow:0 4px 28px rgba(200,129,58,0.7)} }
.step.future .step-circle { opacity: 0.35; }
.step-label { font-size: 12px; font-weight: 700; color: #1c1917; margin-bottom: 2px; }
.step.future .step-label { color: #a8a29e; }
.step-desc  { font-size: 11px; color: #a8a29e; }

.step-line { flex: 1; height: 2.5px; background: #e7e5e4; margin-top: 22px; align-self: flex-start; transition: background 0.3s; }
.step-line.filled { background: linear-gradient(90deg,#22c55e,#d4a060); }

.cancelled-msg { text-align: center; font-size: 15px; font-weight: 600; color: #ef4444; padding: 20px 0; }

/* Details grid */
.details-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
@media (max-width: 760px) { .details-grid { grid-template-columns: 1fr; } }

.detail-panel { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 20px 22px; }
.dp-title { font-size: 13px; font-weight: 700; color: #1c1917; margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid #f5f0ea; text-transform: uppercase; letter-spacing: 0.06em; }
.dp-empty { font-size: 13px; color: #a8a29e; font-style: italic; }

.item-row  { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #faf7f2; }
.item-img  { width: 48px; height: 48px; border-radius: 8px; flex-shrink: 0; position: relative; overflow: hidden; }
.item-img-bg { position: absolute; inset: 0; }
.item-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 13px; font-weight: 600; color: #1c1917; }
.item-meta { font-size: 11px; color: #a8a29e; }
.item-price { font-size: 14px; font-weight: 700; color: #1c1917; }

.sum-row  { display: flex; justify-content: space-between; font-size: 13px; color: #57534e; padding: 6px 0; }
.sum-row.green span { color: #16a34a; font-weight: 600; }
.sum-row .green { color: #16a34a; font-weight: 600; }
.sum-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #1c1917; padding: 12px 0 0; border-top: 2px solid #f0ebe4; margin-top: 6px; }

.cust-name { font-size: 14px; font-weight: 700; color: #1c1917; margin-bottom: 6px; }
.cust-line { font-size: 13px; color: #57534e; line-height: 1.7; }

.refresh-note { text-align: center; font-size: 12px; color: #a8a29e; margin-top: 24px; }
</style>