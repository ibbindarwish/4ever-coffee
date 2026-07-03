<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'
import AppLogo from './AppLogo.vue'

defineProps<{ mobileOpen?: boolean }>()
defineEmits<{ close: [] }>()

const route = useRoute()
const products = useProductsStore()
const orders = useOrdersStore()
const auth = useAuthStore()

const isAdmin = computed(() => auth.user?.role === 'Admin')

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': mobileOpen }">
    <div class="brand">
      <AppLogo :size="38" />
      <div class="brand-text">
        <span class="brand-name">4<em>ever</em></span>
        <span class="brand-sub">Coffee Shop</span>
      </div>
    </div>

    <nav class="nav">
      <div class="nav-section">Overview</div>
      <RouterLink to="/"          class="nav-link" :class="{ active: route.path === '/' }">
        <span class="nav-icon">⊞</span> Dashboard
      </RouterLink>


      <div class="nav-section">Store</div>
      <RouterLink to="/menu"   class="nav-link" :class="{ active: isActive('/menu') }">
        <span class="nav-icon">☕</span> Menu
        <span v-if="products.lowStockProducts.length" class="nav-badge warn">
          {{ products.lowStockProducts.length }}
        </span>
      </RouterLink>
      <RouterLink to="/orders" class="nav-link" :class="{ active: isActive('/orders') }">
        <span class="nav-icon">📋</span> Orders
        <span v-if="orders.pendingCount" class="nav-badge blue">
          {{ orders.pendingCount }}
        </span>
      </RouterLink>

      <RouterLink to="/roastery-admin" class="nav-link" :class="{ active: isActive('/roastery-admin') }">
        <span class="nav-icon">🏭</span> Roastery
      </RouterLink>
      <RouterLink to="/architector" class="nav-link" :class="{ active: isActive('/architector') }">
        <span class="nav-icon">⬡</span> Architector
      </RouterLink>
      <RouterLink to="/cups-daily" class="nav-link" :class="{ active: isActive('/cups-daily') }">
        <span class="nav-icon">☕</span> Cup Tracker
      </RouterLink>
      <RouterLink to="/cup-showcase" class="nav-link" :class="{ active: isActive('/cup-showcase') }">
        <span class="nav-icon">🥤</span> Cup Design
      </RouterLink>
      <RouterLink to="/cup-designer" class="nav-link" :class="{ active: isActive('/cup-designer') }">
        <span class="nav-icon">🖌️</span> Cup Designer
      </RouterLink>
      <RouterLink to="/packaging-designer" class="nav-link" :class="{ active: isActive('/packaging-designer') }">
        <span class="nav-icon">📦</span> Packaging
      </RouterLink>

      <div class="nav-section">Manage</div>
      <RouterLink to="/users"    class="nav-link" :class="{ active: isActive('/users') }">
        <span class="nav-icon">👥</span> Team
      </RouterLink>
      <RouterLink to="/schedule" class="nav-link" :class="{ active: isActive('/schedule') }">
        <span class="nav-icon">📅</span> Schedule
      </RouterLink>
      <RouterLink v-if="isAdmin" to="/promo-codes" class="nav-link" :class="{ active: isActive('/promo-codes') }">
        <span class="nav-icon">🏷</span> Promo Codes
        <span class="nav-badge admin-only">Admin</span>
      </RouterLink>
      <RouterLink to="/settings" class="nav-link" :class="{ active: isActive('/settings') }">
        <span class="nav-icon">⚙</span> Settings
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <RouterLink to="/shop" class="shop-link">
        ☕ Visit Shop ↗
      </RouterLink>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 230px; flex-shrink: 0;
  background: #1a0a04; height: 100vh; position: sticky; top: 0;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed; left: 0; top: 0; z-index: 200;
    transform: translateX(-100%);
    box-shadow: 4px 0 24px rgba(0,0,0,0.4);
  }
  .sidebar--open { transform: translateX(0); }
}

.brand {
  display: flex; align-items: center; gap: 12px;
  padding: 20px 18px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 20px; font-weight: 900; color: #fdf6ec; letter-spacing: -0.5px; }
.brand-name em { font-style: normal; color: #d4a060; }
.brand-sub  { font-size: 10px; font-weight: 600; color: #78716c; text-transform: uppercase; letter-spacing: 0.08em; }

.nav { flex: 1; overflow-y: auto; padding: 12px 10px; }
.nav-section { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #44403c; padding: 14px 10px 6px; }
.nav-link {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: #a8a29e;
  text-decoration: none; transition: all 0.15s; margin-bottom: 2px;
}
.nav-link:hover { background: rgba(255,255,255,0.06); color: #fdf6ec; }
.nav-link.active { background: rgba(212,160,96,0.15); color: #d4a060; font-weight: 600; }
.nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
.nav-badge { margin-left: auto; border-radius: 10px; font-size: 10px; font-weight: 700; padding: 2px 7px; }
.nav-badge.warn       { background: #7c2d12; color: #fed7aa; }
.nav-badge.blue       { background: #1e3a5f; color: #93c5fd; }
.nav-badge.admin-only { background: rgba(212,160,96,0.18); color: #d4a060; }

.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.shop-link {
  display: block; text-align: center;
  background: rgba(212,160,96,0.15);
  border: 1px solid rgba(212,160,96,0.3);
  color: #d4a060; border-radius: 8px;
  padding: 9px; font-size: 13px; font-weight: 600;
  text-decoration: none; transition: all 0.15s;
}
.shop-link:hover { background: rgba(212,160,96,0.25); }
</style>
