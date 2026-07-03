<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '../../stores/products'
import type { MenuItem } from '../../stores/products'

const store = useProductsStore()
const search = ref('')
const filterCat = ref<string>('All')
const showModal = ref(false)
const editingId = ref<number | null>(null)

const cats = ['All', 'Hot Coffee', 'Cold Coffee', 'Specialty']

const filtered = computed(() =>
  store.products.filter(p => {
    const s = search.value.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
    const matchCat = filterCat.value === 'All' || p.category === filterCat.value
    return matchSearch && matchCat
  })
)

const form = ref<Partial<MenuItem>>({})

function openAdd() {
  form.value = {
    name: '', description: '', price: 4.50, category: 'Hot Coffee', scentType: '',
    stock: 50, lowStockThreshold: 10, gradient: 'linear-gradient(145deg,#d4a060,#c8813a)', accent: '#d4a060',
    rating: 4.5, reviews: 0
  }
  editingId.value = null
  showModal.value = true
}

function openEdit(p: MenuItem) {
  form.value = { ...p }
  editingId.value = p.id
  showModal.value = true
}

function save() {
  if (editingId.value !== null) {
    store.updateProduct(editingId.value, form.value as Partial<MenuItem>)
  } else {
    store.addProduct(form.value as Omit<MenuItem, 'id'>)
  }
  showModal.value = false
}

function stockColor(p: MenuItem) {
  if (p.stock === 0) return '#ef4444'
  if (p.stock <= p.lowStockThreshold) return '#f59e0b'
  return '#10b981'
}
</script>

