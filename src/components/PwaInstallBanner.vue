<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any = null
const show = ref(false)
const installing = ref(false)
const installed = ref(false)

const isIos = computed(() =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
)
const isStandalone = computed(() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ('standalone' in window.navigator && (window.navigator as any).standalone) ||
  window.matchMedia('(display-mode: standalone)').matches
)

function onBeforeInstall(e: Event) {
  e.preventDefault()
  deferredPrompt = e
  maybeShow()
}

function maybeShow() {
  if (isStandalone.value) return
  if (sessionStorage.getItem('pwa-dismissed')) return
  setTimeout(() => { show.value = true }, 20000)
}

async function install() {
  if (isIos.value) return
  if (!deferredPrompt) return
  installing.value = true
  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      installed.value = true
      setTimeout(() => { show.value = false }, 1500)
    }
    deferredPrompt = null
  } finally {
    installing.value = false
  }
}

function dismiss() {
  show.value = false
  sessionStorage.setItem('pwa-dismissed', '1')
}

onMounted(() => {
  if (isStandalone.value) return
  window.addEventListener('beforeinstallprompt', onBeforeInstall)
  // iOS: show instructions after delay
  if (isIos.value) maybeShow()
})
onUnmounted(() => window.removeEventListener('beforeinstallprompt', onBeforeInstall))
</script>

<template>
  <Transition name="pwa-slide">
    <div v-if="show" class="pwa-banner" role="dialog" aria-label="Install 4ever Coffee app">
      <div class="pwa-logo">☕</div>

      <div class="pwa-content">
        <div class="pwa-title">Add 4ever Coffee to your home screen</div>
        <div v-if="isIos" class="pwa-sub">
          Tap <strong>Share</strong>
          <svg class="pwa-share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          then <strong>"Add to Home Screen"</strong>
        </div>
        <div v-else class="pwa-sub">Order, earn rewards &amp; track deliveries — offline ready</div>
      </div>

      <div v-if="!isIos" class="pwa-actions">
        <button v-if="!installed" class="pwa-btn-install" @click="install" :disabled="installing">
          {{ installing ? '…' : 'Install' }}
        </button>
        <div v-else class="pwa-done">✓ Added!</div>
      </div>

      <button class="pwa-close" @click="dismiss" aria-label="Dismiss">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-banner {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a0b06;
  border: 1px solid rgba(212,160,96,.35);
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: 0 8px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(212,160,96,.1);
  max-width: min(420px, calc(100vw - 32px));
  width: max-content;
}
.pwa-logo {
  font-size: 28px;
  flex-shrink: 0;
}
.pwa-content {
  flex: 1;
  min-width: 0;
}
.pwa-title {
  font-weight: 700;
  font-size: .9rem;
  color: #fdf6ec;
  line-height: 1.3;
  margin-bottom: 3px;
}
.pwa-sub {
  font-size: .78rem;
  color: rgba(253,246,236,.5);
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
}
.pwa-sub strong {
  color: #d4a060;
  font-weight: 700;
}
.pwa-share-icon {
  width: 13px;
  height: 13px;
  color: #d4a060;
  flex-shrink: 0;
}
.pwa-actions {
  flex-shrink: 0;
}
.pwa-btn-install {
  padding: 8px 18px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}
.pwa-btn-install:disabled {
  opacity: .6;
  cursor: default;
}
.pwa-done {
  font-size: .85rem;
  font-weight: 700;
  color: #4ade80;
  padding: 8px 4px;
}
.pwa-close {
  background: none;
  border: none;
  color: rgba(253,246,236,.35);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;
  font-family: inherit;
}
.pwa-close:hover {
  color: rgba(253,246,236,.7);
}

.pwa-slide-enter-active { transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s ease; }
.pwa-slide-leave-active { transition: transform .2s ease, opacity .2s ease; }
.pwa-slide-enter-from  { transform: translateX(-50%) translateY(20px); opacity: 0; }
.pwa-slide-leave-to    { transform: translateX(-50%) translateY(20px); opacity: 0; }
</style>