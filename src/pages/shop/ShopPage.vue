<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '../../stores/products'
import { useCartStore } from '../../stores/cart'

const store = useProductsStore()
const cart = useCartStore()

const search   = ref('')
const category = ref('All')
const sort     = ref('popular')
const cats     = ['All', 'Hot Coffee', 'Cold Coffee', 'Specialty', 'Sweets & Cakes']
const added    = ref<Set<number>>(new Set())

const filtered = computed(() => {
  let list = store.products
    .filter(p => category.value === 'All' || p.category === category.value)
    .filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()) ||
                 p.scentType.toLowerCase().includes(search.value.toLowerCase()))
  if (sort.value === 'popular')    list = [...list].sort((a, b) => b.reviews - a.reviews)
  if (sort.value === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sort.value === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating)
  return list
})

function pctOff(p: typeof store.products[0]) {
  return p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
}

function addToCart(p: typeof store.products[0]) {
  cart.addToCart(p)
  added.value.add(p.id)
  setTimeout(() => added.value.delete(p.id), 1400)
}
</script>

<template>
  <div class="shop-page">

    <!-- ── BANNER ── -->
    <div class="banner">
      <div class="banner-bg">
        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&fit=crop&auto=format&q=60" alt="" class="banner-bg-img"/>
        <div class="banner-overlay"></div>
      </div>
      <div class="banner-inner">
        <p class="banner-eyebrow">Full Menu</p>
        <h1 class="banner-title">Order Your Perfect Cup</h1>
        <p class="banner-sub">{{ store.products.length }} items — coffee, pastries &amp; London sweets</p>
      </div>
    </div>

    <div class="page-inner">

      <!-- ── STICKY FILTERS ── -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="search" placeholder="Search…" class="search-input"/>
          <button v-if="search" class="search-clear" @click="search = ''">✕</button>
        </div>

        <div class="cat-chips">
          <button v-for="c in cats" :key="c"
            class="chip" :class="{ active: category === c }"
            @click="category = c">{{ c }}</button>
        </div>

        <select v-model="sort" class="sort-select">
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      <!-- ── RESULTS META ── -->
      <p class="results-meta">
        <strong>{{ filtered.length }}</strong> {{ filtered.length === 1 ? 'item' : 'items' }}
        <span v-if="category !== 'All'"> in <em>{{ category }}</em></span>
        <span v-if="search"> matching "<em>{{ search }}</em>"</span>
      </p>

      <!-- ── PRODUCT GRID ── -->
      <div class="products-grid">

        <article v-for="p in filtered" :key="p.id" class="card">

          <!-- Photo -->
          <div class="card-img">
            <div class="card-img-bg" :style="{ background: p.gradient }"></div>
            <img
              :src="p.image"
              :alt="p.name"
              class="card-photo"
              @error="(e) => (e.target as HTMLImageElement).style.display='none'"
            />
            <div class="card-img-fade"></div>

            <!-- top-left: category pill -->
            <span class="cat-pill">{{ p.category }}</span>

            <!-- top-right: badges -->
            <div class="badge-group">
              <span v-if="p.isNew"         class="badge badge-new">New</span>
              <span v-if="p.originalPrice" class="badge badge-sale">–{{ pctOff(p) }}%</span>
            </div>

            <!-- bottom-left: low-stock / sold-out -->
            <span v-if="p.stock === 0"                              class="stock-tag out">Sold Out</span>
            <span v-else-if="p.stock <= p.lowStockThreshold"         class="stock-tag low">Only {{ p.stock }} left</span>
          </div>

          <!-- Body -->
          <div class="card-body">

            <!-- Name + rating row -->
            <div class="card-top">
              <h3 class="card-name">{{ p.name }}</h3>
              <div class="card-rating">
                <svg viewBox="0 0 20 20" fill="#f59e0b" width="13" height="13"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span class="rating-val">{{ p.rating.toFixed(1) }}</span>
                <span class="rating-count">{{ p.reviews >= 1000 ? (p.reviews / 1000).toFixed(1) + 'k' : p.reviews }}</span>
              </div>
            </div>

            <!-- Flavour profile -->
            <p class="card-flavor">{{ p.scentType }}</p>

            <!-- Description -->
            <p class="card-desc">{{ p.description.slice(0, 88) }}…</p>

            <!-- Footer: price + CTA -->
            <div class="card-footer">
              <div class="price-wrap">
                <span class="price">£{{ p.price.toFixed(2) }}</span>
                <span v-if="p.originalPrice" class="price-orig">£{{ p.originalPrice.toFixed(2) }}</span>
              </div>
              <button
                class="order-btn"
                :class="{ added: added.has(p.id), disabled: p.stock === 0 }"
                @click="addToCart(p)"
                :disabled="p.stock === 0"
              >
                <span v-if="p.stock === 0">Unavailable</span>
                <span v-else-if="added.has(p.id)">✓ Added</span>
                <span v-else>Add to Order</span>
              </button>
            </div>

          </div>
        </article>

        <div v-if="filtered.length === 0" class="empty-state">
          <div class="empty-icon">☕</div>
          <p class="empty-title">Nothing found</p>
          <p class="empty-sub">Try a different category or clear your search.</p>
          <button class="empty-reset" @click="search = ''; category = 'All'">Reset filters</button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── GLOBAL ──────────────────────────────────────────────── */
