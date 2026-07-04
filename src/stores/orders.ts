import { defineStore } from 'pinia'
import { ref } from 'vue'

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

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([
    {
      id: 'ORD-1001',
      items: [
        { productId: 2,  name: 'Cappuccino',        price: 4.50, size: 'medium', qty: 2 },
        { productId: 7,  name: 'Mocha',             price: 5.25, size: 'medium', qty: 1 },
        { productId: 17, name: 'Chocolate Brownie', price: 3.75, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Sara Ahmed',    email: 'sara.ahmed@gmail.com',       phone: '+971 50 123 4567', address: '12 Sheikh Zayed Rd, Apt 4B', city: 'Dubai' },
      subtotal: 18.00, shipping: 0, total: 18.00, status: 'delivered', date: '2026-06-01',
      note: 'Extra hot please',
    },
    {
      id: 'ORD-1002',
      items: [
        { productId: 5,  name: 'Cold Brew',   price: 5.00, size: 'medium', qty: 1 },
        { productId: 8,  name: 'Flat White',  price: 4.50, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Khalid Hassan', email: 'khalid.hassan@hotmail.com',  phone: '+971 50 234 5678', address: '7 Al Wasl Rd, Villa 3', city: 'Dubai' },
      subtotal: 9.50, shipping: 2.99, total: 12.49, status: 'ready', date: '2026-06-12',
    },
    {
      id: 'ORD-1003',
      items: [
        { productId: 6,  name: 'Caramel Macchiato', price: 5.50, size: 'medium', qty: 1 },
        { productId: 7,  name: 'Mocha',             price: 5.25, size: 'medium', qty: 1 },
        { productId: 3,  name: 'Caffe Latte',       price: 4.75, size: 'medium', qty: 1 },
        { productId: 15, name: 'Lemon Drizzle Cake',price: 4.00, size: 'medium', qty: 1 },
        { productId: 28, name: 'Chelsea Bun',       price: 3.25, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Layla Nour',    email: 'layla.nour@icloud.com',      phone: '+971 50 345 6789', address: '33 Jumeirah St, Floor 2', city: 'Dubai' },
      subtotal: 22.75, shipping: 0, total: 22.75, status: 'preparing', date: '2026-06-14',
    },
    {
      id: 'ORD-1004',
      items: [
        { productId: 1,  name: 'Espresso',     price: 3.50, size: 'medium', qty: 2 },
        { productId: 17, name: 'Chocolate Brownie', price: 3.75, size: 'medium', qty: 1 },
        { productId: 28, name: 'Chelsea Bun',  price: 3.25, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Omar Faris',    email: 'omar.faris@outlook.com',     phone: '+971 50 456 7890', address: '5 Downtown Blvd, Tower A', city: 'Dubai' },
      subtotal: 14.00, shipping: 2.99, total: 16.99, status: 'pending', date: '2026-06-19',
    },
    {
      id: 'ORD-1005',
      items: [
        { productId: 3,  name: 'Caffe Latte',       price: 4.75, size: 'medium', qty: 2 },
        { productId: 9,  name: 'Iced Latte',        price: 5.00, size: 'medium', qty: 1 },
        { productId: 11, name: 'Vanilla Latte',     price: 5.00, size: 'medium', qty: 1 },
        { productId: 10, name: 'Matcha Latte',      price: 5.25, size: 'medium', qty: 1 },
        { productId: 19, name: 'Biscoff Cheesecake',price: 5.50, size: 'medium', qty: 1 },
        { productId: 20, name: 'Cinnamon Roll',     price: 4.00, size: 'medium', qty: 1 },
        { productId: 24, name: 'Jam Doughnut',      price: 2.75, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Fatima Al Ali', email: 'fatima.alali@yahoo.com',    phone: '+971 50 567 8901', address: '88 Marina Walk, Unit 12', city: 'Dubai' },
      subtotal: 32.25, shipping: 0, total: 32.25, status: 'pending', date: '2026-06-20',
      note: 'Team order — please bag separately',
    },
    {
      id: 'ORD-1006',
      items: [
        { productId: 1,  name: 'Espresso',              price: 3.50, size: 'medium', qty: 1 },
        { productId: 12, name: 'Cortado',               price: 4.00, size: 'medium', qty: 1 },
        { productId: 18, name: "Millionaire's Shortbread", price: 3.50, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Sara Ahmed',    email: 'sara.ahmed@gmail.com',       phone: '+971 50 123 4567', address: '12 Sheikh Zayed Rd, Apt 4B', city: 'Dubai' },
      subtotal: 11.00, shipping: 0, total: 11.00, status: 'delivered', date: '2026-06-05',
    },
    {
      id: 'ORD-1007',
      items: [
        { productId: 6,  name: 'Caramel Macchiato', price: 5.50, size: 'medium', qty: 1 },
        { productId: 3,  name: 'Caffe Latte',       price: 4.75, size: 'medium', qty: 1 },
        { productId: 7,  name: 'Mocha',             price: 5.25, size: 'medium', qty: 1 },
        { productId: 19, name: 'Biscoff Cheesecake',price: 5.50, size: 'medium', qty: 1 },
        { productId: 14, name: 'Victoria Sponge',   price: 4.50, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Sara Ahmed',    email: 'sara.ahmed@gmail.com',       phone: '+971 50 123 4567', address: '12 Sheikh Zayed Rd, Apt 4B', city: 'Dubai' },
      subtotal: 25.50, shipping: 0, total: 25.50, status: 'delivered', date: '2026-06-15',
    },
    {
      id: 'ORD-1008',
      items: [
        { productId: 12, name: 'Cortado',      price: 4.00, size: 'medium', qty: 2 },
        { productId: 18, name: "Millionaire's Shortbread", price: 3.50, size: 'medium', qty: 1 },
        { productId: 28, name: 'Chelsea Bun',  price: 3.25, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Khalid Hassan', email: 'khalid.hassan@hotmail.com',  phone: '+971 50 234 5678', address: '7 Al Wasl Rd, Villa 3', city: 'Dubai' },
      subtotal: 14.75, shipping: 2.99, total: 17.74, status: 'delivered', date: '2026-06-08',
    },
    {
      id: 'ORD-1009',
      items: [
        { productId: 8,  name: 'Flat White', price: 4.50, size: 'medium', qty: 1 },
        { productId: 12, name: 'Cortado',    price: 4.00, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Layla Nour',    email: 'layla.nour@icloud.com',      phone: '+971 50 345 6789', address: '33 Jumeirah St, Floor 2', city: 'Dubai' },
      subtotal: 8.50, shipping: 2.99, total: 11.49, status: 'delivered', date: '2026-06-18',
    },
    {
      id: 'ORD-1010',
      items: [
        { productId: 3,  name: 'Caffe Latte',       price: 4.75, size: 'medium', qty: 2 },
        { productId: 19, name: 'Biscoff Cheesecake',price: 5.50, size: 'medium', qty: 1 },
        { productId: 14, name: 'Victoria Sponge',   price: 4.50, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Omar Faris',    email: 'omar.faris@outlook.com',     phone: '+971 50 456 7890', address: '5 Downtown Blvd, Tower A', city: 'Dubai' },
      subtotal: 19.50, shipping: 0, total: 19.50, status: 'delivered', date: '2026-06-15',
    },
    {
      id: 'ORD-1011',
      items: [
        { productId: 4,  name: 'Americano',         price: 3.75, size: 'medium', qty: 2 },
        { productId: 17, name: 'Chocolate Brownie', price: 3.75, size: 'medium', qty: 2 },
      ],
      customer: { name: 'Fatima Al Ali', email: 'fatima.alali@yahoo.com',    phone: '+971 50 567 8901', address: '88 Marina Walk, Unit 12', city: 'Dubai' },
      subtotal: 15.00, shipping: 0, total: 15.00, promoCode: 'FREESHIP', status: 'delivered', date: '2026-06-12',
    },
    {
      id: 'ORD-1012',
      items: [
        { productId: 9,  name: 'Iced Latte',             price: 5.00, size: 'medium', qty: 1 },
        { productId: 12, name: 'Cortado',                price: 4.00, size: 'medium', qty: 1 },
        { productId: 18, name: "Millionaire's Shortbread",price: 3.50, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Reem Sultan',   email: 'reem.sultan@gmail.com',     phone: '+971 50 678 9012', address: '44 Jumeirah Beach Rd', city: 'Dubai' },
      subtotal: 12.50, shipping: 2.99, total: 15.49, status: 'delivered', date: '2026-06-20',
    },
    {
      id: 'ORD-1013',
      items: [
        { productId: 3,  name: 'Caffe Latte',   price: 4.75, size: 'medium', qty: 2 },
        { productId: 2,  name: 'Cappuccino',    price: 4.50, size: 'medium', qty: 1 },
        { productId: 21, name: 'Sticky Toffee Pudding', price: 5.00, size: 'medium', qty: 1 },
        { productId: 28, name: 'Chelsea Bun',   price: 3.25, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Ahmed Rashid',  email: 'ahmed.rashid@icloud.com',   phone: '+971 50 789 0123', address: '9 Business Bay Tower', city: 'Dubai' },
      subtotal: 22.25, shipping: 0, total: 22.25, status: 'delivered', date: '2026-06-21',
    },
    {
      id: 'ORD-1014',
      items: [
        { productId: 1,  name: 'Espresso', price: 3.50, size: 'medium', qty: 1 },
        { productId: 12, name: 'Cortado',  price: 4.00, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Sara Ahmed',    email: 'sara.ahmed@gmail.com',       phone: '+971 50 123 4567', address: '12 Sheikh Zayed Rd, Apt 4B', city: 'Dubai' },
      subtotal: 7.50, shipping: 2.99, total: 10.49, status: 'delivered', date: '2026-06-21',
    },
    {
      id: 'ORD-1015',
      items: [
        { productId: 4,  name: 'Americano', price: 3.75, size: 'medium', qty: 1 },
        { productId: 7,  name: 'Mocha',     price: 5.25, size: 'medium', qty: 1 },
      ],
      customer: { name: 'Khalid Hassan', email: 'khalid.hassan@hotmail.com',  phone: '+971 50 234 5678', address: '7 Al Wasl Rd, Villa 3', city: 'Dubai' },
      subtotal: 9.00, shipping: 2.99, total: 11.99, status: 'delivered', date: '2026-06-22',
    },
  ])

  const pendingCount = ref(orders.value.filter(o => o.status === 'pending').length)
  const newOrderIds  = ref<string[]>([])

  function placeOrder(payload: {
    items:     Array<{ product: { id: number; name: string; price: number }; qty: number; size: CupSize }>
    customer:  Order['customer']
    subtotal:  number
    shipping:  number
    discount?: number
    promoCode?: string
    total:     number
  }) {
    const id = `ORD-${1016 + rand(0, 999)}`
    const orderItems: OrderItem[] = payload.items.map(i => ({
      productId: i.product.id,
      name:      i.product.name,
      price:     i.product.price,
      size:      i.size,
      qty:       i.qty,
    }))
    orders.value.unshift({
      ...payload,
      items:  orderItems,
      id,
      status: 'pending',
      date:   new Date().toISOString().split('T')[0],
    })
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

  function markAllRead() { newOrderIds.value = [] }

  function findById(id: string): Order | undefined {
    return orders.value.find(o => o.id === id.trim().toUpperCase())
  }

  return { orders, pendingCount, newOrderIds, placeOrder, updateStatus, markAllRead, findById }
})