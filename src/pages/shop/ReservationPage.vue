<script setup lang="ts">
import { ref, computed } from 'vue'

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  notes: string
  status: 'confirmed' | 'pending'
  createdAt: string
}

const LS_KEY = 'fc_reservations'

function loadReservations(): Reservation[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function saveReservations(list: Reservation[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

const reservations = ref<Reservation[]>(loadReservations())
const submitted = ref(false)
const confirmRef = ref('')

const form = ref({
  name: '', email: '', phone: '',
  date: '', time: '', guests: 2, notes: '',
})
const errors = ref<Partial<Record<keyof typeof form.value, string>>>({})

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
]

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

function validate() {
  errors.value = {}
  if (!form.value.name)                errors.value.name  = 'Name required'
  if (!form.value.email)               errors.value.email = 'Email required'
  if (!form.value.phone)               errors.value.phone = 'Phone required'
  if (!form.value.date)                errors.value.date  = 'Date required'
  if (!form.value.time)                errors.value.time  = 'Time required'
  if (form.value.guests < 1)           errors.value.guests = 'Min 1 guest'
  if (form.value.guests > 20)          errors.value.guests = 'Max 20 guests'
  return Object.keys(errors.value).length === 0
}

function submitReservation() {
  if (!validate()) return
  const id = Math.random().toString(36).slice(2, 8).toUpperCase()
  const res: Reservation = {
    id,
    ...form.value,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
  reservations.value.push(res)
  saveReservations(reservations.value)
  confirmRef.value = id
  submitted.value = true
}

function newBooking() {
  submitted.value = false
  confirmRef.value = ''
  form.value = { name: '', email: '', phone: '', date: '', time: '', guests: 2, notes: '' }
}

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="res-page">

    <!-- Banner -->
    <div class="banner">
      <div class="banner-bg">
        <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&fit=crop&auto=format&q=60" alt="" class="banner-img"/>
        <div class="banner-overlay"></div>
      </div>
      <div class="banner-inner">
        <p class="banner-eye">Reserve a Table</p>
        <h1 class="banner-title">Book Your Perfect Moment</h1>
        <p class="banner-sub">Jumeirah, Dubai — Open daily 08:00–20:00</p>
      </div>
    </div>

    <div class="page-inner">

      <!-- ── Success state ── -->
      <div v-if="submitted" class="success-card">
        <div class="success-icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p class="success-ref">Reference: <strong>{{ confirmRef }}</strong></p>
        <p class="success-msg">
          We've reserved your table for <strong>{{ form.guests }} guest{{ form.guests > 1 ? 's' : '' }}</strong>
          on <strong>{{ formatDate(form.date) }}</strong> at <strong>{{ form.time }}</strong>.
          A confirmation has been sent to <strong>{{ form.email }}</strong>.
        </p>
        <div class="success-detail">
          <div class="detail-row"><span>Name</span><span>{{ form.name }}</span></div>
          <div class="detail-row"><span>Date</span><span>{{ formatDate(form.date) }}</span></div>
          <div class="detail-row"><span>Time</span><span>{{ form.time }}</span></div>
          <div class="detail-row"><span>Guests</span><span>{{ form.guests }}</span></div>
        </div>
        <button class="new-btn" @click="newBooking">Make Another Booking</button>
      </div>

      <!-- ── Form ── -->
      <div v-else class="form-layout">

        <div class="form-card">
          <h2 class="form-title">Your Details</h2>

          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.name" class="input" :class="{ err: errors.name }" placeholder="Sara Ahmed"/>
            <span v-if="errors.name" class="err-msg">{{ errors.name }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" class="input" :class="{ err: errors.email }" placeholder="sara@example.com"/>
              <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="form.phone" class="input" :class="{ err: errors.phone }" placeholder="+971 50 000 0000"/>
              <span v-if="errors.phone" class="err-msg">{{ errors.phone }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input v-model="form.date" type="date" class="input" :class="{ err: errors.date }" :min="minDate"/>
              <span v-if="errors.date" class="err-msg">{{ errors.date }}</span>
            </div>
            <div class="form-group">
              <label>Number of Guests</label>
              <div class="guests-row">
                <button type="button" class="qty-btn" @click="form.guests = Math.max(1, form.guests - 1)">−</button>
                <span class="guests-num">{{ form.guests }}</span>
                <button type="button" class="qty-btn" @click="form.guests = Math.min(20, form.guests + 1)">+</button>
              </div>
              <span v-if="errors.guests" class="err-msg">{{ errors.guests }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Preferred Time</label>
            <div class="time-grid">
              <button
                v-for="t in TIME_SLOTS" :key="t"
                type="button"
                class="time-slot"
                :class="{ active: form.time === t }"
                @click="form.time = t"
              >{{ t }}</button>
            </div>
            <span v-if="errors.time" class="err-msg">{{ errors.time }}</span>
          </div>

          <div class="form-group">
            <label>Special Requests <span class="opt">(optional)</span></label>
            <textarea v-model="form.notes" class="input textarea" placeholder="Allergies, high chairs, special occasion…" rows="3"></textarea>
          </div>

          <button class="submit-btn" @click="submitReservation">
            Confirm Reservation →
          </button>
        </div>

        <!-- Info panel -->
        <div class="info-panel">
          <h3>What to Expect</h3>
          <div class="info-item">
            <span class="info-icon">📍</span>
            <div>
              <strong>Location</strong>
              <p>Jumeirah Beach Road, Dubai</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🕐</span>
            <div>
              <strong>Opening Hours</strong>
              <p>Daily 08:00 – 20:00</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">👥</span>
            <div>
              <strong>Group Size</strong>
              <p>1 – 20 guests. For larger events, call us.</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">☕</span>
            <div>
              <strong>Menu</strong>
              <p>Full coffee menu + pastries served all day.</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">✅</span>
            <div>
              <strong>Confirmation</strong>
              <p>Instant email confirmation. Please arrive 5 min early.</p>
            </div>
          </div>

          <div class="policy-box">
            <p><strong>Cancellation Policy</strong></p>
            <p>Free cancellation up to 2 hours before your booking.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.res-page { min-height: 60vh; background: #faf7f2; }

/* Banner */
.banner { position: relative; height: 280px; display: flex; align-items: flex-end; overflow: hidden; }
.banner-bg { position: absolute; inset: 0; }
.banner-img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; }
.banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,4,2,0.88) 0%, rgba(10,4,2,0.45) 60%, transparent 100%); }
.banner-inner { position: relative; z-index: 2; max-width: 1100px; width: 100%; margin: 0 auto; padding: 0 28px 32px; }
.banner-eye   { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 8px; }
.banner-title { font-size: clamp(26px,4vw,44px); font-weight: 900; color: #fff; margin: 0 0 6px; letter-spacing: -1px; }
.banner-sub   { font-size: 14px; color: rgba(255,255,255,0.55); margin: 0; }

.page-inner { max-width: 1100px; margin: 0 auto; padding: 32px 24px 72px; }

/* Success */
.success-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 48px 40px; max-width: 560px; margin: 0 auto; text-align: center; }
.success-icon { width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 28px; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.success-card h2 { font-size: 24px; font-weight: 900; color: #1c1917; margin: 0 0 8px; }
.success-ref  { font-size: 14px; color: #78716c; margin: 0 0 16px; }
.success-ref strong { color: #d4a060; font-size: 18px; letter-spacing: 0.1em; }
.success-msg  { font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 24px; }
.success-detail { background: #faf7f2; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; text-align: left; display: flex; flex-direction: column; gap: 10px; }
.detail-row { display: flex; justify-content: space-between; font-size: 13px; }
.detail-row span:first-child { color: #a8a29e; }
.detail-row span:last-child  { font-weight: 700; color: #1c1917; }
.new-btn { background: #1c1917; color: #fff; border: none; border-radius: 10px; padding: 12px 28px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.new-btn:hover { background: #c8813a; }

/* Form layout */
.form-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
@media (max-width: 820px) { .form-layout { grid-template-columns: 1fr; } }

/* Form card */
.form-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 28px 28px 32px; display: flex; flex-direction: column; gap: 18px; }
.form-title { font-size: 18px; font-weight: 800; color: #1c1917; margin: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.opt { text-transform: none; font-weight: 500; color: #a8a29e; }
.input { padding: 11px 14px; border: 1.5px solid #e7e5e4; border-radius: 10px; font-size: 14px; outline: none; background: #faf7f2; color: #1c1917; transition: border-color 0.15s; width: 100%; box-sizing: border-box; }
.input:focus { border-color: #d4a060; background: #fff; }
.input.err  { border-color: #ef4444; }
.textarea   { resize: vertical; min-height: 80px; }
.err-msg    { font-size: 11px; color: #ef4444; }

/* Guests row */
.guests-row { display: flex; align-items: center; gap: 14px; }
.qty-btn { width: 36px; height: 36px; border: 1.5px solid #e7e5e4; border-radius: 9px; background: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.qty-btn:hover { border-color: #d4a060; background: #fdf3e7; }
.guests-num { font-size: 22px; font-weight: 900; color: #1c1917; min-width: 36px; text-align: center; }

/* Time grid */
.time-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.time-slot { border: 1.5px solid #e7e5e4; border-radius: 8px; background: #fff; padding: 7px 0; font-size: 12px; font-weight: 600; color: #57534e; cursor: pointer; transition: all 0.14s; text-align: center; }
.time-slot:hover { border-color: #c8813a; color: #c8813a; }
.time-slot.active { background: #1c1917; border-color: #1c1917; color: #fff; }

.submit-btn { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(200,129,58,0.3); margin-top: 4px; }
.submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,129,58,0.45); }

/* Info panel */
.info-panel { background: #fff; border: 1px solid #f0ebe4; border-radius: 20px; padding: 24px; position: sticky; top: 88px; display: flex; flex-direction: column; gap: 16px; }
.info-panel h3 { font-size: 15px; font-weight: 800; color: #1c1917; margin: 0 0 4px; }
.info-item { display: flex; align-items: flex-start; gap: 12px; }
.info-icon { font-size: 20px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #faf7f2; border-radius: 10px; flex-shrink: 0; }
.info-item strong { display: block; font-size: 13px; font-weight: 700; color: #1c1917; margin-bottom: 2px; }
.info-item p { font-size: 12px; color: #78716c; margin: 0; }
.policy-box { background: #fdf3e7; border-radius: 10px; padding: 14px; border: 1px solid rgba(212,160,96,0.2); }
.policy-box p { font-size: 12px; color: #92400e; margin: 0 0 4px; }
.policy-box p:last-child { margin: 0; color: #a8a29e; font-size: 11px; }
</style>