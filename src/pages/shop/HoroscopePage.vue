<script setup lang="ts">
import { ref } from 'vue'

interface Sign {
  name: string; symbol: string; emoji: string; dates: string
  coffee: string; brew: string; energy: string
  reading: string; power: string
}

const SIGNS: Sign[] = [
  { name: 'Aries', symbol: '♈', emoji: '🐏', dates: 'Mar 21 – Apr 19', coffee: 'Ethiopian Yirgacheffe', brew: 'Espresso', energy: '🔥 Fiery', reading: 'You need something as bold and unapologetic as you are. The Ethiopian\'s bright acidity and explosive floral notes match your trailblazing spirit perfectly. Pull two shots. You deserve it.', power: 'First crack energy' },
  { name: 'Taurus', symbol: '♉', emoji: '🐂', dates: 'Apr 20 – May 20', coffee: 'Brazilian Santos', brew: 'French Press', energy: '🌿 Grounded', reading: 'You crave the familiar and the indulgent. A full-bodied Brazilian with chocolate and almond notes, pressed slow and sipped in your favourite chair — that\'s your cosmic alignment this week.', power: 'Sensory pleasure' },
  { name: 'Gemini', symbol: '♊', emoji: '👯', dates: 'May 21 – Jun 20', coffee: 'Panama Geisha', brew: 'V60 then Espresso', energy: '💨 Dual-natured', reading: 'Why choose one when you can have the complexity of a Geisha — fruity one moment, floral the next? Make it twice this week: once as a pour-over, once as an espresso. Two coffees, one you.', power: 'Infinite versatility' },
  { name: 'Cancer', symbol: '♋', emoji: '🦀', dates: 'Jun 21 – Jul 22', coffee: 'Colombia Supremo', brew: 'Latte', energy: '🌙 Nurturing', reading: 'You deserve comfort and warmth this week. A creamy Colombian latte is your hug in a cup — balanced, gentle, never harsh. Drink it slowly, preferably while calling someone you love.', power: 'Deep comfort' },
  { name: 'Leo', symbol: '♌', emoji: '🦁', dates: 'Jul 23 – Aug 22', coffee: 'Kenya AA', brew: 'Flat White', energy: '☀️ Radiant', reading: 'Kenya AA is the king of single-origins and you deserve nothing less. Bold, memorable, impossible to ignore. Like you. The complex blackcurrant finish lingers long after you\'ve left the room.', power: 'Unforgettable presence' },
  { name: 'Virgo', symbol: '♍', emoji: '👩‍🌾', dates: 'Aug 23 – Sep 22', coffee: 'Rwanda Bourbon', brew: 'AeroPress', energy: '🔬 Precise', reading: 'Your analytical mind deserves a coffee with layers to dissect. Rwanda Bourbon rewards precision — dial in your AeroPress to the gram, and you\'ll discover something new every morning.', power: 'Mastery through detail' },
  { name: 'Libra', symbol: '♎', emoji: '⚖️', dates: 'Sep 23 – Oct 22', coffee: 'Guatemala Antigua', brew: 'Chemex', energy: '🎨 Balanced', reading: 'You seek harmony in all things. Guatemala Antigua\'s perfectly balanced body — not too bright, not too heavy — is your mirror this week. Beautiful in both form and flavour.', power: 'Perfect equilibrium' },
  { name: 'Scorpio', symbol: '♏', emoji: '🦂', dates: 'Oct 23 – Nov 21', coffee: 'Yemen Mokha', brew: 'Turkish Coffee', energy: '🌑 Intense', reading: 'No coffee on earth is as ancient, as mysterious, or as misunderstood as Yemen Mokha. It was made for you. Wild, fermented, complex — it keeps its secrets, just like you do.', power: 'Ancient power' },
  { name: 'Sagittarius', symbol: '♐', emoji: '🏹', dates: 'Nov 22 – Dec 21', coffee: 'Ethiopia Sidama', brew: 'Cold Brew', energy: '🌏 Adventurous', reading: 'You were born to explore. Cold brew a Sidama overnight — the long, slow extraction mirrors your commitment to the journey over the destination. Drink it anywhere. Ideally somewhere new.', power: 'Boundless curiosity' },
  { name: 'Capricorn', symbol: '♑', emoji: '🐐', dates: 'Dec 22 – Jan 19', coffee: 'Colombia Huila', brew: 'Moka Pot', energy: '⛰️ Ambitious', reading: 'You do everything with purpose and craft. A Moka Pot demands patience and discipline — and rewards you with an espresso-strength brew that fuels the climb. You wouldn\'t have it any other way.', power: 'Disciplined excellence' },
  { name: 'Aquarius', symbol: '♒', emoji: '🏺', dates: 'Jan 20 – Feb 18', coffee: 'Panama Geisha Natural', brew: 'Siphon', energy: '⚡ Visionary', reading: 'You refuse to do things the ordinary way. The siphon brew method was practically invented for you — theatrical, scientific, and producing flavours most people have never even tasted.', power: 'Revolutionary thinking' },
  { name: 'Pisces', symbol: '♓', emoji: '🐟', dates: 'Feb 19 – Mar 20', coffee: 'Rwanda Honey Process', brew: 'Pour-over', energy: '🌊 Dreamy', reading: 'You move between worlds — between the real and the imagined. A honey-processed Rwanda has that same in-between magic: fruity but not wild, sweet but not obvious. Sip it slowly. Dream deeply.', power: 'Emotional depth' },
]

