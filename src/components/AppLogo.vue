<script setup lang="ts">
defineProps<{ size?: number; dark?: boolean }>()
</script>

<template>
  <!--
    Badge mark: solid filled circle with "4" lettermark inside.
    Wordmark: "4ever" bold + "COFFEE" tracked small-caps below.
    dark=true  → used on light backgrounds (espresso circle, gold "4", dark text)
    dark=false → used on dark backgrounds (gold circle, cream "4", gold text)
  -->
  <svg
    :width="(size ?? 48) * 2.3"
    :height="size ?? 48"
    viewBox="0 0 230 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- ── BADGE MARK ── -->

    <!-- Filled circle badge -->
    <circle cx="40" cy="40" r="36" :fill="dark ? '#1c1008' : '#c8813a'"/>

    <!-- "@4" mark: outer ring opens upper-right with tail, "4" inside -->
    <!-- Ring: CCW from upper-right (53,15) around left+bottom+right, tail at (68,40) -->
    <path d="M53,15 A28,28 0 1 0 68,40 Q72,42 70,46"
          :stroke="dark ? '#d4a060' : '#fff4e0'" stroke-width="4.5"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- "4" arm + crossbar -->
    <path d="M53,15 L23,44 L53,44"
          :stroke="dark ? '#d4a060' : '#fff4e0'" stroke-width="4.5"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- "4" vertical stem -->
    <path d="M53,15 L53,60"
          :stroke="dark ? '#d4a060' : '#fff4e0'" stroke-width="4.5"
          fill="none" stroke-linecap="round"/>

    <!-- ── WORDMARK ── -->

    <!-- "4ever" primary weight -->
    <text
      x="90" y="30"
      dominant-baseline="central"
      font-size="24"
      font-weight="900"
      :fill="dark ? '#1c1008' : '#d4a060'"
      font-family="'Arial Black', Arial, sans-serif"
      letter-spacing="-0.4"
    >4ever</text>

    <!-- Thin separator line -->
    <line x1="90" y1="43" x2="218" y2="43" :stroke="dark ? '#1c1008' : '#d4a060'" stroke-width="0.6" opacity="0.2"/>

    <!-- "COFFEE" tracked small-caps -->
    <text
      x="91" y="58"
      font-size="8.5"
      font-weight="800"
      :fill="dark ? '#5c3a1e' : '#fde9c4'"
      font-family="Arial, sans-serif"
      letter-spacing="6.5"
    >COFFEE</text>
  </svg>
</template>