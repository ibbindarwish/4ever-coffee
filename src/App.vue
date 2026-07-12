<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PwaInstallBanner from './components/PwaInstallBanner.vue'

const route = useRoute()
const loading = ref(false)
const loadPct = ref(0)
let loadTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
})

watch(() => route.path, () => {
  loading.value = true
  loadPct.value = 0
  clearTimeout(loadTimer)
  const step = () => {
    loadPct.value = Math.min(loadPct.value + Math.random() * 20 + 8, 90)
    if (loadPct.value < 90) loadTimer = setTimeout(step, 80)
  }
  step()
  setTimeout(() => { loadPct.value = 100; setTimeout(() => { loading.value = false; loadPct.value = 0 }, 300) }, 320)
})
</script>

<template>
  <div class="app-root">
    <!-- Page-load progress bar -->
    <div class="page-bar" :class="{ visible: loading }" :style="{ width: loadPct + '%' }"></div>
    <RouterView v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="r.path" />
      </Transition>
    </RouterView>
    <PwaInstallBanner />
  </div>
</template>

<style>
/* ── Global design foundation ── */
*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1c1917;
  background: #faf7f2;
}

h1 {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  letter-spacing: -0.02em;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.18); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(28,25,23,0.32); }

:focus-visible { outline: 2px solid #d4a060; outline-offset: 2px; border-radius: 4px; }
html { scroll-behavior: smooth; }
::selection { background: rgba(212,160,96,0.28); color: #1c1917; }
img { display: block; }

/* ── Page transition ── */
.page-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.page-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.page-enter-from   { opacity: 0; transform: translateY(10px); }
.page-leave-to     { opacity: 0; transform: translateY(-6px); }

/* ── Top progress bar ── */
.app-root { position: relative; }
.page-bar {
  position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
  background: linear-gradient(90deg, #c8813a, #d4a060, #f5c578);
  border-radius: 0 3px 3px 0;
  transition: width 0.12s ease, opacity 0.3s ease;
  opacity: 0; pointer-events: none;
  box-shadow: 0 0 10px rgba(212,160,96,0.6);
}
.page-bar.visible { opacity: 1; }
</style>