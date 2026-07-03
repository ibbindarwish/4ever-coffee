<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '../../stores/customerAuth'
import AppLogo from '../../components/AppLogo.vue'

const router = useRouter()
const auth   = useCustomerAuthStore()

const email    = ref('')
const password = ref('')
const showPwd  = ref(false)
const loading  = ref(false)
const error    = ref('')

const canSubmit = computed(() =>
  email.value.includes('@') && password.value.length >= 4 && !loading.value
)

async function handleLogin() {
  if (!canSubmit.value) return
  loading.value = true
  error.value   = ''
  await new Promise(r => setTimeout(r, 500))
  const result = auth.login(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/shop')
  } else {
    error.value = result.error ?? 'Login failed.'
  }
}

onMounted(() => { if (auth.isLoggedIn) router.push('/shop') })
</script>

<template>
  <div class="login-root">
    <div class="login-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="login-card">
      <div class="brand">
        <AppLogo :size="36" />
        <div class="brand-name">4ever Coffee</div>
      </div>

      <h1 class="title">Welcome back</h1>
      <p class="sub">Sign in to your account to continue.</p>

      <div v-if="error" class="error-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ error }}
      </div>

      <div class="form" @keydown.enter="handleLogin">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" class="input" placeholder="you@example.com" autocomplete="email"/>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="pwd-wrap">
            <input v-model="password" :type="showPwd ? 'text' : 'password'" class="input"
              placeholder="Your password" autocomplete="current-password"/>
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

      <p class="signup-link">
        Don't have an account?
        <RouterLink to="/shop/signup">Sign up for free</RouterLink>
      </p>
    </div>

    <RouterLink to="/shop" class="back-link">← Back to Shop</RouterLink>
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
.orb-1 { width: 400px; height: 400px; background: #c8813a; top: -120px; left: -80px; opacity: 0.25; }
.orb-2 { width: 300px; height: 300px; background: #d4a060; bottom: -60px; right: -60px; opacity: 0.18; }

.login-card {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 36px 40px;
  width: 100%; max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}
.brand { display: flex; align-items: center; gap: 10px; margin-bottom: 26px; }
.brand-name { font-size: 16px; font-weight: 800; color: #fdf6ec; }
.title { font-size: 22px; font-weight: 800; color: #fdf6ec; margin: 0 0 6px; }
.sub   { font-size: 14px; color: #94a3b8; margin: 0 0 22px; }

.error-banner {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px; padding: 11px 14px;
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: #fca5a5; margin-bottom: 16px;
}
.error-banner svg { width: 16px; height: 16px; flex-shrink: 0; }

.form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.input {
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  color: #fdf6ec; font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.input::placeholder { color: #475569; }
.input:focus { border-color: #d4a060; background: rgba(255,255,255,0.08); }

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

.signup-link { text-align: center; font-size: 13px; color: #64748b; margin-top: 20px; }
.signup-link a { color: #d4a060; font-weight: 600; text-decoration: none; }
.signup-link a:hover { text-decoration: underline; }

.back-link { position: relative; z-index: 1; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.15s; }
.back-link:hover { color: rgba(255,255,255,0.7); }
</style>