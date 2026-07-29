import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: 'Hot Coffee' | 'Cold Coffee' | 'Specialty' | 'Food' | 'Sweets & Cakes'
  scentType: string        // reused as "flavour profile"
  stock: number
  lowStockThreshold: number
  gradient: string
  accent: string
  image: string
  rating: number
  reviews: number
  featured?: boolean
  isNew?: boolean
  seasonal?: boolean   // one of this quarter's "4 Collection" picks (loyalty tie-in)
}

interface ProductRow {
  id: number
  name: string
  description: string
  price: number
  original_price: number | null
  category: string
  scent_type: string | null
  stock: number
  low_stock_threshold: number
  gradient: string | null
  accent: string | null
  image: string | null
  rating: number | null
  reviews: number | null
  featured: boolean | null
  is_new: boolean | null
  seasonal: boolean | null
}

function fromRow(r: ProductRow): MenuItem {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    price: Number(r.price),
    originalPrice: r.original_price !== null ? Number(r.original_price) : undefined,
    category: r.category as MenuItem['category'],
    scentType: r.scent_type ?? '',
    stock: r.stock,
    lowStockThreshold: r.low_stock_threshold,
    gradient: r.gradient ?? '',
    accent: r.accent ?? '',
    image: r.image ?? '',
    rating: r.rating !== null ? Number(r.rating) : 0,
    reviews: r.reviews ?? 0,
    featured: r.featured ?? false,
    isNew: r.is_new ?? false,
    seasonal: r.seasonal ?? false,
  }
}

function toRow(p: Partial<MenuItem>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (p.name !== undefined) row.name = p.name
  if (p.description !== undefined) row.description = p.description
  if (p.price !== undefined) row.price = p.price
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice
  if (p.category !== undefined) row.category = p.category
  if (p.scentType !== undefined) row.scent_type = p.scentType
  if (p.stock !== undefined) row.stock = p.stock
  if (p.lowStockThreshold !== undefined) row.low_stock_threshold = p.lowStockThreshold
  if (p.gradient !== undefined) row.gradient = p.gradient
  if (p.accent !== undefined) row.accent = p.accent
  if (p.image !== undefined) row.image = p.image
  if (p.rating !== undefined) row.rating = p.rating
  if (p.reviews !== undefined) row.reviews = p.reviews
  if (p.featured !== undefined) row.featured = p.featured
  if (p.isNew !== undefined) row.is_new = p.isNew
  if (p.seasonal !== undefined) row.seasonal = p.seasonal
  return row
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<MenuItem[]>([])
  const loaded  = ref(false)

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id')
    if (error) { console.error('[products] fetch failed:', error.message); return }
    products.value = (data as ProductRow[]).map(fromRow)
    loaded.value = true
  }

  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
  )
  const outOfStockProducts = computed(() =>
    products.value.filter(p => p.stock === 0)
  )

  async function updateStock(id: number, delta: number) {
    const p = products.value.find(p => p.id === id)
    if (!p) return
    const newStock = Math.max(0, p.stock + delta)
    const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', id)
    if (error) { console.error('[products] updateStock failed:', error.message); return }
    p.stock = newStock
  }

  async function addProduct(product: Omit<MenuItem, 'id'>) {
    const { data, error } = await supabase.from('products').insert(toRow(product)).select().single()
    if (error) { console.error('[products] addProduct failed:', error.message); return }
    products.value.push(fromRow(data as ProductRow))
  }

  async function updateProduct(id: number, updates: Partial<Omit<MenuItem, 'id'>>) {
    const { data, error } = await supabase.from('products').update(toRow(updates)).eq('id', id).select().single()
    if (error) { console.error('[products] updateProduct failed:', error.message); return }
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value[idx] = fromRow(data as ProductRow)
  }

  async function deleteProduct(id: number) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { console.error('[products] deleteProduct failed:', error.message); return }
    products.value = products.value.filter(p => p.id !== id)
  }

  if (!loaded.value) fetchProducts()

  return {
    products, loaded, lowStockProducts, outOfStockProducts,
    fetchProducts, updateStock, addProduct, updateProduct, deleteProduct,
  }
})
