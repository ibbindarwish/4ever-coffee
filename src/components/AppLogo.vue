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

    <!-- Filled circle -->
    <circle cx="40" cy="40" r="36" :fill="dark ? '#1c1008' : '#c8813a'"/>

    <!-- Inner precision ring -->
    <circle cx="40" cy="40" r="30" stroke="white" stroke-width="0.9" fill="none" opacity="0.18"/>

    <!-- Cardinal accent dots on inner ring -->
    <circle cx="40" cy="10" r="1.5" fill="white" opacity="0.25"/>
    <circle cx="70" cy="40" r="1.5" fill="white" opacity="0.25"/>
    <circle cx="40" cy="70" r="1.5" fill="white" opacity="0.25"/>
    <circle cx="10" cy="40" r="1.5" fill="white" opacity="0.25"/>

    <!-- "@"-style "4": outer ring arc leaving gap on the right -->
    <path d="M62,30 A24,24 0 1 0 62,50"
          :stroke="dark ? '#d4a060' : '#fff4e0'" stroke-width="5"
          fill="none" stroke-linecap="round"/>
    <!-- "4" arm + crossbar inside the ring -->
    <path d="M62,30 L16,43 L62,43"
          :stroke="dark ? '#d4a060' : '#fff4e0'" stroke-width="5"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- "4" vertical stem — fills ring gap, completing the "@" -->
    <line x1="62" y1="30" x2="62" y2="50"
          :stroke="dark ? '#d4a060' : '#fff4e0'" stroke-width="5" stroke-linecap="round"/>

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