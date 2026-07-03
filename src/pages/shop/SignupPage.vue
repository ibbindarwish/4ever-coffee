<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '../../stores/customerAuth'
import AppLogo from '../../components/AppLogo.vue'

const router = useRouter()
const auth   = useCustomerAuthStore()

const name     = ref('')
const username = ref('')
const email    = ref('')
const phone    = ref('')
const password = ref('')
const confirm  = ref('')
const showPwd  = ref(false)
const loading  = ref(false)
const error    = ref('')

// ── Validation rules ────────────────────────────────────────
const nameError = computed(() => {
  const v = name.value.trim()
  if (!v) return ''
  if (v.length < 2)             return 'Name must be at least 2 characters.'
  if (!/^[A-Za-z\s'-]+$/.test(v)) return 'Name can only contain letters, spaces, hyphens, or apostrophes.'
  return ''
})

const usernameError = computed(() => {
  const v = username.value.trim()
  if (!v) return ''
  if (v.length < 3)              return 'Username must be at least 3 characters.'
  if (v.length > 20)             return 'Username cannot exceed 20 characters.'
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Username can only contain letters, numbers, and underscores.'
  return ''
})

const emailError = computed(() => {
  const v = email.value.trim()
  if (!v) return ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Please enter a valid email address.'
  return ''
})

const phoneError = computed(() => {
  const v = phone.value.trim()
  if (!v) return ''
  if (!/^\+?[0-9\s\-()]{7,15}$/.test(v)) return 'Please enter a valid phone number (7–15 digits).'
  return ''
})

const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8)            s++
  if (/[A-Z]/.test(p))          s++
  if (/[0-9]/.test(p))          s++
  if (/[^A-Za-z0-9]/.test(p))  s++
  return s
})
const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value])
const strengthColor = computed(() => ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][passwordStrength.value])

const passwordError = computed(() => {
  const p = password.value
  if (!p) return ''
  if (p.length < 8)             return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(p))         return 'Password must contain at least one uppercase letter.'
  if (!/[0-9]/.test(p))         return 'Password must contain at least one number.'
  return ''
})

const confirmError = computed(() => {
  if (!confirm.value) return ''
  if (confirm.value !== password.value) return 'Passwords do not match.'
  return ''
})

const canSubmit = computed(() =>
  name.value.trim().length >= 2     && !nameError.value &&
  username.value.trim().length >= 3 && !usernameError.value &&
  email.value.includes('@')         && !emailError.value &&
  phone.value.trim().length >= 7    && !phoneError.value &&
  password.value.length >= 8        && !passwordError.value &&
  confirm.value === password.value  &&
  !loading.value
)

async function handleSignup() {
  if (!canSubmit.value) return
  loading.value = true
  error.value   = ''
  await new Promise(r => setTimeout(r, 500))
  const result = auth.register(name.value, username.value, email.value, phone.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/shop')
  } else {
    error.value = result.error ?? 'Registration failed.'
  }
}
</script>