<template>
  <div class="page">
    <!-- Alert bar -->
    <div v-if="store.lowStockProducts.length" class="alert-bar">
      ⚠ {{ store.lowStockProducts.length }} item(s) running low on stock —
      <span v-for="p in store.lowStockProducts" :key="p.id" class="alert-item">{{ p.name }} ({{ p.stock }})</span>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="search" class="search-input" placeholder="Search menu..."/>
        <div class="cat-filters">
          <button v-for="c in cats" :key="c" class="cat-btn" :class="{ active: filterCat === c }" @click="filterCat = c">
            {{ c }}
          </button>
        </div>
      </div>
      <button class="btn-primary" @click="openAdd">+ Add Item</button>
    </div>

    <div class="grid">
      <div v-for="p in filtered" :key="p.id" class="item-card" :class="{ 'low-stock': p.stock > 0 && p.stock <= p.lowStockThreshold, 'out-stock': p.stock === 0 }">
        <div class="item-img">
          <div class="item-img-bg" :style="{ background: p.gradient }"></div>
          <img :src="p.image" :alt="p.name" class="item-photo"
               @error="() => {}"/>
          <div class="item-cat-badge">{{ p.category }}</div>
        </div>
        <div class="item-body">
          <div class="item-name">{{ p.name }}</div>
          <div class="item-type">{{ p.scentType }}</div>
          <div class="item-price">£{{ p.price.toFixed(2) }}</div>
          <div class="stock-row">
            <div class="stock-bar-bg">
              <div class="stock-bar" :style="{ width: Math.min(100, p.stock / (p.lowStockThreshold * 2) * 100) + '%', background: stockColor(p) }"></div>
            </div>
            <span class="stock-num" :style="{ color: stockColor(p) }">{{ p.stock }}</span>
          </div>
          <div class="item-actions">
            <button class="act-btn" @click="store.updateStock(p.id, 10)">+10 Stock</button>
            <button class="act-btn edit" @click="openEdit(p)">Edit</button>
            <button class="act-btn del" @click="store.deleteProduct(p.id)">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-head">
            <h3>{{ editingId !== null ? 'Edit Item' : 'Add New Item' }}</h3>
            <button class="close-btn" @click="showModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Name</label>
                <input v-model="form.name" class="input" placeholder="e.g. Espresso"/>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select v-model="form.category" class="input">
                  <option v-for="c in cats.slice(1)" :key="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <div class="form-group full">
              <label>Description</label>
              <textarea v-model="form.description" class="input textarea" rows="2" placeholder="Describe the drink..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Price ($)</label>
                <input v-model.number="form.price" type="number" step="0.25" class="input"/>
              </div>
              <div class="form-group">
                <label>Flavour Profile</label>
                <input v-model="form.scentType" class="input" placeholder="e.g. Bold & Rich"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Stock</label>
                <input v-model.number="form.stock" type="number" class="input"/>
              </div>
              <div class="form-group">
                <label>Low Stock Alert</label>
                <input v-model.number="form.lowStockThreshold" type="number" class="input"/>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="showModal = false">Cancel</button>
            <button class="btn-save" @click="save">{{ editingId !== null ? 'Save Changes' : 'Add Item' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 18px; }
.alert-bar { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #92400e; font-weight: 500; }
.alert-item { font-weight: 700; margin-left: 6px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.search-input { padding: 9px 14px; border: 1px solid #e7e5e4; border-radius: 8px; font-size: 14px; width: 220px; outline: none; background: #fff; }
.search-input:focus { border-color: #d4a060; }
.cat-filters { display: flex; gap: 6px; }
.cat-btn { padding: 7px 14px; border-radius: 8px; border: 1px solid #e7e5e4; background: #fff; font-size: 13px; cursor: pointer; color: #78716c; }
.cat-btn.active { background: #d4a060; color: #fff; border-color: #d4a060; font-weight: 600; }
.btn-primary { background: #d4a060; color: #fff; border: none; border-radius: 8px; padding: 9px 20px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #c8813a; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.item-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #f0ebe4; transition: all 0.2s; }
.item-card:hover { box-shadow: 0 8px 24px rgba(44,16,8,0.1); transform: translateY(-2px); }
.item-card.low-stock { border-color: #fcd34d; }
.item-card.out-stock  { border-color: #fca5a5; opacity: 0.7; }

.item-img { height: 140px; position: relative; overflow: hidden; }
.item-img-bg { position: absolute; inset: 0; }
.item-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transition: transform 0.35s ease; }
.item-card:hover .item-photo { transform: scale(1.08); }
.item-cat-badge { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.35); color: #fff; font-size: 10px; font-weight: 700; border-radius: 6px; padding: 3px 8px; backdrop-filter: blur(4px); }

.item-body { padding: 12px 14px 14px; }
.item-name  { font-size: 14px; font-weight: 700; color: #1c1917; margin-bottom: 2px; }
.item-type  { font-size: 11px; color: #a8a29e; margin-bottom: 4px; }
.item-price { font-size: 16px; font-weight: 800; color: #d4a060; margin-bottom: 10px; }
.stock-row  { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.stock-bar-bg { flex: 1; height: 5px; background: #f5f0ea; border-radius: 4px; overflow: hidden; }
.stock-bar  { height: 100%; border-radius: 4px; }
.stock-num  { font-size: 11px; font-weight: 700; width: 24px; text-align: right; }
.item-actions { display: flex; gap: 6px; }
.act-btn { flex: 1; padding: 6px; border: 1px solid #e7e5e4; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; background: #fff; color: #57534e; }
.act-btn:hover { background: #faf7f2; }
.act-btn.edit { border-color: #d4a060; color: #d4a060; }
.act-btn.edit:hover { background: #fdf3e7; }
.act-btn.del  { border-color: #fca5a5; color: #ef4444; flex: 0; padding: 6px 10px; }
.act-btn.del:hover  { background: #fee2e2; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 16px; width: 500px; max-width: 95vw; overflow: hidden; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f0ebe4; }
.modal-head h3 { font-size: 16px; font-weight: 700; }
.close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #a8a29e; line-height: 1; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1/-1; }
label { font-size: 11px; font-weight: 600; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.input { padding: 9px 12px; border: 1px solid #e7e5e4; border-radius: 8px; font-size: 13px; outline: none; }
.input:focus { border-color: #d4a060; }
.textarea { resize: vertical; }
.modal-foot { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid #f0ebe4; }
.btn-cancel { padding: 9px 20px; border: 1px solid #e7e5e4; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; color: #57534e; }
.btn-save { padding: 9px 20px; border: none; border-radius: 8px; background: #d4a060; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; }
.btn-save:hover { background: #c8813a; }
</style>
