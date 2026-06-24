<script setup lang="ts">
import { ref } from 'vue'

const days = ref([
  { label: 'Monday',    open: '07:00', close: '22:00', active: true  },
  { label: 'Tuesday',   open: '07:00', close: '22:00', active: true  },
  { label: 'Wednesday', open: '07:00', close: '22:00', active: true  },
  { label: 'Thursday',  open: '07:00', close: '22:00', active: true  },
  { label: 'Friday',    open: '07:00', close: '22:00', active: true  },
  { label: 'Saturday',  open: '08:00', close: '23:00', active: true  },
  { label: 'Sunday',    open: '08:00', close: '23:00', active: true  },
])

const notifications = ref([
  { label: 'New Order Alert',    desc: 'Notify when a new order comes in',       on: true  },
  { label: 'Low Stock Warning',  desc: 'Alert when stock falls below threshold',  on: true  },
  { label: 'Order Status Email', desc: 'Send customers status update emails',     on: true  },
  { label: 'Daily Summary',      desc: 'Send a daily report to your inbox',       on: false },
  { label: 'Review Reminders',   desc: 'Ask customers for reviews after delivery', on: false },
])

const saved = ref('')

function saveSection(section: string) {
  saved.value = section
  setTimeout(() => saved.value = '', 2000)
}
</script>

<template>
  <div class="page">

    <!-- Page Header -->
    <div class="page-hdr">
      <div>
        <h1 class="page-hdr-title">Settings</h1>
        <p class="page-hdr-sub">Manage your café configuration and preferences</p>
      </div>
      <div v-if="saved" class="save-toast">✓ {{ saved }} saved</div>
    </div>

    <!-- Shop Information -->
    <div class="panel">
      <div class="panel-hdr">
        <div class="panel-icon">🏪</div>
        <div>
          <h3 class="panel-title">Shop Information</h3>
          <p class="panel-desc">Your public-facing café details</p>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Shop Name</label>
          <input value="4ever Coffee" class="input"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input value="hello@4evercoffee.ae" class="input" type="email"/>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input value="+971 50 888 8888" class="input"/>
        </div>
        <div class="form-group">
          <label>Currency</label>
          <select class="input">
            <option>GBP (£)</option>
            <option>USD ($)</option>
            <option>AED (د.إ)</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Address</label>
          <input value="Sheikh Zayed Road, Dubai, UAE" class="input"/>
        </div>
        <div class="form-group full">
          <label>About / Tagline</label>
          <textarea class="input textarea" rows="2">Crafted coffee for every moment, forever.</textarea>
        </div>
      </div>
      <button class="btn-save" @click="saveSection('Shop info')">Save Changes</button>
    </div>

    <!-- Delivery Settings -->
    <div class="panel">
      <div class="panel-hdr">
        <div class="panel-icon">🚴</div>
        <div>
          <h3 class="panel-title">Delivery Settings</h3>
          <p class="panel-desc">Configure delivery zones and fees</p>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Minimum Order (£)</label>
          <input value="10.00" type="number" step="0.50" class="input"/>
        </div>
        <div class="form-group">
          <label>Delivery Fee (£)</label>
          <input value="2.99" type="number" step="0.01" class="input"/>
        </div>
        <div class="form-group">
          <label>Free Delivery Over (£)</label>
          <input value="30.00" type="number" step="1" class="input"/>
        </div>
        <div class="form-group">
          <label>Est. Delivery Time</label>
          <input value="20 – 35 minutes" class="input"/>
        </div>
        <div class="form-group">
          <label>Delivery Radius (km)</label>
          <input value="15" type="number" class="input"/>
        </div>
        <div class="form-group">
          <label>Max Orders per Hour</label>
          <input value="40" type="number" class="input"/>
        </div>
      </div>
      <button class="btn-save" @click="saveSection('Delivery settings')">Save Changes</button>
    </div>

    <!-- Business Hours -->
    <div class="panel">
      <div class="panel-hdr">
        <div class="panel-icon">🕐</div>
        <div>
          <h3 class="panel-title">Business Hours</h3>
          <p class="panel-desc">When your café accepts orders</p>
        </div>
      </div>
      <div class="hours-list">
        <div v-for="day in days" :key="day.label" class="hours-row">
          <span class="hours-day">{{ day.label }}</span>
          <div class="hours-times" :class="{ disabled: !day.active }">
            <input :value="day.open"  type="time" class="input time-in" :disabled="!day.active"/>
            <span class="hours-sep">–</span>
            <input :value="day.close" type="time" class="input time-in" :disabled="!day.active"/>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="day.active" class="toggle-input"/>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
      </div>
      <button class="btn-save" @click="saveSection('Business hours')">Save Hours</button>
    </div>

    <!-- Notifications -->
    <div class="panel">
      <div class="panel-hdr">
        <div class="panel-icon">🔔</div>
        <div>
          <h3 class="panel-title">Notifications</h3>
          <p class="panel-desc">Choose what alerts you receive</p>
        </div>
      </div>
      <div class="notif-list">
        <div v-for="n in notifications" :key="n.label" class="notif-row">
          <div class="notif-info">
            <div class="notif-label">{{ n.label }}</div>
            <div class="notif-desc">{{ n.desc }}</div>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="n.on" class="toggle-input"/>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

