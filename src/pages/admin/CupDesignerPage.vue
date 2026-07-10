<script setup lang="ts">
import { ref, reactive, defineAsyncComponent } from 'vue'
import CupDesignSvg from '../../components/CupDesignSvg.vue'

const Cup3DViewer = defineAsyncComponent(() => import('../../components/Cup3DViewer.vue'))
const viewMode = ref<'2d' | '3d'>('2d')

// ── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  {
    name: 'Classic Cream',
    bodyLight: '#faf5ec', bodyDark: '#c2a870',
    sleeveColor: '#1e0e06', borderColor: '#d4a060',
    logoColor: '#d4a060', steamColor: '#d0c8b8',
  },
  {
    name: 'Matte Black',
    bodyLight: '#3a3a3a', bodyDark: '#111111',
    sleeveColor: '#0a0a0a', borderColor: '#d4a060',
    logoColor: '#d4a060', steamColor: '#888',
  },
  {
    name: 'Forest Green',
    bodyLight: '#f0ece4', bodyDark: '#c4bdb0',
    sleeveColor: '#2d5a3d', borderColor: '#a8d4a0',
    logoColor: '#a8d4a0', steamColor: '#a0c8a0',
  },
  {
    name: 'Navy Blue',
    bodyLight: '#f0ece4', bodyDark: '#c4bdb0',
    sleeveColor: '#1b2d5c', borderColor: '#93c5fd',
    logoColor: '#93c5fd', steamColor: '#93c5fd',
  },
  {
    name: 'Rose Gold',
    bodyLight: '#fdf0ec', bodyDark: '#d4a090',
    sleeveColor: '#4a1a1a', borderColor: '#e8b4a0',
    logoColor: '#e8b4a0', steamColor: '#e8c0b8',
  },
  {
    name: 'Midnight Gold',
    bodyLight: '#2e2510', bodyDark: '#0a0800',
    sleeveColor: '#110e04', borderColor: '#e8c840',
    logoColor: '#e8c840', steamColor: '#e8c840',
  },
  {
    name: 'Minimal White',
    bodyLight: '#ffffff', bodyDark: '#d8d0c8',
    sleeveColor: '#f0ebe4', borderColor: '#2e1608',
    logoColor: '#2e1608', steamColor: '#c8c0b8',
  },
  {
    name: 'Burgundy',
    bodyLight: '#faf5ec', bodyDark: '#c2a870',
    sleeveColor: '#5c1a2c', borderColor: '#e8d060',
    logoColor: '#e8d060', steamColor: '#e8d060',
  },
  {
    name: 'No Color',
    bodyLight: '#ffffff', bodyDark: '#e4dfd8',
    sleeveColor: '#f5f2ee', borderColor: '#c8c0b8',
    logoColor: '#c8c0b8', steamColor: '#dddad6',
  },
  {
    name: 'UAE Pride',
    bodyLight: '#faf5ec', bodyDark: '#c2a870',
    sleeveColor: '#006233', borderColor: '#ffffff',
    logoColor: '#ce1126', steamColor: '#ffffff',
  },
  {
    name: 'Ramadan',
    bodyLight: '#f5f0e8', bodyDark: '#c2a870',
    sleeveColor: '#2d1b4e', borderColor: '#e8c840',
    logoColor: '#e8c840', steamColor: '#e8c840',
  },
  {
    name: 'Eid Special',
    bodyLight: '#ffffff', bodyDark: '#e8d4a0',
    sleeveColor: '#8b6914', borderColor: '#ffe066',
    logoColor: '#ffe066', steamColor: '#ffe066',
  },
  {
    name: 'Cobalt Blue',
    bodyLight: '#f0f4ff', bodyDark: '#b0c0e8',
    sleeveColor: '#0a1f6b', borderColor: '#60a5fa',
    logoColor: '#60a5fa', steamColor: '#93c5fd',
  },
  {
    name: 'Sunset',
    bodyLight: '#fff5f0', bodyDark: '#e8a090',
    sleeveColor: '#7c1d1d', borderColor: '#fb923c',
    logoColor: '#fb923c', steamColor: '#fcd34d',
  },
]

