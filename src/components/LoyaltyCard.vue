<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const TOTAL = 9
const KEY   = 'fc_loyalty_stamps'

const stamps = ref(0)
const celebrating = ref(false)

onMounted(() => {
  stamps.value = parseInt(localStorage.getItem(KEY) ?? '0', 10)
})

const progress = computed(() => Math.min(stamps.value % TOTAL, TOTAL))
const earned   = computed(() => Math.floor(stamps.value / TOTAL))

function addStamp() {
  if (celebrating.value) return
  stamps.value++
  localStorage.setItem(KEY, String(stamps.value))
  if (stamps.value % TOTAL === 0) {
    celebrating.value = true
    setTimeout(() => celebrating.value = false, 3000)
  }
}

function reset() {
  stamps.value = 0
  localStorage.removeItem(KEY)
}
</script>

<template>
  <section class="loyalty-section">
    <div class="loyalty-inner">

      <div class="loyalty-header">
        <p class="loyalty-eyebrow">Loyalty Rewards</p>
        <h2 class="loyalty-title">Drink 9, Get 1 Free</h2>
        <p class="loyalty-sub">Every coffee you order earns a stamp. Collect 9 and your next one is on us.</p>
      </div>

      <!-- Celebration overlay -->
      <div v-if="celebrating" class="celebrate">
        <div class="cel-icon">🎉</div>
        <div class="cel-text">You earned a FREE coffee!</div>
        <div class="cel-sub">Show this screen at the counter.</div>
      </div>

      <div class="card" :class="{ glow: celebrating }">

        <!-- Card header -->
        <div class="card-top">
          <div class="card-brand">4ever Coffee</div>
          <div class="card-earned" v-if="earned > 0">
            <span class="earned-num">{{ earned }}</span>
            <span class="earned-label">free coffee{{ earned > 1 ? 's' : '' }} earned</span>
          </div>
        </div>

        <!-- Stamp grid -->
        <div class="stamps-grid">
          <div
            v-for="i in TOTAL"
            :key="i"
            class="stamp"
            :class="{ filled: i <= progress, next: i === progress + 1 && progress < TOTAL }"
          >
            <span v-if="i <= progress" class="stamp-icon">☕</span>
            <span v-else-if="i === progress + 1 && progress < TOTAL" class="stamp-next">+</span>
            <span v-else class="stamp-empty">○</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="card-prog-wrap">
          <div class="card-prog-bar" :style="{ width: (progress / TOTAL * 100) + '%' }"></div>
        </div>
        <div class="card-prog-label">{{ progress }} / {{ TOTAL }} stamps — {{ TOTAL - progress }} more for a free coffee</div>

        <!-- Actions -->
        <div class="card-actions">
          <button class="stamp-btn" @click="addStamp">
            + Stamp after purchase
          </button>
          <button class="reset-btn" @click="reset" title="Reset stamps">↺</button>
        </div>
      </div>

      <p class="loyalty-note">Present your digital card at any 4ever Coffee location.</p>
    </div>
  </section>
</template>

<style scoped>
.loyalty-section { background: #1a0a04; padding: 80px 24px; }
.loyalty-inner   { max-width: 620px; margin: 0 auto; text-align: center; }

.loyalty-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d4a060; margin: 0 0 10px; }
.loyalty-title   { font-size: clamp(24px, 4vw, 38px); font-weight: 900; color: #fdf6ec; margin: 0 0 10px; letter-spacing: -1px; }
.loyalty-sub     { font-size: 14px; color: #78716c; line-height: 1.65; margin: 0 0 36px; }

/* Celebration */
.celebrate {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,0.8);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: fade-in 0.3s ease;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.cel-icon { font-size: 72px; animation: bounce 0.6s ease infinite alternate; }
@keyframes bounce { to { transform: translateY(-16px); } }
.cel-text { font-size: 28px; font-weight: 900; color: #fdf6ec; margin: 16px 0 8px; }
.cel-sub  { font-size: 15px; color: #d4a060; }

/* Card */
.card {
  background: linear-gradient(145deg, #2c1008, #1a0a04);
  border: 1px solid rgba(212,160,96,0.3);
  border-radius: 24px; padding: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  transition: box-shadow 0.4s, border-color 0.4s;
}
.card.glow {
  border-color: #d4a060;
  box-shadow: 0 0 0 3px rgba(212,160,96,0.25), 0 20px 60px rgba(0,0,0,0.5);
}

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.card-brand { font-size: 18px; font-weight: 900; color: #d4a060; letter-spacing: -0.5px; }
.card-earned { display: flex; align-items: center; gap: 6px; background: rgba(212,160,96,0.15); border: 1px solid rgba(212,160,96,0.3); border-radius: 20px; padding: 5px 12px; }
.earned-num   { font-size: 18px; font-weight: 900; color: #d4a060; }
.earned-label { font-size: 11px; color: #a8a29e; font-weight: 600; }

.stamps-grid {
  display: grid; grid-template-columns: repeat(9, 1fr); gap: 8px;
  margin-bottom: 18px;
}
.stamp {
  aspect-ratio: 1; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; border: 2px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  transition: all 0.3s;
}
.stamp.filled {
  background: linear-gradient(145deg, #c8813a, #d4a060);
  border-color: #d4a060;
  box-shadow: 0 4px 12px rgba(200,129,58,0.35);
  animation: stamp-pop 0.3s ease;
}
@keyframes stamp-pop {
  0%   { transform: scale(0.7); }
  70%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
.stamp.next { border-color: rgba(212,160,96,0.5); background: rgba(212,160,96,0.08); }
.stamp-icon  { font-size: 16px; }
.stamp-next  { font-size: 18px; font-weight: 900; color: #d4a060; }
.stamp-empty { font-size: 16px; color: rgba(255,255,255,0.1); }

.card-prog-wrap { height: 5px; background: rgba(255,255,255,0.07); border-radius: 5px; margin-bottom: 8px; overflow: hidden; }
.card-prog-bar  { height: 100%; background: linear-gradient(90deg, #c8813a, #d4a060); border-radius: 5px; transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.card-prog-label { font-size: 12px; color: #78716c; margin-bottom: 22px; }

.card-actions { display: flex; gap: 10px; justify-content: center; }
.stamp-btn {
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 12px;
  padding: 13px 28px; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 6px 20px rgba(200,129,58,0.35);
}
.stamp-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,129,58,0.5); }
.reset-btn {
  width: 44px; height: 44px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05); color: #57534e;
  font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; align-self: center;
}
.reset-btn:hover { border-color: rgba(255,255,255,0.2); color: #a8a29e; }

.loyalty-note { font-size: 12px; color: #44403c; margin-top: 20px; }
</style>
