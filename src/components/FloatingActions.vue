<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const shareOpen = ref(false)
const copied = ref(false)

const isShop = computed(() => route.path.startsWith('/shop'))

const SHOP_URL = 'https://4ever-roastery.vercel.app/shop'
const SHARE_TEXT = '☕ Discover 4ever Coffee — London\'s best specialty roastery! Single-origin beans, amazing atmosphere, free delivery over £30.'
// Replace with your real WhatsApp Business number (digits only, with country code)
const WA_NUMBER = '447000000000'

async function share() {
  if (navigator.share) {
    try {
      await navigator.share({ title: '4ever Coffee', text: SHARE_TEXT, url: SHOP_URL })
      return
    } catch {}
  }
  shareOpen.value = !shareOpen.value
}

function waBusiness() {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello 4ever Coffee! ☕ I\'d like to know more.')}`, '_blank', 'noopener')
}

function waShare() {
  window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + '\n\n' + SHOP_URL)}`, '_blank', 'noopener')
  shareOpen.value = false
}

function twitterShare() {
  const txt = encodeURIComponent(SHARE_TEXT)
  const url = encodeURIComponent(SHOP_URL)
  const tags = 'SpecialtyCoffee,LondonCoffee,4everCoffee'
  window.open(`https://twitter.com/intent/tweet?text=${txt}&url=${url}&hashtags=${tags}`, '_blank', 'noopener')
  shareOpen.value = false
}

function facebookShare() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHOP_URL)}`, '_blank', 'noopener')
  shareOpen.value = false
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(SHOP_URL)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
  shareOpen.value = false
}
</script>

<template>
  <template v-if="isShop">
    <!-- Backdrop to close popover -->
    <div v-if="shareOpen" class="fab-backdrop" @click="shareOpen = false" />

    <!-- Share popover -->
    <Transition name="pop-up">
      <div v-if="shareOpen" class="share-pop">
        <div class="share-pop-head">Share 4ever Coffee</div>
        <div class="share-pop-grid">
          <button class="spb spb-wa" @click="waShare">
            <svg viewBox="0 0 24 24" fill="currentColor" class="spb-icon"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.854L0 24l6.335-1.513A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 01-5.022-1.382l-.36-.214-3.73.89.934-3.618-.235-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            WhatsApp
          </button>
          <button class="spb spb-tw" @click="twitterShare">
            <svg viewBox="0 0 24 24" fill="currentColor" class="spb-icon"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X / Twitter
          </button>
          <button class="spb spb-fb" @click="facebookShare">
            <svg viewBox="0 0 24 24" fill="currentColor" class="spb-icon"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
          <button class="spb spb-copy" @click="copyLink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="spb-icon"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {{ copied ? '✓ Copied!' : 'Copy link' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- FAB stack -->
    <div class="fab-stack">
      <button class="fab fab-share" @click="share" :class="{ active: shareOpen }" :title="'Share 4ever Coffee'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
      <button class="fab fab-wa" @click="waBusiness" title="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.854L0 24l6.335-1.513A11.949 11.949 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 01-5.022-1.382l-.36-.214-3.73.89.934-3.618-.235-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
        </svg>
      </button>
    </div>
  </template>
</template>

<style scoped>
.fab-backdrop {
  position: fixed;
  inset: 0;
  z-index: 8998;
}

/* ── FAB stack ── */
.fab-stack {
  position: fixed;
  bottom: 28px;
  right: 20px;
  z-index: 8999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.fab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(0,0,0,.35);
  transition: transform .15s ease, box-shadow .15s ease;
  flex-shrink: 0;
}
.fab:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(0,0,0,.45); }
.fab svg  { width: 22px; height: 22px; }

.fab-wa {
  background: #25d366;
  color: #fff;
}
.fab-wa:hover { background: #1ebe5e; }

.fab-share {
  background: #1a0b06;
  border: 1.5px solid rgba(212,160,96,.4);
  color: #d4a060;
}
.fab-share:hover { background: #2c1008; border-color: #d4a060; }
.fab-share.active { background: #c8813a; color: #fff; border-color: #c8813a; }

/* ── Share popover ── */
.share-pop {
  position: fixed;
  bottom: 96px;
  right: 16px;
  z-index: 9000;
  background: #1a0b06;
  border: 1px solid rgba(212,160,96,.3);
  border-radius: 16px;
  padding: 16px;
  width: 220px;
  box-shadow: 0 12px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(212,160,96,.08);
}
.share-pop-head {
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: rgba(253,246,236,.4);
  margin-bottom: 10px;
}
.share-pop-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spb {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: .875rem;
  font-weight: 600;
  font-family: inherit;
  text-align: left;
  transition: background .12s;
}
.spb-icon { width: 18px; height: 18px; flex-shrink: 0; }

.spb-wa   { background: rgba(37,211,102,.15);  color: #25d366; }
.spb-wa:hover { background: rgba(37,211,102,.25); }
.spb-tw   { background: rgba(253,246,236,.06); color: #fdf6ec; }
.spb-tw:hover { background: rgba(253,246,236,.12); }
.spb-fb   { background: rgba(24,119,242,.15);  color: #4da3ff; }
.spb-fb:hover { background: rgba(24,119,242,.25); }
.spb-copy { background: var(--accentbg, rgba(200,129,58,.1)); color: #d4a060; }
.spb-copy:hover { background: rgba(200,129,58,.2); }

/* ── Transitions ── */
.pop-up-enter-active { transition: transform .22s cubic-bezier(.34,1.56,.64,1), opacity .18s ease; }
.pop-up-leave-active { transition: transform .15s ease, opacity .15s ease; }
.pop-up-enter-from   { transform: translateY(12px) scale(.95); opacity: 0; }
.pop-up-leave-to     { transform: translateY(8px) scale(.97); opacity: 0; }
</style>