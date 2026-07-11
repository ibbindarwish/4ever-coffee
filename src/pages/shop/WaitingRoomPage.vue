<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Drop {
  id: string; name: string; bean: string; flag: string; origin: string
  price: string; kgAvailable: number; dropDate: Date; description: string
}

const DROPS: Drop[] = [
  {
    id: 'd1', name: 'The Panama Drop', bean: 'Panama Geisha Natural', flag: '🇵🇦', origin: 'Panama — Boquete',
    price: '£28 / 100g', kgAvailable: 3.5, dropDate: new Date(2026, 6, 15, 10, 0, 0),
    description: 'Only 3.5kg available. Natural-processed Geisha from Hacienda La Esmeralda — the most talked-about lot we\'ve ever sourced.',
  },
  {
    id: 'd2', name: 'Yemen Reserve', bean: 'Yemen Mokha Harazi', flag: '🇾🇪', origin: 'Yemen — Haraz Mountains',
    price: '£22 / 100g', kgAvailable: 5, dropDate: new Date(2026, 6, 20, 10, 0, 0),
    description: '5kg only. Hand-picked from terraced gardens at 2,400m. The most authentic Mokha we\'ve ever had access to.',
  },
]

const queueMap = ref<Record<string, boolean>>({})
const now = ref(new Date())
let timer: ReturnType<typeof setInterval>

onMounted(() => { timer = setInterval(() => now.value = new Date(), 1000) })
onUnmounted(() => clearInterval(timer))

function timeUntil(drop: Drop) {
  const diff = drop.dropDate.getTime() - now.value.getTime()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

function joinQueue(id: string) { queueMap.value[id] = true }
function isQueued(id: string) { return !!queueMap.value[id] }
</script>

<template>
  <div class="wr-page">
    <div class="wr-hero">
      <p class="wr-eyebrow">Limited Release</p>
      <h1 class="wr-headline">The Waiting Room</h1>
      <p class="wr-sub">Rare lots. Tiny quantities. When they're gone, they're gone.</p>
    </div>

    <div class="wr-body">
      <div v-for="drop in DROPS" :key="drop.id" class="drop-card">
        <div class="drop-left">
          <div class="drop-flag">{{ drop.flag }}</div>
          <div class="drop-info">
            <div class="drop-name">{{ drop.name }}</div>
            <div class="drop-bean">{{ drop.bean }}</div>
            <div class="drop-origin">{{ drop.origin }}</div>
            <p class="drop-desc">{{ drop.description }}</p>
            <div class="drop-meta">
              <span class="meta-chip">{{ drop.kgAvailable }}kg available</span>
              <span class="meta-chip price-chip">{{ drop.price }}</span>
            </div>
          </div>
        </div>
        <div class="drop-right">
          <template v-if="timeUntil(drop)">
            <div class="countdown-label">Drop goes live in</div>
            <div class="countdown">
              <div class="cd-block">
                <span class="cd-num">{{ String(timeUntil(drop)!.d).padStart(2,'0') }}</span>
                <span class="cd-unit">Days</span>
              </div>
              <span class="cd-sep">:</span>
              <div class="cd-block">
                <span class="cd-num">{{ String(timeUntil(drop)!.h).padStart(2,'0') }}</span>
                <span class="cd-unit">Hrs</span>
              </div>
              <span class="cd-sep">:</span>
              <div class="cd-block">
                <span class="cd-num">{{ String(timeUntil(drop)!.m).padStart(2,'0') }}</span>
                <span class="cd-unit">Min</span>
              </div>
              <span class="cd-sep">:</span>
              <div class="cd-block">
                <span class="cd-num">{{ String(timeUntil(drop)!.s).padStart(2,'0') }}</span>
                <span class="cd-unit">Sec</span>
              </div>
            </div>
            <button v-if="!isQueued(drop.id)" class="queue-btn" @click="joinQueue(drop.id)">
              Join the Queue
            </button>
            <div v-else class="queue-confirmed">
              ✓ You're in the queue! We'll notify you when it drops.
            </div>
          </template>
          <div v-else class="drop-live">
            <div class="live-pulse"></div>
            <div class="live-text">LIVE NOW</div>
            <RouterLink to="/shop/menu" class="buy-now-btn">Buy Now →</RouterLink>
          </div>
        </div>
      </div>

      <div class="wr-note">
        <div class="note-icon">📬</div>
        <div class="note-text">
          <strong>How it works:</strong> Join the queue now and we'll send you a direct link the moment a lot goes live. Queue members get a 10-minute head start before public launch.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wr-page { min-height: 100vh; background: #0d0603; font-family: 'Inter', sans-serif; }
.wr-hero { padding: 72px 24px 56px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
.wr-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.16em; margin: 0 0 12px; }
.wr-headline { font-size: clamp(36px, 6vw, 60px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.wr-sub { font-size: 15px; color: #57534e; margin: 0; }

.wr-body { max-width: 960px; margin: 0 auto; padding: 48px 24px 80px; display: flex; flex-direction: column; gap: 24px; }

.drop-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,160,96,0.15); border-radius: 24px; padding: 32px 28px; display: flex; gap: 32px; align-items: flex-start; }
@media (max-width: 640px) { .drop-card { flex-direction: column; } }

.drop-left { flex: 1; display: flex; gap: 18px; }
.drop-flag { font-size: 44px; flex-shrink: 0; }
.drop-info { flex: 1; }
.drop-name { font-size: 20px; font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
.drop-bean { font-size: 13px; color: #d4a060; font-weight: 600; margin-bottom: 2px; }
.drop-origin { font-size: 12px; color: #57534e; margin-bottom: 12px; }
.drop-desc { font-size: 13px; color: #78716c; line-height: 1.7; margin: 0 0 14px; }
.drop-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.meta-chip { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; background: rgba(255,255,255,0.06); color: #a8a29e; border: 1px solid rgba(255,255,255,0.08); }
.price-chip { background: rgba(212,160,96,0.1); color: #d4a060; border-color: rgba(212,160,96,0.2); }

.drop-right { flex-shrink: 0; text-align: center; min-width: 220px; }
.countdown-label { font-size: 10px; font-weight: 700; color: #57534e; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
.countdown { display: flex; align-items: center; gap: 4px; justify-content: center; margin-bottom: 20px; }
.cd-block { display: flex; flex-direction: column; align-items: center; }
.cd-num { font-size: 32px; font-weight: 900; color: #d4a060; font-family: 'Playfair Display', serif; line-height: 1; }
.cd-unit { font-size: 9px; color: #57534e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
.cd-sep { font-size: 24px; color: #44403c; margin-bottom: 14px; }
.queue-btn { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; padding: 13px 24px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; width: 100%; }
.queue-btn:hover { transform: translateY(-2px); }
.queue-confirmed { font-size: 13px; color: #4ade80; font-weight: 600; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 10px; padding: 12px 16px; line-height: 1.5; }
.drop-live { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.live-pulse { width: 12px; height: 12px; background: #4ade80; border-radius: 50%; animation: pulse 1.4s infinite; }
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); } 50% { box-shadow: 0 0 0 10px rgba(74,222,128,0); } }
.live-text { font-size: 14px; font-weight: 800; color: #4ade80; letter-spacing: 0.1em; }
.buy-now-btn { display: inline-block; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; text-decoration: none; border-radius: 12px; padding: 13px 24px; font-size: 14px; font-weight: 700; }

.wr-note { display: flex; gap: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px 22px; }
.note-icon { font-size: 24px; flex-shrink: 0; }
.note-text { font-size: 13px; color: #57534e; line-height: 1.7; }
.note-text strong { color: #fdf6ec; }
</style>