/* Page header */
.page-hdr { display: flex; align-items: flex-start; justify-content: space-between; }
.page-hdr-title { font-size: 24px; font-weight: 900; color: #1c1917; margin: 0 0 4px; letter-spacing: -0.5px; }
.page-hdr-sub   { font-size: 13px; color: #a8a29e; margin: 0; }
.save-toast { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; }

/* Panel */
.panel { background: #fff; border-radius: 14px; padding: 24px 28px 20px; border: 1px solid #f0ebe4; box-shadow: 0 1px 4px rgba(44,16,8,0.05); }
.panel-hdr { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f5f0ea; }
.panel-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
.panel-title { font-size: 15px; font-weight: 700; color: #1c1917; margin: 0 0 3px; }
.panel-desc  { font-size: 12px; color: #a8a29e; margin: 0; }

/* Form */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1 / -1; }
label { font-size: 11px; font-weight: 600; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.input { padding: 10px 13px; border: 1.5px solid #e7e5e4; border-radius: 9px; font-size: 14px; outline: none; background: #faf7f2; color: #1c1917; transition: border-color 0.15s, background 0.15s; width: 100%; box-sizing: border-box; }
.input:focus { border-color: #d4a060; background: #fff; }
.input:disabled { opacity: 0.4; cursor: not-allowed; }
.textarea { resize: vertical; font-family: inherit; }

/* Hours */
.hours-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px; }
.hours-row { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid #faf7f2; }
.hours-day { font-size: 13px; font-weight: 600; color: #1c1917; width: 100px; flex-shrink: 0; }
.hours-times { display: flex; align-items: center; gap: 8px; flex: 1; }
.hours-times.disabled .input { opacity: 0.35; }
.time-in { width: 110px; flex: 0 0 110px; }
.hours-sep { font-size: 13px; color: #a8a29e; }

/* Notifications */
.notif-list { display: flex; flex-direction: column; }
.notif-row { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #faf7f2; }
.notif-row:last-child { border-bottom: none; }
.notif-info { flex: 1; }
.notif-label { font-size: 14px; font-weight: 600; color: #1c1917; margin-bottom: 2px; }
.notif-desc  { font-size: 12px; color: #a8a29e; }

/* Toggle switch */
.toggle { position: relative; display: flex; align-items: center; cursor: pointer; flex-shrink: 0; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track { width: 42px; height: 24px; background: #e7e5e4; border-radius: 12px; position: relative; transition: background 0.2s; }
.toggle-input:checked ~ .toggle-track { background: #d4a060; }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.15); transition: transform 0.2s; }
.toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(18px); }

/* Save button */
.btn-save { background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; border-radius: 9px; padding: 10px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; box-shadow: 0 2px 8px rgba(200,129,58,0.28); }
.btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(200,129,58,0.4); }
</style>