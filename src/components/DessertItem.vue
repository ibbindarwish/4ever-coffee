<script setup lang="ts">
const props = defineProps<{ productId: number; accent: string }>()
const g = (n: string) => `di${props.productId}${n}`
</script>

<template>
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">

    <!-- ─────────────────────────────────────────────── -->
    <!-- 13 · SCONE — clotted cream & strawberry jam   -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-if="productId === 13">
      <defs>
        <radialGradient :id="g('s')" cx="38%" cy="32%" r="66%">
          <stop offset="0%"   stop-color="#fce096"/>
          <stop offset="55%"  stop-color="#d4a030"/>
          <stop offset="100%" stop-color="#a87020"/>
        </radialGradient>
      </defs>
      <!-- Plate -->
      <ellipse cx="50" cy="113" rx="37" ry="7"   fill="#e8e0d8"/>
      <ellipse cx="50" cy="111" rx="30" ry="5"   fill="#faf8f5"/>
      <!-- Scone body bottom half -->
      <path d="M16 80 Q16 100 50 104 Q84 100 84 80 Z" :fill="`url(#${g('s')})`"/>
      <!-- Scone top half -->
      <path d="M16 80 Q18 60 50 57 Q82 60 84 80 Z" :fill="`url(#${g('s')})`"/>
      <!-- Top surface -->
      <ellipse cx="50" cy="60" rx="32" ry="12"   fill="#e8b840"/>
      <ellipse cx="50" cy="59" rx="29" ry="10.5" fill="#f0c850"/>
      <!-- Cracks / texture -->
      <path d="M24 68 Q38 63 50 65 Q62 63 76 68" stroke="#c8901e" stroke-width="1.8" fill="none" stroke-opacity="0.65"/>
      <path d="M20 76 Q50 71 80 76" stroke="#c8901e" stroke-width="1.2" fill="none" stroke-opacity="0.45"/>
      <!-- Clotted cream -->
      <ellipse cx="50" cy="55" rx="25" ry="9"    fill="#fdfcf8"/>
      <ellipse cx="50" cy="53" rx="22" ry="7.5"  fill="white"/>
      <ellipse cx="50" cy="52" rx="18" ry="6"    fill="#fffefb"/>
      <!-- Strawberry jam -->
      <ellipse cx="50" cy="48" rx="9"  ry="5.5"  fill="#cc1f1f"/>
      <ellipse cx="50" cy="47" rx="7"  ry="4"    fill="#e83333"/>
      <circle  cx="47" cy="45" r="1.8"            fill="#ff4444" fill-opacity="0.7"/>
      <circle  cx="53" cy="46" r="1.2"            fill="#ff6666" fill-opacity="0.6"/>
      <!-- Scone shine -->
      <ellipse cx="32" cy="62" rx="5" ry="3.5" fill="white" fill-opacity="0.28" transform="rotate(-22,32,62)"/>
      <!-- Crumbs on plate -->
      <circle cx="19" cy="110" r="2"   fill="#d4a030"/>
      <circle cx="79" cy="108" r="1.5" fill="#d4a030"/>
      <circle cx="86" cy="112" r="1.2" fill="#c8901e"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 14 · VICTORIA SPONGE — cream, jam, icing sugar -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 14">
      <defs>
        <linearGradient :id="g('sp')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#f5e090"/>
          <stop offset="100%" stop-color="#d4a838"/>
        </linearGradient>
      </defs>
      <!-- Bottom sponge layer -->
      <path d="M14 92 L86 92 L86 110 Q86 116 80 116 L20 116 Q14 116 14 110 Z" :fill="`url(#${g('sp')})`"/>
      <!-- Cream + jam filling -->
      <rect x="14" y="76" width="72" height="18" fill="#fdf8f0"/>
      <!-- Jam dots in cream -->
      <circle cx="26" cy="85" r="3.5" fill="#cc2020"/>
      <circle cx="39" cy="83" r="3"   fill="#ee3030"/>
      <circle cx="53" cy="85" r="3.5" fill="#cc2020"/>
      <circle cx="66" cy="83" r="3"   fill="#ee3030"/>
      <circle cx="76" cy="86" r="2.5" fill="#cc2020"/>
      <!-- Top sponge layer -->
      <path d="M14 48 L86 48 L86 78 L14 78 Z" :fill="`url(#${g('sp')})`"/>
      <!-- Top surface -->
      <ellipse cx="50" cy="48" rx="36" ry="10"  fill="#f0de88"/>
      <ellipse cx="50" cy="47" rx="33" ry="8.5" fill="#faeaa0"/>
      <!-- Icing sugar cloud -->
      <ellipse cx="50" cy="46" rx="30" ry="7"   fill="rgba(255,255,255,0.58)"/>
      <ellipse cx="50" cy="44" rx="24" ry="5.5" fill="rgba(255,255,255,0.45)"/>
      <!-- Icing sugar particles -->
      <circle cx="32" cy="42" r="1.8" fill="white" fill-opacity="0.85"/>
      <circle cx="44" cy="40" r="2.2" fill="white" fill-opacity="0.75"/>
      <circle cx="56" cy="41" r="1.8" fill="white" fill-opacity="0.8"/>
      <circle cx="66" cy="43" r="1.5" fill="white" fill-opacity="0.8"/>
      <circle cx="50" cy="38" r="1.5" fill="white" fill-opacity="0.7"/>
      <!-- Sponge shine -->
      <path d="M16 52 L17 77" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.3"/>
      <path d="M16 95 L16 108" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.2"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 15 · LEMON DRIZZLE — glossy glaze, lemon slice -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 15">
      <defs>
        <linearGradient :id="g('c')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#fde68a"/>
          <stop offset="100%" stop-color="#ca9a18"/>
        </linearGradient>
      </defs>
      <!-- Cake body -->
      <path d="M14 52 L86 52 L86 108 Q86 114 80 114 L20 114 Q14 114 14 108 Z" :fill="`url(#${g('c')})`"/>
      <!-- Cake top -->
      <ellipse cx="50" cy="52" rx="36" ry="10.5" fill="#f5d870"/>
      <ellipse cx="50" cy="51" rx="33" ry="9"    fill="#fae488"/>
      <!-- Glaze drips on sides -->
      <path d="M22 52 Q20 66 22 80"  stroke="#fffde7" stroke-width="4.5" stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <path d="M38 52 Q36 70 38 86"  stroke="#fffde7" stroke-width="4"   stroke-linecap="round" fill="none" stroke-opacity="0.8"/>
      <path d="M58 52 Q56 68 58 84"  stroke="#fffde7" stroke-width="4"   stroke-linecap="round" fill="none" stroke-opacity="0.82"/>
      <path d="M74 52 Q72 64 74 76"  stroke="#fffde7" stroke-width="4.5" stroke-linecap="round" fill="none" stroke-opacity="0.88"/>
      <!-- Glaze on top surface -->
      <path d="M20 48 Q35 54 50 46 Q65 54 80 48" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <path d="M25 44 Q50 51 75 44"              stroke="white" stroke-width="3"   stroke-linecap="round" fill="none" stroke-opacity="0.75"/>
      <!-- Cake texture lines -->
      <path d="M15 66 L85 66" stroke="rgba(160,120,10,0.22)" stroke-width="1"/>
      <path d="M15 80 L85 80" stroke="rgba(160,120,10,0.18)" stroke-width="1"/>
      <path d="M15 94 L85 94" stroke="rgba(160,120,10,0.15)" stroke-width="1"/>
      <!-- Lemon slice on top -->
      <circle cx="50" cy="34" r="15"  fill="#fef08a" stroke="#f5c000" stroke-width="2"/>
      <circle cx="50" cy="34" r="11"  fill="#fde047"/>
      <circle cx="50" cy="34" r="6"   fill="#fef08a"/>
      <!-- Lemon segments -->
      <line x1="50" y1="19" x2="50" y2="49" stroke="#f0b000" stroke-width="1.2" stroke-opacity="0.55"/>
      <line x1="37" y1="22" x2="63" y2="46" stroke="#f0b000" stroke-width="1.2" stroke-opacity="0.55"/>
      <line x1="37" y1="46" x2="63" y2="22" stroke="#f0b000" stroke-width="1.2" stroke-opacity="0.55"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 16 · CARROT CAKE — cream cheese frosting       -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 16">
      <defs>
        <linearGradient :id="g('c')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#c87840"/>
          <stop offset="100%" stop-color="#8b4020"/>
        </linearGradient>
      </defs>
      <!-- Cake body -->
      <path d="M18 54 L82 54 L82 110 Q82 116 76 116 L24 116 Q18 116 18 110 Z" :fill="`url(#${g('c')})`"/>
      <!-- Orange carrot bits inside -->
      <circle cx="32" cy="72"  r="3.5" fill="#f5a020" fill-opacity="0.55"/>
      <circle cx="52" cy="82"  r="4"   fill="#f5a020" fill-opacity="0.5"/>
      <circle cx="70" cy="68"  r="3"   fill="#f5a020" fill-opacity="0.55"/>
      <circle cx="38" cy="94"  r="3"   fill="#f0980e" fill-opacity="0.48"/>
      <circle cx="64" cy="100" r="3.5" fill="#f5a020" fill-opacity="0.5"/>
      <circle cx="44" cy="64"  r="2.5" fill="#f0980e" fill-opacity="0.5"/>
      <!-- Walnut pieces -->
      <ellipse cx="42" cy="60" rx="4"   ry="3"   fill="#6b3e1a" fill-opacity="0.6"/>
      <ellipse cx="63" cy="90" rx="3.5" ry="2.5" fill="#6b3e1a" fill-opacity="0.55"/>
      <ellipse cx="72" cy="80" rx="3"   ry="2.2" fill="#6b3e1a" fill-opacity="0.5"/>
      <!-- Cake texture -->
      <path d="M19 70  L81 70"  stroke="rgba(100,48,16,0.2)" stroke-width="1"/>
      <path d="M19 86  L81 86"  stroke="rgba(100,48,16,0.15)" stroke-width="1"/>
      <path d="M19 102 L81 102" stroke="rgba(100,48,16,0.12)" stroke-width="1"/>
      <!-- Cream cheese frosting -->
      <ellipse cx="50" cy="49" rx="33" ry="11"  fill="white"/>
      <ellipse cx="50" cy="47" rx="30" ry="9.5" fill="#fdfcfa"/>
      <ellipse cx="50" cy="46" rx="27" ry="8"   fill="white"/>
      <!-- Frosting swirls -->
      <path d="M24 45 Q34 50 44 45 Q54 50 64 45 Q72 49 78 45" stroke="#f0ece6" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Mini carrot decoration on top -->
      <ellipse cx="50" cy="36" rx="7" ry="4.5" fill="#f5a020" transform="rotate(-25,50,36)"/>
      <ellipse cx="46" cy="33" rx="6" ry="4"   fill="#f0980e" transform="rotate(-25,46,33)"/>
      <!-- Carrot top green leaves -->
      <path d="M44 30 Q42 23 45 21" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M48 29 Q48 22 49 19" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M52 30 Q55 23 52 21" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <!-- Frosting shine -->
      <path d="M20 52 Q19 80 20 110" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.25"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 17 · CHOCOLATE BROWNIE — fudgy, glossy top     -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 17">
      <defs>
        <linearGradient :id="g('b')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#2c1008"/>
          <stop offset="100%" stop-color="#140802"/>
        </linearGradient>
        <radialGradient :id="g('t')" cx="38%" cy="28%" r="68%">
          <stop offset="0%"   stop-color="#5c2c18"/>
          <stop offset="100%" stop-color="#2c1008"/>
        </radialGradient>
      </defs>
      <!-- Brownie body -->
      <path d="M10 56 L90 56 L90 108 Q90 114 84 114 L16 114 Q10 114 10 108 Z" :fill="`url(#${g('b')})`"/>
      <!-- Top shiny surface -->
      <path d="M10 44 L90 44 L90 58 L10 58 Z" :fill="`url(#${g('t')})`"/>
      <ellipse cx="50" cy="44" rx="40" ry="10.5" :fill="`url(#${g('t')})`"/>
      <ellipse cx="50" cy="43" rx="37" ry="9"    fill="#3d1c08"/>
      <!-- Crackle texture -->
      <path d="M18 41 Q36 46 54 39 Q72 46 84 41" stroke="#6b3010" stroke-width="2.5" fill="none" stroke-opacity="0.75"/>
      <path d="M14 38 Q34 43 54 35 Q74 43 86 37" stroke="#5c2808" stroke-width="2"   fill="none" stroke-opacity="0.6"/>
      <path d="M22 35 Q50 41 78 35"               stroke="#6b3010" stroke-width="1.5" fill="none" stroke-opacity="0.55"/>
      <!-- Glossy reflections -->
      <ellipse cx="32" cy="40" rx="13" ry="5"  fill="white" fill-opacity="0.09" transform="rotate(-16,32,40)"/>
      <ellipse cx="62" cy="42" rx="9"  ry="3.5" fill="white" fill-opacity="0.07" transform="rotate(-10,62,42)"/>
      <!-- Fudge layer under crackle -->
      <rect x="11" y="56" width="78" height="8" fill="#3d1c08" fill-opacity="0.75"/>
      <!-- Side texture lines -->
      <path d="M11 72  L89 72"  stroke="rgba(80,28,8,0.3)"  stroke-width="1"/>
      <path d="M11 88  L89 88"  stroke="rgba(80,28,8,0.25)" stroke-width="1"/>
      <path d="M11 104 L89 104" stroke="rgba(80,28,8,0.2)"  stroke-width="1"/>
      <!-- Side shine -->
      <path d="M12 60 L12 108" stroke="rgba(255,255,255,0.07)" stroke-width="4" stroke-linecap="round"/>
      <!-- Chocolate chip visible inside -->
      <circle cx="38" cy="80" r="4" fill="#1a0a04" fill-opacity="0.6"/>
      <circle cx="62" cy="96" r="3.5" fill="#1a0a04" fill-opacity="0.55"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 18 · MILLIONAIRE'S SHORTBREAD — 3 layers       -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 18">
      <defs>
        <linearGradient :id="g('sc')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#f5d870"/>
          <stop offset="100%" stop-color="#c8a030"/>
        </linearGradient>
        <linearGradient :id="g('car')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#f5a818"/>
          <stop offset="100%" stop-color="#b87010"/>
        </linearGradient>
        <linearGradient :id="g('choc')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#3d1c08"/>
          <stop offset="100%" stop-color="#1a0a04"/>
        </linearGradient>
      </defs>
      <!-- Layer labels positioned -->
      <!-- Shortbread layer (bottom) -->
      <path d="M12 94 L88 94 L88 112 Q88 116 84 116 L16 116 Q12 116 12 112 Z" :fill="`url(#${g('sc')})`"/>
      <path d="M12 100 L88 100" stroke="#d4a030" stroke-width="1.2" stroke-opacity="0.6"/>
      <path d="M12 107 L88 107" stroke="#d4a030" stroke-width="1"   stroke-opacity="0.4"/>
      <!-- Shortbread crumb dots -->
      <circle cx="25" cy="103" r="1.8" fill="#d4a030" fill-opacity="0.5"/>
      <circle cx="44" cy="105" r="1.5" fill="#c89020" fill-opacity="0.5"/>
      <circle cx="64" cy="103" r="1.8" fill="#d4a030" fill-opacity="0.45"/>
      <!-- Caramel layer (middle) -->
      <path d="M12 66 L88 66 L88 96 L12 96 Z" :fill="`url(#${g('car')})`"/>
      <!-- Caramel sheen -->
      <path d="M14 68 L14 94"  stroke="rgba(255,220,60,0.32)" stroke-width="4"   stroke-linecap="round"/>
      <path d="M22 68 Q22 82 22 94" stroke="rgba(255,200,40,0.2)" stroke-width="3" stroke-linecap="round"/>
      <!-- Caramel bubbles -->
      <circle cx="40" cy="80" r="2.5" fill="rgba(255,200,40,0.3)"/>
      <circle cx="60" cy="76" r="2"   fill="rgba(255,200,40,0.25)"/>
      <circle cx="72" cy="84" r="2"   fill="rgba(255,200,40,0.28)"/>
      <!-- Chocolate top layer -->
      <path d="M12 42 L88 42 L88 68 L12 68 Z" :fill="`url(#${g('choc')})`"/>
      <ellipse cx="50" cy="42" rx="38" ry="10.5" :fill="`url(#${g('choc')})`"/>
      <ellipse cx="50" cy="41" rx="35" ry="9"    fill="#3d1c08"/>
      <!-- White chocolate drizzle -->
      <path d="M20 38 Q34 45 48 36 Q62 45 78 38" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-opacity="0.92"/>
      <path d="M26 34 Q50 42 74 34"               stroke="white" stroke-width="3"   stroke-linecap="round" fill="none" stroke-opacity="0.78"/>
      <path d="M34 30 Q50 38 66 30"               stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none" stroke-opacity="0.65"/>
      <!-- Choc shine -->
      <ellipse cx="34" cy="48" rx="11" ry="4.5" fill="white" fill-opacity="0.08" transform="rotate(-14,34,48)"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 19 · BISCOFF CHEESECAKE — Lotus cookie on top  -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 19">
      <defs>
        <linearGradient :id="g('base')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#9b6340"/>
          <stop offset="100%" stop-color="#5c3418"/>
        </linearGradient>
        <linearGradient :id="g('cream')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#fdfaf4"/>
          <stop offset="100%" stop-color="#f0ece4"/>
        </linearGradient>
        <linearGradient :id="g('bis')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#e09020"/>
          <stop offset="100%" stop-color="#a85c10"/>
        </linearGradient>
      </defs>
      <!-- Biscoff crumb base -->
      <path d="M16 96 L84 96 L84 112 Q84 116 80 116 L20 116 Q16 116 16 112 Z" :fill="`url(#${g('base')})`"/>
      <!-- Crumb texture -->
      <circle cx="28" cy="104" r="3"   fill="#6b3818" fill-opacity="0.65"/>
      <circle cx="42" cy="106" r="2.5" fill="#7b4020" fill-opacity="0.6"/>
      <circle cx="56" cy="103" r="3"   fill="#6b3818" fill-opacity="0.65"/>
      <circle cx="70" cy="105" r="2.5" fill="#7b4020" fill-opacity="0.6"/>
      <circle cx="35" cy="108" r="2"   fill="#6b3818" fill-opacity="0.5"/>
      <circle cx="63" cy="107" r="2"   fill="#6b3818" fill-opacity="0.5"/>
      <!-- Cheesecake cream layer -->
      <path d="M16 56 L84 56 L84 98 L16 98 Z" :fill="`url(#${g('cream')})`"/>
      <!-- Cream texture -->
      <path d="M17 68 L83 68" stroke="#e8e0d6" stroke-width="1"   stroke-opacity="0.8"/>
      <path d="M17 80 L83 80" stroke="#e8e0d6" stroke-width="0.8" stroke-opacity="0.6"/>
      <path d="M17 90 L83 90" stroke="#e8e0d6" stroke-width="0.8" stroke-opacity="0.5"/>
      <!-- Biscoff spread topping -->
      <path d="M16 40 L84 40 L84 58 L16 58 Z" :fill="`url(#${g('bis')})`"/>
      <ellipse cx="50" cy="40" rx="34" ry="9.5" :fill="`url(#${g('bis')})`"/>
      <ellipse cx="50" cy="39" rx="31" ry="8"   fill="#e8a020"/>
      <!-- Biscoff drizzle swirl -->
      <path d="M22 36 Q38 43 54 34 Q68 43 78 36" stroke="#a85c10" stroke-width="2.5" fill="none" stroke-opacity="0.75" stroke-linecap="round"/>
      <!-- Lotus Biscoff cookie on top -->
      <rect x="30" y="18" width="40" height="24" rx="6" fill="#d48428"/>
      <rect x="32" y="20" width="36" height="20" rx="5" fill="#e09030"/>
      <!-- Cookie embossed lines -->
      <line x1="34" y1="25" x2="66" y2="25" stroke="#c07018" stroke-width="1.5" stroke-opacity="0.7"/>
      <line x1="34" y1="30" x2="66" y2="30" stroke="#c07018" stroke-width="1.5" stroke-opacity="0.7"/>
      <line x1="34" y1="35" x2="66" y2="35" stroke="#c07018" stroke-width="1.5" stroke-opacity="0.7"/>
      <line x1="44" y1="20" x2="44" y2="40" stroke="#c07018" stroke-width="1.2" stroke-opacity="0.5"/>
      <line x1="56" y1="20" x2="56" y2="40" stroke="#c07018" stroke-width="1.2" stroke-opacity="0.5"/>
      <!-- Cream shine -->
      <path d="M18 60 L18 96" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.2"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 20 · CINNAMON ROLL — spiral, cream icing       -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 20">
      <defs>
        <radialGradient :id="g('r')" cx="42%" cy="38%" r="62%">
          <stop offset="0%"   stop-color="#fce096"/>
          <stop offset="55%"  stop-color="#d4a030"/>
          <stop offset="100%" stop-color="#a87020"/>
        </radialGradient>
      </defs>
      <!-- Roll body -->
      <ellipse cx="50" cy="72" rx="38" ry="34"  :fill="`url(#${g('r')})`"/>
      <!-- Cinnamon spiral rings -->
      <ellipse cx="50" cy="71" rx="30" ry="26" fill="none" stroke="#8b4010" stroke-width="5.5" stroke-opacity="0.62"/>
      <ellipse cx="50" cy="71" rx="21" ry="18" fill="none" stroke="#8b4010" stroke-width="5"   stroke-opacity="0.56"/>
      <ellipse cx="50" cy="71" rx="13" ry="11" fill="none" stroke="#8b4010" stroke-width="4.5" stroke-opacity="0.5"/>
      <ellipse cx="50" cy="71" rx="6"  ry="5"  fill="#8b4010" fill-opacity="0.58"/>
      <!-- Roll surface shine -->
      <ellipse cx="36" cy="58" rx="11" ry="8"  fill="white" fill-opacity="0.22" transform="rotate(-22,36,58)"/>
      <!-- Cream cheese icing drizzle -->
      <path d="M20 58 Q30 66 42 54 Q54 68 66 54 Q76 66 82 58" stroke="white" stroke-width="4.5" stroke-linecap="round" fill="none" stroke-opacity="0.96"/>
      <path d="M24 50 Q40 62 56 46 Q70 60 78 50"               stroke="white" stroke-width="4"   stroke-linecap="round" fill="none" stroke-opacity="0.82"/>
      <path d="M30 43 Q50 56 70 43"                             stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-opacity="0.7"/>
      <path d="M38 37 Q50 48 62 37"                             stroke="white" stroke-width="3"   stroke-linecap="round" fill="none" stroke-opacity="0.6"/>
      <!-- Roll bottom shadow -->
      <ellipse cx="50" cy="104" rx="34" ry="8" fill="#a87020" fill-opacity="0.65"/>
      <!-- Plate -->
      <ellipse cx="50" cy="112" rx="32" ry="6" fill="#f0ece6"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 21 · STICKY TOFFEE PUDDING — dome, sauce       -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 21">
      <defs>
        <radialGradient :id="g('d')" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stop-color="#3d1c08"/>
          <stop offset="100%" stop-color="#1a0a04"/>
        </radialGradient>
        <radialGradient :id="g('s')" cx="45%" cy="35%" r="60%">
          <stop offset="0%"   stop-color="#f5b820"/>
          <stop offset="100%" stop-color="#c8780a"/>
        </radialGradient>
      </defs>
      <!-- Plate -->
      <ellipse cx="50" cy="112" rx="38" ry="7"   fill="#e8e0d8"/>
      <ellipse cx="50" cy="110" rx="32" ry="5.5" fill="#faf8f5"/>
      <!-- Toffee sauce pool on plate -->
      <ellipse cx="50" cy="107" rx="30" ry="5"   :fill="`url(#${g('s')})`" fill-opacity="0.7"/>
      <!-- Pudding dome -->
      <path d="M18 90 Q17 60 50 50 Q83 60 82 90 Q82 104 50 106 Q18 104 18 90 Z" :fill="`url(#${g('d')})`"/>
      <!-- Toffee sauce on top and flowing down -->
      <path d="M30 58 Q40 50 50 48 Q60 50 70 58 Q74 66 70 72 Q60 68 50 67 Q40 68 30 72 Q26 66 30 58 Z" :fill="`url(#${g('s')})`"/>
      <!-- Toffee rivulets down sides -->
      <path d="M26 68 Q22 80 20 96"  stroke="#f0a818" stroke-width="7"   stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <path d="M44 68 Q42 80 40 98"  stroke="#d4780a" stroke-width="5"   stroke-linecap="round" fill="none" stroke-opacity="0.8"/>
      <path d="M56 68 Q58 80 60 98"  stroke="#d4780a" stroke-width="5"   stroke-linecap="round" fill="none" stroke-opacity="0.8"/>
      <path d="M74 68 Q78 80 80 96"  stroke="#f0a818" stroke-width="7"   stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <!-- Pudding shine -->
      <ellipse cx="36" cy="60" rx="9" ry="5" fill="white" fill-opacity="0.1" transform="rotate(-20,36,60)"/>
      <!-- Steam -->
      <path d="M38 34 Q35 26 38 18" stroke="#f5c060" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.75"/>
      <path d="M62 34 Q59 26 62 18" stroke="#f5c060" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.65"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 22 · BANOFFEE PIE — banana, toffee, cream      -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 22">
      <defs>
        <linearGradient :id="g('b')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#7b5e3c"/>
          <stop offset="100%" stop-color="#4a3018"/>
        </linearGradient>
        <linearGradient :id="g('t')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#e8a020"/>
          <stop offset="100%" stop-color="#b87010"/>
        </linearGradient>
      </defs>
      <!-- Biscuit base -->
      <path d="M14 96 L86 96 L86 112 Q86 116 82 116 L18 116 Q14 116 14 112 Z" :fill="`url(#${g('b')})`"/>
      <path d="M14 102 L86 102" stroke="#5c3a1a" stroke-width="1.2" stroke-opacity="0.5"/>
      <!-- Toffee layer -->
      <path d="M14 74 L86 74 L86 98 L14 98 Z" :fill="`url(#${g('t')})`"/>
      <!-- Banana slices in toffee -->
      <ellipse cx="28" cy="86" rx="9"  ry="6"   fill="#fde68a"/>
      <ellipse cx="28" cy="86" rx="7"  ry="4.5" fill="#fef08a"/>
      <ellipse cx="50" cy="84" rx="10" ry="6.5" fill="#fde68a"/>
      <ellipse cx="50" cy="84" rx="8"  ry="5"   fill="#fef08a"/>
      <ellipse cx="72" cy="86" rx="9"  ry="6"   fill="#fde68a"/>
      <ellipse cx="72" cy="86" rx="7"  ry="4.5" fill="#fef08a"/>
      <!-- Banana detail lines -->
      <path d="M22 86 L34 86" stroke="#f0c030" stroke-width="1.2" stroke-opacity="0.6"/>
      <path d="M44 84 L56 84" stroke="#f0c030" stroke-width="1.2" stroke-opacity="0.6"/>
      <path d="M66 86 L78 86" stroke="#f0c030" stroke-width="1.2" stroke-opacity="0.6"/>
      <!-- Whipped cream layer -->
      <path d="M14 44 L86 44 L86 76 L14 76 Z" fill="white"/>
      <ellipse cx="50" cy="44" rx="36" ry="10.5" fill="white"/>
      <ellipse cx="50" cy="42" rx="33" ry="9"    fill="#fdfcfa"/>
      <!-- Cream swirls -->
      <path d="M20 42 Q32 48 44 42 Q56 48 68 42 Q76 47 82 42" stroke="#f0ece6" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Chocolate shavings on cream -->
      <path d="M34 38 Q40 42 46 38" stroke="#3d1c08" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-opacity="0.7"/>
      <path d="M52 36 Q58 40 64 36" stroke="#3d1c08" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-opacity="0.65"/>
      <path d="M28 35 Q32 39 36 35" stroke="#3d1c08" stroke-width="2"   fill="none" stroke-linecap="round" stroke-opacity="0.6"/>
      <!-- Cream shine -->
      <path d="M16 48 L16 74" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.25"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 23 · ETON MESS — meringue, strawberries, cream -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 23">
      <defs>
        <linearGradient :id="g('g')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.25)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
        </linearGradient>
      </defs>
      <!-- Glass/bowl outline -->
      <path d="M20 40 L80 40 L76 106 Q76 114 68 114 L32 114 Q24 114 24 106 Z" fill="none" stroke="#e0d4cc" stroke-width="2" stroke-opacity="0.6"/>
      <!-- Cream base inside -->
      <path d="M22 42 L78 42 L74 106 Q74 112 68 112 L32 112 Q26 112 26 106 Z" fill="#fdf8f4"/>
      <!-- Meringue chunks (irregular white pieces) -->
      <path d="M28 58 L38 50 L50 56 L44 68 L30 66 Z" fill="white"/>
      <path d="M52 48 L66 50 L70 62 L58 65 L48 58 Z" fill="white"/>
      <path d="M30 74 L44 70 L52 80 L40 88 L26 82 Z" fill="white"/>
      <path d="M56 72 L68 68 L74 80 L62 86 L54 78 Z" fill="white"/>
      <path d="M34 92 L46 88 L52 98 L40 104 L30 98 Z" fill="white"/>
      <path d="M56 90 L68 86 L72 96 L60 102 L52 96 Z" fill="white"/>
      <!-- Meringue shadows -->
      <path d="M30 64 L44 68" stroke="#f0ece6" stroke-width="2" stroke-opacity="0.7"/>
      <path d="M56 62 L68 65" stroke="#f0ece6" stroke-width="2" stroke-opacity="0.7"/>
      <!-- Fresh strawberries -->
      <path d="M36 52 Q40 44 44 52 Q42 60 40 60 Q38 60 36 52 Z" fill="#cc2020"/>
      <path d="M60 54 Q64 46 68 54 Q66 62 64 62 Q62 62 60 54 Z" fill="#ee3030"/>
      <path d="M28 82 Q32 74 36 82 Q34 90 32 90 Q30 90 28 82 Z" fill="#cc2020"/>
      <path d="M62 80 Q66 72 70 80 Q68 88 66 88 Q64 88 62 80 Z" fill="#ee3030"/>
      <path d="M42 96 Q46 88 50 96 Q48 104 46 104 Q44 104 42 96 Z" fill="#cc2020"/>
      <!-- Strawberry seeds -->
      <circle cx="40" cy="52" r="1.2" fill="#ff6666" fill-opacity="0.6"/>
      <circle cx="64" cy="54" r="1.2" fill="#ff6666" fill-opacity="0.6"/>
      <!-- Strawberry green tops -->
      <path d="M38 44 Q40 40 42 44" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M62 46 Q64 42 66 46" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <!-- Cream swirls on top -->
      <path d="M22 40 L78 40 L75 54 L25 54 Z" fill="white" fill-opacity="0.85"/>
      <path d="M25 48 Q38 55 52 46 Q66 55 76 48" stroke="#f0ece6" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Glass shine -->
      <path d="M20 40 L80 40 L76 106 Q76 114 68 114 L32 114 Q24 114 24 106 Z" :fill="`url(#${g('g')})`"/>
      <path d="M24 44 L25 104" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.2"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 24 · JAM DOUGHNUT — golden, sugared, jam       -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 24">
      <defs>
        <radialGradient :id="g('d')" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stop-color="#fce096"/>
          <stop offset="55%"  stop-color="#e8940a"/>
          <stop offset="100%" stop-color="#c07010"/>
        </radialGradient>
      </defs>
      <!-- Doughnut shadow -->
      <ellipse cx="50" cy="96" rx="36" ry="9" fill="#e8900a" fill-opacity="0.35"/>
      <!-- Doughnut body (round, filled) -->
      <circle cx="50" cy="70" r="38" :fill="`url(#${g('d')})`"/>
      <!-- Golden top surface -->
      <ellipse cx="50" cy="55" rx="30" ry="14" fill="#f5c050" fill-opacity="0.6"/>
      <!-- Sugar coating dots -->
      <circle cx="24" cy="60" r="2"   fill="white" fill-opacity="0.75"/>
      <circle cx="32" cy="48" r="1.8" fill="white" fill-opacity="0.7"/>
      <circle cx="46" cy="42" r="2.2" fill="white" fill-opacity="0.75"/>
      <circle cx="60" cy="44" r="1.8" fill="white" fill-opacity="0.7"/>
      <circle cx="72" cy="54" r="2"   fill="white" fill-opacity="0.72"/>
      <circle cx="78" cy="68" r="1.8" fill="white" fill-opacity="0.68"/>
      <circle cx="74" cy="84" r="2"   fill="white" fill-opacity="0.65"/>
      <circle cx="60" cy="94" r="1.8" fill="white" fill-opacity="0.65"/>
      <circle cx="40" cy="94" r="2"   fill="white" fill-opacity="0.65"/>
      <circle cx="26" cy="82" r="1.8" fill="white" fill-opacity="0.68"/>
      <circle cx="22" cy="70" r="2"   fill="white" fill-opacity="0.7"/>
      <circle cx="38" cy="46" r="1.5" fill="white" fill-opacity="0.6"/>
      <!-- Jam seam / injection point -->
      <path d="M38 68 Q42 72 48 70 Q54 72 58 68" stroke="#cc1f1f" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Jam oozing out -->
      <ellipse cx="50" cy="72" rx="8" ry="4" fill="#dd2020"/>
      <ellipse cx="50" cy="71" rx="6" ry="3" fill="#ee3333"/>
      <!-- Doughnut shine -->
      <ellipse cx="34" cy="54" rx="10" ry="6" fill="white" fill-opacity="0.22" transform="rotate(-25,34,54)"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 25 · CHOCOLATE ÉCLAIR — choux, chocolate glaze -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 25">
      <defs>
        <linearGradient :id="g('p')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#f5d870"/>
          <stop offset="100%" stop-color="#c8a020"/>
        </linearGradient>
        <linearGradient :id="g('c')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#2c1008"/>
          <stop offset="100%" stop-color="#1a0a04"/>
        </linearGradient>
      </defs>
      <!-- Pastry body (oblong choux) -->
      <path d="M12 68 Q12 58 50 54 Q88 58 88 68 Q88 78 50 82 Q12 78 12 68 Z" :fill="`url(#${g('p')})`"/>
      <!-- Cream filling visible from left end -->
      <ellipse cx="13" cy="70" rx="6" ry="12" fill="#fdfaf5" fill-opacity="0.9"/>
      <ellipse cx="13" cy="70" rx="4" ry="9"  fill="white"/>
      <!-- Cream oozing -->
      <path d="M10 62 Q8 70 10 78" stroke="white" stroke-width="5" stroke-linecap="round" fill="none" stroke-opacity="0.85"/>
      <!-- Chocolate glaze top -->
      <path d="M12 60 Q12 52 50 48 Q88 52 88 60 Q88 68 50 64 Q12 68 12 60 Z" :fill="`url(#${g('c')})`"/>
      <ellipse cx="50" cy="48" rx="38" ry="10" :fill="`url(#${g('c')})`"/>
      <ellipse cx="50" cy="47" rx="35" ry="8.5" fill="#3d1c08"/>
      <!-- White chocolate drizzle lines -->
      <path d="M18 44 Q34 51 50 42 Q66 51 82 44" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-opacity="0.92"/>
      <path d="M22 40 Q50 48 78 40"               stroke="white" stroke-width="3"   stroke-linecap="round" fill="none" stroke-opacity="0.78"/>
      <path d="M28 36 Q50 44 72 36"               stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none" stroke-opacity="0.65"/>
      <!-- Chocolate shine -->
      <ellipse cx="34" cy="50" rx="12" ry="4.5" fill="white" fill-opacity="0.09" transform="rotate(-12,34,50)"/>
      <!-- Pastry end detail -->
      <ellipse cx="88" cy="68" rx="6" ry="14" fill="#d4a030"/>
      <ellipse cx="88" cy="68" rx="4" ry="11" fill="#e8b840"/>
      <!-- Plate suggestion -->
      <ellipse cx="50" cy="90" rx="42" ry="6" fill="#f0ece8"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 26 · BATTENBERG CAKE — pink & yellow squares   -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 26">
      <defs>
        <linearGradient :id="g('marz')" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#d4c878"/>
          <stop offset="50%"  stop-color="#f5e898"/>
          <stop offset="100%" stop-color="#c8bc70"/>
        </linearGradient>
      </defs>
      <!-- Marzipan outer wrap -->
      <path d="M10 36 L90 36 L90 100 Q90 108 82 108 L18 108 Q10 108 10 100 Z" :fill="`url(#${g('marz')})`"/>
      <!-- Marzipan top -->
      <ellipse cx="50" cy="36" rx="40" ry="10" :fill="`url(#${g('marz')})`"/>
      <ellipse cx="50" cy="35" rx="37" ry="8.5" fill="#f5e898"/>
      <!-- 4 sponge squares inside -->
      <!-- Top-left: Pink -->
      <rect x="18" y="44" width="31" height="28" rx="3" fill="#f9a8d4"/>
      <rect x="20" y="46" width="27" height="24" rx="2" fill="#fbbfda"/>
      <!-- Top-right: Yellow -->
      <rect x="51" y="44" width="31" height="28" rx="3" fill="#fde68a"/>
      <rect x="53" y="46" width="27" height="24" rx="2" fill="#fef08a"/>
      <!-- Bottom-left: Yellow -->
      <rect x="18" y="74" width="31" height="28" rx="3" fill="#fde68a"/>
      <rect x="20" y="76" width="27" height="24" rx="2" fill="#fef08a"/>
      <!-- Bottom-right: Pink -->
      <rect x="51" y="74" width="31" height="28" rx="3" fill="#f9a8d4"/>
      <rect x="53" y="76" width="27" height="24" rx="2" fill="#fbbfda"/>
      <!-- Jam between squares (dark pink line) -->
      <line x1="50" y1="44" x2="50" y2="102" stroke="#ec4899" stroke-width="3" stroke-opacity="0.7"/>
      <line x1="18" y1="72" x2="82" y2="72"  stroke="#ec4899" stroke-width="3" stroke-opacity="0.7"/>
      <!-- Pink sponge texture detail -->
      <circle cx="30" cy="55" r="2.5" fill="#f472b6" fill-opacity="0.4"/>
      <circle cx="64" cy="85" r="2.5" fill="#f472b6" fill-opacity="0.4"/>
      <!-- Yellow texture detail -->
      <circle cx="64" cy="55" r="2.5" fill="#f5c200" fill-opacity="0.4"/>
      <circle cx="30" cy="85" r="2.5" fill="#f5c200" fill-opacity="0.4"/>
      <!-- Marzipan side shine -->
      <path d="M12 40 L12 100" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.28"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 27 · TREACLE TART — golden syrup, lattice top  -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 27">
      <defs>
        <radialGradient :id="g('f')" cx="42%" cy="38%" r="62%">
          <stop offset="0%"   stop-color="#fde68a"/>
          <stop offset="60%"  stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
      </defs>
      <!-- Pastry crust base -->
      <circle cx="50" cy="74" r="40" fill="#d4a030"/>
      <circle cx="50" cy="74" r="37" fill="#e8b840"/>
      <!-- Golden syrup filling -->
      <circle cx="50" cy="74" r="33" :fill="`url(#${g('f')})`"/>
      <!-- Treacle shine -->
      <ellipse cx="40" cy="60" rx="13" ry="8" fill="white" fill-opacity="0.18" transform="rotate(-22,40,60)"/>
      <!-- Lattice strips horizontal -->
      <line x1="18" y1="60" x2="82" y2="60" stroke="#c8900a" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>
      <line x1="17" y1="74" x2="83" y2="74" stroke="#c8900a" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>
      <line x1="18" y1="88" x2="82" y2="88" stroke="#c8900a" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>
      <!-- Lattice strips vertical / diagonal -->
      <line x1="38" y1="42" x2="38" y2="106" stroke="#c8900a" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>
      <line x1="50" y1="34" x2="50" y2="114" stroke="#c8900a" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>
      <line x1="62" y1="42" x2="62" y2="106" stroke="#c8900a" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>
      <!-- Lattice overlap dots (where strips cross) -->
      <circle cx="38" cy="60" r="3.5" fill="#e8a020"/>
      <circle cx="50" cy="60" r="3.5" fill="#e8a020"/>
      <circle cx="62" cy="60" r="3.5" fill="#e8a020"/>
      <circle cx="38" cy="74" r="3.5" fill="#e8a020"/>
      <circle cx="50" cy="74" r="3.5" fill="#e8a020"/>
      <circle cx="62" cy="74" r="3.5" fill="#e8a020"/>
      <circle cx="38" cy="88" r="3.5" fill="#e8a020"/>
      <circle cx="50" cy="88" r="3.5" fill="#e8a020"/>
      <circle cx="62" cy="88" r="3.5" fill="#e8a020"/>
      <!-- Pastry rim -->
      <circle cx="50" cy="74" r="40" fill="none" stroke="#c8a020" stroke-width="7"/>
      <circle cx="50" cy="74" r="43" fill="none" stroke="#d4a030" stroke-width="4"/>
      <!-- Pastry crimp detail -->
      <circle cx="50" cy="74" r="40" fill="none" stroke="#e8b840" stroke-width="2" stroke-dasharray="6 4" stroke-opacity="0.6"/>
    </g>

    <!-- ─────────────────────────────────────────────── -->
    <!-- 28 · CHELSEA BUN — spiral, raisins, glaze      -->
    <!-- ─────────────────────────────────────────────── -->
    <g v-else-if="productId === 28">
      <defs>
        <radialGradient :id="g('r')" cx="40%" cy="36%" r="64%">
          <stop offset="0%"   stop-color="#fce096"/>
          <stop offset="55%"  stop-color="#c89030"/>
          <stop offset="100%" stop-color="#8b5e10"/>
        </radialGradient>
      </defs>
      <!-- Bun body -->
      <ellipse cx="50" cy="74" rx="36" ry="32" :fill="`url(#${g('r')})`"/>
      <!-- Spiral rings (tighter than cinnamon roll) -->
      <ellipse cx="50" cy="73" rx="28" ry="24" fill="none" stroke="#6b3a10" stroke-width="4.5" stroke-opacity="0.6"/>
      <ellipse cx="50" cy="73" rx="19" ry="16" fill="none" stroke="#6b3a10" stroke-width="4"   stroke-opacity="0.54"/>
      <ellipse cx="50" cy="73" rx="11" ry="9"  fill="none" stroke="#6b3a10" stroke-width="3.5" stroke-opacity="0.48"/>
      <ellipse cx="50" cy="73" rx="5"  ry="4"  fill="#5c3010" fill-opacity="0.55"/>
      <!-- Raisins / fruit pieces -->
      <ellipse cx="32" cy="62" rx="3.5" ry="2.5" fill="#3d1c08" fill-opacity="0.8"/>
      <ellipse cx="44" cy="56" rx="3"   ry="2"   fill="#4a2010" fill-opacity="0.75"/>
      <ellipse cx="58" cy="58" rx="3.5" ry="2.5" fill="#3d1c08" fill-opacity="0.8"/>
      <ellipse cx="70" cy="66" rx="3"   ry="2"   fill="#4a2010" fill-opacity="0.75"/>
      <ellipse cx="68" cy="80" rx="3.5" ry="2.5" fill="#3d1c08" fill-opacity="0.8"/>
      <ellipse cx="30" cy="80" rx="3"   ry="2"   fill="#4a2010" fill-opacity="0.75"/>
      <ellipse cx="40" cy="88" rx="3.5" ry="2.5" fill="#3d1c08" fill-opacity="0.78"/>
      <ellipse cx="60" cy="86" rx="3"   ry="2"   fill="#4a2010" fill-opacity="0.75"/>
      <!-- Sticky golden glaze drizzle -->
      <path d="M24 60 Q34 68 44 56 Q56 68 68 56 Q78 66 82 60" stroke="#f5c030" stroke-width="4"   stroke-linecap="round" fill="none" stroke-opacity="0.88"/>
      <path d="M28 52 Q42 62 56 50 Q70 60 76 52"               stroke="#e8b020" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-opacity="0.75"/>
      <!-- Bun shine -->
      <ellipse cx="36" cy="60" rx="10" ry="7" fill="white" fill-opacity="0.2" transform="rotate(-20,36,60)"/>
      <!-- Shadow bottom -->
      <ellipse cx="50" cy="104" rx="32" ry="7" fill="#8b5e10" fill-opacity="0.55"/>
      <!-- Plate -->
      <ellipse cx="50" cy="112" rx="30" ry="5.5" fill="#f0ece6"/>
    </g>

  </svg>
</template>
