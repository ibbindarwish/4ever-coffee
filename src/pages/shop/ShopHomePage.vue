<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useProductsStore } from '../../stores/products'
import { useCartStore } from '../../stores/cart'
import AppLogo from '../../components/AppLogo.vue'
import DailyDeal from '../../components/DailyDeal.vue'
import CoffeeQuiz from '../../components/CoffeeQuiz.vue'
import LoyaltyCard from '../../components/LoyaltyCard.vue'

const store = useProductsStore()
const cart = useCartStore()

const featured  = computed(() => store.products.filter(p => p.featured && p.category !== 'Sweets & Cakes').slice(0, 3))
const sweets    = computed(() => store.products.filter(p => p.category === 'Sweets & Cakes'))
const bestSellers = computed(() => [...store.products].sort((a, b) => b.reviews - a.reviews).slice(0, 4))

// Toast notification
const toast = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout>

function addToCart(p: typeof store.products[0]) {
  cart.addToCart(p)
  clearTimeout(toastTimer)
  toast.value = `${p.name} added to cart!`
  toastVisible.value = true
  toastTimer = setTimeout(() => toastVisible.value = false, 2500)
}

function stars(r: number) {
  return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))
}

// Scroll reveal
onMounted(() => {
  const els = document.querySelectorAll('.reveal')
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target) } })
  }, { threshold: 0.12 })
  els.forEach(el => obs.observe(el))
})
</script>

