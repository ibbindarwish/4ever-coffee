<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { usePromoStore, type PromoCode } from '../../stores/promo'

const promo = usePromoStore()

/* ── Stats ── */
const totalCodes   = computed(() => promo.codes.length)
const activeCnt    = computed(() => promo.activeCodes.length)
const inactiveCnt  = computed(() => promo.inactiveCodes.length)
const percentCnt   = computed(() => promo.codes.filter(c => c.type === 'percent').length)

/* ── Create / Edit modal ── */
type ModalMode = 'create' | 'edit' | null

const modalMode = ref<ModalMode>(null)
const editingId = ref<number | null>(null)
const formError = ref('')

const blankForm = (): Omit<PromoCode, 'id'> => ({
  code: '', label: '', type: 'percent', value: 10, minOrder: 0, active: true,
})

const form = reactive<Omit<PromoCode, 'id'>>(blankForm())

function openCreate() {
  Object.assign(form, blankForm())
  formError.value = ''
  editingId.value = null
  modalMode.value = 'create'
}

function openEdit(code: PromoCode) {
  Object.assign(form, { ...code })
  formError.value = ''
  editingId.value = code.id
  modalMode.value = 'edit'
}

function closeModal() {
  modalMode.value = null
  editingId.value = null
  formError.value = ''
}

function submitForm() {
  formError.value = ''
  if (!form.code.trim()) { formError.value = 'Code name is required.'; return }
  if (!form.label.trim()) { formError.value = 'Label is required.'; return }
  if (form.type !== 'shipping' && (form.value <= 0 || form.value > 100)) {
    formError.value = form.type === 'percent'
      ? 'Percent value must be 1–100.'
      : 'Fixed value must be greater than 0.'
    return
  }

  if (modalMode.value === 'create') {
    const res = promo.addCode({ ...form })
    if (!res.ok) { formError.value = res.msg || 'Error'; return }
  } else if (modalMode.value === 'edit' && editingId.value !== null) {
    const res = promo.updateCode(editingId.value, { ...form })
    if (!res.ok) { formError.value = res.msg || 'Error'; return }
  }
  closeModal()
}

/* ── Delete confirm ── */
const deletingId = ref<number | null>(null)

function confirmDelete(id: number) { deletingId.value = id }
function cancelDelete()            { deletingId.value = null }
function doDelete() {
  if (deletingId.value !== null) promo.deleteCode(deletingId.value)
  deletingId.value = null
}

/* ── Type / role display ── */
function typeLabel(c: PromoCode): string {
  if (c.type === 'percent')  return `${c.value}% off`
  if (c.type === 'fixed')    return `£${c.value.toFixed(2)} off`
  return 'Free Shipping'
}

function typeBadgeClass(type: PromoCode['type']): string {
  return { percent: 'badge-gold', fixed: 'badge-blue', shipping: 'badge-green' }[type]
}

function roleBadgeLabel(c: PromoCode): string {
  if (c.staffRole === 'admin') return '👑 Admin'
  if (c.staffRole === 'staff') return '🏷 Staff'
  return ''
}
</script>

