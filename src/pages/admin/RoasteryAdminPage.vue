<script setup lang="ts">
import { ref, computed } from 'vue'

type StageStatus = 'done' | 'active' | 'pending'
type RoastLevel  = 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark'
type GrinderStatus = 'active' | 'idle' | 'maintenance'

interface RoastStage {
  icon: string; label: string; detail: string; status: StageStatus
}
interface BeanType {
  name: string; origin: string; flag: string; roast: RoastLevel
  flavor: string[]; stockKg: number; batchActive: boolean
  temp: number; time: number; color: string
}
interface Grinder {
  id: string; model: string; bean: string; grindSize: string
  microns: number; outputKgHr: number; tempC: number
  status: GrinderStatus; hoursToday: number
}

const roastStages: RoastStage[] = [
  { icon: '🌱', label: 'Green Bean Intake',  detail: '3 origins received today', status: 'done'    },
  { icon: '🔍', label: 'Sorting & Grading',  detail: 'Defect removal — Grade 1', status: 'done'    },
  { icon: '🔥', label: 'Drum Roasting',       detail: '220 °C · 12 min batch',    status: 'active'  },
  { icon: '❄️', label: 'Cooling',             detail: 'Quench to 35 °C in 4 min', status: 'active'  },
  { icon: '💨', label: 'Degassing',           detail: 'Rest 48 h — CO₂ release',  status: 'pending' },
  { icon: '⚙️', label: 'Grinding',            detail: 'Grind to order — 4 lines', status: 'pending' },
  { icon: '📦', label: 'Packaging & Seal',    detail: 'One-way valve, N₂ flush',  status: 'pending' },
]

const beanTypes: BeanType[] = [
  { name: 'Ethiopian Yirgacheffe', origin: 'Gedeo Zone, Ethiopia',         flag: '🇪🇹', roast: 'Light',       flavor: ['Jasmine', 'Blueberry', 'Citrus', 'Tea-like'],           stockKg: 48, batchActive: true,  temp: 205, time: 10, color: '#c8813a' },
  { name: 'Colombian Supremo',     origin: 'Huila, Colombia',              flag: '🇨🇴', roast: 'Medium',      flavor: ['Caramel', 'Red Apple', 'Hazelnut', 'Smooth'],           stockKg: 72, batchActive: true,  temp: 218, time: 12, color: '#a05c2a' },
  { name: 'Kenya AA',              origin: 'Nyeri County, Kenya',          flag: '🇰🇪', roast: 'Medium-Light',flavor: ['Blackcurrant', 'Tomato', 'Wine', 'Bright'],             stockKg: 31, batchActive: false, temp: 210, time: 11, color: '#b8722e' },
  { name: 'Guatemala Antigua',     origin: 'Antigua Valley, Guatemala',    flag: '🇬🇹', roast: 'Medium',      flavor: ['Dark Chocolate', 'Brown Sugar', 'Spice', 'Velvety'],   stockKg: 55, batchActive: false, temp: 217, time: 13, color: '#9a5020' },
  { name: 'Sumatra Mandheling',    origin: 'North Sumatra, Indonesia',     flag: '🇮🇩', roast: 'Dark',        flavor: ['Earthy', 'Cedar', 'Dark Cocoa', 'Full Body'],          stockKg: 40, batchActive: true,  temp: 228, time: 14, color: '#7a3a10' },
  { name: 'Brazilian Santos',      origin: 'Minas Gerais, Brazil',         flag: '🇧🇷', roast: 'Medium-Dark', flavor: ['Milk Chocolate', 'Almond', 'Sweet', 'Low Acid'],       stockKg: 90, batchActive: false, temp: 222, time: 13, color: '#8a4518' },
  { name: 'Panama Geisha',         origin: 'Chiriquí, Panama',             flag: '🇵🇦', roast: 'Light',       flavor: ['Jasmine', 'Peach', 'Bergamot', 'Floral'],             stockKg: 18, batchActive: false, temp: 200, time: 9,  color: '#e0a845' },
  { name: 'Rwanda Bourbon',        origin: 'Western Province, Rwanda',     flag: '🇷🇼', roast: 'Medium-Light',flavor: ['Raspberry', 'Orange Zest', 'Caramel', 'Silky'],        stockKg: 28, batchActive: true,  temp: 212, time: 11, color: '#b57030' },
  { name: 'Yemen Mokha',           origin: 'Haraz Mountains, Yemen',       flag: '🇾🇪', roast: 'Medium-Dark', flavor: ['Wild Berry', 'Dark Chocolate', 'Wine', 'Spice'],       stockKg: 22, batchActive: false, temp: 224, time: 14, color: '#8a4520' },
  { name: 'Vietnam Robusta',       origin: 'Dak Lak Province, Vietnam',    flag: '🇻🇳', roast: 'Dark',        flavor: ['Bold', 'Earthy', 'Dark Tobacco', 'High Caffeine'],    stockKg: 65, batchActive: false, temp: 232, time: 15, color: '#6a2a08' },
  { name: 'Peru Organic',          origin: 'Junín Region, Peru',           flag: '🇵🇪', roast: 'Medium',      flavor: ['Honey', 'Pecan', 'Cocoa', 'Balanced'],                stockKg: 34, batchActive: false, temp: 216, time: 12, color: '#a05c28' },
  { name: 'Mexico Chiapas',        origin: 'Chiapas Highlands, Mexico',    flag: '🇲🇽', roast: 'Medium',      flavor: ['Brown Sugar', 'Walnut', 'Mild Acidity', 'Creamy'],    stockKg: 42, batchActive: false, temp: 215, time: 12, color: '#a86030' },
]

