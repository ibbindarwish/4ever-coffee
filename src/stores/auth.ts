import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CREDENTIALS = [
  { email: 'admin@4evercoffee.ae',   password: '4ever@2026',   name: 'Ahmad Admin',  role: 'Admin' },
  { email: 'manager@4evercoffee.ae', password: '4ever2026', name: 'Sara Manager', role: 'Supervisor' },
]

const SESSION_MS   = 30 * 60 * 1000
const LOCKOUT_MS   = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ name: string; email: string; role: string } | null>(
    JSON.parse(sessionStorage.getItem('fc_auth_user') || 'null')
  )
  const failedAttempts = ref(0)
  const lockedUntil    = ref<number | null>(
    Number(sessionStorage.getItem('fc_locked_until')) || null
  )
  const lastActivity   = ref(Date.now())

  const isAuthenticated = computed(() => !!user.value)
  const isLocked        = computed(() =>
    lockedUntil.value !== null && Date.now() < lockedUntil.value
  )
  const lockSecondsLeft = computed(() =>
    lockedUntil.value ? Math.max(0, Math.ceil((lockedUntil.value - Date.now()) / 1000)) : 0
  )

  function login(email: string, password: string): { success: boolean; error?: string } {
    if (isLocked.value) {
      const mins = Math.ceil(lockSecondsLeft.value / 60)
      return { success: false, error: `Account locked. Try again in ${mins} minute(s).` }
    }

    const cred = CREDENTIALS.find(
      c => c.email === email.toLowerCase().trim() && c.password === password
    )

    if (cred) {
      user.value = { name: cred.name, email: cred.email, role: cred.role }
      sessionStorage.setItem('fc_auth_user', JSON.stringify(user.value))
      sessionStorage.removeItem('fc_locked_until')
      failedAttempts.value = 0
      lockedUntil.value    = null
      lastActivity.value   = Date.now()
      return { success: true }
    }

    failedAttempts.value++
    if (failedAttempts.value >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS
      lockedUntil.value = until
      sessionStorage.setItem('fc_locked_until', String(until))
      failedAttempts.value = 0
      return { success: false, error: 'Too many failed attempts. Account locked for 15 minutes.' }
    }

    const left = MAX_ATTEMPTS - failedAttempts.value
    return { success: false, error: `Invalid credentials. ${left} attempt(s) remaining.` }
  }

  function logout() {
    user.value = null
    sessionStorage.removeItem('fc_auth_user')
  }

  function updateActivity() {
    lastActivity.value = Date.now()
  }

  function checkSession(): boolean {
    if (!user.value) return false
    if (Date.now() - lastActivity.value > SESSION_MS) {
      logout()
      return false
    }
    updateActivity()
    return true
  }

  return {
    user, isAuthenticated, isLocked, lockSecondsLeft, failedAttempts,
    login, logout, updateActivity, checkSession,
  }
})
