<script setup lang="ts">
const props = defineProps<{ size: 'sm' | 'md' | 'lg' }>()
const dims = { sm: { w: 108, h: 176 }, md: { w: 140, h: 228 }, lg: { w: 174, h: 283 } }
const uid = (n: string) => `${n}-${props.size}`
</script>

<template>
  <svg
    :width="dims[size].w"
    :height="dims[size].h"
    viewBox="0 0 160 260"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
    class="cup-svg"
  >
    <defs>
      <!-- Light cream paper body — very subtle shading, no dark edges -->
      <linearGradient :id="uid('bg')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#cec8ba"/>
        <stop offset="18%"  stop-color="#ede8de"/>
        <stop offset="50%"  stop-color="#faf8f4"/>
        <stop offset="82%"  stop-color="#ede8de"/>
        <stop offset="100%" stop-color="#cec8ba"/>
      </linearGradient>

      <!-- Sleeve dark band — solid, no transparent edges -->
      <linearGradient :id="uid('sl')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#1a0c06"/>
        <stop offset="12%"  stop-color="#200e06"/>
        <stop offset="50%"  stop-color="#261208"/>
        <stop offset="88%"  stop-color="#200e06"/>
        <stop offset="100%" stop-color="#1a0c06"/>
      </linearGradient>

      <!-- Bottom base -->
      <radialGradient :id="uid('btm')" cx="50%" cy="30%" r="60%">
        <stop offset="0%"   stop-color="#d4b478"/>
        <stop offset="100%" stop-color="#8a6030"/>
      </radialGradient>

      <!-- Shadow pushed far below so it never bands inside the cup -->
      <filter :id="uid('sh')" x="-30%" y="-5%" width="160%" height="175%">
        <feDropShadow dx="0" dy="60" stdDeviation="14"
                      flood-color="#2a1806" flood-opacity="0.18"/>
      </filter>

      <!-- Logo glow -->
      <filter :id="uid('gld')" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- ── STEAM ── -->
    <g class="steam-group">
      <path class="sp sp1" d="M55,74 C51,62 59,54 55,42"
            fill="none" stroke="#c8c0b0" stroke-width="2.4" stroke-linecap="round"/>
      <path class="sp sp2" d="M80,70 C76,58 84,50 80,38"
            fill="none" stroke="#c8c0b0" stroke-width="2.4" stroke-linecap="round"/>
      <path class="sp sp3" d="M105,74 C101,62 109,54 105,42"
            fill="none" stroke="#c8c0b0" stroke-width="2.4" stroke-linecap="round"/>
    </g>

    <!-- ── CUP BODY ── -->
    <g :filter="`url(#${uid('sh')})`">
      <path
        d="M22,80 L36,242 Q36,254 80,256 Q124,254 124,242 L138,80 Z"
        :fill="`url(#${uid('bg')})`"
      />
    </g>

    <!-- Bottom oval -->
    <ellipse cx="80" cy="249" rx="44" ry="7" :fill="`url(#${uid('btm')})`"/>

    <!-- ── CUP OPENING — thin rim only, no dome ── -->
    <!-- Paper rim edge (just one thin ellipse) -->
    <ellipse cx="80" cy="80" rx="58" ry="5.5" fill="#d0c8b4"/>
    <!-- Dark coffee inside -->
    <ellipse cx="80" cy="79" rx="52" ry="4"   fill="#0e0806"/>

    <!-- ── SLEEVE ── -->
    <path
      d="M26,118 L22,194 Q80,202 138,194 L134,118 Q80,122 26,118 Z"
      :fill="`url(#${uid('sl')})`"
    />
    <!-- Sleeve top gold border -->
    <path d="M26,118 Q80,122 134,118"
          fill="none" stroke="#d4a060" stroke-width="2" stroke-linecap="round"/>
    <!-- Sleeve bottom gold border -->
    <path d="M22,194 Q80,202 138,194"
          fill="none" stroke="#d4a060" stroke-width="2" stroke-linecap="round"/>

    <!-- ── LOGO — "4" in double-ring circle (bigger) ── -->
    <circle cx="80" cy="156" r="36" fill="rgba(212,160,96,0.06)"/>
    <circle cx="80" cy="156" r="30"
            fill="rgba(0,0,0,0.22)"
            stroke="#d4a060" stroke-width="2.6"
            :filter="`url(#${uid('gld')})`"/>
    <circle cx="80" cy="156" r="25"
            fill="none" stroke="#d4a060" stroke-width="0.8" opacity="0.4"/>
    <!-- "4" — scaled up -->
    <line x1="88" y1="138" x2="60"  y2="163" stroke="#d4a060" stroke-width="4.2" stroke-linecap="round"/>
    <line x1="59" y1="163" x2="103" y2="163" stroke="#d4a060" stroke-width="4.2" stroke-linecap="round"/>
    <line x1="88" y1="138" x2="88"  y2="177" stroke="#d4a060" stroke-width="4.2" stroke-linecap="round"/>

  </svg>
</template>

<style scoped>
.cup-svg { display: block; }
.sp { transform-box: fill-box; transform-origin: bottom center; }
.sp1 { animation: rise 2.8s ease-in-out infinite 0s; }
.sp2 { animation: rise 2.8s ease-in-out infinite 0.6s; }
.sp3 { animation: rise 2.8s ease-in-out infinite 1.2s; }
@keyframes rise {
  0%   { transform: translateY(4px) scaleX(1);    opacity: 0; }
  22%  { opacity: 0.65; }
  72%  { opacity: 0.2; }
  100% { transform: translateY(-22px) scaleX(0.5); opacity: 0; }
}
</style>