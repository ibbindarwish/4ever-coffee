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
  // Clock
  clockInterval = setInterval(updateClock, 1000)
  // Testimonial carousel
  startReviewCycle()
})

import { onUnmounted } from 'vue'
import { useRoasteryStore } from '../../stores/roastery'
import { useCrmStore, type EmailTag } from '../../stores/crm'

const roasteryStore = useRoasteryStore()
const crmStore = useCrmStore()

// ── NEWSLETTER SIGNUP ─────────────────────────────────────────────────────────
const nlName   = ref('')
const nlEmail  = ref('')
const nlTags   = ref<EmailTag[]>(['deals', 'discounts'])
const nlSent   = ref(false)
const nlError  = ref('')

const NL_TAGS: { key: EmailTag; label: string; icon: string }[] = [
  { key: 'deals',     label: 'New Deals',     icon: '🆕' },
  { key: 'roastery',  label: 'Roastery',       icon: '🌍' },
  { key: 'reviews',   label: 'Reviews',        icon: '⭐' },
  { key: 'discounts', label: 'Discounts',      icon: '🏷' },
]

function toggleNlTag(t: EmailTag) {
  const i = nlTags.value.indexOf(t)
  if (i === -1) nlTags.value.push(t)
  else nlTags.value.splice(i, 1)
}

function submitNewsletter() {
  nlError.value = ''
  if (!nlEmail.value.trim()) { nlError.value = 'Please enter your email address.'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlEmail.value)) { nlError.value = 'Please enter a valid email address.'; return }
  const tags = nlTags.value.length ? [...nlTags.value] : ['deals' as EmailTag]
  crmStore.addSubscriber(nlName.value.trim() || 'Coffee Lover', nlEmail.value.trim(), tags)
  nlSent.value = true
}

// ── COFFEE CLOCK ─────────────────────────────────────────────────────────────
const now = ref(new Date())
let clockInterval: ReturnType<typeof setInterval>
onUnmounted(() => { clearInterval(clockInterval); clearInterval(reviewInterval) })
function updateClock() { now.value = new Date() }

// ── TESTIMONIAL CAROUSEL ─────────────────────────────────────────────────────
const REVIEWS = [
  { stars: 5, text: 'The Panama Geisha pour-over changed my relationship with coffee. I didn\'t know a cup could taste like jasmine and honey. 4ever Coffee is genuinely world-class.', author: 'Sarah M.', meta: 'Loyalty Gold Member · London', initial: 'S', bg: 'linear-gradient(135deg,#d4a060,#c8813a)', featured: false },
  { stars: 5, text: 'I\'ve tried every specialty coffee shop in London and 4ever Coffee is the one I keep coming back to. The baristas know their craft, the atmosphere is perfect, and the loyalty scheme actually rewards you.', author: 'Ahmad Al-Rashid', meta: 'Regular Customer · Kensington', initial: 'A', bg: 'linear-gradient(135deg,#1a0a04,#c8813a)', featured: true },
  { stars: 5, text: 'Ordered delivery at 8 AM and it arrived within 18 minutes — still piping hot. The Ethiopian Yirgacheffe was absolutely stunning. Free delivery over £30 makes this a no-brainer.', author: 'James T.', meta: 'Verified Delivery Order · Chelsea', initial: 'J', bg: 'linear-gradient(135deg,#22c55e,#16a34a)', featured: false },
  { stars: 5, text: 'The Victoria Sponge is incredible — light, perfectly balanced, not too sweet. Paired with a flat white it\'s the best afternoon break I\'ve had. The sweets menu deserves its own award.', author: 'Priya K.', meta: 'Gold Member · Notting Hill', initial: 'P', bg: 'linear-gradient(135deg,#f59e0b,#d97706)', featured: false },
  { stars: 5, text: 'Booked a table for 6 through the app and it was effortless. The Roastery corner is a beautiful space — exposed brick, the smell of fresh roasting, and the quietest morning I\'ve had.', author: 'Maria C.', meta: 'Table Booking · Shoreditch', initial: 'M', bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', featured: false },
  { stars: 4, text: 'Reached Gold tier in 6 weeks just from my morning flat white. The free drink reward came through instantly on the app. Best loyalty scheme I\'ve seen from any café, period.', author: 'David W.', meta: 'Gold Member · Canary Wharf', initial: 'D', bg: 'linear-gradient(135deg,#3b82f6,#2563eb)', featured: false },
]
const reviewIdx    = ref(0)
const reviewPct    = ref(0)
let reviewInterval: ReturnType<typeof setInterval>

function startReviewCycle() {
  clearInterval(reviewInterval)
  reviewPct.value = 0
  reviewInterval = setInterval(() => {
    reviewPct.value += 100 / 50 // 5s / 100ms steps
    if (reviewPct.value >= 100) {
      reviewPct.value = 0
      reviewIdx.value = (reviewIdx.value + 1) % REVIEWS.length
    }
  }, 100)
}
function goReview(i: number) { reviewIdx.value = i; reviewPct.value = 0; startReviewCycle() }

// ── CONTACT FORM ──────────────────────────────────────────────────────────────
const contactForm = ref({ name: '', email: '', subject: 'General Enquiry', message: '' })
const contactSent = ref(false)
const contactSending = ref(false)
function submitContact() {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) return
  contactSending.value = true
  setTimeout(() => { contactSending.value = false; contactSent.value = true }, 1200)
}
const isOpenNow = computed(() => {
  const h = now.value.getHours()
  const day = now.value.getDay()
  if (day === 0 || day === 6) return h >= 8 && h < 23
  return h >= 7 && h < 22
})

const clockRec = computed(() => {
  const h = now.value.getHours()
  if (h >= 5  && h < 9)  return { label: 'Morning Ritual',    bean: 'Ethiopian Yirgacheffe', brew: 'Pour Over',    why: 'Light, floral, and bright — the perfect morning awakening.' }
  if (h >= 9  && h < 12) return { label: 'Peak Focus',        bean: 'Kenya AA',              brew: 'Aeropress',    why: 'Sharp, juicy, and complex — built for deep work.' }
  if (h >= 12 && h < 15) return { label: 'Afternoon Lift',    bean: 'Colombian Supremo',     brew: 'Espresso',     why: 'Smooth caramel energy to carry you past noon.' }
  if (h >= 15 && h < 18) return { label: 'Golden Hour',       bean: 'Panama Geisha',         brew: 'Pour Over',    why: 'The world\'s finest cup deserves the golden hour.' }
  if (h >= 18 && h < 21) return { label: 'Evening Wind-Down', bean: 'Rwanda Bourbon',        brew: 'Cold Brew',    why: 'Silky and berry-bright — savour the end of your day.' }
  return                         { label: 'Night Cap',         bean: 'Peru Organic (Decaf)',  brew: 'French Press', why: 'All the ritual, none of the 3am stare.' }
})

const clockTime = computed(() => now.value.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))

// ── MORNING MOOD SELECTOR ────────────────────────────────────────────────────
const selectedMood = ref<string | null>(null)
const moods = [
  { key: 'tired',    emoji: '😴', label: 'Tired',    rec: 'Vietnam Robusta',        brew: 'Iced Black',  why: 'Double the caffeine of Arabica. You need this.' },
  { key: 'focused',  emoji: '🧠', label: 'Focused',  rec: 'Kenya AA',               brew: 'Aeropress',   why: 'Bright and sharp — precision coffee for precision thinking.' },
  { key: 'social',   emoji: '💬', label: 'Social',   rec: 'Colombian Supremo',      brew: 'Flat White',  why: 'Smooth, crowd-pleasing, and impossible to argue with.' },
  { key: 'creative', emoji: '✨', label: 'Creative',  rec: 'Panama Geisha',          brew: 'Pour Over',   why: 'The most complex cup in the world. Let it inspire you.' },
]
const moodRec = computed(() => moods.find(m => m.key === selectedMood.value) ?? null)