<template>
  <div class="signup-root">
    <div class="signup-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="signup-card">
      <div class="brand">
        <AppLogo :size="36" />
        <div class="brand-name">4ever Coffee</div>
      </div>

      <h1 class="title">Create your account</h1>
      <p class="sub">Join thousands of coffee lovers today.</p>

      <div v-if="error" class="error-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ error }}
      </div>

      <div class="form">

        <!-- Full Name -->
        <div class="form-group">
          <label>Full Name <span class="req">*</span></label>
          <input v-model="name" type="text" class="input" :class="{ invalid: nameError }"
            placeholder="e.g. Ahmad Al-Rashid" autocomplete="name"/>
          <span v-if="nameError" class="field-error">{{ nameError }}</span>
        </div>

        <!-- Username -->
        <div class="form-group">
          <label>Username <span class="req">*</span></label>
          <div class="prefix-wrap">
            <span class="prefix">@</span>
            <input v-model="username" type="text" class="input prefix-input" :class="{ invalid: usernameError }"
              placeholder="e.g. ahmad_coffee" autocomplete="username"/>
          </div>
          <span v-if="usernameError" class="field-error">{{ usernameError }}</span>
          <span v-else-if="username && !usernameError" class="field-ok">✓ Username looks good</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email Address <span class="req">*</span></label>
          <input v-model="email" type="email" class="input" :class="{ invalid: emailError }"
            placeholder="you@example.com" autocomplete="email"/>
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
          <span v-else-if="email && !emailError" class="field-ok">✓ Valid email</span>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label>Phone Number <span class="req">*</span></label>
          <input v-model="phone" type="tel" class="input" :class="{ invalid: phoneError }"
            placeholder="e.g. +971 50 123 4567" autocomplete="tel"/>
          <span v-if="phoneError" class="field-error">{{ phoneError }}</span>
          <span v-else-if="phone && !phoneError" class="field-ok">✓ Valid phone number</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password <span class="req">*</span></label>
          <div class="pwd-wrap">
            <input v-model="password" :type="showPwd ? 'text' : 'password'" class="input"
              :class="{ invalid: passwordError }"
              placeholder="Min. 8 chars, 1 uppercase, 1 number" autocomplete="new-password"/>
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
          <div v-if="password" class="strength-bar">
            <div class="strength-track">
              <div class="strength-fill" :style="{ width: (passwordStrength / 4 * 100) + '%', background: strengthColor }"></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
          </div>
          <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label>Confirm Password <span class="req">*</span></label>
          <input v-model="confirm" type="password" class="input" :class="{ invalid: confirmError }"
            placeholder="Repeat your password" autocomplete="new-password"/>
          <span v-if="confirmError" class="field-error">{{ confirmError }}</span>
          <span v-else-if="confirm && !confirmError" class="field-ok">✓ Passwords match</span>
        </div>

        <button class="signup-btn" @click="handleSignup" :disabled="!canSubmit">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Create Account →</span>
        </button>
      </div>

      <p class="login-link">
        Already have an account?
        <RouterLink to="/shop/login">Sign in</RouterLink>
      </p>
    </div>

    <RouterLink to="/shop" class="back-link">← Back to Shop</RouterLink>
  </div>
</template>

<style scoped>
.signup-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0603 0%, #1a0a04 50%, #2c1008 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px; position: relative; overflow: hidden;
}
.signup-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); }
.orb-1 { width: 400px; height: 400px; background: #c8813a; top: -120px; right: -80px; opacity: 0.25; }
.orb-2 { width: 300px; height: 300px; background: #d4a060; bottom: -60px; left: -60px; opacity: 0.18; }

.signup-card {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 36px 40px;
  width: 100%; max-width: 460px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}
.brand { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
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

.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; }
.req { color: #f87171; }

.input {
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  color: #fdf6ec; font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.input::placeholder { color: #475569; }
.input:focus { border-color: #d4a060; background: rgba(255,255,255,0.08); }
.input.invalid { border-color: rgba(239,68,68,0.6); }

.prefix-wrap { position: relative; }
.prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #d4a060; font-weight: 700; pointer-events: none; }
.prefix-input { padding-left: 28px; }

.field-error { font-size: 11px; color: #f87171; font-weight: 500; }
.field-ok    { font-size: 11px; color: #22c55e; font-weight: 500; }

.pwd-wrap { position: relative; }
.pwd-wrap .input { padding-right: 44px; }
.eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; display: flex; align-items: center; }
.eye-btn:hover { color: #94a3b8; }
.eye-btn svg { width: 18px; height: 18px; }

.strength-bar { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.strength-track { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
.strength-label { font-size: 11px; font-weight: 600; min-width: 36px; }

.signup-btn {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 6px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(200,129,58,0.4);
}
.signup-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,129,58,0.55); }
.signup-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }

.login-link { text-align: center; font-size: 13px; color: #64748b; margin-top: 18px; }
.login-link a { color: #d4a060; font-weight: 600; text-decoration: none; }
.login-link a:hover { text-decoration: underline; }

.back-link { position: relative; z-index: 1; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.15s; }
.back-link:hover { color: rgba(255,255,255,0.7); }
</style>