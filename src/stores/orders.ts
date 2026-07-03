import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CartItem } from './cart'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  customer: { name: string; email: string; phone: string; address: string; city: string; zip: string }
  subtotal: number
  shipping: number
  discount?: number
  promoCode?: string
  total: number
  status: OrderStatus
  date: string
  damagedCups?: number
  returnedCups?: number
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([
    { id: 'ORD-1001', items: [], customer: { name: 'Sara Ahmed',    email: 'sara@example.com',   phone: '+971501234567', address: '12 Sheikh Zayed Rd', city: 'Dubai', zip: '00000' }, subtotal: 18.00, shipping: 0,    total: 18.00, status: 'delivered', date: '2026-06-01', damagedCups: 1 },
    { id: 'ORD-1002', items: [], customer: { name: 'Khalid Hassan', email: 'khalid@example.com', phone: '+971502345678', address: '7 Al Wasl Rd',       city: 'Dubai', zip: '00000' }, subtotal: 9.50,  shipping: 2.99, total: 12.49, status: 'ready',     date: '2026-06-12' },
    { id: 'ORD-1003', items: [], customer: { name: 'Layla Nour',    email: 'layla@example.com',  phone: '+971503456789', address: '33 Jumeirah St',     city: 'Dubai', zip: '00000' }, subtotal: 22.75, shipping: 0,    total: 22.75, status: 'preparing', date: '2026-06-14', returnedCups: 2 },
    { id: 'ORD-1004', items: [], customer: { name: 'Omar Faris',    email: 'omar@example.com',   phone: '+971504567890', address: '5 Downtown Blvd',    city: 'Dubai', zip: '00000' }, subtotal: 14.00, shipping: 2.99, total: 16.99, status: 'pending',   date: '2026-06-19' },
    { id: 'ORD-1005', items: [], customer: { name: 'Fatima Al Ali', email: 'fatima@example.com', phone: '+971505678901', address: '88 Marina Walk',     city: 'Dubai', zip: '00000' }, subtotal: 31.25, shipping: 0,    total: 31.25, status: 'pending',   date: '2026-06-20', damagedCups: 1 },
    { id: 'ORD-1006', items: [], customer: { name: 'Sara Ahmed',    email: 'sara@example.com',   phone: '+971501234567', address: '12 Sheikh Zayed Rd', city: 'Dubai', zip: '00000' }, subtotal: 11.00, shipping: 0,    total: 11.00, status: 'delivered', date: '2026-06-05', returnedCups: 1 },
    { id: 'ORD-1007', items: [], customer: { name: 'Sara Ahmed',    email: 'sara@example.com',   phone: '+971501234567', address: '12 Sheikh Zayed Rd', city: 'Dubai', zip: '00000' }, subtotal: 25.50, shipping: 0,    total: 25.50, status: 'delivered', date: '2026-06-15', damagedCups: 1 },
    { id: 'ORD-1008', items: [], customer: { name: 'Khalid Hassan', email: 'khalid@example.com', phone: '+971502345678', address: '7 Al Wasl Rd',       city: 'Dubai', zip: '00000' }, subtotal: 14.75, shipping: 2.99, total: 17.74, status: 'delivered', date: '2026-06-08' },
    { id: 'ORD-1009', items: [], customer: { name: 'Layla Nour',    email: 'layla@example.com',  phone: '+971503456789', address: '33 Jumeirah St',     city: 'Dubai', zip: '00000' }, subtotal: 8.50,  shipping: 2.99, total: 11.49, status: 'delivered', date: '2026-06-18' },
    { id: 'ORD-1010', items: [], customer: { name: 'Omar Faris',    email: 'omar@example.com',   phone: '+971504567890', address: '5 Downtown Blvd',    city: 'Dubai', zip: '00000' }, subtotal: 19.50, shipping: 0,    total: 19.50, status: 'delivered', date: '2026-06-15', damagedCups: 1 },
    { id: 'ORD-1011', items: [], customer: { name: 'Fatima Al Ali', email: 'fatima@example.com', phone: '+971505678901', address: '88 Marina Walk',     city: 'Dubai', zip: '00000' }, subtotal: 15.00, shipping: 0,    total: 15.00, status: 'delivered', date: '2026-06-12', returnedCups: 1 },
    { id: 'ORD-1012', items: [], customer: { name: 'Reem Sultan',   email: 'reem@example.com',   phone: '+971506789012', address: '44 Jumeirah Beach', city: 'Dubai', zip: '00000' }, subtotal: 12.50, shipping: 2.99, total: 15.49, status: 'delivered', date: '2026-06-20', returnedCups: 1 },
    { id: 'ORD-1013', items: [], customer: { name: 'Ahmed Rashid',  email: 'ahmed@example.com',  phone: '+971507890123', address: '9 Business Bay',    city: 'Dubai', zip: '00000' }, subtotal: 22.00, shipping: 0,    total: 22.00, status: 'delivered', date: '2026-06-21', returnedCups: 1 },
    { id: 'ORD-1014', items: [], customer: { name: 'Sara Ahmed',    email: 'sara@example.com',   phone: '+971501234567', address: '12 Sheikh Zayed Rd', city: 'Dubai', zip: '00000' }, subtotal: 7.50,  shipping: 2.99, total: 10.49, status: 'delivered', date: '2026-06-21' },
    { id: 'ORD-1015', items: [], customer: { name: 'Khalid Hassan', email: 'khalid@example.com', phone: '+971502345678', address: '7 Al Wasl Rd',       city: 'Dubai', zip: '00000' }, subtotal: 9.00,  shipping: 2.99, total: 11.99, status: 'delivered', date: '2026-06-22' },
  ])

  const pendingCount  = ref(orders.value.filter(o => o.status === 'pending').length)
  const newOrderIds   = ref<string[]>([])

  function placeOrder(payload: Omit<Order, 'id' | 'date' | 'status'>) {
    const id = `ORD-${1006 + rand(0, 999)}`
    orders.value.unshift({ ...payload, id, status: 'pending', date: new Date().toISOString().split('T')[0] })
    pendingCount.value++
    newOrderIds.value.push(id)
    return id
  }

  function updateStatus(id: string, status: OrderStatus) {
    const o = orders.value.find(o => o.id === id)
    if (o) {
      if (o.status === 'pending' && status !== 'pending')
        pendingCount.value = Math.max(0, pendingCount.value - 1)
      o.status = status
    }
  }

  function markAllRead() {
    newOrderIds.value = []
  }

  function findById(id: string): Order | undefined {
    return orders.value.find(o => o.id === id.trim().toUpperCase())
  }

  return { orders, pendingCount, newOrderIds, placeOrder, updateStatus, markAllRead, findById }
})