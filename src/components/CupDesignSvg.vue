<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size:           'sm' | 'md' | 'lg'
  scale?:         number
  bodyLight:      string
  bodyDark:       string
  sleeveColor:    string
  borderColor:    string
  logoColor:      string
  logoStyle:      'circle4' | 'none'
  mainText:       string
  mainFontSize?:  number
  mainSpacing?:   number
  subText:        string
  subFontSize?:   number
  subSpacing?:    number
  showSteam:      boolean
  steamColor:     string
  font:           string
}>()

const BASE = { sm: { w: 108, h: 176 }, md: { w: 140, h: 228 }, lg: { w: 174, h: 283 } }
const s    = computed(() => props.scale ?? 1)
const W    = computed(() => Math.round(BASE[props.size].w * s.value))
const H    = computed(() => Math.round(BASE[props.size].h * s.value))

const uid    = (n: string) => `cd-${n}-${props.size}`
const bgFill = computed(() => `url(#${uid('bg')})`)
const slFill = computed(() => `url(#${uid('sl')})`)
const shFlt  = computed(() => `url(#${uid('sh')})`)
const gwFlt  = computed(() => `url(#${uid('gw')})`)

const mfs  = computed(() => props.mainFontSize ?? 8.5)
const sfs  = computed(() => props.subFontSize  ?? 6)
const msp  = computed(() => props.mainSpacing  ?? 3)
const ssp  = computed(() => props.subSpacing   ?? 2)
</script>

