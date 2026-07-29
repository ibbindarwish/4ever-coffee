import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type CupSize     = 'small' | 'medium' | 'large'

export interface OrderItem {
  productId: number
  name:      string
  price:     number
  size:      CupSize
  qty:       number
}

export interface Order {
  id:         string
  items:      OrderItem[]
  customer:   { name: string; email: string; phone: string; address: string; city: string }
  subtotal:   number
  shipping:   number
  discount?:  number
  promoCode?: string
  total:      number
  status:     OrderStatus
  date:       string
  note?:      string
}

interface OrderRow {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  subtotal: number
  shipping: number
  discount: number | null
  promo_code: string | null
  total: number
  status: OrderStatus
  note: string | null
  created_at: string
  order_items: Array<{
    product_id: number; name: string; price: number; size: CupSize; qty: number
  }>
}

function fromRow(r: OrderRow): Order {
  return {
    id: r.id,
    items: r.order_items.map(i => ({
      productId: i.product_id, name: i.name, price: Number(i.price), size: i.size, qty: i.qty,
    })),
    customer: {
      name: r.customer_name, email: r.customer_email, phone: r.customer_phone,
      address: r.customer_address, city: r.customer_city,
    },
    subtotal: Number(r.subtotal),
    shipping: Number(r.shipping),
    discount: r.discount !== null ? Number(r.discount) : undefined,
    promoCode: r.promo_code ?? undefined,
    total: Number(r.total),
    status: r.status,
    date: r.created_at.split('T')[0],
    note: r.note ?? undefined,
  }
}

export const useOrdersStore = defineStore('orders', () => {
  const orders  = ref<Order[]>([])
  const loaded  = ref(false)
  const seenIds = ref(new Set<string>())
  const newOrderIds = ref<string[]>([])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (error) { console.error('[orders] fetch failed:', error.message); return }

    orders.value = (data as OrderRow[]).map(fromRow)
    loaded.value = true

    const freshPending = orders.value.filter(o => o.status === 'pending' && !seenIds.value.has(o.id))
    newOrderIds.value = freshPending.map(o => o.id)
  }

  async function fetchOrderByPaymentIntent(paymentIntentId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .maybeSingle()
    if (error || !data) return null
    return fromRow(data as OrderRow)
  }

  const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)

  async function updateStatus(id: string, status: OrderStatus) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) { console.error('[orders] updateStatus failed:', error.message); return }
    const o = orders.value.find(o => o.id === id)
    if (o) o.status = status
  }

  function markAllRead() {
    orders.value.forEach(o => seenIds.value.add(o.id))
    newOrderIds.value = []
  }

  function findById(id: string): Order | undefined {
    return orders.value.find(o => o.id === id.trim().toUpperCase())
  }

  if (!loaded.value) fetchOrders()

  return {
    orders, loaded, pendingCount, newOrderIds,
    fetchOrders, fetchOrderByPaymentIntent, updateStatus, markAllRead, findById,
  }
})
