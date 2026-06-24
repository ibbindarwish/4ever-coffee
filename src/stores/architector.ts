import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ItemType =
  | 'table-round' | 'table-square' | 'table-rect'
  | 'counter' | 'sofa' | 'bar-stool'
  | 'plant' | 'entrance' | 'window'
  | 'menu-board' | 'wall-art' | 'coffee-station'

export type ItemStatus = 'available' | 'occupied' | 'reserved'

export interface FloorItem {
  id: string
  type: ItemType
  x: number
  y: number
  w: number
  h: number
  label: string
  capacity: number
  status: ItemStatus
  rotation: 0 | 90 | 180 | 270
}

export interface FloorPlan {
  name: string
  cols: number
  rows: number
  items: FloorItem[]
}

export const ITEM_DEFAULTS: Record<ItemType, { w: number; h: number; label: string; capacity: number }> = {
  'table-round':    { w: 2, h: 2, label: 'Table',       capacity: 4 },
  'table-square':   { w: 2, h: 2, label: 'Table',       capacity: 4 },
  'table-rect':     { w: 3, h: 2, label: 'Table',       capacity: 6 },
  'counter':        { w: 5, h: 1, label: 'Counter',     capacity: 0 },
  'sofa':           { w: 4, h: 1, label: 'Sofa',        capacity: 4 },
  'bar-stool':      { w: 1, h: 1, label: 'Stool',       capacity: 1 },
  'plant':          { w: 1, h: 1, label: 'Plant',       capacity: 0 },
  'entrance':       { w: 2, h: 2, label: 'Door',        capacity: 0 },
  'window':         { w: 3, h: 1, label: 'Window',      capacity: 0 },
  'menu-board':     { w: 4, h: 1, label: 'Menu Board',  capacity: 0 },
  'wall-art':       { w: 2, h: 2, label: 'Wall Art',    capacity: 0 },
  'coffee-station': { w: 3, h: 2, label: 'Bar',         capacity: 0 },
}

const LS_KEY  = 'fc_architector'
const MAX_HIS = 50
const BLANK: FloorPlan = { name: '4ever Coffee', cols: 20, rows: 14, items: [] }

function load(): FloorPlan {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return { ...BLANK, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...BLANK }
}

function mk(
  type: ItemType, x: number, y: number, w: number, h: number,
  label: string, cap: number, status: ItemStatus = 'available',
): FloorItem {
  return { id: crypto.randomUUID(), type, x, y, w, h, label, capacity: cap, status, rotation: 0 }
}