const selected = ref<Sign | null>(null)
const today = new Date()
const weekNum = Math.floor(today.getDate() / 7) + 1
</script>

<template>
  <div class="horo-page">
    <div class="horo-hero">
      <p class="horo-eyebrow">Weekly Reading</p>
      <h1 class="horo-headline">Coffee Horoscope</h1>
      <p class="horo-sub">The stars have aligned your cup. Week {{ weekNum }} of {{ today.toLocaleString('default', { month: 'long' }) }}.</p>
    </div>

    <div class="horo-body">
      <!-- Sign picker -->
      <div v-if="!selected" class="sign-grid">
        <button v-for="s in SIGNS" :key="s.name" class="sign-btn" @click="selected = s">
          <span class="sign-emoji">{{ s.emoji }}</span>
          <span class="sign-symbol">{{ s.symbol }}</span>
          <span class="sign-name">{{ s.name }}</span>
          <span class="sign-dates">{{ s.dates }}</span>
        </button>
      </div>

      <!-- Reading -->
      <div v-else class="reading-card">
        <button class="back-btn" @click="selected = null">← Change Sign</button>
        <div class="reading-header">
          <span class="reading-emoji">{{ selected.emoji }}</span>
          <div>
            <div class="reading-sign">{{ selected.symbol }} {{ selected.name }}</div>
            <div class="reading-dates">{{ selected.dates }}</div>
            <div class="reading-energy">{{ selected.energy }}</div>
          </div>
        </div>
        <div class="reading-divider"></div>
        <p class="reading-text">{{ selected.reading }}</p>
        <div class="reading-coffee-wrap">
          <div class="rcw-label">Your bean this week</div>
          <div class="rcw-coffee">{{ selected.coffee }}</div>
          <div class="rcw-brew">Best as: <strong>{{ selected.brew }}</strong></div>
          <div class="rcw-power">Power word: <em>{{ selected.power }}</em></div>
        </div>
        <RouterLink to="/shop/menu" class="horo-shop-btn">Find Your Bean →</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horo-page { min-height: 100vh; background: #0d0603; font-family: 'Inter', sans-serif; }

.horo-hero { background: linear-gradient(180deg, #0d0603 0%, #1c1008 100%); padding: 72px 24px 56px; text-align: center; border-bottom: 1px solid rgba(212,160,96,0.1); }
.horo-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.16em; margin: 0 0 12px; }
.horo-headline { font-size: clamp(36px, 6vw, 60px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.horo-sub { font-size: 15px; color: #57534e; margin: 0; }

.horo-body { max-width: 1080px; margin: 0 auto; padding: 48px 24px 80px; }

.sign-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.sign-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,160,96,0.12); border-radius: 16px; padding: 22px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all 0.2s; font-family: inherit; }
.sign-btn:hover { background: rgba(212,160,96,0.08); border-color: rgba(212,160,96,0.4); transform: translateY(-3px); }
.sign-emoji { font-size: 30px; margin-bottom: 4px; }
.sign-symbol { font-size: 18px; color: #d4a060; font-weight: 800; }
.sign-name { font-size: 13px; font-weight: 700; color: #fdf6ec; }
.sign-dates { font-size: 10px; color: #57534e; }

.reading-card { max-width: 680px; margin: 0 auto; }
.back-btn { background: none; border: 1px solid rgba(255,255,255,0.1); color: #78716c; border-radius: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; font-family: inherit; margin-bottom: 28px; }
.reading-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
.reading-emoji { font-size: 56px; }
.reading-sign { font-size: 26px; font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; }
.reading-dates { font-size: 13px; color: #57534e; margin: 4px 0; }
.reading-energy { font-size: 14px; color: #d4a060; font-weight: 700; margin-top: 4px; }
.reading-divider { height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 24px; }
.reading-text { font-size: 17px; color: #a8a29e; line-height: 1.8; font-style: italic; font-family: 'Playfair Display', serif; margin: 0 0 28px; }
.reading-coffee-wrap { background: rgba(212,160,96,0.07); border: 1px solid rgba(212,160,96,0.2); border-radius: 16px; padding: 22px 24px; margin-bottom: 24px; }
.rcw-label { font-size: 10px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px; }
.rcw-coffee { font-size: 20px; font-weight: 900; color: #d4a060; font-family: 'Playfair Display', serif; margin-bottom: 8px; }
.rcw-brew { font-size: 13px; color: #78716c; margin-bottom: 4px; }
.rcw-brew strong { color: #fdf6ec; }
.rcw-power { font-size: 13px; color: #78716c; }
.rcw-power em { color: #d4a060; font-style: normal; font-weight: 600; }
.horo-shop-btn { display: inline-block; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; text-decoration: none; border-radius: 12px; padding: 14px 28px; font-size: 15px; font-weight: 700; transition: transform 0.2s; }
.horo-shop-btn:hover { transform: translateY(-2px); }
</style>