const roastLevelPct: Record<RoastLevel, number> = {
  'Light': 18, 'Medium-Light': 35, 'Medium': 52, 'Medium-Dark': 70, 'Dark': 88,
}

const grinders: Grinder[] = [
  { id: 'GR-01', model: 'Mahlkönig EK43S',    bean: 'Ethiopian Yirgacheffe', grindSize: 'Fine (Espresso)',          microns: 250,  outputKgHr: 18, tempC: 38, status: 'active',      hoursToday: 5.5 },
  { id: 'GR-02', model: 'Mahlkönig Peak',      bean: 'Colombian Supremo',     grindSize: 'Medium (Filter)',          microns: 700,  outputKgHr: 12, tempC: 34, status: 'active',      hoursToday: 4.0 },
  { id: 'GR-03', model: 'Ditting KR1203',      bean: 'Brazilian Santos',       grindSize: 'Coarse (Cafetière)',      microns: 1100, outputKgHr: 22, tempC: 36, status: 'idle',        hoursToday: 2.0 },
  { id: 'GR-04', model: 'Mahlkönig Guatemala', bean: 'Sumatra Mandheling',     grindSize: 'Fine+ (Ristretto)',       microns: 200,  outputKgHr: 15, tempC: 41, status: 'active',      hoursToday: 6.0 },
  { id: 'GR-05', model: 'Mahlkönig K30',       bean: 'Kenya AA',              grindSize: 'Medium-Fine (Aeropress)', microns: 550,  outputKgHr: 14, tempC: 33, status: 'active',      hoursToday: 3.5 },
  { id: 'GR-06', model: 'Ditting 804 Lab',     bean: 'Panama Geisha',         grindSize: 'Ultra Fine (Pour Over)',  microns: 400,  outputKgHr: 8,  tempC: 29, status: 'idle',        hoursToday: 0   },
  { id: 'GR-07', model: 'Anfim SP II',         bean: 'Rwanda Bourbon',        grindSize: 'Medium (V60)',            microns: 650,  outputKgHr: 10, tempC: 31, status: 'active',      hoursToday: 2.5 },
  { id: 'GR-08', model: 'Bunn G3',             bean: '—',                      grindSize: '—',                      microns: 0,    outputKgHr: 0,  tempC: 22, status: 'maintenance', hoursToday: 0   },
]

const grinderStatusColor: Record<GrinderStatus, string> = {
  active: '#10b981', idle: '#f59e0b', maintenance: '#ef4444',
}

const activeBatch = ref<BeanType | null>(beanTypes[0])

const totalGroundKg = grinders.reduce((s, g) => s + g.outputKgHr * g.hoursToday, 0)
const activeLines   = grinders.filter(g => g.status === 'active').length
const activeBatches = beanTypes.filter(b => b.batchActive).length
const totalStockKg  = beanTypes.reduce((s, b) => s + b.stockKg, 0)

// ── Roastery Period Analytics ──────────────────────────────────────────────
type RPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

interface RMetric { value: string; unit: string; change: string; positive: boolean; compLabel: string }
interface OriginBar { name: string; flag: string; kg: number; pct: number; color: string }
interface LevelBar  { level: string; pct: number; color: string }
interface RPeriodData {
  label: string
  kgRoasted: RMetric; batches: RMetric; groundKg: RMetric; revenue: RMetric; avgBatch: RMetric
  origins: OriginBar[]; levels: LevelBar[]
}

const RPERIODS: { key: RPeriod; label: string }[] = [
  { key: 'daily',   label: 'Daily'   },
  { key: 'weekly',  label: 'Weekly'  },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly',  label: 'Yearly'  },
]

const rPeriod = ref<RPeriod>('daily')

