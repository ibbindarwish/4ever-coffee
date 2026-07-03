<script setup lang="ts">
import { ref, reactive } from 'vue'
import BagDesignSvg from '../../components/BagDesignSvg.vue'

// ── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  {
    name: 'Matte Black',
    bagColor: '#1e1e1e', bagDark: '#080808', bagLight: '#3e3e3e',
    accentColor: '#d4a060', labelBg: '#141414', labelText: '#fdf6ec', logoColor: '#d4a060',
  },
  {
    name: 'Kraft Brown',
    bagColor: '#b8844a', bagDark: '#7a5230', bagLight: '#d4a86a',
    accentColor: '#2e1608', labelBg: '#f5e8d2', labelText: '#2e1608', logoColor: '#2e1608',
  },
  {
    name: 'Forest Green',
    bagColor: '#2d5a3d', bagDark: '#182f22', bagLight: '#4a7a58',
    accentColor: '#d4a060', labelBg: '#1a3526', labelText: '#fdf6ec', logoColor: '#d4a060',
  },
  {
    name: 'Navy Blue',
    bagColor: '#1b2d5c', bagDark: '#0d1a3a', bagLight: '#2e4a82',
    accentColor: '#d4a060', labelBg: '#111e40', labelText: '#fdf6ec', logoColor: '#d4a060',
  },
  {
    name: 'Burgundy',
    bagColor: '#5c1a2c', bagDark: '#380f1c', bagLight: '#7e2e42',
    accentColor: '#e8d060', labelBg: '#3a1020', labelText: '#fdf6ec', logoColor: '#e8d060',
  },
  {
    name: 'Ivory White',
    bagColor: '#f0ece4', bagDark: '#c4bdb0', bagLight: '#ffffff',
    accentColor: '#2e1608', labelBg: '#faf8f3', labelText: '#2e1608', logoColor: '#2e1608',
  },
  {
    name: 'Midnight Gold',
    bagColor: '#1a1506', bagDark: '#0a0800', bagLight: '#2e2510',
    accentColor: '#e8c840', labelBg: '#110e04', labelText: '#fdf6ec', logoColor: '#e8c840',
  },
  {
    name: 'Slate Grey',
    bagColor: '#3a3f48', bagDark: '#1e2228', bagLight: '#5a6070',
    accentColor: '#d4a060', labelBg: '#262b32', labelText: '#fdf6ec', logoColor: '#d4a060',
  },
]

const selectedPreset = ref(0)

const design = reactive({
  bagColor:    '#1e1e1e',
  bagDark:     '#080808',
  bagLight:    '#3e3e3e',
  accentColor: '#d4a060',
  labelBg:     '#141414',
  labelText:   '#fdf6ec',
  logoColor:   '#d4a060',
  brandName:   '4ever Coffee',
  productName: 'Ethiopian Blend',
  tagline:     'Single Origin · 100% Arabica',
  origin:      'Ethiopia',
  flavorNotes: 'Blueberry · Jasmine',
  roastLevel:  'Medium' as 'Light' | 'Medium' | 'Dark',
  weight:      '250g' as '250g' | '500g' | '1kg',
  score:       '88',
  showValve:   true,
  bagScale:    1.05,
  // front logo controls
  logoSize:   26,
  logoStroke: 3.5,
  // back-side typography (SVG units ≈ px at the viewBox scale)
  labelFontSize:  5.5,
  originFontSize: 13,
  scoreFontSize:  20,
  notesFontSize:  6,
  weightFontSize: 8,
})

function applyPreset(i: number) {
  selectedPreset.value = i
  const p = PRESETS[i]
  design.bagColor    = p.bagColor
  design.bagDark     = p.bagDark
  design.bagLight    = p.bagLight
  design.accentColor = p.accentColor
  design.labelBg     = p.labelBg
  design.labelText   = p.labelText
  design.logoColor   = p.logoColor
}

