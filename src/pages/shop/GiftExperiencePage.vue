<script setup lang="ts">
import { ref } from 'vue'

interface GiftBox {
  id: string; name: string; price: string; emoji: string
  tagline: string; includes: string[]; bestFor: string; highlight: boolean
}

const BOXES: GiftBox[] = [
  {
    id: 'discovery', name: 'The Discovery Box', price: '£49', emoji: '🎁',
    tagline: 'For the curious coffee drinker',
    includes: ['3 × 250g single-origin bags', 'Tasting cards for each origin', 'Handwritten note', 'Brew guide booklet'],
    bestFor: 'Someone new to specialty coffee',
    highlight: false,
  },
  {
    id: 'connoisseur', name: 'The Connoisseur', price: '£89', emoji: '👑',
    tagline: 'For the coffee lover who has everything',
    includes: ['5 × 250g rare single-origins', 'Personalised tasting journal', 'Cupping spoon (engraved)', 'Monthly subscription option', 'Private roaster call (15 min)'],
    bestFor: 'The serious coffee enthusiast',
    highlight: true,
  },
  {
    id: 'couple', name: 'Brew Together', price: '£65', emoji: '☕',
    tagline: 'Share the ritual',
    includes: ['2 × 500g complementary origins', 'Two pour-over filters', 'Paired brewing guide', 'Gift ribbon & kraft packaging'],
    bestFor: 'A couple or two best friends',
    highlight: false,
  },
  {
    id: 'monthly', name: 'Monthly Ritual', price: '£39/mo', emoji: '📦',
    tagline: '3 months of discovery, delivered',
    includes: ['2 × 250g bags every 4 weeks', 'Curated by our head roaster', 'Origin story card each month', 'Cancel anytime'],
    bestFor: 'The gift that keeps giving',
    highlight: false,
  },
]

const selected = ref<string | null>(null)
const recipientName = ref('')
const message = ref('')
const ordered = ref(false)

function order() {
  if (!selected.value || !recipientName.value.trim()) return
  ordered.value = true
}
</script>

<template>
  <div class="ge-page">
    <div class="ge-hero">
      <p class="ge-eyebrow">Give Something Meaningful</p>
      <h1 class="ge-headline">Gift Experiences</h1>
      <p class="ge-sub">Thoughtfully curated, beautifully packaged, personally delivered.</p>
    </div>

    <div class="ge-body">
      <div v-if="!ordered">
        <!-- Box grid -->
        <div class="box-grid">
          <div v-for="box in BOXES" :key="box.id"
               class="box-card"
               :class="{ highlighted: box.highlight, chosen: selected === box.id }"
               @click="selected = box.id">
            <div v-if="box.highlight" class="box-badge">Most Gifted</div>
            <div class="box-emoji">{{ box.emoji }}</div>
            <div class="box-name">{{ box.name }}</div>
            <div class="box-tagline">{{ box.tagline }}</div>
            <div class="box-price">{{ box.price }}</div>
            <ul class="box-includes">
              <li v-for="item in box.includes" :key="item">{{ item }}</li>
            </ul>
            <div class="box-bestfor">Best for: <strong>{{ box.bestFor }}</strong></div>
            <div class="box-select-indicator">{{ selected === box.id ? '✓ Selected' : 'Select' }}</div>
          </div>
        </div>

        <!-- Personalise -->
        <div v-if="selected" class="personalise-card">
          <h2 class="personalise-title">Personalise Your Gift</h2>
          <div class="form-row">
            <label class="form-label">Recipient's Name</label>
            <input v-model="recipientName" class="form-input" placeholder="e.g. Ahmad, Sarah…" />
          </div>
          <div class="form-row">
            <label class="form-label">Personal Message (optional)</label>
            <textarea v-model="message" class="form-textarea" rows="3" placeholder="We'll print this on a card inside the box…" maxlength="200"></textarea>
            <span class="char-count">{{ message.length }}/200</span>
          </div>
          <button class="ge-order-btn" :disabled="!recipientName.trim()" @click="order">
            Send This Gift →
          </button>
        </div>
      </div>

      <!-- Success state -->
      <div v-else class="ge-success">
        <div class="success-icon">🎉</div>
        <h2 class="success-title">Gift Order Received</h2>
        <p class="success-sub">We'll pack and ship {{ BOXES.find(b => b.id === selected)?.name }} for {{ recipientName }} within 24 hours.<br/>They're going to love it.</p>
        <RouterLink to="/shop" class="success-home-btn">Back to Shop</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ge-page { min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }
