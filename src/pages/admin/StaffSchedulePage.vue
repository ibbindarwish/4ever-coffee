<script setup lang="ts">
import { ref, computed } from 'vue'

type Shift = 'morning' | 'afternoon' | 'evening' | 'off'

interface StaffMember {
  id: number
  name: string
  role: string
  avatar: string
  schedule: Record<string, Shift>
  isDelivery?: boolean
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SHIFT_META: Record<Shift, { label: string; time: string; color: string; bg: string }> = {
  morning:   { label: 'Morning',   time: '07:00–14:00', color: '#d97706', bg: '#fef3c7' },
  afternoon: { label: 'Afternoon', time: '12:00–19:00', color: '#2563eb', bg: '#dbeafe' },
  evening:   { label: 'Evening',   time: '17:00–22:00', color: '#7c3aed', bg: '#ede9fe' },
  off:       { label: 'Day Off',   time: '—',           color: '#a8a29e', bg: '#f5f5f4' },
}

const SHIFTS: Shift[] = ['morning', 'afternoon', 'evening', 'off']

const staff = ref<StaffMember[]>([
  { id: 1, name: 'Sara Ahmed',    role: 'Head Barista',  avatar: 'S', schedule: { Mon: 'morning', Tue: 'morning', Wed: 'off', Thu: 'morning', Fri: 'morning', Sat: 'afternoon', Sun: 'off' } },
  { id: 2, name: 'James Khan',    role: 'Barista',       avatar: 'J', schedule: { Mon: 'afternoon', Tue: 'off', Wed: 'afternoon', Thu: 'afternoon', Fri: 'afternoon', Sat: 'morning', Sun: 'morning' } },
  { id: 3, name: 'Nour Malik',    role: 'Cashier',       avatar: 'N', schedule: { Mon: 'morning', Tue: 'morning', Wed: 'morning', Thu: 'off', Fri: 'morning', Sat: 'morning', Sun: 'afternoon' } },
  { id: 4, name: 'Tom Brooks',    role: 'Barista',       avatar: 'T', schedule: { Mon: 'evening', Tue: 'evening', Wed: 'afternoon', Thu: 'evening', Fri: 'evening', Sat: 'off', Sun: 'morning' } },
  { id: 5, name: 'Layla Hassan',  role: 'Supervisor',    avatar: 'L', schedule: { Mon: 'morning', Tue: 'afternoon', Wed: 'morning', Thu: 'afternoon', Fri: 'morning', Sat: 'morning', Sun: 'off' } },
  { id: 6, name: 'Ahmed Siddiq',  role: 'Barista',       avatar: 'A', schedule: { Mon: 'off', Tue: 'morning', Wed: 'evening', Thu: 'morning', Fri: 'off', Sat: 'evening', Sun: 'evening' } },
  { id: 7, name: 'Priya Nair',    role: 'Kitchen Staff', avatar: 'P', schedule: { Mon: 'afternoon', Tue: 'morning', Wed: 'morning', Thu: 'morning', Fri: 'afternoon', Sat: 'afternoon', Sun: 'afternoon' } },
  { id: 8, name: 'Omar Khalid',   role: 'Delivery Driver', avatar: 'O', isDelivery: true, schedule: { Mon: 'afternoon', Tue: 'afternoon', Wed: 'afternoon', Thu: 'off', Fri: 'afternoon', Sat: 'evening', Sun: 'evening' } },
  { id: 9, name: 'Ryan Mitchell', role: 'Delivery Driver', avatar: 'R', isDelivery: true, schedule: { Mon: 'off', Tue: 'evening', Wed: 'evening', Thu: 'afternoon', Fri: 'evening', Sat: 'afternoon', Sun: 'afternoon' } },
])

const editCell = ref<{ staffId: number; day: string } | null>(null)

function startEdit(staffId: number, day: string) {
  editCell.value = { staffId, day }
}

function setShift(staffId: number, day: string, shift: Shift) {
  const member = staff.value.find(s => s.id === staffId)
  if (member) member.schedule[day] = shift
  editCell.value = null
}

const dayStats = computed(() => DAYS.map(day => ({
  day,
  morning:   staff.value.filter(s => s.schedule[day] === 'morning').length,
  afternoon: staff.value.filter(s => s.schedule[day] === 'afternoon').length,
  evening:   staff.value.filter(s => s.schedule[day] === 'evening').length,
  off:       staff.value.filter(s => s.schedule[day] === 'off').length,
})))

const weeklyHours = computed(() => staff.value.map(s => ({
  ...s,
  hours: DAYS.filter(d => s.schedule[d] !== 'off').length * 7,
  workDays: DAYS.filter(d => s.schedule[d] !== 'off').length,
})))
</script>

<template>
  <div class="page">