const selectedPreset = ref(0)

const FONTS = [
  { label: 'Georgia (Serif)',        value: "Georgia,'Times New Roman',serif" },
  { label: 'Arial Black (Bold)',     value: "'Arial Black',Arial,sans-serif" },
  { label: 'Arial (Sans)',           value: 'Arial,sans-serif' },
  { label: 'Courier (Mono)',         value: "'Courier New',monospace" },
  { label: 'Trebuchet (Modern)',     value: "'Trebuchet MS',sans-serif" },
  { label: 'Palatino (Elegant)',     value: "'Palatino Linotype',serif" },
]

const design = reactive({
  // Colors
  bodyLight:   '#faf5ec',
  bodyDark:    '#c2a870',
  sleeveColor: '#1e0e06',
  borderColor: '#d4a060',
  logoColor:   '#d4a060',
  steamColor:  '#d0c8b8',
  // Logo
  logoStyle:   'circle4' as 'circle4' | 'none',
  // Main text
  mainText:     '4ever Coffee',
  mainFontSize:  8.5,
  mainSpacing:   3,
  font:          "Georgia,'Times New Roman',serif",
  // Sub text
  subText:      'Premium Blend',
  subFontSize:   6,
  subSpacing:    2,
  // Cup options
  showSteam:   true,
  size:        'md' as 'sm' | 'md' | 'lg',
  cupScale:    1.6,
})

function applyPreset(i: number) {
  selectedPreset.value = i
  const p = PRESETS[i]
  design.bodyLight   = p.bodyLight
  design.bodyDark    = p.bodyDark
  design.sleeveColor = p.sleeveColor
  design.borderColor = p.borderColor
  design.logoColor   = p.logoColor
  design.steamColor  = p.steamColor
}

function resetDesign() {
  applyPreset(0)
  design.logoStyle    = 'circle4'
  design.mainText     = '4ever Coffee'
  design.mainFontSize = 8.5
  design.mainSpacing  = 3
  design.font         = "Georgia,'Times New Roman',serif"
  design.subText      = 'Premium Blend'
  design.subFontSize  = 6
  design.subSpacing   = 2
  design.showSteam    = true
  design.size         = 'md'
  design.cupScale     = 1.6
}

