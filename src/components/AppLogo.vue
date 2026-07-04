<script setup lang="ts">
defineProps<{ size?: number; dark?: boolean }>()
</script>

<template>
  <svg
    :width="(size ?? 48) * 2.2"
    :height="size ?? 48"
    viewBox="0 0 220 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ color: dark ? '#1a0a04' : '#d4a060' }"
  >
    <!-- Outer circle -->
    <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="4" fill="none"/>

    <!-- Inner ring (premium detail) -->
    <circle cx="50" cy="50" r="39" stroke="currentColor" stroke-width="1" fill="none" opacity="0.35"/>

    <!-- "4" inside the circle -->
    <!-- Diagonal arm: top-right down to left -->
    <line x1="56" y1="18" x2="22" y2="58" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>
    <!-- Horizontal crossbar -->
    <line x1="22" y1="58" x2="72" y2="58" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>
    <!-- Vertical stem -->
    <line x1="56" y1="18" x2="56" y2="82" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>

    <!-- "ever" wordmark -->
    <text
      x="108" y="54"
      dominant-baseline="central"
      font-size="36"
      font-weight="900"
      fill="currentColor"
      font-family="'Arial Black', Arial, sans-serif"
      letter-spacing="-0.5"
    >ever</text>
  </svg>
</template>