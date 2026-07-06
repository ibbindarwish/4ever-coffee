<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bagColor:        string
  bagDark:         string
  bagLight:        string
  accentColor:     string
  labelBg:         string
  labelText:       string
  logoColor:       string
  brandName:       string
  productName:     string
  tagline:         string
  origin:          string
  flavorNotes:     string
  roastLevel:      'Light' | 'Medium' | 'Dark'
  weight:          '250g' | '500g' | '1kg'
  score?:          string
  showValve:       boolean
  scale?:          number
  side?:           'front' | 'back'
  // front logo controls
  logoSize?:       number   // outer ring radius — default 26
  logoStroke?:     number   // "4" line thickness — default 3.5
  // back-side typography controls
  labelFontSize?:  number   // section caps labels — default 5.5
  originFontSize?: number   // country name      — default 13
  scoreFontSize?:  number   // big % number      — default 20
  notesFontSize?:  number   // flavor notes text — default 6
  weightFontSize?: number   // NET weight badge  — default 8
}>()

const s         = computed(() => props.scale ?? 1)
const W         = computed(() => Math.round(260 * s.value))
const H         = computed(() => Math.round(400 * s.value))
const uid       = (n: string) => `bag-${n}-${props.weight}-${props.side ?? 'front'}`
const isFront   = computed(() => props.side !== 'back')
const fs = computed(() => ({
  logoScale:  (props.logoSize  ?? 26) / 26,
  logoStroke: props.logoStroke ?? 3.5,
  label:  props.labelFontSize  ?? 5.5,
  origin: props.originFontSize ?? 13,
  score:  props.scoreFontSize  ?? 20,
  notes:  props.notesFontSize  ?? 6,
  weight: props.weightFontSize ?? 8,
}))
</script>