const rData: Record<RPeriod, RPeriodData> = {
  daily: {
    label: "Today's Analytics",
    kgRoasted: { value: '128',    unit: 'kg', change: '+12.4%', positive: true,  compLabel: 'vs yesterday'  },
    batches:   { value: '4',      unit: '',   change: '+1',     positive: true,  compLabel: 'vs yesterday'  },
    groundKg:  { value: '355',    unit: 'kg', change: '+8.6%',  positive: true,  compLabel: 'vs yesterday'  },
    revenue:   { value: '£1,840', unit: '',   change: '+14.2%', positive: true,  compLabel: 'vs yesterday'  },
    avgBatch:  { value: '32',     unit: 'kg', change: '+3.2%',  positive: true,  compLabel: 'vs yesterday'  },
    origins: [
      { name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', kg: 48,  pct: 38, color: '#c8813a' },
      { name: 'Colombian Supremo',     flag: '🇨🇴', kg: 35,  pct: 27, color: '#a05c2a' },
      { name: 'Sumatra Mandheling',    flag: '🇮🇩', kg: 22,  pct: 17, color: '#7a3a10' },
      { name: 'Rwanda Bourbon',        flag: '🇷🇼', kg: 15,  pct: 12, color: '#b57030' },
      { name: 'Kenya AA',              flag: '🇰🇪', kg: 8,   pct: 6,  color: '#b8722e' },
    ],
    levels: [
      { level: 'Light',       pct: 22, color: '#e0a845' },
      { level: 'Medium-Light',pct: 28, color: '#c8813a' },
      { level: 'Medium',      pct: 30, color: '#a05c2a' },
      { level: 'Medium-Dark', pct: 12, color: '#8a4518' },
      { level: 'Dark',        pct: 8,  color: '#6a2a08' },
    ],
  },
  weekly: {
    label: 'This Week',
    kgRoasted: { value: '892',     unit: 'kg', change: '+9.7%',  positive: true, compLabel: 'vs last week'  },
    batches:   { value: '28',      unit: '',   change: '+4',     positive: true, compLabel: 'vs last week'  },
    groundKg:  { value: '2,480',   unit: 'kg', change: '+11.2%', positive: true, compLabel: 'vs last week'  },
    revenue:   { value: '£12,600', unit: '',   change: '+13.8%', positive: true, compLabel: 'vs last week'  },
    avgBatch:  { value: '31.9',    unit: 'kg', change: '+0.3%',  positive: true, compLabel: 'vs last week'  },
    origins: [
      { name: 'Colombian Supremo',     flag: '🇨🇴', kg: 240, pct: 27, color: '#a05c2a' },
      { name: 'Brazilian Santos',      flag: '🇧🇷', kg: 210, pct: 24, color: '#8a4518' },
      { name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', kg: 185, pct: 21, color: '#c8813a' },
      { name: 'Vietnam Robusta',       flag: '🇻🇳', kg: 145, pct: 16, color: '#6a2a08' },
      { name: 'Sumatra Mandheling',    flag: '🇮🇩', kg: 112, pct: 13, color: '#7a3a10' },
    ],
    levels: [
      { level: 'Light',       pct: 18, color: '#e0a845' },
      { level: 'Medium-Light',pct: 30, color: '#c8813a' },
      { level: 'Medium',      pct: 34, color: '#a05c2a' },
      { level: 'Medium-Dark', pct: 12, color: '#8a4518' },
      { level: 'Dark',        pct: 6,  color: '#6a2a08' },
    ],
  },
  monthly: {
    label: 'This Month',
    kgRoasted: { value: '3,760',   unit: 'kg', change: '+18.4%', positive: true, compLabel: 'vs last month' },
    batches:   { value: '118',     unit: '',   change: '+22',    positive: true, compLabel: 'vs last month' },
    groundKg:  { value: '10,420',  unit: 'kg', change: '+16.8%', positive: true, compLabel: 'vs last month' },
    revenue:   { value: '£52,400', unit: '',   change: '+22.1%', positive: true, compLabel: 'vs last month' },
    avgBatch:  { value: '31.9',    unit: 'kg', change: '0.0%',   positive: true, compLabel: 'vs last month' },
    origins: [
      { name: 'Brazilian Santos',      flag: '🇧🇷', kg: 920,  pct: 24, color: '#8a4518' },
      { name: 'Colombian Supremo',     flag: '🇨🇴', kg: 850,  pct: 23, color: '#a05c2a' },
      { name: 'Vietnam Robusta',       flag: '🇻🇳', kg: 640,  pct: 17, color: '#6a2a08' },
      { name: 'Sumatra Mandheling',    flag: '🇮🇩', kg: 510,  pct: 14, color: '#7a3a10' },
      { name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', kg: 440,  pct: 12, color: '#c8813a' },
    ],
    levels: [
      { level: 'Light',       pct: 15, color: '#e0a845' },
      { level: 'Medium-Light',pct: 28, color: '#c8813a' },
      { level: 'Medium',      pct: 36, color: '#a05c2a' },
      { level: 'Medium-Dark', pct: 14, color: '#8a4518' },
      { level: 'Dark',        pct: 7,  color: '#6a2a08' },
    ],
  },
  yearly: {
    label: 'This Year',
    kgRoasted: { value: '44,200',   unit: 'kg', change: '+31.2%', positive: true, compLabel: 'vs last year' },
    batches:   { value: '1,420',    unit: '',   change: '+284',   positive: true, compLabel: 'vs last year' },
    groundKg:  { value: '124,800',  unit: 'kg', change: '+28.6%', positive: true, compLabel: 'vs last year' },
    revenue:   { value: '£624,000', unit: '',   change: '+35.4%', positive: true, compLabel: 'vs last year' },
    avgBatch:  { value: '31.1',     unit: 'kg', change: '+0.8%',  positive: true, compLabel: 'vs last year' },
    origins: [
      { name: 'Brazilian Santos',      flag: '🇧🇷', kg: 11200, pct: 25, color: '#8a4518' },
      { name: 'Colombian Supremo',     flag: '🇨🇴', kg: 9800,  pct: 22, color: '#a05c2a' },
      { name: 'Vietnam Robusta',       flag: '🇻🇳', kg: 7500,  pct: 17, color: '#6a2a08' },
      { name: 'Sumatra Mandheling',    flag: '🇮🇩', kg: 6200,  pct: 14, color: '#7a3a10' },
      { name: 'Ethiopian Yirgacheffe', flag: '🇪🇹', kg: 5100,  pct: 12, color: '#c8813a' },
    ],
    levels: [
      { level: 'Light',       pct: 14, color: '#e0a845' },
      { level: 'Medium-Light',pct: 26, color: '#c8813a' },
      { level: 'Medium',      pct: 38, color: '#a05c2a' },
      { level: 'Medium-Dark', pct: 15, color: '#8a4518' },
      { level: 'Dark',        pct: 7,  color: '#6a2a08' },
    ],
  },
}

const currentRData = computed(() => rData[rPeriod.value])
</script>

<template>
  <div class="rp">

    <!-- ── Page header ── -->
    <div class="page-hdr">
      <div>
        <h1 class="page-title">🏭 Roastery &amp; Grinder Room</h1>
        <p class="page-sub">Live process overview — batches, beans &amp; grinding operations</p>
      </div>
      <div class="live-badge"><span class="live-dot"></span> LIVE</div>
    </div>

    <!-- ── KPI row ── -->
    <div class="kpi-row">
      <div class="kpi">
        <div class="kpi-icon" style="background:rgba(16,185,129,0.1)">⚙️</div>
        <div>
          <div class="kpi-val">{{ activeLines }}<span class="kpi-denom">/{{ grinders.length }}</span></div>
          <div class="kpi-key">Grinders Active</div>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-icon" style="background:rgba(245,158,11,0.1)">🔥</div>
        <div>
          <div class="kpi-val">{{ activeBatches }}</div>
          <div class="kpi-key">Batches Roasting</div>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-icon" style="background:rgba(212,160,96,0.1)">☕</div>
        <div>
          <div class="kpi-val">{{ totalGroundKg.toFixed(0) }}<span class="kpi-unit"> kg</span></div>
          <div class="kpi-key">Ground Today</div>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-icon" style="background:rgba(59,130,246,0.1)">🌱</div>
        <div>
          <div class="kpi-val">{{ totalStockKg }}<span class="kpi-unit"> kg</span></div>
          <div class="kpi-key">Green Bean Stock</div>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-icon" style="background:rgba(139,92,246,0.1)">🌍</div>
        <div>
          <div class="kpi-val">{{ beanTypes.length }}</div>
          <div class="kpi-key">Origins Stocked</div>
        </div>
      </div>
    </div>

    <!-- ── Roastery Period Analytics ── -->
    <div class="ra-section">
      <div class="ra-header">
        <div class="ra-title-group">
          <span class="ra-title">📊 Roastery Performance Analytics</span>
          <span class="ra-subtitle">{{ currentRData.label }}</span>
        </div>
        <div class="ra-period-tabs">
          <button
            v-for="p in RPERIODS" :key="p.key"
            class="ra-tab" :class="{ active: rPeriod === p.key }"
            @click="rPeriod = p.key"
          >{{ p.label }}</button>
        </div>
      </div>

      <!-- 5 metric cards -->
      <div class="ra-metrics">
        <div class="ra-metric">
          <div class="ra-m-icon" style="background:rgba(212,160,96,.1)">🔥</div>
          <div class="ra-m-body">
            <div class="ra-m-val">{{ currentRData.kgRoasted.value }}<span class="ra-m-unit"> {{ currentRData.kgRoasted.unit }}</span></div>
            <div class="ra-m-key">Kg Roasted</div>
            <div class="ra-m-change" :class="currentRData.kgRoasted.positive ? 'pos' : 'neg'">
              {{ currentRData.kgRoasted.positive ? '▲' : '▼' }} {{ currentRData.kgRoasted.change }}
              <span class="ra-m-comp">{{ currentRData.kgRoasted.compLabel }}</span>
            </div>
          </div>
        </div>
        <div class="ra-metric">
          <div class="ra-m-icon" style="background:rgba(245,158,11,.1)">🏭</div>
          <div class="ra-m-body">
            <div class="ra-m-val">{{ currentRData.batches.value }}</div>
            <div class="ra-m-key">Batches Completed</div>
            <div class="ra-m-change" :class="currentRData.batches.positive ? 'pos' : 'neg'">
              {{ currentRData.batches.positive ? '▲' : '▼' }} {{ currentRData.batches.change }}
              <span class="ra-m-comp">{{ currentRData.batches.compLabel }}</span>
            </div>
          </div>
        </div>
        <div class="ra-metric">
          <div class="ra-m-icon" style="background:rgba(16,185,129,.1)">⚙️</div>
          <div class="ra-m-body">
            <div class="ra-m-val">{{ currentRData.groundKg.value }}<span class="ra-m-unit"> {{ currentRData.groundKg.unit }}</span></div>
            <div class="ra-m-key">Grinding Output</div>
            <div class="ra-m-change" :class="currentRData.groundKg.positive ? 'pos' : 'neg'">
              {{ currentRData.groundKg.positive ? '▲' : '▼' }} {{ currentRData.groundKg.change }}
              <span class="ra-m-comp">{{ currentRData.groundKg.compLabel }}</span>
            </div>
          </div>
        </div>
        <div class="ra-metric">
          <div class="ra-m-icon" style="background:rgba(139,92,246,.1)">💰</div>
          <div class="ra-m-body">
            <div class="ra-m-val">{{ currentRData.revenue.value }}</div>
            <div class="ra-m-key">Bean Sales Revenue</div>
            <div class="ra-m-change" :class="currentRData.revenue.positive ? 'pos' : 'neg'">
              {{ currentRData.revenue.positive ? '▲' : '▼' }} {{ currentRData.revenue.change }}
              <span class="ra-m-comp">{{ currentRData.revenue.compLabel }}</span>
            </div>
          </div>
        </div>
        <div class="ra-metric">
          <div class="ra-m-icon" style="background:rgba(59,130,246,.1)">📦</div>
          <div class="ra-m-body">
            <div class="ra-m-val">{{ currentRData.avgBatch.value }}<span class="ra-m-unit"> {{ currentRData.avgBatch.unit }}</span></div>
            <div class="ra-m-key">Avg. Batch Size</div>
            <div class="ra-m-change" :class="currentRData.avgBatch.positive ? 'pos' : 'neg'">
              {{ currentRData.avgBatch.positive ? '▲' : '▼' }} {{ currentRData.avgBatch.change }}
              <span class="ra-m-comp">{{ currentRData.avgBatch.compLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="ra-charts">
        <div class="ra-chart-panel">
          <div class="ra-chart-title">Top Origins by Volume</div>
          <div class="ra-origins">
            <div v-for="o in currentRData.origins" :key="o.name" class="ra-origin-row">
              <div class="ra-origin-label">
                <span class="ra-origin-flag">{{ o.flag }}</span>
                <span class="ra-origin-name">{{ o.name }}</span>
                <span class="ra-origin-kg">{{ o.kg >= 1000 ? (o.kg / 1000).toFixed(1) + 't' : o.kg + ' kg' }}</span>
              </div>
              <div class="ra-origin-bar-bg">
                <div class="ra-origin-bar" :style="{ width: o.pct + '%', background: o.color }"></div>
              </div>
              <span class="ra-origin-pct">{{ o.pct }}%</span>
            </div>
          </div>
        </div>

        <div class="ra-chart-panel">
          <div class="ra-chart-title">Roast Level Distribution</div>
          <div class="ra-level-stack">
            <div class="ra-level-bar-row">
              <div
                v-for="l in currentRData.levels" :key="l.level"
                class="ra-level-seg"
                :style="{ width: l.pct + '%', background: l.color }"
                :title="l.level + ': ' + l.pct + '%'"
              ></div>
            </div>
            <div class="ra-level-legend">
              <div v-for="l in currentRData.levels" :key="l.level" class="ra-level-leg-item">
                <span class="ra-level-dot" :style="{ background: l.color }"></span>
                <span class="ra-level-text">{{ l.level }}</span>
                <span class="ra-level-pct">{{ l.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Roasting Pipeline ── -->
    <div class="process-panel">
      <div class="process-label">Roasting Pipeline — Today's Status</div>
      <div class="pipeline-track">
        <div v-for="(stage, i) in roastStages" :key="i" class="pipe-stage">
          <div v-if="i > 0" class="pipe-connector" :class="roastStages[i - 1].status"></div>
          <div class="pipe-node" :class="stage.status">
            <div class="pipe-icon">{{ stage.icon }}</div>
            <div v-if="stage.status === 'active'" class="pipe-pulse"></div>
          </div>
          <div class="pipe-label">{{ stage.label }}</div>
          <div class="pipe-detail">{{ stage.detail }}</div>
        </div>
      </div>
      <div class="pipeline-legend">
        <span class="legend-item done">✓ Complete</span>
        <span class="legend-item active">⊙ In Progress</span>
        <span class="legend-item pending">○ Pending</span>
      </div>
    </div>

    <!-- ── Body: beans + grinders ── -->
    <div class="roastery-body">

      <!-- Bean Origins -->
      <div class="section-block">
        <div class="block-hdr">
          <span class="block-title">☕ Bean Origins &amp; Roast Profiles</span>
          <span class="block-count">{{ beanTypes.length }} origins</span>
        </div>
        <div class="bean-list">
          <div
            v-for="bean in beanTypes" :key="bean.name"
            class="bean-card" :class="{ 'bean-active': activeBatch?.name === bean.name }"
            @click="activeBatch = activeBatch?.name === bean.name ? null : bean"
          >
            <div class="bean-head">
              <div class="bean-flag">{{ bean.flag }}</div>
              <div class="bean-info">
                <div class="bean-name">{{ bean.name }}</div>
                <div class="bean-origin">{{ bean.origin }}</div>
              </div>
              <div class="bean-badges">
                <span v-if="bean.batchActive" class="batch-badge">Roasting</span>
                <span class="stock-badge" :class="bean.stockKg < 40 ? 'low' : 'ok'">{{ bean.stockKg }} kg</span>
              </div>
            </div>

            <div class="roast-level-row">
              <span class="roast-lvl-label">{{ bean.roast }}</span>
              <div class="roast-bar-bg">
                <div class="roast-bar" :style="{ width: roastLevelPct[bean.roast] + '%', background: bean.color }"></div>
              </div>
            </div>

            <div class="flavor-tags">
              <span v-for="f in bean.flavor" :key="f" class="flavor-tag">{{ f }}</span>
            </div>

            <Transition name="expand">
              <div v-if="activeBatch?.name === bean.name" class="roast-params">
                <div class="param"><span class="param-key">Peak Temp</span><span class="param-val">{{ bean.temp }} °C</span></div>
                <div class="param"><span class="param-key">Roast Time</span><span class="param-val">{{ bean.time }} min</span></div>
                <div class="param"><span class="param-key">Drop Temp</span><span class="param-val">{{ bean.temp - 15 }} °C</span></div>
                <div class="param"><span class="param-key">Charge Temp</span><span class="param-val">{{ bean.temp - 70 }} °C</span></div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Grinder Room -->
      <div class="section-block">
        <div class="block-hdr">
          <span class="block-title">⚙️ Grinder Room</span>
          <span class="block-count">{{ activeLines }}/{{ grinders.length }} active</span>
        </div>

        <div class="grinder-list">
          <div v-for="g in grinders" :key="g.id" class="grinder-card" :class="g.status">
            <div class="gr-top">
              <div class="gr-id">{{ g.id }}</div>
              <span class="gr-status" :style="{ background: grinderStatusColor[g.status] + '22', color: grinderStatusColor[g.status] }">
                <span class="gr-dot" :style="{ background: grinderStatusColor[g.status] }"></span>
                {{ g.status }}
              </span>
            </div>
            <div class="gr-model">{{ g.model }}</div>
            <div class="gr-bean">{{ g.bean }}</div>
            <div class="gr-specs">
              <div class="gr-spec">
                <div class="gr-spec-v">{{ g.microns > 0 ? g.microns + ' µm' : '—' }}</div>
                <div class="gr-spec-k">Particle</div>
              </div>
              <div class="gr-spec">
                <div class="gr-spec-v">{{ g.outputKgHr > 0 ? g.outputKgHr + ' kg/h' : '—' }}</div>
                <div class="gr-spec-k">Output</div>
              </div>
              <div class="gr-spec">
                <div class="gr-spec-v">{{ g.tempC }} °C</div>
                <div class="gr-spec-k">Burr Temp</div>
              </div>
              <div class="gr-spec">
                <div class="gr-spec-v">{{ g.hoursToday > 0 ? g.hoursToday + ' h' : '—' }}</div>
                <div class="gr-spec-k">Run Today</div>
              </div>
            </div>
            <div v-if="g.status !== 'maintenance'" class="gr-grind-size">
              <span class="gr-size-icon">⚙</span> {{ g.grindSize }}
            </div>
            <div v-else class="gr-maintenance-note">⚠ Scheduled maintenance — burr replacement</div>
          </div>
        </div>

        <!-- Daily output summary -->
        <div class="output-summary">
          <div class="output-title">Today's Output</div>
          <div class="output-stats">
            <div class="out-stat">
              <div class="out-val">{{ totalGroundKg.toFixed(0) }} kg</div>
              <div class="out-key">Total Ground</div>
            </div>
            <div class="out-stat">
              <div class="out-val">{{ activeLines }}</div>
              <div class="out-key">Lines Running</div>
            </div>
            <div class="out-stat">
              <div class="out-val">{{ activeBatches }}</div>
              <div class="out-key">Active Batches</div>
            </div>
            <div class="out-stat">
              <div class="out-val">{{ totalStockKg }} kg</div>
              <div class="out-key">Green Bean Stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rp { display: flex; flex-direction: column; gap: 22px; }

/* ── Page header ── */
.page-hdr {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}
.page-title { font-size: 22px; font-weight: 800; color: #1c1917; margin: 0 0 4px; }
.page-sub   { font-size: 13px; color: #a8a29e; margin: 0; }

.live-badge {
  display: flex; align-items: center; gap: 6px;
  background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 20px;
  padding: 5px 12px; font-size: 11px; font-weight: 800; color: #065f46; white-space: nowrap;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #10b981;
  animation: pulse-live 1.4s ease-in-out infinite;
}
@keyframes pulse-live { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.75); } }

/* ── KPI row ── */
.kpi-row {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;
}
@media (max-width: 1100px) { .kpi-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px)  { .kpi-row { grid-template-columns: repeat(2, 1fr); } }

.kpi {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 12px;
  padding: 16px; display: flex; align-items: center; gap: 14px;
  box-shadow: 0 1px 4px rgba(44,16,8,.06);
}
.kpi-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.kpi-val  { font-size: 24px; font-weight: 800; color: #1c1917; letter-spacing: -0.5px; line-height: 1; }
.kpi-denom { font-size: 14px; font-weight: 600; color: #a8a29e; }
.kpi-unit  { font-size: 14px; font-weight: 600; color: #a8a29e; }
.kpi-key  { font-size: 11px; color: #a8a29e; font-weight: 600; margin-top: 3px; text-transform: uppercase; letter-spacing: .04em; }

/* ── Pipeline ── */
.process-panel {
  background: #1c1917; border-radius: 14px; padding: 24px 28px; border: 1px solid #2d2825;
}
.process-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #78716c; margin-bottom: 24px; }

.pipeline-track {
  display: flex; align-items: flex-start; gap: 0;
  overflow-x: auto; padding-bottom: 4px;
}
.pipe-stage {
  display: flex; flex-direction: column; align-items: center;
  flex: 1; min-width: 90px; position: relative; padding-top: 4px;
}
.pipe-connector {
  position: absolute; top: 20px; right: 50%; width: 100%;
  height: 2px; background: #3a3430;
}
.pipe-connector.done   { background: #d4a060; }
.pipe-connector.active { background: linear-gradient(90deg, #d4a060, #f59e0b); }

.pipe-node {
  width: 40px; height: 40px; border-radius: 50%; border: 2px solid #3a3430;
  display: flex; align-items: center; justify-content: center;
  background: #231f1c; position: relative; z-index: 2; transition: all .3s;
}
.pipe-node.done    { border-color: #d4a060; background: rgba(212,160,96,.15); }
.pipe-node.active  { border-color: #f59e0b; background: rgba(245,158,11,.2); box-shadow: 0 0 0 6px rgba(245,158,11,.12); }
.pipe-node.pending { opacity: .5; }
.pipe-icon { font-size: 17px; line-height: 1; }

.pipe-pulse {
  position: absolute; inset: -6px; border-radius: 50%;
  border: 2px solid #f59e0b; opacity: 0;
  animation: pipe-ring 1.6s ease-out infinite;
}
@keyframes pipe-ring { 0% { opacity:.7; transform:scale(.8); } 100% { opacity:0; transform:scale(1.5); } }

.pipe-label  { font-size: 11px; font-weight: 700; color: #fdf6ec; margin-top: 10px; text-align: center; line-height: 1.3; }
.pipe-detail { font-size: 10px; color: #78716c; text-align: center; margin-top: 3px; line-height: 1.3; padding: 0 4px; }

.pipeline-legend {
  display: flex; gap: 20px; margin-top: 22px; justify-content: center;
}
.legend-item { font-size: 11px; font-weight: 600; }
.legend-item.done    { color: #d4a060; }
.legend-item.active  { color: #f59e0b; }
.legend-item.pending { color: #44403c; }

/* ── Body ── */
.roastery-body {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
}
@media (max-width: 1100px) { .roastery-body { grid-template-columns: 1fr; } }

.section-block { display: flex; flex-direction: column; }

.block-hdr {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
}
.block-title { font-size: 14px; font-weight: 700; color: #1c1917; }
.block-count { font-size: 12px; color: #a8a29e; font-weight: 600; }

/* ── Bean cards ── */
.bean-list { display: flex; flex-direction: column; gap: 10px; }

.bean-card {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 12px;
  padding: 14px 16px; cursor: pointer; transition: all .2s;
}
.bean-card:hover       { border-color: #d4a060; box-shadow: 0 2px 10px rgba(212,160,96,.12); }
.bean-card.bean-active { border-color: #d4a060; background: #fffbf5; box-shadow: 0 4px 16px rgba(212,160,96,.15); }

.bean-head   { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.bean-flag   { font-size: 24px; flex-shrink: 0; }
.bean-info   { flex: 1; min-width: 0; }
.bean-name   { font-size: 13px; font-weight: 700; color: #1c1917; }
.bean-origin { font-size: 11px; color: #a8a29e; margin-top: 1px; }

.bean-badges  { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
.batch-badge  { background: rgba(245,158,11,.12); color: #d97706; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 700; white-space: nowrap; }
.stock-badge  { border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 700; }
.stock-badge.ok  { background: #d1fae5; color: #065f46; }
.stock-badge.low { background: #fef3c7; color: #92400e; }

.roast-level-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.roast-lvl-label { font-size: 11px; font-weight: 700; color: #78716c; width: 90px; flex-shrink: 0; }
.roast-bar-bg    { flex: 1; height: 6px; background: #f5f0ea; border-radius: 4px; overflow: hidden; }
.roast-bar       { height: 100%; border-radius: 4px; transition: width .6s ease; }

.flavor-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.flavor-tag  { background: #fdf3e7; color: #92400e; border-radius: 20px; padding: 2px 9px; font-size: 10px; font-weight: 600; }

.roast-params {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0ebe4;
}
.param     { display: flex; flex-direction: column; align-items: center; }
.param-key { font-size: 10px; color: #a8a29e; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
.param-val { font-size: 14px; font-weight: 800; color: #1c1917; margin-top: 2px; }

.expand-enter-active, .expand-leave-active { transition: all .25s ease; max-height: 80px; overflow: hidden; }
.expand-enter-from, .expand-leave-to       { opacity: 0; max-height: 0; }

/* ── Grinder cards ── */
.grinder-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }

.grinder-card {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 12px;
  padding: 14px 16px; transition: box-shadow .2s;
}
.grinder-card.active      { border-left: 3px solid #10b981; }
.grinder-card.idle        { border-left: 3px solid #f59e0b; }
.grinder-card.maintenance { border-left: 3px solid #ef4444; opacity: .75; }

.gr-top   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.gr-id    { font-size: 11px; font-weight: 700; color: #a8a29e; font-family: monospace; }
.gr-status { display: flex; align-items: center; gap: 5px; border-radius: 20px; padding: 2px 9px; font-size: 10px; font-weight: 700; text-transform: capitalize; }
.gr-dot   { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.gr-model { font-size: 14px; font-weight: 700; color: #1c1917; margin-bottom: 2px; }
.gr-bean  { font-size: 12px; color: #78716c; margin-bottom: 10px; }

.gr-specs  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
.gr-spec   { text-align: center; }
.gr-spec-v { font-size: 13px; font-weight: 800; color: #1c1917; }
.gr-spec-k { font-size: 10px; color: #a8a29e; font-weight: 500; }

.gr-grind-size      { font-size: 11px; color: #78716c; font-weight: 600; }
.gr-maintenance-note { font-size: 11px; color: #ef4444; font-weight: 600; }

/* ── Output summary ── */
.output-summary { background: #1c1917; border-radius: 12px; padding: 16px 18px; }
.output-title   { font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.output-stats   { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.out-stat { text-align: center; }
.out-val  { font-size: 18px; font-weight: 800; color: #d4a060; }
.out-key  { font-size: 10px; color: #78716c; font-weight: 600; margin-top: 2px; }

/* ── Roastery Period Analytics ── */
.ra-section {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 16px;
  padding: 22px 24px; display: flex; flex-direction: column; gap: 20px;
  box-shadow: 0 1px 4px rgba(44,16,8,.06);
}

.ra-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.ra-title-group { display: flex; flex-direction: column; gap: 3px; }
.ra-title    { font-size: 15px; font-weight: 800; color: #1c1917; }
.ra-subtitle { font-size: 12px; color: #a8a29e; font-weight: 600; }

.ra-period-tabs { display: flex; background: #f5f0ea; border-radius: 10px; padding: 3px; gap: 2px; }
.ra-tab {
  padding: 6px 16px; border-radius: 7px; border: none; background: transparent;
  font-size: 12px; font-weight: 600; color: #78716c; cursor: pointer; transition: all .18s;
}
.ra-tab.active { background: #d4a060; color: #fff; box-shadow: 0 1px 4px rgba(212,160,96,.35); }
.ra-tab:hover:not(.active) { background: rgba(212,160,96,.15); color: #92400e; }

.ra-metrics {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;
}
@media (max-width: 1100px) { .ra-metrics { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px)  { .ra-metrics { grid-template-columns: repeat(2, 1fr); } }

.ra-metric {
  background: #fafaf9; border: 1px solid #f0ebe4; border-radius: 12px;
  padding: 14px; display: flex; align-items: flex-start; gap: 12px;
}
.ra-m-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.ra-m-body { flex: 1; min-width: 0; }
.ra-m-val  { font-size: 20px; font-weight: 800; color: #1c1917; line-height: 1; }
.ra-m-unit { font-size: 12px; font-weight: 600; color: #a8a29e; }
.ra-m-key  { font-size: 10px; font-weight: 700; color: #a8a29e; text-transform: uppercase; letter-spacing: .04em; margin: 3px 0 4px; }
.ra-m-change { font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.ra-m-change.pos { color: #059669; }
.ra-m-change.neg { color: #dc2626; }
.ra-m-comp { font-size: 10px; font-weight: 500; color: #a8a29e; }

.ra-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 800px) { .ra-charts { grid-template-columns: 1fr; } }

.ra-chart-panel { background: #fafaf9; border: 1px solid #f0ebe4; border-radius: 12px; padding: 16px 18px; }
.ra-chart-title {
  font-size: 11px; font-weight: 700; color: #78716c;
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: 14px;
}

.ra-origins { display: flex; flex-direction: column; gap: 11px; }
.ra-origin-row { display: flex; align-items: center; gap: 8px; }
.ra-origin-label { display: flex; align-items: center; gap: 6px; width: 175px; flex-shrink: 0; }
.ra-origin-flag  { font-size: 15px; }
.ra-origin-name  { font-size: 11px; font-weight: 600; color: #44403c; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ra-origin-kg    { font-size: 11px; font-weight: 700; color: #78716c; flex-shrink: 0; }
.ra-origin-bar-bg { flex: 1; height: 8px; background: #f0ebe4; border-radius: 6px; overflow: hidden; }
.ra-origin-bar    { height: 100%; border-radius: 6px; transition: width .5s ease; }
.ra-origin-pct    { font-size: 11px; font-weight: 700; color: #1c1917; width: 30px; text-align: right; flex-shrink: 0; }

.ra-level-stack { display: flex; flex-direction: column; gap: 16px; }
.ra-level-bar-row { display: flex; height: 28px; border-radius: 8px; overflow: hidden; gap: 2px; }
.ra-level-seg  { height: 100%; transition: width .5s ease; }
.ra-level-legend { display: flex; flex-direction: column; gap: 9px; }
.ra-level-leg-item { display: flex; align-items: center; gap: 8px; }
.ra-level-dot  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.ra-level-text { font-size: 12px; font-weight: 600; color: #44403c; flex: 1; }
.ra-level-pct  { font-size: 12px; font-weight: 700; color: #1c1917; }
</style>