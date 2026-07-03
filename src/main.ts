import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Global image fallback — if any product image fails to load, show a generic coffee photo
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=350&fit=crop&auto=format&q=70'
document.addEventListener('error', (e) => {
  const img = e.target as HTMLImageElement
  if (img.tagName !== 'IMG' || img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = FALLBACK_IMG
  img.style.opacity = '0.7'
}, true)
