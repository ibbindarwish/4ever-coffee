import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export type StaffRole = 'Admin' | 'Supervisor'
interface StaffUser { name: string; email: string; role: StaffRole }

const SESSION_MS   = 30 * 60 * 1000
const LOCKOUT_MS   = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export const useAuthStore = defineStore('auth', () => {
  const user           = ref<StaffUser | null>(null)
  const failedAttempts = ref(0)
  const lockedUntil    = ref<number | null>(null)
  const lastActivity   = ref(Date.now())
  const ready          = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isLocked        = computed(() =>
    lockedUntil.value !== null && Date.now() < lockedUntil.value
  )
  const lockSecondsLeft = computed(() =>
    lockedUntil.value ? Math.max(0, Math.ceil((lockedUntil.value - Date.now()) / 1000)) : 0
  )

  async function loadStaffProfile(userId: string, email: string): Promise<StaffUser | null> {
    const { data } = await supabase.from('staff').select('name, role').eq('id', userId).single()
    if (!data) return null
    return { name: data.name, email, role: data.role === 'admin' ? 'Admin' : 'Supervisor' }
  }

  // Called once, before the router resolves its first navigation — restores
  // whatever Supabase session already exists (e.g. after a page refresh).
  async function hydrate() {
    if (ready.value) return
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const profile = await loadStaffProfile(session.user.id, session.user.email ?? '')
      if (profile) { user.value = profile; lastActivity.value = Date.now() }
      else await supabase.auth.signOut()
    }
    ready.value = true
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (isLocked.value) {
      const mins = Math.ceil(lockSecondsLeft.value / 60)
      return { success: false, error: `Account locked. Try again in ${mins} minute(s).` }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error || !data.user) {
      failedAttempts.value++
      if (failedAttempts.value >= MAX_ATTEMPTS) {
        lockedUntil.value = Date.now() + LOCKOUT_MS
        failedAttempts.value = 0
        return { success: false, error: 'Too many failed attempts. Account locked for 15 minutes.' }
      }
      const left = MAX_ATTEMPTS - failedAttempts.value
      return { success: false, error: `Invalid credentials. ${left} attempt(s) remaining.` }
    }

    const profile = await loadStaffProfile(data.user.id, data.user.email ?? '')
    if (!profile) {
      await supabase.auth.signOut()
      return { success: false, error: 'This account is not authorized for staff access.' }
    }

    user.value = profile
    failedAttempts.value = 0
    lockedUntil.value = null
    lastActivity.value = Date.now()
    return { success: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
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
    user, isAuthenticated, isLocked, lockSecondsLeft, failedAttempts, ready,
    hydrate, login, logout, updateActivity, checkSession,
  }
})
