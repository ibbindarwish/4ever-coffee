<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const cart = useCartStore()
const store = useProductsStore()

const deal = computed(() => store.products.find(p => p.id === 6))
const salePrice = computed(() => deal.value ? (deal.value.price * 0.8).toFixed(2) : '0')

const h = ref('00'), m = ref('00'), s = ref('00')
let timer: ReturnType<typeof setInterval>

function tick() {
  const now = new Date()
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  h.value = String(Math.floor(diff / 3_600_000)).padStart(2, '0')
  m.value = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0')
  s.value = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0')
}

onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))

const added = ref(false)
function order() {
  if (!deal.value || added.value) return
  cart.addToCart(deal.value)
  added.value = true
  setTimeout(() => added.value = false, 2200)
}
</script>

<template>
  <section class="deal" v-if="deal">
    <div class="deal-inner">

      <div class="deal-left">
        <div class="deal-pill">⚡ Today's Special Deal</div>
        <h2 class="deal-title">{{ deal.name }}</h2>
        <p class="deal-desc">{{ deal.description }}</p>

        <div class="deal-pricing">
          <span class="deal-now">£{{ salePrice }}</span>
          <span class="deal-was">£{{ deal.price.toFixed(2) }}</span>
          <span class="deal-pct">20% OFF</span>
        </div>

        <div class="deal-timer">
          <span class="timer-label">Ends in</span>
          <div class="timer-blocks">
            <div class="tblock"><div class="tnum">{{ h }}</div><div class="tunit">HRS</div></div>
            <div class="tsep">:</div>
            <div class="tblock"><div class="tnum">{{ m }}</div><div class="tunit">MIN</div></div>
            <div class="tsep">:</div>
            <div class="tblock"><div class="tnum">{{ s }}</div><div class="tunit">SEC</div></div>
          </div>
        </div>

        <button class="deal-btn" :class="{ done: added }" @click="order">
          <span v-if="added">✓ Added to Cart!</span>
          <span v-else>Order Now — £{{ salePrice }}</span>
        </button>
      </div>

      <div class="deal-right">
        <div class="deal-glow-ring"></div>
        <div class="deal-cup-wrap">
          <div class="deal-cup-bg" :style="{ background: deal.gradient }"></div>
          <img :src="deal.image" :alt="deal.name" class="deal-photo"
               @error="() => {}"/>
        </div>
        <div class="deal-tag">Only today!</div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.deal {
  background: linear-gradient(135deg, #0d0603 0%, #1a0a04 50%, #2c1008 100%);
  padding: 64px 24px;
  position: relative;
  overflow: hidden;
}
.deal::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(200,129,58,0.22) 0%, transparent 70%);
  top: -200px; right: -100px;
  pointer-events: none;
}
.deal-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto;
  gap: 48px; align-items: center;
}
@media (max-width: 768px) {
  .deal-inner { grid-template-columns: 1fr; }
  .deal-right { display: flex; justify-content: center; }
}

.deal-pill {
  display: inline-flex; align-items: center;
  background: rgba(200,129,58,0.18);
  border: 1px solid rgba(200,129,58,0.4);
  color: #d4a060; font-size: 12px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 6px 14px; border-radius: 20px; margin-bottom: 18px;
  animation: pulse-glow 2s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,129,58,0); }
  50% { box-shadow: 0 0 0 6px rgba(200,129,58,0.12); }
}

.deal-title { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #fdf6ec; margin: 0 0 10px; letter-spacing: -1.5px; }
.deal-desc  { font-size: 15px; color: #a8a29e; line-height: 1.65; margin: 0 0 24px; }

.deal-pricing { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.deal-now { font-size: 42px; font-weight: 900; color: #d4a060; letter-spacing: -1px; }
.deal-was { font-size: 20px; color: #57534e; text-decoration: line-through; }
.deal-pct { background: #dc2626; color: #fff; font-size: 13px; font-weight: 800; padding: 4px 10px; border-radius: 8px; letter-spacing: 0.04em; }

.deal-timer { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.timer-label { font-size: 12px; font-weight: 600; color: #78716c; text-transform: uppercase; letter-spacing: 0.08em; }
.timer-blocks { display: flex; align-items: center; gap: 6px; }
.tblock { display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; min-width: 54px; }
.tnum { font-size: 26px; font-weight: 900; color: #fdf6ec; line-height: 1; font-variant-numeric: tabular-nums; }
.tunit { font-size: 9px; font-weight: 700; color: #57534e; letter-spacing: 0.1em; margin-top: 4px; }
.tsep { font-size: 24px; font-weight: 800; color: #d4a060; margin-bottom: 12px; }

.deal-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 15px 36px; border-radius: 14px; border: none; cursor: pointer;
  font-size: 16px; font-weight: 800; letter-spacing: 0.02em;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff;
  box-shadow: 0 8px 30px rgba(200,129,58,0.45);
  transition: all 0.25s;
}
.deal-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(200,129,58,0.6); }
.deal-btn.done { background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 8px 30px rgba(16,185,129,0.4); }

.deal-right { position: relative; display: flex; align-items: center; justify-content: center; }
.deal-glow-ring {
  position: absolute;
  width: 240px; height: 240px; border-radius: 50%;
  border: 1px solid rgba(212,160,96,0.25);
  animation: spin-ring 8s linear infinite;
}
.deal-glow-ring::before {
  content: '';
  position: absolute; inset: 20px; border-radius: 50%;
  border: 1px solid rgba(212,160,96,0.15);
}
@keyframes spin-ring { to { transform: rotate(360deg); } }

.deal-cup-wrap {
  width: 220px; height: 220px; border-radius: 24px;
  overflow: hidden; position: relative; z-index: 1;
  box-shadow: 0 24px 60px rgba(0,0,0,0.55);
  animation: float 3s ease-in-out infinite;
}
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.deal-cup-bg { position: absolute; inset: 0; }
.deal-photo  { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.deal-tag {
  position: absolute; top: -10px; right: -10px;
  background: #dc2626; color: #fff;
  font-size: 11px; font-weight: 800;
  padding: 5px 10px; border-radius: 8px;
  transform: rotate(12deg);
  box-shadow: 0 4px 12px rgba(220,38,38,0.4);
  z-index: 2;
}
</style>
