<script setup lang="ts">
import { ref, computed } from 'vue'

interface Bean { id: string; name: string; flag: string; origin: string; notes: string; color: string }

const BEANS: Bean[] = [
  { id: 'eth', name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', origin: 'Ethiopia', notes: 'Floral · Blueberry · Citrus', color: '#c8813a' },
  { id: 'col', name: 'Colombian Supremo',     flag: '🇨🇴', origin: 'Colombia', notes: 'Caramel · Hazelnut · Plum', color: '#8b4513' },
  { id: 'bra', name: 'Brazilian Santos',      flag: '🇧🇷', origin: 'Brazil',   notes: 'Chocolate · Almond · Cream', color: '#5c3317' },
  { id: 'ken', name: 'Kenya AA',              flag: '🇰🇪', origin: 'Kenya',    notes: 'Blackcurrant · Tomato · Dark sugar', color: '#b8640a' },
  { id: 'yem', name: 'Yemen Mokha',           flag: '🇾🇪', origin: 'Yemen',    notes: 'Wild berry · Wine · Dried fruit', color: '#a0522d' },
  { id: 'pan', name: 'Panama Geisha',         flag: '🇵🇦', origin: 'Panama',   notes: 'Peach · Bergamot · Honey', color: '#d4a060' },
]

const slots = ref([
  { beanId: 'eth', pct: 40 },
  { beanId: 'col', pct: 35 },
  { beanId: 'bra', pct: 25 },
])
const blendName = ref('')
const saved = ref(false)

function getBean(id: string) { return BEANS.find(b => b.id === id)! }

const total = computed(() => slots.value.reduce((s, x) => s + x.pct, 0))
const isValid = computed(() => total.value === 100)

function updateSlot(idx: number, val: number) {
  slots.value[idx].pct = Math.max(0, Math.min(100, val))
}

function addSlot() {
  if (slots.value.length >= 4) return
  const unused = BEANS.find(b => !slots.value.some(s => s.beanId === b.id))
  if (!unused) return
  const take = Math.floor(slots.value[0].pct / 2)
  slots.value[0].pct -= take
  slots.value.push({ beanId: unused.id, pct: take })
}

function removeSlot(idx: number) {
  if (slots.value.length <= 2) return
  const freed = slots.value[idx].pct
  slots.value.splice(idx, 1)
  slots.value[0].pct += freed
}

function saveBlend() {
  if (!isValid.value || !blendName.value.trim()) return
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}

const flavourProfile = computed(() => {
  const notes: string[] = []
  slots.value.forEach(sl => {
    const b = getBean(sl.beanId)
    b.notes.split(' · ').forEach(n => {
      if (sl.pct >= 20) notes.push(n)
    })
  })
  return [...new Set(notes)].slice(0, 5)
})
</script>

<template>
  <div class="bb-page">
    <div class="bb-hero">
      <p class="bb-eyebrow">Custom Creation</p>
      <h1 class="bb-headline">Blend Builder</h1>
      <p class="bb-sub">Mix your own signature blend from our single-origins. We'll roast it fresh and ship it labelled with your name.</p>
    </div>

    <div class="bb-body">
      <div class="bb-layout">

        <!-- Left: sliders -->
        <div class="bb-left">
          <div class="bb-card">
            <div class="bb-card-title">Your Beans</div>
            <div class="bb-slots">
              <div v-for="(slot, i) in slots" :key="i" class="bb-slot">
                <div class="slot-header">
                  <select class="slot-select" :value="slot.beanId" @change="e => slot.beanId = (e.target as HTMLSelectElement).value">
                    <option v-for="b in BEANS" :key="b.id"
                            :value="b.id"
                            :disabled="slots.some((s, j) => j !== i && s.beanId === b.id)">
                      {{ b.flag }} {{ b.name }}
                    </option>
                  </select>
                  <button v-if="slots.length > 2" class="slot-remove" @click="removeSlot(i)">✕</button>
                </div>
                <div class="slot-notes">{{ getBean(slot.beanId).notes }}</div>
                <div class="slot-slider-row">
                  <input type="range" min="0" max="100" :value="slot.pct"
                         @input="e => updateSlot(i, +(e.target as HTMLInputElement).value)"
                         class="slot-slider" />
                  <span class="slot-pct" :class="{ invalid: total !== 100 }">{{ slot.pct }}%</span>
                </div>
                <div class="slot-bar-wrap">
                  <div class="slot-bar" :style="{ width: slot.pct + '%', background: getBean(slot.beanId).color }"></div>
                </div>
              </div>
            </div>

            <div class="bb-total" :class="{ valid: isValid, over: total > 100 }">
              Total: {{ total }}% {{ total === 100 ? '✓ Perfect' : total > 100 ? '↑ Too much' : '↓ Add more' }}
            </div>

            <button v-if="slots.length < 4" class="bb-add-btn" @click="addSlot">+ Add another bean</button>
          </div>
        </div>

        <!-- Right: preview & name -->
        <div class="bb-right">
          <div class="bb-card preview-card">
            <div class="preview-title">Flavour Preview</div>
            <div class="preview-donut">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <template v-for="(slot, i) in slots" :key="i">
                  <!-- simplified visual rings -->
                  <circle cx="60" cy="60"
                          :r="40 - i * 8"
                          :stroke="getBean(slot.beanId).color"
                          :stroke-width="slot.pct / 5"
                          fill="none"
                          stroke-opacity="0.85"/>
                </template>
                <text x="60" y="65" text-anchor="middle" font-size="10" fill="#1c1917" font-weight="800" font-family="serif">{{ slots.length }} Beans</text>
              </svg>
            </div>
            <div class="preview-notes">
              <div class="pn-label">Expected notes</div>
              <div class="pn-chips">
                <span v-for="n in flavourProfile" :key="n" class="pn-chip">{{ n }}</span>
              </div>
            </div>
          </div>

          <div class="bb-card name-card">
            <div class="preview-title">Name Your Blend</div>
            <input v-model="blendName" class="blend-name-input" placeholder="e.g. Desert Dawn, Morning Accord…" maxlength="40" />
            <div class="name-hint">{{ blendName.length }}/40 characters</div>
            <button class="bb-save-btn" :disabled="!isValid || !blendName.trim()" @click="saveBlend">
              {{ saved ? '✓ Blend Saved!' : 'Save & Order My Blend' }}
            </button>
            <p v-if="!isValid" class="bb-error">Percentages must total 100%</p>
            <p v-if="saved" class="bb-success">Your blend has been saved! We'll roast it fresh for you.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bb-page { min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }

.bb-hero { background: linear-gradient(135deg, #1c1008, #2d1a0a); padding: 72px 24px 56px; text-align: center; }
.bb-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 12px; }
.bb-headline { font-size: clamp(36px, 6vw, 56px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.bb-sub { font-size: 15px; color: #78716c; max-width: 520px; margin: 0 auto; line-height: 1.6; }

.bb-body { max-width: 1080px; margin: 0 auto; padding: 48px 24px 80px; }
.bb-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }
@media (max-width: 768px) { .bb-layout { grid-template-columns: 1fr; } }

.bb-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 28px 26px; margin-bottom: 16px; }
.bb-card-title, .preview-title { font-size: 15px; font-weight: 800; color: #1c1917; margin-bottom: 20px; }

.bb-slots { display: flex; flex-direction: column; gap: 20px; }
.bb-slot { padding-bottom: 20px; border-bottom: 1px solid #f0ebe4; }
.bb-slot:last-child { border-bottom: none; }
.slot-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.slot-select { flex: 1; padding: 9px 12px; border: 1px solid #e7e5e4; border-radius: 10px; font-size: 13px; font-family: inherit; background: #faf7f2; color: #1c1917; }
.slot-remove { background: none; border: 1px solid #e7e5e4; color: #a8a29e; border-radius: 8px; width: 30px; height: 30px; cursor: pointer; font-size: 12px; flex-shrink: 0; }
.slot-notes { font-size: 11px; color: #a8a29e; margin-bottom: 10px; }
.slot-slider-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.slot-slider { flex: 1; accent-color: #c8813a; }
.slot-pct { font-size: 14px; font-weight: 800; color: #1c1917; min-width: 36px; text-align: right; }
.slot-pct.invalid { color: #ef4444; }
.slot-bar-wrap { height: 4px; background: #f0ebe4; border-radius: 4px; }
.slot-bar { height: 100%; border-radius: 4px; transition: width 0.2s; }

.bb-total { font-size: 14px; font-weight: 700; color: #a8a29e; padding: 12px 0 8px; }
.bb-total.valid { color: #16a34a; }
.bb-total.over { color: #ef4444; }

.bb-add-btn { background: none; border: 2px dashed #e7e5e4; color: #78716c; border-radius: 10px; padding: 11px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; width: 100%; margin-top: 8px; transition: all 0.2s; }
.bb-add-btn:hover { border-color: #c8813a; color: #c8813a; }

.bb-right { display: flex; flex-direction: column; }
.preview-card { text-align: center; }
.preview-donut { display: flex; justify-content: center; margin-bottom: 20px; }
.donut-svg { width: 140px; height: 140px; }
.pn-label { font-size: 11px; color: #a8a29e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
.pn-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.pn-chip { background: #fdf3e7; color: #92400e; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; }

.name-card { }
.blend-name-input { width: 100%; padding: 13px 16px; border: 1.5px solid #e7e5e4; border-radius: 12px; font-size: 16px; font-family: 'Playfair Display', serif; color: #1c1917; background: #faf7f2; box-sizing: border-box; }
.blend-name-input:focus { outline: none; border-color: #c8813a; }
.name-hint { font-size: 11px; color: #a8a29e; text-align: right; margin: 6px 0 16px; }
.bb-save-btn { width: 100%; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.bb-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bb-save-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(200,129,58,0.4); }
.bb-error { font-size: 12px; color: #ef4444; margin: 8px 0 0; }
.bb-success { font-size: 13px; color: #16a34a; font-weight: 600; margin: 8px 0 0; }
</style>