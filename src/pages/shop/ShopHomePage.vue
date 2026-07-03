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

// ── Bean origins for customers ───────────────────────────────────────────────
type RoastLevel = 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark'
interface ShopBean {
  name: string; flag: string; country: string; origin: string
  roast: RoastLevel; score: number; flavor: string[]
  ratio: string; ratioNote: string; desc: string
}

const shopBeans: ShopBean[] = [
  {
    name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', country: 'Ethiopia', origin: 'Gedeo Zone, Southern Ethiopia',
    roast: 'Light', score: 94,
    flavor: ['Jasmine', 'Blueberry', 'Bergamot', 'Tea-like'],
    ratio: '1 : 15', ratioNote: '60 g/L — Pour Over / V60',
    desc: 'Regarded as the birthplace of coffee. This washed Yirgacheffe is delicately floral with vivid blueberry and citrus brightness that shines best as a pour-over.',
  },
  {
    name: 'Colombian Supremo', flag: '🇨🇴', country: 'Colombia', origin: 'Huila, Southern Colombia',
    roast: 'Medium', score: 88,
    flavor: ['Caramel', 'Red Apple', 'Hazelnut', 'Smooth Body'],
    ratio: '1 : 15', ratioNote: '60 g/L — Filter / Espresso',
    desc: 'Grown at 1,700 m in the Andes, this supremo grade bean delivers a classic Colombian balance — sweet caramel body with clean apple brightness and an enduring hazelnut finish.',
  },
  {
    name: 'Kenya AA', flag: '🇰🇪', country: 'Kenya', origin: 'Nyeri County, Central Kenya',
    roast: 'Medium-Light', score: 92,
    flavor: ['Blackcurrant', 'Tomato', 'Wine', 'Juicy'],
    ratio: '1 : 16', ratioNote: '62 g/L — Aeropress / Chemex',
    desc: 'Kenya AA is the largest screen-size grade, hand-sorted for perfection. The double-washed process creates an intensely fruity, wine-like cup with a bold, juicy mouthfeel.',
  },
  {
    name: 'Guatemala Antigua', flag: '🇬🇹', country: 'Guatemala', origin: 'Antigua Valley, Guatemala',
    roast: 'Medium', score: 87,
    flavor: ['Dark Chocolate', 'Brown Sugar', 'Cinnamon', 'Velvety'],
    ratio: '1 : 15', ratioNote: '60 g/L — Drip / Espresso',
    desc: 'Cultivated on volcanic soil beneath three volcanoes. Antigua gives a thick, velvety body filled with bittersweet chocolate, turbinado sugar, and a warm spice finish.',
  },
  {
    name: 'Sumatra Mandheling', flag: '🇮🇩', country: 'Indonesia', origin: 'North Sumatra, Indonesia',
    roast: 'Dark', score: 85,
    flavor: ['Earthy', 'Cedar', 'Dark Cocoa', 'Full Body'],
    ratio: '1 : 12', ratioNote: '83 g/L — French Press / Moka Pot',
    desc: 'Wet-hulled using the Indonesian "giling basah" method, Mandheling is richly earthy with cedar, low acidity, and a syrupy full body that dominates milk-based drinks.',
  },
  {
    name: 'Brazilian Santos', flag: '🇧🇷', country: 'Brazil', origin: 'Minas Gerais, Brazil',
    roast: 'Medium-Dark', score: 83,
    flavor: ['Milk Chocolate', 'Almond', 'Caramel', 'Low Acid'],
    ratio: '1 : 2', ratioNote: '1:2 pull — Espresso / Flat White',
    desc: 'The world\'s largest coffee producer delivers a natural-processed bean that\'s nutty, sweet, and low in acidity — the ideal espresso base for milk drinks and blends.',
  },
  {
    name: 'Panama Geisha', flag: '🇵🇦', country: 'Panama', origin: 'Chiriquí Highlands, Panama',
    roast: 'Light', score: 97,
    flavor: ['Jasmine', 'Peach', 'Bergamot', 'Honey'],
    ratio: '1 : 17', ratioNote: '58 g/L — Pour Over / Siphon',
    desc: 'The world\'s most celebrated coffee variety. Geisha\'s ancestry traces to Ethiopia — in Panama\'s volcanic highlands it develops extraordinary floral aromatics and stone-fruit sweetness.',
  },
  {
    name: 'Rwanda Bourbon', flag: '🇷🇼', country: 'Rwanda', origin: 'Western Province, Rwanda',
    roast: 'Medium-Light', score: 90,
    flavor: ['Raspberry', 'Orange Zest', 'Caramel', 'Silky'],
    ratio: '1 : 15', ratioNote: '60 g/L — V60 / Cold Brew',
    desc: 'Grown on the shores of Lake Kivu by small-holder farmers, Rwanda Bourbon showcases a bright berry acidity reminiscent of red wine, balanced by a silky caramel sweetness.',
  },
  {
    name: 'Yemen Mokha', flag: '🇾🇪', country: 'Yemen', origin: 'Haraz Mountains, Yemen',
    roast: 'Medium-Dark', score: 89,
    flavor: ['Wild Berry', 'Dark Chocolate', 'Wine', 'Exotic Spice'],
    ratio: '1 : 13', ratioNote: '77 g/L — Turkish / Moka Pot',
    desc: 'Ancient dry-processed beans from one of the world\'s oldest coffee-growing regions. Yemen Mokha has an untamed, complex character with wild berry, wine-dark chocolate, and exotic spice.',
  },
  {
    name: 'Vietnam Robusta', flag: '🇻🇳', country: 'Vietnam', origin: 'Dak Lak Province, Vietnam',
    roast: 'Dark', score: 78,
    flavor: ['Bold', 'Earthy', 'Dark Tobacco', 'High Caffeine'],
    ratio: '1 : 10', ratioNote: '100 g/L — Phin Filter / Iced',
    desc: 'Vietnam is the world\'s second-largest coffee producer and Robusta capital. Intense, full-bodied, and twice the caffeine of Arabica — brewed Vietnamese-style with condensed milk.',
  },
  {
    name: 'Peru Organic', flag: '🇵🇪', country: 'Peru', origin: 'Junín & Cajamarca, Peru',
    roast: 'Medium', score: 86,
    flavor: ['Honey', 'Pecan', 'Cocoa Nib', 'Balanced'],
    ratio: '1 : 15', ratioNote: '60 g/L — Drip / Cold Brew',
    desc: 'Certified organic and shade-grown under a forest canopy in the Andes. Peru Organic is gentle and well-rounded — honey sweetness, nutty pecan, and a clean cocoa finish.',
  },
  {
    name: 'Mexico Chiapas', flag: '🇲🇽', country: 'Mexico', origin: 'Chiapas Highlands, Mexico',
    roast: 'Medium', score: 84,
    flavor: ['Brown Sugar', 'Walnut', 'Mild Acidity', 'Creamy'],
    ratio: '1 : 15', ratioNote: '60 g/L — Drip / Espresso',
    desc: 'From the fog-laden mountains of Chiapas near the Guatemalan border. A smooth, creamy cup with brown sugar sweetness, toasted walnut, and a gentle, approachable acidity.',
  },
]

