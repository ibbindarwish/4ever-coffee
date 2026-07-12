<script setup lang="ts">
import { ref, computed } from 'vue'

const REFERRAL_CODE = 'WELCOME10'
const SHOP_URL = 'https://4ever-roastery.vercel.app/shop'
const REFERRAL_URL = `${SHOP_URL}?ref=${REFERRAL_CODE}`

const copied = ref(false)
const copiedText = ref(false)

const shareText = computed(() =>
  `☕ Just found the most amazing specialty coffee in London — 4ever Coffee Roastery!\n\nSingle-origin beans from Ethiopia, Colombia, Yemen and 11 other origins. Genuinely the best I've had.\n\nUse my code ${REFERRAL_CODE} for 10% off your first order 🎉\n\n${REFERRAL_URL}`
)

async function copyLink() {
  try { await navigator.clipboard.writeText(REFERRAL_URL) } catch {}
  copied.value = true
  setTimeout(() => { copied.value = false }, 2500)
}

async function shareNative() {
  if (navigator.share) {
    try {
      await navigator.share({ title: '4ever Coffee — 10% off for you', text: shareText.value, url: REFERRAL_URL })
      return
    } catch {}
  }
  copyLink()
}

function waShare() {
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText.value)}`, '_blank', 'noopener')
}

function twitterShare() {
  const t = `☕ Just discovered @4evercoffee — London's best specialty roastery. Use code ${REFERRAL_CODE} for 10% off! #SpecialtyCoffee #LondonCoffee`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(REFERRAL_URL)}`, '_blank', 'noopener')
}

