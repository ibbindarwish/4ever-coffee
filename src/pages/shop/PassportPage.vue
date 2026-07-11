<script setup lang="ts">
import { usePassportStore } from '../../stores/passport'

const ps = usePassportStore()

const CONTINENT_ICONS: Record<string, string> = {
  Africa: '🌍', Americas: '🌎', Asia: '🌏', 'Middle East': '🕌', Oceania: '🏝️'
}
</script>

<template>
  <div class="pp-page">
    <div class="pp-hero">
      <p class="pp-eyebrow">Your Journey</p>
      <h1 class="pp-headline">Coffee Passport</h1>
      <p class="pp-sub">Every bean you try stamps a new country. Collect them all.</p>
      <div class="pp-stats">
        <div class="pp-stat"><span class="pp-stat-num">{{ ps.totalCountries }}</span><span class="pp-stat-label">Countries</span></div>
        <div class="pp-stat-div"></div>
        <div class="pp-stat"><span class="pp-stat-num">{{ ps.visitedContinents.length }}</span><span class="pp-stat-label">Continents</span></div>
        <div class="pp-stat-div"></div>
        <div class="pp-stat"><span class="pp-stat-num">{{ ps.allContinentsComplete ? '✓' : '—' }}</span><span class="pp-stat-label">All Complete</span></div>
      </div>
    </div>

    <div class="pp-body">
      <!-- Stamp Grid -->
      <section class="pp-section">
        <h2 class="pp-section-title">Your Stamps</h2>
        <div class="stamp-grid">
          <div v-for="stamp in ps.stamps" :key="stamp.country" class="stamp-card">
            <div class="stamp-flag">{{ stamp.flag }}</div>
            <div class="stamp-country">{{ stamp.country }}</div>
            <div class="stamp-bean">{{ stamp.bean }}</div>
            <div class="stamp-date">{{ stamp.date }}</div>
            <div class="stamp-continent">{{ stamp.continent }}</div>
          </div>
          <!-- Add more placeholder -->
          <div class="stamp-card stamp-empty">
            <div class="stamp-plus">+</div>
            <div class="stamp-empty-text">Buy a new origin<br/>to earn your next stamp</div>
            <RouterLink to="/shop/menu" class="stamp-shop-link">Shop Beans →</RouterLink>
          </div>
        </div>
      </section>

      <!-- Continent Progress -->
      <section class="pp-section">
        <h2 class="pp-section-title">Continent Progress</h2>
        <div class="continent-grid">
          <div v-for="(countries, continent) in ps.CONTINENTS" :key="continent" class="continent-card">
            <div class="continent-header">
              <span class="continent-icon">{{ CONTINENT_ICONS[continent] }}</span>
              <div class="continent-info">
                <div class="continent-name">{{ continent }}</div>
                <div class="continent-count">
                  {{ ps.continentProgress(continent).done }} / {{ ps.continentProgress(continent).total }} countries
                </div>
              </div>
            </div>
            <div class="continent-bar-wrap">
              <div class="continent-bar"
                   :style="{ width: (ps.continentProgress(continent).done / ps.continentProgress(continent).total * 100) + '%' }">
              </div>
            </div>
            <div class="continent-countries">
              <span v-for="c in countries" :key="c"
                    class="cc-chip"
                    :class="{ visited: ps.stamps.some(s => s.country === c) }">
                {{ c }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Middle East unlock -->
      <div v-if="ps.middleEastComplete" class="pp-achievement">
        <div class="pa-icon">🏆</div>
        <div class="pa-text">
          <div class="pa-title">Middle East Master</div>
          <div class="pa-sub">You've completed all Middle East origins. Free Yemen Mokha sample on your next order.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pp-page { min-height: 100vh; background: #faf7f2; font-family: 'Inter', sans-serif; }

.pp-hero { background: linear-gradient(160deg, #1c1008 0%, #2d1a0a 60%, #3d2410 100%); padding: 72px 24px 56px; text-align: center; }
.pp-eyebrow { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 12px; }
.pp-headline { font-size: clamp(36px, 6vw, 60px); font-weight: 900; color: #fdf6ec; font-family: 'Playfair Display', serif; margin: 0 0 12px; }
.pp-sub { font-size: 16px; color: #78716c; margin: 0 0 32px; }
.pp-stats { display: inline-flex; align-items: center; gap: 0; background: rgba(255,255,255,0.06); border: 1px solid rgba(212,160,96,0.2); border-radius: 16px; padding: 16px 0; }
.pp-stat { padding: 0 32px; text-align: center; }
.pp-stat-num { display: block; font-size: 28px; font-weight: 900; color: #d4a060; font-family: 'Playfair Display', serif; }
.pp-stat-label { font-size: 11px; color: #78716c; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
.pp-stat-div { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

.pp-body { max-width: 1080px; margin: 0 auto; padding: 56px 24px 80px; }
.pp-section { margin-bottom: 56px; }
.pp-section-title { font-size: 22px; font-weight: 800; color: #1c1917; font-family: 'Playfair Display', serif; margin: 0 0 24px; }

.stamp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
.stamp-card { background: #fff; border: 2px solid #f0ebe4; border-radius: 16px; padding: 22px 18px; text-align: center; position: relative; }
.stamp-flag { font-size: 36px; margin-bottom: 10px; }
.stamp-country { font-size: 14px; font-weight: 800; color: #1c1917; margin-bottom: 4px; }
.stamp-bean { font-size: 11px; color: #78716c; margin-bottom: 8px; line-height: 1.4; }
.stamp-date { font-size: 10px; color: #a8a29e; font-weight: 600; }
.stamp-continent { font-size: 9px; color: #d4a060; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
.stamp-empty { border-style: dashed; border-color: #d1ccc7; background: #faf7f2; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 160px; gap: 8px; }
.stamp-plus { font-size: 32px; color: #d1ccc7; font-weight: 300; line-height: 1; }
.stamp-empty-text { font-size: 12px; color: #a8a29e; text-align: center; line-height: 1.5; }
.stamp-shop-link { font-size: 12px; font-weight: 700; color: #c8813a; text-decoration: none; }

.continent-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.continent-card { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 22px 20px; }
.continent-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.continent-icon { font-size: 28px; }
.continent-name { font-size: 15px; font-weight: 800; color: #1c1917; }
.continent-count { font-size: 12px; color: #a8a29e; margin-top: 2px; }
.continent-bar-wrap { height: 6px; background: #f0ebe4; border-radius: 6px; margin-bottom: 14px; }
.continent-bar { height: 100%; background: linear-gradient(90deg, #c8813a, #d4a060); border-radius: 6px; transition: width 0.6s ease; min-width: 4px; }
.continent-countries { display: flex; flex-wrap: wrap; gap: 6px; }
.cc-chip { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px; background: #f0ebe4; color: #a8a29e; }
.cc-chip.visited { background: #fdf3e7; color: #92400e; border: 1px solid rgba(200,129,58,0.25); }

.pp-achievement { display: flex; align-items: center; gap: 20px; background: linear-gradient(135deg, #1c1008, #2d1a0a); border: 1px solid rgba(212,160,96,0.3); border-radius: 16px; padding: 24px 28px; }
.pa-icon { font-size: 36px; }
.pa-title { font-size: 16px; font-weight: 800; color: #d4a060; margin-bottom: 4px; }
.pa-sub { font-size: 13px; color: #78716c; line-height: 1.5; }
</style>