function downloadSvg() {
  const el = document.querySelector('.preview-cup .cup-design-svg') as SVGElement | null
  if (!el) return
  const blob = new Blob([el.outerHTML], { type: 'image/svg+xml' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = `${design.mainText.replace(/\s+/g, '-')}-cup.svg`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPng() {
  const el = document.querySelector('.preview-cup .cup-design-svg') as SVGElement | null
  if (!el) return
  const svgStr = new XMLSerializer().serializeToString(el)
  const img    = new Image()
  const SCALE  = 4
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
      a.download = `${design.mainText.replace(/\s+/g, '-')}-cup.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr)
}

const cupSizes = ['sm', 'md', 'lg'] as const
const sizeLabels: Record<string, string> = { sm: 'S · 8oz', md: 'M · 12oz', lg: 'L · 16oz' }
</script>

<template>
  <div class="cup-page">

    <!-- ── Header ── -->
    <header class="cup-header">
      <div class="cup-header-info">
        <span class="cup-pill">✦ Design Studio</span>
        <h1 class="cup-title">Cup <em>Designer</em></h1>
        <p class="cup-sub">Design your branded coffee cup — colours, text, logo and size.</p>
      </div>
      <div class="cup-header-actions">
        <button class="hdr-btn ghost"      @click="resetDesign">↺ Reset</button>
        <button class="hdr-btn secondary"  @click="downloadSvg">↓ SVG</button>
        <button class="hdr-btn primary"    @click="downloadPng">↓ Export PNG</button>
      </div>
    </header>

    <!-- ── Designer layout ── -->
    <div class="designer-wrap">

      <!-- LEFT — Controls ── -->
      <aside class="ctrl-panel">

        <!-- Color Presets -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Color Presets</div>
          <div class="presets-grid">
            <button
              v-for="(p, i) in PRESETS" :key="p.name"
              class="preset-btn" :class="{ active: selectedPreset === i }"
              @click="applyPreset(i)"
            >
              <span class="preset-swatch"
                :style="p.name === 'No Color'
                  ? { background: '#fff', outline: '2px dashed #c8c0b8' }
                  : { background: p.sleeveColor, outline: `2px solid ${p.borderColor}` }
                "/>
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- Colors -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Colors</div>
          <div class="color-rows">
            <label class="color-row">
              <span>Cup Body Light</span>
              <span class="color-right">
                <input type="color" v-model="design.bodyLight" class="color-swatch"/>
                <span class="color-val">{{ design.bodyLight }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Cup Body Dark</span>
              <span class="color-right">
                <input type="color" v-model="design.bodyDark" class="color-swatch"/>
                <span class="color-val">{{ design.bodyDark }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Sleeve Color</span>
              <span class="color-right">
                <input type="color" v-model="design.sleeveColor" class="color-swatch"/>
                <span class="color-val">{{ design.sleeveColor }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Text &amp; Border</span>
              <span class="color-right">
                <input type="color" v-model="design.borderColor" class="color-swatch"/>
                <span class="color-val">{{ design.borderColor }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Logo Color</span>
              <span class="color-right">
                <input type="color" v-model="design.logoColor" class="color-swatch"/>
                <span class="color-val">{{ design.logoColor }}</span>
              </span>
            </label>
            <label class="color-row">
              <span>Steam Color</span>
              <span class="color-right">
                <input type="color" v-model="design.steamColor" class="color-swatch"/>
                <span class="color-val">{{ design.steamColor }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Main Text -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Main Text</div>
          <div class="field-stack">
            <label class="field-row">
              <span class="field-label">Text (max 22 chars)</span>
              <input v-model="design.mainText" type="text" class="field-input"
                     maxlength="22" placeholder="4ever Coffee"/>
            </label>

            <div class="slider-row">
              <span class="slider-label">Font Size</span>
              <span class="slider-val">{{ design.mainFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.mainFontSize"
                   min="4" max="16" step="0.5" class="ctrl-slider"/>

            <div class="slider-row">
              <span class="slider-label">Letter Spacing</span>
              <span class="slider-val">{{ design.mainSpacing }}</span>
            </div>
            <input type="range" v-model.number="design.mainSpacing"
                   min="0" max="10" step="0.5" class="ctrl-slider"/>

            <label class="field-row" style="margin-top:4px">
              <span class="field-label">Font Family</span>
              <select v-model="design.font" class="field-input">
                <option v-for="f in FONTS" :key="f.value" :value="f.value">
                  {{ f.label }}
                </option>
              </select>
            </label>
          </div>
        </div>

        <!-- Sub Text -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Sub Text</div>
          <div class="field-stack">
            <label class="field-row">
              <span class="field-label">Text (max 28 chars)</span>
              <input v-model="design.subText" type="text" class="field-input"
                     maxlength="28" placeholder="Premium Blend"/>
            </label>

            <div class="slider-row">
              <span class="slider-label">Font Size</span>
              <span class="slider-val">{{ design.subFontSize }}</span>
            </div>
            <input type="range" v-model.number="design.subFontSize"
                   min="3" max="12" step="0.5" class="ctrl-slider"/>

            <div class="slider-row">
              <span class="slider-label">Letter Spacing</span>
              <span class="slider-val">{{ design.subSpacing }}</span>
            </div>
            <input type="range" v-model.number="design.subSpacing"
                   min="0" max="8" step="0.5" class="ctrl-slider"/>
          </div>
        </div>

        <!-- Logo -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Logo</div>
          <div class="chip-row">
            <button class="chip-btn" :class="{ active: design.logoStyle === 'circle4' }"
                    @click="design.logoStyle = 'circle4'">Show Logo</button>
            <button class="chip-btn" :class="{ active: design.logoStyle === 'none' }"
                    @click="design.logoStyle = 'none'">Hide Logo</button>
          </div>
        </div>

        <!-- Cup Size & Options -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Cup Size</div>
          <div class="chip-row">
            <button v-for="sz in cupSizes" :key="sz"
                    class="chip-btn" :class="{ active: design.size === sz }"
                    @click="design.size = sz">
              {{ sizeLabels[sz] }}
            </button>
          </div>
        </div>

        <!-- Options -->
        <div class="ctrl-block">
          <div class="ctrl-block-title">Options</div>
          <div class="toggle-row" style="margin-bottom:14px">
            <span class="toggle-label">Steam Effect</span>
            <button class="toggle" :class="{ on: design.showSteam }"
                    @click="design.showSteam = !design.showSteam">
              <span class="toggle-thumb"/>
            </button>
          </div>
        </div>

      </aside>

      <!-- RIGHT — Preview ── -->
      <main class="preview-panel">
        <div class="preview-card">

          <!-- View mode toggle -->
          <div class="view-toggle">
            <button class="view-toggle-btn" :class="{ active: viewMode === '2d' }" @click="viewMode = '2d'">2D</button>
            <button class="view-toggle-btn" :class="{ active: viewMode === '3d' }" @click="viewMode = '3d'">🔄 3D</button>
          </div>

          <!-- Size bar -->
          <div class="size-bar" v-if="viewMode === '2d'">
            <span class="size-bar-label">Preview Size</span>
            <div class="size-btns">
              <button v-for="sc in [{l:'S',v:1.0},{l:'M',v:1.6},{l:'L',v:2.2},{l:'XL',v:2.8}]"
                      :key="sc.l" class="size-btn"
                      :class="{ active: Math.abs(design.cupScale - sc.v) < 0.05 }"
                      @click="design.cupScale = sc.v">
                {{ sc.l }}
              </button>
            </div>
            <div class="size-slider-wrap">
              <span class="size-pct">{{ Math.round(design.cupScale * 100) }}%</span>
              <input type="range" v-model.number="design.cupScale"
                     min="0.8" max="3.5" step="0.1" class="size-slider"/>
            </div>
          </div>

          <!-- Cup preview -->
          <div class="preview-cup" v-if="viewMode === '2d'">
            <CupDesignSvg
              :size="design.size"
              :scale="design.cupScale"
              :bodyLight="design.bodyLight"
              :bodyDark="design.bodyDark"
              :sleeveColor="design.sleeveColor"
              :borderColor="design.borderColor"
              :logoColor="design.logoColor"
              :logoStyle="design.logoStyle"
              :mainText="design.mainText"
              :mainFontSize="design.mainFontSize"
              :mainSpacing="design.mainSpacing"
              :subText="design.subText"
              :subFontSize="design.subFontSize"
              :subSpacing="design.subSpacing"
              :showSteam="design.showSteam"
              :steamColor="design.steamColor"
              :font="design.font"
            />
          </div>

          <!-- 3D preview — drag to spin, auto-rotates -->
          <div class="preview-cup-3d" v-else>
            <Suspense>
              <Cup3DViewer
                :bodyLight="design.bodyLight"
                :bodyDark="design.bodyDark"
                :sleeveColor="design.sleeveColor"
                :borderColor="design.borderColor"
                :logoColor="design.logoColor"
                :logoStyle="design.logoStyle"
                :mainText="design.mainText"
                :mainFontSize="design.mainFontSize"
                :mainSpacing="design.mainSpacing"
                :subText="design.subText"
                :subFontSize="design.subFontSize"
                :subSpacing="design.subSpacing"
                :font="design.font"
              />
              <template #fallback>
                <div class="cup-3d-loading">Loading 3D viewer…</div>
              </template>
            </Suspense>
          </div>

          <!-- Meta row -->
          <div class="preview-meta">
            <span class="preview-meta-chip">{{ sizeLabels[design.size] }}</span>
            <span class="preview-meta-dot">·</span>
            <span class="preview-meta-chip">{{ design.mainText || '—' }}</span>
            <span class="preview-meta-dot">·</span>
            <span class="preview-meta-chip">{{ design.logoStyle === 'circle4' ? 'Logo On' : 'Logo Off' }}</span>
          </div>

        </div>

        <!-- Spec strip -->
        <div class="spec-strip">
          <div class="spec-item">
            <span class="spec-icon">🎨</span>
            <span class="spec-label">Custom Colors</span>
          </div>
          <div class="spec-sep"/>
          <div class="spec-item">
            <span class="spec-icon">✍️</span>
            <span class="spec-label">Custom Text</span>
          </div>
          <div class="spec-sep"/>
          <div class="spec-item">
            <span class="spec-icon">📏</span>
            <span class="spec-label">{{ sizeLabels[design.size] }}</span>
          </div>
          <div class="spec-sep"/>
          <div class="spec-item">
            <span class="spec-icon">↓</span>
            <span class="spec-label">SVG &amp; PNG Export</span>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
.cup-page { display: flex; flex-direction: column; gap: 28px; }

/* Header */
.cup-header {
  background: linear-gradient(130deg, #1a0a04 0%, #2e1608 55%, #1a0a04 100%);
  border: 1px solid rgba(212,160,96,0.18); border-radius: 22px;
  padding: 36px 42px; display: flex; align-items: center;
  justify-content: space-between; gap: 24px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.4); position: relative; overflow: hidden;
}
.cup-header::before {
  content: ''; position: absolute; right: 340px; top: -60px;
  width: 260px; height: 260px; border-radius: 50%;
  border: 44px solid rgba(212,160,96,0.04); pointer-events: none;
}
.cup-pill {
  display: inline-block; font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.18em;
  color: #d4a060; background: rgba(212,160,96,0.1);
  border: 1px solid rgba(212,160,96,0.25);
  border-radius: 20px; padding: 4px 14px; margin-bottom: 12px;
}
.cup-title {
  font-size: clamp(26px, 3vw, 40px); font-weight: 900; color: #fdf6ec;
  margin: 0 0 8px; line-height: 1.1; letter-spacing: -1.2px;
}
.cup-title em { font-style: normal; color: #d4a060; }
.cup-sub { font-size: 13px; color: rgba(253,246,236,0.5); margin: 0; line-height: 1.6; }
.cup-header-actions { display: flex; gap: 10px; flex-shrink: 0; }
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

/* Layout */
.designer-wrap {
  display: grid; grid-template-columns: 300px 1fr; gap: 22px; align-items: start;
}
@media (max-width: 860px) { .designer-wrap { grid-template-columns: 1fr; } }

/* Controls panel */
.ctrl-panel {
  background: #fff; border-radius: 18px; border: 1.5px solid #ece7e2;
  padding: 20px; display: flex; flex-direction: column;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); max-height: 90vh; overflow-y: auto;
}
.ctrl-block { padding: 16px 0; border-bottom: 1px solid #f0ebe4; }
.ctrl-block:first-child { padding-top: 4px; }
.ctrl-block:last-child  { border-bottom: none; }
.ctrl-block-title {
  font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.14em; color: #78716c; margin-bottom: 12px;
}

/* Presets */
.presets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.preset-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 9px; border-radius: 9px; font-size: 11.5px; font-weight: 600;
  color: #57534e; background: #faf7f2; border: 1.5px solid #ece7e2; cursor: pointer;
  transition: all 0.14s; text-align: left;
}
.preset-btn:hover { border-color: #d4a060; color: #1c1917; }
.preset-btn.active { border-color: #d4a060; background: rgba(212,160,96,0.1); color: #1c1917; font-weight: 700; }
.preset-swatch { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; outline-offset: 2px; }

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

/* Fields */
.field-stack { display: flex; flex-direction: column; gap: 8px; }
.field-row   { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 11px; font-weight: 600; color: #78716c; }
.field-input {
  padding: 8px 10px; border-radius: 8px;
  border: 1.5px solid #ece7e2; font-size: 13px; color: #1c1917;
  font-family: inherit; background: #faf7f2;
  transition: border-color 0.15s; outline: none; width: 100%; box-sizing: border-box;
}
.field-input:focus { border-color: #d4a060; background: #fff; }

/* Sliders */
.slider-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 8px; margin-bottom: 3px;
}
.slider-label { font-size: 11px; color: #57534e; font-weight: 600; }
.slider-val {
  font-size: 11px; font-family: monospace; font-weight: 700;
  color: #d4a060; background: rgba(212,160,96,0.1);
  border: 1px solid rgba(212,160,96,0.25);
  border-radius: 6px; padding: 1px 7px; min-width: 32px; text-align: center;
}
.ctrl-slider {
  width: 100%; height: 4px; cursor: pointer;
  accent-color: #d4a060; border-radius: 2px;
}

/* Chips */
.chip-row { display: flex; gap: 7px; }
.chip-btn {
  flex: 1; padding: 9px 0; border-radius: 9px; font-size: 12px; font-weight: 600;
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
.toggle.on { background: #d4a060; }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25); transition: transform 0.2s;
}
.toggle.on .toggle-thumb { transform: translateX(20px); }

/* Preview */
.preview-panel { display: flex; flex-direction: column; gap: 18px; }
.preview-card {
  background: linear-gradient(145deg, #1a0a04, #2a1408, #1a0a04);
  border-radius: 22px; border: 1px solid rgba(212,160,96,0.2);
  padding: 28px 32px 32px;
  display: flex; flex-direction: column; align-items: center; gap: 28px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.4); min-height: 580px; justify-content: center;
  position: relative; overflow: hidden;
}
.preview-card::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 25%, rgba(212,160,96,0.07) 0%, transparent 65%);
  pointer-events: none;
}
.preview-cup {
  position: relative; z-index: 1;
  filter: drop-shadow(0 28px 44px rgba(0,0,0,0.55));
}
.preview-cup-3d {
  position: relative; z-index: 1; width: 100%; height: 420px;
}
.cup-3d-loading {
  display: flex; align-items: center; justify-content: center; height: 100%;
  color: rgba(212,160,96,0.6); font-size: 13px; font-weight: 600;
}

.view-toggle {
  display: flex; gap: 6px; position: relative; z-index: 2;
  background: rgba(212,160,96,0.08); border: 1px solid rgba(212,160,96,0.2);
  border-radius: 12px; padding: 4px; width: fit-content;
}
.view-toggle-btn {
  padding: 7px 16px; border-radius: 9px; border: none; background: transparent;
  color: rgba(212,160,96,0.6); font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s; font-family: inherit;
}
.view-toggle-btn.active { background: rgba(212,160,96,0.18); color: #d4a060; }
.view-toggle-btn:hover:not(.active) { color: rgba(212,160,96,0.85); }
.preview-meta {
  display: flex; align-items: center; gap: 10px; position: relative; z-index: 1;
}
.preview-meta-chip {
  font-size: 11px; font-weight: 700; color: rgba(212,160,96,0.8);
  background: rgba(212,160,96,0.1); border: 1px solid rgba(212,160,96,0.22);
  border-radius: 20px; padding: 4px 12px;
}
.preview-meta-dot { color: rgba(212,160,96,0.35); font-size: 16px; }

/* Size bar */
.size-bar {
  display: flex; align-items: center; gap: 14px;
  background: rgba(212,160,96,0.08); border: 1px solid rgba(212,160,96,0.2);
  border-radius: 12px; padding: 10px 18px;
  width: 100%; box-sizing: border-box; position: relative; z-index: 2;
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
.size-slider-wrap { display: flex; align-items: center; gap: 10px; flex: 1; }
.size-pct {
  font-size: 11px; font-family: monospace; font-weight: 700; color: #d4a060;
  background: rgba(212,160,96,0.12); border: 1px solid rgba(212,160,96,0.25);
  border-radius: 6px; padding: 1px 7px; min-width: 42px; text-align: center; flex-shrink: 0;
}
.size-slider { flex: 1; height: 4px; cursor: pointer; accent-color: #d4a060; border-radius: 2px; }

/* Spec strip */
.spec-strip {
  background: #fff; border-radius: 16px; border: 1.5px solid #ece7e2;
  padding: 20px 28px; box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap;
}
.spec-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 6px 20px; text-align: center; }
.spec-icon  { font-size: 22px; }
.spec-label { font-size: 12px; font-weight: 700; color: #1c1917; }
.spec-sep   { width: 1px; height: 40px; background: #f0ebe4; flex-shrink: 0; }
</style>