    <!-- Header -->
    <div class="page-hdr">
      <div>
        <h1 class="page-title">Staff Schedule</h1>
        <p class="page-sub">Weekly roster — click any shift to edit</p>
      </div>
      <div class="legend">
        <div v-for="(meta, shift) in SHIFT_META" :key="shift" class="legend-item">
          <span class="legend-dot" :style="{ background: meta.color }"></span>
          {{ meta.label }} <span class="legend-time">{{ meta.time }}</span>
        </div>
      </div>
    </div>

    <!-- Schedule grid -->
    <div class="panel">
      <table class="sched-table">
        <thead>
          <tr>
            <th class="staff-col">Team Member</th>
            <th v-for="day in DAYS" :key="day" class="day-col">{{ day }}</th>
            <th class="hrs-col">Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in weeklyHours" :key="member.id" :class="{ 'delivery-row': member.isDelivery }">
            <td>
              <div class="staff-cell">
                <div class="staff-avatar" :class="{ 'delivery-avatar': member.isDelivery }">{{ member.avatar }}</div>
                <div>
                  <div class="staff-name">{{ member.name }}</div>
                  <div class="staff-role">
                    <span v-if="member.isDelivery" class="delivery-badge">🛵 Delivery</span>
                    <span v-else>{{ member.role }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td v-for="day in DAYS" :key="day" class="shift-td"
              @click="startEdit(member.id, day)">
              <!-- Edit popover -->
              <div v-if="editCell?.staffId === member.id && editCell?.day === day"
                class="shift-picker" @click.stop>
                <button v-for="s in SHIFTS" :key="s"
                  class="pick-btn"
                  :class="{ current: member.schedule[day] === s }"
                  :style="{ background: SHIFT_META[s].bg, color: SHIFT_META[s].color }"
                  @click="setShift(member.id, day, s)">
                  {{ SHIFT_META[s].label }}
                </button>
                <button class="pick-cancel" @click="editCell = null">✕</button>
              </div>

              <!-- Shift pill -->
              <span v-else class="shift-pill"
                :style="{ background: SHIFT_META[member.schedule[day]].bg, color: SHIFT_META[member.schedule[day]].color }">
                {{ SHIFT_META[member.schedule[day]].label }}
              </span>
            </td>
            <td class="hrs-td">
              <span class="hrs-val">{{ member.hours }}h</span>
              <span class="hrs-days">{{ member.workDays }}d</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Day coverage stats -->
    <div class="stats-section">
      <h3 class="stats-title">Daily Coverage</h3>
      <div class="stats-grid">
        <div v-for="stat in dayStats" :key="stat.day" class="stat-card">
          <div class="stat-day">{{ stat.day }}</div>
          <div class="coverage-bars">
            <div class="cov-row">
              <span class="cov-label" style="color:#d97706">Morning</span>
              <div class="cov-bar"><div class="cov-fill" :style="{ width: (stat.morning / staff.length * 100) + '%', background: '#d97706' }"></div></div>
              <span class="cov-num">{{ stat.morning }}</span>
            </div>
            <div class="cov-row">
              <span class="cov-label" style="color:#2563eb">Afternoon</span>
              <div class="cov-bar"><div class="cov-fill" :style="{ width: (stat.afternoon / staff.length * 100) + '%', background: '#2563eb' }"></div></div>
              <span class="cov-num">{{ stat.afternoon }}</span>
            </div>
            <div class="cov-row">
              <span class="cov-label" style="color:#7c3aed">Evening</span>
              <div class="cov-bar"><div class="cov-fill" :style="{ width: (stat.evening / staff.length * 100) + '%', background: '#7c3aed' }"></div></div>
              <span class="cov-num">{{ stat.evening }}</span>
            </div>
          </div>
          <div class="stat-total">{{ stat.off }} day{{ stat.off !== 1 ? 's' : '' }} off</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

.page-hdr  { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-title { font-size: 22px; font-weight: 900; color: #1c1917; margin: 0 0 4px; }
.page-sub   { font-size: 13px; color: #a8a29e; margin: 0; }

.legend { display: flex; flex-wrap: wrap; gap: 12px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #57534e; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-time { color: #a8a29e; font-size: 11px; }

.panel { background: #fff; border-radius: 14px; border: 1px solid #f0ebe4; overflow: auto; }
.sched-table { width: 100%; border-collapse: collapse; min-width: 820px; }
.sched-table th { padding: 12px 10px; font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #f0ebe4; text-align: left; }
.sched-table td { padding: 10px; border-bottom: 1px solid #faf7f2; vertical-align: middle; }
.sched-table tr:last-child td { border-bottom: none; }
.delivery-row td { background: #f0f9ff; }
.delivery-row:hover td { background: #e0f2fe !important; }

.staff-col { width: 200px; }
.day-col   { width: 96px; text-align: center; }
.hrs-col   { width: 72px; text-align: center; }

.staff-cell   { display: flex; align-items: center; gap: 10px; }
.staff-avatar { width: 34px; height: 34px; border-radius: 50%; background: #d4a060; color: #fff; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.delivery-avatar { background: #0ea5e9; }
.staff-name   { font-size: 13px; font-weight: 700; color: #1c1917; }
.staff-role   { font-size: 11px; color: #a8a29e; }
.delivery-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700; background: #e0f2fe; color: #0369a1; border-radius: 6px; padding: 2px 7px; }

.shift-td { position: relative; text-align: center; cursor: pointer; }
.shift-pill { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; transition: opacity 0.15s; white-space: nowrap; }
.shift-td:hover .shift-pill { opacity: 0.75; }

.shift-picker {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  background: #fff; border: 1px solid #e7e5e4; border-radius: 12px;
  padding: 8px; z-index: 100;
  box-shadow: 0 8px 28px rgba(0,0,0,0.14);
  display: flex; flex-direction: column; gap: 4px; min-width: 120px;
}
.pick-btn { padding: 7px 12px; border-radius: 8px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: opacity 0.12s; text-align: left; }
.pick-btn:hover { opacity: 0.8; }
.pick-btn.current { outline: 2px solid currentColor; outline-offset: -2px; }
.pick-cancel { background: none; border: none; font-size: 12px; color: #a8a29e; cursor: pointer; padding: 4px; text-align: center; margin-top: 2px; }

.hrs-td   { text-align: center; }
.hrs-val  { display: block; font-size: 15px; font-weight: 900; color: #1c1917; }
.hrs-days { font-size: 10px; color: #a8a29e; }

/* Coverage stats */
.stats-section { background: #fff; border-radius: 14px; border: 1px solid #f0ebe4; padding: 20px 22px; }
.stats-title { font-size: 15px; font-weight: 800; color: #1c1917; margin: 0 0 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
.stat-card { background: #faf7f2; border-radius: 10px; padding: 12px 10px; }
.stat-day  { font-size: 13px; font-weight: 800; color: #1c1917; margin-bottom: 10px; text-align: center; }
.coverage-bars { display: flex; flex-direction: column; gap: 5px; }
.cov-row   { display: flex; align-items: center; gap: 4px; }
.cov-label { font-size: 9px; font-weight: 700; min-width: 54px; }
.cov-bar   { flex: 1; height: 4px; background: #e7e5e4; border-radius: 99px; overflow: hidden; }
.cov-fill  { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
.cov-num   { font-size: 10px; font-weight: 700; color: #57534e; min-width: 12px; text-align: right; }
.stat-total { font-size: 10px; color: #a8a29e; text-align: center; margin-top: 8px; }
</style>