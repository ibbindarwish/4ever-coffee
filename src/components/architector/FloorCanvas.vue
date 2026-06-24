<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useArchitectorStore, ITEM_DEFAULTS } from '../../stores/architector'
import type { FloorItem, ItemType } from '../../stores/architector'

const props = defineProps<{
  activeTool: ItemType | null
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string | null]
  placed: []
}>()

const store = useArchitectorStore()
const CELL  = 44

const svgEl = ref<SVGSVGElement | null>(null)

// Ghost position when placing from palette
const ghost = ref<{ x: number; y: number } | null>(null)

// Live position during item drag (visual-only, store updated on mouseup)
const livePos   = ref<{ id: string; x: number; y: number } | null>(null)
const dragState = ref<{
  id: string
  startGX: number
  startGY: number
  itemX: number
  itemY: number
} | null>(null)
let dragStartPx = { x: 0, y: 0 }
let hasMoved    = false

// ── Coordinate helpers ────────────────────────────────────────────────────────

function gridCoords(e: MouseEvent): { x: number; y: number } | null {
  if (!svgEl.value) return null
  const r = svgEl.value.getBoundingClientRect()
  return {
    x: Math.floor((e.clientX - r.left)  / CELL),
    y: Math.floor((e.clientY - r.top)   / CELL),
  }
}

function clamp(val: number, max: number) { return Math.max(0, Math.min(max, val)) }

// ── Visual helpers ────────────────────────────────────────────────────────────

function itemX(item: FloorItem) { return livePos.value?.id === item.id ? livePos.value.x : item.x }
function itemY(item: FloorItem) { return livePos.value?.id === item.id ? livePos.value.y : item.y }

function statusFill(s: string)   { return s === 'occupied' ? '#fee2e2' : s === 'reserved' ? '#fef3c7' : '#dcfce7' }
function statusStroke(s: string) { return s === 'occupied' ? '#ef4444' : s === 'reserved' ? '#f59e0b' : '#22c55e' }
function statusDot(s: string)    { return s === 'occupied' ? '#ef4444' : s === 'reserved' ? '#f59e0b' : '#22c55e' }

function seats(item: FloorItem) {
  const cx    = item.w * CELL / 2
  const cy    = item.h * CELL / 2
  const r     = Math.min(item.w, item.h) * CELL / 2 - 10
  const count = Math.min(Math.max(item.capacity, 0), 8)
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i / count) - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
}

const gridCols = computed(() => Array.from({ length: store.plan.cols + 1 }, (_, i) => i))
const gridRows = computed(() => Array.from({ length: store.plan.rows + 1 }, (_, i) => i))

// ── SVG canvas events (placement) ────────────────────────────────────────────

function onSvgMove(e: MouseEvent) {
  if (!props.activeTool) { ghost.value = null; return }
  const pos = gridCoords(e)
  if (!pos) return
  const def = ITEM_DEFAULTS[props.activeTool]
  ghost.value = {
    x: clamp(pos.x, store.plan.cols - def.w),
    y: clamp(pos.y, store.plan.rows - def.h),
  }
}

function onSvgLeave() { ghost.value = null }

function onSvgClick(e: MouseEvent) {
  // skip if the event came from an item (they use .stop)
  if (!(e.target as SVGElement).closest?.('.item-group') === false) return
  if (!props.activeTool) { emit('select', null); return }
  const pos = gridCoords(e)
  if (!pos) return
  const def = ITEM_DEFAULTS[props.activeTool]
  store.addItem({
    type:     props.activeTool,
    x:        clamp(pos.x, store.plan.cols - def.w),
    y:        clamp(pos.y, store.plan.rows - def.h),
    w:        def.w,
    h:        def.h,
    label:    autoLabel(props.activeTool),
    capacity: def.capacity,
    status:   'available',
    rotation: 0,
  })
  emit('placed')
}

function autoLabel(type: ItemType): string {
  const isTable = ['table-round', 'table-square', 'table-rect'].includes(type)
  if (isTable) {
    const n = store.plan.items.filter(i => ['table-round', 'table-square', 'table-rect'].includes(i.type)).length
    return `T${n + 1}`
  }
  if (type === 'bar-stool') {
    const n = store.plan.items.filter(i => i.type === 'bar-stool').length
    return `S${n + 1}`
  }
  return ITEM_DEFAULTS[type].label
}

// ── Item drag-to-move ─────────────────────────────────────────────────────────