<template>
  <div class="page">

    <!-- Header -->
    <div class="page-hdr">
      <div>
        <h1 class="page-title">Promo Codes</h1>
        <p class="page-sub">Create and manage discount codes for customers</p>
      </div>
      <button class="btn-create" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Promo Code
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(212,160,96,0.12);color:#d4a060;">🏷</div>
        <div>
          <div class="stat-val">{{ totalCodes }}</div>
          <div class="stat-lbl">Total Codes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(34,197,94,0.1);color:#16a34a;">✓</div>
        <div>
          <div class="stat-val">{{ activeCnt }}</div>
          <div class="stat-lbl">Active</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(168,162,158,0.12);color:#78716c;">✗</div>
        <div>
          <div class="stat-val">{{ inactiveCnt }}</div>
          <div class="stat-lbl">Inactive</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(59,130,246,0.1);color:#2563eb;">%</div>
        <div>
          <div class="stat-val">{{ percentCnt }}</div>
          <div class="stat-lbl">Percent Codes</div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="panel">
      <table class="promo-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Label</th>
            <th>Discount</th>
            <th>Min Order</th>
            <th>Status</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="code in promo.codes" :key="code.id"
              :class="{ 'row-inactive': !code.active, 'row-system': !!code.staffRole }">
            <td>
              <div class="code-cell">
                <span class="code-pill">{{ code.code }}</span>
                <span v-if="code.staffRole" class="role-badge"
                      :class="code.staffRole === 'admin' ? 'role-admin' : 'role-staff'">
                  {{ roleBadgeLabel(code) }}
                </span>
              </div>
            </td>
            <td class="label-cell">{{ code.label }}</td>
            <td>
              <span class="type-badge" :class="typeBadgeClass(code.type)">
                {{ typeLabel(code) }}
              </span>
            </td>
            <td class="min-cell">
              {{ code.minOrder > 0 ? '£' + code.minOrder.toFixed(2) : '—' }}
            </td>
            <td>
              <button
                class="toggle-btn"
                :class="code.active ? 'toggle-on' : 'toggle-off'"
                @click="promo.toggleCode(code.id)"
                :title="code.active ? 'Click to deactivate' : 'Click to activate'"
              >
                <span class="toggle-dot"></span>
                {{ code.active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="actions-cell">
              <button class="act-btn edit-btn" @click="openEdit(code)" title="Edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button v-if="!code.staffRole" class="act-btn del-btn" @click="confirmDelete(code.id)" title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Delete
              </button>
              <span v-else class="system-lock" title="System code — cannot be deleted">🔒 System</span>
            </td>
          </tr>
          <tr v-if="promo.codes.length === 0">
            <td colspan="6" class="empty-row">No promo codes yet — create one above.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Info box -->
    <div class="info-box">
      <div class="info-icon">ℹ</div>
      <div class="info-text">
        <strong>How codes work:</strong> Customers enter a promo code at checkout. Inactive codes are rejected even if the customer knows the code name. Minimum order amounts are checked against the cart subtotal before delivery.
      </div>
    </div>

    <!-- ── Create / Edit Modal ── -->
    <Teleport to="body">
      <div v-if="modalMode" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <div class="modal-hdr">
            <h2 class="modal-title">{{ modalMode === 'create' ? 'New Promo Code' : 'Edit Promo Code' }}</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <form class="modal-form" @submit.prevent="submitForm">
            <div class="field-row">
              <div class="field">
                <label class="field-lbl">Code Name *</label>
                <input
                  v-model="form.code"
                  class="field-input code-input"
                  placeholder="e.g. SUMMER20"
                  maxlength="20"
                  style="text-transform:uppercase"
                />
                <p class="field-hint">Customers type this at checkout. Auto-uppercased.</p>
              </div>
              <div class="field">
                <label class="field-lbl">Discount Type *</label>
                <select v-model="form.type" class="field-input field-select">
                  <option value="percent">Percentage off</option>
                  <option value="fixed">Fixed amount off (£)</option>
                  <option value="shipping">Free shipping</option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="field-lbl">
                  {{ form.type === 'percent' ? 'Discount %' : form.type === 'fixed' ? 'Discount Amount (£)' : 'Value (n/a for free shipping)' }}
                </label>
                <input
                  v-model.number="form.value"
                  type="number" min="0" :max="form.type === 'percent' ? 100 : 9999"
                  step="0.01"
                  class="field-input"
                  :disabled="form.type === 'shipping'"
                  placeholder="e.g. 20"
                />
              </div>
              <div class="field">
                <label class="field-lbl">Minimum Order (£)</label>
                <input
                  v-model.number="form.minOrder"
                  type="number" min="0" step="0.01"
                  class="field-input"
                  placeholder="0 = no minimum"
                />
              </div>
            </div>

            <div class="field">
              <label class="field-lbl">Label / Description *</label>
              <input
                v-model="form.label"
                class="field-input"
                placeholder="e.g. 20% summer special discount"
                maxlength="80"
              />
              <p class="field-hint">Shown to the customer when the code is applied successfully.</p>
            </div>

            <div class="field-row field-row-check">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.active" class="checkbox-input" />
                <span class="checkbox-custom"></span>
                Active — customers can use this code immediately
              </label>
            </div>

            <div v-if="formError" class="form-error">{{ formError }}</div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-save">
                {{ modalMode === 'create' ? 'Create Code' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirm ── -->
    <Teleport to="body">
      <div v-if="deletingId !== null" class="modal-backdrop" @click.self="cancelDelete">
        <div class="modal modal-sm">
          <div class="del-icon">🗑</div>
          <h3 class="del-title">Delete Promo Code?</h3>
          <p class="del-desc">
            "<strong>{{ promo.codes.find(c => c.id === deletingId)?.code }}</strong>" will be permanently removed.
            Customers currently using it will lose their discount.
          </p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="cancelDelete">Cancel</button>
            <button class="btn-danger" @click="doDelete">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

/* Header */
.page-hdr  { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-title { font-size: 22px; font-weight: 900; color: #1c1917; margin: 0 0 4px; }
.page-sub   { font-size: 13px; color: #a8a29e; margin: 0; }

.btn-create {
  display: flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff;
  border: none; border-radius: 10px; padding: 10px 18px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(200,129,58,0.35); transition: all 0.2s;
}
.btn-create:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,129,58,0.5); }
.btn-create svg { width: 16px; height: 16px; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 700px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 14px;
  padding: 18px 20px; display: flex; align-items: center; gap: 14px;
}
.stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; flex-shrink: 0; }
.stat-val  { font-size: 26px; font-weight: 900; color: #1c1917; line-height: 1; }
.stat-lbl  { font-size: 11px; color: #a8a29e; margin-top: 2px; font-weight: 600; }

/* Table */
.panel { background: #fff; border-radius: 14px; border: 1px solid #f0ebe4; overflow: auto; }
.promo-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.promo-table th {
  padding: 12px 14px; font-size: 11px; font-weight: 700; color: #a8a29e;
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid #f0ebe4; text-align: left;
}
.promo-table td { padding: 12px 14px; border-bottom: 1px solid #faf7f2; vertical-align: middle; }
.promo-table tr:last-child td { border-bottom: none; }
.row-inactive td { opacity: 0.55; }
.actions-col { text-align: right; }
.actions-cell { text-align: right; }

.code-pill {
  font-family: 'Courier New', monospace; font-size: 13px; font-weight: 700;
  background: #1c1917; color: #d4a060; border-radius: 6px;
  padding: 4px 10px; letter-spacing: 0.06em;
}

.label-cell { font-size: 13px; color: #44403c; max-width: 220px; }
.min-cell   { font-size: 13px; color: #78716c; }

.type-badge {
  display: inline-block; border-radius: 20px; padding: 4px 12px;
  font-size: 11px; font-weight: 700;
}
.badge-gold  { background: rgba(212,160,96,0.12); color: #b45309; border: 1px solid rgba(212,160,96,0.3); }
.badge-blue  { background: rgba(59,130,246,0.1);  color: #1d4ed8; border: 1px solid rgba(59,130,246,0.25); }
.badge-green { background: rgba(34,197,94,0.1);   color: #15803d; border: 1px solid rgba(34,197,94,0.25); }

/* Toggle */
.toggle-btn {
  display: inline-flex; align-items: center; gap: 6px;
  border: none; border-radius: 20px; padding: 5px 12px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s;
}
.toggle-on  { background: rgba(34,197,94,0.1);  color: #15803d; }
.toggle-off { background: rgba(168,162,158,0.12); color: #78716c; }
.toggle-dot {
  width: 7px; height: 7px; border-radius: 50%;
}
.toggle-on  .toggle-dot { background: #16a34a; }
.toggle-off .toggle-dot { background: #a8a29e; }

/* Actions */
.act-btn {
  display: inline-flex; align-items: center; gap: 5px;
  border: 1px solid; border-radius: 7px; padding: 5px 10px;
  font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s;
  background: none; margin-left: 6px;
}
.act-btn svg { width: 12px; height: 12px; }
.edit-btn { color: #2563eb; border-color: rgba(37,99,235,0.25); }
.edit-btn:hover { background: rgba(37,99,235,0.08); }
.del-btn  { color: #dc2626; border-color: rgba(220,38,38,0.25); }
.del-btn:hover  { background: rgba(220,38,38,0.06); }

.empty-row { text-align: center; color: #a8a29e; padding: 40px; font-size: 14px; }

.code-cell { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.role-badge {
  display: inline-flex; align-items: center; gap: 3px;
  border-radius: 20px; padding: 2px 9px;
  font-size: 10px; font-weight: 700;
}
.role-admin { background: rgba(212,160,96,0.15); border: 1px solid rgba(212,160,96,0.4); color: #b45309; }
.role-staff { background: rgba(59,130,246,0.1);  border: 1px solid rgba(59,130,246,0.3); color: #1d4ed8; }

.row-system td { background: #fffdf8; }

.system-lock {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: #a8a29e; margin-left: 6px;
  white-space: nowrap;
}

/* Info box */
.info-box {
  display: flex; gap: 12px; align-items: flex-start;
  background: rgba(212,160,96,0.06); border: 1px solid rgba(212,160,96,0.2);
  border-radius: 12px; padding: 14px 18px;
}
.info-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.info-text { font-size: 13px; color: #78716c; line-height: 1.6; }
.info-text strong { color: #1c1917; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 500; padding: 24px;
}
.modal {
  background: #fff; border-radius: 18px; width: 100%; max-width: 580px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2); overflow: hidden;
}
.modal-sm { max-width: 400px; padding: 32px; text-align: center; }

.modal-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 26px 0;
}
.modal-title { font-size: 18px; font-weight: 800; color: #1c1917; margin: 0; }
.modal-close {
  width: 32px; height: 32px; border-radius: 8px; border: none;
  background: #f5f5f4; color: #78716c; font-size: 14px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: #e7e5e4; }

.modal-form { padding: 22px 26px 26px; display: flex; flex-direction: column; gap: 18px; }

.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field-row-check { grid-template-columns: 1fr; }
@media (max-width: 500px) { .field-row { grid-template-columns: 1fr; } }

.field { display: flex; flex-direction: column; gap: 6px; }
.field-lbl { font-size: 12px; font-weight: 700; color: #44403c; text-transform: uppercase; letter-spacing: 0.06em; }
.field-input {
  padding: 10px 13px; border: 1.5px solid #e7e5e4; border-radius: 9px;
  font-size: 13px; color: #1c1917; font-family: inherit; outline: none;
  transition: border-color 0.15s;
}
.field-input:focus { border-color: #d4a060; }
.field-input:disabled { background: #faf7f2; color: #a8a29e; cursor: not-allowed; }
.field-select { cursor: pointer; }
.code-input { font-family: 'Courier New', monospace; font-weight: 700; letter-spacing: 0.06em; }
.field-hint { font-size: 11px; color: #a8a29e; margin: 0; }

.checkbox-label {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: #44403c; cursor: pointer; user-select: none;
}
.checkbox-input { display: none; }
.checkbox-custom {
  width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #e7e5e4;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.checkbox-input:checked + .checkbox-custom {
  background: #d4a060; border-color: #d4a060;
}
.checkbox-input:checked + .checkbox-custom::after { content: '✓'; color: #fff; font-size: 11px; font-weight: 800; }

.form-error {
  background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.2);
  color: #dc2626; border-radius: 8px; padding: 10px 14px; font-size: 13px;
}

.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }

.btn-cancel {
  padding: 10px 20px; border: 1.5px solid #e7e5e4; border-radius: 9px;
  background: none; color: #78716c; font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: inherit; transition: all 0.15s;
}
.btn-cancel:hover { background: #faf7f2; }

.btn-save {
  padding: 10px 22px; border: none; border-radius: 9px;
  background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff;
  font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 12px rgba(200,129,58,0.35); transition: all 0.2s;
}
.btn-save:hover { box-shadow: 0 6px 18px rgba(200,129,58,0.5); }

.btn-danger {
  padding: 10px 22px; border: none; border-radius: 9px;
  background: #dc2626; color: #fff;
  font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: all 0.15s;
}
.btn-danger:hover { background: #b91c1c; }

/* Delete confirm modal content */
.del-icon  { font-size: 44px; margin-bottom: 12px; }
.del-title { font-size: 18px; font-weight: 800; color: #1c1917; margin: 0 0 8px; }
.del-desc  { font-size: 13px; color: #78716c; line-height: 1.6; margin: 0 0 24px; }
</style>