const roastPct: Record<RoastLevel, number> = {
  'Light': 18, 'Medium-Light': 35, 'Medium': 52, 'Medium-Dark': 70, 'Dark': 88,
}

const roastColor: Record<RoastLevel, string> = {
  'Light': '#e8a845', 'Medium-Light': '#c8813a', 'Medium': '#a05c28',
  'Medium-Dark': '#7a3a14', 'Dark': '#4a1a08',
}

const selectedBean = ref<ShopBean | null>(null)
function openBean(b: ShopBean) { selectedBean.value = b }
function closeBean() { selectedBean.value = null }

const featured  = computed(() => store.products.filter(p => p.featured && p.category !== 'Sweets & Cakes').slice(0, 3))
const sweets    = computed(() => store.products.filter(p => p.category === 'Sweets & Cakes'))
const bestSellers = computed(() => [...store.products].sort((a, b) => b.reviews - a.reviews).slice(0, 4))

// Top 5 beans by SCA score
const bestBeans = computed(() => [...shopBeans].sort((a, b) => b.score - a.score).slice(0, 5))

const rankLabel  = ['🥇', '🥈', '🥉', '#4', '#5']
const rankColor  = ['#d4a060', '#a8a29e', '#c8813a', '#78716c', '#78716c']

// Ratio guide data
const ratioGuide = [
  { method: 'Espresso',       ratio: '1 : 2',  dose: '18 g in · 36 g out', time: '25–30 s', icon: '☕' },
  { method: 'Pour Over / V60', ratio: '1 : 15', dose: '20 g · 300 ml water', time: '3–4 min',  icon: '⏳' },
  { method: 'French Press',   ratio: '1 : 12', dose: '30 g · 360 ml water', time: '4 min',    icon: '🫙' },
  { method: 'Aeropress',      ratio: '1 : 16', dose: '15 g · 240 ml water', time: '2 min',    icon: '🔩' },
  { method: 'Cold Brew',      ratio: '1 : 8',  dose: '100 g · 800 ml water',time: '12–24 h',  icon: '🧊' },
  { method: 'Moka Pot',       ratio: '1 : 7',  dose: '20 g · 140 ml water', time: '5 min',    icon: '🫖' },
]

// Toast notification
const toast = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout>