// ── WEATHER REPORT (mock — replace with real API) ────────────────────────────
const weather = ref({ temp: 41, condition: 'Sunny', icon: '☀️', city: 'Dubai' })
const weatherRec = computed(() => {
  const t = weather.value.temp
  if (t >= 38) return { rec: 'Cold Brew',          bean: 'Rwanda Bourbon',    why: `${t}°C outside. The only acceptable answer is cold brew.` }
  if (t >= 28) return { rec: 'Iced Latte',          bean: 'Colombian Supremo', why: `${t}°C and climbing. Make it cold.` }
  if (t >= 18) return { rec: 'Pour Over',           bean: 'Ethiopian Yirgacheffe', why: `${t}°C — pleasant enough for a slow, careful pour.` }
  return              { rec: 'Dark Roast Espresso', bean: 'Sumatra Mandheling', why: `${t}°C and cold. You need something bold and warming.` }
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
          <div class="hstat"><span class="hstat-val">28</span><span class="hstat-label">Menu Items</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-val">10k+</span><span class="hstat-label">Happy Customers</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-val">12</span><span class="hstat-label">Bean Origins</span></div>
          <div class="hstat-div"></div>
          <div class="hstat"><span class="hstat-val">4.9★</span><span class="hstat-label">Rating</span></div>
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

    <!-- ── TESTIMONIALS CAROUSEL ───────────────────────────── -->
    <section class="testimonials-section reveal">
      <div class="section-inner">
        <div class="section-head center">
          <p class="section-eyebrow">What Our Customers Say</p>
          <h2 class="section-title">Loved by Coffee Lovers</h2>
          <p class="section-sub">Real reviews from real customers — no editing, no embellishment.</p>
        </div>

        <!-- Big featured carousel card -->
        <div class="carousel-wrap">
          <button class="carousel-arrow carousel-prev" @click="goReview((reviewIdx - 1 + REVIEWS.length) % REVIEWS.length)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div class="carousel-stage">
            <Transition name="review-slide" mode="out-in">
              <div :key="reviewIdx" class="carousel-card" :class="{ featured: REVIEWS[reviewIdx].featured }">
                <div v-if="REVIEWS[reviewIdx].featured" class="carousel-badge">⭐ Editor's Pick</div>
                <div class="carousel-stars">
                  <span v-for="s in 5" :key="s" :class="s <= REVIEWS[reviewIdx].stars ? 'star-on' : 'star-off'">★</span>
                </div>
                <p class="carousel-text">"{{ REVIEWS[reviewIdx].text }}"</p>
                <div class="carousel-reviewer">
                  <div class="carousel-avatar" :style="{ background: REVIEWS[reviewIdx].bg }">
                    {{ REVIEWS[reviewIdx].initial }}
                  </div>
                  <div>
                    <div class="carousel-name">{{ REVIEWS[reviewIdx].author }}</div>
                    <div class="carousel-meta">{{ REVIEWS[reviewIdx].meta }}</div>
                  </div>
                </div>
                <!-- Progress bar -->
                <div class="carousel-progress-wrap">
                  <div class="carousel-progress-bar" :style="{ width: reviewPct + '%' }"></div>
                </div>
              </div>
            </Transition>
          </div>

          <button class="carousel-arrow carousel-next" @click="goReview((reviewIdx + 1) % REVIEWS.length)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <!-- Dot navigation -->
        <div class="carousel-dots">
          <button v-for="(_, i) in REVIEWS" :key="i"
                  class="carousel-dot"
                  :class="{ active: i === reviewIdx }"
                  @click="goReview(i)">
          </button>
        </div>

        <!-- Review summary strip -->
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

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- ABOUT — World-class redesign                                         -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section id="about">

      <!-- 1 ── Manifesto banner ──────────────────────────────────────── -->
      <div class="about-manifesto">
        <div class="am-inner">
          <div class="am-quote">"</div>
          <h2 class="am-text">We don't sell coffee.<br/>We sell the best moment of your day.</h2>
          <div class="am-author">— Omar, Head Roaster &amp; Co-founder</div>
        </div>
      </div>

      <!-- 2 ── Stats strip ───────────────────────────────────────────── -->
      <div class="about-stats-strip">
        <div class="as-inner">
          <div class="as-item"><span class="as-num">2019</span><span class="as-label">Founded in Dubai</span></div>
          <div class="as-div"></div>
          <div class="as-item"><span class="as-num">50K+</span><span class="as-label">Happy Customers</span></div>
          <div class="as-div"></div>
          <div class="as-item"><span class="as-num">18</span><span class="as-label">Countries Sourced</span></div>
          <div class="as-div"></div>
          <div class="as-item"><span class="as-num">4.9★</span><span class="as-label">Average Rating</span></div>
          <div class="as-div"></div>
          <div class="as-item"><span class="as-num">100%</span><span class="as-label">Direct Trade</span></div>
        </div>
      </div>

      <!-- 3 ── Story + visual ────────────────────────────────────────── -->
      <div class="about-story-wrap">
        <div class="as-story-inner">
          <div class="as-story-text reveal">
            <p class="section-eyebrow">Our Story</p>
            <h2 class="section-title">Born in a garage.<br/>Raised on great taste.</h2>
            <p class="about-body">It started with two friends, one broken espresso machine, and an obsession with finding out why the coffee in Dubai didn't taste like what they'd had in Addis Ababa and Bogotá.</p>
            <p class="about-body">Seven years later, 4ever Coffee sources directly from 18 origins across 5 continents, roasts in-house every morning, and delivers to your door within hours. The obsession never changed — only the scale.</p>
            <div class="as-story-badges">
              <div class="as-badge">🏆 Best Specialty Roastery — UAE 2024</div>
              <div class="as-badge">🌱 100% Carbon Neutral since 2022</div>
              <div class="as-badge">☕ World Barista Finalist, 2023</div>
            </div>
          </div>
          <div class="as-story-visual reveal">
            <div class="as-visual-card main-card">
              <div class="as-visual-orb orb1"></div>
              <div class="as-visual-orb orb2"></div>
              <div class="as-visual-icon">☕</div>
              <div class="as-visual-label">Roasted fresh daily</div>
              <div class="as-visual-sub">Single-origins · Direct trade</div>
            </div>
            <div class="as-visual-side">
              <div class="as-visual-card side-card sc1">
                <div class="sc-icon">🌍</div>
                <div class="sc-text">18 origins<br/>sourced directly</div>
              </div>
              <div class="as-visual-card side-card sc2">
                <div class="sc-icon">🔬</div>
                <div class="sc-text">Every lot<br/>cupped & scored</div>
              </div>
              <div class="as-visual-card side-card sc3">
                <div class="sc-icon">📦</div>
                <div class="sc-text">Ships within<br/>4 hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 ── Timeline ──────────────────────────────────────────────── -->
      <div class="about-timeline">
        <div class="at-inner">
          <p class="section-eyebrow" style="text-align:center;color:#d4a060">Our Journey</p>
          <h2 class="section-title at-title reveal">Seven years of relentless pursuit.</h2>
          <div class="timeline-track">
            <div class="timeline-line"></div>
            <div class="tl-item reveal">
              <div class="tl-dot"></div>
              <div class="tl-year">2019</div>
              <div class="tl-card">
                <div class="tl-title">The First Roast</div>
                <div class="tl-body">Omar and Sara hand-roast their first 2kg batch of Ethiopian Yirgacheffe in a rented garage. The neighbourhood notices the smell. No complaints.</div>
              </div>
            </div>
            <div class="tl-item reveal">
              <div class="tl-dot"></div>
              <div class="tl-year">2020</div>
              <div class="tl-card">
                <div class="tl-title">First Café Opens</div>
                <div class="tl-body">Downtown Dubai. 12 seats. No sign outside. Word-of-mouth only. Queue forms by week two. The city had been waiting for this.</div>
              </div>
            </div>
            <div class="tl-item reveal">
              <div class="tl-dot"></div>
              <div class="tl-year">2022</div>
              <div class="tl-card">
                <div class="tl-title">Direct Trade Certified</div>
                <div class="tl-body">We fly to origin. Meet farmers. Pay above Fair Trade price on every single lot. Full supply chain transparency published on our website.</div>
              </div>
            </div>
            <div class="tl-item reveal">
              <div class="tl-dot"></div>
              <div class="tl-year">2024</div>
              <div class="tl-card">
                <div class="tl-title">Award-Winning Roastery</div>
                <div class="tl-body">Named Best Specialty Roastery in the UAE. Our Panama Geisha scored 96 points at the Gulf Cup — the highest-ever score for a regional roaster.</div>
              </div>
            </div>
            <div class="tl-item reveal">
              <div class="tl-dot tl-dot-now"></div>
              <div class="tl-year tl-now">Now</div>
              <div class="tl-card tl-card-now">
                <div class="tl-title">50,000+ Customers & Counting</div>
                <div class="tl-body">Same obsession. Bigger roaster. Better beans. We're just getting started.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5 ── Values ────────────────────────────────────────────────── -->
      <div class="about-values">
        <div class="av-inner">
          <p class="section-eyebrow" style="text-align:center">What We Stand For</p>
          <h2 class="section-title av-title reveal">Not a single compromise.</h2>
          <div class="values-grid">
            <div class="value-card reveal">
              <div class="vc-icon">🌱</div>
              <div class="vc-title">Direct Trade Only</div>
              <div class="vc-body">We pay farmers 30–60% above commodity price. We visit every farm we buy from. No middlemen. No guessing where your coffee came from.</div>
            </div>
            <div class="value-card reveal">
              <div class="vc-icon">🔥</div>
              <div class="vc-title">Roasted to Order</div>
              <div class="vc-body">Every bag is roasted within 48 hours of your order. We never pre-roast and shelf. Freshness isn't a feature — it's the entire point.</div>
            </div>
            <div class="value-card reveal">
              <div class="vc-icon">🧪</div>
              <div class="vc-title">Scored Before It Ships</div>
              <div class="vc-body">Every lot we buy is cupped, scored, and approved by our roasters. If it doesn't hit 84+, it doesn't leave our facility. Full stop.</div>
            </div>
            <div class="value-card reveal">
              <div class="vc-icon">♻️</div>
              <div class="vc-title">Carbon Neutral</div>
              <div class="vc-body">Compostable packaging, renewable energy in our roastery, and verified carbon offsets for every shipment. We take this seriously.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6 ── Team ──────────────────────────────────────────────────── -->
      <div class="about-team">
        <div class="ateam-inner">
          <p class="section-eyebrow" style="text-align:center;color:#d4a060">The People Behind the Cup</p>
          <h2 class="section-title ateam-title reveal">Meet the Roasters.</h2>
          <div class="team-grid">
            <div class="team-card reveal">
              <div class="tc-avatar">👨‍🍳</div>
              <div class="tc-name">Omar Al-Rashid</div>
              <div class="tc-role">Co-founder · Head Roaster</div>
              <p class="tc-quote">"The moment I tasted my first natural-process Ethiopian, I knew I couldn't go back to anything less. That was 2017. I've been chasing that moment ever since."</p>
              <div class="tc-bean">Favourite: <strong>Panama Geisha, Natural</strong></div>
            </div>
            <div class="team-card reveal">
              <div class="tc-avatar">👩‍🔬</div>
              <div class="tc-name">Sara Al-Mansoori</div>
              <div class="tc-role">Co-founder · Head of Sourcing</div>
              <p class="tc-quote">"I've visited 40+ farms across 14 countries. The farmers who grow the best coffee are some of the most remarkable people I've ever met. We owe them everything."</p>
              <div class="tc-bean">Favourite: <strong>Ethiopia Yirgacheffe, Washed</strong></div>
            </div>
            <div class="team-card reveal">
              <div class="tc-avatar">👨‍🏫</div>
              <div class="tc-name">Khalid Mansoor</div>
              <div class="tc-role">Lead Barista · Coffee Educator</div>
              <p class="tc-quote">"Extraction is 50% science, 50% listening. I've made over 100,000 espressos. Every single one teaches me something new."</p>
              <div class="tc-bean">Favourite: <strong>Yemen Mokha, Turkish brew</strong></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7 ── Press / awards ─────────────────────────────────────────── -->
      <div class="about-press">
        <div class="ap-inner">
          <p class="ap-label">As seen in</p>
          <div class="press-row">
            <div class="press-item">Gulf Business</div>
            <div class="press-div"></div>
            <div class="press-item">Time Out Dubai</div>
            <div class="press-div"></div>
            <div class="press-item">Esquire ME</div>
            <div class="press-div"></div>
            <div class="press-item">The National</div>
            <div class="press-div"></div>
            <div class="press-item">Monocle</div>
          </div>
        </div>
      </div>

    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- NEWSLETTER SIGNUP                                                     -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="nl-section reveal">
      <div class="nl-bg-orb nl-orb-1"></div>
      <div class="nl-bg-orb nl-orb-2"></div>
      <div class="nl-inner">
        <div class="nl-left">
          <div class="nl-eyebrow">Stay in the Loop</div>
          <h2 class="nl-headline">Get the best of 4ever<br><em>delivered to your inbox</em></h2>
          <p class="nl-tagline">Exclusive deals, roastery updates, new arrivals, and discount codes — curated for real coffee lovers. Join 2,400+ subscribers.</p>
          <div class="nl-perks">
            <div v-for="p in NL_TAGS" :key="p.key" class="nl-perk">
              <span class="nl-perk-icon">{{ p.icon }}</span>
              <span>{{ p.label }} emails</span>
            </div>
          </div>
        </div>
        <div class="nl-right">
          <Transition name="fade" mode="out-in">
            <div v-if="nlSent" class="nl-success">
              <div class="nl-success-icon">✓</div>
              <div class="nl-success-title">You're subscribed!</div>
              <p class="nl-success-body">Welcome to the 4ever Coffee community. Check your inbox for a confirmation and your first exclusive deal.</p>
            </div>
            <div v-else class="nl-form-card">
              <div class="nl-form-title">Subscribe — It's Free</div>
              <div class="nl-field">
                <label class="nl-field-label">First Name <span class="nl-opt">(optional)</span></label>
                <input v-model="nlName" class="nl-input" placeholder="e.g. Emma" />
              </div>
              <div class="nl-field">
                <label class="nl-field-label">Email Address <span class="nl-req">*</span></label>
                <input v-model="nlEmail" class="nl-input" placeholder="you@example.com" type="email" />
              </div>
              <div class="nl-tags-section">
                <label class="nl-field-label">I want to receive</label>
                <div class="nl-tag-row">
                  <button v-for="t in NL_TAGS" :key="t.key"
                    class="nl-tag-btn" :class="{ selected: nlTags.includes(t.key) }"
                    @click="toggleNlTag(t.key)">
                    {{ t.icon }} {{ t.label }}
                  </button>
                </div>
              </div>
              <div v-if="nlError" class="nl-err">{{ nlError }}</div>
              <button class="nl-submit-btn" @click="submitNewsletter">
                Subscribe Now →
              </button>
              <p class="nl-privacy">No spam, ever. Unsubscribe in one click at any time.</p>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- CONTACT — World-class redesign                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section id="contact" class="contact-section-new">

      <!-- Top bar -->
      <div class="csn-topbar">
        <div class="csn-topbar-inner">
          <div class="csn-open-indicator" :class="{ open: isOpenNow }">
            <span class="csn-open-dot"></span>
            <span>{{ isOpenNow ? 'Open now' : 'Closed now' }}</span>
          </div>
          <div class="csn-tagline">We reply within 2 hours during opening hours</div>
        </div>
      </div>

      <div class="csn-main">
        <div class="csn-inner">

          <!-- Left: info ─────────────────────────────────────── -->
          <div class="csn-left reveal">
            <p class="section-eyebrow light">Get in Touch</p>
            <h2 class="csn-title">We're here.<br/>Always.</h2>
            <p class="csn-sub">Got a question, a wholesale enquiry, or just want to geek out about coffee? We read every message.</p>

            <!-- Contact channels -->
            <div class="csn-channels">
              <a href="mailto:hello@4evercoffee.ae" class="csn-ch">
                <div class="csn-ch-icon email-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6"/></svg>
                </div>
                <div class="csn-ch-info">
                  <div class="csn-ch-label">Email</div>
                  <div class="csn-ch-val">hello@4evercoffee.ae</div>
                  <div class="csn-ch-note">Replies within 2 hrs</div>
                </div>
              </a>
              <a href="tel:+97150888888" class="csn-ch">
                <div class="csn-ch-icon phone-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.89 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.8 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.05 6.05l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="csn-ch-info">
                  <div class="csn-ch-label">Phone</div>
                  <div class="csn-ch-val">+971 50 888 8888</div>
                  <div class="csn-ch-note">Daily 7 AM – 10 PM GST</div>
                </div>
              </a>
              <a href="https://wa.me/97150888888" class="csn-ch csn-ch-wa">
                <div class="csn-ch-icon wa-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </div>
                <div class="csn-ch-info">
                  <div class="csn-ch-label">WhatsApp</div>
                  <div class="csn-ch-val">+971 50 888 8888</div>
                  <div class="csn-ch-note">Quick replies, 7 days</div>
                </div>
              </a>
            </div>

            <!-- Location card -->
            <div class="csn-location">
              <div class="csn-loc-map">
                <div class="csn-loc-grid"></div>
                <div class="csn-loc-pin">📍</div>
                <div class="csn-loc-rings">
                  <div class="csn-loc-ring r1"></div>
                  <div class="csn-loc-ring r2"></div>
                </div>
              </div>
              <div class="csn-loc-info">
                <div class="csn-loc-name">4ever Coffee Roastery</div>
                <div class="csn-loc-addr">Unit 4B, Al Quoz Industrial Area 3<br/>Dubai, United Arab Emirates</div>
                <a href="https://maps.google.com" class="csn-loc-link" target="_blank" rel="noopener">Open in Maps →</a>
              </div>
            </div>

            <!-- Hours -->
            <div class="csn-hours">
              <div class="csn-hours-title">Opening Hours</div>
              <div class="csn-hour-row" :class="{ today: [1,2,3,4,5].includes(now.getDay()) }">
                <span>Monday – Friday</span><span>7:00 AM – 10:00 PM</span>
              </div>
              <div class="csn-hour-row" :class="{ today: [0,6].includes(now.getDay()) }">
                <span>Saturday – Sunday</span><span>8:00 AM – 11:00 PM</span>
              </div>
              <div class="csn-hours-tz">Gulf Standard Time (GST, UTC+4)</div>
            </div>

            <!-- Social -->
            <div class="csn-social">
              <a href="#" class="csn-soc-btn" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" class="csn-soc-btn" title="X / Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.923zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="csn-soc-btn" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.72a4.85 4.85 0 0 1-1.01-.03z"/></svg>
              </a>
              <a href="#" class="csn-soc-btn" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <!-- Right: form ─────────────────────────────────────── -->
          <div class="csn-right reveal">
            <div class="csn-form-card">
              <template v-if="!contactSent">
                <div class="csn-form-header">
                  <h3 class="csn-form-title">Send us a message</h3>
                  <p class="csn-form-sub">We read every message and reply personally — no bots.</p>
                </div>
                <form class="csn-form" @submit.prevent="submitContact">
                  <div class="csn-form-row">
                    <div class="csn-form-group">
                      <label class="csn-label">Your Name</label>
                      <input v-model="contactForm.name" class="csn-input" placeholder="Ahmad Al-Farsi" required />
                    </div>
                    <div class="csn-form-group">
                      <label class="csn-label">Email Address</label>
                      <input v-model="contactForm.email" type="email" class="csn-input" placeholder="ahmad@example.com" required />
                    </div>
                  </div>
                  <div class="csn-form-group">
                    <label class="csn-label">Subject</label>
                    <select v-model="contactForm.subject" class="csn-input csn-select">
                      <option>General Enquiry</option>
                      <option>Order Issue</option>
                      <option>Wholesale / B2B</option>
                      <option>Catering Enquiry</option>
                      <option>Subscription</option>
                      <option>Press & Media</option>
                      <option>Just Want to Chat About Coffee</option>
                    </select>
                  </div>
                  <div class="csn-form-group">
                    <label class="csn-label">Message</label>
                    <textarea v-model="contactForm.message" class="csn-textarea" rows="5"
                              placeholder="Tell us what's on your mind…" required></textarea>
                  </div>
                  <button type="submit" class="csn-submit" :class="{ loading: contactSending }">
                    <span v-if="contactSending">Sending…</span>
                    <span v-else>Send Message →</span>
                  </button>
                </form>
              </template>
              <div v-else class="csn-success">
                <div class="csn-success-icon">✓</div>
                <h3 class="csn-success-title">Message Received</h3>
                <p class="csn-success-sub">Thanks, {{ contactForm.name.split(' ')[0] }}. We'll reply to <strong>{{ contactForm.email }}</strong> within 2 hours.</p>
                <button class="csn-again-btn" @click="contactSent = false; contactForm.message = ''">Send another message</button>
              </div>
            </div>

            <!-- Wholesale CTA -->
            <div class="csn-wholesale">
              <div class="csn-ws-text">
                <div class="csn-ws-title">Wholesale & B2B Enquiries</div>
                <div class="csn-ws-sub">Supplying hotels, restaurants, and offices across the UAE and GCC.</div>
              </div>
              <a href="mailto:wholesale@4evercoffee.ae" class="csn-ws-btn">Email Wholesale Team</a>
            </div>
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

    <!-- ── COFFEE CLOCK ─────────────────────────────────────────────── -->
    <section class="clock-section reveal">
      <div class="section-inner">
        <div class="clock-header">
          <div>
            <p class="section-eyebrow">Right Now</p>
            <h2 class="section-title" style="color:#fdf6ec">Coffee Clock</h2>
          </div>
          <div class="clock-time">{{ clockTime }}</div>
        </div>
        <div class="clock-card">
          <div class="clock-label">{{ clockRec.label }}</div>
          <div class="clock-bean">{{ clockRec.bean }}</div>
          <div class="clock-brew">Best brewed as: <strong>{{ clockRec.brew }}</strong></div>
          <p class="clock-why">{{ clockRec.why }}</p>
          <RouterLink to="/shop/menu" class="clock-cta">Order Now →</RouterLink>
        </div>
      </div>
    </section>

    <!-- ── WEATHER REPORT ───────────────────────────────────────────── -->
    <section class="weather-section reveal">
      <div class="section-inner">
        <div class="weather-card">
          <div class="weather-left">
            <div class="weather-icon">{{ weather.icon }}</div>
            <div>
              <div class="weather-city">{{ weather.city }}</div>
              <div class="weather-temp">{{ weather.temp }}°C · {{ weather.condition }}</div>
            </div>
          </div>
          <div class="weather-divider"></div>
          <div class="weather-right">
            <div class="weather-rec-label">Today's Coffee Forecast</div>
            <div class="weather-rec">{{ weatherRec.rec }}</div>
            <div class="weather-bean">{{ weatherRec.bean }}</div>
            <p class="weather-why">{{ weatherRec.why }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── MORNING MOOD SELECTOR ────────────────────────────────────── -->
    <section class="mood-section reveal">
      <div class="section-inner">
        <p class="section-eyebrow" style="text-align:center">Personalised Pick</p>
        <h2 class="section-title" style="text-align:center">How are you feeling today?</h2>
        <div class="mood-grid">
          <button
            v-for="m in moods" :key="m.key"
            class="mood-btn" :class="{ active: selectedMood === m.key }"
            @click="selectedMood = selectedMood === m.key ? null : m.key"
          >
            <span class="mood-emoji">{{ m.emoji }}</span>
            <span class="mood-label">{{ m.label }}</span>
          </button>
        </div>
        <Transition name="fade">
          <div v-if="moodRec" class="mood-result">
            <div class="mood-rec-bean">{{ moodRec.rec }}</div>
            <div class="mood-rec-brew">Brew method: <strong>{{ moodRec.brew }}</strong></div>
            <p class="mood-rec-why">{{ moodRec.why }}</p>
            <RouterLink to="/shop/menu" class="mood-cta">Shop This →</RouterLink>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── ROASTER'S DIARY ───────────────────────────────────────────── -->
    <section class="diary-section reveal">
      <div class="section-inner">
        <p class="section-eyebrow">From the Roastery Floor</p>
        <h2 class="section-title">The Roaster's Diary</h2>
        <div class="diary-grid">
          <div v-for="e in roasteryStore.diaryEntries" :key="e.date" class="diary-card">
            <div class="diary-meta">{{ e.date }} · {{ e.author }}</div>
            <div class="diary-title">{{ e.title }}</div>
            <p class="diary-body">{{ e.body }}</p>
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
/* ── Hero animations ── */
@keyframes heroFadeUp  { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes heroFadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes orbDrift    { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.06); } 66% { transform: translate(-20px,15px) scale(0.96); } }
@keyframes cupFloat    { 0%,100% { transform: translateY(var(--ty,0px)); } 50% { transform: translateY(calc(var(--ty,0px) - 12px)); } }
@keyframes heroReveal  { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }

.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.18; }
.orb-1 { width: 500px; height: 500px; background: #c8813a; top: -100px; left: -100px; animation: orbDrift 14s ease-in-out infinite; }
.orb-2 { width: 350px; height: 350px; background: #d4a060; bottom: -80px; right: 200px; animation: orbDrift 18s ease-in-out infinite reverse; }
.orb-3 { width: 280px; height: 280px; background: #8B4513; top: 50%; left: 45%; animation: orbDrift 22s ease-in-out infinite; }

.hero-content { position: relative; z-index: 2; max-width: 560px; }
.hero-logo-wrap { margin-bottom: 24px; animation: heroFadeIn 0.8s ease both; }
.hero-eyebrow  { font-size: 13px; font-weight: 600; color: #d4a060; letter-spacing: 0.12em; margin: 0 0 16px; text-transform: uppercase; animation: heroFadeUp 0.7s 0.15s ease both; }
.hero-heading  { margin: 0 0 22px; line-height: 1; animation: heroFadeUp 0.7s 0.28s ease both; }
.line-1 { display: block; font-size: clamp(64px, 10vw, 112px); font-weight: 900; color: #fdf6ec; letter-spacing: -4px; }
.line-1 em { font-style: normal; color: #d4a060; }
.line-2 { display: block; font-size: clamp(36px, 6vw, 64px); font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: -2px; }
.hero-tagline  { font-size: 17px; color: #a8a29e; line-height: 1.65; margin: 0 0 34px; animation: heroFadeUp 0.7s 0.42s ease both; }
.hero-actions  { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; animation: heroFadeUp 0.7s 0.56s ease both; }
.hero-stats    { display: flex; align-items: center; gap: 20px; animation: heroFadeUp 0.7s 0.70s ease both; }
.btn-primary { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border-radius: 12px; padding: 14px 30px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 8px 28px rgba(200,129,58,0.45); transition: all 0.2s; display: inline-block; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(200,129,58,0.6); }
.btn-ghost { border: 1.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); border-radius: 12px; padding: 14px 28px; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s; display: inline-block; background: rgba(255,255,255,0.05); }
.btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.1); }
.hstat { display: flex; flex-direction: column; gap: 2px; }
.hstat-val { font-size: 22px; font-weight: 800; color: #fdf6ec; }
.hstat-label { font-size: 11px; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.hstat-div { width: 1px; height: 36px; background: rgba(255,255,255,0.12); }

.hero-cups { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); display: flex; gap: 20px; align-items: flex-end; z-index: 1; pointer-events: none; animation: heroFadeIn 1s 0.5s ease both; }
@media (max-width: 960px) { .hero-cups { display: none; } }
.float-cup { border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.5); position: relative; }
.float-cup-bg { position: absolute; inset: 0; }
.float-cup-photo { width: 100%; height: 120px; object-fit: cover; position: relative; z-index: 1; }
.cup-label { position: relative; z-index: 2; padding: 10px 14px; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); width: 100%; text-align: center; }
.cup-0 { width: 130px; --ty: 0px;   animation: cupFloat 5s ease-in-out infinite; }
.cup-1 { width: 120px; --ty: -30px; animation: cupFloat 6.5s ease-in-out infinite 0.8s; }
.cup-2 { width: 110px; --ty: 20px;  animation: cupFloat 4.5s ease-in-out infinite 1.6s; }
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

/* ══════════════════════════════════════════════════
   ABOUT — World-class redesign
   ══════════════════════════════════════════════════ */

/* 1 · Manifesto */
.about-manifesto { background: linear-gradient(160deg, #0d0603 0%, #1c1008 50%, #2d1a0a 100%); padding: 100px 24px; text-align: center; position: relative; overflow: hidden; }
.about-manifesto::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 120%, rgba(212,160,96,0.12), transparent 70%); pointer-events: none; }
.am-inner { max-width: 860px; margin: 0 auto; position: relative; }
.am-quote { font-size: 120px; line-height: 0.6; color: rgba(212,160,96,0.15); font-family: 'Playfair Display', serif; font-weight: 900; margin-bottom: 16px; display: block; }
.am-text { font-size: clamp(28px, 5vw, 52px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; line-height: 1.2; margin: 0 0 28px; letter-spacing: -1px; }
.am-author { font-size: 14px; color: #78716c; font-style: italic; letter-spacing: 0.04em; }

/* 2 · Stats strip */
.about-stats-strip { background: #fdf6ec; border-top: 1px solid #f0ebe4; border-bottom: 1px solid #f0ebe4; padding: 0; }
.as-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; align-items: stretch; overflow-x: auto; }
.as-item { display: flex; flex-direction: column; align-items: center; padding: 32px 40px; flex-shrink: 0; gap: 4px; }
.as-num { font-size: clamp(28px, 4vw, 40px); font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; line-height: 1; }
.as-label { font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.1em; }
.as-div { width: 1px; background: #f0ebe4; flex-shrink: 0; margin: 16px 0; }

/* 3 · Story */
.about-story-wrap { background: #fff; padding: 96px 24px; }
.as-story-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
@media (max-width: 900px) { .as-story-inner { grid-template-columns: 1fr; gap: 48px; } }
.about-body { font-size: 16px; color: #57534e; line-height: 1.8; margin: 0 0 18px; }
.as-story-badges { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }
.as-badge { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: #57534e; background: #faf7f2; border: 1px solid #f0ebe4; border-radius: 10px; padding: 10px 16px; }
.as-story-visual { display: flex; gap: 14px; }
.as-visual-card { border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; }
.main-card { background: linear-gradient(145deg, #1c1008, #2d1a0a); flex: 1; min-height: 260px; position: relative; overflow: hidden; gap: 10px; box-shadow: 0 20px 60px rgba(28,16,8,0.3); }
.as-visual-orb { position: absolute; border-radius: 50%; pointer-events: none; }
.orb1 { width: 200px; height: 200px; background: radial-gradient(circle, rgba(212,160,96,0.18), transparent); top: -60px; right: -60px; }
.orb2 { width: 140px; height: 140px; background: radial-gradient(circle, rgba(200,129,58,0.12), transparent); bottom: -40px; left: -40px; }
.as-visual-icon { font-size: 52px; position: relative; z-index: 1; }
.as-visual-label { font-size: 15px; font-weight: 800; color: #fdf6ec; position: relative; z-index: 1; }
.as-visual-sub { font-size: 12px; color: #78716c; position: relative; z-index: 1; }
.as-visual-side { display: flex; flex-direction: column; gap: 10px; }
.side-card { background: #faf7f2; border: 1px solid #f0ebe4; gap: 8px; min-width: 130px; }
.sc1 { background: #fff9f0; border-color: rgba(200,129,58,0.2); }
.sc2 { background: #f0fdf4; border-color: rgba(22,163,74,0.15); }
.sc3 { background: #eff6ff; border-color: rgba(59,130,246,0.15); }
.sc-icon { font-size: 24px; }
.sc-text { font-size: 12px; font-weight: 700; color: #1c1917; line-height: 1.5; }

/* 4 · Timeline */
.about-timeline { background: #0d0603; padding: 96px 24px; }
.at-inner { max-width: 960px; margin: 0 auto; }
.at-title { color: #fdf6ec; text-align: center; margin-bottom: 56px; }
.timeline-track { position: relative; padding-left: 32px; }
.timeline-line { position: absolute; left: 10px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, #d4a060, rgba(212,160,96,0.1)); }
.tl-item { position: relative; margin-bottom: 44px; }
.tl-item:last-child { margin-bottom: 0; }
.tl-dot { position: absolute; left: -28px; top: 6px; width: 14px; height: 14px; border-radius: 50%; background: #1c1008; border: 2px solid #d4a060; }
.tl-dot-now { background: #d4a060; box-shadow: 0 0 0 4px rgba(212,160,96,0.25); }
.tl-year { font-size: 11px; font-weight: 800; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
.tl-now { color: #4ade80; }
.tl-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 22px; }
.tl-card-now { border-color: rgba(74,222,128,0.2); background: rgba(74,222,128,0.04); }
.tl-title { font-size: 16px; font-weight: 800; color: #fdf6ec; margin-bottom: 8px; font-family: 'Playfair Display', serif; }
.tl-body { font-size: 14px; color: #78716c; line-height: 1.7; margin: 0; }

/* 5 · Values */
.about-values { background: #faf7f2; padding: 96px 24px; }
.av-inner { max-width: 1100px; margin: 0 auto; }
.av-title { text-align: center; margin-bottom: 48px; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
.value-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 32px 26px; transition: all 0.25s; }
.value-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(28,16,8,0.1); border-color: rgba(200,129,58,0.2); }
.vc-icon { font-size: 36px; margin-bottom: 16px; }
.vc-title { font-size: 16px; font-weight: 800; color: #1c1917; margin-bottom: 10px; font-family: 'Playfair Display', serif; }
.vc-body { font-size: 14px; color: #78716c; line-height: 1.75; margin: 0; }

/* 6 · Team */
.about-team { background: #1c1008; padding: 96px 24px; }
.ateam-inner { max-width: 1100px; margin: 0 auto; }
.ateam-title { color: #fdf6ec; text-align: center; margin-bottom: 48px; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.team-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px 26px; transition: all 0.25s; }
.team-card:hover { border-color: rgba(212,160,96,0.35); background: rgba(255,255,255,0.07); transform: translateY(-4px); }
.tc-avatar { font-size: 48px; margin-bottom: 16px; }
.tc-name { font-size: 18px; font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
.tc-role { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
.tc-quote { font-size: 14px; color: #78716c; line-height: 1.75; font-style: italic; font-family: 'Playfair Display', serif; margin: 0 0 16px; }
.tc-bean { font-size: 12px; color: #57534e; }
.tc-bean strong { color: #d4a060; }

/* 7 · Press */
.about-press { background: #fff; border-top: 1px solid #f0ebe4; border-bottom: 1px solid #f0ebe4; padding: 32px 24px; }
.ap-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: center; }
.ap-label { font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.12em; flex-shrink: 0; }
.press-row { display: flex; align-items: center; gap: 0; flex-wrap: wrap; justify-content: center; }
.press-item { font-size: 15px; font-weight: 800; color: #d1ccc7; letter-spacing: 0.04em; padding: 4px 24px; font-family: 'Playfair Display', serif; transition: color 0.2s; }
.press-item:hover { color: #1c1917; }
.press-div { width: 1px; height: 18px; background: #f0ebe4; }

/* ══════════════════════════════════════════════════
   CONTACT — World-class redesign
   ══════════════════════════════════════════════════ */
.contact-section-new { background: linear-gradient(180deg, #0d0603 0%, #1a0804 100%); }

/* Top bar */
.csn-topbar { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 12px 24px; }
.csn-topbar-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.csn-open-indicator { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #78716c; }
.csn-open-indicator.open { color: #4ade80; }
.csn-open-dot { width: 8px; height: 8px; border-radius: 50%; background: #57534e; }
.csn-open-indicator.open .csn-open-dot { background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.25); animation: blink 2s infinite; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.csn-tagline { font-size: 12px; color: #44403c; }

/* Main grid */
.csn-main { padding: 80px 24px; }
.csn-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.1fr; gap: 60px; align-items: start; }
@media (max-width: 900px) { .csn-inner { grid-template-columns: 1fr; gap: 48px; } }

/* Left */
.csn-title { font-size: clamp(32px, 5vw, 52px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 8px 0 14px; line-height: 1.15; letter-spacing: -1px; }
.csn-sub { font-size: 15px; color: #78716c; line-height: 1.7; margin: 0 0 32px; }

.csn-channels { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.csn-ch { display: flex; align-items: flex-start; gap: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 16px 18px; text-decoration: none; transition: all 0.2s; }
.csn-ch:hover { border-color: rgba(212,160,96,0.4); background: rgba(212,160,96,0.06); transform: translateX(4px); }
.csn-ch-wa:hover { border-color: rgba(37,211,102,0.4); }
.csn-ch-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.email-icon { background: rgba(212,160,96,0.15); color: #d4a060; }
.phone-icon { background: rgba(96,165,250,0.12); color: #60a5fa; }
.wa-icon    { background: rgba(37,211,102,0.12); color: #25d366; }
.csn-ch-icon svg { width: 18px; height: 18px; }
.csn-ch-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #57534e; margin-bottom: 3px; }
.csn-ch-val   { font-size: 14px; font-weight: 700; color: #fdf6ec; margin-bottom: 2px; }
.csn-ch-note  { font-size: 12px; color: #44403c; }

/* Location card */
.csn-location { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; display: flex; gap: 16px; align-items: center; margin-bottom: 24px; }
.csn-loc-map { width: 72px; height: 72px; border-radius: 12px; background: rgba(212,160,96,0.08); border: 1px solid rgba(212,160,96,0.15); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0; }
.csn-loc-grid { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, rgba(212,160,96,0.08) 0px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, rgba(212,160,96,0.08) 0px, transparent 1px, transparent 12px); }
.csn-loc-pin { font-size: 24px; position: relative; z-index: 2; }
.csn-loc-rings { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); }
.csn-loc-ring { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); border-radius: 50%; border: 1px solid rgba(212,160,96,0.3); animation: expand 2s infinite; }
.r1 { width: 20px; height: 20px; animation-delay: 0s; }
.r2 { width: 34px; height: 34px; animation-delay: 0.5s; }
@keyframes expand { 0% { opacity: 1; transform: translateX(-50%) scale(0.4); } 100% { opacity: 0; transform: translateX(-50%) scale(1); } }
.csn-loc-name { font-size: 14px; font-weight: 800; color: #fdf6ec; margin-bottom: 4px; }
.csn-loc-addr { font-size: 12px; color: #78716c; line-height: 1.6; margin-bottom: 8px; }
.csn-loc-link { font-size: 12px; font-weight: 700; color: #d4a060; text-decoration: none; }

/* Hours */
.csn-hours { margin-bottom: 24px; }
.csn-hours-title { font-size: 10px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; }
.csn-hour-row { display: flex; justify-content: space-between; font-size: 13px; color: #57534e; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.csn-hour-row.today { color: #fdf6ec; font-weight: 600; }
.csn-hours-tz { font-size: 11px; color: #44403c; margin-top: 8px; }

/* Social */
.csn-social { display: flex; gap: 10px; }
.csn-soc-btn { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: #57534e; text-decoration: none; transition: all 0.2s; }
.csn-soc-btn:hover { background: #d4a060; border-color: #d4a060; color: #fff; transform: translateY(-2px); }
.csn-soc-btn svg { width: 16px; height: 16px; }

/* Right: form card */
.csn-form-card { background: #fff; border-radius: 24px; padding: 36px 32px; margin-bottom: 16px; }
.csn-form-header { margin-bottom: 24px; }
.csn-form-title { font-size: 22px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 6px; }
.csn-form-sub { font-size: 13px; color: #a8a29e; margin: 0; }
.csn-form { display: flex; flex-direction: column; gap: 14px; }
.csn-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 520px) { .csn-form-row { grid-template-columns: 1fr; } }
.csn-form-group { display: flex; flex-direction: column; gap: 6px; }
.csn-label { font-size: 11px; font-weight: 700; color: #57534e; text-transform: uppercase; letter-spacing: 0.08em; }
.csn-input { padding: 12px 16px; border: 1.5px solid #e7e5e4; border-radius: 10px; font-size: 14px; font-family: inherit; background: #faf7f2; color: #1c1917; transition: border-color 0.15s; }
.csn-input:focus { outline: none; border-color: #c8813a; }
.csn-select { cursor: pointer; }
.csn-textarea { padding: 12px 16px; border: 1.5px solid #e7e5e4; border-radius: 10px; font-size: 14px; font-family: inherit; background: #faf7f2; color: #1c1917; resize: none; transition: border-color 0.15s; }
.csn-textarea:focus { outline: none; border-color: #c8813a; }
.csn-submit { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; padding: 15px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 4px 16px rgba(200,129,58,0.35); }
.csn-submit:hover:not(.loading) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,129,58,0.5); }
.csn-submit.loading { opacity: 0.7; cursor: wait; }

/* Success state */
.csn-success { text-align: center; padding: 20px 0; }
.csn-success-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #16a34a, #22c55e); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #fff; margin: 0 auto 20px; }
.csn-success-title { font-size: 24px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin-bottom: 10px; }
.csn-success-sub { font-size: 14px; color: #57534e; line-height: 1.7; margin-bottom: 20px; }
.csn-again-btn { background: none; border: 1.5px solid #e7e5e4; color: #57534e; border-radius: 10px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
.csn-again-btn:hover { border-color: #c8813a; color: #c8813a; }

/* Wholesale CTA */
.csn-wholesale { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.csn-ws-title { font-size: 14px; font-weight: 800; color: #fdf6ec; margin-bottom: 4px; }
.csn-ws-sub { font-size: 12px; color: #57534e; }
.csn-ws-btn { background: none; border: 1.5px solid rgba(212,160,96,0.4); color: #d4a060; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; white-space: nowrap; transition: all 0.2s; display: inline-block; }
.csn-ws-btn:hover { background: rgba(212,160,96,0.1); border-color: #d4a060; }

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

/* ── NEWSLETTER ─────────────────────────────────── */
.nl-section {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #1a0804 0%, #2c1008 50%, #1a0804 100%);
  padding: 88px 24px;
}
.nl-bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; pointer-events: none; }
.nl-orb-1 { width: 400px; height: 400px; background: #c8813a; top: -120px; left: -80px; }
.nl-orb-2 { width: 300px; height: 300px; background: #d4a060; bottom: -80px; right: -60px; }
.nl-inner { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; display: flex; gap: 64px; align-items: center; flex-wrap: wrap; }
.nl-left { flex: 1; min-width: 280px; }
.nl-right { flex: 1; min-width: 300px; max-width: 480px; }
.nl-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px; }
.nl-headline { font-family: 'Playfair Display', serif; font-size: clamp(30px, 4vw, 48px); font-weight: 900; color: #fdf6ec; line-height: 1.15; margin: 0 0 18px; letter-spacing: -1px; }
.nl-headline em { font-style: normal; color: #d4a060; }
.nl-tagline { font-size: 15px; color: #a8a29e; line-height: 1.75; margin: 0 0 28px; max-width: 420px; }
.nl-perks { display: flex; flex-direction: column; gap: 10px; }
.nl-perk { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #78716c; }
.nl-perk-icon { font-size: 16px; width: 28px; }

.nl-form-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(212,160,96,0.2); border-radius: 20px; padding: 32px; backdrop-filter: blur(8px); }
.nl-form-title { font-size: 18px; font-weight: 800; color: #fdf6ec; margin-bottom: 20px; letter-spacing: -0.3px; }
.nl-field { margin-bottom: 14px; }
.nl-field-label { display: block; font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
.nl-opt { color: #57534e; font-weight: 400; text-transform: none; letter-spacing: 0; }
.nl-req { color: #d4a060; }
.nl-input { width: 100%; padding: 11px 15px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; background: rgba(255,255,255,0.06); color: #fdf6ec; font-size: 14px; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s; }
.nl-input:focus { outline: none; border-color: #d4a060; }
.nl-input::placeholder { color: #57534e; }
.nl-tags-section { margin-bottom: 18px; }
.nl-tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.nl-tag-btn { padding: 7px 14px; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; background: rgba(255,255,255,0.04); color: #a8a29e; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.18s; }
.nl-tag-btn:hover { border-color: rgba(212,160,96,0.4); color: #d4a060; }
.nl-tag-btn.selected { border-color: #d4a060; background: rgba(212,160,96,0.12); color: #d4a060; }
.nl-err { font-size: 12px; color: #fca5a5; margin-bottom: 12px; }
.nl-submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 6px 24px rgba(200,129,58,0.4); transition: all 0.2s; }
.nl-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(200,129,58,0.55); }
.nl-privacy { font-size: 11px; color: #57534e; text-align: center; margin: 12px 0 0; }

.nl-success { text-align: center; padding: 48px 24px; }
.nl-success-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; font-size: 28px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.nl-success-title { font-size: 22px; font-weight: 800; color: #fdf6ec; margin-bottom: 10px; }
.nl-success-body { font-size: 14px; color: #a8a29e; line-height: 1.7; }

/* ── TESTIMONIALS ───────────────────────────────── */
.testimonials-section { padding: 88px 0; background: #faf7f2; }

/* ── Carousel ── */
.carousel-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
.carousel-arrow {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  background: #fff; border: 1.5px solid #f0ebe4; color: #57534e;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all 0.2s;
}
.carousel-arrow:hover { background: #1c1917; border-color: #1c1917; color: #fff; transform: scale(1.08); }
.carousel-arrow svg { width: 18px; height: 18px; }
.carousel-stage { flex: 1; overflow: hidden; }

.carousel-card {
  background: #fff; border: 1.5px solid #f0ebe4; border-radius: 24px;
  padding: 36px 40px; position: relative; overflow: hidden;
  box-shadow: 0 4px 28px rgba(44,16,8,0.07);
}
.carousel-card.featured { border-color: #d4a060; background: #fffbf5; box-shadow: 0 8px 36px rgba(212,160,96,0.18); }
.carousel-badge { position: absolute; top: 20px; right: 24px; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; }
.carousel-stars { font-size: 20px; letter-spacing: 3px; margin-bottom: 20px; }
.star-on  { color: #d4a060; }
.star-off { color: #e7e5e4; }
.carousel-text {
  font-size: clamp(15px, 2.2vw, 18px); color: #1c1917; line-height: 1.75;
  font-style: italic; font-family: 'Playfair Display', serif;
  margin: 0 0 28px; min-height: 88px;
}
.carousel-reviewer { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.carousel-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0; }
.carousel-name { font-size: 14px; font-weight: 800; color: #1c1917; }
.carousel-meta { font-size: 12px; color: #a8a29e; }
.carousel-progress-wrap { height: 3px; background: #f0ebe4; border-radius: 3px; overflow: hidden; }
.carousel-progress-bar { height: 100%; background: linear-gradient(90deg, #c8813a, #d4a060); border-radius: 3px; transition: width 0.1s linear; }

/* Slide transition */
.review-slide-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.review-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; position: absolute; width: 100%; }
.review-slide-enter-from  { opacity: 0; transform: translateX(40px); }
.review-slide-leave-to    { opacity: 0; transform: translateX(-30px); }

/* Dots */
.carousel-dots { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 40px; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: #e7e5e4; border: none; cursor: pointer; transition: all 0.2s; padding: 0; }
.carousel-dot.active { width: 24px; border-radius: 4px; background: #c8813a; }

/* Summary strip */
.reviews-summary {
  display: flex; align-items: center; justify-content: center; gap: 20px;
  background: #1a0a04; border-radius: 16px; padding: 28px 32px;
  max-width: 400px; margin: 0 auto;
}
.rs-score { font-size: 52px; font-weight: 900; color: #d4a060; line-height: 1; font-family: 'Playfair Display', serif; }
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

/* ── COFFEE CLOCK ── */
.clock-section { background: #0d0603; padding: 72px 24px; }
.clock-header  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.clock-time    { font-size: 48px; font-weight: 900; color: #d4a060; letter-spacing: -2px; font-family: 'Playfair Display', serif; }
.clock-card    { background: rgba(255,255,255,0.04); border: 1px solid rgba(212,160,96,0.2); border-radius: 20px; padding: 32px 36px; }
.clock-label   { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
.clock-bean    { font-size: 28px; font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin-bottom: 8px; letter-spacing: -0.5px; }
.clock-brew    { font-size: 14px; color: #a8a29e; margin-bottom: 12px; }
.clock-brew strong { color: #d4a060; }
.clock-why     { font-size: 15px; color: #78716c; line-height: 1.7; margin: 0 0 24px; }
.clock-cta     { display: inline-block; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border-radius: 12px; padding: 12px 28px; font-weight: 700; text-decoration: none; }

/* ── WEATHER ── */
.weather-section { background: #faf7f2; padding: 0 24px 0; }
.weather-card  { max-width: 960px; margin: 0 auto; display: flex; align-items: center; gap: 32px; background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 28px 36px; box-shadow: 0 4px 20px rgba(44,16,8,0.06); }
@media(max-width:640px) { .weather-card { flex-direction: column; gap: 16px; } }
.weather-left  { display: flex; align-items: center; gap: 16px; }
.weather-icon  { font-size: 48px; }
.weather-city  { font-size: 18px; font-weight: 800; color: #1c1917; }
.weather-temp  { font-size: 13px; color: #78716c; }
.weather-divider { width: 1px; height: 64px; background: #f0ebe4; flex-shrink: 0; }
.weather-right { flex: 1; }
.weather-rec-label { font-size: 10px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px; }
.weather-rec   { font-size: 22px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; }
.weather-bean  { font-size: 13px; color: #c8813a; font-weight: 600; margin-bottom: 6px; }
.weather-why   { font-size: 13px; color: #78716c; margin: 0; }

/* ── MOOD SELECTOR ── */
.mood-section  { background: #faf7f2; padding: 72px 24px; }
.mood-grid     { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin: 32px 0; }
.mood-btn      { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 130px; padding: 20px 16px; background: #fff; border: 2px solid #f0ebe4; border-radius: 18px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.mood-btn:hover, .mood-btn.active { border-color: #d4a060; background: #fdf3e7; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(200,129,58,0.15); }
.mood-emoji    { font-size: 32px; }
.mood-label    { font-size: 14px; font-weight: 700; color: #1c1917; }
.mood-result   { max-width: 560px; margin: 0 auto; text-align: center; background: #1c1917; border-radius: 20px; padding: 32px 36px; }
.mood-rec-bean { font-size: 24px; font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin-bottom: 6px; }
.mood-rec-brew { font-size: 13px; color: #78716c; margin-bottom: 10px; }
.mood-rec-brew strong { color: #d4a060; }
.mood-rec-why  { font-size: 14px; color: #a8a29e; line-height: 1.7; margin: 0 0 20px; }
.mood-cta      { display: inline-block; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border-radius: 10px; padding: 12px 28px; font-weight: 700; text-decoration: none; }
.fade-enter-active, .fade-leave-active { transition: all 0.35s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(12px); }

/* ── ROASTER'S DIARY ── */
.diary-section { background: #fff; padding: 72px 24px; }
.diary-grid    { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 20px; margin-top: 36px; }
.diary-card    { border: 1px solid #f0ebe4; border-radius: 16px; padding: 24px 26px; background: #faf7f2; transition: box-shadow 0.2s; }
.diary-card:hover { box-shadow: 0 6px 24px rgba(44,16,8,0.08); }
.diary-meta    { font-size: 11px; font-weight: 700; color: #c8813a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
.diary-title   { font-size: 17px; font-weight: 800; color: #1c1917; margin-bottom: 12px; font-family: 'Playfair Display', serif; line-height: 1.4; }
.diary-body    { font-size: 14px; color: #57534e; line-height: 1.75; margin: 0; }
</style>
