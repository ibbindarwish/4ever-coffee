<script setup lang="ts">
defineProps<{ size?: number; dark?: boolean }>()
</script>

<template>
  <!--
    4ever Coffee logo — badge mark (double-ring "4" lettermark) + wordmark.
    size prop controls height in px; width scales proportionally (ratio ~2.9).
  -->
  <svg
    :width="(size ?? 48) * 2.9"
    :height="size ?? 48"
    viewBox="0 0 186 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ color: dark ? '#1a0a04' : '#d4a060' }"
  >
    <!-- ── BADGE MARK ───────────────────────────── -->

    <!-- Outer glow ring (very subtle) -->
    <circle cx="32" cy="32" r="31" stroke="currentColor" stroke-width="0.6" opacity="0.18"/>

    <!-- Primary badge ring -->
    <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="none"/>

    <!-- Inner double-ring (premium detail) -->
    <circle cx="32" cy="32" r="22.5" stroke="currentColor" stroke-width="0.9" fill="none" opacity="0.32"/>

    <!-- Small decorative dots at 12, 3, 6, 9 o'clock on inner ring -->
    <circle cx="32"   cy="9.5"  r="1.5" fill="currentColor" opacity="0.35"/>
    <circle cx="54.5" cy="32"   r="1.5" fill="currentColor" opacity="0.35"/>
    <circle cx="32"   cy="54.5" r="1.5" fill="currentColor" opacity="0.35"/>
    <circle cx="9.5"  cy="32"   r="1.5" fill="currentColor" opacity="0.35"/>

    <!-- "4" — one continuous hand-drawn stroke -->
    <path d="M39,10 L10,40 L55,40 M39,10 L39,57"
          fill="none" stroke="currentColor" stroke-width="5.2"
          stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Tiny accent dot at crossbar junction (premium detail) -->
    <circle cx="10" cy="40" r="2.4" fill="currentColor" opacity="0.55"/>

    <!-- Signature tail — swooshes off the ring, echoing the sketch -->
    <path d="M13,45 Q32,54 51,45 Q58,41 64,33"
          fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.9"/>

    <!-- ── WORDMARK ──────────────────────────────── -->

    <!-- "4ever" — main weight -->
    <text
      x="76" y="29"
      dominant-baseline="central"
      font-size="28"
      font-weight="900"
      fill="currentColor"
      font-family="'Arial Black', Arial, sans-serif"
      letter-spacing="-0.8"
    >4<tspan :fill="dark ? '#2e1608' : '#fdf6ec'" opacity="0.95">ever</tspan></text>

    <!-- "COFFEE" — sub-label in small caps -->
    <text
      x="79" y="51"
      font-size="9.5"
      font-weight="800"
      fill="currentColor"
      opacity="0.55"
      font-family="Arial, sans-serif"
      letter-spacing="5"
    >COFFEE</text>

    <!-- Accent line under "4ever" -->
    <line x1="76" y1="41" x2="182" y2="41"
          stroke="currentColor" stroke-width="0.7" opacity="0.25"/>
  </svg>
</template>