<script setup lang="ts">
import CupSvg from '../../components/CupSvg.vue'

const cups = [
  {
    id: 'sm', size: 'sm' as const,
    label: 'Short', badge: 'S', oz: '8 oz', ml: '240 ml', price: 'AED 12',
    tagline: 'The quick kick',
    desc: 'Perfect for a focused espresso ritual or a sharp morning boost.',
    drinks: ['Single Espresso', 'Ristretto', 'Macchiato', 'Cortado'],
    accent: '#a07838',
  },
  {
    id: 'md', size: 'md' as const,
    label: 'Medium', badge: 'M', oz: '12 oz', ml: '355 ml', price: 'AED 16',
    tagline: 'The sweet spot',
    desc: 'Our best-loved size — balanced strength and creaminess in every sip.',
    drinks: ['Flat White', 'Cappuccino', 'Latte', 'Americano'],
    accent: '#d4a060',
    popular: true,
  },
  {
    id: 'lg', size: 'lg' as const,
    label: 'Large', badge: 'L', oz: '16 oz', ml: '473 ml', price: 'AED 20',
    tagline: 'The full experience',
    desc: 'For the devoted coffee lover who never wants the moment to end.',
    drinks: ['Iced Latte', 'Cold Brew', 'Frappé', 'Matcha Latte'],
    accent: '#c8813a',
  },
]

const specs = [
  { icon: '♻️', title: 'Eco-Friendly',  sub: '100% compostable lining' },
  { icon: '🌡️', title: 'Double-Walled', sub: 'Stays hot for 60 min'   },
  { icon: '☕', title: 'Premium Blend', sub: 'Single-origin Arabica'   },
  { icon: '🏆', title: 'Award-Winning', sub: 'Best Coffee Dubai 2025'  },
]
</script>

<template>
  <div class="showcase">

    <!-- ── Hero ──────────────────────────────────────── -->
    <header class="hero">
      <div class="hero-content">
        <span class="hero-pill">✦ Cup Collection 2026</span>
        <h1 class="hero-title">Crafted for<br><em>Every Moment</em></h1>
        <p class="hero-sub">
          The 4ever Coffee signature cup — designed to carry our premium blends in style.
        </p>
      </div>
      <div class="hero-brand">
        <div class="brand-ring">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <circle cx="50" cy="50" r="46" fill="rgba(212,160,96,0.08)" stroke="#d4a060" stroke-width="2.5"/>
            <!-- "4" matching hand-drawn logo -->
            <line x1="40" y1="24" x2="34" y2="55" stroke="#d4a060" stroke-width="5.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="68" y2="55" stroke="#d4a060" stroke-width="5.5" stroke-linecap="round"/>
            <line x1="62" y1="24" x2="62" y2="76" stroke="#d4a060" stroke-width="5.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="brand-name">
          <span>4<em>ever</em></span>
          <span class="brand-sub">COFFEE</span>
        </div>
      </div>
    </header>

    <!-- ── Cup cards ─────────────────────────────────── -->
    <section class="cups-grid">
      <article
        v-for="cup in cups"
        :key="cup.id"
        class="cup-card"
        :class="{ 'cup-card--star': cup.popular }"
      >
        <div v-if="cup.popular" class="star-ribbon">⭐ Most Popular</div>

        <!-- Stage — all cups sit on the same baseline -->
        <div class="stage">
          <div class="stage-glow" :style="{ background: `radial-gradient(ellipse at 50% 100%, ${cup.accent}28 0%, transparent 68%)` }"/>
          <CupSvg :size="cup.size" />
        </div>

        <!-- Info -->
        <div class="cup-info">
          <div class="info-top">
            <span class="size-chip">{{ cup.badge }}</span>
            <div class="name-block">
              <span class="cup-label">{{ cup.label }}</span>
              <span class="cup-tagline">{{ cup.tagline }}</span>
            </div>
            <span class="cup-price">{{ cup.price }}</span>
          </div>

          <div class="vol-row">
            <span class="vol-pill">{{ cup.oz }}</span>
            <span class="vol-sep">·</span>
            <span class="vol-pill">{{ cup.ml }}</span>
          </div>

          <p class="cup-desc">{{ cup.desc }}</p>

          <div class="drinks-label">Popular drinks</div>
          <ul class="drinks-list">
            <li v-for="d in cup.drinks" :key="d">{{ d }}</li>
          </ul>

          <button
            class="order-btn"
            :class="{ 'order-btn--fill': cup.popular }"
            :style="!cup.popular ? { borderColor: cup.accent, color: cup.accent } : {}"
          >
            Order {{ cup.label }}
          </button>
        </div>
      </article>
    </section>

    <!-- ── Size comparison ruler ───────────────────── -->
    <div class="comparison">
      <div class="comp-title">Size at a glance</div>
      <div class="comp-bars">
        <div v-for="cup in cups" :key="cup.id" class="comp-bar-wrap">
          <div class="comp-bar"
               :style="{ height: cup.size === 'sm' ? '48px' : cup.size === 'md' ? '72px' : '96px',
                         background: cup.size === 'md' ? '#d4a060' : '#e8d4b0' }"/>
          <span class="comp-lbl">{{ cup.badge }}</span>
          <span class="comp-vol">{{ cup.oz }}</span>
        </div>
      </div>
    </div>

    <!-- ── Spec strip ─────────────────────────────── -->
    <div class="spec-strip">
      <template v-for="(s, i) in specs" :key="s.title">
        <div class="spec-item">
          <span class="spec-icon">{{ s.icon }}</span>
          <strong class="spec-title">{{ s.title }}</strong>
          <span class="spec-sub">{{ s.sub }}</span>
        </div>
        <div v-if="i < specs.length - 1" class="spec-sep"/>
      </template>
    </div>

  </div>
