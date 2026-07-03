<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MenuItem } from '../../stores/products'
import { useCartStore } from '../../stores/cart'

const cart = useCartStore()

type RoastLevel = 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark'
type WeightOpt  = '250g' | '500g' | '1kg' | '5kg'

interface RoasteryBean {
  id: number; name: string; flag: string; country: string; origin: string
  roast: RoastLevel; score: number; altitude: string; process: string
  contents: string[]; ratio: string; ratioNote: string
  basePrice: number; roastDate: string; color: string; gradient: string
}

const WEIGHT_MULTI: Record<WeightOpt, number> = { '250g': 1, '500g': 1.80, '1kg': 3.20, '5kg': 13.50 }
const WEIGHT_PRICE_LABEL: Record<WeightOpt, string> = { '250g': '/bag', '500g': '/bag', '1kg': '/bag', '5kg': '/sack' }

const roastPct: Record<RoastLevel, number> = {
  'Light': 18, 'Medium-Light': 35, 'Medium': 52, 'Medium-Dark': 70, 'Dark': 88,
}
const roastBagDark: Record<RoastLevel, string> = {
  'Light': '#7a4018', 'Medium-Light': '#5a2c10', 'Medium': '#401808',
  'Medium-Dark': '#2e1008', 'Dark': '#1e0a06',
}
const roastBagMid: Record<RoastLevel, string> = {
  'Light': '#c8813a', 'Medium-Light': '#9a5a28', 'Medium': '#7a3a14',
  'Medium-Dark': '#5a2408', 'Dark': '#3a1208',
}

const beans: RoasteryBean[] = [
  {
    id: 9001, name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', country: 'Ethiopia',
    origin: 'Gedeo Zone, Southern Ethiopia', roast: 'Light', score: 94,
    altitude: '1,750 – 2,200 m', process: 'Washed',
    contents: ['Wild Blueberry', 'Jasmine', 'Bergamot', 'Lemon Zest', 'White Peach'],
    ratio: '1 : 15', ratioNote: 'Pour Over / V60 · 60 g per litre',
    basePrice: 12.00, roastDate: '01 Jul 2026', color: '#c8813a',
    gradient: 'linear-gradient(145deg,#6b3010,#a05020)',
  },
  {
    id: 9002, name: 'Colombian Supremo', flag: '🇨🇴', country: 'Colombia',
    origin: 'Huila, Southern Colombia', roast: 'Medium', score: 88,
    altitude: '1,500 – 1,800 m', process: 'Washed',
    contents: ['Milk Chocolate', 'Red Apple', 'Caramel', 'Hazelnut', 'Brown Sugar'],
    ratio: '1 : 15', ratioNote: 'Filter / Espresso · 60 g per litre',
    basePrice: 9.50, roastDate: '29 Jun 2026', color: '#9a5020',
    gradient: 'linear-gradient(145deg,#4a2010,#7a3818)',
  },
  {
    id: 9003, name: 'Kenya AA', flag: '🇰🇪', country: 'Kenya',
    origin: 'Nyeri County, Central Kenya', roast: 'Medium-Light', score: 92,
    altitude: '1,600 – 1,900 m', process: 'Double Washed',
    contents: ['Blackcurrant', 'Raspberry', 'Tomato Vine', 'Dark Cherry', 'Wine'],
    ratio: '1 : 16', ratioNote: 'Aeropress / Chemex · 62 g per litre',
    basePrice: 11.00, roastDate: '28 Jun 2026', color: '#b07030',
    gradient: 'linear-gradient(145deg,#583010,#8a4820)',
  },
  {
    id: 9004, name: 'Guatemala Antigua', flag: '🇬🇹', country: 'Guatemala',
    origin: 'Antigua Valley, Guatemala', roast: 'Medium', score: 87,
    altitude: '1,500 – 1,700 m', process: 'Washed',
    contents: ['Dark Chocolate', 'Black Cherry', 'Cinnamon', 'Molasses', 'Brown Sugar'],
    ratio: '1 : 15', ratioNote: 'Drip / Espresso · 60 g per litre',
    basePrice: 9.00, roastDate: '27 Jun 2026', color: '#8a4518',
    gradient: 'linear-gradient(145deg,#3a1a08,#6a3010)',
  },
  {
    id: 9005, name: 'Sumatra Mandheling', flag: '🇮🇩', country: 'Indonesia',
    origin: 'North Sumatra, Indonesia', roast: 'Dark', score: 85,
    altitude: '800 – 1,500 m', process: 'Wet-Hulled',
    contents: ['Dark Cocoa', 'Cedar', 'Tobacco', 'Dried Fruit', 'Earthy Spice'],
    ratio: '1 : 12', ratioNote: 'French Press / Moka Pot · 83 g per litre',
    basePrice: 8.50, roastDate: '01 Jul 2026', color: '#6a2a10',
    gradient: 'linear-gradient(145deg,#2a0e06,#4a1c0a)',
  },
  {
    id: 9006, name: 'Brazilian Santos', flag: '🇧🇷', country: 'Brazil',
    origin: 'Minas Gerais, Brazil', roast: 'Medium-Dark', score: 83,
    altitude: '900 – 1,200 m', process: 'Natural',
    contents: ['Milk Chocolate', 'Almond', 'Sweet Caramel', 'Walnut', 'Vanilla'],
    ratio: '1 : 2', ratioNote: 'Espresso / Flat White · 18 g dose',
    basePrice: 8.00, roastDate: '26 Jun 2026', color: '#7a3a10',
    gradient: 'linear-gradient(145deg,#321408,#5a2810)',
  },
  {
    id: 9007, name: 'Panama Geisha', flag: '🇵🇦', country: 'Panama',
    origin: 'Chiriquí Highlands, Panama', roast: 'Light', score: 97,
    altitude: '1,600 – 2,100 m', process: 'Washed',
    contents: ['Jasmine', 'White Peach', 'Apricot', 'Green Apple', 'Honey', 'Bergamot'],
    ratio: '1 : 17', ratioNote: 'Pour Over / Siphon · 58 g per litre',
    basePrice: 22.00, roastDate: '02 Jul 2026', color: '#d4a060',
    gradient: 'linear-gradient(145deg,#7a4818,#b07030)',
  },
  {
    id: 9008, name: 'Rwanda Bourbon', flag: '🇷🇼', country: 'Rwanda',
    origin: 'Western Province, Rwanda', roast: 'Medium-Light', score: 90,
    altitude: '1,400 – 1,800 m', process: 'Washed',
    contents: ['Strawberry', 'Raspberry', 'Orange Zest', 'Rose Hip', 'Caramel'],
    ratio: '1 : 15', ratioNote: 'V60 / Cold Brew · 60 g per litre',
    basePrice: 10.50, roastDate: '30 Jun 2026', color: '#a85820',
    gradient: 'linear-gradient(145deg,#4a2010,#7a3818)',
  },
  {
    id: 9009, name: 'Yemen Mokha', flag: '🇾🇪', country: 'Yemen',
    origin: 'Haraz Mountains, Yemen', roast: 'Medium-Dark', score: 89,
    altitude: '1,800 – 2,500 m', process: 'Natural',
    contents: ['Wild Berry', 'Dark Chocolate', 'Cardamom', 'Clove', 'Red Wine'],
    ratio: '1 : 13', ratioNote: 'Turkish / Moka Pot · 77 g per litre',
    basePrice: 14.00, roastDate: '25 Jun 2026', color: '#7a4020',
    gradient: 'linear-gradient(145deg,#3a1810,#6a2c18)',
  },
  {
    id: 9010, name: 'Vietnam Robusta', flag: '🇻🇳', country: 'Vietnam',
    origin: 'Dak Lak Province, Vietnam', roast: 'Dark', score: 78,
    altitude: '500 – 800 m', process: 'Natural',
    contents: ['Dark Bitter Chocolate', 'Tobacco Leaf', 'Black Earth', 'Bark', 'Bold Bitter'],
    ratio: '1 : 10', ratioNote: 'Phin Filter / Iced Coffee · 100 g per litre',
    basePrice: 7.00, roastDate: '30 Jun 2026', color: '#5a2208',
    gradient: 'linear-gradient(145deg,#1e0a04,#3a1408)',
  },
  {
    id: 9011, name: 'Peru Organic', flag: '🇵🇪', country: 'Peru',
    origin: 'Junín & Cajamarca, Peru', roast: 'Medium', score: 86,
    altitude: '1,400 – 1,900 m', process: 'Washed',
    contents: ['Honey', 'Pecan', 'Cocoa Nib', 'Green Apple', 'Mild Citrus'],
    ratio: '1 : 15', ratioNote: 'Drip / Cold Brew · 60 g per litre',
    basePrice: 9.50, roastDate: '28 Jun 2026', color: '#8a4818',
    gradient: 'linear-gradient(145deg,#3a1808,#6a2e12)',
  },
  {
    id: 9012, name: 'Mexico Chiapas', flag: '🇲🇽', country: 'Mexico',
    origin: 'Chiapas Highlands, Mexico', roast: 'Medium', score: 84,
    altitude: '1,200 – 1,600 m', process: 'Washed',
    contents: ['Brown Sugar', 'Toasted Walnut', 'Milk Chocolate', 'Green Apple', 'Cream'],
    ratio: '1 : 15', ratioNote: 'Drip / Espresso · 60 g per litre',
    basePrice: 8.50, roastDate: '27 Jun 2026', color: '#9a5020',
    gradient: 'linear-gradient(145deg,#3a1a08,#6a3010)',
  },
]