function startDrag(e: MouseEvent, item: FloorItem) {
  if (props.activeTool) return  // placement mode — clicks go to onSvgClick
  e.preventDefault()
  hasMoved       = false
  dragStartPx    = { x: e.clientX, y: e.clientY }
  const pos      = gridCoords(e) ?? { x: 0, y: 0 }
  dragState.value = { id: item.id, startGX: pos.x, startGY: pos.y, itemX: item.x, itemY: item.y }
  livePos.value   = { id: item.id, x: item.x, y: item.y }
  window.addEventListener('mousemove', onWinMove)
  window.addEventListener('mouseup',   onWinUp, { once: true })
}

function onWinMove(e: MouseEvent) {
  if (!dragState.value) return
  if (Math.hypot(e.clientX - dragStartPx.x, e.clientY - dragStartPx.y) > 5) hasMoved = true
  const pos  = gridCoords(e)
  if (!pos) return
  const item = store.plan.items.find(i => i.id === dragState.value!.id)
  if (!item) return
  livePos.value = {
    id: dragState.value.id,
    x:  clamp(dragState.value.itemX + pos.x - dragState.value.startGX, store.plan.cols - item.w),
    y:  clamp(dragState.value.itemY + pos.y - dragState.value.startGY, store.plan.rows - item.h),
  }
}

function onWinUp() {
  if (!dragState.value) return
  if (hasMoved && livePos.value) {
    store.moveItem(dragState.value.id, livePos.value.x, livePos.value.y)
  } else {
    emit('select', dragState.value.id)
  }
  dragState.value = null
  livePos.value   = null
  window.removeEventListener('mousemove', onWinMove)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onWinMove)
  window.removeEventListener('mouseup',   onWinUp)
})
</script>

