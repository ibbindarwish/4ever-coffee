<template>
  <RouterView />
</template>

<style>
/* ── Global design foundation ── */
*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1c1917;
  background: #faf7f2;
}

/* Playfair Display for brand headings — h1 on every page gets it automatically */
h1 {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  letter-spacing: -0.02em;
}

/* Custom scrollbar — subtle and refined */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.18); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(28,25,23,0.32); }

/* Global accessible focus ring */
:focus-visible {
  outline: 2px solid #d4a060;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Smooth scroll */
html { scroll-behavior: smooth; }

/* Selection color */
::selection { background: rgba(212,160,96,0.28); color: #1c1917; }

/* Image rendering */
img { display: block; }

/* Prevent flash on load */
.v-enter-active, .v-leave-active { transition: opacity 0.18s ease; }
.v-enter-from, .v-leave-to { opacity: 0; }
</style>