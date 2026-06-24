<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'

const auth   = useAuthStore()
const router = useRouter()

let sessionCheck: ReturnType<typeof setInterval>

function trackActivity() { auth.updateActivity() }

onMounted(() => {
  window.addEventListener('mousemove', trackActivity, { passive: true })
  window.addEventListener('keydown',   trackActivity, { passive: true })
  window.addEventListener('click',     trackActivity, { passive: true })
  sessionCheck = setInterval(() => {
    if (!auth.checkSession()) router.push('/login')
  }, 60_000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', trackActivity)
  window.removeEventListener('keydown',   trackActivity)
  window.removeEventListener('click',     trackActivity)
  clearInterval(sessionCheck)
})
</script>

<template>
  <div class="shell">
    <AppSidebar />
    <div class="main-col">
      <AppHeader />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell { display: flex; min-height: 100vh; background: #faf7f2; }
.main-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.main-content { flex: 1; padding: 28px; overflow-y: auto; }
</style>