function resetDesign() {
  applyPreset(0)
  design.brandName   = '4ever Coffee'
  design.productName = 'Ethiopian Blend'
  design.tagline     = 'Single Origin · 100% Arabica'
  design.origin      = 'Ethiopia'
  design.flavorNotes = 'Blueberry · Jasmine'
  design.roastLevel  = 'Medium'
  design.weight      = '250g'
  design.score       = '88'
  design.showValve   = true
  design.bagScale    = 1.05
  design.logoSize       = 26
  design.logoStroke     = 3.5
  design.labelFontSize  = 5.5
  design.originFontSize = 13
  design.scoreFontSize  = 20
  design.notesFontSize  = 6
  design.weightFontSize = 8
}

function downloadSvg() {
  const el = document.querySelector('.preview-bag .bag-design-svg') as SVGElement | null
  if (!el) return
  const blob = new Blob([el.outerHTML], { type: 'image/svg+xml' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = `${design.brandName.replace(/\s+/g, '-')}-packaging.svg`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPng() {
  const el = document.querySelector('.preview-bag .bag-design-svg') as SVGElement | null
  if (!el) return
  const svgStr = new XMLSerializer().serializeToString(el)
  const img    = new Image()
  const SCALE  = 3
  img.onload = () => {
    const canvas  = document.createElement('canvas')
    canvas.width  = el.clientWidth  * SCALE
    canvas.height = el.clientHeight * SCALE
    const ctx = canvas.getContext('2d')!
    ctx.scale(SCALE, SCALE)
    ctx.drawImage(img, 0, 0)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob!)
      const a   = document.createElement('a')
      a.href = url
      a.download = `${design.brandName.replace(/\s+/g, '-')}-packaging.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr)
}

const roastLevels = ['Light', 'Medium', 'Dark'] as const
const weightOpts  = ['250g', '500g', '1kg']     as const
</script>

<template>
  <div class="pkg-page">

    <!-- ── Page Header ──────────────────────────────────────────── -->
    <header class="pkg-header">
      <div class="pkg-header-info">
        <span class="pkg-pill">✦ Design Studio</span>
        <h1 class="pkg-title">Packaging <em>Designer</em></h1>
        <p class="pkg-sub">Design professional coffee bags and bean pouches for your brand.</p>
      </div>
      <div class="pkg-header-actions">
        <button class="hdr-btn ghost" @click="resetDesign">↺ Reset</button>
        <button class="hdr-btn secondary" @click="downloadSvg">↓ SVG</button>
        <button class="hdr-btn primary" @click="downloadPng">↓ Export PNG</button>
      </div>
    </header>

    <!-- ── Main Designer Layout ─────────────────────────────────── -->
    <div class="designer-wrap">

      <!-- LEFT — Controls Panel ───────────────────────────────── -->
      <aside class="ctrl-panel">

        <!-- Finish Presets -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Bag Finish</div>
          <div class="presets-grid">
            <button
              v-for="(p, i) in PRESETS" :key="p.name"
              class="preset-btn"
              :class="{ active: selectedPreset === i }"
              @click="applyPreset(i)"
            >
              <span
                class="preset-swatch"
                :style="{ background: p.bagColor, outline: `2px solid ${p.accentColor}` }"
              />
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- Custom Colors -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Custom Colors</div>
          <div class="color-rows">
            <label class="color-row">
              <span>Bag Body</span>
              <span class="color-right">
                <input type="color" v-model="design.bagColor" class="color-swatch"/>
                <span class="color-val">{{ design.bagColor }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Bag Shadow</span>
              <span class="color-right">
                <input type="color" v-model="design.bagDark" class="color-swatch"/>
                <span class="color-val">{{ design.bagDark }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Bag Highlight</span>
              <span class="color-right">
                <input type="color" v-model="design.bagLight" class="color-swatch"/>
                <span class="color-val">{{ design.bagLight }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Accent</span>
              <span class="color-right">
                <input type="color" v-model="design.accentColor" class="color-swatch"/>
                <span class="color-val">{{ design.accentColor }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Label BG</span>
              <span class="color-right">
                <input type="color" v-model="design.labelBg" class="color-swatch"/>
                <span class="color-val">{{ design.labelBg }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Label Text</span>
              <span class="color-right">
                <input type="color" v-model="design.labelText" class="color-swatch"/>
                <span class="color-val">{{ design.labelText }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Logo Color</span>
              <span class="color-right">
                <input type="color" v-model="design.logoColor" class="color-swatch"/>
                <span class="color-val">{{ design.logoColor }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Brand & Product Text -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Brand &amp; Product</div>
          <div class="field-stack">
            <label class="field-row">
              <span class="field-label">Brand Name</span>
              <input
                v-model="design.brandName"
                type="text" class="field-input"
                maxlength="16" placeholder="4ever Coffee"
              />
            </label>
            <label class="field-row">
              <span class="field-label">Product Name</span>
              <input
                v-model="design.productName"
                type="text" class="field-input"
                maxlength="18" placeholder="Ethiopian Blend"
              />
            </label>
            <label class="field-row">
              <span class="field-label">Tagline</span>
              <input
                v-model="design.tagline"
                type="text" class="field-input"
                maxlength="30" placeholder="Single Origin · 100% Arabica"
              />
            </label>
            <label class="field-row">
              <span class="field-label">Origin</span>
              <input
                v-model="design.origin"
                type="text" class="field-input"
                maxlength="20" placeholder="Ethiopia"
              />
            </label>
            <label class="field-row">
              <span class="field-label">Flavor Notes</span>
              <input
                v-model="design.flavorNotes"
                type="text" class="field-input"
                maxlength="22" placeholder="Blueberry · Jasmine"
              />
            </label>
            <label class="field-row">
              <span class="field-label">Specialty Score (%)</span>
              <input
                v-model="design.score"
                type="number" class="field-input"
                min="0" max="100" placeholder="88"
              />
            </label>
          </div>
        </div>

        <!-- Front Logo -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Front Logo</div>
          <div class="field-stack">
            <div class="typo-row">
              <span class="typo-label">Logo size</span>
              <span class="typo-val">{{ design.logoSize }}</span>
            </div>
            <input type="range" v-model.number="design.logoSize"
                   min="8" max="56" step="1" class="typo-slider"/>

            <div class="typo-row">
              <span class="typo-label">Letter stroke</span>
              <span class="typo-val">{{ design.logoStroke }}</span>
            </div>
            <input type="range" v-model.number="design.logoStroke"
                   min="1" max="8" step="0.5" class="typo-slider"/>
          </div>
        </div>

        <!-- Back Label Typography -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Back Label Typography</div>
          <div class="field-stack">
            <div class="typo-row">
              <span class="typo-label">Country name</span>
              <span class="typo-val">{{ design.originFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.originFontSize"
                   min="7" max="22" step="0.5" class="typo-slider"/>

            <div class="typo-row">
              <span class="typo-label">Score number</span>
              <span class="typo-val">{{ design.scoreFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.scoreFontSize"
                   min="10" max="38" step="0.5" class="typo-slider"/>

            <div class="typo-row">
              <span class="typo-label">Flavor notes</span>
              <span class="typo-val">{{ design.notesFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.notesFontSize"
                   min="3.5" max="12" step="0.5" class="typo-slider"/>

            <div class="typo-row">
              <span class="typo-label">Section labels</span>
              <span class="typo-val">{{ design.labelFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.labelFontSize"
                   min="3" max="9" step="0.5" class="typo-slider"/>

            <div class="typo-row">
              <span class="typo-label">Weight badge</span>
              <span class="typo-val">{{ design.weightFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.weightFontSize"
                   min="4" max="14" step="0.5" class="typo-slider"/>
          </div>
        </div>

        <!-- Roast Level -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Roast Level</div>
          <div class="chip-row">
            <button
              v-for="r in roastLevels" :key="r"
              class="chip-btn"
              :class="{ active: design.roastLevel === r }"
              @click="design.roastLevel = r"
            >{{ r }}</button>
          </div>
        </div>

        <!-- Net Weight -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Net Weight</div>
          <div class="chip-row">
            <button
              v-for="w in weightOpts" :key="w"
              class="chip-btn"
              :class="{ active: design.weight === w }"
              @click="design.weight = w"
            >{{ w }}</button>
          </div>
        </div>

        <!-- Options -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Options</div>

          <div class="toggle-row">
            <span class="toggle-label">Degassing Valve</span>
            <button
              class="toggle"
              :class="{ on: design.showValve }"
              @click="design.showValve = !design.showValve"
              :aria-pressed="design.showValve"
            >
              <span class="toggle-thumb"/>
            </button>
          </div>
        </div>

      </aside>

      <!-- RIGHT — Live Preview ─────────────────────────────────── -->
      <main class="preview-panel">
        <div class="preview-card">

          <!-- ── Size control bar ── -->
          <div class="size-bar">
            <span class="size-bar-label">Size</span>
            <div class="size-btns">
              <button
                v-for="s in [{l:'S', v:0.7},{l:'M', v:1.05},{l:'L', v:1.4},{l:'XL', v:1.8}]"
                :key="s.l"
                class="size-btn"
                :class="{ active: Math.abs(design.bagScale - s.v) < 0.03 }"
                @click="design.bagScale = s.v"
              >{{ s.l }}</button>
            </div>
            <div class="size-slider-wrap">
              <span class="size-pct">{{ Math.round(design.bagScale * 100) }}%</span>
              <input
                type="range" v-model.number="design.bagScale"
                min="0.5" max="2.0" step="0.05"
                class="size-slider"
              />
            </div>
          </div>

          <div class="preview-bags-row">
            <div class="preview-bag-col">
              <span class="bag-side-tag">Front</span>
              <div class="preview-bag">
                <BagDesignSvg
                  :bagColor="design.bagColor"
                  :bagDark="design.bagDark"
                  :bagLight="design.bagLight"
                  :accentColor="design.accentColor"
                  :labelBg="design.labelBg"
                  :labelText="design.labelText"
                  :logoColor="design.logoColor"
                  :brandName="design.brandName"
                  :productName="design.productName"
                  :tagline="design.tagline"
                  :origin="design.origin"
                  :flavorNotes="design.flavorNotes"
                  :roastLevel="design.roastLevel"
                  :weight="design.weight"
                  :showValve="design.showValve"
                  :score="design.score"
                  :logoSize="design.logoSize"
                  :logoStroke="design.logoStroke"
                  :labelFontSize="design.labelFontSize"
                  :originFontSize="design.originFontSize"
                  :scoreFontSize="design.scoreFontSize"
                  :notesFontSize="design.notesFontSize"
                  :weightFontSize="design.weightFontSize"
                  side="front"
                  :scale="design.bagScale"
                />
              </div>
            </div>
            <div class="preview-bag-col">
              <span class="bag-side-tag">Back</span>
              <div class="preview-bag">
                <BagDesignSvg
                  :bagColor="design.bagColor"
                  :bagDark="design.bagDark"
                  :bagLight="design.bagLight"
                  :accentColor="design.accentColor"
                  :labelBg="design.labelBg"
                  :labelText="design.labelText"
                  :logoColor="design.logoColor"
                  :brandName="design.brandName"
                  :productName="design.productName"
                  :tagline="design.tagline"
                  :origin="design.origin"
                  :flavorNotes="design.flavorNotes"
                  :roastLevel="design.roastLevel"
                  :weight="design.weight"
                  :showValve="design.showValve"
                  :score="design.score"
                  :logoSize="design.logoSize"
                  :logoStroke="design.logoStroke"
                  :labelFontSize="design.labelFontSize"
                  :originFontSize="design.originFontSize"
                  :scoreFontSize="design.scoreFontSize"
                  :notesFontSize="design.notesFontSize"
                  :weightFontSize="design.weightFontSize"
                  side="back"
                  :scale="design.bagScale"
                />
              </div>
            </div>
          </div>

          <div class="preview-meta">
            <span class="preview-meta-chip">{{ design.weight }}</span>
            <span class="preview-meta-dot">·</span>
            <span class="preview-meta-chip">{{ design.roastLevel }} Roast</span>
            <span class="preview-meta-dot">·</span>
            <span class="preview-meta-chip">{{ design.origin }}</span>
          </div>
        </div>

        <!-- Spec summary strip -->
        <div class="spec-strip">
          <div class="spec-item">
            <span class="spec-icon">☕</span>
            <span class="spec-label">{{ design.brandName }}</span>
          </div>
          <div class="spec-sep"/>
          <div class="spec-item">
            <span class="spec-icon">🌍</span>
            <span class="spec-label">{{ design.origin }}</span>
          </div>
          <div class="spec-sep"/>
          <div class="spec-item">
            <span class="spec-icon">🔥</span>
            <span class="spec-label">{{ design.roastLevel }} Roast</span>
          </div>
          <div class="spec-sep"/>
          <div class="spec-item">
            <span class="spec-icon">⚖️</span>
            <span class="spec-label">{{ design.weight }}</span>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
/* ── Layout ── */
.pkg-page {
  display: flex; flex-direction: column; gap: 28px;
}

/* ── Header ── */
.pkg-header {
  background: linear-gradient(130deg, #1a0a04 0%, #2e1608 55%, #1a0a04 100%);
  border: 1px solid rgba(212,160,96,0.18);
  border-radius: 22px; padding: 36px 42px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.4); position: relative; overflow: hidden;
}
.pkg-header::before {
  content: ''; position: absolute; right: 340px; top: -60px;
  width: 260px; height: 260px; border-radius: 50%;
  border: 44px solid rgba(212,160,96,0.04); pointer-events: none;
}
.pkg-pill {
  display: inline-block; font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.18em;
  color: #d4a060; background: rgba(212,160,96,0.1);
  border: 1px solid rgba(212,160,96,0.25);
  border-radius: 20px; padding: 4px 14px; margin-bottom: 12px;
}
.pkg-title {
  font-size: clamp(26px, 3vw, 40px); font-weight: 900; color: #fdf6ec;
  margin: 0 0 8px; line-height: 1.1; letter-spacing: -1.2px;
}
.pkg-title em { font-style: normal; color: #d4a060; }
.pkg-sub {
  font-size: 13px; color: rgba(253,246,236,0.5); margin: 0; line-height: 1.6;
}
.pkg-header-actions { display: flex; gap: 10px; flex-shrink: 0; }
.hdr-btn {
  padding: 10px 22px; border-radius: 10px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.17s; font-family: inherit; border: none;
}
.hdr-btn.ghost    { background: rgba(255,255,255,0.07); color: #a8a29e; }
.hdr-btn.ghost:hover { background: rgba(255,255,255,0.13); color: #fdf6ec; }
.hdr-btn.secondary { background: rgba(212,160,96,0.14); color: #d4a060; border: 1px solid rgba(212,160,96,0.3); }
.hdr-btn.secondary:hover { background: rgba(212,160,96,0.24); }
.hdr-btn.primary  { background: linear-gradient(120deg,#c8813a,#d4a060); color: #fff; box-shadow: 0 4px 16px rgba(200,129,58,0.35); }
.hdr-btn.primary:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* ── Main layout ── */
.designer-wrap {
  display: grid; grid-template-columns: 320px 1fr; gap: 22px; align-items: start;
}
@media (max-width: 900px) { .designer-wrap { grid-template-columns: 1fr; } }

/* ── Controls Panel ── */
.ctrl-panel {
  background: #fff; border-radius: 18px; border: 1.5px solid #ece7e2;
  padding: 20px; display: flex; flex-direction: column; gap: 0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); max-height: 88vh; overflow-y: auto;
}
.ctrl-block {
  padding: 18px 0;
  border-bottom: 1px solid #f0ebe4;
}
.ctrl-block:first-child { padding-top: 4px; }
.ctrl-block:last-child  { border-bottom: none; }
.ctrl-block-title {
  font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.14em; color: #78716c; margin-bottom: 12px;
}

/* Presets grid */
.presets-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 7px;
}
.preset-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 9px;
  font-size: 12px; font-weight: 600; color: #57534e;
  background: #faf7f2; border: 1.5px solid #ece7e2; cursor: pointer;
  transition: all 0.15s; text-align: left;
}
.preset-btn:hover { border-color: #d4a060; color: #1c1917; }
.preset-btn.active { border-color: #d4a060; background: rgba(212,160,96,0.1); color: #1c1917; font-weight: 700; }
.preset-swatch {
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
  outline-offset: 2px;
}

/* Color rows */
.color-rows { display: flex; flex-direction: column; gap: 8px; }
.color-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12.5px; color: #57534e; cursor: pointer;
}
.color-right { display: flex; align-items: center; gap: 8px; }
.color-swatch {
  width: 28px; height: 28px; border-radius: 7px; cursor: pointer;
  border: 1.5px solid #ece7e2; padding: 1px; background: none;
}
.color-val { font-size: 11px; font-family: monospace; color: #a8a29e; }

/* Field stack */
.field-stack { display: flex; flex-direction: column; gap: 9px; }
.field-row   { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 11px; font-weight: 600; color: #78716c; }
.field-input {
  padding: 8px 11px; border-radius: 8px;
  border: 1.5px solid #ece7e2; font-size: 13px; color: #1c1917;
  font-family: inherit; background: #faf7f2;
  transition: border-color 0.15s; outline: none;
}
.field-input:focus { border-color: #d4a060; background: #fff; }

/* Chip buttons (roast / weight) */
.chip-row { display: flex; gap: 8px; }
.chip-btn {
  flex: 1; padding: 9px 0; border-radius: 9px; font-size: 13px; font-weight: 600;
  color: #78716c; background: #faf7f2; border: 1.5px solid #ece7e2; cursor: pointer;
  transition: all 0.15s;
}
.chip-btn:hover { border-color: #d4a060; color: #1c1917; }
.chip-btn.active { background: rgba(212,160,96,0.12); border-color: #d4a060; color: #1c1917; font-weight: 700; }

/* Toggle */
.toggle-row { display: flex; align-items: center; justify-content: space-between; }
.toggle-label { font-size: 13px; color: #57534e; font-weight: 500; }
.toggle {
  width: 44px; height: 24px; border-radius: 12px;
  background: #e7e2dc; border: none; cursor: pointer;
  position: relative; transition: background 0.2s; padding: 0; flex-shrink: 0;
}
.toggle.on  { background: #d4a060; }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25); transition: transform 0.2s;
}
.toggle.on .toggle-thumb { transform: translateX(20px); }

/* ── Two-bag preview row ── */
.preview-bags-row {
  display: flex; gap: 36px; align-items: flex-end; justify-content: center;
  position: relative; z-index: 1;
}
.preview-bag-col {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.bag-side-tag {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.2em; color: rgba(212,160,96,0.5);
}

/* ── Preview Panel ── */
.preview-panel {
  display: flex; flex-direction: column; gap: 18px;
}
.preview-card {
  background: linear-gradient(145deg, #1a0a04, #2a1408, #1a0a04);
  border-radius: 22px; border: 1px solid rgba(212,160,96,0.2);
  padding: 36px 32px 28px;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.4); min-height: 600px; justify-content: center;
  position: relative; overflow: hidden;
}
.preview-card::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 30%, rgba(212,160,96,0.06) 0%, transparent 65%);
  pointer-events: none;
}
.preview-badge {
  position: absolute; top: 16px; left: 50%; transform: translateX(-50%);
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;
  color: rgba(212,160,96,0.5); white-space: nowrap;
}
.preview-bag {
  position: relative; z-index: 1;
  filter: drop-shadow(0 32px 48px rgba(0,0,0,0.6));
}
.preview-meta {
  display: flex; align-items: center; gap: 10px;
  position: relative; z-index: 1;
}
.preview-meta-chip {
  font-size: 11.5px; font-weight: 700; color: rgba(212,160,96,0.8);
  background: rgba(212,160,96,0.1); border: 1px solid rgba(212,160,96,0.22);
  border-radius: 20px; padding: 4px 12px;
}
.preview-meta-dot { color: rgba(212,160,96,0.35); font-size: 16px; }

/* Spec strip */
.spec-strip {
  background: #fff; border-radius: 16px; border: 1.5px solid #ece7e2;
  padding: 20px 28px; box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  display: flex; align-items: center; justify-content: space-around; gap: 0;
  flex-wrap: wrap;
}
.spec-item {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  text-align: center; padding: 6px 20px;
}
.spec-icon  { font-size: 22px; }
.spec-label { font-size: 12px; font-weight: 700; color: #1c1917; }
.spec-sep   { width: 1px; height: 40px; background: #f0ebe4; flex-shrink: 0; }

/* ── Typography sliders ── */
.typo-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 10px; margin-bottom: 3px;
}
.typo-label { font-size: 12px; color: #57534e; font-weight: 500; }
.typo-val   {
  font-size: 11px; font-family: monospace; font-weight: 700;
  color: #d4a060; background: rgba(212,160,96,0.1);
  border: 1px solid rgba(212,160,96,0.25);
  border-radius: 6px; padding: 1px 7px; min-width: 32px; text-align: center;
}
.typo-slider {
  width: 100%; height: 4px; cursor: pointer;
  accent-color: #d4a060; border-radius: 2px;
  margin-bottom: 2px;
}

/* ── Preview size bar ── */
.size-bar {
  display: flex; align-items: center; gap: 14px;
  background: rgba(212,160,96,0.08);
  border: 1px solid rgba(212,160,96,0.2);
  border-radius: 12px; padding: 10px 18px;
  width: 100%; box-sizing: border-box;
  position: relative; z-index: 2;
}
.size-bar-label {
  font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.14em; color: rgba(212,160,96,0.6); flex-shrink: 0;
}
.size-btns { display: flex; gap: 6px; flex-shrink: 0; }
.size-btn {
  width: 34px; height: 28px; border-radius: 7px; border: 1.5px solid rgba(212,160,96,0.3);
  background: transparent; color: rgba(212,160,96,0.6); font-size: 11px; font-weight: 800;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.size-btn:hover  { border-color: #d4a060; color: #d4a060; }
.size-btn.active { background: rgba(212,160,96,0.18); border-color: #d4a060; color: #d4a060; }
.size-slider-wrap {
  display: flex; align-items: center; gap: 10px; flex: 1;
}
.size-pct {
  font-size: 11px; font-family: monospace; font-weight: 700;
  color: #d4a060; background: rgba(212,160,96,0.12);
  border: 1px solid rgba(212,160,96,0.25);
  border-radius: 6px; padding: 1px 7px; min-width: 40px; text-align: center;
  flex-shrink: 0;
}
.size-slider {
  flex: 1; height: 4px; cursor: pointer;
  accent-color: #d4a060; border-radius: 2px;
}
</style>