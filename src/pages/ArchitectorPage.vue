<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItemType } from '../stores/architector'
import { useArchitectorStore } from '../stores/architector'
import FloorCanvas      from '../components/architector/FloorCanvas.vue'
import ItemPalette      from '../components/architector/ItemPalette.vue'
import ItemProperties   from '../components/architector/ItemProperties.vue'

const store = useArchitectorStore()

const activeTool = ref<ItemType | null>(null)
const selectedId = ref<string | null>(null)

const stats = computed(() => {
  const tables = store.plan.items.filter(i =>
    ['table-round', 'table-square', 'table-rect'].includes(i.type)
  )
  const stools = store.plan.items.filter(i => i.type === 'bar-stool')
  return {
    tables: tables.length,
    avail:  tables.filter(t => t.status === 'available').length,
    occ:    tables.filter(t => t.status === 'occupied').length,
    res:    tables.filter(t => t.status === 'reserved').length,
    seats:  [...tables, ...stools].reduce((s, t) => s + (t.capacity || 0), 0),
  }
})

function onSelect(id: string | null) {
  selectedId.value = id
  if (id) activeTool.value = null  // auto-exit placement mode on item click
}

function exportSVG() {
  const svg = document.querySelector('.floor-svg') as SVGSVGElement
  if (!svg) return
  const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
  const a    = Object.assign(document.createElement('a'), {
    href:     URL.createObjectURL(blob),
    download: `${store.plan.name.replace(/\s+/g, '-')}-layout.svg`,
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

function confirmClear() {
  if (confirm('Clear the entire floor plan? This can be undone with Undo.')) {
    store.clearLayout()
    selectedId.value = null
  }
}

function cancelTool() {
  activeTool.value = null
}
</script>

<template>
  <div class="page">

    <!-- ── Header ── -->
    <div class="hdr">
      <div class="hdr-brand">
        <div class="hdr-icon">⬡</div>
        <div>
          <h1 class="hdr-title">Café Architector</h1>
          <p class="hdr-sub">Design &amp; manage your café floor plan</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <span class="sv">{{ stats.tables }}</span>
          <span class="sl">Tables</span>
        </div>
        <div class="sdiv"></div>
        <div class="stat">
          <span class="sv avail">{{ stats.avail }}</span>
          <span class="sl">Open</span>
        </div>
        <div class="sdiv"></div>
        <div class="stat">
          <span class="sv occ">{{ stats.occ }}</span>
          <span class="sl">Busy</span>
        </div>
        <div class="sdiv"></div>
        <div class="stat">
          <span class="sv res">{{ stats.res }}</span>
          <span class="sl">Reserved</span>
        </div>
        <div class="sdiv"></div>
        <div class="stat">
          <span class="sv">{{ stats.seats }}</span>
          <span class="sl">Seats</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="act" @click="store.undo()" :disabled="!store.canUndo">↩ Undo</button>
        <button class="act" @click="store.redo()" :disabled="!store.canRedo">↪ Redo</button>
        <button class="act sample" @click="store.loadSample()">⊞ Sample layout</button>
        <button class="act jumeirah" @click="store.loadJumeirahLayout()">🏙 Jumeirah Dubai</button>
        <button class="act export" @click="exportSVG">↓ Export SVG</button>
        <button class="act danger" @click="confirmClear">✕ Clear</button>
      </div>
    </div>

    <!-- ── Tool badge ── -->
    <Transition name="badge">
      <div v-if="activeTool" class="tool-badge">
        <span>Placing: <strong>{{ activeTool.replace(/-/g, ' ') }}</strong>
          &nbsp;— click anywhere on the floor to place</span>
        <button @click="cancelTool">✕ Cancel</button>
      </div>
    </Transition>

    <!-- ── Body ── -->
    <div class="body">

      <!-- Left: palette -->
      <div class="panel left">
        <ItemPalette v-model:active-tool="activeTool" />
      </div>

      <!-- Centre: canvas -->
      <div class="center">
        <FloorCanvas
          :active-tool="activeTool"
          :selected-id="selectedId"
          @select="onSelect"
          @placed="() => {}"
        />
        <p class="canvas-hint">
          {{ activeTool
            ? 'Click the floor to place. Click again to place another.'
            : 'Drag items to move them · Click an item to edit it · Click empty space to deselect' }}
        </p>
      </div>

      <!-- Right: properties -->
      <div class="panel right">
        <ItemProperties
          :selected-id="selectedId"
          @deselect="selectedId = null"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 14px; min-height: 0; }

/* ── Header ─────────────────────────────────────────── */
.hdr {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  background: #fff; border-radius: 14px; padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.hdr-brand  { display: flex; align-items: center; gap: 12px; }
.hdr-icon   { font-size: 28px; }
.hdr-title  { font-size: 20px; font-weight: 900; color: #1c1917; margin: 0; letter-spacing: -0.5px; }
.hdr-sub    { font-size: 11px; color: #a8a29e; margin: 0; }

.stats      { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-wrap: wrap; }
.stat       { display: flex; flex-direction: column; align-items: center; gap: 0; }
.sv         { font-size: 18px; font-weight: 900; color: #1c1917; line-height: 1.1; }
.sv.avail   { color: #22c55e; }
.sv.occ     { color: #ef4444; }
.sv.res     { color: #f59e0b; }
.sl         { font-size: 9px; color: #a8a29e; font-weight: 700; text-transform: uppercase;
              letter-spacing: 0.06em; }
.sdiv       { width: 1px; height: 28px; background: #e7e5e4; }

.actions    { display: flex; gap: 6px; flex-wrap: wrap; }
.act {
  padding: 7px 13px; border-radius: 8px; border: 1.5px solid #e7e5e4;
  background: #fff; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.14s; color: #57534e; white-space: nowrap;
}
.act:hover:not(:disabled) { border-color: #d4a060; color: #92400e; background: #fffbf5; }
.act:disabled { opacity: 0.38; cursor: not-allowed; }
.act.sample   { border-color: #d4a060; color: #92400e; background: #fffbf5; }
.act.jumeirah { border-color: #7c3aed; color: #5b21b6; background: #f5f3ff; }
.act.jumeirah:hover { background: #ede9fe; }
.act.export  { border-color: #2563eb; color: #1d4ed8; background: #eff6ff; }
.act.danger  { border-color: #fecaca; color: #dc2626; background: #fff5f5; }
.act.danger:hover { background: #fee2e2; }

/* ── Tool badge ─────────────────────────────────────── */
.tool-badge {
  display: flex; align-items: center; gap: 10px;
  background: rgba(212,160,96,0.13); border: 1px solid rgba(212,160,96,0.4);
  color: #92400e; border-radius: 10px; padding: 9px 16px; font-size: 13px;
}
.tool-badge button {
  margin-left: auto; background: none; border: 1px solid rgba(212,160,96,0.5);
  border-radius: 6px; color: #92400e; cursor: pointer; padding: 3px 10px; font-size: 12px;
  font-weight: 600; transition: background 0.14s;
}
.tool-badge button:hover { background: rgba(212,160,96,0.2); }
.badge-enter-active, .badge-leave-active { transition: all 0.25s ease; }
.badge-enter-from, .badge-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Body ───────────────────────────────────────────── */
.body {
  display: grid;
  grid-template-columns: 188px 1fr 208px;
  gap: 14px;
  align-items: start;
}

.panel {
  background: #fff; border-radius: 14px; padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  position: sticky; top: 0;
}

.center { min-width: 0; }

.canvas-hint {
  font-size: 11px; color: #a8a29e; text-align: center;
  margin: 8px 0 0; padding: 0 4px; line-height: 1.5;
}
</style>