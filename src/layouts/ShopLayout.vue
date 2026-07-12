<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useLoyaltyStore } from '../stores/loyalty'
import { useCustomerAuthStore } from '../stores/customerAuth'
import AppLogo from '../components/AppLogo.vue'
import FloatingActions from '../components/FloatingActions.vue'
import { useMeta } from '../composables/useMeta'

useMeta()

const cart = useCartStore()
const loyalty = useLoyaltyStore()
const customerAuth = useCustomerAuthStore()
const route = useRoute()

const menuOpen = ref(false)
const scrolled = ref(false)
const showTop  = ref(false)
const cookieDone = ref(true)

function closeMenu() { menuOpen.value = false }
function logout() { customerAuth.logout(); closeMenu() }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
function acceptCookies() { localStorage.setItem('4ever-cookie', '1'); cookieDone.value = true }
function declineCookies() { cookieDone.value = true }

function onScroll() {
  scrolled.value = window.scrollY > 72
  showTop.value  = window.scrollY > 500
}

onMounted(() => {
  cookieDone.value = !!localStorage.getItem('4ever-cookie')
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="shop-root">

    <!-- ── Announcement Bar ── -->
    <div class="announcement-bar">
      <div class="announcement-track">
        <span v-for="n in 3" :key="n">
          🚚 Free delivery on orders over £30 &nbsp;&nbsp;✦&nbsp;&nbsp; New single-origin seasonal beans just arrived &nbsp;&nbsp;✦&nbsp;&nbsp; Earn double loyalty points this week &nbsp;&nbsp;✦&nbsp;&nbsp; Award-winning roastery since 2019 &nbsp;&nbsp;✦&nbsp;&nbsp; Book your table online — no waiting &nbsp;&nbsp;✦&nbsp;&nbsp;
        </span>
      </div>
    </div>

    <header class="shop-header" :class="{ scrolled }">
      <div class="header-inner">
        <RouterLink to="/shop" class="brand" @click="closeMenu">
          <AppLogo :size="34" :dark="true" />
          <span class="brand-tagline">Premium Roastery</span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="shop-nav desktop-nav">
          <RouterLink to="/shop"       class="nav-link" :class="{ active: route.name === 'shop-home' }">Home</RouterLink>
          <RouterLink to="/shop/menu"  class="nav-link">Menu</RouterLink>
          <RouterLink to="/shop/roastery" class="nav-link roastery-link">☕ Roastery</RouterLink>
          <RouterLink to="/shop/reservation" class="nav-link">Book a Table</RouterLink>
          <RouterLink to="/shop/track" class="nav-link">Track Order</RouterLink>
          <RouterLink to="/shop/loyalty" class="nav-link loyalty-link">
            ⭐ Rewards
            <span v-if="loyalty.balance > 0" class="loyalty-pts">{{ loyalty.balance.toLocaleString() }}</span>
          </RouterLink>
          <div class="exp-menu-wrap">
            <button class="nav-link exp-trigger">Experiences ▾</button>
            <div class="exp-dropdown">
              <RouterLink to="/shop/flavor-compass"    class="exp-item">🧭 Flavor Compass</RouterLink>
              <RouterLink to="/shop/horoscope"         class="exp-item">♈ Coffee Horoscope</RouterLink>
              <RouterLink to="/shop/blend-builder"     class="exp-item">⚗️ Blend Builder</RouterLink>
              <RouterLink to="/shop/tasting-challenge" class="exp-item">🎭 Tasting Challenge</RouterLink>
              <RouterLink to="/shop/passport"          class="exp-item">🗺️ Coffee Passport</RouterLink>
              <RouterLink to="/shop/waiting-room"      class="exp-item">⏳ Waiting Room</RouterLink>
              <RouterLink to="/shop/gift"              class="exp-item">🎁 Gift Experience</RouterLink>
              <RouterLink to="/shop/decaf-confessions" class="exp-item">🤫 Decaf Confessions</RouterLink>
            </div>
          </div>
          <a href="#about"   class="nav-link">About</a>
          <a href="#contact" class="nav-link">Contact</a>
        </nav>

        <div class="header-actions">
          <!-- Customer auth buttons -->
          <template v-if="customerAuth.isLoggedIn">
            <span class="customer-name">👋 {{ customerAuth.current?.name.split(' ')[0] }}</span>
            <button class="signout-btn" @click="logout">Sign Out</button>
          </template>
          <template v-else>
            <RouterLink to="/shop/login"  class="signin-btn">Sign In</RouterLink>
            <RouterLink to="/shop/signup" class="signup-btn-header">Sign Up</RouterLink>
          </template>

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

          <!-- Hamburger -->
          <button class="burger-btn" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <Transition name="drawer">
        <nav v-if="menuOpen" class="mobile-nav" @click.self="closeMenu">
          <RouterLink to="/shop"       class="m-link" :class="{ active: route.name === 'shop-home' }" @click="closeMenu">Home</RouterLink>
          <RouterLink to="/shop/menu"  class="m-link" @click="closeMenu">Menu</RouterLink>
          <RouterLink to="/shop/roastery" class="m-link roastery-m" @click="closeMenu">☕ Roastery</RouterLink>
          <RouterLink to="/shop/reservation" class="m-link" @click="closeMenu">Book a Table</RouterLink>
          <RouterLink to="/shop/track" class="m-link" @click="closeMenu">Track Order</RouterLink>
          <RouterLink to="/shop/loyalty" class="m-link loyalty-m" @click="closeMenu">
            ⭐ Rewards
            <span v-if="loyalty.balance > 0" class="loyalty-pts">{{ loyalty.balance.toLocaleString() }}</span>
          </RouterLink>
          <div class="m-divider"></div>
          <p class="m-section-label">Experiences</p>
          <RouterLink to="/shop/flavor-compass"    class="m-link" @click="closeMenu">🧭 Flavor Compass</RouterLink>
          <RouterLink to="/shop/horoscope"         class="m-link" @click="closeMenu">♈ Coffee Horoscope</RouterLink>
          <RouterLink to="/shop/blend-builder"     class="m-link" @click="closeMenu">⚗️ Blend Builder</RouterLink>
          <RouterLink to="/shop/tasting-challenge" class="m-link" @click="closeMenu">🎭 Tasting Challenge</RouterLink>
          <RouterLink to="/shop/passport"          class="m-link" @click="closeMenu">🗺️ Coffee Passport</RouterLink>
          <RouterLink to="/shop/waiting-room"      class="m-link" @click="closeMenu">⏳ Waiting Room</RouterLink>
          <RouterLink to="/shop/gift"              class="m-link" @click="closeMenu">🎁 Gift Experience</RouterLink>
          <RouterLink to="/shop/decaf-confessions" class="m-link" @click="closeMenu">🤫 Decaf Confessions</RouterLink>
          <div class="m-divider"></div>
          <a href="#about"   class="m-link" @click="closeMenu">About</a>
          <a href="#contact" class="m-link" @click="closeMenu">Contact</a>
          <div class="m-divider"></div>
          <template v-if="customerAuth.isLoggedIn">
            <span class="m-customer">👋 {{ customerAuth.current?.name }}</span>
            <button class="m-signout" @click="logout">Sign Out</button>
          </template>
          <template v-else>
            <RouterLink to="/shop/login"  class="m-link" @click="closeMenu">Sign In</RouterLink>
            <RouterLink to="/shop/signup" class="m-signup" @click="closeMenu">Sign Up Free →</RouterLink>
          </template>
          <div class="m-divider"></div>
          <RouterLink to="/shop/cart" class="m-cart" @click="closeMenu">
            View Cart
            <span v-if="cart.count > 0" class="m-cart-badge">{{ cart.count }}</span>
          </RouterLink>
        </nav>
      </Transition>
    </header>

    <main class="shop-main">
      <RouterView />
    </main>

    <!-- ── Scroll-to-top ── -->
    <Transition name="top-btn">
      <button v-if="showTop" class="scroll-top-btn" @click="scrollToTop" aria-label="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </Transition>

    <!-- ── Cookie Banner ── -->
    <Transition name="cookie">
      <div v-if="!cookieDone" class="cookie-banner">
        <div class="cookie-inner">
          <div class="cookie-text">
            <span class="cookie-icon">🍪</span>
            <div>
              <strong>We use cookies</strong> to personalise your experience, remember your preferences, and serve you better coffee recommendations. No data is sold to third parties.
            </div>
          </div>
          <div class="cookie-actions">
            <button class="cookie-decline" @click="declineCookies">Decline</button>
            <button class="cookie-accept" @click="acceptCookies">Accept All</button>
          </div>
        </div>
      </div>
    </Transition>

    <footer class="shop-footer">
      <!-- Certifications strip -->
      <div class="footer-certs">
        <div class="cert-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          Award-Winning Roastery 2025
        </div>
        <div class="cert-div"></div>
        <div class="cert-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          100% Ethically Sourced
        </div>
        <div class="cert-div"></div>
        <div class="cert-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>
          Carbon Neutral Packaging
        </div>
        <div class="cert-div"></div>
        <div class="cert-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          4.9 / 5 Customer Rating
        </div>
        <div class="cert-div"></div>
        <div class="cert-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          50,000+ Happy Customers
        </div>
      </div>

      <div class="footer-inner">
        <div class="footer-brand">
          <AppLogo :size="40" />
          <p class="footer-tagline">Crafted coffee for every moment,<br/>forever.</p>
          <div class="footer-social">
            <a href="#" class="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Twitter / X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.923zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.72a4.85 4.85 0 0 1-1.01-.03z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <h4>Our Menu</h4>
          <RouterLink to="/shop/menu">Hot Coffee</RouterLink>
          <RouterLink to="/shop/menu">Cold Coffee</RouterLink>
          <RouterLink to="/shop/menu">Specialty Drinks</RouterLink>
          <RouterLink to="/shop/menu">Sweets & Cakes</RouterLink>
          <RouterLink to="/shop/roastery">Bean Shop</RouterLink>
        </div>

        <div class="footer-links">
          <h4>Visit Us</h4>
          <RouterLink to="/shop/reservation">Book a Table</RouterLink>
          <a href="#contact">Opening Hours</a>
          <RouterLink to="/shop/track">Track Your Order</RouterLink>
          <a href="#contact">Our Locations</a>
          <a href="#contact">Catering Enquiries</a>
        </div>

        <div class="footer-links">
          <h4>Rewards & Help</h4>
          <RouterLink to="/shop/loyalty">Loyalty Programme</RouterLink>
          <RouterLink to="/shop/gift">Gift Experiences</RouterLink>
          <a href="#">Delivery Policy</a>
          <a href="#">Allergen Information</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div class="footer-links">
          <h4>Experiences</h4>
          <RouterLink to="/shop/flavor-compass">Flavor Compass</RouterLink>
          <RouterLink to="/shop/horoscope">Coffee Horoscope</RouterLink>
          <RouterLink to="/shop/blend-builder">Blend Builder</RouterLink>
          <RouterLink to="/shop/passport">Coffee Passport</RouterLink>
          <RouterLink to="/shop/waiting-room">Waiting Room</RouterLink>
          <RouterLink to="/shop/decaf-confessions">Decaf Confessions</RouterLink>
        </div>

        <div class="footer-newsletter">
          <h4>Stay in the Loop</h4>
          <p>New beans, seasonal menus, exclusive offers — straight to your inbox.</p>
          <div class="nl-wrap">
            <input type="email" placeholder="your@email.com" class="nl-input" />
            <button class="nl-btn">Subscribe</button>
          </div>
          <p class="nl-note">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 4ever Coffee Ltd. All rights reserved. London, UK.</span>
        <div class="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>

    <FloatingActions />
  </div>
</template>

<style scoped>
.shop-root { min-height: 100vh; display: flex; flex-direction: column; background: #faf7f2; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

/* ── Announcement Bar ── */
.announcement-bar {
  background: #1a0a04;
  color: #d4a060;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  overflow: hidden;
  height: 34px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.announcement-track {
  display: inline-flex;
  gap: 0;
  animation: marquee 40s linear infinite;
}
.announcement-track span { padding: 0 40px; }
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}

.shop-header { background: #fff; border-bottom: 1px solid #f0ebe4; position: sticky; top: 34px; z-index: 100; box-shadow: 0 1px 6px rgba(44,16,8,0.06); transition: all 0.25s ease; }
.shop-header.scrolled { top: 0; box-shadow: 0 4px 24px rgba(44,16,8,0.12); backdrop-filter: blur(12px); background: rgba(255,255,255,0.94); }
.shop-header.scrolled .header-inner { height: 56px; }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 28px; transition: height 0.25s ease; }

.brand { display: flex; align-items: center; gap: 6px; text-decoration: none; flex-shrink: 0; }
.brand-tagline { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #a8a29e; margin-top: 2px; }

/* Desktop nav */
.desktop-nav { display: flex; gap: 2px; flex: 1; }
.nav-link { padding: 7px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #57534e; text-decoration: none; transition: all 0.15s; }
.nav-link:hover, .nav-link.active { background: #fdf3e7; color: #92400e; }

.roastery-link { color: #c8813a !important; font-weight: 600 !important; }
.roastery-link:hover { background: #fff3e6 !important; color: #92400e !important; }
.roastery-m { color: #c8813a !important; font-weight: 600 !important; }
.loyalty-link { display: flex; align-items: center; gap: 5px; }
.loyalty-pts { font-size: 10px; font-weight: 800; background: #d4a060; color: #fff; border-radius: 10px; padding: 1px 6px; }

.exp-menu-wrap { position: relative; }
.exp-trigger { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 500; color: #57534e; padding: 7px 14px; border-radius: 8px; transition: all 0.15s; }
.exp-trigger:hover { background: #fdf3e7; color: #92400e; }
.exp-dropdown { display: none; position: absolute; top: calc(100% + 6px); left: 0; background: #fff; border: 1px solid #f0ebe4; border-radius: 14px; padding: 8px; min-width: 220px; box-shadow: 0 8px 32px rgba(28,16,8,0.12); z-index: 200; }
.exp-menu-wrap:hover .exp-dropdown, .exp-menu-wrap:focus-within .exp-dropdown { display: flex; flex-direction: column; }
.exp-item { display: block; padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #57534e; text-decoration: none; transition: background 0.15s; }
.exp-item:hover { background: #fdf3e7; color: #92400e; }
.m-section-label { font-size: 10px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 16px; margin: 0; }

.header-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.admin-link { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #78716c; border: 1px solid #e7e5e4; text-decoration: none; transition: all 0.15s; }
.admin-link:hover { background: #fdf3e7; color: #92400e; }
.admin-link svg { width: 16px; height: 16px; }

.customer-name { font-size: 13px; font-weight: 600; color: #57534e; }
.signin-btn { padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #57534e; text-decoration: none; border: 1.5px solid #e7e5e4; transition: all 0.15s; }
.signin-btn:hover { border-color: #c8813a; color: #c8813a; }
.signup-btn-header { padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #fff; text-decoration: none; background: linear-gradient(135deg, #c8813a, #d4a060); transition: all 0.15s; box-shadow: 0 2px 8px rgba(200,129,58,0.3); }
.signup-btn-header:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(200,129,58,0.45); }
.signout-btn { padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #78716c; background: none; border: 1.5px solid #e7e5e4; cursor: pointer; transition: all 0.15s; }
.signout-btn:hover { border-color: #ef4444; color: #ef4444; }

.m-customer { padding: 10px 16px; font-size: 14px; font-weight: 600; color: #1c1917; }
.m-signout { margin: 0 4px; padding: 11px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; color: #ef4444; background: none; border: 1.5px solid #fecaca; cursor: pointer; transition: all 0.15s; text-align: left; }
.m-signup { display: flex; align-items: center; justify-content: center; margin: 0 4px; padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #c8813a, #d4a060); text-decoration: none; }

.cart-btn { position: relative; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #d4a060; color: #fff; text-decoration: none; transition: background 0.15s; }
.cart-btn:hover { background: #c8813a; }
.cart-btn svg { width: 17px; height: 17px; }
.cart-badge { position: absolute; top: -5px; right: -5px; width: 18px; height: 18px; background: #dc2626; color: #fff; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

/* Hamburger button */
.burger-btn {
  display: none;
  width: 36px; height: 36px; border: 1px solid #e7e5e4; border-radius: 8px;
  background: #fff; cursor: pointer; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
  padding: 0;
}
.burger-btn span {
  display: block; width: 18px; height: 2px; background: #57534e; border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
}
.burger-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger-btn.open span:nth-child(2) { opacity: 0; }
.burger-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile drawer */
.mobile-nav {
  display: none;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #f0ebe4;
  padding: 12px 20px 20px;
  gap: 2px;
}
.m-link {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; border-radius: 10px;
  font-size: 15px; font-weight: 500; color: #57534e; text-decoration: none;
  transition: all 0.15s;
}
.m-link:hover, .m-link.active { background: #fdf3e7; color: #92400e; }
.loyalty-m { justify-content: space-between; }
.m-divider { height: 1px; background: #f0ebe4; margin: 8px 0; }
.m-cart {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px; border-radius: 10px;
  font-size: 15px; font-weight: 700; color: #fff;
  background: #d4a060; text-decoration: none; transition: background 0.15s;
}
.m-cart:hover { background: #c8813a; }
.m-cart-badge { background: #dc2626; color: #fff; border-radius: 10px; font-size: 11px; font-weight: 800; padding: 1px 7px; }

/* Drawer animation */
.drawer-enter-active, .drawer-leave-active { transition: all 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .burger-btn  { display: flex; }
  .mobile-nav  { display: flex; }
  .header-inner { gap: 12px; }
}

.shop-main { flex: 1; }

/* ── Footer ── */
.shop-footer { background: #0d0603; color: #a8a29e; margin-top: 0; }

/* Certifications strip */
.footer-certs {
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap;
  gap: 0; padding: 20px 24px;
}
.cert-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 600; color: #78716c;
  letter-spacing: 0.03em;
  padding: 0 20px;
}
.cert-item svg { width: 16px; height: 16px; color: #d4a060; flex-shrink: 0; }
.cert-div { width: 1px; height: 24px; background: rgba(255,255,255,0.08); }

.footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 56px 24px 36px;
  display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr 1.4fr; gap: 40px;
}
.footer-brand { display: flex; flex-direction: column; gap: 16px; }
.footer-tagline { font-size: 14px; color: #6b6360; line-height: 1.6; margin: 0; }
.footer-social { display: flex; gap: 10px; }
.social-btn {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: #78716c; text-decoration: none; transition: all 0.2s;
}
.social-btn:hover { background: #d4a060; border-color: #d4a060; color: #fff; transform: translateY(-2px); }
.social-btn svg { width: 16px; height: 16px; }

.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-links h4 { color: #fdf6ec; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
.footer-links a { color: #6b6360; text-decoration: none; font-size: 13px; transition: color 0.15s; line-height: 1.5; }
.footer-links a:hover { color: #d4a060; }

/* Newsletter */
.footer-newsletter { display: flex; flex-direction: column; gap: 10px; }
.footer-newsletter h4 { color: #fdf6ec; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px; }
.footer-newsletter > p { font-size: 13px; color: #6b6360; line-height: 1.5; margin: 0; }
.nl-wrap { display: flex; gap: 0; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); }
.nl-input {
  flex: 1; padding: 10px 14px; font-size: 13px;
  background: rgba(255,255,255,0.05); border: none; outline: none;
  color: #fdf6ec;
}
.nl-input::placeholder { color: #44403c; }
.nl-btn {
  padding: 10px 16px; font-size: 12px; font-weight: 700;
  background: #d4a060; color: #fff; border: none; cursor: pointer;
  transition: background 0.15s; white-space: nowrap;
}
.nl-btn:hover { background: #c8813a; }
.nl-note { font-size: 11px; color: #44403c; margin: 0; }

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 18px 24px; max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; color: #44403c;
}
.footer-bottom-links { display: flex; gap: 20px; }
.footer-bottom-links a { color: #44403c; text-decoration: none; transition: color 0.15s; }
.footer-bottom-links a:hover { color: #d4a060; }

@media (max-width: 1024px) {
  .footer-inner { grid-template-columns: 1fr 1fr 1fr; }
  .footer-newsletter { grid-column: 1 / -1; max-width: 400px; }
}
@media (max-width: 640px) {
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; padding: 36px 20px 24px; }
  .footer-newsletter { grid-column: 1 / -1; max-width: none; }
  .footer-certs { gap: 12px; }
  .cert-div { display: none; }
  .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
  .footer-bottom-links { justify-content: center; }
}

/* ── Scroll-to-top button ── */
.scroll-top-btn {
  position: fixed; bottom: 32px; right: 28px; z-index: 900;
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  border: none; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 24px rgba(200,129,58,0.45);
  transition: transform 0.2s, box-shadow 0.2s;
}
.scroll-top-btn:hover { transform: translateY(-3px) scale(1.08); box-shadow: 0 10px 32px rgba(200,129,58,0.6); }
.scroll-top-btn svg { width: 20px; height: 20px; }
.top-btn-enter-active, .top-btn-leave-active { transition: opacity 0.25s, transform 0.25s; }
.top-btn-enter-from, .top-btn-leave-to { opacity: 0; transform: translateY(16px) scale(0.8); }

/* ── Cookie banner ── */
.cookie-banner {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 950;
  background: rgba(20,10,4,0.97); backdrop-filter: blur(16px);
  border-top: 1px solid rgba(212,160,96,0.2);
  padding: 20px 24px;
}
.cookie-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: space-between; }
.cookie-text { display: flex; align-items: flex-start; gap: 14px; font-size: 13px; color: #a8a29e; line-height: 1.6; flex: 1; min-width: 240px; }
.cookie-icon { font-size: 22px; flex-shrink: 0; }
.cookie-text strong { color: #fdf6ec; }
.cookie-actions { display: flex; gap: 10px; flex-shrink: 0; }
.cookie-decline { background: none; border: 1.5px solid rgba(255,255,255,0.12); color: #78716c; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.cookie-decline:hover { border-color: rgba(255,255,255,0.25); color: #a8a29e; }
.cookie-accept { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; box-shadow: 0 4px 14px rgba(200,129,58,0.4); }
.cookie-accept:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,129,58,0.55); }
.cookie-enter-active, .cookie-leave-active { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s; }
.cookie-enter-from, .cookie-leave-to { transform: translateY(100%); opacity: 0; }
</style>