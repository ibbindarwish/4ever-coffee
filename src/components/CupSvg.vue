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
      <!-- Clean white cup body -->
      <linearGradient :id="uid('bg')" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#dedad4"/>
        <stop offset="15%"  stop-color="#f5f3f0"/>
        <stop offset="50%"  stop-color="#ffffff"/>
        <stop offset="85%"  stop-color="#f5f3f0"/>
        <stop offset="100%" stop-color="#dedad4"/>
      </linearGradient>

      <!-- Bottom base -->
      <radialGradient :id="uid('btm')" cx="50%" cy="30%" r="60%">
        <stop offset="0%"   stop-color="#e8e4dc"/>
        <stop offset="100%" stop-color="#c8c4bc"/>
      </radialGradient>

      <!-- Soft drop shadow -->
      <filter :id="uid('sh')" x="-30%" y="-5%" width="160%" height="175%">
        <feDropShadow dx="0" dy="60" stdDeviation="14"
                      flood-color="#1a1a1a" flood-opacity="0.12"/>
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

    <!-- ── CUP OPENING — thin rim only ── -->
    <ellipse cx="80" cy="80" rx="58" ry="5.5" fill="#d8d4cc"/>
    <ellipse cx="80" cy="79" rx="52" ry="4"   fill="#0e0806"/>

    <!-- ── LOGO — "@"-style "4" mark (dark badge + white mark) ── -->
    <circle cx="80" cy="156" r="33" fill="#1a1a1a"/>
    <!-- "@" outer ring: counterclockwise arc leaving gap on the right -->
    <path d="M101,147 A22,22 0 1 0 101,165"
          stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- "4" arm + crossbar inside the ring -->
    <path d="M101,147 L63,162 L101,162"
          stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- "4" vertical stem — fills the ring gap, completing the "@" -->
    <line x1="101" y1="147" x2="101" y2="165"
          stroke="white" stroke-width="4" stroke-linecap="round"/>

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