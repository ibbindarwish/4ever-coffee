import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export interface CustomerProfile {
  id: string
  name: string
  username: string
  email: string
  phone: string
}

export const useCustomerAuthStore = defineStore('customerAuth', () => {
  const current = ref<CustomerProfile | null>(null)
  const ready   = ref(false)

  const isLoggedIn = computed(() => !!current.value)

  async function loadProfile(userId: string, email: string): Promise<CustomerProfile | null> {
    const { data } = await supabase.from('customer_profiles').select('name, username, phone').eq('id', userId).single()
    if (!data) return null
    return { id: userId, name: data.name, username: data.username, email, phone: data.phone ?? '' }
  }

  // Called once, before the router resolves its first navigation — restores
  // whatever Supabase session already exists (e.g. after a page refresh).
  async function hydrate() {
    if (ready.value) return
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      current.value = await loadProfile(session.user.id, session.user.email ?? '')
    }
    ready.value = true
  }

  async function register(
    name: string, username: string, email: string, phone: string, password: string,
  ): Promise<{ success: boolean; error?: string }> {
    const normEmail    = email.toLowerCase().trim()
    const normUsername = username.toLowerCase().trim()

    const { data, error } = await supabase.auth.signUp({
      email: normEmail,
      password,
      options: { data: { name: name.trim(), username: normUsername, phone: phone.trim() } },
    })

    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists'))
        return { success: false, error: 'An account with this email already exists.' }
      return { success: false, error: error.message }
    }
    if (!data.user) return { success: false, error: 'Registration failed.' }

    // If email confirmation is required (default Supabase setting), there is
    // no session yet — the account exists but isn't logged in until confirmed.
    if (!data.session) {
      return { success: false, error: 'Account created — check your email to confirm before signing in.' }
    }

    current.value = { id: data.user.id, name: name.trim(), username: normUsername, email: normEmail, phone: phone.trim() }
    return { success: true }
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })
    if (error || !data.user) return { success: false, error: 'Incorrect email or password.' }

    current.value = await loadProfile(data.user.id, data.user.email ?? '')
    return { success: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    current.value = null
  }

  return { current, isLoggedIn, ready, hydrate, register, login, logout }
})
