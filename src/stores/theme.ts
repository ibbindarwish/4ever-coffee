import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const dark = ref(localStorage.getItem('fc_dark') === 'true')

  watch(dark, val => {
    localStorage.setItem('fc_dark', String(val))
    document.documentElement.classList.toggle('dark', val)
  }, { immediate: true })

  function toggle() { dark.value = !dark.value }

  return { dark, toggle }
})