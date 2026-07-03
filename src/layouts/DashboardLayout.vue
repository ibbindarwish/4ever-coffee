<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'

const auth   = useAuthStore()
const router = useRouter()

const sidebarOpen = ref(false)

let sessionCheck: ReturnType<typeof setInterval>

function trackActivity() { auth.updateActivity() }

onMounted(() => {
  window.addEventListener('mousemove', trackActivity, { passive: true })
  window.addEventListener('keydown',   trackActivity, { passive: true })
  window.addEventListener('click',     trackActivity, { passive: true })
  sessionCheck = setInterval(() => {
    if (!auth.checkSession()) router.push('/login')
  }, 60_000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', trackActivity)
  window.removeEventListener('keydown',   trackActivity)
  window.removeEventListener('click',     trackActivity)
  clearInterval(sessionCheck)
})
</script>

<template>
  <div class="shell">
    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <AppSidebar :mobile-open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="main-col">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell { display: flex; min-height: 100vh; background: var(--fc-bg); }
.main-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.main-content { flex: 1; padding: 28px; overflow-y: auto; background: var(--fc-bg); }

.sidebar-overlay {
  display: none;
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 150; backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
  .main-content { padding: 16px; }
  .sidebar-overlay { display: block; }
}
</style>

<!-- Global dark-mode overrides: cascade into all admin child pages -->
<style>
html.dark .stat-card,
html.dark .kpi-card,
html.dark .page-card,
html.dark .card,
html.dark .section-card,
html.dark .chart-card,
html.dark .info-card,
html.dark .detail-card,
html.dark .summary-card,
html.dark .metric-card,
html.dark .pipeline-card,
html.dark .order-row,
html.dark .schedule-grid,
html.dark .staff-row,
html.dark .review-card,
html.dark .form-card,
html.dark .panel {
  background: var(--fc-surface) !important;
  border-color: var(--fc-border) !important;
  color: var(--fc-text) !important;
}

html.dark h1,
html.dark h2,
html.dark h3,
html.dark h4,
html.dark .card-title,
html.dark .section-title,
html.dark .stat-label,
html.dark .label {
  color: var(--fc-text) !important;
}

html.dark .muted,
html.dark .sub,
html.dark .caption,
html.dark .hint {
  color: var(--fc-text-muted) !important;
}
</style>