<template>
  <div class="home">

    <!-- ── HERO ─────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-logo-wrap">
          <AppLogo :size="72" />
        </div>
        <p class="hero-eyebrow">✦ Crafted Coffee, Every Day</p>
        <h1 class="hero-heading">
          <span class="line-1">4<em>ever</em></span>
          <span class="line-2">Coffee</span>
        </h1>
        <p class="hero-tagline">
          More than a cup — it's a feeling.<br/>
          Discover drinks crafted for every moment.
        </p>
        <div class="hero-actions">
          <RouterLink to="/shop/menu" class="btn-primary">Order Now</RouterLink>
          <a href="#menu" class="btn-ghost">View Menu ↓</a>
        </div>
        <div class="hero-stats">
          <div class="hstat"><span class="hstat-val">12</span><span class="hstat-label">Signature Drinks</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-val">10k+</span><span class="hstat-label">Happy Customers</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-val">100%</span><span class="hstat-label">Premium Beans</span></div>
        </div>
      </div>
      <div class="hero-cups">
        <div v-for="(p, i) in featured" :key="p.id" class="float-cup" :class="'cup-' + i">
          <div class="float-cup-bg" :style="{ background: p.gradient }"></div>
          <img :src="p.image" :alt="p.name" class="float-cup-photo" @error="(e) => (e.target as HTMLImageElement).style.display='none'"/>
          <div class="cup-label">
            <span class="cup-name">{{ p.name }}</span>
            <span class="cup-price">£{{ p.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TOAST ──────────────────────────────────────────────── -->
    <Transition name="toast">
      <div v-if="toastVisible" class="toast">☕ {{ toast }}</div>
    </Transition>

    <!-- ── MARQUEE ───────────────────────────────────────────── -->
    <div class="marquee-wrap">
      <div class="marquee-track">
        <span v-for="n in 3" :key="n">
          ☕ Freshly Brewed &nbsp;&nbsp; ✦ Premium Beans &nbsp;&nbsp; ☕ Free Delivery Over $30 &nbsp;&nbsp; ✦ Order Online &nbsp;&nbsp; ☕ 4ever Coffee &nbsp;&nbsp;
        </span>
      </div>
    </div>

    <!-- ── DAILY DEAL ─────────────────────────────────────────── -->
    <div class="reveal"><DailyDeal /></div>

    <!-- ── FULL MENU GRID ────────────────────────────────────── -->
    <section class="menu-section" id="menu">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">Our Menu</p>
          <h2 class="section-title">Every Drink, One Place</h2>
          <p class="section-sub">From bold espresso to refreshing cold brew — crafted with care, every time.</p>
        </div>
        <div class="menu-grid">
          <div v-for="p in store.products" :key="p.id" class="menu-card">
            <div class="menu-img">
              <div class="menu-img-bg" :style="{ background: p.gradient }"></div>
              <img :src="p.image" :alt="p.name" class="menu-photo" @error="(e) => (e.target as HTMLImageElement).style.display='none'"/>
              <div v-if="p.isNew" class="menu-badge new">New</div>
              <div v-if="p.originalPrice" class="menu-badge sale">Sale</div>
            </div>
            <div class="menu-info">
              <span class="menu-cat">{{ p.category }}</span>
              <div class="menu-name">{{ p.name }}</div>
              <div class="menu-desc">{{ p.description.slice(0, 60) }}…</div>
              <div class="menu-footer">
                <span class="menu-price">£{{ p.price.toFixed(2) }}</span>
                <button class="menu-btn" @click="addToCart(p)" :disabled="p.stock === 0">
                  {{ p.stock === 0 ? 'Sold Out' : '+ Order' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COFFEE QUIZ ───────────────────────────────────────── -->
    <div class="reveal"><CoffeeQuiz /></div>

    <!-- ── BEST SELLERS ──────────────────────────────────────── -->
    <section class="bestsellers">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">Fan Favourites</p>
          <h2 class="section-title section-title-light">Most Ordered</h2>
          <p class="section-sub-light">Loved by thousands of coffee fans, every single day.</p>
        </div>
        <div class="bs-grid">
          <div v-for="(p, i) in bestSellers" :key="p.id" class="bs-card" :class="{ top: i === 0 }">
            <div v-if="i === 0" class="bs-crown">☕ #1 Most Ordered</div>
            <div class="bs-img">
              <div class="bs-img-bg" :style="{ background: p.gradient }"></div>
              <img :src="p.image" :alt="p.name" class="bs-photo" @error="(e) => (e.target as HTMLImageElement).style.display='none'"/>
            </div>
            <div class="bs-body">
              <span class="bs-cat">{{ p.category }}</span>
              <h3 class="bs-name">{{ p.name }}</h3>
              <div class="bs-stars" :style="{ color: p.accent }">{{ stars(p.rating) }}
                <span class="bs-rev">{{ p.reviews.toLocaleString() }}</span>
              </div>
              <div class="bs-foot">
                <span class="bs-price">£{{ p.price.toFixed(2) }}</span>
                <button class="bs-btn" @click="addToCart(p)" :disabled="p.stock === 0">
                  {{ p.stock === 0 ? 'Sold Out' : 'Order' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="view-all"><RouterLink to="/shop/menu" class="view-all-btn">See Full Menu →</RouterLink></div>
      </div>
    </section>

    <!-- ── LOYALTY CARD ──────────────────────────────────────── -->
    <div class="reveal"><LoyaltyCard /></div>

    <!-- ── SWEETS & CAKES ────────────────────────────────────── -->
    <section class="sweets-section reveal">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">🇬🇧 London Favourites</p>
          <h2 class="section-title">Sweets & Cakes</h2>
          <p class="section-sub">Hand-picked British classics — no alcohol, all joy. Perfect with your coffee.</p>
        </div>
        <div class="sweets-grid">
          <div v-for="p in sweets" :key="p.id" class="sweet-card">
            <div class="sweet-img">
              <div class="sweet-img-bg" :style="{ background: p.gradient }"></div>
              <img :src="p.image" :alt="p.name" class="sweet-photo" @error="(e) => (e.target as HTMLImageElement).style.display='none'"/>
              <div v-if="p.isNew" class="sweet-badge">New</div>
            </div>
            <div class="sweet-body">
              <span class="sweet-origin">🇬🇧 London Recommended</span>
              <h3 class="sweet-name">{{ p.name }}</h3>
              <p class="sweet-flavor">{{ p.scentType }}</p>
              <div class="sweet-foot">
                <span class="sweet-price">£{{ p.price.toFixed(2) }}</span>
                <button class="sweet-btn" @click="addToCart(p)">+ Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ABOUT ─────────────────────────────────────────────── -->
    <section class="about" id="about">
      <div class="section-inner about-inner">
        <div class="about-visual">
          <div class="about-frame">
            <div class="about-cups-grid">
              <div v-for="p in store.products.slice(0, 4)" :key="p.id" class="about-mini">
                <div class="about-mini-bg" :style="{ background: p.gradient }"></div>
                <img :src="p.image" :alt="p.name" class="about-mini-photo" @error="(e) => (e.target as HTMLImageElement).style.display='none'"/>
              </div>
            </div>
          </div>
        </div>
        <div class="about-text">
          <p class="section-eyebrow">Our Story</p>
          <h2 class="section-title">Born from a love<br/>of great coffee.</h2>
          <p class="about-body">
            4ever Coffee started with a simple belief: everyone deserves a truly great cup. We source only the finest single-origin beans, roasted to perfection, and craft every drink with care and precision.
          </p>
          <p class="about-body">
            Whether you're starting your morning or taking an afternoon break, we're here — brewing your moment, forever.
          </p>
          <div class="pillars">
            <div class="pillar"><span class="pillar-icon">🌍</span><div><div class="p-title">Ethically Sourced</div><div class="p-sub">Direct-trade beans from top farms</div></div></div>
            <div class="pillar"><span class="pillar-icon">🚴</span><div><div class="p-title">Fast Delivery</div><div class="p-sub">Free on all orders over $30</div></div></div>
            <div class="pillar"><span class="pillar-icon">♻</span><div><div class="p-title">Eco Packaging</div><div class="p-sub">100% compostable cups & lids</div></div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CONTACT ───────────────────────────────────────────── -->
    <section class="contact-section" id="contact">
      <div class="contact-inner">
        <div class="contact-left">
          <p class="section-eyebrow light">Reach Out</p>
          <h2 class="contact-title">We'd Love to Hear From You</h2>
          <p class="contact-sub">Got a question about an order, our menu, or catering? We're always here.</p>
          <div class="contact-cards">
            <a href="mailto:hello@4evercoffee.ae" class="cc">
              <div class="cc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6"/>
                </svg>
              </div>
              <div>
                <div class="cc-label">Email Us</div>
                <div class="cc-val">hello@4evercoffee.ae</div>
                <div class="cc-note">Reply within 2 hours</div>
              </div>
            </a>
            <a href="tel:+97150888888" class="cc">
              <div class="cc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.89 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.8 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.05 6.05l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <div class="cc-label">Call Us</div>
                <div class="cc-val">+971 50 888 8888</div>
                <div class="cc-note">Daily, 7 AM – 10 PM GST</div>
              </div>
            </a>
            <a href="https://wa.me/97150888888" class="cc whatsapp">
              <div class="cc-icon wa-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <div class="cc-label">WhatsApp</div>
                <div class="cc-val">+971 50 888 8888</div>
                <div class="cc-note">Quick replies, 7 days</div>
              </div>
            </a>
          </div>
        </div>
        <div class="contact-right">
          <p class="section-eyebrow light">Newsletter</p>
          <h3 class="nl-title">Get Exclusive Offers</h3>
          <p class="nl-sub">Be first to know about seasonal drinks, loyalty rewards, and special deals.</p>
          <div class="nl-form">
            <input type="email" placeholder="Your email address" class="nl-input"/>
            <button class="nl-btn">Subscribe</button>
          </div>
          <p class="nl-note">No spam. Unsubscribe anytime.</p>
          <div class="divider"></div>
          <div class="hours">
            <div class="hours-title">Opening Hours</div>
            <div class="hours-row"><span>Mon – Fri</span><span>7:00 AM – 10:00 PM</span></div>
            <div class="hours-row"><span>Sat – Sun</span><span>8:00 AM – 11:00 PM</span></div>
            <div class="hours-tz">Gulf Standard Time (GST, UTC+4)</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { overflow-x: hidden; }

/* ── HERO ──────────────────────────────────────── */
.hero {
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(10,4,2,0.84) 0%, rgba(26,10,4,0.74) 45%, rgba(44,16,8,0.60) 70%, rgba(10,4,2,0.82) 100%),
    url('https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1600&fit=crop&auto=format&q=70') center / cover no-repeat;
  display: flex; align-items: center;
  position: relative; overflow: hidden;
  padding: 80px 24px 60px;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.18; }
.orb-1 { width: 500px; height: 500px; background: #c8813a; top: -100px; left: -100px; }
.orb-2 { width: 350px; height: 350px; background: #d4a060; bottom: -80px; right: 200px; }
.orb-3 { width: 280px; height: 280px; background: #8B4513; top: 50%; left: 45%; }

.hero-content { position: relative; z-index: 2; max-width: 560px; }
.hero-logo-wrap { margin-bottom: 24px; }
.hero-eyebrow { font-size: 13px; font-weight: 600; color: #d4a060; letter-spacing: 0.12em; margin: 0 0 16px; text-transform: uppercase; }
.hero-heading { margin: 0 0 22px; line-height: 1; }
.line-1 { display: block; font-size: clamp(64px, 10vw, 112px); font-weight: 900; color: #fdf6ec; letter-spacing: -4px; }
.line-1 em { font-style: normal; color: #d4a060; }
.line-2 { display: block; font-size: clamp(36px, 6vw, 64px); font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: -2px; }
.hero-tagline { font-size: 17px; color: #a8a29e; line-height: 1.65; margin: 0 0 34px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
.btn-primary { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border-radius: 12px; padding: 14px 30px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 8px 28px rgba(200,129,58,0.45); transition: all 0.2s; display: inline-block; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(200,129,58,0.6); }
.btn-ghost { border: 1.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); border-radius: 12px; padding: 14px 28px; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s; display: inline-block; background: rgba(255,255,255,0.05); }
.btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.1); }
.hero-stats { display: flex; align-items: center; gap: 20px; }
.hstat { display: flex; flex-direction: column; gap: 2px; }
.hstat-val { font-size: 22px; font-weight: 800; color: #fdf6ec; }
.hstat-label { font-size: 11px; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.hstat-div { width: 1px; height: 36px; background: rgba(255,255,255,0.12); }

.hero-cups { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); display: flex; gap: 20px; align-items: flex-end; z-index: 1; pointer-events: none; }
@media (max-width: 960px) { .hero-cups { display: none; } }
.float-cup { border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.5); position: relative; }
.float-cup-bg { position: absolute; inset: 0; }
.float-cup-photo { width: 100%; height: 120px; object-fit: cover; position: relative; z-index: 1; }
.cup-label { position: relative; z-index: 2; padding: 10px 14px; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); width: 100%; }
.cup-0 { width: 130px; transform: translateY(0px); }
.cup-1 { width: 120px; transform: translateY(-30px); }
.cup-2 { width: 110px; transform: translateY(20px); }
.cup-label { text-align: center; }
.cup-name  { display: block; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); }
.cup-price { display: block; font-size: 12px; font-weight: 600; color: #d4a060; }

/* ── MARQUEE ────────────────────────────────────── */
.marquee-wrap { background: #c8813a; overflow: hidden; padding: 14px 0; }
.marquee-track { display: flex; white-space: nowrap; animation: marquee 22s linear infinite; font-size: 13px; font-weight: 600; color: #fff; letter-spacing: 0.04em; }
@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }

/* ── SHARED ─────────────────────────────────────── */
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #c8813a; margin: 0 0 10px; }
.section-eyebrow.light { color: #d4a060; }
.section-title { font-size: clamp(28px, 4vw, 40px); font-weight: 900; color: #1c1917; margin: 0 0 8px; letter-spacing: -1px; }
.section-title-light { color: #fdf6ec !important; }
.section-sub { font-size: 15px; color: #78716c; margin: 0; }
.section-sub-light { font-size: 15px; color: #a8a29e; margin: 0; }
.section-head { margin-bottom: 40px; }
.section-head.center { text-align: center; }

/* ── MENU GRID ──────────────────────────────────── */
.menu-section { padding: 88px 0; background: #faf7f2; }
.menu-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
@media (max-width: 1100px) { .menu-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px)  { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .menu-grid { grid-template-columns: 1fr; } }

.menu-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #f0ebe4; transition: all 0.25s; box-shadow: 0 2px 8px rgba(44,16,8,0.05); display: flex; flex-direction: column; }
.menu-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(44,16,8,0.1); }
.menu-img { height: 220px; position: relative; overflow: hidden; }
.menu-img-bg { position: absolute; inset: 0; }
.menu-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transition: transform 0.4s ease; }
.menu-card:hover .menu-photo { transform: scale(1.07); }
.menu-badge { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 700; border-radius: 6px; padding: 3px 8px; text-transform: uppercase; letter-spacing: 0.06em; }
.menu-badge.new  { background: #d1fae5; color: #065f46; }
.menu-badge.sale { background: #fee2e2; color: #991b1b; }
.menu-info { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }
.menu-cat  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #c8813a; margin-bottom: 4px; }
.menu-name { font-size: 15px; font-weight: 800; color: #1c1917; margin-bottom: 4px; }
.menu-desc { font-size: 12px; color: #a8a29e; line-height: 1.5; margin-bottom: 12px; flex: 1; }
.menu-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.menu-price { font-size: 16px; font-weight: 800; color: #1c1917; }
.menu-btn { background: #d4a060; color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.menu-btn:hover { background: #c8813a; }
.menu-btn:disabled { background: #e7e5e4; color: #a8a29e; cursor: not-allowed; }

/* ── BEST SELLERS ───────────────────────────────── */
.bestsellers { padding: 88px 0; background: #1a0a04; }
.bs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1050px) { .bs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .bs-grid { grid-template-columns: 1fr; } }
.bs-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; transition: all 0.25s; }
.bs-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
.bs-card.top { border-color: #d4a060; background: rgba(212,160,96,0.1); }
.bs-crown { background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; font-size: 11px; font-weight: 700; padding: 6px 14px; text-align: center; letter-spacing: 0.05em; }
.bs-img { height: 200px; position: relative; overflow: hidden; }
.bs-img-bg { position: absolute; inset: 0; }
.bs-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transition: transform 0.4s ease; }
.bs-card:hover .bs-photo { transform: scale(1.07); }
.bs-body { padding: 16px 18px 18px; }
.bs-cat  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d4a060; }
.bs-name { font-size: 17px; font-weight: 800; color: #fdf6ec; margin: 4px 0 8px; }
.bs-stars { font-size: 13px; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
.bs-rev  { font-size: 11px; color: #78716c; font-weight: 400; }
.bs-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.bs-price { font-size: 17px; font-weight: 800; color: #fdf6ec; }
.bs-btn { background: #d4a060; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.bs-btn:hover { background: #c8813a; }
.bs-btn:disabled { background: #44403c; color: #78716c; cursor: not-allowed; }
.view-all { text-align: center; margin-top: 40px; }
.view-all-btn { display: inline-block; border: 1.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); border-radius: 12px; padding: 13px 32px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.view-all-btn:hover { border-color: #d4a060; color: #d4a060; background: rgba(212,160,96,0.1); }

/* ── ABOUT ──────────────────────────────────────── */
.about { padding: 88px 0; background: #fff; }
.about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
@media (max-width: 900px) { .about-inner { grid-template-columns: 1fr; } }
.about-frame { background: linear-gradient(145deg, #fdf3e7, #fef9c3); border-radius: 24px; padding: 36px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 60px rgba(200,129,58,0.12); }
.about-cups-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.about-mini { border-radius: 16px; overflow: hidden; position: relative; aspect-ratio: 1; box-shadow: 0 8px 24px rgba(44,16,8,0.12); }
.about-mini-bg { position: absolute; inset: 0; }
.about-mini-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.about-body { font-size: 15px; color: #57534e; line-height: 1.75; margin: 0 0 16px; }
.pillars { display: flex; flex-direction: column; gap: 16px; margin-top: 28px; }
.pillar { display: flex; align-items: flex-start; gap: 14px; }
.pillar-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.p-title { font-size: 14px; font-weight: 700; color: #1c1917; margin-bottom: 2px; }
.p-sub   { font-size: 13px; color: #78716c; }

/* ── CONTACT ────────────────────────────────────── */
.contact-section { padding: 88px 0; background: linear-gradient(135deg, #0d0603, #1a0a04, #2c1008); }
.contact-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
@media (max-width: 880px) { .contact-inner { grid-template-columns: 1fr; gap: 48px; } }
.contact-title { font-size: clamp(24px, 4vw, 34px); font-weight: 900; color: #fdf6ec; margin: 0 0 12px; letter-spacing: -1px; }
.contact-sub { font-size: 14px; color: #94a3b8; line-height: 1.7; margin: 0 0 28px; }
.contact-cards { display: flex; flex-direction: column; gap: 12px; }
.cc { display: flex; align-items: flex-start; gap: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 20px; text-decoration: none; transition: all 0.2s; }
.cc:hover { background: rgba(255,255,255,0.09); border-color: #d4a060; transform: translateX(3px); }
.cc.whatsapp:hover { border-color: #25d366; }
.cc-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(212,160,96,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #d4a060; }
.cc-icon svg { width: 18px; height: 18px; }
.wa-icon { background: rgba(37,211,102,0.15); color: #25d366; }
.cc-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #78716c; margin-bottom: 3px; }
.cc-val   { font-size: 14px; font-weight: 700; color: #fdf6ec; margin-bottom: 2px; }
.cc-note  { font-size: 12px; color: #64748b; }
.nl-title { font-size: clamp(20px, 3vw, 28px); font-weight: 900; color: #fdf6ec; margin: 0 0 10px; letter-spacing: -0.5px; }
.nl-sub   { font-size: 14px; color: #94a3b8; margin: 0 0 22px; line-height: 1.6; }
.nl-form  { display: flex; gap: 8px; margin-bottom: 10px; }
.nl-input { flex: 1; padding: 12px 16px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fdf6ec; font-size: 14px; outline: none; }
.nl-input::placeholder { color: #64748b; }
.nl-input:focus { border-color: #d4a060; }
.nl-btn { background: #d4a060; color: #fff; border: none; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
.nl-btn:hover { background: #c8813a; }
.nl-note { font-size: 12px; color: #475569; }
.divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
.hours-title { font-size: 12px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
.hours-row { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.hours-tz  { font-size: 11px; color: #475569; margin-top: 10px; }

/* ── SWEETS & CAKES ─────────────────────────────── */
.sweets-section { padding: 88px 0; background: #fffbf5; }
.sweets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
@media (max-width: 560px)  { .sweets-grid { grid-template-columns: repeat(2,1fr); gap: 12px; } }

.sweet-card { background: #fff; border-radius: 18px; overflow: hidden; border: 1px solid #f0ebe4; transition: all 0.25s; box-shadow: 0 2px 10px rgba(44,16,8,0.05); }
.sweet-card:hover { transform: translateY(-5px); box-shadow: 0 16px 44px rgba(44,16,8,0.11); }
.sweet-img { height: 220px; position: relative; overflow: hidden; }
.sweet-img-bg { position: absolute; inset: 0; }
.sweet-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transition: transform 0.4s ease; }
.sweet-card:hover .sweet-photo { transform: scale(1.07); }
.sweet-badge { position: absolute; top: 10px; left: 10px; background: #d1fae5; color: #065f46; font-size: 10px; font-weight: 700; border-radius: 6px; padding: 3px 8px; text-transform: uppercase; letter-spacing: 0.06em; }
.sweet-body { padding: 14px 16px 18px; }
.sweet-origin { font-size: 10px; font-weight: 700; color: #c8813a; text-transform: uppercase; letter-spacing: 0.08em; }
.sweet-name   { font-size: 15px; font-weight: 800; color: #1c1917; margin: 4px 0 3px; }
.sweet-flavor { font-size: 12px; color: #a8a29e; margin: 0 0 12px; }
.sweet-foot   { display: flex; align-items: center; justify-content: space-between; }
.sweet-price  { font-size: 17px; font-weight: 800; color: #1c1917; }
.sweet-btn    { background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
.sweet-btn:hover { transform: scale(1.04); }

/* ── SCROLL REVEAL ──────────────────────────────── */
.reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.65s ease, transform 0.65s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ── TOAST ──────────────────────────────────────── */
.toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: #1c1917; color: #fdf6ec;
  padding: 13px 24px; border-radius: 40px;
  font-size: 14px; font-weight: 600;
  box-shadow: 0 8px 28px rgba(0,0,0,0.35);
  z-index: 999; white-space: nowrap;
  border: 1px solid rgba(212,160,96,0.25);
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.9); }
</style>
