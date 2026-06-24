<script setup lang="ts">
const props = defineProps<{ productId: number; accent: string }>()
const g = (n: string) => `ci${props.productId}${n}`
</script>

<template>
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 1 · ESPRESSO — small demitasse, amber crema, saucer, steam -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-if="productId === 1">
      <defs>
        <linearGradient :id="g('cup')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#c8b8a0"/>
          <stop offset="35%"  stop-color="#fdf6ec"/>
          <stop offset="100%" stop-color="#b8a890"/>
        </linearGradient>
        <radialGradient :id="g('crema')" cx="40%" cy="35%" r="62%">
          <stop offset="0%"   stop-color="#f0b830"/>
          <stop offset="55%"  stop-color="#c87030"/>
          <stop offset="100%" stop-color="#6b2e10"/>
        </radialGradient>
      </defs>
      <!-- Saucer -->
      <ellipse cx="50" cy="108" rx="33" ry="8"   fill="#d8ccc0"/>
      <ellipse cx="50" cy="106" rx="27" ry="5.5"  fill="#fdf6ec"/>
      <ellipse cx="50" cy="105" rx="14" ry="3"    fill="#e0d4c8" fill-opacity="0.6"/>
      <!-- Cup body -->
      <path d="M33 70 Q31 100 50 103 Q69 100 67 70 Z" :fill="`url(#${g('cup')})`"/>
      <ellipse cx="50" cy="70" rx="17" ry="6"     :fill="`url(#${g('cup')})`"/>
      <!-- Espresso + crema -->
      <ellipse cx="50" cy="70" rx="15.5" ry="5"   :fill="`url(#${g('crema')})`"/>
      <path d="M39 69 Q44 73 50 69 Q56 73 61 69"
            stroke="#f5c060" stroke-width="1.6" stroke-linecap="round" fill="none" stroke-opacity="0.75"/>
      <!-- Handle -->
      <path d="M67 76 Q80 76 80 85 Q80 94 67 91"
            fill="none" stroke="#ddd0c0" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Cup shine -->
      <path d="M35 73 Q34 88 35 101"
            stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.32"/>
      <!-- Steam -->
      <path d="M41 55 Q38 47 41 39" stroke="#f0c27f" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.8"/>
      <path d="M50 53 Q47 45 50 37" stroke="#f0c27f" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.7"/>
      <path d="M59 55 Q56 47 59 39" stroke="#f0c27f" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.6"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 2 · CAPPUCCINO — wide bowl, foam dome, heart art, cocoa    -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 2">
      <defs>
        <linearGradient :id="g('cup')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#c8b8a8"/>
          <stop offset="38%"  stop-color="#fdf6ec"/>
          <stop offset="100%" stop-color="#b8a898"/>
        </linearGradient>
        <radialGradient :id="g('foam')" cx="44%" cy="38%" r="64%">
          <stop offset="0%"   stop-color="#fff8f2"/>
          <stop offset="65%"  stop-color="#f5e8d8"/>
          <stop offset="100%" stop-color="#e0d0c0"/>
        </radialGradient>
      </defs>
      <!-- Saucer -->
      <ellipse cx="50" cy="112" rx="38" ry="8.5"  fill="#d8ccc0"/>
      <ellipse cx="50" cy="110" rx="31" ry="5.5"  fill="#fdf6ec"/>
      <!-- Wide cup -->
      <path d="M14 72 Q12 104 50 108 Q88 104 86 72 Z" :fill="`url(#${g('cup')})`"/>
      <ellipse cx="50" cy="72" rx="36" ry="12"    :fill="`url(#${g('cup')})`"/>
      <!-- Foam dome -->
      <ellipse cx="50" cy="70" rx="34" ry="10.5"  :fill="`url(#${g('foam')})`"/>
      <ellipse cx="50" cy="68" rx="30" ry="9"     fill="#fef8f0"/>
      <!-- Heart latte art -->
      <path d="M50 75 Q40 66 43 62 Q46 58 50 63 Q54 58 57 62 Q60 66 50 75Z"
            fill="#c8813a" fill-opacity="0.42"/>
      <circle cx="43" cy="64" r="4"   fill="#c8813a" fill-opacity="0.32"/>
      <circle cx="57" cy="64" r="4"   fill="#c8813a" fill-opacity="0.32"/>
      <!-- Cocoa dusting -->
      <circle cx="36" cy="67" r="1.5" fill="#5c3317" fill-opacity="0.38"/>
      <circle cx="64" cy="67" r="1.5" fill="#5c3317" fill-opacity="0.38"/>
      <circle cx="50" cy="63" r="1.2" fill="#5c3317" fill-opacity="0.45"/>
      <circle cx="44" cy="70" r="1"   fill="#5c3317" fill-opacity="0.3"/>
      <circle cx="56" cy="70" r="1"   fill="#5c3317" fill-opacity="0.3"/>
      <!-- Handle -->
      <path d="M86 82 Q99 82 99 91 Q99 100 86 97"
            fill="none" stroke="#d8c8b8" stroke-width="5" stroke-linecap="round"/>
      <!-- Cup shine -->
      <path d="M16 76 Q15 93 16 105"
            stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.28"/>
      <!-- Steam -->
      <path d="M39 56 Q36 48 39 40" stroke="#f0c27f" stroke-width="2" stroke-linecap="round" stroke-opacity="0.65"/>
      <path d="M50 54 Q47 46 50 38" stroke="#f0c27f" stroke-width="2" stroke-linecap="round" stroke-opacity="0.55"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 3 · CAFFE LATTE — tall glass, 3 layers, tulip art on foam  -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 3">
      <defs>
        <linearGradient :id="g('shine')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.26)"/>
          <stop offset="28%"  stop-color="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
        </linearGradient>
        <linearGradient :id="g('esp')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#2c1008"/>
          <stop offset="100%" stop-color="#0d0402"/>
        </linearGradient>
        <linearGradient :id="g('mid')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#c8813a"/>
          <stop offset="100%" stop-color="#8b4513"/>
        </linearGradient>
      </defs>
      <!-- Glass outline -->
      <path d="M26 24 L74 24 L72 112 Q72 118 67 118 L33 118 Q28 118 28 112 Z"
            fill="none" stroke="#e0d0c0" stroke-width="1.6" stroke-opacity="0.55"/>
      <!-- Espresso bottom -->
      <path d="M29 76 L71 76 L69 112 Q69 116 66 116 L34 116 Q31 116 31 112 Z"
            :fill="`url(#${g('esp')})`"/>
      <!-- Milk middle -->
      <path d="M28 46 L72 46 L71 78 L29 78 Z" :fill="`url(#${g('mid')})`"/>
      <!-- Foam top -->
      <path d="M27 24 L73 24 L72 48 L28 48 Z" fill="#fde68a"/>
      <!-- Milk foam -->
      <ellipse cx="50" cy="24" rx="24" ry="7"  fill="#fdf6ec"/>
      <ellipse cx="50" cy="22" rx="20" ry="5"  fill="#fef8f0"/>
      <!-- Tulip latte art -->
      <path d="M43 22 Q50 27 57 22" stroke="#c8813a" stroke-width="1.8" stroke-linecap="round" fill="none" stroke-opacity="0.65"/>
      <circle cx="50" cy="20" r="3" fill="#c8813a" fill-opacity="0.42"/>
      <!-- Glass shine overlay -->
      <path d="M26 24 L74 24 L72 112 Q72 118 67 118 L33 118 Q28 118 28 112 Z"
            :fill="`url(#${g('shine')})`"/>
      <!-- Left highlight -->
      <path d="M29 28 L30 110" stroke="white" stroke-width="4" stroke-linecap="round" stroke-opacity="0.22"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 4 · AMERICANO — large white mug, dark black coffee, steam  -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 4">
      <defs>
        <linearGradient :id="g('mug')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#c8b8a8"/>
          <stop offset="36%"  stop-color="#fdf6ec"/>
          <stop offset="100%" stop-color="#b8a898"/>
        </linearGradient>
        <radialGradient :id="g('cof')" cx="38%" cy="30%" r="68%">
          <stop offset="0%"   stop-color="#1e0c04"/>
          <stop offset="100%" stop-color="#060402"/>
        </radialGradient>
      </defs>
      <!-- Mug body -->
      <path d="M16 44 L84 44 L84 110 Q84 116 78 116 L22 116 Q16 116 16 110 Z"
            :fill="`url(#${g('mug')})`"/>
      <!-- Coffee fill -->
      <path d="M18 58 L82 58 L82 110 Q82 114 78 114 L22 114 Q18 114 18 110 Z"
            :fill="`url(#${g('cof')})`"/>
      <!-- Coffee surface -->
      <ellipse cx="50" cy="58" rx="32" ry="10"   fill="#100802"/>
      <ellipse cx="50" cy="57" rx="29" ry="8.5"  fill="#1e0c04"/>
      <!-- Reflection shimmer -->
      <ellipse cx="43" cy="54" rx="8" ry="4" fill="white" fill-opacity="0.06" transform="rotate(-18,43,54)"/>
      <!-- Mug rim -->
      <ellipse cx="50" cy="44" rx="34" ry="10.5" fill="#d8c8b8"/>
      <ellipse cx="50" cy="43" rx="32" ry="9"    :fill="`url(#${g('mug')})`"/>
      <!-- Handle -->
      <path d="M84 58 Q100 58 100 73 Q100 88 84 84"
            fill="none" stroke="#d0c0b0" stroke-width="6.5" stroke-linecap="round"/>
      <!-- Shine -->
      <path d="M19 48 Q18 78 19 110"
            stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.28"/>
      <!-- Steam -->
      <path d="M36 30 Q33 22 36 14" stroke="#f0c27f" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.75"/>
      <path d="M50 28 Q47 20 50 12" stroke="#f0c27f" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.65"/>
      <path d="M64 30 Q61 22 64 14" stroke="#f0c27f" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.55"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 5 · COLD BREW — mason jar, metal lid, ice cubes, straw     -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 5">
      <defs>
        <linearGradient :id="g('shine')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.24)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
        </linearGradient>
        <linearGradient :id="g('brew')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#1a0a04"/>
          <stop offset="100%" stop-color="#060200"/>
        </linearGradient>
      </defs>
      <!-- Jar outline -->
      <path d="M20 38 L26 30 L74 30 L80 38 L80 108 Q80 115 74 115 L26 115 Q20 115 20 108 Z"
            fill="none" stroke="#90c8e8" stroke-width="1.6" stroke-opacity="0.45"/>
      <!-- Dark brew fill -->
      <path d="M21 56 L79 56 L79 108 Q79 113 74 113 L26 113 Q21 113 21 108 Z"
            :fill="`url(#${g('brew')})`"/>
      <!-- Gap above brew (air/headspace) -->
      <path d="M21 38 L79 38 L79 58 L21 58 Z" fill="#1a0a04" fill-opacity="0.3"/>
      <!-- Metal lid -->
      <path d="M20 30 L26 24 L74 24 L80 30 L80 40 L20 40 Z" :fill="accent" fill-opacity="0.88"/>
      <ellipse cx="50" cy="24" rx="26" ry="6" :fill="accent" fill-opacity="0.7"/>
      <ellipse cx="50" cy="23" rx="22" ry="4" :fill="accent"/>
      <!-- Ice cubes -->
      <rect x="28" y="60" width="16" height="16" rx="3.5" fill="white" fill-opacity="0.3"/>
      <rect x="50" y="64" width="16" height="16" rx="3.5" fill="white" fill-opacity="0.24"/>
      <rect x="30" y="82" width="14" height="14" rx="3"   fill="white" fill-opacity="0.2"/>
      <rect x="50" y="86" width="14" height="13" rx="3"   fill="white" fill-opacity="0.18"/>
      <!-- Ice cube highlights -->
      <path d="M29 61 L30 75" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.5"/>
      <path d="M51 65 L52 79" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.4"/>
      <!-- Straw -->
      <rect x="62" y="6"  width="5" height="84" rx="2.5" fill="#d4a060" fill-opacity="0.92"/>
      <!-- Shine overlay -->
      <path d="M20 38 L26 30 L74 30 L80 38 L80 108 Q80 115 74 115 L26 115 Q20 115 20 108 Z"
            :fill="`url(#${g('shine')})`"/>
      <path d="M23 42 L24 111" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.17"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 6 · CARAMEL MACCHIATO — tall cup, 3 layers, caramel drizzle-->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 6">
      <defs>
        <linearGradient :id="g('shine')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.22)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
        </linearGradient>
        <linearGradient :id="g('esp')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#5c3317"/>
          <stop offset="100%" stop-color="#3d1c08"/>
        </linearGradient>
      </defs>
      <!-- Cup outline -->
      <path d="M25 26 L75 26 L79 40 L79 114 Q79 119 73 119 L27 119 Q21 119 21 114 L21 40 Z"
            fill="none" stroke="#f5e6d3" stroke-width="1.6" stroke-opacity="0.45"/>
      <!-- Milk bottom -->
      <path d="M22 80 L78 80 L78 114 Q78 117 73 117 L27 117 Q22 117 22 114 Z"
            fill="#f0e0d0"/>
      <!-- Espresso middle -->
      <path d="M22 58 L78 58 L78 82 L22 82 Z" :fill="`url(#${g('esp')})`"/>
      <!-- Vanilla froth top -->
      <path d="M22 40 L78 40 L78 60 L22 60 Z" fill="#fde68a"/>
      <!-- Foam + caramel on very top -->
      <ellipse cx="50" cy="40" rx="27" ry="8"   fill="#fdf6ec"/>
      <ellipse cx="50" cy="38" rx="24" ry="6"   fill="#fef8f2"/>
      <!-- Caramel drizzle grid -->
      <path d="M33 36 Q42 43 50 36 Q58 43 67 36"
            stroke="#c8813a" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      <path d="M37 33 Q50 41 63 33"
            stroke="#d4a060" stroke-width="2.2" stroke-linecap="round" fill="none" stroke-opacity="0.85"/>
      <path d="M50 30 L50 44" stroke="#c8813a" stroke-width="1.5" stroke-opacity="0.5" stroke-linecap="round"/>
      <!-- Straw -->
      <rect x="64" y="8"  width="5" height="96" rx="2.5" fill="#c8813a" fill-opacity="0.88"/>
      <!-- Shine -->
      <path d="M25 26 L75 26 L79 40 L79 114 Q79 119 73 119 L27 119 Q21 119 21 114 L21 40 Z"
            :fill="`url(#${g('shine')})`"/>
      <path d="M24 42 L25 114" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.18"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 7 · MOCHA — mug, towering whipped cream, choc drizzle      -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 7">
      <defs>
        <linearGradient :id="g('mug')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#c0b0a0"/>
          <stop offset="36%"  stop-color="#fdf6ec"/>
          <stop offset="100%" stop-color="#b0a090"/>
        </linearGradient>
        <linearGradient :id="g('cof')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#2c1008"/>
          <stop offset="100%" stop-color="#140802"/>
        </linearGradient>
      </defs>
      <!-- Mug body -->
      <path d="M17 52 L83 52 L83 114 Q83 118 77 118 L23 118 Q17 118 17 114 Z"
            :fill="`url(#${g('mug')})`"/>
      <!-- Mocha fill -->
      <path d="M19 65 L81 65 L81 114 Q81 116 77 116 L23 116 Q19 116 19 114 Z"
            :fill="`url(#${g('cof')})`"/>
      <!-- Coffee surface -->
      <ellipse cx="50" cy="65" rx="31" ry="10"  fill="#1a0a04"/>
      <ellipse cx="50" cy="64" rx="28" ry="8.5" fill="#2c1008"/>
      <!-- Whipped cream layers (tall swirl) -->
      <ellipse cx="50" cy="57" rx="25" ry="12"  fill="white"/>
      <ellipse cx="50" cy="48" rx="21" ry="10"  fill="white"/>
      <ellipse cx="50" cy="40" rx="17" ry="8.5" fill="#fafaf8"/>
      <ellipse cx="50" cy="33" rx="12" ry="6.5" fill="white"/>
      <ellipse cx="50" cy="27" rx="7"  ry="5"   fill="#fafaf8"/>
      <circle  cx="50" cy="22" r="4"             fill="white"/>
      <!-- Chocolate drizzle -->
      <path d="M34 52 Q42 45 50 52 Q58 45 66 52"
            stroke="#2c1008" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      <path d="M36 46 Q50 54 64 46"
            stroke="#4a1e0a" stroke-width="2.2" stroke-linecap="round" fill="none" stroke-opacity="0.85"/>
      <!-- Cocoa on tip -->
      <circle cx="44" cy="26" r="1.8" fill="#5c3317" fill-opacity="0.5"/>
      <circle cx="56" cy="26" r="1.8" fill="#5c3317" fill-opacity="0.5"/>
      <circle cx="50" cy="22" r="1.5" fill="#5c3317" fill-opacity="0.45"/>
      <!-- Handle -->
      <path d="M83 64 Q99 64 99 79 Q99 94 83 90"
            fill="none" stroke="#c8b8a8" stroke-width="6.5" stroke-linecap="round"/>
      <!-- Shine -->
      <path d="M19 56 Q18 84 19 114"
            stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.26"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 8 · FLAT WHITE — small cup, flat microfoam, rosette art    -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 8">
      <defs>
        <linearGradient :id="g('cup')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#c8b8a8"/>
          <stop offset="36%"  stop-color="#fdf6ec"/>
          <stop offset="100%" stop-color="#b8a898"/>
        </linearGradient>
        <radialGradient :id="g('foam')" cx="42%" cy="36%" r="62%">
          <stop offset="0%"   stop-color="#fef8f0"/>
          <stop offset="68%"  stop-color="#f0e8d8"/>
          <stop offset="100%" stop-color="#e0d0c0"/>
        </radialGradient>
      </defs>
      <!-- Saucer -->
      <ellipse cx="50" cy="112" rx="32" ry="7.5" fill="#d8ccc0"/>
      <ellipse cx="50" cy="110" rx="26" ry="5"   fill="#fdf6ec"/>
      <!-- Small cup body -->
      <path d="M27 66 Q25 100 50 104 Q75 100 73 66 Z" :fill="`url(#${g('cup')})`"/>
      <ellipse cx="50" cy="66" rx="23" ry="8"    :fill="`url(#${g('cup')})`"/>
      <!-- Flat microfoam (not domed) -->
      <ellipse cx="50" cy="66" rx="22" ry="7"    :fill="`url(#${g('foam')})`"/>
      <ellipse cx="50" cy="65" rx="20" ry="5.5"  fill="#fef8f0"/>
      <!-- Rosette latte art -->
      <path d="M50 72 Q40 65 43 60 Q46 56 50 61 Q54 56 57 60 Q60 65 50 72Z"
            fill="#c8813a" fill-opacity="0.4"/>
      <circle cx="43" cy="62" r="3.8" fill="#c8813a" fill-opacity="0.3"/>
      <circle cx="57" cy="62" r="3.8" fill="#c8813a" fill-opacity="0.3"/>
      <circle cx="50" cy="64" r="2.8" fill="#d4a060" fill-opacity="0.62"/>
      <!-- Handle -->
      <path d="M73 72 Q86 72 86 81 Q86 90 73 88"
            fill="none" stroke="#d0c0b0" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Shine -->
      <path d="M29 69 Q28 85 29 102"
            stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-opacity="0.3"/>
      <!-- Subtle steam (flat white is gentler) -->
      <path d="M43 52 Q41 45 43 38" stroke="#f0c27f" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.62"/>
      <path d="M57 52 Q55 45 57 38" stroke="#f0c27f" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.52"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 9 · ICED LATTE — tall cup, dome lid, ice, blue straw       -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 9">
      <defs>
        <linearGradient :id="g('shine')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.24)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
        </linearGradient>
        <linearGradient :id="g('latte')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#6b3a2a"/>
          <stop offset="100%" stop-color="#2c1008"/>
        </linearGradient>
      </defs>
      <!-- Tall plastic cup -->
      <path d="M27 34 L73 34 L77 48 L77 116 Q77 120 71 120 L29 120 Q23 120 23 116 L23 48 Z"
            fill="none" stroke="#93c5fd" stroke-width="1.6" stroke-opacity="0.55"/>
      <!-- Dome lid -->
      <path d="M23 34 Q23 22 50 22 Q77 22 77 34 Z" fill="#bfdbfe" fill-opacity="0.62"/>
      <ellipse cx="50" cy="34" rx="27" ry="8.5" fill="#93c5fd" fill-opacity="0.65"/>
      <!-- Milk layer (top of liquid) -->
      <path d="M24 50 L76 50 L77 66 L23 66 Z" fill="#f5e6d3" fill-opacity="0.88"/>
      <!-- Coffee layer (rest) -->
      <path d="M23 64 L77 64 L77 116 Q77 118 71 118 L29 118 Q23 118 23 116 Z"
            :fill="`url(#${g('latte')})`"/>
      <!-- Ice cubes -->
      <rect x="30" y="68" width="15" height="15" rx="3.5" fill="white" fill-opacity="0.32"/>
      <rect x="52" y="72" width="15" height="15" rx="3.5" fill="white" fill-opacity="0.26"/>
      <rect x="32" y="90" width="13" height="13" rx="3"   fill="white" fill-opacity="0.22"/>
      <rect x="52" y="94" width="13" height="12" rx="3"   fill="white" fill-opacity="0.2"/>
      <!-- Ice highlights -->
      <path d="M31 69 L32 82"  stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.48"/>
      <path d="M53 73 L54 86"  stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.42"/>
      <!-- Blue straw -->
      <rect x="60" y="8"  width="5" height="92" rx="2.5" fill="#3b82f6" fill-opacity="0.78"/>
      <!-- Glass shine -->
      <path d="M27 34 L73 34 L77 48 L77 116 Q77 120 71 120 L29 120 Q23 120 23 116 L23 48 Z"
            :fill="`url(#${g('shine')})`"/>
      <path d="M26 50 L27 116" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.17"/>
      <!-- Condensation drops -->
      <circle cx="81" cy="74" r="1.8" fill="#93c5fd" fill-opacity="0.65"/>
      <circle cx="83" cy="86" r="1.2" fill="#93c5fd" fill-opacity="0.55"/>
      <circle cx="80" cy="98" r="1.8" fill="#93c5fd" fill-opacity="0.5"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 10 · MATCHA LATTE — glass, vivid green, matcha powder top  -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 10">
      <defs>
        <linearGradient :id="g('shine')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.24)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
        </linearGradient>
        <linearGradient :id="g('matcha')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#166534"/>
          <stop offset="100%" stop-color="#052e16"/>
        </linearGradient>
        <linearGradient :id="g('milk')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#d1fae5"/>
          <stop offset="100%" stop-color="#a7f3d0"/>
        </linearGradient>
      </defs>
      <!-- Glass outline -->
      <path d="M25 26 L75 26 L73 114 Q73 119 68 119 L32 119 Q27 119 27 114 Z"
            fill="none" stroke="#6ee7b7" stroke-width="1.6" stroke-opacity="0.55"/>
      <!-- Matcha layer (main) -->
      <path d="M28 54 L72 54 L70 114 Q70 117 68 117 L32 117 Q30 117 30 114 Z"
            :fill="`url(#${g('matcha')})`"/>
      <!-- Milk foam top -->
      <path d="M26 26 L74 26 L72 56 L28 56 Z" :fill="`url(#${g('milk')})`"/>
      <!-- Foam surface -->
      <ellipse cx="50" cy="26" rx="25" ry="7.5"  fill="#a7f3d0"/>
      <ellipse cx="50" cy="24" rx="22" ry="5.5"  fill="#d1fae5"/>
      <!-- Matcha swirl on foam -->
      <path d="M38 24 Q44 28 50 24 Q56 28 62 24"
            stroke="#065f46" stroke-width="2.2" stroke-linecap="round" fill="none" stroke-opacity="0.65"/>
      <!-- Matcha powder dots -->
      <circle cx="42" cy="23" r="2.2" fill="#065f46" fill-opacity="0.55"/>
      <circle cx="58" cy="23" r="2.2" fill="#065f46" fill-opacity="0.55"/>
      <circle cx="50" cy="21" r="2.8" fill="#065f46" fill-opacity="0.48"/>
      <!-- Glass shine -->
      <path d="M25 26 L75 26 L73 114 Q73 119 68 119 L32 119 Q27 119 27 114 Z"
            :fill="`url(#${g('shine')})`"/>
      <path d="M28 30 L29 112" stroke="white" stroke-width="4" stroke-linecap="round" stroke-opacity="0.2"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 11 · VANILLA LATTE — cream mug, vanilla swirl, amber steam -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 11">
      <defs>
        <linearGradient :id="g('mug')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#d8c870"/>
          <stop offset="35%"  stop-color="#fef9c3"/>
          <stop offset="100%" stop-color="#c8b860"/>
        </linearGradient>
        <linearGradient :id="g('cof')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#c8813a"/>
          <stop offset="100%" stop-color="#7a3d18"/>
        </linearGradient>
      </defs>
      <!-- Mug body (warm cream-yellow) -->
      <path d="M17 44 L83 44 L83 114 Q83 118 77 118 L23 118 Q17 118 17 114 Z"
            :fill="`url(#${g('mug')})`"/>
      <!-- Latte fill -->
      <path d="M19 58 L81 58 L81 114 Q81 116 77 116 L23 116 Q19 116 19 114 Z"
            :fill="`url(#${g('cof')})`"/>
      <!-- Coffee surface -->
      <ellipse cx="50" cy="58" rx="31" ry="9.5"  fill="#c8813a"/>
      <ellipse cx="50" cy="57" rx="28" ry="8"    fill="#d4a060"/>
      <!-- Vanilla cream -->
      <ellipse cx="50" cy="55" rx="25" ry="7"    fill="#fef9c3"/>
      <ellipse cx="50" cy="53" rx="21" ry="5.5"  fill="#fffde7"/>
      <!-- Vanilla swirl -->
      <path d="M35 52 Q43 48 50 52 Q57 48 65 52"
            stroke="#fbbf24" stroke-width="2.8" stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <path d="M39 49 Q50 55 61 49"
            stroke="#f59e0b" stroke-width="2" stroke-linecap="round" fill="none" stroke-opacity="0.75"/>
      <!-- Handle -->
      <path d="M83 58 Q99 58 99 73 Q99 88 83 84"
            fill="none" stroke="#d8c870" stroke-width="6.5" stroke-linecap="round"/>
      <!-- Shine -->
      <path d="M19 48 Q18 78 19 114"
            stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.26"/>
      <!-- Amber/yellow steam for vanilla -->
      <path d="M37 30 Q34 22 37 14" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.8"/>
      <path d="M50 28 Q47 20 50 12" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.7"/>
      <path d="M63 30 Q60 22 63 14" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.6"/>
    </g>

    <!-- ─────────────────────────────────────────────────────────── -->
    <!-- 12 · CORTADO — short Gibraltar glass, two equal layers     -->
    <!-- ─────────────────────────────────────────────────────────── -->
    <g v-else-if="productId === 12">
      <defs>
        <linearGradient :id="g('shine')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.26)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
        </linearGradient>
        <linearGradient :id="g('esp')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#2c1008"/>
          <stop offset="100%" stop-color="#0d0604"/>
        </linearGradient>
        <linearGradient :id="g('milk')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#fde68a"/>
          <stop offset="100%" stop-color="#f5d060"/>
        </linearGradient>
      </defs>
      <!-- Short Gibraltar glass (wider at top) -->
      <path d="M20 44 L80 44 L76 114 Q76 119 72 119 L28 119 Q24 119 24 114 Z"
            fill="none" stroke="#fbbf24" stroke-width="1.6" stroke-opacity="0.48"/>
      <!-- Warm milk layer (bottom) -->
      <path d="M27 82 L73 82 L70 114 Q70 117 68 117 L32 117 Q30 117 30 114 Z"
            :fill="`url(#${g('milk')})`"/>
      <!-- Espresso layer (top, exact half) -->
      <path d="M21 44 L79 44 L77 84 L23 84 Z" :fill="`url(#${g('esp')})`"/>
      <!-- Glass rim -->
      <ellipse cx="50" cy="44" rx="30" ry="9.5"  fill="#2c1008"/>
      <ellipse cx="50" cy="43" rx="28" ry="7.5"  fill="#fbbf24" fill-opacity="0.52"/>
      <!-- Sharp layer interface glow -->
      <rect x="24" y="80" width="52" height="5" rx="2.5" fill="#f0c27f" fill-opacity="0.6"/>
      <!-- Espresso surface shimmer -->
      <ellipse cx="43" cy="50" rx="9" ry="4.5" fill="white" fill-opacity="0.07" transform="rotate(-16,43,50)"/>
      <!-- Glass shine -->
      <path d="M20 44 L80 44 L76 114 Q76 119 72 119 L28 119 Q24 119 24 114 Z"
            :fill="`url(#${g('shine')})`"/>
      <path d="M22 48 L24 114" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.2"/>
      <!-- Steam (cortado is hot) -->
      <path d="M40 30 Q37 22 40 14" stroke="#f0c27f" stroke-width="2"   stroke-linecap="round" stroke-opacity="0.68"/>
      <path d="M60 30 Q57 22 60 14" stroke="#f0c27f" stroke-width="2"   stroke-linecap="round" stroke-opacity="0.55"/>
    </g>

  </svg>
</template>