function addToCart(p: typeof store.products[0]) {
  cart.addToCart(p, 'medium')
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
          <img :src="p.image" :alt="p.name" class="float-cup-photo" @error="() => {}"/>
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
          ☕ Freshly Brewed &nbsp;&nbsp; ✦ Premium Beans &nbsp;&nbsp; ☕ Free Delivery Over £30 &nbsp;&nbsp; ✦ Order Online &nbsp;&nbsp; ☕ Book a Table &nbsp;&nbsp; ✦ Earn Loyalty Points &nbsp;&nbsp; ☕ 4ever Coffee &nbsp;&nbsp;
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
              <img :src="p.image" :alt="p.name" class="menu-photo" @error="() => {}"/>
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
              <img :src="p.image" :alt="p.name" class="bs-photo" @error="() => {}"/>
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

    <!-- ── TESTIMONIALS ─────────────────────────────────────── -->
    <section class="testimonials-section reveal">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">What Our Customers Say</p>
          <h2 class="section-title">Loved by Coffee Lovers</h2>
          <p class="section-sub">Real reviews from real customers — no editing, no embellishment.</p>
        </div>
        <div class="reviews-grid">
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"The Panama Geisha pour-over changed my relationship with coffee. I didn't know a cup could taste like jasmine and honey. 4ever Coffee is genuinely world-class."</p>
            <div class="reviewer">
              <div class="reviewer-avatar" style="background: linear-gradient(135deg, #d4a060, #c8813a);">S</div>
              <div><div class="reviewer-name">Sarah M.</div><div class="reviewer-meta">Loyalty Gold Member · London</div></div>
            </div>
          </div>
          <div class="review-card featured">
            <div class="review-badge">⭐ Editor's Pick</div>
            <div class="review-stars gold">★★★★★</div>
            <p class="review-text">"I've tried every specialty coffee shop in London and 4ever Coffee is the one I keep coming back to. The baristas know their craft, the atmosphere is perfect, and the loyalty scheme actually rewards you."</p>
            <div class="reviewer">
              <div class="reviewer-avatar" style="background: linear-gradient(135deg, #1a0a04, #c8813a);">A</div>
              <div><div class="reviewer-name">Ahmad Al-Rashid</div><div class="reviewer-meta">Regular Customer · Kensington</div></div>
            </div>
          </div>
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"Ordered delivery at 8 AM and it arrived within 18 minutes — still piping hot. The Ethiopian Yirgacheffe was absolutely stunning. Free delivery over £30 makes this a no-brainer."</p>
            <div class="reviewer">
              <div class="reviewer-avatar" style="background: linear-gradient(135deg, #22c55e, #16a34a);">J</div>
              <div><div class="reviewer-name">James T.</div><div class="reviewer-meta">Verified Delivery Order · Chelsea</div></div>
            </div>
          </div>
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"The Victoria Sponge is incredible — light, perfectly balanced, not too sweet. Paired with a flat white it's the best afternoon break I've had. The sweets menu deserves its own award."</p>
            <div class="reviewer">
              <div class="reviewer-avatar" style="background: linear-gradient(135deg, #f59e0b, #d97706);">P</div>
              <div><div class="reviewer-name">Priya K.</div><div class="reviewer-meta">Gold Member · Notting Hill</div></div>
            </div>
          </div>
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"Booked a table for 6 through the app and it was effortless. The Roastery corner is a beautiful space — exposed brick, the smell of fresh roasting, and the quietest morning I've had in London."</p>
            <div class="reviewer">
              <div class="reviewer-avatar" style="background: linear-gradient(135deg, #6366f1, #4f46e5);">M</div>
              <div><div class="reviewer-name">Maria C.</div><div class="reviewer-meta">Table Booking · Shoreditch</div></div>
            </div>
          </div>
          <div class="review-card">
            <div class="review-stars">★★★★☆</div>
            <p class="review-text">"Reached Gold tier in 6 weeks just from my morning flat white. The free drink reward came through instantly on the app. Best loyalty scheme I've seen from any café, period."</p>
            <div class="reviewer">
              <div class="reviewer-avatar" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">D</div>
              <div><div class="reviewer-name">David W.</div><div class="reviewer-meta">Gold Member · Canary Wharf</div></div>
            </div>
          </div>
        </div>
        <div class="reviews-summary">
          <div class="rs-score">4.9</div>
          <div class="rs-info">
            <div class="rs-stars">★★★★★</div>
            <div class="rs-count">Based on 2,841 verified reviews</div>
            <div class="rs-platforms">Google · Trustpilot · Deliveroo · Uber Eats</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── LOYALTY CARD ──────────────────────────────────────── -->
    <div class="reveal"><LoyaltyCard /></div>

    <!-- ── RESERVATION + LOYALTY FEATURE STRIP ─────────────── -->
    <section class="feature-strip reveal">
      <div class="section-inner feature-inner">

        <RouterLink to="/shop/reservation" class="feat-card reservation">
          <div class="feat-bg"></div>
          <div class="feat-icon">🪑</div>
          <div class="feat-text">
            <h3>Book a Table</h3>
            <p>Reserve your perfect spot at our Jumeirah café. Instant confirmation, no waiting.</p>
          </div>
          <span class="feat-cta">Reserve Now →</span>
        </RouterLink>

        <RouterLink to="/shop/loyalty" class="feat-card loyalty">
          <div class="feat-bg"></div>
          <div class="feat-icon">⭐</div>
          <div class="feat-text">
            <h3>Loyalty Rewards</h3>
            <p>Earn 10 points per £1 spent. Redeem 500 points for a £5 reward. Climb to Gold tier.</p>
          </div>
          <span class="feat-cta">View Rewards →</span>
        </RouterLink>

      </div>
    </section>

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
              <img :src="p.image" :alt="p.name" class="sweet-photo" @error="() => {}"/>
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

    <!-- ── FROM OUR ROASTERY ───────────────────────────────────── -->
    <section class="beans-section reveal" id="beans">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">From Our Roastery</p>
          <h2 class="section-title">12 Origins, One Passion</h2>
          <p class="section-sub">Every bean tells a story. Click any origin to explore flavour notes, brew ratio, and what makes it special.</p>
        </div>

        <!-- Bean grid -->
        <div class="bean-grid">
          <button
            v-for="bean in shopBeans" :key="bean.name"
            class="sbean-card"
            @click="openBean(bean)"
          >
            <!-- Header -->
            <div class="sbean-head">
              <span class="sbean-flag">{{ bean.flag }}</span>
              <div class="sbean-title">
                <div class="sbean-name">{{ bean.name }}</div>
                <div class="sbean-country">{{ bean.country }}</div>
              </div>
              <div class="sbean-score" :style="{ color: roastColor[bean.roast] }">
                {{ bean.score }}<span class="sbean-score-denom">/100</span>
              </div>
            </div>

            <!-- Score bar -->
            <div class="sbean-bar-row">
              <span class="sbean-bar-label">Quality</span>
              <div class="sbean-bar-bg">
                <div class="sbean-bar-fill" :style="{ width: bean.score + '%', background: roastColor[bean.roast] }"></div>
              </div>
            </div>

            <!-- Roast level -->
            <div class="sbean-roast-row">
              <span class="sbean-roast-label" :style="{ color: roastColor[bean.roast] }">{{ bean.roast }}</span>
              <div class="sbean-roast-track">
                <div class="sbean-roast-fill" :style="{ width: roastPct[bean.roast] + '%', background: roastColor[bean.roast] }"></div>
              </div>
              <span class="sbean-roast-end">Dark</span>
            </div>

            <!-- Flavor tags -->
            <div class="sbean-flavors">
              <span v-for="f in bean.flavor.slice(0,3)" :key="f" class="sbean-flavor">{{ f }}</span>
            </div>

            <!-- Ratio pill -->
            <div class="sbean-ratio">
              <span class="ratio-icon">⚗</span>
              <span class="ratio-val">{{ bean.ratio }}</span>
              <span class="ratio-note">{{ bean.ratioNote }}</span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Bean detail modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedBean" class="bean-overlay" @click.self="closeBean">
          <div class="bean-modal">
            <button class="bean-modal-close" @click="closeBean">✕</button>

            <div class="bm-top">
              <span class="bm-flag">{{ selectedBean.flag }}</span>
              <div>
                <div class="bm-name">{{ selectedBean.name }}</div>
                <div class="bm-origin">{{ selectedBean.origin }}</div>
              </div>
              <div class="bm-score-ring">
                <svg viewBox="0 0 60 60" class="ring-svg">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#f0ebe4" stroke-width="5"/>
                  <circle cx="30" cy="30" r="24" fill="none" :stroke="roastColor[selectedBean.roast]" stroke-width="5"
                    stroke-linecap="round" stroke-dasharray="150.8"
                    :stroke-dashoffset="150.8 - (150.8 * selectedBean.score / 100)"
                    transform="rotate(-90 30 30)"/>
                </svg>
                <div class="ring-val">{{ selectedBean.score }}</div>
              </div>
            </div>

            <p class="bm-desc">{{ selectedBean.desc }}</p>

            <div class="bm-grid">
              <div class="bm-cell">
                <div class="bm-cell-label">Country</div>
                <div class="bm-cell-val">{{ selectedBean.flag }} {{ selectedBean.country }}</div>
              </div>
              <div class="bm-cell">
                <div class="bm-cell-label">Roast Level</div>
                <div class="bm-cell-val" :style="{ color: roastColor[selectedBean.roast] }">{{ selectedBean.roast }}</div>
              </div>
              <div class="bm-cell">
                <div class="bm-cell-label">Brew Ratio</div>
                <div class="bm-cell-val">{{ selectedBean.ratio }}</div>
              </div>
              <div class="bm-cell">
                <div class="bm-cell-label">Method</div>
                <div class="bm-cell-val">{{ selectedBean.ratioNote.split('—')[1]?.trim() }}</div>
              </div>
            </div>

            <div class="bm-section-label">Flavour Profile</div>
            <div class="bm-flavors">
              <span v-for="f in selectedBean.flavor" :key="f" class="bm-flavor" :style="{ borderColor: roastColor[selectedBean.roast] + '44', color: roastColor[selectedBean.roast] }">{{ f }}</span>
            </div>

            <div class="bm-section-label">Roast Spectrum</div>
            <div class="bm-spectrum">
              <span class="spec-end">Light</span>
              <div class="spec-track">
                <div class="spec-fill" :style="{ width: roastPct[selectedBean.roast] + '%', background: roastColor[selectedBean.roast] }"></div>
                <div class="spec-thumb" :style="{ left: roastPct[selectedBean.roast] + '%', background: roastColor[selectedBean.roast] }"></div>
              </div>
              <span class="spec-end">Dark</span>
            </div>

            <RouterLink to="/shop/menu" class="bm-cta" @click="closeBean">
              Order a Drink Using This Bean →
            </RouterLink>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── BEST SELLER BEANS ──────────────────────────────────── -->
    <section class="bsb-section reveal">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">Best Sellers</p>
          <h2 class="section-title">Our Top 5 Beans</h2>
          <p class="section-sub">Ranked by SCA quality score. The finest single-origin beans our roastery has to offer.</p>
        </div>

        <!-- Podium row: #1 centre, #2 left, #3 right, then #4 #5 below -->
        <div class="bsb-podium">
          <!-- #2 -->
          <div class="bsb-card rank-2">
            <div class="bsb-rank-badge" :style="{ color: rankColor[1] }">{{ rankLabel[1] }}</div>
            <div class="bsb-flag">{{ bestBeans[1].flag }}</div>
            <div class="bsb-name">{{ bestBeans[1].name }}</div>
            <div class="bsb-country">{{ bestBeans[1].country }}</div>
            <div class="bsb-score-row">
              <div class="bsb-score-ring">
                <svg viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#f0ebe4" stroke-width="5"/>
                  <circle cx="28" cy="28" r="22" fill="none" :stroke="roastColor[bestBeans[1].roast]" stroke-width="5"
                    stroke-linecap="round" stroke-dasharray="138.2"
                    :stroke-dashoffset="138.2 - (138.2 * bestBeans[1].score / 100)"
                    transform="rotate(-90 28 28)"/>
                </svg>
                <span class="bsb-score-num">{{ bestBeans[1].score }}</span>
              </div>
            </div>
            <div class="bsb-ratio-big">{{ bestBeans[1].ratio }}</div>
            <div class="bsb-ratio-method">{{ bestBeans[1].ratioNote }}</div>
            <div class="bsb-flavors">
              <span v-for="f in bestBeans[1].flavor.slice(0,3)" :key="f" class="bsb-flavor">{{ f }}</span>
            </div>
            <RouterLink to="/shop/roastery" class="bsb-order-btn">Order Beans →</RouterLink>
          </div>

          <!-- #1 (tallest / gold) -->
          <div class="bsb-card rank-1">
            <div class="bsb-champion-strip">☕ Most Popular</div>
            <div class="bsb-rank-badge rank-1-badge">{{ rankLabel[0] }}</div>
            <div class="bsb-flag bsb-flag-lg">{{ bestBeans[0].flag }}</div>
            <div class="bsb-name bsb-name-lg">{{ bestBeans[0].name }}</div>
            <div class="bsb-country">{{ bestBeans[0].country }}</div>
            <div class="bsb-score-row">
              <div class="bsb-score-ring bsb-score-ring-lg">
                <svg viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#d4a060" stroke-width="6"
                    stroke-linecap="round" stroke-dasharray="175.9"
                    :stroke-dashoffset="175.9 - (175.9 * bestBeans[0].score / 100)"
                    transform="rotate(-90 36 36)"/>
                </svg>
                <span class="bsb-score-num bsb-score-num-lg">{{ bestBeans[0].score }}</span>
              </div>
              <div class="bsb-score-label">SCA Score</div>
            </div>
            <div class="bsb-ratio-big bsb-ratio-gold">{{ bestBeans[0].ratio }}</div>
            <div class="bsb-ratio-method bsb-ratio-method-light">{{ bestBeans[0].ratioNote }}</div>
            <div class="bsb-flavors">
              <span v-for="f in bestBeans[0].flavor" :key="f" class="bsb-flavor bsb-flavor-gold">{{ f }}</span>
            </div>
            <RouterLink to="/shop/roastery" class="bsb-order-btn bsb-order-gold">Order Beans →</RouterLink>
          </div>

          <!-- #3 -->
          <div class="bsb-card rank-3">
            <div class="bsb-rank-badge" :style="{ color: rankColor[2] }">{{ rankLabel[2] }}</div>
            <div class="bsb-flag">{{ bestBeans[2].flag }}</div>
            <div class="bsb-name">{{ bestBeans[2].name }}</div>
            <div class="bsb-country">{{ bestBeans[2].country }}</div>
            <div class="bsb-score-row">
              <div class="bsb-score-ring">
                <svg viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#f0ebe4" stroke-width="5"/>
                  <circle cx="28" cy="28" r="22" fill="none" :stroke="roastColor[bestBeans[2].roast]" stroke-width="5"
                    stroke-linecap="round" stroke-dasharray="138.2"
                    :stroke-dashoffset="138.2 - (138.2 * bestBeans[2].score / 100)"
                    transform="rotate(-90 28 28)"/>
                </svg>
                <span class="bsb-score-num">{{ bestBeans[2].score }}</span>
              </div>
            </div>
            <div class="bsb-ratio-big">{{ bestBeans[2].ratio }}</div>
            <div class="bsb-ratio-method">{{ bestBeans[2].ratioNote }}</div>
            <div class="bsb-flavors">
              <span v-for="f in bestBeans[2].flavor.slice(0,3)" :key="f" class="bsb-flavor">{{ f }}</span>
            </div>
            <RouterLink to="/shop/roastery" class="bsb-order-btn">Order Beans →</RouterLink>
          </div>
        </div>

        <!-- Ranks #4 and #5 -->
        <div class="bsb-runner-ups">
          <div v-for="(bean, idx) in bestBeans.slice(3)" :key="bean.name" class="bsb-runner">
            <div class="bru-rank" :style="{ color: rankColor[idx + 3] }">{{ rankLabel[idx + 3] }}</div>
            <div class="bru-flag">{{ bean.flag }}</div>
            <div class="bru-info">
              <div class="bru-name">{{ bean.name }}</div>
              <div class="bru-country">{{ bean.country }}</div>
              <div class="bru-flavors">
                <span v-for="f in bean.flavor.slice(0,3)" :key="f" class="bru-flavor">{{ f }}</span>
              </div>
            </div>
            <div class="bru-ratio-wrap">
              <div class="bru-ratio">{{ bean.ratio }}</div>
              <div class="bru-ratio-note">{{ bean.ratioNote.split('—')[1]?.trim() ?? bean.ratioNote }}</div>
            </div>
            <div class="bru-score-wrap">
              <div class="bru-score">{{ bean.score }}</div>
              <div class="bru-score-label">/ 100</div>
            </div>
            <RouterLink to="/shop/roastery" class="bru-btn">Order →</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BREW RATIO GUIDE ──────────────────────────────────────── -->
    <section class="ratio-section reveal">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">Brew Guide</p>
          <h2 class="section-title section-title-light">Best Beans Ratio</h2>
          <p class="section-sub-light">The golden ratios for every brewing method. Start here, then adjust to taste.</p>
        </div>

        <div class="ratio-grid">
          <div v-for="r in ratioGuide" :key="r.method" class="ratio-card">
            <div class="rc-icon">{{ r.icon }}</div>
            <div class="rc-method">{{ r.method }}</div>
            <div class="rc-ratio">{{ r.ratio }}</div>
            <div class="rc-divider"></div>
            <div class="rc-detail-row">
              <div class="rc-detail">
                <div class="rc-detail-label">Dose</div>
                <div class="rc-detail-val">{{ r.dose }}</div>
              </div>
              <div class="rc-detail">
                <div class="rc-detail-label">Time</div>
                <div class="rc-detail-val">{{ r.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Best ratio summary bar -->
        <div class="ratio-summary">
          <div class="rs-title">Quick Reference</div>
          <div class="rs-bars">
            <div v-for="r in ratioGuide" :key="r.method" class="rs-bar-item">
              <div class="rs-method">{{ r.method }}</div>
              <div class="rs-track">
                <div class="rs-fill" :style="{ width: (1 / +r.ratio.split(':')[1].trim() * 100 * 8) + '%' }"></div>
              </div>
              <div class="rs-ratio-label">{{ r.ratio }}</div>
            </div>
          </div>
          <div class="rs-legend">
            <span class="rs-leg-dot coffee"></span><span>Coffee</span>
            <span class="rs-leg-dot water"></span><span>Water</span>
          </div>
        </div>

        <div class="ratio-cta-row">
          <RouterLink to="/shop/roastery" class="ratio-cta">Browse Our Beans & Order →</RouterLink>
        </div>
      </div>
    </section>

    <!-- ── ORDER ON DELIVERY APPS ───────────────────────────── -->
    <section class="delivery-section reveal">
      <div class="section-inner">
        <div class="delivery-head">
          <p class="section-eyebrow light">Order Online</p>
          <h2 class="section-title section-title-light">Get 4ever Coffee Delivered</h2>
          <p class="delivery-sub">Fresh coffee to your door in under 30 minutes — order on your favourite platform.</p>
        </div>

        <div class="delivery-apps">
          <a href="#" class="dapp dapp-deliveroo" target="_blank" rel="noopener noreferrer">
            <div class="dapp-icon">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,.15)"/><path d="M10 28c1-4 4-7 10-7s9 3 10 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="14" r="5" fill="#fff"/><circle cx="30" cy="24" r="3" fill="rgba(255,255,255,.6)"/><path d="M28 22l4 2-2 4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="dapp-name">Deliveroo</div>
            <div class="dapp-eta">⏱ ~20 min</div>
            <div class="dapp-cta">Order Now →</div>
          </a>

          <a href="#" class="dapp dapp-keeta" target="_blank" rel="noopener noreferrer">
            <div class="dapp-icon">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,.15)"/><path d="M22 8l-6 12h6l-4 12 10-14h-6l4-10z" fill="#fff" stroke="#fff" stroke-width="1" stroke-linejoin="round"/></svg>
            </div>
            <div class="dapp-name">Keeta</div>
            <div class="dapp-eta">⏱ ~15 min</div>
            <div class="dapp-cta">Order Now →</div>
          </a>

          <a href="#" class="dapp dapp-talabat" target="_blank" rel="noopener noreferrer">
            <div class="dapp-icon">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,.15)"/><path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S25.523 10 20 10zm0 4a6 6 0 1 1 0 12A6 6 0 0 1 20 14z" fill="#fff"/><circle cx="20" cy="20" r="3" fill="#fff"/></svg>
            </div>
            <div class="dapp-name">Talabat</div>
            <div class="dapp-eta">⏱ ~25 min</div>
            <div class="dapp-cta">Order Now →</div>
          </a>

          <a href="#" class="dapp dapp-ubereats" target="_blank" rel="noopener noreferrer">
            <div class="dapp-icon">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(6,193,103,.2)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#06C167" font-size="14" font-weight="900" font-family="system-ui">Ue</text></svg>
            </div>
            <div class="dapp-name">Uber Eats</div>
            <div class="dapp-eta">⏱ ~20 min</div>
            <div class="dapp-cta">Order Now →</div>
          </a>

          <a href="#" class="dapp dapp-noon" target="_blank" rel="noopener noreferrer">
            <div class="dapp-icon">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(0,0,0,.25)"/><circle cx="20" cy="20" r="8" fill="#FEEE00"/><path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="#FEEE00" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
            <div class="dapp-name">Noon Food</div>
            <div class="dapp-eta">⏱ ~30 min</div>
            <div class="dapp-cta">Order Now →</div>
          </a>
        </div>

        <div class="delivery-perks">
          <div class="dperk"><span class="dperk-icon">📍</span> Covering all UAE areas</div>
          <div class="dperk"><span class="dperk-icon">☕</span> Full menu available</div>
          <div class="dperk"><span class="dperk-icon">⭐</span> 4.9★ on all platforms</div>
          <div class="dperk"><span class="dperk-icon">🛡</span> Live order tracking</div>
        </div>
      </div>
    </section>

    <!-- ── FROM FARM TO CUP ──────────────────────────────────── -->
    <section class="process-section reveal">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">Our Process</p>
          <h2 class="section-title">From Farm to Cup</h2>
          <p class="section-sub">Every sip has a story. We control every step of the journey from bean to barista.</p>
        </div>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M24 44C24 44 8 34 8 20a16 16 0 0 1 32 0C40 34 24 44 24 44z"/>
                <circle cx="24" cy="20" r="6"/>
              </svg>
            </div>
            <div class="step-num">01</div>
            <h3 class="step-title">Origin Sourcing</h3>
            <p class="step-desc">We visit farms across 12 countries to taste, evaluate, and directly source the finest single-origin green beans. No middlemen — every farmer is paid above Fair Trade premium.</p>
          </div>
          <div class="process-connector"></div>
          <div class="process-step">
            <div class="step-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M12 40V28c0-8 4-14 12-16M36 40V28c0-8-4-14-12-16"/>
                <path d="M8 40h32M20 12c0-4 2-8 4-8s4 4 4 8"/>
                <circle cx="24" cy="28" r="4"/>
              </svg>
            </div>
            <div class="step-num">02</div>
            <h3 class="step-title">Precision Roasting</h3>
            <p class="step-desc">Our head roaster profiles each origin individually using a 15 kg drum roaster. Small batches, constant monitoring, and an obsession with hitting the exact roast curve every time.</p>
          </div>
          <div class="process-connector"></div>
          <div class="process-step">
            <div class="step-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M16 10h16v4l4 4v16l-4 4H16l-4-4V18l4-4V10z"/>
                <path d="M20 18v12M24 16v16M28 18v12"/>
                <path d="M14 30h20"/>
              </svg>
            </div>
            <div class="step-num">03</div>
            <h3 class="step-title">Quality Cupping</h3>
            <p class="step-desc">Every batch is cupped (professionally taste-tested) by our SCA-certified baristas before it ever reaches a customer. If it doesn't score 82+ on the SCA scale, it doesn't leave our lab.</p>
          </div>
          <div class="process-connector"></div>
          <div class="process-step">
            <div class="step-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M10 38c0-10 5-18 14-22"/>
                <circle cx="24" cy="12" r="6"/>
                <path d="M24 18v6"/>
                <ellipse cx="24" cy="34" rx="10" ry="6"/>
                <path d="M14 34c0 4 4.5 8 10 8s10-4 10-8"/>
              </svg>
            </div>
            <div class="step-num">04</div>
            <h3 class="step-title">Expert Brewing</h3>
            <p class="step-desc">Our baristas train for 6 months before serving a single espresso. Each drink is crafted to the gram, at the right temperature, with the exact brew ratio for that specific bean.</p>
          </div>
          <div class="process-connector"></div>
          <div class="process-step">
            <div class="step-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M12 36V20c0-6.627 5.373-12 12-12s12 5.373 12 12v16"/>
                <path d="M8 36h32"/>
                <path d="M20 36c0 2.209 1.791 4 4 4s4-1.791 4-4"/>
                <path d="M24 20c-2.2 0-4 1.8-4 4"/>
              </svg>
            </div>
            <div class="step-num">05</div>
            <h3 class="step-title">In Your Hands</h3>
            <p class="step-desc">Whether you're drinking in-store, ordering delivery, or brewing at home with our beans — the journey ends with you. Every cup carries the full story of where it came from.</p>
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
                <img :src="p.image" :alt="p.name" class="about-mini-photo" @error="() => {}"/>
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
            <div class="pillar"><span class="pillar-icon">🚴</span><div><div class="p-title">Fast Delivery</div><div class="p-sub">Free on all orders over £30</div></div></div>
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