.ge-hero { background: linear-gradient(135deg, #1c1008, #2d1a0a); padding: 72px 24px 56px; text-align: center; }
.ge-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 12px; }
.ge-headline { font-size: clamp(36px, 6vw, 56px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.ge-sub { font-size: 16px; color: #78716c; margin: 0; }

.ge-body { max-width: 1080px; margin: 0 auto; padding: 48px 24px 80px; }

.box-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 32px; }
.box-card { background: #fff; border: 2px solid #f0ebe4; border-radius: 20px; padding: 28px 22px; cursor: pointer; transition: all 0.2s; position: relative; }
.box-card:hover { border-color: #c8813a; transform: translateY(-3px); box-shadow: 0 8px 28px rgba(28,16,8,0.1); }
.box-card.highlighted { border-color: #d4a060; background: #fff9f0; }
.box-card.chosen { border-color: #c8813a; background: #fff3e6; box-shadow: 0 0 0 3px rgba(200,129,58,0.15); }
.box-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #d4a060; color: #fff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 14px; border-radius: 20px; white-space: nowrap; }
.box-emoji { font-size: 40px; margin-bottom: 12px; }
.box-name { font-size: 17px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
.box-tagline { font-size: 12px; color: #78716c; margin-bottom: 12px; }
.box-price { font-size: 24px; font-weight: 900; color: #c8813a; margin-bottom: 14px; font-family: 'Playfair Display', serif; }
.box-includes { padding: 0 0 0 16px; margin: 0 0 14px; font-size: 12px; color: #57534e; line-height: 1.8; }
.box-bestfor { font-size: 11px; color: #a8a29e; margin-bottom: 16px; }
.box-bestfor strong { color: #1c1917; }
.box-select-indicator { font-size: 12px; font-weight: 700; color: #c8813a; text-align: center; }

.personalise-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 32px 28px; max-width: 560px; }
.personalise-title { font-size: 20px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 22px; }
.form-row { margin-bottom: 16px; position: relative; }
.form-label { display: block; font-size: 12px; font-weight: 700; color: #57534e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
.form-input { width: 100%; padding: 12px 16px; border: 1.5px solid #e7e5e4; border-radius: 10px; font-size: 14px; font-family: inherit; background: #faf7f2; box-sizing: border-box; }
.form-textarea { width: 100%; padding: 12px 16px; border: 1.5px solid #e7e5e4; border-radius: 10px; font-size: 14px; font-family: inherit; background: #faf7f2; resize: none; box-sizing: border-box; }
.char-count { font-size: 11px; color: #a8a29e; position: absolute; right: 0; top: 0; }
.ge-order-btn { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; padding: 14px 32px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; margin-top: 8px; }
.ge-order-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ge-order-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(200,129,58,0.4); }

.ge-success { text-align: center; padding: 40px 24px; }
.success-icon { font-size: 72px; margin-bottom: 20px; }
.success-title { font-size: 32px; font-weight: 900; color: #1c1917; font-family: 'Playfair Display', serif; margin-bottom: 14px; }
.success-sub { font-size: 16px; color: #57534e; line-height: 1.7; margin-bottom: 28px; }
.success-home-btn { display: inline-block; background: #1c1917; color: #fff; text-decoration: none; border-radius: 12px; padding: 14px 28px; font-size: 15px; font-weight: 700; }
</style>