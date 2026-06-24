<script setup lang="ts">
defineProps<{ size?: number; dark?: boolean }>()
</script>

<template>
  <svg
    :width="(size ?? 48) * 1.45"
    :height="size ?? 48"
    viewBox="0 0 200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ color: dark ? '#1a0a04' : '#d4a060' }"
  >
    <!--
      Logo: "4" with a connected circle beneath the vertical stem,
      then "ever" to the right.

      The bottom of the "4" right stem flows directly into the
      top of the circle — no gap, fully connected.
    -->

    <!-- "4" — left diagonal arm -->
    <line
      x1="44" y1="8"
      x2="7"  y2="60"
      stroke="currentColor" stroke-width="10" stroke-linecap="round"
    />

    <!-- "4" — horizontal crossbar -->
    <line
      x1="7"  y1="60"
      x2="76" y2="60"
      stroke="currentColor" stroke-width="10" stroke-linecap="round"
    />

    <!-- "4" — right vertical stem descending into the circle -->
    <line
      x1="64" y1="8"
      x2="64" y2="98"
      stroke="currentColor" stroke-width="10" stroke-linecap="round"
    />

    <!-- Circle connected beneath "4" (top of circle at y=98, same as stem end) -->
    <circle
      cx="64" cy="119" r="21"
      stroke="currentColor" stroke-width="10" fill="none"
    />

    <!-- "ever" wordmark to the right, vertically centred on the whole mark -->
    <text
      x="96" y="72"
      dominant-baseline="central"
      font-size="38"
      font-weight="900"
      fill="currentColor"
      font-family="Arial Black, Arial, sans-serif"
    >ever</text>
  </svg>
</template>
