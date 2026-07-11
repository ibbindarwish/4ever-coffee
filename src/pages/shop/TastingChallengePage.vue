<script setup lang="ts">
import { ref, computed } from 'vue'

interface Mystery {
  id: number; name: string; flag: string; origin: string; roast: string
  hint: string; trueNotes: string[]; story: string
}

const MYSTERIES: Mystery[] = [
  { id: 1, name: 'Mystery Bean #1', flag: '❓', origin: 'Ethiopia', roast: 'Light', hint: 'Think floral. Think fruit. Think somewhere African and high altitude.', trueNotes: ['Jasmine', 'Blueberry', 'Lemon'], story: 'Ethiopian Yirgacheffe — the world\'s most complex light roast. If you found floral or fruit notes, your palate is exceptional.' },
  { id: 2, name: 'Mystery Bean #2', flag: '❓', origin: 'Colombia', roast: 'Medium', hint: 'Balanced and approachable. Some sweetness, maybe nuts. Classic.', trueNotes: ['Caramel', 'Hazelnut', 'Milk chocolate'], story: 'Colombian Supremo — the benchmark of balanced specialty coffee. Universally loved for exactly those reasons.' },
  { id: 3, name: 'Mystery Bean #3', flag: '❓', origin: 'Yemen', roast: 'Medium-Dark', hint: 'Wild, unusual, ancient. Something fermented? Dried fruit perhaps?', trueNotes: ['Wild berry', 'Dried fig', 'Wine'], story: 'Yemen Mokha — the original coffee, processed the same way for 500 years. If you found it unusual, you found it correctly.' },
]

const current = ref(0)
const selectedNotes = ref<string[]>([])
const revealed = ref(false)
const allNoteOptions = ['Jasmine', 'Chocolate', 'Blueberry', 'Caramel', 'Wine', 'Citrus', 'Nuts', 'Dried fruit', 'Floral', 'Spice', 'Cream', 'Berry']

const mystery = computed(() => MYSTERIES[current.value])

function toggleNote(n: string) {
  const i = selectedNotes.value.indexOf(n)
  if (i === -1) selectedNotes.value.push(n)
  else selectedNotes.value.splice(i, 1)
}

const score = computed(() => {
  const hits = selectedNotes.value.filter(n => mystery.value.trueNotes.includes(n)).length
  return Math.round((hits / mystery.value.trueNotes.length) * 100)
})

function reveal() { revealed.value = true }
function next() { current.value = (current.value + 1) % MYSTERIES.length; selectedNotes.value = []; revealed.value = false }
</script>

<template>
  <div class="tc-page">
    <div class="tc-hero">
      <p class="tc-eyebrow">Blind Tasting</p>
      <h1 class="tc-headline">Tasting Challenge</h1>
      <p class="tc-sub">Can you identify the coffee by taste alone? Pick your notes, then reveal the truth.</p>
    </div>

    <div class="tc-body">
      <div class="tc-counter">Challenge {{ current + 1 }} of {{ MYSTERIES.length }}</div>

      <div class="tc-card">
        <div class="mystery-cup">☕</div>
        <h2 class="mystery-name">{{ mystery.name }}</h2>
        <div class="mystery-hint">
          <span class="hint-icon">💡</span>
          <span>{{ mystery.hint }}</span>
        </div>

        <div v-if="!revealed">
          <p class="notes-label">What flavour notes do you detect?</p>
          <div class="note-grid">
            <button v-for="n in allNoteOptions" :key="n"
                    class="note-btn"
                    :class="{ selected: selectedNotes.includes(n) }"
                    @click="toggleNote(n)">
              {{ n }}
            </button>
          </div>
          <p class="selected-count">{{ selectedNotes.length }} notes selected</p>
          <button class="reveal-btn" :disabled="selectedNotes.length === 0" @click="reveal">
            Reveal the Bean
          </button>
        </div>

        <div v-else class="reveal-panel">
          <div class="reveal-score" :class="{ high: score >= 67, mid: score >= 33 && score < 67, low: score < 33 }">
            {{ score }}%
            <span class="score-label">{{ score >= 67 ? 'Expert Palate' : score >= 33 ? 'Good Instinct' : 'Keep Practising' }}</span>
          </div>
          <div class="reveal-origin">{{ mystery.flag }} {{ mystery.origin }} · {{ mystery.roast }} Roast</div>
          <p class="reveal-story">{{ mystery.story }}</p>
          <div class="true-notes">
            <span class="tn-label">True notes:</span>
            <span v-for="n in mystery.trueNotes" :key="n" class="tn-chip"
                  :class="{ hit: selectedNotes.includes(n) }">{{ n }}</span>
          </div>
          <div class="reveal-actions">
            <button class="next-btn" @click="next">Next Mystery →</button>
            <RouterLink to="/shop/menu" class="tc-shop-btn">Order the Real Thing</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tc-page { min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }
.tc-hero { background: linear-gradient(135deg, #1c1008, #2d1a0a); padding: 72px 24px 56px; text-align: center; }
.tc-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 12px; }
.tc-headline { font-size: clamp(36px, 6vw, 56px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.tc-sub { font-size: 15px; color: #78716c; max-width: 500px; margin: 0 auto; }

.tc-body { max-width: 620px; margin: 0 auto; padding: 48px 24px 80px; }
.tc-counter { text-align: center; font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }

.tc-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 24px; padding: 40px 32px; box-shadow: 0 4px 24px rgba(28,16,8,0.06); text-align: center; }
.mystery-cup { font-size: 64px; margin-bottom: 12px; }
.mystery-name { font-size: 22px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 16px; }
.mystery-hint { display: flex; align-items: flex-start; gap: 10px; background: #fdf3e7; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; text-align: left; font-size: 14px; color: #78716c; line-height: 1.6; }
.hint-icon { font-size: 18px; flex-shrink: 0; }

.notes-label { font-size: 13px; font-weight: 700; color: #1c1917; margin-bottom: 14px; text-align: left; }
.note-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px; }
.note-btn { background: #faf7f2; border: 2px solid #e7e5e4; border-radius: 20px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #57534e; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.note-btn:hover { border-color: #c8813a; color: #c8813a; }
.note-btn.selected { background: #fdf3e7; border-color: #c8813a; color: #92400e; }
.selected-count { font-size: 12px; color: #a8a29e; margin-bottom: 16px; }
.reveal-btn { background: #1c1917; color: #fff; border: none; border-radius: 12px; padding: 14px 32px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.reveal-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.reveal-btn:not(:disabled):hover { background: #2d1a0a; }

.reveal-panel { text-align: center; }
.reveal-score { font-size: 56px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; display: flex; flex-direction: column; align-items: center; margin-bottom: 16px; }
.reveal-score.high { color: #16a34a; }
.reveal-score.mid  { color: #c8813a; }
.reveal-score.low  { color: #ef4444; }
.score-label { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
.reveal-origin { font-size: 18px; font-weight: 800; color: #1c1917; margin-bottom: 12px; }
.reveal-story { font-size: 14px; color: #57534e; line-height: 1.7; font-style: italic; margin-bottom: 16px; }
.true-notes { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 24px; }
.tn-label { font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; }
.tn-chip { font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px; background: #f0ebe4; color: #57534e; }
.tn-chip.hit { background: #dcfce7; color: #16a34a; }
.reveal-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.next-btn { background: #1c1917; color: #fff; border: none; border-radius: 10px; padding: 12px 22px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; }
.tc-shop-btn { display: inline-block; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; text-decoration: none; border-radius: 10px; padding: 12px 22px; font-size: 14px; font-weight: 700; }
</style>