export const useArchitectorStore = defineStore('architector', () => {
  const plan   = ref<FloorPlan>(load())
  const past   = ref<string[]>([])
  const future = ref<string[]>([])

  watch(plan, () => localStorage.setItem(LS_KEY, JSON.stringify(plan.value)), { deep: true })

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  function snap() {
    past.value.push(JSON.stringify(plan.value))
    if (past.value.length > MAX_HIS) past.value.shift()
    future.value = []
  }

  function undo() {
    if (!canUndo.value) return
    future.value.push(JSON.stringify(plan.value))
    plan.value = JSON.parse(past.value.pop()!)
  }

  function redo() {
    if (!canRedo.value) return
    past.value.push(JSON.stringify(plan.value))
    plan.value = JSON.parse(future.value.pop()!)
  }

  function addItem(partial: Omit<FloorItem, 'id'>) {
    snap()
    plan.value.items.push({ ...partial, id: crypto.randomUUID() })
  }

  function moveItem(id: string, x: number, y: number) {
    snap()
    const item = plan.value.items.find(i => i.id === id)
    if (item) { item.x = x; item.y = y }
  }

  function updateItem(id: string, patch: Partial<Omit<FloorItem, 'id' | 'type'>>) {
    snap()
    const item = plan.value.items.find(i => i.id === id)
    if (item) Object.assign(item, patch)
  }

  function deleteItem(id: string) {
    snap()
    plan.value.items = plan.value.items.filter(i => i.id !== id)
  }

  function clearLayout() {
    snap()
    plan.value.items = []
  }

  function loadSample() {
    snap()
    plan.value.items = [
      mk('entrance',     0,  5, 2, 2, 'Door',    0),
      mk('counter',      2,  0, 7, 1, 'Counter', 0),
      mk('bar-stool',    2,  1, 1, 1, 'S1', 1, 'available'),
      mk('bar-stool',    3,  1, 1, 1, 'S2', 1, 'available'),
      mk('bar-stool',    4,  1, 1, 1, 'S3', 1, 'occupied'),
      mk('bar-stool',    5,  1, 1, 1, 'S4', 1, 'occupied'),
      mk('bar-stool',    6,  1, 1, 1, 'S5', 1, 'available'),
      mk('bar-stool',    7,  1, 1, 1, 'S6', 1, 'reserved'),
      mk('table-round',  2,  4, 2, 2, 'T1', 4, 'available'),
      mk('table-round',  5,  4, 2, 2, 'T2', 4, 'occupied'),
      mk('table-round',  8,  4, 2, 2, 'T3', 4, 'reserved'),
      mk('table-round',  11, 4, 2, 2, 'T4', 4, 'available'),
      mk('table-rect',   2,  8, 3, 2, 'T5', 6, 'occupied'),
      mk('table-rect',   6,  8, 3, 2, 'T6', 6, 'available'),
      mk('table-rect',   10, 8, 3, 2, 'T7', 6, 'reserved'),
      mk('table-square', 14, 4, 2, 2, 'T8', 4, 'available'),
      mk('table-square', 14, 7, 2, 2, 'T9', 4, 'available'),
      mk('sofa',         14, 11, 4, 1, 'Lounge', 4),
      mk('plant',        0,  0, 1, 1, 'Plant', 0),
      mk('plant',        1,  0, 1, 1, 'Plant', 0),
      mk('plant',        18, 0, 1, 1, 'Plant', 0),
      mk('plant',        19, 0, 1, 1, 'Plant', 0),
      mk('plant',        0,  13, 1, 1, 'Plant', 0),
      mk('window',       10, 0, 3, 1, 'Window', 0),
      mk('window',       14, 0, 3, 1, 'Window', 0),
    ]
  }

  function loadJumeirahLayout() {
    snap()
    plan.value.items = [
      // Top wall: panoramic windows + menu board
      mk('window',         0,  0, 3, 1, 'Window',      0),
      mk('window',         4,  0, 3, 1, 'Window',      0),
      mk('menu-board',     8,  0, 4, 1, 'Our Menu',    0),
      mk('window',        13,  0, 3, 1, 'Window',      0),
      mk('window',        17,  0, 3, 1, 'Window',      0),

      // Coffee bar — top-left corner
      mk('counter',        0,  1, 8, 1, 'Coffee Bar',  0),
      mk('coffee-station', 0,  2, 3, 2, 'Brew Station', 0),
      mk('bar-stool',      3,  2, 1, 1, 'S1', 1, 'occupied'),
      mk('bar-stool',      4,  2, 1, 1, 'S2', 1, 'occupied'),
      mk('bar-stool',      5,  2, 1, 1, 'S3', 1, 'available'),
      mk('bar-stool',      6,  2, 1, 1, 'S4', 1, 'reserved'),
      mk('bar-stool',      7,  2, 1, 1, 'S5', 1, 'available'),

      // East wall — art gallery
      mk('wall-art',      18,  1, 2, 2, 'Art I',   0),
      mk('wall-art',      18,  4, 2, 2, 'Art II',  0),
      mk('wall-art',      18,  7, 2, 2, 'Art III', 0),
      mk('wall-art',      18, 10, 2, 2, 'Art IV',  0),

      // Row A: intimate window-view tables (2-person)
      mk('table-round',    2,  4, 2, 2, 'T1',  2, 'occupied'),
      mk('table-round',    5,  4, 2, 2, 'T2',  2, 'available'),
      mk('table-round',    8,  4, 2, 2, 'T3',  2, 'reserved'),
      mk('table-round',   11,  4, 2, 2, 'T4',  2, 'available'),
      mk('table-round',   14,  4, 2, 2, 'T5',  2, 'occupied'),

      // Row B: main dining floor
      mk('table-square',   1,  7, 2, 2, 'T6',  4, 'available'),
      mk('table-square',   4,  7, 2, 2, 'T7',  4, 'occupied'),
      mk('table-rect',     7,  7, 4, 2, 'T8',  8, 'available'),
      mk('table-square',  12,  7, 2, 2, 'T9',  4, 'reserved'),
      mk('table-square',  15,  7, 2, 2, 'T10', 4, 'available'),

      // Lounge corner — facing sofas with centre coffee table
      mk('sofa',          13,  9, 5, 1, 'Lounge A', 5),
      mk('table-round',   15, 10, 2, 2, 'T11', 2, 'available'),
      mk('sofa',          13, 12, 5, 1, 'Lounge B', 5),

      // Main entrance
      mk('entrance',       9, 12, 2, 2, 'Entrance', 0),

      // Plants — west wall + corners
      mk('plant',          0,  5, 1, 1, 'Plant', 0),
      mk('plant',          0,  9, 1, 1, 'Plant', 0),
      mk('plant',          0, 13, 1, 1, 'Plant', 0),
      mk('plant',          7, 13, 1, 1, 'Plant', 0),
      mk('plant',         12, 13, 1, 1, 'Plant', 0),
      mk('plant',         19, 13, 1, 1, 'Plant', 0),
    ]
  }

  return {
    plan, canUndo, canRedo,
    undo, redo, addItem, moveItem, updateItem, deleteItem, clearLayout,
    loadSample, loadJumeirahLayout,
  }
})