const selected     = ref<RoasteryBean>(beans[0])
const selWeight    = ref<WeightOpt>('250g')

const price = computed(() =>
  +(selected.value.basePrice * WEIGHT_MULTI[selWeight.value]).toFixed(2)
)
const pricePerHundredG = computed(() => {
  const g = selWeight.value === '5kg' ? 5000 : selWeight.value === '1kg' ? 1000
    : selWeight.value === '500g' ? 500 : 250
  return (price.value / g * 100).toFixed(2)
})
const bestBefore = computed(() => {
  const [d, m, y] = selected.value.roastDate.split(' ')
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const date = new Date(+y, MONTHS.indexOf(m), +d)
  date.setDate(date.getDate() + 60)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

const toast        = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout>

function addToCart() {
  const b = selected.value
  const wi = ['250g','500g','1kg','5kg'].indexOf(selWeight.value)
  const product: MenuItem = {
    id: b.id + wi * 100,
    name: `${b.name} — ${selWeight.value}`,
    description: `${b.roast} roast · ${b.process} · Roasted ${b.roastDate} · ${b.origin}`,
    price: price.value,
    category: 'Specialty',
    scentType: b.contents.join(', '),
    stock: 999, lowStockThreshold: 5,
    gradient: b.gradient, accent: b.color, image: '',
    rating: +(b.score / 20).toFixed(1), reviews: 0,
  }
  cart.addToCart(product, 'medium')
  clearTimeout(toastTimer)
  toast.value = `${b.flag} ${b.name} ${selWeight.value} added to cart!`
  toastVisible.value = true
  toastTimer = setTimeout(() => toastVisible.value = false, 3000)
}
</script>

<template>
  <div class="roastery-page">

    <!-- ── HERO ────────────────────────────────────────────────── -->
    <section class="roastery-hero">
      <div class="hero-bg-orbs">
        <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div>
      </div>

      <div class="hero-inner">
        <!-- Left: text + controls -->
        <div class="hero-left">
          <p class="eyebrow">✦ 4ever Roastery</p>
          <h1 class="hero-h1">Single-Origin<br/>Beans Roasted<br/><em>to Order</em></h1>
          <p class="hero-sub">Hand-selected from 12 origins. Roasted fresh and sealed the same day. Delivered to your door within 48 hours.</p>

          <!-- Weight selector -->
          <div class="weight-label">Choose bag size</div>
          <div class="weight-grid">
            <button
              v-for="w in (['250g','500g','1kg','5kg'] as WeightOpt[])" :key="w"
              class="w-btn" :class="{ active: selWeight === w }"
              @click="selWeight = w"
            >
              <span class="w-size">{{ w }}</span>
              <span class="w-price">£{{ (selected.basePrice * WEIGHT_MULTI[w]).toFixed(2) }}</span>
              <span class="w-unit">£{{ (selected.basePrice * WEIGHT_MULTI[w] / (w === '5kg' ? 5000 : w === '1kg' ? 1000 : w === '500g' ? 500 : 250) * 100).toFixed(2) }}/100g</span>
            </button>
          </div>

          <!-- Price + CTA -->
          <div class="price-row">
            <div class="big-price">£{{ price.toFixed(2) }}</div>
            <div class="price-detail">£{{ pricePerHundredG }}/100g{{ WEIGHT_PRICE_LABEL[selWeight] }}</div>
          </div>
          <button class="add-btn" @click="addToCart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add {{ selWeight }} to Cart
          </button>
          <p class="freshness-note">🔒 Nitrogen-sealed · ♻ Compostable bag · 🚚 48-hr dispatch</p>
        </div>

        <!-- Center: CSS Bag Mockup -->
        <div class="bag-stage">
          <div class="bag-wrap" :key="selected.name">
            <!-- Bag seal / top fold -->
            <div class="bag-seal" :style="{ background: roastBagDark[selected.roast] }">
              <span v-for="i in 14" :key="i" class="seal-rib"></span>
            </div>

            <!-- Bag body -->
            <div
              class="bag-body"
              :style="{
                '--bag-dark': roastBagDark[selected.roast],
                '--bag-mid':  roastBagMid[selected.roast],
              }"
            >
              <!-- Foil texture overlay -->
              <div class="bag-texture"></div>

              <!-- Side shine -->
              <div class="bag-shine-left"></div>
              <div class="bag-shine-right"></div>

              <!-- Degassing valve -->
              <div class="bag-valve">
                <div class="valve-ring"></div>
                <div class="valve-dot"></div>
              </div>

              <!-- Brand -->
              <div class="bag-brand">
                <div class="brand-num">4<em>ever</em></div>
                <div class="brand-sub">ROASTERY</div>
                <div class="brand-rule"></div>
              </div>

              <!-- Bean name + origin -->
              <div class="bag-bean-name">{{ selected.name }}</div>
              <div class="bag-origin">{{ selected.flag }} {{ selected.country }}</div>
              <div class="bag-process">{{ selected.process }} · {{ selected.altitude }}</div>

              <!-- Roast level bar -->
              <div class="bag-roast-section">
                <div class="bag-roast-label">{{ selected.roast }} Roast</div>
                <div class="bag-roast-track">
                  <div class="bag-roast-fill" :style="{ width: roastPct[selected.roast] + '%' }"></div>
                </div>
                <div class="bag-roast-ends"><span>Light</span><span>Dark</span></div>
              </div>

              <!-- Tasting notes -->
              <div class="bag-notes-title">TASTING NOTES</div>
              <div class="bag-notes">
                <div v-for="c in selected.contents.slice(0, 4)" :key="c" class="bag-note">
                  <span class="note-dot">◆</span> {{ c }}
                </div>
              </div>

              <!-- Divider -->
              <div class="bag-divider"></div>

              <!-- Ratio + date -->
              <div class="bag-meta">
                <div class="bag-ratio-line">
                  <span class="meta-key">Brew Ratio</span>
                  <span class="meta-val">{{ selected.ratio }}</span>
                </div>
                <div class="bag-ratio-line">
                  <span class="meta-key">Roasted</span>
                  <span class="meta-val">{{ selected.roastDate }}</span>
                </div>
                <div class="bag-ratio-line">
                  <span class="meta-key">Best Before</span>
                  <span class="meta-val">{{ bestBefore }}</span>
                </div>
              </div>

              <!-- Weight badge + score -->
              <div class="bag-footer-row">
                <div class="bag-weight-badge">{{ selWeight }}</div>
                <div class="bag-score-badge">
                  <div class="score-num">{{ selected.score }}</div>
                  <div class="score-label">SCA</div>
                </div>
              </div>
            </div>

            <!-- Flat bottom -->
            <div class="bag-bottom" :style="{ background: roastBagDark[selected.roast] }"></div>

            <!-- Ground shadow -->
            <div class="bag-shadow"></div>
          </div>

          <!-- Weight tag hanging on bag -->
          <div class="weight-tag">{{ selWeight }}</div>
        </div>

        <!-- Right: details panel -->
        <div class="hero-right">
          <div class="detail-panel">
            <div class="dp-score">
              <svg viewBox="0 0 80 80" class="score-ring-svg">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#2d2825" stroke-width="6"/>
                <circle cx="40" cy="40" r="32" fill="none" :stroke="selected.color" stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="201.1"
                  :stroke-dashoffset="201.1 - (201.1 * selected.score / 100)"
                  transform="rotate(-90 40 40)"/>
              </svg>
              <div class="score-inner">
                <div class="score-big">{{ selected.score }}</div>
                <div class="score-sub">/ 100</div>
              </div>
            </div>
            <div class="dp-title">{{ selected.name }}</div>
            <div class="dp-origin">{{ selected.flag }} {{ selected.origin }}</div>

            <div class="dp-specs">
              <div class="dp-spec"><div class="ds-k">Altitude</div><div class="ds-v">{{ selected.altitude }}</div></div>
              <div class="dp-spec"><div class="ds-k">Process</div><div class="ds-v">{{ selected.process }}</div></div>
              <div class="dp-spec"><div class="ds-k">Roast</div><div class="ds-v">{{ selected.roast }}</div></div>
              <div class="dp-spec"><div class="ds-k">Ratio</div><div class="ds-v">{{ selected.ratio }}</div></div>
            </div>

            <div class="dp-section">Coffee Content</div>
            <div class="dp-contents">
              <span v-for="c in selected.contents" :key="c" class="dp-content-tag">{{ c }}</span>
            </div>

            <div class="dp-section">Recommended Brewing</div>
            <div class="dp-ratio-box">
              <div class="ratio-big">{{ selected.ratio }}</div>
              <div class="ratio-detail">{{ selected.ratioNote }}</div>
            </div>

            <div class="dp-dates">
              <div class="dp-date-row">
                <span class="date-icon">🔥</span>
                <div><div class="date-key">Roasted</div><div class="date-val">{{ selected.roastDate }}</div></div>
              </div>
              <div class="dp-date-row">
                <span class="date-icon">📅</span>
                <div><div class="date-key">Best Before</div><div class="date-val">{{ bestBefore }}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BEAN SELECTOR ────────────────────────────────────────── -->
    <section class="selector-section">
      <div class="sel-inner">
        <div class="sel-header">
          <h2 class="sel-title">Choose Your Origin</h2>
          <p class="sel-sub">{{ beans.length }} single-origin beans — click to preview on your bag</p>
        </div>
        <div class="bean-grid">
          <button
            v-for="b in beans" :key="b.id"
            class="bean-tile" :class="{ active: selected.id === b.id }"
            @click="selected = b"
          >
            <div class="tile-flag">{{ b.flag }}</div>
            <div class="tile-name">{{ b.name }}</div>
            <div class="tile-country">{{ b.country }}</div>
            <div class="tile-score-bar">
              <div class="tile-score-fill" :style="{ width: b.score + '%', background: roastBagMid[b.roast] }"></div>
            </div>
            <div class="tile-bottom">
              <span class="tile-score">{{ b.score }}/100</span>
              <span class="tile-price">from £{{ b.basePrice.toFixed(2) }}</span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- ── PACKAGING ANATOMY ────────────────────────────────────── -->
    <section class="anatomy-section">
      <div class="anatomy-inner">
        <div class="anatomy-text">
          <p class="section-eyebrow">Packaging Guide</p>
          <h2 class="anatomy-title">What's on Your Bag</h2>
          <p class="anatomy-sub">Every element of our 4ever Roastery packaging is intentional. Here's how to read what's inside.</p>

          <div class="anatomy-items">
            <div class="anat-item">
              <div class="anat-icon" style="background: rgba(212,160,96,0.15); color: #d4a060;">①</div>
              <div>
                <div class="anat-label">4ever Roastery Logo</div>
                <div class="anat-desc">Our brand mark. Guarantees this batch was roasted in our Jumeirah facility under our Master Roaster's supervision.</div>
              </div>
            </div>
            <div class="anat-item">
              <div class="anat-icon" style="background: rgba(16,185,129,0.12); color: #10b981;">②</div>
              <div>
                <div class="anat-label">Roast Date</div>
                <div class="anat-desc">The exact date beans left our drum roaster. Peak flavour is 5–14 days after roasting. Best before 60 days.</div>
              </div>
            </div>
            <div class="anat-item">
              <div class="anat-icon" style="background: rgba(245,158,11,0.12); color: #f59e0b;">③</div>
              <div>
                <div class="anat-label">Tasting Notes (Coffee Content)</div>
                <div class="anat-desc">Flavour compounds naturally present in the bean — chocolate, green apple, strawberry, jasmine and more. No additives, ever.</div>
              </div>
            </div>
            <div class="anat-item">
              <div class="anat-icon" style="background: rgba(59,130,246,0.12); color: #3b82f6;">④</div>
              <div>
                <div class="anat-label">Brew Ratio</div>
                <div class="anat-desc">Our recommended coffee-to-water ratio. 1:15 means 15g water per 1g coffee. Adjust to taste — lighter ratio = stronger cup.</div>
              </div>
            </div>
            <div class="anat-item">
              <div class="anat-icon" style="background: rgba(139,92,246,0.12); color: #8b5cf6;">⑤</div>
              <div>
                <div class="anat-label">SCA Quality Score</div>
                <div class="anat-desc">Specialty Coffee Association scoring. 80+ is specialty grade. Our beans range 78–97. All 100% Arabica except Vietnam Robusta.</div>
              </div>
            </div>
            <div class="anat-item">
              <div class="anat-icon" style="background: rgba(239,68,68,0.12); color: #ef4444;">⑥</div>
              <div>
                <div class="anat-label">Degassing Valve</div>
                <div class="anat-desc">The circular valve lets CO₂ out without letting oxygen in. Fresh roasted coffee releases gas for 48 hours — the valve protects freshness.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Static bag diagram -->
        <div class="anatomy-bag">
          <div class="diag-bag">
            <div class="diag-seal">
              <span v-for="i in 12" :key="i" class="diag-rib"></span>
            </div>
            <div class="diag-body">
              <!-- Callout lines -->
              <div class="callout c-valve"><div class="callout-dot"></div><div class="callout-line"></div><span class="callout-num">⑥</span></div>
              <div class="callout c-logo"><div class="callout-dot"></div><div class="callout-line"></div><span class="callout-num">①</span></div>
              <div class="callout c-notes"><div class="callout-dot"></div><div class="callout-line"></div><span class="callout-num">③</span></div>
              <div class="callout c-ratio"><div class="callout-dot"></div><div class="callout-line"></div><span class="callout-num">④</span></div>
              <div class="callout c-date"><div class="callout-dot"></div><div class="callout-line"></div><span class="callout-num">②</span></div>
              <div class="callout c-score"><div class="callout-dot"></div><div class="callout-line"></div><span class="callout-num">⑤</span></div>

              <!-- Bag content (static) -->
              <div class="diag-valve-circle"><div class="diag-valve-inner"></div></div>
              <div class="diag-brand-text">4ever ROASTERY</div>
              <div class="diag-bean-text">Single Origin Specialty</div>
              <div class="diag-notes-block">
                <div class="diag-notes-title">TASTING NOTES</div>
                <div class="diag-note-line">◆ Chocolate</div>
                <div class="diag-note-line">◆ Green Apple</div>
                <div class="diag-note-line">◆ Strawberry</div>
              </div>
              <div class="diag-meta-block">
                <div class="diag-meta-line">Brew Ratio 1:15</div>
                <div class="diag-meta-line">Roasted 01 Jul 2026</div>
              </div>
              <div class="diag-score-circle">97</div>
            </div>
            <div class="diag-bottom"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT SHIPS ─────────────────────────────────────────── -->
    <section class="ship-section">
      <div class="ship-inner">
        <h2 class="ship-title">From Roaster to Your Door</h2>
        <div class="ship-steps">
          <div class="ship-step">
            <div class="step-icon">🔥</div>
            <div class="step-num">01</div>
            <div class="step-label">Fresh Roast</div>
            <div class="step-desc">Beans are drum-roasted to your chosen profile on the day your order is placed.</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="ship-step">
            <div class="step-icon">💨</div>
            <div class="step-num">02</div>
            <div class="step-label">Cool & Degas</div>
            <div class="step-desc">Cooled in 4 minutes. Rested 12 hours to release CO₂ before sealing.</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="ship-step">
            <div class="step-icon">📦</div>
            <div class="step-num">03</div>
            <div class="step-label">Nitrogen Sealed</div>
            <div class="step-desc">Packed in a compostable kraft bag with nitrogen flush and one-way valve.</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="ship-step">
            <div class="step-icon">🚚</div>
            <div class="step-num">04</div>
            <div class="step-label">48-hr Delivery</div>
            <div class="step-desc">Dispatched within 24 hours. Free delivery on orders over £30.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SIGNATURE PACKAGING ──────────────────────────────────── -->
    <section class="pkg-section">
      <div class="pkg-inner">
        <div class="pkg-header">
          <p class="pkg-eyebrow">✦ Signature Collections</p>
          <h2 class="pkg-title">Crafted for Every Ritual</h2>
          <p class="pkg-sub">Two iconic formats. Each bag designed by hand — nitrogen-flushed, compostable, and built to keep your coffee at peak freshness.</p>
        </div>

        <div class="pkg-grid">

          <!-- ─── V60 COMBO BAG ─── -->
          <div class="pkg-card">
            <div class="pkg-bag-stage">
              <!-- Shadow -->
              <div class="pkg-shadow v60-shadow"></div>
              <!-- Bag wrapper -->
              <div class="pkg-bag v60-bag">
                <!-- Top tin-tie seal -->
                <div class="pkg-seal v60-seal">
                  <div class="tin-tie-wrap">
                    <div class="tin-tie"></div>
                    <div class="tin-tie"></div>
                    <div class="tin-tie"></div>
                  </div>
                  <div class="seal-crimp">
                    <span v-for="i in 16" :key="i" class="crimp-rib"></span>
                  </div>
                </div>
                <!-- Bag body -->
                <div class="pkg-body v60-body">
                  <!-- Texture overlay -->
                  <div class="matte-texture"></div>
                  <!-- Left edge shine -->
                  <div class="edge-shine-l"></div>
                  <div class="edge-shine-r"></div>
                  <!-- Degassing valve -->
                  <div class="pkg-valve">
                    <div class="valve-outer"><div class="valve-inner"><div class="valve-pin"></div></div></div>
                  </div>
                  <!-- Logo area -->
                  <div class="pkg-logo-zone v60-logo">
                    <div class="logo-mark">4<em>ever</em></div>
                    <div class="logo-sub">ROASTERY · DUBAI</div>
                    <div class="logo-rule"></div>
                  </div>
                  <!-- Product name banner -->
                  <div class="pkg-name-banner v60-banner">
                    <div class="banner-line-top">V60</div>
                    <div class="banner-line-main">COMBO</div>
                    <div class="banner-line-sub">POUR-OVER COLLECTION</div>
                  </div>
                  <!-- Decorative drip illustration -->
                  <div class="drip-art v60-drip">
                    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <!-- V60 cone shape -->
                      <path d="M20 10 L60 72 L100 10 Z" fill="none" stroke="rgba(212,160,96,0.5)" stroke-width="1.5"/>
                      <path d="M35 10 L60 58 L85 10" fill="none" stroke="rgba(212,160,96,0.25)" stroke-width="1"/>
                      <!-- Brew stream -->
                      <path d="M60 72 Q58 76 60 82" stroke="rgba(212,160,96,0.6)" stroke-width="1.5" stroke-linecap="round"/>
                      <ellipse cx="60" cy="12" rx="40" ry="5" fill="rgba(212,160,96,0.08)" stroke="rgba(212,160,96,0.3)" stroke-width="1"/>
                      <!-- Spiral swirl on left -->
                      <circle cx="28" cy="45" r="8" fill="none" stroke="rgba(212,160,96,0.15)" stroke-width="1"/>
                      <circle cx="28" cy="45" r="5" fill="none" stroke="rgba(212,160,96,0.1)" stroke-width="0.75"/>
                      <!-- Dots -->
                      <circle cx="92" cy="38" r="1.5" fill="rgba(212,160,96,0.35)"/>
                      <circle cx="97" cy="50" r="1" fill="rgba(212,160,96,0.2)"/>
                      <circle cx="15" cy="28" r="1" fill="rgba(212,160,96,0.2)"/>
                    </svg>
                  </div>
                  <!-- Tasting notes strip -->
                  <div class="pkg-notes-strip">
                    <div class="notes-label">TASTING NOTES</div>
                    <div class="notes-pills">
                      <span class="note-pill v60-pill">Jasmine</span>
                      <span class="note-pill v60-pill">Peach</span>
                      <span class="note-pill v60-pill">Honey</span>
                      <span class="note-pill v60-pill">Citrus</span>
                    </div>
                  </div>
                  <!-- Meta grid -->
                  <div class="pkg-meta-grid">
                    <div class="pmg-item"><span class="pmg-k">Origin</span><span class="pmg-v">Ethiopia · Yirgacheffe</span></div>
                    <div class="pmg-item"><span class="pmg-k">Process</span><span class="pmg-v">Natural Washed</span></div>
                    <div class="pmg-item"><span class="pmg-k">Roast</span><span class="pmg-v">Light</span></div>
                    <div class="pmg-item"><span class="pmg-k">Ratio</span><span class="pmg-v">1:15 pour-over</span></div>
                  </div>
                  <!-- Bottom strip -->
                  <div class="pkg-bottom-strip v60-strip">
                    <div class="strip-weight">250g</div>
                    <div class="strip-cert">SCA 94</div>
                    <div class="strip-eco">♻ Compostable</div>
                  </div>
                </div>
                <!-- Bag gusset bottom -->
                <div class="pkg-gusset v60-gusset"></div>
              </div>
            </div>

            <!-- Card info -->
            <div class="pkg-info">
              <div class="pkg-collection-tag v60-tag">V60 COMBO</div>
              <h3 class="pkg-product-title">Pour-Over Duo Box</h3>
              <p class="pkg-product-desc">Two curated Ethiopian light roasts selected for brilliance in pour-over. Includes a 125g bag each of Yirgacheffe Washed &amp; Sidama Natural — with a printed brew guide.</p>
              <div class="pkg-specs-row">
                <div class="pkg-spec"><span class="ps-icon">⚖</span><span>250g total · 2×125g</span></div>
                <div class="pkg-spec"><span class="ps-icon">🌱</span><span>Single origin, traceable</span></div>
                <div class="pkg-spec"><span class="ps-icon">📄</span><span>Brew guide included</span></div>
                <div class="pkg-spec"><span class="ps-icon">♻</span><span>Compostable packaging</span></div>
              </div>
              <div class="pkg-price-row">
                <div class="pkg-price">£18.50</div>
                <div class="pkg-price-note">Free shipping over £30</div>
              </div>
              <button class="pkg-cta v60-cta" @click="cart.addToCart({ id: 501, name: 'V60 Combo — Pour-Over Duo', description: 'Two curated Ethiopian light roasts · Yirgacheffe + Sidama · 250g combo · brew guide included', price: 18.50, category: 'Specialty', scentType: 'Jasmine, Peach, Honey, Citrus', stock: 50, lowStockThreshold: 5, gradient: 'linear-gradient(145deg,#1a0a04,#3a1a08)', accent: '#d4a060', image: '', rating: 4.9, reviews: 0 }, 'medium')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Add to Cart — £18.50
              </button>
            </div>
          </div>

          <!-- ─── FAMILY PACKAGE ─── -->
          <div class="pkg-card">
            <div class="pkg-bag-stage">
              <div class="pkg-shadow fam-shadow"></div>
              <div class="pkg-bag fam-bag">
                <!-- Seal -->
                <div class="pkg-seal fam-seal">
                  <div class="tin-tie-wrap">
                    <div class="tin-tie fam-tie"></div>
                    <div class="tin-tie fam-tie"></div>
                    <div class="tin-tie fam-tie"></div>
                  </div>
                  <div class="seal-crimp fam-crimp">
                    <span v-for="i in 16" :key="i" class="crimp-rib fam-rib"></span>
                  </div>
                </div>
                <!-- Body -->
                <div class="pkg-body fam-body">
                  <div class="kraft-texture"></div>
                  <div class="edge-shine-l fam-shine-l"></div>
                  <div class="edge-shine-r fam-shine-r"></div>
                  <!-- Valve -->
                  <div class="pkg-valve fam-valve">
                    <div class="valve-outer fam-valve-outer"><div class="valve-inner fam-valve-inner"><div class="valve-pin fam-pin"></div></div></div>
                  </div>
                  <!-- Logo -->
                  <div class="pkg-logo-zone fam-logo">
                    <div class="logo-mark fam-mark">4<em>ever</em></div>
                    <div class="logo-sub fam-sub">ROASTERY · DUBAI</div>
                    <div class="logo-rule fam-rule"></div>
                  </div>
                  <!-- Name banner -->
                  <div class="pkg-name-banner fam-banner">
                    <div class="banner-line-top fam-top">FAMILY</div>
                    <div class="banner-line-main fam-main">PACKAGE</div>
                    <div class="banner-line-sub fam-sub2">HOME BREWING EDITION</div>
                  </div>
                  <!-- Home/hearth illustration -->
                  <div class="drip-art fam-drip">
                    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <!-- Coffee cup -->
                      <rect x="38" y="34" width="44" height="30" rx="4" fill="rgba(74,124,89,0.12)" stroke="rgba(74,124,89,0.45)" stroke-width="1.5"/>
                      <!-- Cup handle -->
                      <path d="M82 42 Q92 42 92 54 Q92 64 82 64" fill="none" stroke="rgba(74,124,89,0.45)" stroke-width="1.5"/>
                      <!-- Steam lines -->
                      <path d="M52 28 Q50 22 52 16" stroke="rgba(74,124,89,0.4)" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M60 26 Q58 20 60 13" stroke="rgba(74,124,89,0.5)" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M68 28 Q66 22 68 16" stroke="rgba(74,124,89,0.4)" stroke-width="1.5" stroke-linecap="round"/>
                      <!-- Saucer -->
                      <ellipse cx="60" cy="64" rx="28" ry="4" fill="rgba(74,124,89,0.15)" stroke="rgba(74,124,89,0.3)" stroke-width="1"/>
                      <!-- Stars -->
                      <circle cx="20" cy="20" r="1.5" fill="rgba(74,124,89,0.4)"/>
                      <circle cx="100" cy="18" r="1" fill="rgba(74,124,89,0.3)"/>
                      <circle cx="15" cy="55" r="1" fill="rgba(74,124,89,0.25)"/>
                      <circle cx="105" cy="55" r="1.5" fill="rgba(74,124,89,0.35)"/>
                      <!-- Leaf motif -->
                      <path d="M96 30 Q104 24 108 32 Q104 38 96 30Z" fill="rgba(74,124,89,0.2)" stroke="rgba(74,124,89,0.4)" stroke-width="0.75"/>
                      <path d="M12 38 Q18 30 24 38 Q18 44 12 38Z" fill="rgba(74,124,89,0.15)" stroke="rgba(74,124,89,0.35)" stroke-width="0.75"/>
                    </svg>
                  </div>
                  <!-- Tasting notes -->
                  <div class="pkg-notes-strip fam-notes">
                    <div class="notes-label fam-nl">TASTING NOTES</div>
                    <div class="notes-pills">
                      <span class="note-pill fam-pill">Dark Chocolate</span>
                      <span class="note-pill fam-pill">Hazelnut</span>
                      <span class="note-pill fam-pill">Brown Sugar</span>
                      <span class="note-pill fam-pill">Walnut</span>
                    </div>
                  </div>
                  <!-- Meta grid -->
                  <div class="pkg-meta-grid fam-meta">
                    <div class="pmg-item fam-pmg"><span class="pmg-k fam-k">Blend</span><span class="pmg-v fam-v">Brazil + Colombia</span></div>
                    <div class="pmg-item fam-pmg"><span class="pmg-k fam-k">Process</span><span class="pmg-v fam-v">Pulped Natural</span></div>
                    <div class="pmg-item fam-pmg"><span class="pmg-k fam-k">Roast</span><span class="pmg-v fam-v">Medium-Dark</span></div>
                    <div class="pmg-item fam-pmg"><span class="pmg-k fam-k">Best For</span><span class="pmg-v fam-v">Filter, French Press</span></div>
                  </div>
                  <!-- Bottom strip -->
                  <div class="pkg-bottom-strip fam-strip">
                    <div class="strip-weight fam-wt">1kg</div>
                    <div class="strip-cert fam-sca">SCA 87</div>
                    <div class="strip-eco fam-eco">♻ Compostable</div>
                  </div>
                </div>
                <div class="pkg-gusset fam-gusset"></div>
              </div>
            </div>

            <!-- Card info -->
            <div class="pkg-info">
              <div class="pkg-collection-tag fam-tag">FAMILY PACKAGE</div>
              <h3 class="pkg-product-title">Home Brew Kilo</h3>
              <p class="pkg-product-desc">A generous 1kg of our signature medium-dark house blend — built for everyday brewing. Rich, smooth, forgiving across all brew methods. Vacuum-sealed for a 3-month shelf life.</p>
              <div class="pkg-specs-row">
                <div class="pkg-spec"><span class="ps-icon">⚖</span><span>1,000g in one bag</span></div>
                <div class="pkg-spec"><span class="ps-icon">☕</span><span>~100 cups per bag</span></div>
                <div class="pkg-spec"><span class="ps-icon">📅</span><span>3-month freshness</span></div>
                <div class="pkg-spec"><span class="ps-icon">🇧🇷</span><span>Brazil + Colombia blend</span></div>
              </div>
              <div class="pkg-price-row">
                <div class="pkg-price fam-price">£34.00</div>
                <div class="pkg-price-note">Save vs. 4×250g (£48)</div>
              </div>
              <button class="pkg-cta fam-cta" @click="cart.addToCart({ id: 502, name: 'Family Package — 1kg Home Brew Kilo', description: 'Brazil + Colombia medium-dark blend · 1kg · filter & french press · ~100 cups', price: 34.00, category: 'Specialty', scentType: 'Dark Chocolate, Hazelnut, Brown Sugar, Walnut', stock: 30, lowStockThreshold: 5, gradient: 'linear-gradient(145deg,#1a2e1a,#0f1f0f)', accent: '#4a7c59', image: '', rating: 4.8, reviews: 0 }, 'medium')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Add to Cart — £34.00
              </button>
            </div>
          </div>

        </div>

        <!-- Bottom value strip -->
        <div class="pkg-value-strip">
          <div class="pvs-item"><span class="pvs-icon">🔒</span><span>Nitrogen Flushed</span></div>
          <div class="pvs-div"></div>
          <div class="pvs-item"><span class="pvs-icon">♻</span><span>Compostable Bags</span></div>
          <div class="pvs-div"></div>
          <div class="pvs-item"><span class="pvs-icon">🚚</span><span>48-hr UAE Delivery</span></div>
          <div class="pvs-div"></div>
          <div class="pvs-item"><span class="pvs-icon">🏆</span><span>SCA Certified Roast</span></div>
          <div class="pvs-div"></div>
          <div class="pvs-item"><span class="pvs-icon">📦</span><span>Gift-Ready Packaging</span></div>
        </div>
      </div>
    </section>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastVisible" class="toast">☕ {{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.roastery-page { min-height: 100vh; background: #faf7f2; }

/* ── HERO ──────────────────────────────────── */
.roastery-hero {
  background: linear-gradient(135deg, #0d0603 0%, #1a0a04 50%, #0d0603 100%);
  padding: 64px 24px 80px;
  position: relative; overflow: hidden;
}
.hero-bg-orbs { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.2; }
.o1 { width: 400px; height: 400px; background: #c8813a; top: -100px; left: -80px; }
.o2 { width: 300px; height: 300px; background: #d4a060; bottom: -60px; right: 100px; }
.o3 { width: 200px; height: 200px; background: #8b4513; top: 30%; left: 40%; }

.hero-inner {
  max-width: 1300px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 48px; align-items: center;
  position: relative; z-index: 2;
}
@media (max-width: 1100px) {
  .hero-inner { grid-template-columns: 1fr 1fr; }
  .hero-right  { display: none; }
}
@media (max-width: 720px) {
  .hero-inner { grid-template-columns: 1fr; }
  .bag-stage  { display: none; }
}

.eyebrow { font-size: 12px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 14px; }
.hero-h1 { font-size: clamp(32px, 4vw, 52px); font-weight: 900; color: #fdf6ec; letter-spacing: -1.5px; margin: 0 0 16px; line-height: 1.1; }
.hero-h1 em { font-style: normal; color: #d4a060; }
.hero-sub { font-size: 15px; color: #78716c; line-height: 1.7; margin: 0 0 28px; }

.weight-label { font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
.weight-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 24px; }
.w-btn {
  background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 10px 6px; cursor: pointer; text-align: center; transition: all 0.2s; font: inherit;
  display: flex; flex-direction: column; gap: 2px; align-items: center;
}
.w-btn:hover { border-color: rgba(212,160,96,0.5); background: rgba(212,160,96,0.08); }
.w-btn.active { border-color: #d4a060; background: rgba(212,160,96,0.15); }
.w-size  { font-size: 14px; font-weight: 800; color: #fdf6ec; }
.w-price { font-size: 12px; font-weight: 700; color: #d4a060; }
.w-unit  { font-size: 10px; color: #78716c; }

.price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
.big-price { font-size: 36px; font-weight: 900; color: #fdf6ec; letter-spacing: -1px; }
.price-detail { font-size: 13px; color: #78716c; }

.add-btn {
  display: flex; align-items: center; gap: 10px; justify-content: center;
  width: 100%; padding: 15px 24px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 12px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  box-shadow: 0 8px 28px rgba(200,129,58,0.45); transition: all 0.2s;
}
.add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(200,129,58,0.6); }
.add-btn svg { width: 18px; height: 18px; }
.freshness-note { font-size: 11px; color: #44403c; text-align: center; margin: 12px 0 0; }

/* ── CSS BAG MOCKUP ─────────────────────────── */
.bag-stage { display: flex; flex-direction: column; align-items: center; position: relative; }

.bag-wrap {
  width: 220px; position: relative;
  animation: bag-float 4s ease-in-out infinite;
}
@keyframes bag-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

/* Top seal */
.bag-seal {
  height: 44px; border-radius: 4px 4px 0 0;
  display: flex; align-items: center; justify-content: center; gap: 3px;
  padding: 0 8px;
}
.seal-rib { display: block; width: 2px; height: 24px; background: rgba(255,255,255,0.22); border-radius: 1px; }

/* Main body */
.bag-body {
  background: linear-gradient(175deg, var(--bag-mid) 0%, var(--bag-dark) 100%);
  padding: 12px 16px 18px;
  min-height: 380px; position: relative; overflow: hidden;
}
.bag-texture {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.025) 10px, rgba(255,255,255,0.025) 11px);
}
.bag-shine-left {
  position: absolute; left: 0; top: 0; bottom: 0; width: 18px;
  background: linear-gradient(90deg, rgba(255,255,255,0.08), transparent);
  pointer-events: none;
}
.bag-shine-right {
  position: absolute; right: 0; top: 0; bottom: 0; width: 10px;
  background: linear-gradient(270deg, rgba(0,0,0,0.2), transparent);
  pointer-events: none;
}

/* Valve */
.bag-valve {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
  position: relative; z-index: 2;
}
.valve-ring { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; }
.valve-dot  { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); position: absolute; }

/* Brand */
.bag-brand { text-align: center; margin-bottom: 10px; position: relative; z-index: 2; }
.brand-num { font-size: 24px; font-weight: 900; color: #fdf6ec; letter-spacing: -1px; line-height: 1; }
.brand-num em { font-style: normal; color: #d4a060; }
.brand-sub { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; color: rgba(255,255,255,0.6); text-transform: uppercase; }
.brand-rule { height: 1px; background: rgba(255,255,255,0.15); margin: 8px 0; }

/* Bean details */
.bag-bean-name { font-size: 12px; font-weight: 800; color: #fdf6ec; text-align: center; position: relative; z-index: 2; line-height: 1.3; }
.bag-origin    { font-size: 10px; color: rgba(255,255,255,0.55); text-align: center; margin-bottom: 2px; position: relative; z-index: 2; }
.bag-process   { font-size: 9px; color: rgba(255,255,255,0.35); text-align: center; margin-bottom: 10px; position: relative; z-index: 2; }

/* Roast bar */
.bag-roast-section { margin-bottom: 10px; position: relative; z-index: 2; }
.bag-roast-label   { font-size: 9px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; text-align: center; }
.bag-roast-track   { height: 4px; background: rgba(255,255,255,0.12); border-radius: 2px; overflow: hidden; }
.bag-roast-fill    { height: 100%; background: linear-gradient(90deg, #fde68a, #d4a060); border-radius: 2px; transition: width 0.5s ease; }
.bag-roast-ends    { display: flex; justify-content: space-between; font-size: 8px; color: rgba(255,255,255,0.3); margin-top: 2px; }

/* Notes */
.bag-notes-title { font-size: 8px; font-weight: 700; letter-spacing: 0.15em; color: rgba(255,255,255,0.45); text-align: center; margin-bottom: 5px; position: relative; z-index: 2; }
.bag-notes { display: flex; flex-direction: column; gap: 3px; margin-bottom: 10px; position: relative; z-index: 2; }
.bag-note  { font-size: 10px; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 5px; }
.note-dot  { font-size: 6px; color: #d4a060; }

/* Divider + meta */
.bag-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0; position: relative; z-index: 2; }
.bag-meta { display: flex; flex-direction: column; gap: 3px; margin-bottom: 10px; position: relative; z-index: 2; }
.bag-ratio-line { display: flex; justify-content: space-between; font-size: 9px; }
.meta-key { color: rgba(255,255,255,0.4); }
.meta-val { color: rgba(255,255,255,0.85); font-weight: 700; }

/* Footer row */
.bag-footer-row { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
.bag-weight-badge {
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 800; color: #fdf6ec;
}
.bag-score-badge {
  background: rgba(212,160,96,0.2); border: 1px solid rgba(212,160,96,0.4);
  border-radius: 8px; padding: 4px 10px; text-align: center;
}
.score-num   { font-size: 16px; font-weight: 900; color: #d4a060; line-height: 1; }
.score-label { font-size: 8px; font-weight: 700; color: rgba(212,160,96,0.7); letter-spacing: 0.1em; }

/* Bag bottom */
.bag-bottom { height: 18px; border-radius: 0 0 6px 6px; }
.bag-shadow {
  width: 160px; height: 20px; margin: 0 auto;
  background: radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%);
  filter: blur(8px);
}

/* Weight tag */
.weight-tag {
  margin-top: 12px; background: #d4a060; color: #1c1917;
  font-size: 13px; font-weight: 800; border-radius: 20px;
  padding: 6px 20px; letter-spacing: 0.04em;
}

/* ── RIGHT PANEL ─────────────────────────────── */
.detail-panel {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 24px;
}
.dp-score { position: relative; width: 80px; height: 80px; margin: 0 auto 14px; }
.score-ring-svg { width: 80px; height: 80px; transition: stroke-dashoffset 0.6s ease; }
.score-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.score-big { font-size: 22px; font-weight: 900; color: #fdf6ec; line-height: 1; }
.score-sub { font-size: 10px; color: #78716c; }

.dp-title  { font-size: 15px; font-weight: 800; color: #fdf6ec; text-align: center; margin-bottom: 4px; }
.dp-origin { font-size: 11px; color: #78716c; text-align: center; margin-bottom: 16px; }

.dp-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
.dp-spec  { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px 10px; }
.ds-k { font-size: 9px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
.ds-v { font-size: 12px; font-weight: 700; color: #fdf6ec; }

.dp-section { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #78716c; margin-bottom: 8px; }
.dp-contents { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
.dp-content-tag { background: rgba(212,160,96,0.15); border: 1px solid rgba(212,160,96,0.3); color: #d4a060; border-radius: 20px; padding: 3px 10px; font-size: 10px; font-weight: 600; }

.dp-ratio-box { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
.ratio-big    { font-size: 22px; font-weight: 900; color: #d4a060; }
.ratio-detail { font-size: 11px; color: #78716c; margin-top: 2px; }

.dp-dates { display: flex; flex-direction: column; gap: 8px; }
.dp-date-row { display: flex; align-items: center; gap: 10px; }
.date-icon { font-size: 16px; }
.date-key  { font-size: 10px; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.date-val  { font-size: 12px; font-weight: 700; color: #fdf6ec; }

/* ── BEAN SELECTOR ───────────────────────────── */
.selector-section { padding: 72px 24px; background: #fff; }
.sel-inner { max-width: 1300px; margin: 0 auto; }
.sel-header { text-align: center; margin-bottom: 36px; }
.sel-title { font-size: 28px; font-weight: 900; color: #1c1917; margin: 0 0 8px; letter-spacing: -0.5px; }
.sel-sub   { font-size: 14px; color: #a8a29e; margin: 0; }

.bean-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
@media (max-width: 1100px) { .bean-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px)  { .bean-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 480px)  { .bean-grid { grid-template-columns: repeat(2, 1fr); } }

.bean-tile {
  background: #faf7f2; border: 1.5px solid #f0ebe4; border-radius: 12px;
  padding: 12px 10px 10px; cursor: pointer; transition: all 0.2s;
  text-align: left; font: inherit; display: flex; flex-direction: column; gap: 4px;
}
.bean-tile:hover  { border-color: #d4a060; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,160,96,0.14); }
.bean-tile.active { border-color: #d4a060; background: #fffbf5; box-shadow: 0 4px 16px rgba(212,160,96,0.2); }
.tile-flag    { font-size: 22px; }
.tile-name    { font-size: 11px; font-weight: 800; color: #1c1917; line-height: 1.3; }
.tile-country { font-size: 10px; color: #a8a29e; margin-bottom: 4px; }
.tile-score-bar { height: 3px; background: #f0ebe4; border-radius: 2px; overflow: hidden; }
.tile-score-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
.tile-bottom  { display: flex; justify-content: space-between; align-items: center; }
.tile-score   { font-size: 10px; font-weight: 700; color: #78716c; }
.tile-price   { font-size: 10px; font-weight: 700; color: #d4a060; }

/* ── PACKAGING ANATOMY ───────────────────────── */
.anatomy-section { padding: 88px 24px; background: #1a0a04; }
.anatomy-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto; gap: 64px; align-items: start;
}
@media (max-width: 900px) { .anatomy-inner { grid-template-columns: 1fr; } }

.section-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d4a060; margin: 0 0 10px; }
.anatomy-title { font-size: 32px; font-weight: 900; color: #fdf6ec; margin: 0 0 10px; letter-spacing: -0.5px; }
.anatomy-sub   { font-size: 14px; color: #78716c; line-height: 1.7; margin: 0 0 32px; }

.anatomy-items { display: flex; flex-direction: column; gap: 18px; }
.anat-item { display: flex; gap: 14px; align-items: flex-start; }
.anat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0; }
.anat-label { font-size: 13px; font-weight: 700; color: #fdf6ec; margin-bottom: 3px; }
.anat-desc  { font-size: 12px; color: #78716c; line-height: 1.6; }

/* Diagram bag */
.anatomy-bag { flex-shrink: 0; }
.diag-bag { width: 180px; position: relative; }

.diag-seal {
  height: 38px; background: #2a0e06; border-radius: 3px 3px 0 0;
  display: flex; align-items: center; justify-content: center; gap: 3px; padding: 0 6px;
}
.diag-rib { display: block; width: 2px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 1px; }

.diag-body {
  background: linear-gradient(175deg, #7a3a14 0%, #3a1208 100%);
  min-height: 320px; position: relative; overflow: visible; padding: 12px 14px 16px;
}

/* Callout system */
.callout { position: absolute; display: flex; align-items: center; }
.callout-dot  { width: 8px; height: 8px; border-radius: 50%; background: #d4a060; border: 1.5px solid #fdf6ec; z-index: 3; }
.callout-line { height: 1px; background: rgba(212,160,96,0.5); }
.callout-num  { background: #d4a060; color: #1c1917; border-radius: 50%; width: 20px; height: 20px; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.c-valve  { top: 22px;  left: -70px; }
.c-valve .callout-line { width: 48px; }
.c-logo   { top: 62px;  right: -70px; flex-direction: row-reverse; }
.c-logo .callout-line { width: 48px; }
.c-notes  { top: 148px; left: -70px; }
.c-notes .callout-line { width: 48px; }
.c-ratio  { top: 214px; right: -70px; flex-direction: row-reverse; }
.c-ratio .callout-line { width: 48px; }
.c-date   { top: 234px; right: -70px; flex-direction: row-reverse; }
.c-date .callout-line { width: 48px; }
.c-score  { top: 270px; left: -70px; }
.c-score .callout-line { width: 48px; }

/* Diagram bag content */
.diag-valve-circle { width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.2); margin: 0 auto 8px; }
.diag-valve-inner  { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); margin: 4px auto; }
.diag-brand-text   { font-size: 11px; font-weight: 800; color: #d4a060; text-align: center; margin-bottom: 2px; }
.diag-bean-text    { font-size: 9px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 14px; }
.diag-notes-block  { background: rgba(255,255,255,0.05); border-radius: 6px; padding: 8px 10px; margin-bottom: 12px; }
.diag-notes-title  { font-size: 7px; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.15em; margin-bottom: 4px; }
.diag-note-line    { font-size: 9px; color: rgba(255,255,255,0.7); margin-bottom: 2px; }
.diag-meta-block   { margin-bottom: 12px; }
.diag-meta-line    { font-size: 8px; color: rgba(255,255,255,0.55); margin-bottom: 2px; }
.diag-score-circle { width: 36px; height: 36px; border-radius: 50%; background: rgba(212,160,96,0.2); border: 1.5px solid #d4a060; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #d4a060; margin-left: auto; }

.diag-bottom { height: 14px; background: #2a0e06; border-radius: 0 0 4px 4px; }

/* ── SHIP SECTION ────────────────────────────── */
.ship-section { padding: 72px 24px; background: #faf7f2; }
.ship-inner { max-width: 1100px; margin: 0 auto; text-align: center; }
.ship-title { font-size: 28px; font-weight: 900; color: #1c1917; margin: 0 0 44px; letter-spacing: -0.5px; }
.ship-steps { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; }
.ship-step  { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 24px 20px; width: 190px; text-align: center; box-shadow: 0 2px 10px rgba(44,16,8,0.06); }
.step-arrow { font-size: 24px; color: #d4a060; padding: 0 8px; font-weight: 700; }
.step-icon  { font-size: 32px; margin-bottom: 8px; }
.step-num   { font-size: 10px; font-weight: 800; color: #d4a060; letter-spacing: 0.1em; margin-bottom: 4px; }
.step-label { font-size: 14px; font-weight: 800; color: #1c1917; margin-bottom: 6px; }
.step-desc  { font-size: 12px; color: #a8a29e; line-height: 1.5; }
@media (max-width: 900px) { .ship-steps { gap: 12px; } .step-arrow { display: none; } }

/* ── TOAST ───────────────────────────────────── */
.toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: #1c1917; color: #fdf6ec; padding: 13px 24px; border-radius: 40px;
  font-size: 14px; font-weight: 600; box-shadow: 0 8px 28px rgba(0,0,0,0.35);
  z-index: 999; white-space: nowrap; border: 1px solid rgba(212,160,96,0.25);
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.9); }

/* ── SIGNATURE PACKAGING ─────────────────────── */
.pkg-section {
  background: linear-gradient(160deg, #060302 0%, #0d0603 40%, #080d06 100%);
  padding: 96px 24px 80px;
  position: relative; overflow: hidden;
}
.pkg-section::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 700px 400px at 20% 60%, rgba(212,160,96,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 500px 300px at 80% 30%, rgba(74,124,89,0.08) 0%, transparent 70%);
}

.pkg-inner { max-width: 1240px; margin: 0 auto; position: relative; z-index: 2; }

.pkg-header { text-align: center; margin-bottom: 72px; }
.pkg-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #d4a060; margin: 0 0 14px; }
.pkg-title   { font-size: clamp(32px, 4vw, 52px); font-weight: 900; color: #fdf6ec; margin: 0 0 14px; letter-spacing: -1.5px; }
.pkg-sub     { font-size: 15px; color: #57534e; line-height: 1.7; max-width: 540px; margin: 0 auto; }

.pkg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 64px; }
@media (max-width: 900px) { .pkg-grid { grid-template-columns: 1fr; max-width: 520px; margin-inline: auto; } }

/* ── BAG CARD ── */
.pkg-card {
  display: flex; flex-direction: column; gap: 40px; align-items: center;
}

/* ── BAG STAGE (illustration area) ── */
.pkg-bag-stage { position: relative; display: flex; flex-direction: column; align-items: center; }

.pkg-shadow {
  position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
  border-radius: 50%; filter: blur(20px);
}
.v60-shadow { width: 200px; height: 28px; background: rgba(212,160,96,0.3); }
.fam-shadow { width: 240px; height: 32px; background: rgba(74,124,89,0.3); }

.pkg-bag { width: 240px; animation: bag-float 5s ease-in-out infinite; }
.fam-bag  { animation-delay: -2.5s; }

/* ── TIN-TIE SEAL ── */
.pkg-seal { padding: 6px 10px 0; }
.tin-tie-wrap { display: flex; justify-content: center; gap: 18px; margin-bottom: 4px; }
.tin-tie {
  width: 32px; height: 10px; border-radius: 2px;
  background: linear-gradient(180deg, #888 0%, #555 100%);
  border: 1px solid rgba(255,255,255,0.15);
  position: relative;
}
.tin-tie::after {
  content: ''; position: absolute; inset: 2px 4px;
  background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%);
  border-radius: 1px;
}
.fam-tie {
  background: linear-gradient(180deg, #5a7a5a 0%, #3a5a3a 100%);
}

.seal-crimp {
  height: 36px; border-radius: 2px 2px 0 0;
  display: flex; align-items: center; justify-content: center; gap: 2.5px; padding: 0 8px;
}
.v60-seal .seal-crimp { background: linear-gradient(180deg, #1a0a04 0%, #2a1208 100%); }
.fam-crimp           { background: linear-gradient(180deg, #1a2e1a 0%, #243824 100%); }
.crimp-rib { display: block; width: 2px; height: 22px; background: rgba(255,255,255,0.18); border-radius: 1px; }
.fam-rib   { background: rgba(255,255,255,0.15); }

/* ── BAG BODY ── */
.pkg-body { padding: 14px 18px 20px; min-height: 420px; position: relative; overflow: hidden; }

.v60-body {
  background: linear-gradient(175deg, #1e0c06 0%, #0d0603 60%, #180a02 100%);
  border-left: 1px solid rgba(212,160,96,0.12);
  border-right: 1px solid rgba(0,0,0,0.4);
}
.fam-body {
  background: linear-gradient(175deg, #243824 0%, #162816 60%, #1a2e1a 100%);
  border-left: 1px solid rgba(74,124,89,0.15);
  border-right: 1px solid rgba(0,0,0,0.4);
}

.matte-texture {
  position: absolute; inset: 0; pointer-events: none;
  background:
    repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.018) 14px, rgba(255,255,255,0.018) 15px),
    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.008) 20px, rgba(255,255,255,0.008) 21px);
}
.kraft-texture {
  position: absolute; inset: 0; pointer-events: none;
  background:
    repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(74,124,89,0.04) 12px, rgba(74,124,89,0.04) 13px),
    repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.015) 18px, rgba(255,255,255,0.015) 19px);
}

.edge-shine-l {
  position: absolute; left: 0; top: 0; bottom: 0; width: 20px; pointer-events: none;
  background: linear-gradient(90deg, rgba(255,255,255,0.07), transparent);
}
.edge-shine-r {
  position: absolute; right: 0; top: 0; bottom: 0; width: 12px; pointer-events: none;
  background: linear-gradient(270deg, rgba(0,0,0,0.25), transparent);
}
.fam-shine-l { background: linear-gradient(90deg, rgba(74,124,89,0.1), transparent); }
.fam-shine-r { background: linear-gradient(270deg, rgba(0,0,0,0.3), transparent); }

/* ── VALVE ── */
.pkg-valve { display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; position: relative; z-index: 2; }
.valve-outer {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(0,0,0,0.4); border: 1.5px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
}
.valve-inner {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
}
.valve-pin { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.25); }
.fam-valve-outer { border-color: rgba(74,124,89,0.3); }
.fam-valve-inner { border-color: rgba(74,124,89,0.2); }
.fam-pin         { background: rgba(74,124,89,0.4); }

/* ── LOGO ZONE ── */
.pkg-logo-zone { text-align: center; margin-bottom: 8px; position: relative; z-index: 2; }
.logo-mark { font-size: 26px; font-weight: 900; color: #fdf6ec; letter-spacing: -1px; line-height: 1; }
.logo-mark em { font-style: normal; color: #d4a060; }
.logo-sub  { font-size: 9px; font-weight: 800; letter-spacing: 0.22em; color: rgba(255,255,255,0.45); text-transform: uppercase; }
.logo-rule { height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0 0; }
.fam-logo  .logo-mark em { color: #6ab880; }
.fam-logo  .logo-sub     { color: rgba(106,184,128,0.5); }
.fam-logo  .logo-rule    { background: rgba(74,124,89,0.25); }

/* ── NAME BANNER ── */
.pkg-name-banner { text-align: center; margin-bottom: 6px; position: relative; z-index: 2; }
.banner-line-top  { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); text-transform: uppercase; }
.banner-line-main { font-size: 30px; font-weight: 900; color: #fdf6ec; letter-spacing: -0.5px; line-height: 1; }
.banner-line-sub  { font-size: 8px; font-weight: 700; letter-spacing: 0.18em; color: #d4a060; text-transform: uppercase; margin-top: 2px; }
.v60-banner .banner-line-main { color: #fdf6ec; }
.fam-banner .banner-line-main { color: #e8f5ea; }
.fam-banner .banner-line-sub  { color: #6ab880; }

/* ── DRIP ART (SVG illustrations) ── */
.drip-art { margin: 4px auto 8px; position: relative; z-index: 2; }
.v60-drip { width: 120px; height: 80px; }
.fam-drip  { width: 120px; height: 80px; }

/* ── TASTING NOTES ── */
.pkg-notes-strip { position: relative; z-index: 2; margin-bottom: 10px; }
.notes-label { font-size: 8px; font-weight: 700; letter-spacing: 0.18em; color: rgba(255,255,255,0.35); text-align: center; margin-bottom: 6px; }
.fam-nl      { color: rgba(106,184,128,0.45); }
.notes-pills { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.note-pill   { padding: 3px 9px; border-radius: 20px; font-size: 9px; font-weight: 700; }
.v60-pill    { background: rgba(212,160,96,0.18); border: 1px solid rgba(212,160,96,0.35); color: #d4a060; }
.fam-pill    { background: rgba(74,124,89,0.2); border: 1px solid rgba(74,124,89,0.4); color: #6ab880; }

/* ── META GRID ── */
.pkg-meta-grid { display: flex; flex-direction: column; gap: 3px; margin-bottom: 12px; position: relative; z-index: 2; }
.pmg-item { display: flex; justify-content: space-between; font-size: 9px; }
.pmg-k { color: rgba(255,255,255,0.35); }
.pmg-v { color: rgba(255,255,255,0.8); font-weight: 700; }
.fam-k { color: rgba(106,184,128,0.45); }
.fam-v { color: rgba(232,245,234,0.85); }

/* ── BOTTOM STRIP ── */
.pkg-bottom-strip {
  display: flex; align-items: center; justify-content: space-between;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 10px; position: relative; z-index: 2;
}
.strip-weight { font-size: 16px; font-weight: 900; color: #fdf6ec; }
.strip-cert   { font-size: 10px; font-weight: 800; background: rgba(212,160,96,0.18); border: 1px solid rgba(212,160,96,0.35); color: #d4a060; border-radius: 20px; padding: 3px 10px; }
.strip-eco    { font-size: 9px; color: rgba(255,255,255,0.4); }
.v60-strip    {}
.fam-strip .strip-weight { color: #e8f5ea; }
.fam-strip .strip-cert   { background: rgba(74,124,89,0.2); border-color: rgba(74,124,89,0.4); color: #6ab880; }
.fam-strip .strip-eco    { color: rgba(106,184,128,0.45); }
.fam-wt      { color: #e8f5ea !important; }

/* ── GUSSET ── */
.pkg-gusset { height: 22px; border-radius: 0 0 8px 8px; }
.v60-gusset { background: linear-gradient(180deg, #1a0a04 0%, #0a0402 100%); }
.fam-gusset { background: linear-gradient(180deg, #162816 0%, #0e1e0e 100%); }

/* ── CARD INFO ── */
.pkg-info { width: 100%; }
.pkg-collection-tag {
  display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 0.14em;
  padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
}
.v60-tag { background: rgba(212,160,96,0.12); border: 1px solid rgba(212,160,96,0.3); color: #d4a060; }
.fam-tag { background: rgba(74,124,89,0.12); border: 1px solid rgba(74,124,89,0.35); color: #6ab880; }

.pkg-product-title { font-size: 24px; font-weight: 900; color: #fdf6ec; margin: 0 0 10px; letter-spacing: -0.5px; }
.pkg-product-desc  { font-size: 13px; color: #57534e; line-height: 1.7; margin: 0 0 20px; }

.pkg-specs-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
.pkg-spec      { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #78716c; }
.ps-icon       { font-size: 14px; width: 20px; text-align: center; flex-shrink: 0; }

.pkg-price-row  { display: flex; align-items: baseline; gap: 10px; margin-bottom: 18px; }
.pkg-price      { font-size: 34px; font-weight: 900; color: #fdf6ec; letter-spacing: -1px; }
.fam-price      { color: #e8f5ea; }
.pkg-price-note { font-size: 12px; color: #44403c; }

.pkg-cta {
  display: flex; align-items: center; gap: 10px; justify-content: center;
  width: 100%; padding: 15px 24px; border: none; border-radius: 12px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: all 0.2s;
}
.pkg-cta svg { width: 18px; height: 18px; flex-shrink: 0; }
.v60-cta {
  background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff;
  box-shadow: 0 8px 28px rgba(200,129,58,0.4);
}
.v60-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(200,129,58,0.6); }
.fam-cta {
  background: linear-gradient(135deg, #2d6a42, #4a7c59); color: #fff;
  box-shadow: 0 8px 28px rgba(45,106,66,0.4);
}
.fam-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(45,106,66,0.6); }

/* ── VALUE STRIP ── */
.pkg-value-strip {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0;
  border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;
  background: rgba(255,255,255,0.025); padding: 18px 24px;
}
.pvs-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #57534e; padding: 6px 20px; }
.pvs-icon { font-size: 18px; }
.pvs-div  { width: 1px; height: 28px; background: rgba(255,255,255,0.07); }
@media (max-width: 768px) { .pvs-div { display: none; } .pvs-item { padding: 6px 12px; } }
</style>