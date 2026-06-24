<script setup lang="ts">
import { computed } from 'vue'
import type { FloorItem, ItemStatus } from '../../stores/architector'
import { useArchitectorStore } from '../../stores/architector'

const props = defineProps<{ selectedId: string | null }>()
const emit  = defineEmits<{ deselect: [] }>()

const store = useArchitectorStore()

const item = computed(() =>
  props.selectedId ? store.plan.items.find(i => i.id === props.selectedId) ?? null : null
)

const hasStatus = computed(() =>
  item.value !== null &&
  ['table-round', 'table-square', 'table-rect', 'bar-stool'].includes(item.value.type)
)

const TYPE_LABEL: Record<string, string> = {
  'table-round':  'Round Table',
  'table-square': 'Square Table',
  'table-rect':   'Long Table',
  'counter':      'Counter',
  'sofa':         'Sofa',
  'bar-stool':    'Bar Stool',
  'plant':        'Plant',
  'entrance':     'Door / Entrance',
  'window':       'Window',
}

function patch(updates: Partial<Omit<FloorItem, 'id' | 'type'>>) {
  if (item.value) store.updateItem(item.value.id, updates)
}

function remove() {
  if (item.value) { store.deleteItem(item.value.id); emit('deselect') }
}
</script>

<template>
  <aside class="props">

    <!-- ── ITEM SELECTED ── -->
    <template v-if="item">
      <div class="props-head">
        <div>
          <p class="props-type">{{ TYPE_LABEL[item.type] }}</p>
          <p class="props-id">{{ item.id.slice(0, 8) }}…</p>
        </div>
        <button class="close-btn" title="Deselect" @click="emit('deselect')">✕</button>
      </div>

      <!-- Label -->
      <div class="field">
        <label>Label</label>
        <input
          class="f-input"
          maxlength="16"
          :value="item.label"
          @input="patch({ label: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <!-- Capacity -->
      <div class="field" v-if="hasStatus">
        <label>Seats</label>
        <input
          class="f-input"
          type="number" min="1" max="20"
          :value="item.capacity"
          @input="patch({ capacity: Math.max(1, parseInt(($event.target as HTMLInputElement).value) || 1) })"
        />
      </div>

      <!-- Status -->
      <div class="field" v-if="hasStatus">
        <label>Status</label>
        <div class="status-row">
          <button
            v-for="s in (['available','occupied','reserved'] as ItemStatus[])"
            :key="s"
            class="s-btn"
            :class="[s, { active: item.status === s }]"
            @click="patch({ status: s })"
          >{{ s }}</button>
        </div>
      </div>

      <!-- Position info -->
      <div class="field">
        <label>Position</label>
        <span class="f-text">
          Col {{ item.x + 1 }}, Row {{ item.y + 1 }}&nbsp;·&nbsp;{{ item.w }} × {{ item.h }} cells
        </span>
      </div>

      <!-- Rotation -->
      <div class="field">
        <label>Rotation</label>
        <div class="rot-row">
          <button
            v-for="r in [0, 90, 180, 270]"
            :key="r"
            class="rot-btn"
            :class="{ active: item.rotation === r }"
            @click="patch({ rotation: r as 0|90|180|270 })"
          >{{ r }}°</button>
        </div>
      </div>

      <!-- Delete -->
      <button class="del-btn" @click="remove">🗑 Remove from floor</button>
    </template>

    <!-- ── NOTHING SELECTED ── -->
    <template v-else>
      <div class="empty">
        <div class="empty-icon">☝️</div>
        <p>Click any item on the floor to edit its properties.</p>
        <p>Or pick an element from the palette and click the floor to place it.</p>
      </div>
    </template>

  </aside>
</template>

<style scoped>
.props { /* container provided by parent */ }

.props-head  { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.props-type  { font-size: 14px; font-weight: 800; color: #1c1917; margin: 0 0 2px; }
.props-id    { font-size: 10px; color: #a8a29e; font-family: monospace; margin: 0; }
.close-btn   { background: none; border: 1px solid #e7e5e4; border-radius: 6px; width: 26px; height: 26px;
               cursor: pointer; color: #78716c; font-size: 11px; transition: all 0.14s; }
.close-btn:hover { border-color: #ef4444; color: #ef4444; }

.field       { margin-bottom: 14px; }
.field label { display: block; font-size: 10px; font-weight: 700; color: #78716c;
               text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }

.f-input {
  width: 100%; padding: 7px 10px; border: 1.5px solid #e7e5e4;
  border-radius: 8px; font-size: 13px; outline: none; background: #fff;
  box-sizing: border-box; color: #1c1917;
}
.f-input:focus { border-color: #d4a060; }

.f-text { font-size: 12px; color: #57534e; }

.status-row { display: flex; gap: 4px; }
.s-btn {
  flex: 1; padding: 6px 2px; border-radius: 7px; border: 1.5px solid #e7e5e4;
  background: #fff; font-size: 10px; font-weight: 600; cursor: pointer;
  text-transform: capitalize; transition: all 0.14s; color: #57534e;
}
.s-btn:hover { border-color: #d4a060; }
.s-btn.available.active { background: #dcfce7; border-color: #22c55e; color: #15803d; }
.s-btn.occupied.active  { background: #fee2e2; border-color: #ef4444; color: #dc2626; }
.s-btn.reserved.active  { background: #fef3c7; border-color: #f59e0b; color: #b45309; }

.rot-row    { display: flex; gap: 4px; }
.rot-btn    { flex: 1; padding: 6px 2px; border-radius: 7px; border: 1.5px solid #e7e5e4;
              background: #fff; font-size: 11px; font-weight: 600; cursor: pointer;
              transition: all 0.14s; color: #57534e; }
.rot-btn:hover  { border-color: #d4a060; }
.rot-btn.active { background: #fef3c7; border-color: #d97706; color: #92400e; }

.del-btn {
  width: 100%; margin-top: 6px; padding: 10px;
  background: #fff5f5; color: #dc2626; border: 1.5px solid #fecaca;
  border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s;
}
.del-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

.empty      { text-align: center; padding: 28px 8px; }
.empty-icon { font-size: 34px; margin-bottom: 12px; }
.empty p    { font-size: 12px; color: #a8a29e; line-height: 1.6; margin: 0 0 8px; }
</style>