.shop-page { display: flex; flex-direction: column; background: #f7f4f0; min-height: 100vh; }

/* ── BANNER ──────────────────────────────────────────────── */
.banner { position: relative; height: 300px; display: flex; align-items: flex-end; overflow: hidden; }
.banner-bg { position: absolute; inset: 0; }
.banner-bg-img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; }
.banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,4,2,0.88) 0%, rgba(10,4,2,0.55) 55%, rgba(10,4,2,0.2) 100%); }
.banner-inner { position: relative; z-index: 2; max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 28px 36px; }
.banner-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 10px; }
.banner-title   { font-size: clamp(30px, 5vw, 48px); font-weight: 900; color: #fff; margin: 0 0 8px; letter-spacing: -1.5px; line-height: 1.05; }
.banner-sub     { font-size: 15px; color: rgba(255,255,255,0.6); margin: 0; }

/* ── PAGE INNER ──────────────────────────────────────────── */
.page-inner { max-width: 1200px; margin: 0 auto; width: 100%; padding: 28px 24px 72px; }

/* ── FILTERS ─────────────────────────────────────────────── */
.filters-bar {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  background: #fff; border-radius: 16px; padding: 14px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 18px;
  position: sticky; top: 64px; z-index: 10;
}
.search-wrap { display: flex; align-items: center; gap: 8px; background: #f7f4f0; border-radius: 10px; padding: 9px 14px; min-width: 180px; }
.search-wrap svg { width: 15px; height: 15px; color: #a8a29e; flex-shrink: 0; }
.search-input { border: none; outline: none; font-size: 14px; background: none; width: 160px; color: #1c1917; }
.search-clear { background: none; border: none; cursor: pointer; color: #a8a29e; font-size: 13px; padding: 0; line-height: 1; }
.cat-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 8px 15px; border-radius: 20px; border: 1.5px solid #e7e5e4; background: transparent; font-size: 13px; font-weight: 500; cursor: pointer; color: #57534e; transition: all 0.15s; white-space: nowrap; }
.chip:hover { border-color: #c8813a; color: #c8813a; }
.chip.active { background: #1c1917; color: #fff; border-color: #1c1917; font-weight: 600; }
.sort-select { padding: 9px 14px; border: 1.5px solid #e7e5e4; border-radius: 10px; font-size: 13px; background: transparent; outline: none; margin-left: auto; cursor: pointer; color: #57534e; }

/* ── RESULTS META ────────────────────────────────────────── */
.results-meta { font-size: 13px; color: #a8a29e; margin: 0 0 22px 2px; }
.results-meta strong { color: #1c1917; }
.results-meta em { font-style: normal; color: #c8813a; }

/* ── GRID ────────────────────────────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
@media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 780px)  { .products-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; } }
@media (max-width: 480px)  { .products-grid { grid-template-columns: 1fr; } }

/* ── CARD ─────────────────────────────────────────────────── */
.card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  transition: transform 0.28s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.28s ease;
  cursor: default;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.1);
}

/* ── CARD IMAGE ──────────────────────────────────────────── */
.card-img { position: relative; height: 220px; overflow: hidden; flex-shrink: 0; }
.card-img-bg { position: absolute; inset: 0; }
.card-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  z-index: 1;
  transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
}
.card:hover .card-photo { transform: scale(1.06); }

/* gradient fade at bottom of photo */
.card-img-fade {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 70px;
  background: linear-gradient(to top, rgba(0,0,0,0.35), transparent);
  z-index: 2;
  pointer-events: none;
}

/* category pill — top left */
.cat-pill {
  position: absolute; top: 12px; left: 12px; z-index: 3;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  background: rgba(0,0,0,0.52); backdrop-filter: blur(6px);
  color: #fff; border-radius: 20px; padding: 4px 10px;
  border: 1px solid rgba(255,255,255,0.15);
}

/* badges — top right */
.badge-group { position: absolute; top: 12px; right: 12px; z-index: 3; display: flex; flex-direction: column; gap: 5px; align-items: flex-end; }
.badge { font-size: 10px; font-weight: 800; border-radius: 6px; padding: 4px 8px; letter-spacing: 0.04em; }
.badge-new  { background: #dcfce7; color: #15803d; }
.badge-sale { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* stock tags — bottom */
.stock-tag {
  position: absolute; bottom: 12px; left: 12px; z-index: 3;
  font-size: 10px; font-weight: 700; border-radius: 6px; padding: 4px 9px;
  backdrop-filter: blur(6px);
}
.stock-tag.out { background: rgba(55,55,55,0.85); color: #fff; }
.stock-tag.low { background: rgba(245,158,11,0.9); color: #fff; }

/* ── CARD BODY ───────────────────────────────────────────── */
.card-body { padding: 16px 18px 20px; display: flex; flex-direction: column; flex: 1; }

.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.card-name { font-size: 16px; font-weight: 800; color: #1c1917; line-height: 1.25; flex: 1; margin: 0; }

.card-rating { display: flex; align-items: center; gap: 3px; flex-shrink: 0; margin-top: 2px; }
.rating-val   { font-size: 12px; font-weight: 700; color: #1c1917; }
.rating-count { font-size: 11px; color: #a8a29e; }

.card-flavor { font-size: 12px; color: #a8a29e; margin: 0 0 8px; font-style: italic; }
.card-desc   { font-size: 12.5px; color: #6b6762; line-height: 1.6; margin: 0 0 16px; flex: 1;
               display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* ── CARD FOOTER ─────────────────────────────────────────── */
.card-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; }

.price-wrap { display: flex; align-items: baseline; gap: 6px; }
.price      { font-size: 20px; font-weight: 900; color: #1c1917; letter-spacing: -0.5px; }
.price-orig { font-size: 13px; color: #a8a29e; text-decoration: line-through; }

.order-btn {
  background: #1c1917;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
.order-btn:hover:not(:disabled) { background: #c8813a; transform: scale(1.03); }
.order-btn.added  { background: #16a34a; }
.order-btn.disabled, .order-btn:disabled { background: #e7e5e4; color: #a8a29e; cursor: not-allowed; transform: none; }

/* ── EMPTY STATE ─────────────────────────────────────────── */
.empty-state { grid-column: 1/-1; text-align: center; padding: 80px 24px; }
.empty-icon  { font-size: 52px; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 800; color: #1c1917; margin: 0 0 8px; }
.empty-sub   { font-size: 14px; color: #a8a29e; margin: 0 0 24px; }
.empty-reset { background: #1c1917; color: #fff; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.empty-reset:hover { background: #c8813a; }
</style>
