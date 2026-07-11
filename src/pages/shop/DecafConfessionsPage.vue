<script setup lang="ts">
import { ref } from 'vue'
import { useRoasteryStore } from '../../stores/roastery'

const rs = useRoasteryStore()

const confText = ref('')
const confReason = ref('')
const confSent = ref(false)

const REASONS = ['Doctor\'s orders', 'Pregnancy', 'Anxiety', 'Sleep', 'Fitness', 'Partner', 'Experiment', 'Other']

function submit() {
  if (!confText.value.trim() || !confReason.value) return
  rs.submitDecafConfession(confText.value.trim(), confReason.value)
  confText.value = ''
  confReason.value = ''
  confSent.value = true
  setTimeout(() => confSent.value = false, 3000)
}

const REASON_ICONS: Record<string, string> = {
  'Doctor\'s orders': '🩺', Pregnancy: '🤰', Anxiety: '😤', Sleep: '😴',
  Fitness: '🏃', Partner: '💑', Experiment: '🧪', Other: '🤷'
}
</script>

<template>
  <div class="dc-page">
    <div class="dc-hero">
      <p class="dc-eyebrow">Anonymous & Unjudged</p>
      <h1 class="dc-headline">Decaf Confessions</h1>
      <p class="dc-sub">A safe space for those who made the switch. We won't tell anyone.</p>
    </div>

    <div class="dc-body">

      <!-- Confess form -->
      <div class="confess-card">
        <h2 class="confess-title">Your Turn to Confess</h2>
        <p class="confess-note">Anonymous. Honest. No judgement — we've all been there.</p>
        <textarea v-model="confText" class="confess-input" rows="4"
                  placeholder="I switched to decaf because…" maxlength="300"></textarea>
        <div class="char-row">
          <span class="char-count">{{ confText.length }}/300</span>
        </div>
        <div class="reason-label">Why did you switch?</div>
        <div class="reason-chips">
          <button v-for="r in REASONS" :key="r"
                  class="reason-chip"
                  :class="{ selected: confReason === r }"
                  @click="confReason = r">
            {{ REASON_ICONS[r] }} {{ r }}
          </button>
        </div>
        <button class="submit-btn" :disabled="!confText.trim() || !confReason" @click="submit">
          {{ confSent ? '✓ Confession submitted!' : 'Submit Anonymously' }}
        </button>
      </div>

      <!-- Feed -->
      <div class="feed-section">
        <h2 class="feed-title">The Confession Wall</h2>
        <div class="feed-grid">
          <div v-for="c in rs.decafConfessions" :key="c.id" class="confession-card">
            <div class="conf-badge">{{ REASON_ICONS[c.reason] ?? '☕' }}</div>
            <p class="conf-text">"{{ c.text }}"</p>
            <div class="conf-meta">
              <span class="conf-reason">{{ c.reason }}</span>
              <span class="conf-date">{{ c.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Decaf CTA -->
      <div class="decaf-cta">
        <div class="decaf-cta-text">
          <div class="decaf-cta-title">Our Decaf isn't a compromise.</div>
          <div class="decaf-cta-sub">Swiss water-processed Colombian Supremo. Zero caffeine. Full flavour. Actually delicious.</div>
        </div>
        <RouterLink to="/shop/menu" class="decaf-shop-btn">Try Our Decaf →</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dc-page { min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }

.dc-hero { background: linear-gradient(135deg, #1c1008, #2d1a0a); padding: 72px 24px 56px; text-align: center; }
.dc-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 12px; }
.dc-headline { font-size: clamp(36px, 6vw, 56px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.dc-sub { font-size: 15px; color: #78716c; margin: 0; }

.dc-body { max-width: 860px; margin: 0 auto; padding: 48px 24px 80px; }

.confess-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 32px 28px; margin-bottom: 48px; }
.confess-title { font-size: 20px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 6px; }
.confess-note { font-size: 13px; color: #a8a29e; margin: 0 0 18px; }
.confess-input { width: 100%; padding: 14px 16px; border: 1.5px solid #e7e5e4; border-radius: 12px; font-size: 15px; font-family: 'Playfair Display', serif; font-style: italic; color: #1c1917; resize: none; background: #faf7f2; box-sizing: border-box; }
.confess-input:focus { outline: none; border-color: #c8813a; }
.char-row { text-align: right; margin: 6px 0 16px; }
.char-count { font-size: 11px; color: #a8a29e; }
.reason-label { font-size: 12px; font-weight: 700; color: #57534e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
.reason-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.reason-chip { background: #faf7f2; border: 1.5px solid #e7e5e4; border-radius: 20px; padding: 7px 14px; font-size: 12px; font-weight: 600; color: #57534e; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.reason-chip:hover { border-color: #c8813a; color: #c8813a; }
.reason-chip.selected { background: #fdf3e7; border-color: #c8813a; color: #92400e; }
.submit-btn { background: #1c1917; color: #fff; border: none; border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.submit-btn:not(:disabled):hover { background: #2d1a0a; }

.feed-section { margin-bottom: 48px; }
.feed-title { font-size: 22px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 22px; }
.feed-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
.confession-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 20px 18px; display: flex; gap: 14px; }
.conf-badge { font-size: 24px; flex-shrink: 0; }
.conf-text { font-size: 14px; color: #1c1917; font-style: italic; font-family: 'Playfair Display', serif; line-height: 1.65; margin: 0 0 10px; }
.conf-meta { display: flex; align-items: center; gap: 10px; }
.conf-reason { font-size: 10px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.08em; background: #fdf3e7; padding: 3px 10px; border-radius: 10px; }
.conf-date { font-size: 10px; color: #a8a29e; }

.decaf-cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; background: #1c1917; border-radius: 20px; padding: 28px 32px; flex-wrap: wrap; }
.decaf-cta-title { font-size: 18px; font-weight: 800; color: #fdf6ec; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
.decaf-cta-sub { font-size: 13px; color: #78716c; line-height: 1.6; }
.decaf-shop-btn { display: inline-block; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; text-decoration: none; border-radius: 12px; padding: 13px 24px; font-size: 14px; font-weight: 700; white-space: nowrap; }
</style>