</template>

<style scoped>
.showcase { display: flex; flex-direction: column; gap: 24px; }

/* ── Hero ──────────── */
.hero {
  background: linear-gradient(130deg, #1a0a04 0%, #2e1608 55%, #1a0a04 100%);
  border-radius: 22px; padding: 44px 42px;
  display: flex; align-items: center; justify-content: space-between; gap: 28px;
  border: 1px solid rgba(212,160,96,0.18);
  box-shadow: 0 8px 48px rgba(0,0,0,0.38);
  position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; right: 280px; top: -80px;
  width: 320px; height: 320px; border-radius: 50%;
  border: 50px solid rgba(212,160,96,0.04); pointer-events: none;
}
.hero-pill {
  display: inline-block; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.18em;
  color: #d4a060; background: rgba(212,160,96,0.12);
  border: 1px solid rgba(212,160,96,0.25);
  border-radius: 20px; padding: 5px 16px; margin-bottom: 14px;
}
.hero-title {
  font-size: clamp(30px, 3.2vw, 44px); font-weight: 900; color: #fdf6ec;
  margin: 0 0 12px; line-height: 1.1; letter-spacing: -1.5px;
}
.hero-title em { font-style: normal; color: #d4a060; }
.hero-sub { font-size: 14px; color: rgba(253,246,236,0.55); margin: 0; max-width: 380px; line-height: 1.65; }

.hero-brand { display: flex; flex-direction: column; align-items: center; gap: 10px; flex-shrink: 0; }
.brand-ring {
  padding: 10px; border-radius: 50%;
  background: rgba(212,160,96,0.06); border: 1px solid rgba(212,160,96,0.15);
}
.brand-name { display: flex; flex-direction: column; align-items: center; }
.brand-name span:first-child { font-size: 22px; font-weight: 900; color: #fdf6ec; }
.brand-name em { font-style: normal; color: #d4a060; }
.brand-sub { font-size: 9px; font-weight: 700; color: rgba(212,160,96,0.65); letter-spacing: 0.28em; text-transform: uppercase; margin-top: 1px; }

/* ── Cup grid ──────── */
.cups-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
}
@media (max-width: 860px) { .cups-grid { grid-template-columns: 1fr; } }

.cup-card {
  background: #fff; border-radius: 22px; border: 1.5px solid #ece7e2;
  padding: 40px 26px 28px; position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 0;
  box-shadow: 0 2px 14px rgba(0,0,0,0.05);
  transition: box-shadow 0.22s, transform 0.22s;
}
.cup-card:hover { box-shadow: 0 14px 44px rgba(0,0,0,0.12); transform: translateY(-6px); }
.cup-card--star { border-color: #d4a060; box-shadow: 0 4px 28px rgba(212,160,96,0.2); }

.star-ribbon {
  position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(120deg, #c8813a, #d4a060);
  color: #fff; font-size: 11px; font-weight: 800;
  border-radius: 20px; padding: 5px 18px; white-space: nowrap;
  box-shadow: 0 4px 14px rgba(200,129,58,0.42);
}

/* Stage: all cups on same baseline */
.stage {
  position: relative; min-height: 310px;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 8px; width: 100%;
}
.stage-glow {
  position: absolute; width: 100%; height: 80px; bottom: 0;
  border-radius: 50%; pointer-events: none;
}

/* Cup info */
.cup-info {
  width: 100%; margin-top: 18px;
  border-top: 1px solid #f0ebe4; padding-top: 20px;
  display: flex; flex-direction: column; gap: 10px;
}
.info-top { display: flex; align-items: flex-start; gap: 12px; }
.size-chip {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: #1a0a04; color: #d4a060;
  font-size: 16px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}
.name-block { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.cup-label   { font-size: 19px; font-weight: 900; color: #1c1917; line-height: 1.15; }
.cup-tagline { font-size: 11px; color: #a8a29e; font-style: italic; }
.cup-price   { font-size: 20px; font-weight: 900; color: #d4a060; }

.vol-row { display: flex; align-items: center; gap: 8px; }
.vol-pill { font-size: 12px; font-weight: 700; color: #78716c; background: #faf7f2; border-radius: 20px; padding: 3px 11px; }
.vol-sep  { color: #d4cfc8; font-size: 16px; }

.cup-desc { font-size: 12.5px; color: #78716c; line-height: 1.6; margin: 0; }

.drinks-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #b0a8a0; }
.drinks-list  { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 5px; }
.drinks-list li {
  font-size: 12.5px; color: #57534e; padding-left: 18px; position: relative;
}
.drinks-list li::before { content: '☕'; position: absolute; left: 0; font-size: 10px; top: 1px; }

.order-btn {
  margin-top: 6px; width: 100%; padding: 13px; border-radius: 11px;
  font-size: 13.5px; font-weight: 700; cursor: pointer;
  border: 2px solid; background: transparent;
  transition: all 0.18s; font-family: inherit; letter-spacing: 0.03em;
}
.order-btn--fill { background: linear-gradient(120deg,#c8813a,#d4a060) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 4px 16px rgba(200,129,58,0.35); }
.order-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

/* ── Size comparison ── */
.comparison {
  background: #fff; border-radius: 16px; border: 1px solid #f0ebe4;
  padding: 24px 32px; box-shadow: 0 1px 6px rgba(0,0,0,0.04);
}
.comp-title { font-size: 13px; font-weight: 700; color: #78716c; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; }
.comp-bars { display: flex; align-items: flex-end; gap: 20px; height: 110px; }
.comp-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.comp-bar { width: 48px; border-radius: 6px 6px 0 0; transition: height 0.4s; }
.comp-lbl { font-size: 13px; font-weight: 900; color: #1c1917; }
.comp-vol { font-size: 10px; color: #a8a29e; font-weight: 600; }

/* ── Spec strip ──────── */
.spec-strip {
  background: #fff; border-radius: 16px; border: 1px solid #f0ebe4;
  padding: 24px 36px; box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  display: flex; align-items: center; justify-content: space-around; gap: 0; flex-wrap: wrap;
}
.spec-item { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; padding: 8px 24px; }
.spec-icon  { font-size: 26px; }
.spec-title { font-size: 13px; font-weight: 800; color: #1c1917; }
.spec-sub   { font-size: 11px; color: #a8a29e; }
.spec-sep   { width: 1px; height: 48px; background: #f0ebe4; flex-shrink: 0; }
</style>