<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const orders = useOrdersStore()

const breadcrumb: Record<string, string> = {
  '/': 'Dashboard', '/analytics': 'Analytics', '/users': 'Team',
  '/menu': 'Menu', '/orders': 'Orders', '/settings': 'Settings',
  '/architector': 'Architector', '/cups-daily': 'Cup Tracker',
}
const title = computed(() => breadcrumb[route.path] ?? 'Dashboard')

const showNotifs = ref(false)
const newCount   = computed(() => orders.newOrderIds.length)
const recentNew  = computed(() =>
  orders.orders.filter(o => orders.newOrderIds.includes(o.id)).slice(0, 5)
)

function toggleNotifs() {
  showNotifs.value = !showNotifs.value
}

function openAndRead() {
  showNotifs.value = false
  orders.markAllRead()
  router.push('/orders')
}

function closePanel(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.notif-wrap')) {
    showNotifs.value = false
  }
}

onMounted(()  => document.addEventListener('click', closePanel))
onUnmounted(() => document.removeEventListener('click', closePanel))

function logout() {
  auth.logout()
  router.push('/login')
}

const statusColor: Record<string, string> = {
  pending: '#f59e0b', preparing: '#3b82f6', ready: '#8b5cf6',
  delivered: '#10b981', cancelled: '#ef4444',
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <div class="page-title">{{ title }}</div>
    </div>

    <div class="header-right">
      <!-- Search -->
      <div class="search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search..." class="search-input"/>
      </div>

      <!-- Notification bell -->
      <div class="notif-wrap">
        <button class="icon-btn notif-btn" :class="{ has: newCount > 0 }" @click.stop="toggleNotifs" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" :class="{ ring: newCount > 0 }">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="newCount > 0" class="notif-badge">{{ newCount }}</span>
        </button>

        <!-- Dropdown -->
        <Transition name="notif">
          <div v-if="showNotifs" class="notif-panel">
            <div class="np-head">
              <span class="np-title">Notifications</span>
              <button v-if="newCount > 0" class="np-clear" @click="orders.markAllRead()">Mark all read</button>
            </div>

            <div v-if="recentNew.length === 0" class="np-empty">
              <span>🔔</span>
              <p>No new notifications</p>
            </div>

            <div v-else class="np-list">
              <div v-for="o in recentNew" :key="o.id" class="np-item">
                <div class="np-dot" :style="{ background: statusColor[o.status] }"></div>
                <div class="np-info">
                  <div class="np-name">New order from {{ o.customer.name }}</div>
                  <div class="np-sub">{{ o.id }} · £{{ o.total.toFixed(2) }}</div>
                </div>
                <span class="np-status" :style="{ color: statusColor[o.status] }">{{ o.status }}</span>
              </div>
            </div>

            <button class="np-footer" @click="openAndRead">
              View all orders →
            </button>
          </div>
        </Transition>
      </div>

      <!-- User chip -->
      <div class="user-chip">
        <div class="user-avatar">{{ auth.user?.name?.slice(0,1).toUpperCase() ?? 'A' }}</div>
        <div class="user-info">
          <span class="user-name">{{ auth.user?.name ?? 'Admin' }}</span>
          <span class="user-role">{{ auth.user?.role }}</span>
        </div>
      </div>

      <!-- Logout -->
      <button class="logout-btn" @click="logout" title="Sign out">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 60px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; background: #fff; border-bottom: 1px solid #f0ebe4; flex-shrink: 0;
  position: relative; z-index: 50;
}
.page-title   { font-size: 17px; font-weight: 700; color: #1c1917; }
.header-right { display: flex; align-items: center; gap: 10px; }

.search-wrap  { display: flex; align-items: center; gap: 8px; background: #faf7f2; border: 1px solid #e7e5e4; border-radius: 8px; padding: 6px 12px; }
.search-wrap svg { width: 14px; height: 14px; color: #a8a29e; }
.search-input { border: none; background: none; outline: none; font-size: 13px; color: #1c1917; width: 160px; }
.search-input::placeholder { color: #a8a29e; }

/* Notification bell */
.notif-wrap { position: relative; }
.icon-btn {
  width: 36px; height: 36px; border: 1px solid #e7e5e4; border-radius: 8px;
  background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #78716c; transition: all 0.15s; position: relative;
}
.icon-btn:hover { background: #faf7f2; }
.icon-btn svg { width: 16px; height: 16px; }
.icon-btn.has { border-color: #fcd34d; background: #fffbf5; color: #d97706; }

@keyframes bell-ring {
  0%,100% { transform: rotate(0); }
  15%      { transform: rotate(14deg); }
  30%      { transform: rotate(-12deg); }
  45%      { transform: rotate(8deg); }
  60%      { transform: rotate(-6deg); }
  75%      { transform: rotate(3deg); }
}
.ring { animation: bell-ring 1.2s ease-in-out infinite; transform-origin: top center; }

.notif-badge {
  position: absolute; top: -5px; right: -5px;
  width: 18px; height: 18px; background: #ef4444; color: #fff;
  border-radius: 50%; font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff;
}

/* Dropdown panel */
.notif-panel {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 320px; background: #fff;
  border: 1px solid #f0ebe4; border-radius: 16px;
  box-shadow: 0 16px 48px rgba(44,16,8,0.14);
  overflow: hidden;
}

.np-head   { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 12px; border-bottom: 1px solid #f5f0ea; }
.np-title  { font-size: 13px; font-weight: 700; color: #1c1917; }
.np-clear  { font-size: 11px; color: #d4a060; font-weight: 600; background: none; border: none; cursor: pointer; }
.np-clear:hover { color: #c8813a; }

.np-empty  { display: flex; flex-direction: column; align-items: center; padding: 28px 16px; gap: 8px; }
.np-empty span { font-size: 28px; }
.np-empty p    { font-size: 13px; color: #a8a29e; margin: 0; }

.np-list   { max-height: 260px; overflow-y: auto; }
.np-item   { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #faf7f2; transition: background 0.12s; }
.np-item:hover { background: #faf7f2; }
.np-dot    { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.np-info   { flex: 1; min-width: 0; }
.np-name   { font-size: 13px; font-weight: 600; color: #1c1917; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-sub    { font-size: 11px; color: #a8a29e; margin-top: 1px; }
.np-status { font-size: 11px; font-weight: 600; text-transform: capitalize; white-space: nowrap; }

.np-footer { width: 100%; padding: 12px 16px; background: #faf7f2; border: none; border-top: 1px solid #f0ebe4; font-size: 13px; font-weight: 600; color: #d4a060; cursor: pointer; text-align: left; transition: background 0.15s; }
.np-footer:hover { background: #fdf3e7; }

/* Panel animation */
.notif-enter-active, .notif-leave-active { transition: all 0.2s ease; }
.notif-enter-from, .notif-leave-to       { opacity: 0; transform: translateY(-8px) scale(0.97); }

/* User chip */
.user-chip { display: flex; align-items: center; gap: 8px; background: #faf7f2; border: 1px solid #e7e5e4; border-radius: 8px; padding: 5px 12px 5px 6px; cursor: default; }
.user-avatar { width: 26px; height: 26px; border-radius: 50%; background: #d4a060; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.user-info   { display: flex; flex-direction: column; }
.user-name   { font-size: 13px; font-weight: 600; color: #1c1917; line-height: 1.2; }
.user-role   { font-size: 10px; color: #a8a29e; line-height: 1.2; }

.logout-btn { width: 34px; height: 34px; border: 1px solid #e7e5e4; border-radius: 8px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #a8a29e; transition: all 0.15s; }
.logout-btn:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }
.logout-btn svg { width: 15px; height: 15px; }
</style>