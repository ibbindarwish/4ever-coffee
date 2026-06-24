<script setup lang="ts">
import type { ItemType } from '../../stores/architector'

const props = defineProps<{ activeTool: ItemType | null }>()
const emit  = defineEmits<{ 'update:activeTool': [v: ItemType | null] }>()

interface Entry { type: ItemType; label: string; icon: string; sub: string }

const GROUPS: { title: string; items: Entry[] }[] = [
  {
    title: 'Tables',
    items: [
      { type: 'table-round',  label: 'Round Table',  icon: '◯', sub: '4 seats default' },
      { type: 'table-square', label: 'Square Table', icon: '▢', sub: '4 seats default' },
      { type: 'table-rect',   label: 'Long Table',   icon: '▬', sub: '6 seats default' },
    ],
  },
  {
    title: 'Furniture',
    items: [
      { type: 'counter',   label: 'Counter',   icon: '═', sub: 'Service bar' },
      { type: 'sofa',      label: 'Sofa',      icon: '⌢', sub: 'Lounge seating' },
      { type: 'bar-stool', label: 'Bar Stool', icon: '·', sub: '1 seat' },
    ],
  },
  {
    title: 'Structure',
    items: [
      { type: 'plant',    label: 'Plant',    icon: '🌿', sub: 'Décor' },
      { type: 'entrance', label: 'Door',     icon: '🚪', sub: 'Entrance / exit' },
      { type: 'window',   label: 'Window',   icon: '▭', sub: 'Wall opening' },
    ],
  },
  {
    title: 'Café Features',
    items: [
      { type: 'coffee-station', label: 'Coffee Station', icon: '☕', sub: 'Espresso bar' },
      { type: 'menu-board',     label: 'Menu Board',     icon: '📋', sub: 'Chalkboard menu' },
      { type: 'wall-art',       label: 'Wall Art',       icon: '🖼', sub: 'Framed artwork' },
    ],
  },
]

function toggle(type: ItemType) {
  emit('update:activeTool', props.activeTool === type ? null : type)
}
</script>

<template>
  <aside class="palette">
    <p class="palette-title">Elements</p>
    <p class="palette-hint">Select a type, then click the floor to place it.</p>

    <div v-for="group in GROUPS" :key="group.title" class="group">
      <p class="group-label">{{ group.title }}</p>
      <button
        v-for="item in group.items"
        :key="item.type"
        class="pal-btn"
        :class="{ active: activeTool === item.type }"
        @click="toggle(item.type)"
      >
        <span class="pal-icon">{{ item.icon }}</span>
        <span class="pal-info">
          <span class="pal-label">{{ item.label }}</span>
          <span class="pal-sub">{{ item.sub }}</span>
        </span>
      </button>
    </div>

    <div class="legend">
      <p class="group-label">Status key</p>
      <div class="legend-row"><span class="dot avail"></span> Available</div>
      <div class="legend-row"><span class="dot occ"></span>   Occupied</div>
      <div class="legend-row"><span class="dot res"></span>   Reserved</div>
    </div>
  </aside>
</template>

<style scoped>
.palette { display: flex; flex-direction: column; gap: 0; }
.palette-title { font-size: 13px; font-weight: 800; color: #1c1917; margin: 0 0 4px; }
.palette-hint  { font-size: 11px; color: #a8a29e; margin: 0 0 14px; line-height: 1.5; }

.group        { margin-bottom: 14px; }
.group-label  { font-size: 10px; font-weight: 700; color: #a8a29e; text-transform: uppercase;
                letter-spacing: 0.08em; margin: 0 0 5px; }

.pal-btn {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 8px 10px; border-radius: 8px;
  border: 1.5px solid #e7e5e4; background: #fff;
  cursor: pointer; text-align: left; margin-bottom: 4px;
  transition: all 0.14s;
}
.pal-btn:hover  { border-color: #d4a060; background: #fffbf5; }
.pal-btn.active { border-color: #c8813a; background: rgba(212,160,96,0.14); }

.pal-icon  { font-size: 17px; width: 22px; text-align: center; flex-shrink: 0; }
.pal-info  { display: flex; flex-direction: column; }
.pal-label { font-size: 12px; font-weight: 600; color: #1c1917; }
.pal-sub   { font-size: 10px; color: #a8a29e; }

.legend     { margin-top: 6px; border-top: 1px solid #f0ebe4; padding-top: 12px; }
.legend-row { display: flex; align-items: center; gap: 7px; font-size: 12px;
              color: #57534e; margin-bottom: 5px; }
.dot        { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot.avail  { background: #22c55e; }
.dot.occ    { background: #ef4444; }
.dot.res    { background: #f59e0b; }
</style>