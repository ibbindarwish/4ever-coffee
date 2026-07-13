import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // The Three.js-based Cup3DViewer chunk is intentionally large — it's lazy
    // loaded on demand (see defineAsyncComponent in CupDesignerPage.vue) and
    // never part of the initial bundle, so its size here is expected.
    chunkSizeWarningLimit: 600,
  },
})
