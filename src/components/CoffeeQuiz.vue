<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const cart = useCartStore()
const store = useProductsStore()

const step = ref(0)          // 0 = intro, 1-3 = questions, 4 = result
const answers = ref<number[]>([])

const questions = [
  {
    text: 'What\'s your vibe right now?',
    emoji: '🌤️',
    options: [
      { label: 'Tired — I need a boost ⚡', icon: '⚡' },
      { label: 'Relaxed & social ☕',       icon: '😊' },
      { label: 'Treating myself today 🍯',  icon: '🍯' },
      { label: 'Feeling healthy & fresh 🌿', icon: '🌿' },
    ]
  },
  {
    text: 'Hot or cold?',
    emoji: '🌡️',
    options: [
      { label: 'Hot please ♨️',   icon: '♨️' },
      { label: 'Cold & iced 🧊',  icon: '🧊' },
    ]
  },
  {
    text: 'How do you like your sweetness?',
    emoji: '🍬',
    options: [
      { label: 'No sugar — keep it pure', icon: '◇' },
      { label: 'Just a little',           icon: '◈' },
      { label: 'Sweet & indulgent',       icon: '◆' },
    ]
  }
]

// Matrix: answers[0]-answers[1]-answers[2] → product id
const matrix: Record<string, number> = {
  '0-0-0': 1,  '0-0-1': 4,  '0-0-2': 3,
  '0-1-0': 5,  '0-1-1': 9,  '0-1-2': 9,
  '1-0-0': 8,  '1-0-1': 2,  '1-0-2': 7,
  '1-1-0': 5,  '1-1-1': 9,  '1-1-2': 6,
  '2-0-0': 12, '2-0-1': 11, '2-0-2': 7,
  '2-1-0': 5,  '2-1-1': 9,  '2-1-2': 6,
  '3-0-0': 12, '3-0-1': 10, '3-0-2': 11,
  '3-1-0': 10, '3-1-1': 10, '3-1-2': 6,
}

const resultId = computed(() => matrix[answers.value.join('-')] ?? 3)
const result   = computed(() => store.products.find(p => p.id === resultId.value))

function pick(idx: number) {
  answers.value.push(idx)
  if (step.value < 3) step.value++
  else step.value = 4
}

const added = ref(false)
function addResult() {
  if (!result.value) return
  cart.addToCart(result.value)
  added.value = true
  setTimeout(() => added.value = false, 2000)
}

function restart() {
  step.value = 0
  answers.value = []
  added.value = false
}
</script>

