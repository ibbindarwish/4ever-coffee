<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppLogo from '../components/AppLogo.vue'

const router = useRouter()
const auth   = useAuthStore()

const email    = ref('')
const password = ref('')
const showPwd  = ref(false)
const loading  = ref(false)
const error    = ref('')

const lockTimer = ref<ReturnType<typeof setInterval> | null>(null)
const remaining = ref(0)

const canSubmit = computed(() =>
  email.value.trim().length > 0 && password.value.length >= 4 && !loading.value && !auth.isLocked
)

function startLockTimer() {
  if (lockTimer.value) clearInterval(lockTimer.value)
  remaining.value = auth.lockSecondsLeft
  lockTimer.value = setInterval(() => {
    remaining.value = auth.lockSecondsLeft
    if (remaining.value <= 0 && lockTimer.value) {
      clearInterval(lockTimer.value)
      lockTimer.value = null
      error.value = ''
    }
  }, 1000)
}

async function handleLogin() {
  if (!canSubmit.value) return
  loading.value = true
  error.value   = ''
  await new Promise(r => setTimeout(r, 600))
  const result = auth.login(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error ?? 'Login failed.'
    if (auth.isLocked) startLockTimer()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') handleLogin()
}

onMounted(() => {
  if (auth.isAuthenticated) router.push('/')
  if (auth.isLocked) startLockTimer()
})
onUnmounted(() => { if (lockTimer.value) clearInterval(lockTimer.value) })
</script>

<template>
  <div class="login-root">
    <div class="login-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="login-card">
      <div class="brand">
        <AppLogo :size="40" />
        <div class="brand-sub">Admin Portal</div>
      </div>

      <h1 class="login-title">Welcome back</h1>
      <p class="login-sub">Sign in to manage your coffee shop.</p>

      <div v-if="auth.isLocked" class="lock-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Account locked · {{ Math.ceil(remaining / 60) }}m {{ remaining % 60 }}s remaining
      </div>

      <div v-else-if="error" class="error-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ error }}
      </div>

      <div v-if="auth.failedAttempts > 0 && !auth.isLocked" class="attempt-dots">
        <span v-for="i in 5" :key="i" class="dot" :class="{ filled: i <= auth.failedAttempts }"></span>
        <span class="dot-label">{{ 5 - auth.failedAttempts }} attempt(s) left</span>
      </div>

      <div class="form" @keydown="handleKeydown">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" class="input" placeholder="admin@4evercoffee.ae"
            autocomplete="username" :disabled="auth.isLocked"/>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="pwd-wrap">
            <input v-model="password" :type="showPwd ? 'text' : 'password'" class="input"
              placeholder="Enter your password" autocomplete="current-password" :disabled="auth.isLocked"/>
            <button type="button" class="eye-btn" @click="showPwd = !showPwd" tabindex="-1">
              <svg v-if="!showPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>
        <button class="login-btn" @click="handleLogin" :disabled="!canSubmit">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Sign In →</span>
        </button>
      </div>

      <details class="demo-hint">
        <summary>Demo Credentials</summary>
        <div class="demo-table">
          <div class="demo-row"><span>Admin</span><span>admin@4evercoffee.ae</span><span>4ever@2026</span></div>
          <div class="demo-row"><span>Supervisor</span><span>manager@4evercoffee.ae</span><span>Manager@2026</span></div>
        </div>
      </details>

      <p class="security-note">🔒 Protected · Session expires after 30 min of inactivity</p>
    </div>

    <RouterLink to="/shop" class="back-link">← Visit 4ever Coffee Shop</RouterLink>
  </div>
</template>

<style scoped>
.login-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0603 0%, #1a0a04 50%, #2c1008 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px; position: relative; overflow: hidden;
}
.login-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); }
.orb-1 { width: 400px; height: 400px; background: #c8813a; top: -120px; left: -80px; opacity: 0.3; }
.orb-2 { width: 300px; height: 300px; background: #d4a060; bottom: -60px; right: -60px; opacity: 0.2; }
.orb-3 { width: 200px; height: 200px; background: #8B4513; top: 60%; left: 60%; opacity: 0.15; }

.login-card {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 36px 40px;
  width: 100%; max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}
.brand { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.brand-sub  { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; }
.login-title { font-size: 22px; font-weight: 800; color: #fdf6ec; margin: 0 0 6px; }
.login-sub   { font-size: 14px; color: #94a3b8; margin: 0 0 22px; }

.lock-banner {
  background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 10px; padding: 12px 14px;
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: #f87171; margin-bottom: 16px;
}
.lock-banner svg { width: 16px; height: 16px; flex-shrink: 0; }
.error-banner {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px; padding: 11px 14px;
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: #fca5a5; margin-bottom: 14px;
}
.error-banner svg { width: 16px; height: 16px; flex-shrink: 0; }
.attempt-dots { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); }
.dot.filled { background: #f59e0b; }
.dot-label { font-size: 11px; color: #f59e0b; margin-left: 4px; font-weight: 600; }

.form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.input {
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  color: #fdf6ec; font-size: 14px; outline: none; transition: border-color 0.2s;
}
.input::placeholder { color: #475569; }
.input:focus { border-color: #d4a060; background: rgba(255,255,255,0.08); }
.input:disabled { opacity: 0.4; cursor: not-allowed; }
.pwd-wrap { position: relative; }
.pwd-wrap .input { padding-right: 44px; }
.eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; display: flex; align-items: center; }
.eye-btn:hover { color: #94a3b8; }
.eye-btn svg { width: 18px; height: 18px; }

.login-btn {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 4px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(200,129,58,0.4);
}
.login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,129,58,0.55); }
.login-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }

.demo-hint { margin-top: 22px; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; }
.demo-hint summary { font-size: 12px; font-weight: 600; color: #64748b; padding: 10px 14px; cursor: pointer; user-select: none; }
.demo-hint summary:hover { color: #94a3b8; }
.demo-table { padding: 0 14px 12px; display: flex; flex-direction: column; gap: 6px; }
.demo-row { display: grid; grid-template-columns: 90px 1fr 1fr; gap: 8px; font-size: 11px; color: #64748b; font-family: monospace; }
.demo-row span:first-child { color: #94a3b8; font-weight: 600; font-family: inherit; }
.security-note { text-align: center; font-size: 11px; color: #334155; margin-top: 18px; }

.back-link { position: relative; z-index: 1; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.15s; }
.back-link:hover { color: rgba(255,255,255,0.7); }
</style>
