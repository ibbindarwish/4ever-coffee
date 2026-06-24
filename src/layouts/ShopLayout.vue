<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import AppLogo from '../components/AppLogo.vue'

const cart = useCartStore()
const route = useRoute()
</script>

<template>
  <div class="shop-root">
    <header class="shop-header">
      <div class="header-inner">
        <RouterLink to="/shop" class="brand">
          <AppLogo :size="34" :dark="true" />
          <span class="brand-tagline">Coffee</span>
        </RouterLink>

        <nav class="shop-nav">
          <RouterLink to="/shop"       class="nav-link" :class="{ active: route.name === 'shop-home' }">Home</RouterLink>
          <RouterLink to="/shop/menu"  class="nav-link">Menu</RouterLink>
          <RouterLink to="/shop/track" class="nav-link">Track Order</RouterLink>
          <a href="#about"   class="nav-link">About</a>
          <a href="#contact" class="nav-link">Contact</a>
        </nav>

        <div class="header-actions">
          <RouterLink to="/" class="admin-link" title="Admin Panel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </RouterLink>
          <RouterLink to="/shop/cart" class="cart-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span v-if="cart.count > 0" class="cart-badge">{{ cart.count }}</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="shop-main">
      <RouterView />
    </main>

    <footer class="shop-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <AppLogo :size="38" />
          <p>Crafted coffee for every moment, forever.</p>
        </div>
        <div class="footer-links">
          <h4>Menu</h4>
          <a href="#">Hot Coffee</a>
          <a href="#">Cold Coffee</a>
          <a href="#">Specialty</a>
          <a href="#">Seasonal</a>
        </div>
        <div class="footer-links">
          <h4>Visit Us</h4>
          <a href="#">Locations</a>
          <a href="#">Opening Hours</a>
          <a href="#">Catering</a>
          <a href="#">Contact</a>
        </div>
        <div class="footer-links">
          <h4>Help</h4>
          <a href="#">FAQ</a>
          <a href="#">Delivery Policy</a>
          <a href="#">Loyalty Card</a>
          <a href="#">Allergen Info</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 4ever Coffee. All rights reserved.</span>
        <span>Free delivery on orders over £30</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.shop-root { min-height: 100vh; display: flex; flex-direction: column; background: #faf7f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

.shop-header { background: #fff; border-bottom: 1px solid #f0ebe4; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 6px rgba(44,16,8,0.06); }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 28px; }

.brand { display: flex; align-items: center; gap: 6px; text-decoration: none; flex-shrink: 0; }
.brand-tagline { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #a8a29e; margin-top: 2px; }

.shop-nav { display: flex; gap: 2px; flex: 1; }
.nav-link { padding: 7px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #57534e; text-decoration: none; transition: all 0.15s; }
.nav-link:hover, .nav-link.active { background: #fdf3e7; color: #92400e; }

.header-actions { display: flex; align-items: center; gap: 8px; }
.admin-link { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #78716c; border: 1px solid #e7e5e4; text-decoration: none; transition: all 0.15s; }
.admin-link:hover { background: #fdf3e7; color: #92400e; }
.admin-link svg { width: 16px; height: 16px; }

.cart-btn { position: relative; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #d4a060; color: #fff; text-decoration: none; transition: background 0.15s; }
.cart-btn:hover { background: #c8813a; }
.cart-btn svg { width: 17px; height: 17px; }
.cart-badge { position: absolute; top: -5px; right: -5px; width: 18px; height: 18px; background: #dc2626; color: #fff; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

.shop-main { flex: 1; }

.shop-footer { background: #1a0a04; color: #a8a29e; margin-top: 0; }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 56px 24px 36px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
.footer-brand { display: flex; flex-direction: column; gap: 12px; }
.footer-brand p { font-size: 13px; color: #78716c; margin: 0; }
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-links h4 { color: #fdf6ec; font-size: 13px; font-weight: 600; margin: 0 0 4px; }
.footer-links a { color: #78716c; text-decoration: none; font-size: 13px; transition: color 0.15s; }
.footer-links a:hover { color: #d4a060; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding: 16px 24px; max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; font-size: 12px; color: #44403c; }
</style>
