<script setup lang="ts">
import { ref, computed } from 'vue'

interface Question { id: number; text: string; a: string; b: string }
interface Result { bean: string; origin: string; flag: string; notes: string; brew: string; desc: string }

const questions: Question[] = [
  { id: 1, text: 'When do you reach for your first cup?', a: 'First thing at dawn', b: 'Mid-morning or later' },
  { id: 2, text: 'What excites your palate more?', a: 'Bright fruit & florals', b: 'Rich chocolate & caramel' },
  { id: 3, text: 'How do you take your coffee?', a: 'Black — I want to taste everything', b: 'With milk — smooth and comforting' },
]

const RESULTS: Record<string, Result> = {
  aaa: { bean: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', flag: '🇪🇹', notes: 'Jasmine · Blueberry · Lemon zest', brew: 'V60 or Chemex', desc: 'A clarity-focused light roast for the curious early riser who wants every note to sing.' },
  aab: { bean: 'Panama Geisha', origin: 'Panama', flag: '🇵🇦', notes: 'Peach · Bergamot · Honey', brew: 'Pour-over', desc: 'The world\'s most celebrated coffee. Delicate, floral, unforgettable.' },
  aba: { bean: 'Rwanda Bourbon', origin: 'Rwanda', flag: '🇷🇼', notes: 'Cranberry · Dark cherry · Brown sugar', brew: 'AeroPress', desc: 'Complex fruit meets sweetness — a perfect black-coffee morning companion.' },
  abb: { bean: 'Kenya AA', origin: 'Kenya', flag: '🇰🇪', notes: 'Blackcurrant · Tomato · Caramel', brew: 'Flat White', desc: 'Bold and juicy with enough body to hold up beautifully in milk drinks.' },
  baa: { bean: 'Colombian Supremo', origin: 'Colombia', flag: '🇨🇴', notes: 'Hazelnut · Plum · Milk chocolate', brew: 'Espresso', desc: 'A reliable classic — balanced enough to black, bright enough to remember.' },
  bab: { bean: 'Guatemala Antigua', origin: 'Guatemala', flag: '🇬🇹', notes: 'Dark cocoa · Walnut · Spice', brew: 'French Press', desc: 'Full-bodied and warming, with a satisfying bittersweet finish.' },
  bba: { bean: 'Yemen Mokha', origin: 'Yemen', flag: '🇾🇪', notes: 'Wild berry · Dried fruit · Wine', brew: 'Turkish or Moka Pot', desc: 'Ancient and untamed — the coffee that started it all, still unlike anything else.' },
  bbb: { bean: 'Brazilian Santos', origin: 'Brazil', flag: '🇧🇷', notes: 'Chocolate · Almond · Cream', brew: 'Latte or Cappuccino', desc: 'Smooth, nutty, low-acid — the quintessential milk-coffee base.' },
}

const step = ref(0) // 0 = intro, 1-3 = questions, 4 = result
const answers = ref<('a'|'b')[]>([])

function pick(choice: 'a'|'b') {
  answers.value.push(choice)
  step.value++
}
function restart() { answers.value = []; step.value = 0 }

const resultKey = computed(() => answers.value.join(''))
const result = computed<Result | null>(() => step.value === 4 ? (RESULTS[resultKey.value] ?? null) : null)
const progress = computed(() => step.value === 0 ? 0 : step.value === 4 ? 100 : ((step.value) / 3) * 100)
</script>

<template>
  <div class="fc-page">
    <div class="fc-hero">
      <p class="fc-eyebrow">Interactive</p>
      <h1 class="fc-headline">Flavor Compass</h1>
      <p class="fc-sub">3 questions. Your perfect bean, waiting at the end.</p>
    </div>

    <div class="fc-body">
      <!-- Progress bar -->
      <div v-if="step > 0 && step < 4" class="fc-progress-wrap">
        <div class="fc-progress-bar" :style="{ width: progress + '%' }"></div>
        <span class="fc-progress-label">{{ step }} of 3</span>
      </div>

      <!-- Intro -->
      <div v-if="step === 0" class="fc-card intro-card">
        <div class="fc-compass-icon">🧭</div>
        <h2 class="fc-card-title">Find Your Perfect Coffee</h2>
        <p class="fc-card-text">Answer three quick questions and we'll point you to the single-origin bean that matches your taste personality.</p>
        <button class="fc-start-btn" @click="step = 1">Start the Quiz →</button>
      </div>

      <!-- Questions -->
      <div v-else-if="step >= 1 && step <= 3" class="fc-card question-card">
        <p class="fc-q-num">Question {{ step }}</p>
        <h2 class="fc-q-text">{{ questions[step - 1].text }}</h2>
        <div class="fc-options">
          <button class="fc-option" @click="pick('a')">
            <span class="fc-option-letter">A</span>
            <span class="fc-option-label">{{ questions[step - 1].a }}</span>
          </button>
          <button class="fc-option" @click="pick('b')">
            <span class="fc-option-letter">B</span>
            <span class="fc-option-label">{{ questions[step - 1].b }}</span>
          </button>
        </div>
      </div>

      <!-- Result -->
      <div v-else-if="step === 4 && result" class="fc-card result-card">
        <div class="result-flag">{{ result.flag }}</div>
        <p class="result-eyebrow">Your coffee match</p>
        <h2 class="result-bean">{{ result.bean }}</h2>
        <p class="result-origin">{{ result.origin }}</p>
        <div class="result-notes">
          <span v-for="note in result.notes.split(' · ')" :key="note" class="note-chip">{{ note }}</span>
        </div>
        <p class="result-desc">{{ result.desc }}</p>
        <div class="result-brew">
          <span class="brew-label">Best brewed as</span>
          <span class="brew-method">{{ result.brew }}</span>
        </div>
        <div class="result-actions">
          <RouterLink to="/shop/menu" class="result-shop-btn">Find it in the Shop →</RouterLink>
          <button class="result-retry-btn" @click="restart">Retake Quiz</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fc-page { min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }

.fc-hero { background: linear-gradient(135deg, #1c1008, #2d1a0a); padding: 72px 24px 56px; text-align: center; }
.fc-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 12px; }
.fc-headline { font-size: clamp(36px, 6vw, 60px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 14px; }
.fc-sub { font-size: 17px; color: #78716c; margin: 0; }

.fc-body { max-width: 640px; margin: 0 auto; padding: 48px 24px 80px; }

.fc-progress-wrap { position: relative; height: 4px; background: #e7e5e4; border-radius: 4px; margin-bottom: 32px; }
.fc-progress-bar { height: 100%; background: linear-gradient(90deg, #c8813a, #d4a060); border-radius: 4px; transition: width 0.4s ease; }
.fc-progress-label { position: absolute; right: 0; top: 10px; font-size: 11px; color: #a8a29e; font-weight: 600; }

.fc-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 24px; padding: 40px 36px; box-shadow: 0 4px 24px rgba(28,16,8,0.06); }

.intro-card { text-align: center; }
.fc-compass-icon { font-size: 56px; margin-bottom: 20px; }
.fc-card-title { font-size: 26px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.fc-card-text { font-size: 15px; color: #78716c; line-height: 1.7; margin: 0 0 28px; }
.fc-start-btn { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; padding: 14px 32px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: inherit; transition: transform 0.2s, box-shadow 0.2s; }
.fc-start-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(200,129,58,0.4); }

.question-card { }
.fc-q-num { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 10px; }
.fc-q-text { font-size: 22px; font-weight: 800; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 28px; line-height: 1.4; }
.fc-options { display: flex; flex-direction: column; gap: 12px; }
.fc-option { display: flex; align-items: center; gap: 16px; background: #faf7f2; border: 2px solid #f0ebe4; border-radius: 14px; padding: 18px 20px; cursor: pointer; transition: all 0.2s; font-family: inherit; text-align: left; }
.fc-option:hover { border-color: #c8813a; background: #fff3e6; }
.fc-option-letter { width: 32px; height: 32px; background: #1c1917; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
.fc-option-label { font-size: 15px; font-weight: 600; color: #1c1917; }

.result-card { text-align: center; }
.result-flag { font-size: 56px; margin-bottom: 16px; }
.result-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px; }
.result-bean { font-size: 28px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 4px; }
.result-origin { font-size: 14px; color: #a8a29e; font-weight: 600; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.08em; }
.result-notes { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 20px; }
.note-chip { background: #fdf3e7; color: #92400e; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(200,129,58,0.2); }
.result-desc { font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 20px; font-style: italic; }
.result-brew { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 28px; }
.brew-label { font-size: 12px; color: #a8a29e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
.brew-method { font-size: 14px; font-weight: 800; color: #c8813a; background: #fdf3e7; padding: 6px 14px; border-radius: 20px; }
.result-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.result-shop-btn { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 10px; padding: 13px 24px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; font-family: inherit; }
.result-retry-btn { background: none; border: 2px solid #e7e5e4; color: #57534e; border-radius: 10px; padding: 13px 24px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
.result-retry-btn:hover { border-color: #c8813a; color: #c8813a; }
</style>