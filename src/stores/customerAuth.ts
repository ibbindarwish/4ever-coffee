import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Customer {
  id: string
  name: string
  username: string
  email: string
  phone: string
  password: string
  createdAt: string
}

const STORAGE_KEY    = 'fc_customers'
const SESSION_KEY    = 'fc_customer_session'

function loadCustomers(): Customer[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveCustomers(list: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const useCustomerAuthStore = defineStore('customerAuth', () => {
  const customers  = ref<Customer[]>(loadCustomers())
  const current    = ref<Omit<Customer, 'password'> | null>(
    JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
  )

  const isLoggedIn = computed(() => !!current.value)

  function register(name: string, username: string, email: string, phone: string, password: string): { success: boolean; error?: string } {
    const normEmail    = email.toLowerCase().trim()
    const normUsername = username.toLowerCase().trim()

    if (customers.value.find(c => c.email === normEmail))
      return { success: false, error: 'An account with this email already exists.' }
    if (customers.value.find(c => c.username === normUsername))
      return { success: false, error: 'This username is already taken.' }
    if (customers.value.find(c => c.phone === phone.trim()))
      return { success: false, error: 'This phone number is already registered.' }

    const customer: Customer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      username: normUsername,
      email: normEmail,
      phone: phone.trim(),
      password,
      createdAt: new Date().toISOString(),
    }
    customers.value.push(customer)
    saveCustomers(customers.value)

    const session = { id: customer.id, name: customer.name, username: customer.username, email: customer.email, phone: customer.phone, createdAt: customer.createdAt }
    current.value = session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true }
  }

  function login(email: string, password: string): { success: boolean; error?: string } {
    const norm = email.toLowerCase().trim()
    const customer = customers.value.find(c => c.email === norm && c.password === password)
    if (!customer) return { success: false, error: 'Incorrect email or password.' }

    const session = { id: customer.id, name: customer.name, username: customer.username, email: customer.email, phone: customer.phone, createdAt: customer.createdAt }
    current.value = session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true }
  }

  function logout() {
    current.value = null
    sessionStorage.removeItem(SESSION_KEY)
  }

  return { current, isLoggedIn, register, login, logout }
})