<template>
  <div class="canvas-outer" :style="{ cursor: activeTool ? 'crosshair' : 'default' }">
    <svg
      ref="svgEl"
      class="floor-svg"
      :width="store.plan.cols * CELL"
      :height="store.plan.rows * CELL"
      @mousemove="onSvgMove"
      @mouseleave="onSvgLeave"
      @click="onSvgClick"
    >
      <!-- ── Floor background ── -->
      <rect :width="store.plan.cols * CELL" :height="store.plan.rows * CELL" fill="#fdf8f0"/>

      <!-- ── Grid ── -->
      <line v-for="c in gridCols" :key="'c'+c"
        :x1="c*CELL" y1="0" :x2="c*CELL" :y2="store.plan.rows*CELL"
        stroke="#ede5d8" stroke-width="0.6"/>
      <line v-for="r in gridRows" :key="'r'+r"
        x1="0" :y1="r*CELL" :x2="store.plan.cols*CELL" :y2="r*CELL"
        stroke="#ede5d8" stroke-width="0.6"/>

      <!-- ── Floor items ── -->
      <g
        v-for="item in store.plan.items"
        :key="item.id"
        class="item-group"
        :transform="`translate(${itemX(item) * CELL}, ${itemY(item) * CELL})`"
        @mousedown.prevent.stop="startDrag($event, item)"
        @click.stop
        style="cursor: grab"
      >
        <!-- ╌╌ ROUND TABLE ╌╌ -->
        <template v-if="item.type === 'table-round'">
          <circle v-for="(s, i) in seats(item)" :key="i"
            :cx="s.x" :cy="s.y" r="5"
            :fill="statusStroke(item.status)" opacity="0.55"/>
          <circle
            :cx="item.w*CELL/2" :cy="item.h*CELL/2"
            :r="Math.min(item.w,item.h)*CELL/2 - 13"
            :fill="statusFill(item.status)" :stroke="statusStroke(item.status)" stroke-width="2.5"/>
          <circle :cx="item.w*CELL - 10" :cy="10" r="5" :fill="statusDot(item.status)"/>
        </template>

        <!-- ╌╌ SQUARE TABLE ╌╌ -->
        <template v-else-if="item.type === 'table-square'">
          <!-- chair slots -->
          <rect :x="item.w*CELL/2 - 10" y="3"    width="20" height="7" rx="2" :fill="statusStroke(item.status)" opacity="0.5"/>
          <rect :x="item.w*CELL/2 - 10" :y="item.h*CELL - 10" width="20" height="7" rx="2" :fill="statusStroke(item.status)" opacity="0.5"/>
          <rect x="3"    :y="item.h*CELL/2 - 10" width="7" height="20" rx="2" :fill="statusStroke(item.status)" opacity="0.5"/>
          <rect :x="item.w*CELL - 10" :y="item.h*CELL/2 - 10" width="7" height="20" rx="2" :fill="statusStroke(item.status)" opacity="0.5"/>
          <rect x="10" y="10" :width="item.w*CELL - 20" :height="item.h*CELL - 20"
            rx="8" :fill="statusFill(item.status)" :stroke="statusStroke(item.status)" stroke-width="2.5"/>
          <circle :cx="item.w*CELL - 12" :cy="12" r="5" :fill="statusDot(item.status)"/>
        </template>

        <!-- ╌╌ RECT TABLE ╌╌ -->
        <template v-else-if="item.type === 'table-rect'">
          <!-- top chairs -->
          <rect v-for="i in item.w" :key="'tc'+i"
            :x="(i-1)*CELL + 8" y="3" :width="CELL - 16" height="7"
            rx="2" :fill="statusStroke(item.status)" opacity="0.5"/>
          <!-- bottom chairs -->
          <rect v-for="i in item.w" :key="'bc'+i"
            :x="(i-1)*CELL + 8" :y="item.h*CELL - 10" :width="CELL - 16" height="7"
            rx="2" :fill="statusStroke(item.status)" opacity="0.5"/>
          <rect x="4" y="10" :width="item.w*CELL - 8" :height="item.h*CELL - 20"
            rx="8" :fill="statusFill(item.status)" :stroke="statusStroke(item.status)" stroke-width="2.5"/>
          <circle :cx="item.w*CELL - 12" :cy="12" r="5" :fill="statusDot(item.status)"/>
        </template>

        <!-- ╌╌ COUNTER ╌╌ -->
        <template v-else-if="item.type === 'counter'">
          <rect x="0" y="0" :width="item.w*CELL" :height="item.h*CELL"
            fill="#d6d3d1" stroke="#78716c" stroke-width="1.5"/>
          <line v-for="i in item.w - 1" :key="i"
            :x1="i*CELL" y1="0" :x2="i*CELL" :y2="item.h*CELL"
            stroke="#a8a29e" stroke-width="0.6"/>
          <rect x="0" y="0" :width="item.w*CELL" height="4" fill="#a8a29e" opacity="0.5"/>
        </template>

        <!-- ╌╌ SOFA ╌╌ -->
        <template v-else-if="item.type === 'sofa'">
          <!-- back rest -->
          <rect x="2" y="2" :width="item.w*CELL - 4" height="10" rx="4"
            fill="#a78bfa" stroke="#7c3aed" stroke-width="1.5"/>
          <!-- seat -->
          <rect x="2" y="14" :width="item.w*CELL - 4" :height="item.h*CELL - 18"
            rx="10" fill="#c4b5fd" stroke="#7c3aed" stroke-width="2"/>
          <!-- cushion dividers -->
          <line v-for="i in item.w - 1" :key="i"
            :x1="i*CELL" y1="16" :x2="i*CELL" :y2="item.h*CELL - 6"
            stroke="#7c3aed" stroke-width="1" opacity="0.4"/>
        </template>

        <!-- ╌╌ BAR STOOL ╌╌ -->
        <template v-else-if="item.type === 'bar-stool'">
          <circle :cx="CELL/2" :cy="CELL/2" :r="CELL/2 - 9"
            :fill="statusFill(item.status)" :stroke="statusStroke(item.status)" stroke-width="2"/>
          <circle :cx="CELL - 9" :cy="9" r="4" :fill="statusDot(item.status)"/>
        </template>

        <!-- ╌╌ PLANT ╌╌ -->
        <template v-else-if="item.type === 'plant'">
          <circle :cx="CELL/2" :cy="CELL/2" :r="CELL/2 - 7"
            fill="#86efac" stroke="#16a34a" stroke-width="2"/>
          <text :x="CELL/2" :y="CELL/2 + 5" text-anchor="middle" font-size="14">🌿</text>
        </template>

        <!-- ╌╌ ENTRANCE ╌╌ -->
        <template v-else-if="item.type === 'entrance'">
          <rect x="0" y="0" :width="item.w*CELL" :height="item.h*CELL"
            fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
          <!-- Door arc -->
          <line :x1="item.w*CELL*0.25" y1="8"
                :x2="item.w*CELL*0.25" :y2="item.h*CELL - 8"
                stroke="#2563eb" stroke-width="2"/>
          <path
            :d="`M ${item.w*CELL*0.25} ${item.h*CELL*0.5} A ${item.w*CELL*0.4} ${item.w*CELL*0.4} 0 0 1 ${item.w*CELL*0.65} ${item.h*CELL*0.5}`"
            fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
          <text :x="item.w*CELL/2" :y="item.h*CELL - 6"
            text-anchor="middle" font-size="9" fill="#1d4ed8" font-weight="700">DOOR</text>
        </template>

        <!-- ╌╌ WINDOW ╌╌ -->
        <template v-else-if="item.type === 'window'">
          <rect x="0" y="0" :width="item.w*CELL" :height="item.h*CELL"
            fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
          <!-- panes -->
          <line v-for="i in item.w - 1" :key="i"
            :x1="i*CELL" y1="2" :x2="i*CELL" :y2="item.h*CELL - 2"
            stroke="#0284c7" stroke-width="1"/>
          <line x1="2" :y1="item.h*CELL/2" :x2="item.w*CELL - 2" :y2="item.h*CELL/2"
            stroke="#0284c7" stroke-width="1"/>
        </template>

        <!-- ╌╌ MENU BOARD ╌╌ -->
        <template v-else-if="item.type === 'menu-board'">
          <!-- Frame -->
          <rect x="1" y="1" :width="item.w*CELL-2" :height="item.h*CELL-2" rx="6"
            fill="#0f1a14" stroke="#1a3020" stroke-width="2"/>
          <!-- Chalkboard surface -->
          <rect x="5" y="5" :width="item.w*CELL-10" :height="item.h*CELL-10" rx="3"
            fill="#183020"/>
          <!-- Gold separator line -->
          <line x1="8" :y1="item.h*CELL*0.44" :x2="item.w*CELL-8" :y2="item.h*CELL*0.44"
            stroke="#d4a060" stroke-width="1.2"/>
          <!-- Menu item suggestion lines -->
          <line x1="10" :y1="item.h*CELL*0.65" :x2="item.w*CELL*0.55" :y2="item.h*CELL*0.65"
            stroke="#6b7280" stroke-width="0.9" opacity="0.75"/>
          <line x1="10" :y1="item.h*CELL*0.83" :x2="item.w*CELL*0.47" :y2="item.h*CELL*0.83"
            stroke="#6b7280" stroke-width="0.9" opacity="0.55"/>
          <!-- Price dots right side -->
          <line :x1="item.w*CELL*0.78" :y1="item.h*CELL*0.65" :x2="item.w*CELL-9" :y2="item.h*CELL*0.65"
            stroke="#d4a060" stroke-width="0.9" opacity="0.5"/>
          <line :x1="item.w*CELL*0.78" :y1="item.h*CELL*0.83" :x2="item.w*CELL-9" :y2="item.h*CELL*0.83"
            stroke="#d4a060" stroke-width="0.9" opacity="0.5"/>
          <!-- MENU label + icon -->
          <text x="9" :y="item.h*CELL*0.36" font-size="9" font-weight="800"
            fill="#d4a060" letter-spacing="2">MENU</text>
          <text :x="item.w*CELL-16" :y="item.h*CELL*0.36" font-size="9">☕</text>
        </template>

        <!-- ╌╌ WALL ART ╌╌ -->
        <template v-else-if="item.type === 'wall-art'">
          <!-- Outer wood frame -->
          <rect x="2" y="2" :width="item.w*CELL-4" :height="item.h*CELL-4" rx="4"
            fill="#3d2b1f" stroke="#1a0a04" stroke-width="2.5"/>
          <!-- Mat/passepartout -->
          <rect x="7" y="7" :width="item.w*CELL-14" :height="item.h*CELL-14" rx="2"
            fill="#f5ede0" stroke="#c4a882" stroke-width="1"/>
          <!-- Sky -->
          <rect x="11" y="11" :width="item.w*CELL-22" :height="(item.h*CELL-22)*0.55" rx="1"
            fill="#87ceeb" opacity="0.8"/>
          <!-- Sand / dunes -->
          <rect x="11" :y="11+(item.h*CELL-22)*0.55" :width="item.w*CELL-22" :height="(item.h*CELL-22)*0.45" rx="1"
            fill="#d4a060" opacity="0.7"/>
          <!-- Sun -->
          <circle :cx="item.w*CELL*0.72" :cy="item.h*CELL*0.27" r="4" fill="#f5c542" opacity="0.9"/>
          <!-- Palm trunk (vertical line) -->
          <line :x1="item.w*CELL*0.3" :y1="11+(item.h*CELL-22)*0.55"
                :x2="item.w*CELL*0.3" :y2="11+(item.h*CELL-22)*0.2"
                stroke="#2d4a1e" stroke-width="2"/>
          <!-- Frame shine -->
          <line x1="4" y1="4" :x2="item.w*CELL-4" y2="4" stroke="#8b6543" stroke-width="1.5" opacity="0.45"/>
        </template>

        <!-- ╌╌ COFFEE STATION ╌╌ -->
        <template v-else-if="item.type === 'coffee-station'">
          <!-- Dark marble counter -->
          <rect x="0" y="0" :width="item.w*CELL" :height="item.h*CELL" rx="5"
            fill="#1a0e08" stroke="#0f0906" stroke-width="1.5"/>
          <!-- Counter edge -->
          <rect x="0" :y="item.h*CELL-10" :width="item.w*CELL" height="10" rx="2"
            fill="#2c1810"/>
          <!-- Espresso machine body -->
          <rect x="4" y="5" :width="item.w*CELL*0.56" :height="item.h*CELL-18" rx="7"
            fill="#1c1917" stroke="#3d3530" stroke-width="1.5"/>
          <!-- Chrome strip -->
          <rect x="8" y="9" :width="item.w*CELL*0.37" height="9" rx="3"
            fill="#78716c" opacity="0.45"/>
          <!-- Group heads (portafilter ports) -->
          <rect x="8" :y="item.h*CELL-22" width="16" height="9" rx="3"
            fill="#57534e" stroke="#44403c" stroke-width="1"/>
          <rect x="28" :y="item.h*CELL-22" width="16" height="9" rx="3"
            fill="#57534e" stroke="#44403c" stroke-width="1"/>
          <!-- Steam wand -->
          <line :x1="item.w*CELL*0.6" y1="12" :x2="item.w*CELL*0.6" :y2="item.h*CELL-16"
            stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/>
          <circle :cx="item.w*CELL*0.6" :cy="item.h*CELL-14" r="4"
            fill="#78716c" stroke="#57534e" stroke-width="1"/>
          <!-- Grinder unit -->
          <rect :x="item.w*CELL*0.64" y="5" :width="item.w*CELL*0.3" :height="item.h*CELL-22" rx="5"
            fill="#292524" stroke="#44403c" stroke-width="1"/>
          <!-- Beans hopper on grinder -->
          <ellipse :cx="item.w*CELL*0.64+item.w*CELL*0.15" cy="9"
            :rx="item.w*CELL*0.1" ry="5" fill="#3d3228" stroke="#57534e" stroke-width="1"/>
          <!-- Two mugs -->
          <circle :cx="item.w*CELL*0.25" :cy="item.h*CELL-7" r="4"
            fill="none" stroke="#6b6560" stroke-width="1.5"/>
          <circle :cx="item.w*CELL*0.37" :cy="item.h*CELL-7" r="4"
            fill="none" stroke="#6b6560" stroke-width="1.5"/>
          <!-- Station label at bottom -->
          <text :x="item.w*CELL/2" :y="item.h*CELL-2" text-anchor="middle"
            font-size="9" font-weight="700" fill="#d4a060">{{ item.label }}</text>
        </template>

        <!-- ── Label ── -->
        <text
          v-if="!['plant','entrance','window','menu-board','wall-art','coffee-station'].includes(item.type)"
          :x="item.w*CELL/2"
          :y="item.type === 'sofa' ? item.h*CELL/2 + 5 : item.w*CELL === item.h*CELL ? item.h*CELL/2 + 4 : item.h*CELL/2 + 5"
          text-anchor="middle"
          :font-size="item.type === 'bar-stool' ? 9 : item.type === 'counter' ? 10 : 11"
          font-weight="700"
          :fill="item.type === 'sofa' ? '#4c1d95' : item.type === 'counter' ? '#44403c' : '#78350f'"
        >{{ item.label }}</text>

        <!-- ── Selection ring ── -->
        <rect
          v-if="item.id === selectedId"
          x="-3" y="-3"
          :width="item.w*CELL + 6" :height="item.h*CELL + 6"
          fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6 3" rx="5"
        />
      </g>

      <!-- ── Ghost preview ── -->
      <g
        v-if="activeTool && ghost"
        :transform="`translate(${ghost.x * CELL}, ${ghost.y * CELL})`"
        opacity="0.4"
        pointer-events="none"
      >
        <rect
          x="2" y="2"
          :width="ITEM_DEFAULTS[activeTool].w * CELL - 4"
          :height="ITEM_DEFAULTS[activeTool].h * CELL - 4"
          rx="8" fill="#d4a060" stroke="#c8813a" stroke-width="2" stroke-dasharray="6 3"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.canvas-outer {
  overflow: auto;
  background: #f0ebe2;
  border-radius: 14px;
  border: 1px solid #e0d8cc;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
}
.floor-svg { display: block; }
.item-group { cursor: grab; }
.item-group:active { cursor: grabbing; }
</style>