<template>
  <section class="quiz-section">
    <div class="quiz-inner">

      <!-- Intro -->
      <div v-if="step === 0" class="quiz-intro">
        <div class="quiz-icon">☕</div>
        <p class="quiz-eyebrow">Coffee Personality Quiz</p>
        <h2 class="quiz-title">What's Your Perfect Coffee?</h2>
        <p class="quiz-sub">Answer 3 quick questions and we'll find the drink made for your moment.</p>
        <button class="quiz-start" @click="step = 1">Find My Coffee →</button>
      </div>

      <!-- Questions -->
      <div v-else-if="step >= 1 && step <= 3" class="quiz-q">
        <div class="quiz-progress">
          <div class="prog-bar" :style="{ width: ((step - 1) / 3 * 100) + '%' }"></div>
        </div>
        <p class="quiz-step">Question {{ step }} of 3</p>
        <div class="quiz-q-icon">{{ questions[step - 1].emoji }}</div>
        <h2 class="quiz-q-text">{{ questions[step - 1].text }}</h2>
        <div class="quiz-options">
          <button
            v-for="(opt, i) in questions[step - 1].options"
            :key="i"
            class="quiz-opt"
            @click="pick(i)"
          >
            <span class="opt-icon">{{ opt.icon }}</span>
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- Result -->
      <div v-else-if="step === 4 && result" class="quiz-result">
        <p class="res-label">✨ Your perfect match is...</p>
        <div class="res-card">
          <div class="res-cup">
            <div class="res-cup-bg" :style="{ background: result.gradient }"></div>
            <img :src="result.image" :alt="result.name" class="res-photo"
                 @error="(e) => (e.target as HTMLImageElement).style.display='none'"/>
          </div>
          <div class="res-body">
            <span class="res-cat">{{ result.category }}</span>
            <h2 class="res-name">{{ result.name }}</h2>
            <p class="res-desc">{{ result.description }}</p>
            <div class="res-stars" :style="{ color: result.accent }">
              {{ '★'.repeat(Math.round(result.rating)) }}{{ '☆'.repeat(5 - Math.round(result.rating)) }}
              <span class="res-revs">({{ result.reviews.toLocaleString() }} reviews)</span>
            </div>
            <div class="res-price">£{{ result.price.toFixed(2) }}</div>
            <div class="res-actions">
              <button class="res-order" :class="{ done: added }" @click="addResult">
                {{ added ? '✓ Added to Cart!' : '+ Order This Coffee' }}
              </button>
              <button class="res-retry" @click="restart">Try Again</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.quiz-section {
  background: linear-gradient(160deg, #fdf3e7 0%, #fef9f0 50%, #fdf6ec 100%);
  padding: 80px 24px;
}
.quiz-inner { max-width: 720px; margin: 0 auto; text-align: center; }

/* Intro */
.quiz-icon  { font-size: 52px; margin-bottom: 14px; animation: bob 2.5s ease-in-out infinite; }
@keyframes bob { 0%,100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-8px) rotate(5deg); } }
.quiz-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #c8813a; margin: 0 0 10px; }
.quiz-title { font-size: clamp(26px, 4vw, 40px); font-weight: 900; color: #1c1917; margin: 0 0 12px; letter-spacing: -1px; }
.quiz-sub   { font-size: 15px; color: #78716c; line-height: 1.65; margin: 0 0 32px; }
.quiz-start {
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 14px;
  padding: 15px 36px; font-size: 16px; font-weight: 800;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 8px 28px rgba(200,129,58,0.38);
}
.quiz-start:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(200,129,58,0.52); }

/* Progress bar */
.quiz-progress { height: 4px; background: #f0e8dc; border-radius: 4px; margin-bottom: 20px; overflow: hidden; }
.prog-bar { height: 100%; background: linear-gradient(90deg, #c8813a, #d4a060); border-radius: 4px; transition: width 0.4s ease; }

/* Question */
.quiz-step   { font-size: 12px; font-weight: 600; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; }
.quiz-q-icon { font-size: 44px; margin-bottom: 12px; }
.quiz-q-text { font-size: clamp(20px, 3.5vw, 30px); font-weight: 900; color: #1c1917; margin: 0 0 30px; letter-spacing: -0.5px; }

.quiz-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.quiz-opt {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px; border-radius: 14px; border: 2px solid #f0e8dc;
  background: #fff; cursor: pointer; text-align: left;
  font-size: 14px; font-weight: 600; color: #1c1917;
  transition: all 0.18s;
  box-shadow: 0 2px 8px rgba(44,16,8,0.05);
}
.quiz-opt:hover {
  border-color: #d4a060; background: #fdf6ec;
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,129,58,0.15);
}
.opt-icon { font-size: 22px; flex-shrink: 0; }

/* Result */
.res-label { font-size: 15px; font-weight: 700; color: #c8813a; margin: 0 0 22px; }
.res-card {
  display: grid; grid-template-columns: 200px 1fr;
  gap: 32px; align-items: center;
  background: #fff; border-radius: 22px; padding: 28px;
  box-shadow: 0 16px 48px rgba(44,16,8,0.1);
  border: 1px solid #f0e8dc; text-align: left;
}
@media (max-width: 600px) {
  .res-card { grid-template-columns: 1fr; justify-items: center; text-align: center; }
}
.res-cup {
  width: 180px; height: 180px; border-radius: 20px;
  overflow: hidden; position: relative;
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  flex-shrink: 0;
}
.res-cup-bg { position: absolute; inset: 0; }
.res-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.res-cat  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #c8813a; }
.res-name { font-size: 24px; font-weight: 900; color: #1c1917; margin: 6px 0 8px; letter-spacing: -0.5px; }
.res-desc { font-size: 13px; color: #78716c; line-height: 1.6; margin: 0 0 10px; }
.res-stars { font-size: 13px; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.res-revs  { font-size: 11px; color: #a8a29e; font-weight: 400; }
.res-price { font-size: 26px; font-weight: 900; color: #1c1917; margin-bottom: 18px; }
.res-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.res-order {
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 10px;
  padding: 12px 22px; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.18s;
}
.res-order:hover { transform: translateY(-1px); }
.res-order.done { background: linear-gradient(135deg, #059669, #10b981); }
.res-retry {
  background: none; border: 2px solid #f0e8dc; border-radius: 10px;
  padding: 12px 18px; font-size: 14px; font-weight: 600; color: #78716c;
  cursor: pointer; transition: all 0.15s;
}
.res-retry:hover { border-color: #c8813a; color: #c8813a; }
</style>