<template>
  <svg
    :width="W" :height="H"
    viewBox="0 0 260 400"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
    class="bag-design-svg"
  >
    <defs>
      <linearGradient :id="uid('body')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   :stop-color="bagDark"/>
        <stop offset="10%"  :stop-color="bagColor"/>
        <stop offset="40%"  :stop-color="bagLight"/>
        <stop offset="62%"  :stop-color="bagColor"/>
        <stop offset="100%" :stop-color="bagDark"/>
      </linearGradient>
      <linearGradient :id="uid('seal')" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   :stop-color="bagLight" stop-opacity="0.9"/>
        <stop offset="100%" :stop-color="bagDark"  stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient :id="uid('label')" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   :stop-color="labelBg" stop-opacity="1"/>
        <stop offset="100%" :stop-color="labelBg" stop-opacity="0.94"/>
      </linearGradient>
      <filter :id="uid('glow')" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter :id="uid('shadow')" x="-18%" y="-6%" width="136%" height="122%">
        <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <!-- ── BAG BODY ── -->
    <g :filter="`url(#${uid('shadow')})`">
      <path
        d="M 54,38 C 40,40 30,75 28,125 L 20,358 C 20,374 34,388 66,392 L 194,392 C 226,388 240,374 240,358 L 232,125 C 230,75 220,40 206,38 Z"
        :fill="`url(#${uid('body')})`"
      />
    </g>
    <path
      d="M 54,38 C 40,40 30,75 28,125 L 20,358 C 20,374 34,388 66,392 L 194,392 C 226,388 240,374 240,358 L 232,125 C 230,75 220,40 206,38 Z"
      fill="none" :stroke="bagLight" stroke-width="0.8" stroke-opacity="0.25"
    />

    <!-- ── SIDE GUSSET CREASE LINES ── -->
    <path d="M 54,38 C 62,85 62,290 20,358"
          fill="none" :stroke="bagDark" stroke-width="1.2" stroke-opacity="0.45"/>
    <path d="M 206,38 C 198,85 198,290 240,358"
          fill="none" :stroke="bagDark" stroke-width="1.2" stroke-opacity="0.45"/>

    <!-- ── BOTTOM GUSSET FOLD LINES ── -->
    <path d="M 22,362 Q 130,380 238,362"
          fill="none" :stroke="bagDark" stroke-width="1.4" stroke-opacity="0.5"/>
    <path d="M 44,377 Q 130,391 216,377"
          fill="none" :stroke="bagDark" stroke-width="1" stroke-opacity="0.3"/>

    <!-- ── TOP HEAT SEAL STRIP ── -->
    <rect x="52" y="6" width="156" height="36" rx="5" :fill="`url(#${uid('seal')})`"/>
    <rect x="52" y="6" width="156" height="36" rx="5"
          fill="none" :stroke="bagDark" stroke-width="0.8" stroke-opacity="0.45"/>
    <line x1="58" y1="16" x2="202" y2="16" :stroke="bagLight" stroke-width="0.6" stroke-opacity="0.3"/>
    <line x1="58" y1="24" x2="202" y2="24" :stroke="bagLight" stroke-width="0.6" stroke-opacity="0.25"/>
    <line x1="58" y1="32" x2="202" y2="32" :stroke="bagLight" stroke-width="0.6" stroke-opacity="0.2"/>
    <polygon points="202,6 210,6 204,13" :fill="bagDark" opacity="0.55"/>
    <polygon points="58,6 50,6 56,13"   :fill="bagDark" opacity="0.35"/>

    <!-- ── DEGASSING VALVE ── -->
    <g v-if="showValve">
      <circle cx="197" cy="84" r="15" :fill="bagDark" opacity="0.65"/>
      <circle cx="197" cy="84" r="11" :fill="bagColor" opacity="0.85" :stroke="bagLight" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="197" cy="84" r="6.5" :fill="bagDark" opacity="0.6"/>
      <circle cx="197" cy="84" r="3"   :fill="bagLight" opacity="0.55"/>
      <line x1="197" y1="80" x2="197" y2="88" :stroke="bagLight" stroke-width="0.8" stroke-opacity="0.35"/>
      <line x1="193" y1="84" x2="201" y2="84" :stroke="bagLight" stroke-width="0.8" stroke-opacity="0.35"/>
      <text x="197" y="104" font-family="Arial,sans-serif" font-size="5"
            fill="rgba(255,255,255,0.3)" text-anchor="middle" letter-spacing="0.8">VALVE</text>
    </g>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- FRONT: logo only, centered on bag body                        -->
    <!-- scale transform keeps logo centered at (130, 215)            -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <g v-if="isFront"
       :transform="`translate(130,220) scale(${fs.logoScale}) translate(-130,-220)`">
      <!-- Outer ambient glow -->
      <circle cx="130" cy="220" r="62" :fill="logoColor" opacity="0.04"/>
      <!-- Badge ring -->
      <circle cx="130" cy="220" r="52"
              fill="rgba(0,0,0,0.22)" :stroke="logoColor" stroke-width="3"
              :filter="`url(#${uid('glow')})`" opacity="0.9"/>
      <!-- Inner double ring -->
      <circle cx="130" cy="220" r="44"
              fill="none" :stroke="logoColor" stroke-width="0.9" opacity="0.35"/>
      <!-- "4" lettermark — one continuous hand-drawn stroke, scaled to fit r=52 badge -->
      <path d="M142,190 L100,232 L162,232 M142,190 L142,254"
            fill="none" :stroke="logoColor" :stroke-width="fs.logoStroke * 1.6"
            stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- BACK: compact label panel in lower portion of bag            -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <g v-if="!isFront">
      <!-- Label panel — smaller, sits in lower half of bag -->
      <rect x="46" y="185" width="168" height="178" rx="10"
            :fill="`url(#${uid('label')})`" opacity="0.96"/>
      <rect x="46" y="185" width="168" height="178" rx="10"
            fill="none" :stroke="accentColor" stroke-width="1.8" opacity="0.65"/>
      <rect x="51" y="190" width="158" height="168" rx="7"
            fill="none" :stroke="accentColor" stroke-width="0.55" opacity="0.28"/>

      <!-- COUNTRY OF ORIGIN -->
      <text x="130" y="200"
            font-family="Arial, sans-serif" :font-size="fs.label" font-weight="700"
            :fill="labelText" opacity="0.5" text-anchor="middle" letter-spacing="2.5"
      >COUNTRY OF ORIGIN</text>
      <text x="130" y="214"
            font-family="'Arial Black', Arial, sans-serif" :font-size="fs.origin" font-weight="900"
            :fill="accentColor" text-anchor="middle" letter-spacing="1.2"
      >{{ origin.toUpperCase().slice(0, 20) }}</text>

      <line x1="66" y1="221" x2="194" y2="221"
            :stroke="accentColor" stroke-width="0.6" opacity="0.35"/>

      <!-- SPECIALTY SCORE -->
      <text x="130" y="231"
            font-family="Arial, sans-serif" :font-size="fs.label" font-weight="700"
            :fill="labelText" opacity="0.5" text-anchor="middle" letter-spacing="2.5"
      >SPECIALTY SCORE</text>
      <text x="130" y="256"
            font-family="'Arial Black', Arial, sans-serif" :font-size="fs.score" font-weight="900"
            :fill="accentColor" text-anchor="middle"
      >{{ (score ?? '88') }}%</text>

      <line x1="66" y1="264" x2="194" y2="264"
            :stroke="accentColor" stroke-width="0.6" opacity="0.35"/>

      <!-- ROAST (left column) -->
      <text x="82" y="274"
            font-family="Arial, sans-serif" :font-size="fs.label" font-weight="700"
            :fill="labelText" opacity="0.5" text-anchor="middle" letter-spacing="1.5"
      >ROAST</text>
      <circle cx="66" cy="284" r="5.5" :fill="accentColor" opacity="0.9"/>
      <circle cx="82" cy="284" r="5.5"
              :fill="roastLevel === 'Medium' || roastLevel === 'Dark' ? accentColor : 'transparent'"
              :stroke="accentColor" stroke-width="1.2"
              :opacity="roastLevel === 'Medium' || roastLevel === 'Dark' ? 0.9 : 0.45"/>
      <circle cx="98" cy="284" r="5.5"
              :fill="roastLevel === 'Dark' ? accentColor : 'transparent'"
              :stroke="accentColor" stroke-width="1.2"
              :opacity="roastLevel === 'Dark' ? 0.9 : 0.45"/>
      <text x="66" y="295" font-family="Arial,sans-serif" font-size="4.5" :fill="labelText" opacity="0.4" text-anchor="middle">L</text>
      <text x="82" y="295" font-family="Arial,sans-serif" font-size="4.5" :fill="labelText" opacity="0.4" text-anchor="middle">M</text>
      <text x="98" y="295" font-family="Arial,sans-serif" font-size="4.5" :fill="labelText" opacity="0.4" text-anchor="middle">D</text>

      <!-- Vertical separator -->
      <line x1="114" y1="268" x2="114" y2="300"
            :stroke="accentColor" stroke-width="0.6" opacity="0.28"/>

      <!-- NOTES (right column) -->
      <text x="160" y="274"
            font-family="Arial, sans-serif" :font-size="fs.label" font-weight="700"
            :fill="labelText" opacity="0.5" text-anchor="middle" letter-spacing="1.5"
      >NOTES</text>
      <text x="160" y="285"
            font-family="Arial, sans-serif" :font-size="fs.notes"
            :fill="labelText" opacity="0.85" text-anchor="middle" letter-spacing="0.3"
      >{{ flavorNotes.slice(0, 20) }}</text>
      <text x="160" y="295"
            font-family="Arial, sans-serif" :font-size="fs.label"
            :fill="labelText" opacity="0.42" text-anchor="middle"
      >Specialty Grade</text>

      <line x1="66" y1="303" x2="194" y2="303"
            :stroke="accentColor" stroke-width="0.6" opacity="0.35"/>

      <!-- NET WEIGHT badge -->
      <rect x="96" y="311" width="68" height="18" rx="9"
            :fill="accentColor" opacity="0.12"/>
      <rect x="96" y="311" width="68" height="18" rx="9"
            fill="none" :stroke="accentColor" stroke-width="1.1" opacity="0.55"/>
      <text x="130" y="324"
            font-family="'Arial Black', Arial, sans-serif" :font-size="fs.weight" font-weight="900"
            :fill="accentColor" text-anchor="middle" letter-spacing="1.2"
      >NET {{ weight }}</text>
    </g>

  </svg>
</template>

<style scoped>
.bag-design-svg { display: block; }
</style>