function facebookShare() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(REFERRAL_URL)}`, '_blank', 'noopener')
}

function tiktokCaption() {
  const t = `POV: you just found the best coffee in London ☕✨ @4evercoffee has single-origin beans from 14 countries, a roastery you can visit, and ACTUALLY good atmosphere. Use code ${REFERRAL_CODE} for 10% off! 🔗 Link in bio`
  navigator.clipboard.writeText(t).catch(() => {})
  copiedText.value = true
  setTimeout(() => { copiedText.value = false }, 2500)
}
</script>

<template>
  <div class="refer-page">

    <!-- Hero -->
    <div class="refer-hero">
      <div class="refer-hero-orb refer-orb1"></div>
      <div class="refer-hero-orb refer-orb2"></div>
      <div class="refer-hero-inner">
        <div class="refer-eyebrow">Share the love</div>
        <h1 class="refer-headline">Give £10 off.<br>Get rewards back.</h1>
        <p class="refer-sub">Share 4ever Coffee with someone who loves great coffee — they get 10% off their first order, you earn 50 loyalty points when they buy.</p>
      </div>
    </div>

    <!-- Referral card -->
    <div class="refer-card-wrap">
      <div class="refer-card">
        <div class="refer-card-label">Your referral code</div>
        <div class="refer-code">{{ REFERRAL_CODE }}</div>
        <div class="refer-code-sub">Your friend uses this at checkout</div>

        <div class="refer-link-box">
          <input class="refer-link-input" :value="REFERRAL_URL" readonly @focus="($event.target as HTMLInputElement).select()" />
          <button class="refer-copy-btn" @click="copyLink">
            {{ copied ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
      </div>
    </div>

    <!-- How it works -->
    <div class="refer-how">
      <div class="refer-section-label">How it works</div>
      <div class="refer-steps">
        <div class="refer-step">
          <div class="refer-step-n">1</div>
          <div class="refer-step-text">
            <strong>Share your link or code</strong>
            <span>Send it on WhatsApp, Instagram, TikTok — anywhere</span>
          </div>
        </div>
        <div class="refer-step-arrow">→</div>
        <div class="refer-step">
          <div class="refer-step-n">2</div>
          <div class="refer-step-text">
            <strong>Friend orders for the first time</strong>
            <span>They get 10% off automatically at checkout</span>
          </div>
        </div>
        <div class="refer-step-arrow">→</div>
        <div class="refer-step">
          <div class="refer-step-n">3</div>
          <div class="refer-step-text">
            <strong>You earn 50 loyalty points</strong>
            <span>Added to your account — redeemable on your next order</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Share on each platform -->
    <div class="refer-platforms">
      <div class="refer-section-label">Share on your platforms</div>

      <div class="platform-share-grid">

        <!-- WhatsApp -->
        <div class="pshare-card">
          <div class="pshare-head">
            <div class="pshare-icon pshare-wa">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.854L0 24l6.335-1.513A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 01-5.022-1.382l-.36-.214-3.73.89.934-3.618-.235-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            </div>
            <div class="pshare-name">WhatsApp</div>
          </div>
          <p class="pshare-tip">Best for friends and family. The message is pre-written — just tap send.</p>
          <button class="pshare-btn pshare-btn-wa" @click="waShare">Send on WhatsApp →</button>
        </div>

        <!-- Instagram / TikTok -->
        <div class="pshare-card">
          <div class="pshare-head">
            <div class="pshare-icon pshare-tt">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </div>
            <div class="pshare-name">TikTok / Reels</div>
          </div>
          <p class="pshare-tip">Copy the pre-written caption and paste it as your video caption with your 4ever Coffee content.</p>
          <button class="pshare-btn pshare-btn-tt" @click="tiktokCaption">
            {{ copiedText ? '✓ Caption copied!' : 'Copy TikTok caption' }}
          </button>
        </div>

        <!-- Twitter / X -->
        <div class="pshare-card">
          <div class="pshare-head">
            <div class="pshare-icon pshare-tw">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
            <div class="pshare-name">X / Twitter</div>
          </div>
          <p class="pshare-tip">Tweet to the coffee community — @4evercoffee and the hashtags are already included.</p>
          <button class="pshare-btn pshare-btn-tw" @click="twitterShare">Post on X →</button>
        </div>

        <!-- Facebook -->
        <div class="pshare-card">
          <div class="pshare-head">
            <div class="pshare-icon pshare-fb">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div class="pshare-name">Facebook</div>
          </div>
          <p class="pshare-tip">Share to your Facebook timeline, groups, or in direct messages to friends who love coffee.</p>
          <button class="pshare-btn pshare-btn-fb" @click="facebookShare">Share on Facebook →</button>
        </div>

      </div>
    </div>

    <!-- Quick share card -->
    <div class="refer-native">
      <button class="refer-native-btn" @click="shareNative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share via your phone's share sheet
      </button>
    </div>

  </div>
</template>

<style scoped>
.refer-page {
  min-height: 100vh;
  background: #0d0704;
  color: #fdf6ec;
}

/* ── Hero ── */
.refer-hero {
  position: relative;
  overflow: hidden;
  padding: 80px 24px 64px;
  text-align: center;
}
.refer-hero-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.refer-orb1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(200,129,58,.2) 0%, transparent 70%);
  top: -200px; left: -150px;
}
.refer-orb2 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(212,160,96,.14) 0%, transparent 70%);
  bottom: -100px; right: -80px;
}
.refer-hero-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
.refer-eyebrow {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .18em; color: #d4a060; margin-bottom: 16px;
}
.refer-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 900;
  color: #fdf6ec;
  line-height: 1.1;
  letter-spacing: -.02em;
  margin-bottom: 16px;
  text-wrap: balance;
}
.refer-sub {
  font-size: 1rem;
  color: rgba(253,246,236,.55);
  line-height: 1.7;
}

/* ── Referral card ── */
.refer-card-wrap { padding: 0 24px 48px; display: flex; justify-content: center; }
.refer-card {
  background: linear-gradient(135deg, #1a0b06, #2c1208);
  border: 1px solid rgba(212,160,96,.3);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0,0,0,.4), 0 0 0 1px rgba(212,160,96,.08) inset;
}
.refer-card-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .14em; color: rgba(253,246,236,.45); margin-bottom: 12px;
}
.refer-code {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.8rem;
  font-weight: 900;
  color: #d4a060;
  letter-spacing: .1em;
  margin-bottom: 8px;
}
.refer-code-sub {
  font-size: .8rem;
  color: rgba(253,246,236,.35);
  margin-bottom: 20px;
}
.refer-link-box {
  display: flex;
  gap: 8px;
  background: rgba(0,0,0,.3);
  border: 1px solid rgba(212,160,96,.2);
  border-radius: 10px;
  padding: 4px 4px 4px 12px;
  align-items: center;
}
.refer-link-input {
  flex: 1;
  background: none;
  border: none;
  font-size: .78rem;
  color: rgba(253,246,236,.55);
  font-family: monospace;
  min-width: 0;
  outline: none;
}
.refer-copy-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: .82rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: opacity .15s;
}
.refer-copy-btn:hover { opacity: .9; }

/* ── How it works ── */
.refer-section-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .14em; color: rgba(253,246,236,.35);
  padding: 0 24px; margin-bottom: 20px;
}
.refer-how { padding: 0 24px 56px; max-width: 860px; margin: 0 auto; }
.refer-steps {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 580px) {
  .refer-steps { flex-direction: column; }
  .refer-step-arrow { transform: rotate(90deg); align-self: flex-start; padding-left: 20px; }
}
.refer-step {
  flex: 1;
  min-width: 160px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(212,160,96,.14);
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.refer-step-n {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff;
  font-size: .85rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.refer-step-text {
  display: flex; flex-direction: column; gap: 3px;
}
.refer-step-text strong {
  font-size: .88rem; font-weight: 700; color: #fdf6ec;
}
.refer-step-text span {
  font-size: .78rem; color: rgba(253,246,236,.45); line-height: 1.5;
}
.refer-step-arrow {
  font-size: 1.2rem;
  color: rgba(212,160,96,.4);
  padding-top: 22px;
  flex-shrink: 0;
}

/* ── Platform share ── */
.refer-platforms { padding: 0 24px 48px; max-width: 860px; margin: 0 auto; }
.platform-share-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (max-width: 540px) { .platform-share-grid { grid-template-columns: 1fr; } }

.pshare-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(212,160,96,.14);
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pshare-head { display: flex; align-items: center; gap: 10px; }
.pshare-icon {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
}
.pshare-icon svg { width: 20px; height: 20px; }
.pshare-wa  { background: rgba(37,211,102,.18); color: #25d366; }
.pshare-tt  { background: rgba(253,246,236,.08); color: #fdf6ec; }
.pshare-tw  { background: rgba(253,246,236,.08); color: #fdf6ec; }
.pshare-fb  { background: rgba(24,119,242,.18);  color: #4da3ff; }
.pshare-name { font-weight: 700; font-size: .9rem; color: #fdf6ec; }
.pshare-tip { font-size: .78rem; color: rgba(253,246,236,.4); line-height: 1.55; flex: 1; }

.pshare-btn {
  padding: 9px 14px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-size: .82rem;
  font-weight: 700;
  font-family: inherit;
  text-align: left;
  transition: opacity .12s;
}
.pshare-btn:hover { opacity: .85; }
.pshare-btn-wa { background: #25d366; color: #fff; }
.pshare-btn-tt { background: rgba(253,246,236,.1); color: #fdf6ec; border: 1px solid rgba(253,246,236,.15); }
.pshare-btn-tw { background: #000; color: #fff; border: 1px solid #333; }
.pshare-btn-fb { background: #1877f2; color: #fff; }

/* ── Native share ── */
.refer-native {
  padding: 0 24px 80px;
  display: flex;
  justify-content: center;
}
.refer-native-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 28px;
  background: rgba(212,160,96,.1);
  border: 1.5px solid rgba(212,160,96,.3);
  border-radius: 12px;
  color: #d4a060;
  font-size: .9rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background .12s, border-color .12s;
}
.refer-native-btn svg { width: 18px; height: 18px; }
.refer-native-btn:hover { background: rgba(212,160,96,.18); border-color: #d4a060; }
</style>