/* ── FEATURE STRIP ──────────────────────────────── */
.feature-strip { padding: 72px 0; background: #faf7f2; }
.feature-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 720px) { .feature-inner { grid-template-columns: 1fr; } }

.feat-card {
  position: relative; border-radius: 20px; overflow: hidden;
  padding: 32px 28px; display: flex; flex-direction: column; gap: 14px;
  text-decoration: none; transition: transform 0.25s, box-shadow 0.25s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}
.feat-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.18); }
.feat-card.reservation { background: linear-gradient(135deg, #1c0f06, #2c1810); }
.feat-card.loyalty     { background: linear-gradient(135deg, #0f1a0f, #162616); }
.feat-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 20%, rgba(212,160,96,0.15), transparent 60%); pointer-events: none; }
.feat-icon { font-size: 36px; position: relative; z-index: 1; }
.feat-text { position: relative; z-index: 1; flex: 1; }
.feat-text h3 { font-size: 20px; font-weight: 900; color: #fdf6ec; margin: 0 0 8px; letter-spacing: -0.4px; }
.feat-text p  { font-size: 13px; color: #a8a29e; line-height: 1.6; margin: 0; }
.feat-cta { position: relative; z-index: 1; font-size: 13px; font-weight: 700; color: #d4a060; }

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

/* ── FROM OUR ROASTERY ──────────────────────────── */
.beans-section { padding: 88px 0; background: #fff; }

.bean-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1100px) { .bean-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px)  { .bean-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .bean-grid { grid-template-columns: 1fr; } }

.sbean-card {
  background: #faf7f2; border: 1.5px solid #f0ebe4; border-radius: 16px;
  padding: 16px; text-align: left; cursor: pointer;
  transition: all 0.22s; display: flex; flex-direction: column; gap: 10px;
  font: inherit;
}
.sbean-card:hover {
  border-color: #d4a060; background: #fffbf5;
  transform: translateY(-3px); box-shadow: 0 10px 32px rgba(212,160,96,0.14);
}

.sbean-head { display: flex; align-items: center; gap: 10px; }
.sbean-flag { font-size: 26px; flex-shrink: 0; }
.sbean-title { flex: 1; min-width: 0; }
.sbean-name { font-size: 13px; font-weight: 800; color: #1c1917; line-height: 1.25; }
.sbean-country { font-size: 11px; color: #a8a29e; margin-top: 2px; }
.sbean-score { font-size: 20px; font-weight: 900; flex-shrink: 0; }
.sbean-score-denom { font-size: 10px; font-weight: 600; color: #a8a29e; }

.sbean-bar-row { display: flex; align-items: center; gap: 8px; }
.sbean-bar-label { font-size: 10px; font-weight: 700; color: #a8a29e; width: 40px; flex-shrink: 0; }
.sbean-bar-bg { flex: 1; height: 5px; background: #e7e5e4; border-radius: 3px; overflow: hidden; }
.sbean-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

.sbean-roast-row { display: flex; align-items: center; gap: 6px; }
.sbean-roast-label { font-size: 10px; font-weight: 700; width: 80px; flex-shrink: 0; }
.sbean-roast-track { flex: 1; height: 5px; background: linear-gradient(90deg, #fde68a, #b45309); border-radius: 3px; overflow: hidden; position: relative; }
.sbean-roast-fill  { height: 100%; border-radius: 3px; mix-blend-mode: multiply; }
.sbean-roast-end   { font-size: 10px; color: #a8a29e; flex-shrink: 0; }

.sbean-flavors { display: flex; flex-wrap: wrap; gap: 4px; }
.sbean-flavor  { background: #f5f0ea; color: #78716c; border-radius: 20px; padding: 2px 8px; font-size: 10px; font-weight: 600; }

.sbean-ratio {
  display: flex; align-items: center; gap: 6px;
  background: #1c1917; border-radius: 8px; padding: 7px 10px; margin-top: 2px;
}
.ratio-icon { font-size: 13px; }
.ratio-val   { font-size: 13px; font-weight: 800; color: #d4a060; }
.ratio-note  { font-size: 10px; color: #78716c; }

/* Bean modal */
.bean-overlay {
  position: fixed; inset: 0; background: rgba(28,25,23,0.7);
  backdrop-filter: blur(6px); z-index: 500;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.bean-modal {
  background: #fff; border-radius: 24px; padding: 32px;
  max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto;
  position: relative; box-shadow: 0 32px 80px rgba(0,0,0,0.4);
}
.bean-modal-close {
  position: absolute; top: 16px; right: 16px;
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e7e5e4;
  background: #faf7f2; cursor: pointer; font-size: 12px; color: #78716c;
  display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.bean-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

.bm-top { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.bm-flag { font-size: 48px; flex-shrink: 0; }
.bm-name { font-size: 20px; font-weight: 900; color: #1c1917; letter-spacing: -0.4px; }
.bm-origin { font-size: 12px; color: #a8a29e; margin-top: 3px; }

.bm-score-ring { position: relative; width: 60px; height: 60px; flex-shrink: 0; margin-left: auto; }
.ring-svg { width: 60px; height: 60px; }
.ring-val { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 900; color: #1c1917; }

.bm-desc { font-size: 14px; color: #57534e; line-height: 1.7; margin: 0 0 20px; }

.bm-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 22px; }
@media (max-width: 480px) { .bm-grid { grid-template-columns: repeat(2,1fr); } }
.bm-cell { background: #faf7f2; border-radius: 10px; padding: 10px 12px; }
.bm-cell-label { font-size: 10px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.bm-cell-val   { font-size: 13px; font-weight: 800; color: #1c1917; }

.bm-section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #a8a29e; margin-bottom: 10px; }

.bm-flavors { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 22px; }
.bm-flavor {
  border: 1.5px solid; border-radius: 20px;
  padding: 5px 14px; font-size: 12px; font-weight: 700; background: transparent;
}

.bm-spectrum { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
.spec-end   { font-size: 11px; color: #a8a29e; font-weight: 600; flex-shrink: 0; }
.spec-track { flex: 1; height: 8px; background: linear-gradient(90deg, #fde68a, #b45309, #4a1a08); border-radius: 4px; position: relative; }
.spec-fill  { position: absolute; inset: 0; border-radius: 4px; }
.spec-thumb { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: left 0.3s ease; }

.bm-cta {
  display: block; text-align: center; background: linear-gradient(135deg,#c8813a,#d4a060);
  color: #fff; border-radius: 12px; padding: 14px; font-size: 14px; font-weight: 700;
  text-decoration: none; transition: all 0.2s;
}
.bm-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,129,58,0.4); }

/* Modal animation */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
.modal-enter-from .bean-modal,
.modal-leave-to .bean-modal { transform: scale(0.94) translateY(12px); }
.modal-enter-active .bean-modal,
.modal-leave-active .bean-modal { transition: all 0.25s ease; }

/* ── BEST SELLER BEANS ──────────────────────────── */
.bsb-section { padding: 88px 0; background: #faf7f2; }

/* Podium: #2 left, #1 centre (tallest), #3 right */
.bsb-podium {
  display: grid;
  grid-template-columns: 1fr 1.18fr 1fr;
  gap: 16px;
  align-items: end;
  margin-bottom: 20px;
}
@media (max-width: 860px) { .bsb-podium { grid-template-columns: 1fr; align-items: stretch; } }

.bsb-card {
  background: #fff; border: 1.5px solid #f0ebe4; border-radius: 20px;
  padding: 22px 18px 20px; display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 10px;
  transition: transform .25s, box-shadow .25s; position: relative; overflow: hidden;
}
.bsb-card:hover { transform: translateY(-4px); box-shadow: 0 16px 44px rgba(44,16,8,.1); }

/* #1 card — dark gold */
.bsb-card.rank-1 {
  background: linear-gradient(160deg, #1a0a04, #2c1810);
  border-color: rgba(212,160,96,.4);
  box-shadow: 0 8px 32px rgba(200,129,58,.25);
  padding-top: 0;
}
.bsb-champion-strip {
  width: calc(100% + 0px); margin: 0 0 16px;
  background: linear-gradient(90deg, #c8813a, #d4a060);
  color: #fff; font-size: 11px; font-weight: 800;
  letter-spacing: .08em; padding: 8px 16px;
  text-transform: uppercase;
}

.bsb-rank-badge { font-size: 22px; }
.rank-1-badge   { font-size: 28px; }

.bsb-flag    { font-size: 36px; }
.bsb-flag-lg { font-size: 48px; }

.bsb-name    { font-size: 14px; font-weight: 800; color: #1c1917; line-height: 1.3; }
.bsb-name-lg { font-size: 17px; color: #fdf6ec !important; }
.rank-1 .bsb-name { color: #fdf6ec; }

.bsb-country { font-size: 11px; color: #a8a29e; }
.rank-1 .bsb-country { color: #78716c; }

/* Score ring */
.bsb-score-row { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.bsb-score-ring { position: relative; width: 56px; height: 56px; }
.bsb-score-ring svg { width: 56px; height: 56px; }
.bsb-score-num {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 900; color: #1c1917;
}
.bsb-score-ring-lg { width: 72px; height: 72px; }
.bsb-score-ring-lg svg { width: 72px; height: 72px; }
.bsb-score-num-lg  { font-size: 20px; color: #d4a060 !important; }
.bsb-score-label   { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #78716c; }
.rank-1 .bsb-score-num { color: #d4a060; }

/* Ratio */
.bsb-ratio-big {
  font-size: 28px; font-weight: 900; color: #1c1917;
  letter-spacing: -1px; line-height: 1;
}
.bsb-ratio-gold  { font-size: 36px; color: #d4a060 !important; }
.bsb-ratio-method { font-size: 10px; color: #a8a29e; }
.bsb-ratio-method-light { color: #57534e; }

/* Flavor tags */
.bsb-flavors { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
.bsb-flavor  { background: #f5f0ea; color: #78716c; border-radius: 20px; padding: 3px 9px; font-size: 10px; font-weight: 600; }
.bsb-flavor-gold { background: rgba(212,160,96,.15); color: #d4a060; }

/* Order button */
.bsb-order-btn {
  display: inline-block; margin-top: 4px;
  background: #f5f0ea; color: #1c1917;
  border-radius: 10px; padding: 8px 16px;
  font-size: 12px; font-weight: 700; text-decoration: none;
  transition: all .15s;
}
.bsb-order-btn:hover { background: #e7e5e4; }
.bsb-order-gold {
  background: linear-gradient(135deg, #c8813a, #d4a060) !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(200,129,58,.4);
}
.bsb-order-gold:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,129,58,.55); }

/* Runner-up rows (#4 and #5) */
.bsb-runner-ups { display: flex; flex-direction: column; gap: 10px; }
.bsb-runner {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 14px;
  padding: 14px 20px; display: flex; align-items: center; gap: 16px;
  transition: all .18s;
}
.bsb-runner:hover { border-color: #d4a060; box-shadow: 0 4px 16px rgba(212,160,96,.1); }
.bru-rank  { font-size: 18px; flex-shrink: 0; width: 32px; text-align: center; }
.bru-flag  { font-size: 26px; flex-shrink: 0; }
.bru-info  { flex: 1; min-width: 0; }
.bru-name  { font-size: 13px; font-weight: 800; color: #1c1917; }
.bru-country { font-size: 11px; color: #a8a29e; margin-top: 1px; }
.bru-flavors { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.bru-flavor  { background: #f5f0ea; color: #78716c; border-radius: 20px; padding: 2px 8px; font-size: 10px; font-weight: 600; }

.bru-ratio-wrap { text-align: center; flex-shrink: 0; }
.bru-ratio      { font-size: 20px; font-weight: 900; color: #c8813a; letter-spacing: -0.5px; }
.bru-ratio-note { font-size: 10px; color: #a8a29e; white-space: nowrap; }

.bru-score-wrap { text-align: center; flex-shrink: 0; }
.bru-score      { font-size: 22px; font-weight: 900; color: #1c1917; line-height: 1; }
.bru-score-label { font-size: 10px; color: #a8a29e; font-weight: 600; }

.bru-btn {
  flex-shrink: 0; background: #d4a060; color: #fff;
  border-radius: 8px; padding: 7px 14px;
  font-size: 12px; font-weight: 700; text-decoration: none; transition: background .15s;
}
.bru-btn:hover { background: #c8813a; }

/* ── BREW RATIO GUIDE ────────────────────────────── */
.ratio-section { padding: 88px 0; background: #1a0a04; }

.ratio-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  margin-bottom: 36px;
}
@media (max-width: 900px) { .ratio-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .ratio-grid { grid-template-columns: 1fr; } }

.ratio-card {
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
  border-radius: 18px; padding: 24px 20px;
  display: flex; flex-direction: column; gap: 8px;
  transition: all .2s;
}
.ratio-card:hover {
  background: rgba(255,255,255,.08); border-color: rgba(212,160,96,.3);
  transform: translateY(-3px);
}
.rc-icon    { font-size: 26px; }
.rc-method  { font-size: 13px; font-weight: 700; color: #fdf6ec; }
.rc-ratio   { font-size: 32px; font-weight: 900; color: #d4a060; letter-spacing: -1.5px; line-height: 1; }
.rc-divider { height: 1px; background: rgba(255,255,255,.08); margin: 4px 0; }
.rc-detail-row { display: flex; gap: 16px; }
.rc-detail      { display: flex; flex-direction: column; gap: 2px; }
.rc-detail-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #44403c; }
.rc-detail-val   { font-size: 11px; font-weight: 600; color: #a8a29e; }

/* Ratio bar summary */
.ratio-summary {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px; padding: 24px 28px; margin-bottom: 36px;
}
.rs-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #44403c; margin-bottom: 18px; }
.rs-bars  { display: flex; flex-direction: column; gap: 10px; }
.rs-bar-item { display: grid; grid-template-columns: 130px 1fr 60px; align-items: center; gap: 12px; }
.rs-method { font-size: 12px; font-weight: 600; color: #a8a29e; }
.rs-track  { height: 10px; background: rgba(255,255,255,.06); border-radius: 5px; overflow: hidden; position: relative; }
.rs-fill   { height: 100%; background: linear-gradient(90deg, #d4a060, #c8813a); border-radius: 5px; max-width: 100%; }
.rs-ratio-label { font-size: 13px; font-weight: 800; color: #d4a060; text-align: right; }
.rs-legend { display: flex; align-items: center; gap: 16px; margin-top: 16px; font-size: 11px; color: #44403c; font-weight: 600; }
.rs-leg-dot { width: 10px; height: 10px; border-radius: 50%; }
.rs-leg-dot.coffee { background: #d4a060; }
.rs-leg-dot.water  { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); }

.ratio-cta-row { text-align: center; }
.ratio-cta {
  display: inline-block; background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border-radius: 12px; padding: 14px 36px;
  font-size: 15px; font-weight: 700; text-decoration: none;
  box-shadow: 0 6px 20px rgba(200,129,58,.4); transition: all .2s;
}
.ratio-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,129,58,.55); }

/* ── DELIVERY SECTION ────────────────────────────── */
.delivery-section { padding: 88px 0; background: #13100e; }

.delivery-head { text-align: center; margin-bottom: 52px; }
.delivery-sub  { font-size: 17px; color: #78716c; max-width: 500px; margin: 12px auto 0; line-height: 1.6; }

.delivery-apps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}
@media (max-width: 960px) { .delivery-apps { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 560px) { .delivery-apps { grid-template-columns: repeat(2, 1fr); } }

.dapp {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 28px 16px 22px; border-radius: 20px; text-decoration: none;
  transition: transform .25s, box-shadow .25s; border: 1.5px solid rgba(255,255,255,.06);
}
.dapp:hover { transform: translateY(-6px); }

.dapp-icon { width: 56px; height: 56px; }
.dapp-icon svg { width: 100%; height: 100%; }

.dapp-name { font-size: 15px; font-weight: 800; color: #fff; }
.dapp-eta  { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.55); }
.dapp-cta  {
  font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 20px;
  background: rgba(255,255,255,.12); color: rgba(255,255,255,.8);
  transition: background .15s; margin-top: 2px;
}
.dapp:hover .dapp-cta { background: rgba(255,255,255,.22); color: #fff; }

/* Brand colours */
.dapp-deliveroo { background: linear-gradient(145deg, #007d77, #00ccbc); }
.dapp-deliveroo:hover { box-shadow: 0 16px 40px rgba(0,204,188,.3); }

.dapp-keeta { background: linear-gradient(145deg, #c73605, #ff6b35); }
.dapp-keeta:hover { box-shadow: 0 16px 40px rgba(255,107,53,.3); }

.dapp-talabat { background: linear-gradient(145deg, #c04200, #ff6600); }
.dapp-talabat:hover { box-shadow: 0 16px 40px rgba(255,102,0,.3); }

.dapp-ubereats { background: linear-gradient(145deg, #111, #1c1c1c); border-color: rgba(6,193,103,.3); }
.dapp-ubereats .dapp-name { color: #06C167; }
.dapp-ubereats:hover { box-shadow: 0 16px 40px rgba(6,193,103,.2); border-color: rgba(6,193,103,.55); }

.dapp-noon { background: linear-gradient(145deg, #b8980a, #e8c800); }
.dapp-noon .dapp-name { color: #1a1100; }
.dapp-noon .dapp-eta  { color: rgba(0,0,0,.5); }
.dapp-noon .dapp-cta  { background: rgba(0,0,0,.12); color: rgba(0,0,0,.75); }
.dapp-noon:hover { box-shadow: 0 16px 40px rgba(254,238,0,.25); }
.dapp-noon:hover .dapp-cta { background: rgba(0,0,0,.2); color: #111; }

/* Perks bar */
.delivery-perks {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 20px 36px;
  padding: 22px 32px; background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07); border-radius: 14px;
}
.dperk { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #78716c; }
.dperk-icon { font-size: 18px; }

/* ── TESTIMONIALS ───────────────────────────────── */
.testimonials-section { padding: 88px 0; background: #faf7f2; }
.reviews-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px;
}
@media (max-width: 1050px) { .reviews-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px)  { .reviews-grid { grid-template-columns: 1fr; } }

.review-card {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 20px;
  padding: 28px 24px; display: flex; flex-direction: column; gap: 16px;
  box-shadow: 0 2px 8px rgba(44,16,8,0.05); transition: all 0.25s; position: relative;
}
.review-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(44,16,8,0.1); }
.review-card.featured { border-color: #d4a060; background: #fffbf5; box-shadow: 0 4px 20px rgba(212,160,96,0.15); }
.review-badge { position: absolute; top: -12px; left: 20px; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
.review-stars { font-size: 15px; color: #e7e5e4; letter-spacing: 2px; }
.review-stars.gold { color: #d4a060; }
.review-card.featured .review-stars { color: #d4a060; }
.review-text { font-size: 14px; color: #57534e; line-height: 1.75; margin: 0; flex: 1; font-style: italic; }
.reviewer { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.reviewer-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #fff; flex-shrink: 0; }
.reviewer-name { font-size: 13px; font-weight: 700; color: #1c1917; }
.reviewer-meta { font-size: 11px; color: #a8a29e; }

.reviews-summary {
  display: flex; align-items: center; justify-content: center; gap: 20px;
  background: #1a0a04; border-radius: 16px; padding: 28px 32px;
  max-width: 400px; margin: 0 auto;
}
.rs-score { font-size: 52px; font-weight: 900; color: #d4a060; line-height: 1; }
.rs-stars  { font-size: 20px; color: #d4a060; letter-spacing: 3px; }
.rs-count  { font-size: 13px; color: #a8a29e; margin: 4px 0; }
.rs-platforms { font-size: 11px; color: #6b6360; }

/* ── FROM FARM TO CUP ───────────────────────────── */
.process-section { padding: 88px 0; background: #0d0603; overflow: hidden; }
.process-section .section-title { color: #fdf6ec; }
.process-section .section-sub   { color: #6b6360; }
.process-section .section-eyebrow { color: #d4a060; }
.process-steps {
  display: flex; align-items: flex-start; gap: 0;
  overflow-x: auto; padding-bottom: 16px;
}
.process-steps::-webkit-scrollbar { height: 4px; }
.process-steps::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
.process-steps::-webkit-scrollbar-thumb { background: #d4a060; border-radius: 2px; }

.process-step {
  flex: 1; min-width: 180px; max-width: 220px; display: flex; flex-direction: column;
  align-items: center; text-align: center; padding: 28px 16px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; transition: all 0.25s;
}
.process-step:hover { background: rgba(255,255,255,0.06); border-color: rgba(212,160,96,0.3); transform: translateY(-4px); }
.step-icon { width: 56px; height: 56px; background: rgba(212,160,96,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #d4a060; margin-bottom: 12px; }
.step-icon svg { width: 28px; height: 28px; }
.step-num { font-size: 11px; font-weight: 800; color: #d4a060; letter-spacing: 0.1em; margin-bottom: 8px; }
.step-title { font-size: 15px; font-weight: 800; color: #fdf6ec; margin: 0 0 10px; letter-spacing: -0.3px; }
.step-desc  { font-size: 12px; color: #6b6360; line-height: 1.7; margin: 0; }

.process-connector {
  flex-shrink: 0; width: 40px; height: 2px; background: linear-gradient(90deg, rgba(212,160,96,0.4), rgba(212,160,96,0.15));
  align-self: center; position: relative; margin: 0 -4px;
}
.process-connector::after {
  content: '→'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  color: rgba(212,160,96,0.5); font-size: 14px; background: #0d0603; padding: 0 4px; margin-top: -1px;
}
@media (max-width: 900px) {
  .process-steps { flex-wrap: nowrap; }
}
@media (max-width: 640px) {
  .process-section .section-head { text-align: center; padding: 0 20px; }
  .process-steps { gap: 12px; padding: 0 20px 20px; }
  .process-step { min-width: 200px; }
  .process-connector { display: none; }
}

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