<template>
  <svg
    :width="W" :height="H"
    viewBox="0 0 160 260"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
    class="cup-design-svg"
  >
    <defs>
      <!-- Body gradient — subtle cylindrical shading -->
      <linearGradient :id="uid('bg')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   :stop-color="bodyDark"/>
        <stop offset="14%"  :stop-color="bodyLight"/>
        <stop offset="50%"  :stop-color="bodyLight"/>
        <stop offset="86%"  :stop-color="bodyLight"/>
        <stop offset="100%" :stop-color="bodyDark"/>
      </linearGradient>
      <!-- Sleeve gradient -->
      <linearGradient :id="uid('sl')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   :stop-color="sleeveColor" stop-opacity="0.05"/>
        <stop offset="10%"  :stop-color="sleeveColor" stop-opacity="0.92"/>
        <stop offset="22%"  :stop-color="sleeveColor"/>
        <stop offset="78%"  :stop-color="sleeveColor"/>
        <stop offset="90%"  :stop-color="sleeveColor" stop-opacity="0.92"/>
        <stop offset="100%" :stop-color="sleeveColor" stop-opacity="0.05"/>
      </linearGradient>
      <!-- Rim gradient -->
      <linearGradient :id="uid('rim')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   :stop-color="bodyDark"/>
        <stop offset="50%"  :stop-color="bodyLight"/>
        <stop offset="100%" :stop-color="bodyDark"/>
      </linearGradient>
      <!-- Drop shadow — dy large so it falls BELOW cup, not inside -->
      <filter :id="uid('sh')" x="-28%" y="-5%" width="156%" height="175%">
        <feDropShadow dx="0" dy="55" stdDeviation="13" flood-color="#1a0a04" flood-opacity="0.22"/>
      </filter>
      <!-- Logo glow -->
      <filter :id="uid('gw')" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- ── STEAM (rises from open rim) ── -->
    <g v-if="showSteam" class="steam-group">
      <path class="sp sp1" d="M55,72 C51,60 59,52 55,40"
            fill="none" :stroke="steamColor" stroke-width="2.6" stroke-linecap="round"/>
      <path class="sp sp2" d="M80,68 C76,56 84,48 80,36"
            fill="none" :stroke="steamColor" stroke-width="2.6" stroke-linecap="round"/>
      <path class="sp sp3" d="M105,72 C101,60 109,52 105,40"
            fill="none" :stroke="steamColor" stroke-width="2.6" stroke-linecap="round"/>
    </g>

    <!-- ── CUP BODY ── -->
    <g :filter="shFlt">
      <path d="M22,80 L36,242 Q36,254 80,256 Q124,254 124,242 L138,80 Z" :fill="bgFill"/>
    </g>

    <!-- Bottom oval -->
    <ellipse cx="80" cy="249" rx="44" ry="7" :fill="bodyDark"/>

    <!-- ── OPEN RIM — thin paper edge ── -->
    <ellipse cx="80" cy="80" rx="58" ry="5.5" :fill="`url(#${uid('rim')})`"/>
    <ellipse cx="80" cy="79" rx="52" ry="4"   :fill="bodyDark" opacity="0.55"/>
    <!-- Coffee interior -->
    <ellipse cx="80" cy="78" rx="46" ry="3.5" fill="#0e0806"/>

    <!-- ── SLEEVE ── -->
    <path d="M26,118 L22,194 Q80,202 138,194 L134,118 Q80,122 26,118 Z" :fill="slFill"/>
    <!-- Sleeve border lines -->
    <path d="M26,118 Q80,122 134,118"
          fill="none" :stroke="borderColor" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M22,194 Q80,202 138,194"
          fill="none" :stroke="borderColor" stroke-width="2.2" stroke-linecap="round"/>
    <!-- Subtle sleeve grooves -->
    <line x1="44"  y1="120" x2="40"  y2="196" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    <line x1="116" y1="120" x2="120" y2="196" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

    <!-- ── LOGO — centered on sleeve ── -->
    <template v-if="logoStyle === 'circle4'">
      <!-- Filled badge circle -->
      <circle cx="80" cy="153" r="25" :fill="logoColor" :filter="gwFlt"/>
      <!-- Inner precision ring -->
      <circle cx="80" cy="153" r="21" stroke="white" stroke-width="0.75" fill="none" opacity="0.18"/>
      <!-- Cardinal accent dots -->
      <circle cx="80"  cy="132" r="1" fill="white" opacity="0.25"/>
      <circle cx="101" cy="153" r="1" fill="white" opacity="0.25"/>
      <circle cx="80"  cy="174" r="1" fill="white" opacity="0.25"/>
      <circle cx="59"  cy="153" r="1" fill="white" opacity="0.25"/>
      <!-- "4" lettermark -->
      <path d="M85,135 L63,157 L97,157 M85,135 L85,170"
            fill="none" stroke="#fff4e0" stroke-width="4.5"
            stroke-linecap="round" stroke-linejoin="round"/>
    </template>

    <!-- ── SLEEVE TEXT ── -->
    <!-- Main text -->
    <text v-if="mainText"
          x="80" :y="logoStyle === 'circle4' ? 185 : 158"
          :font-family="font"
          :font-size="mfs" font-weight="bold"
          :fill="borderColor" text-anchor="middle"
          :letter-spacing="msp">
      {{ mainText.toUpperCase().slice(0, 22) }}
    </text>
    <!-- Diamond accents flanking main text -->
    <template v-if="mainText && logoStyle === 'circle4'">
      <polygon :points="`34,181 36,185 34,189 32,185`" :fill="borderColor" opacity="0.45"/>
      <polygon :points="`126,181 128,185 126,189 124,185`" :fill="borderColor" opacity="0.45"/>
    </template>

    <!-- Sub text -->
    <text v-if="subText"
          x="80" :y="logoStyle === 'circle4' ? 197 : 172"
          font-family="Arial,sans-serif"
          :font-size="sfs" :fill="borderColor" opacity="0.58"
          text-anchor="middle" :letter-spacing="ssp">
      {{ subText.toUpperCase().slice(0, 28) }}
    </text>
  </svg>
</template>

<style scoped>
.cup-design-svg { display: block; }
.sp { transform-box: fill-box; transform-origin: bottom center; }
.sp1 { animation: rise 2.8s ease-in-out infinite 0s; }
.sp2 { animation: rise 2.8s ease-in-out infinite 0.6s; }
.sp3 { animation: rise 2.8s ease-in-out infinite 1.2s; }
@keyframes rise {
  0%   { transform: translateY(4px) scaleX(1);    opacity: 0; }
  22%  { opacity: 0.75; }
  72%  { opacity: 0.3; }
  100% { transform: translateY(-20px) scaleX(0.55); opacity: 0; }
}
</style>