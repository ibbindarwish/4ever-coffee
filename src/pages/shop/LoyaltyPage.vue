<script setup lang="ts">
import { computed } from 'vue'
import { useLoyaltyStore } from '../../stores/loyalty'

const loyalty = useLoyaltyStore()

const progressPct = computed(() => {
  if (!loyalty.nextTier) return 100
  const { min } = loyalty.tier
  const { need } = loyalty.nextTier
  const range = min + need - min
  const earned = loyalty.balance - min
  return Math.min(100, Math.round(earned / (range || 1) * 100))
})

const history = computed(() => [...loyalty.events].reverse())

function redeem() {
  const val = loyalty.redeem()
  if (val) alert(`£${val} reward redeemed! It will be applied to your next order.`)
}
</script>

<template>
  <div class="loyalty-page">
    <div class="page-inner">

      <!-- ── Hero card ── -->
      <div class="hero-card" :style="{ '--tier-color': loyalty.tier.color }">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-left">
            <p class="hero-eyebrow">4ever Coffee Rewards</p>
            <h1 class="hero-balance">{{ loyalty.balance.toLocaleString() }} <span>pts</span></h1>
            <div class="tier-badge">
              <span class="tier-dot"></span>
              {{ loyalty.tier.name }} Member
            </div>
          </div>
          <div class="hero-right">
            <div class="cup-icon">☕</div>
          </div>
        </div>

        <!-- Progress to next tier -->
        <div v-if="loyalty.nextTier" class="progress-wrap">
          <div class="progress-labels">
            <span>{{ loyalty.tier.name }}</span>
            <span class="progress-need">{{ loyalty.nextTier.need.toLocaleString() }} pts to {{ loyalty.nextTier.name }}</span>
            <span>{{ loyalty.nextTier.name }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>
        </div>
        <div v-else class="tier-max">
          <span>⭐ You've reached our highest tier — Gold Member!</span>
        </div>
      </div>

      <!-- ── Tier Roadmap ── -->
      <div class="tier-roadmap">
        <h2 class="section-title center-title">Membership Tiers</h2>
        <p class="center-sub">The more you order, the better the perks. Tier progress never resets.</p>
        <div class="tiers-grid">
          <div class="tier-card" :class="{ active: loyalty.tier.name === 'Bronze', achieved: loyalty.balance >= 0 }">
            <div class="tier-icon bronze-icon">
              <svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#c8813a" stroke-width="2.5"/><path d="M18 8l2.5 5 5.5.8-4 3.9.95 5.5L18 20.5l-4.95 2.7.95-5.5-4-3.9 5.5-.8z" fill="#c8813a"/></svg>
            </div>
            <div class="tier-name bronze">Bronze</div>
            <div class="tier-req">0 – 1,499 pts</div>
            <ul class="tier-perks">
              <li>10 pts per £1 spent</li>
              <li>Birthday free drink</li>
              <li>Early access to new menu</li>
              <li>Redeem 500 pts = £5 reward</li>
            </ul>
            <div v-if="loyalty.tier.name === 'Bronze'" class="tier-current-badge">Your Current Tier</div>
          </div>

          <div class="tier-card silver-card" :class="{ active: loyalty.tier.name === 'Silver', achieved: loyalty.balance >= 1500 }">
            <div class="tier-icon silver-icon">
              <svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#94a3b8" stroke-width="2.5"/><path d="M18 8l2.5 5 5.5.8-4 3.9.95 5.5L18 20.5l-4.95 2.7.95-5.5-4-3.9 5.5-.8z" fill="#94a3b8"/></svg>
            </div>
            <div class="tier-name silver">Silver</div>
            <div class="tier-req">1,500 – 4,999 pts</div>
            <ul class="tier-perks">
              <li>All Bronze benefits</li>
              <li>12 pts per £1 spent</li>
              <li>Priority order queue</li>
              <li>Free size upgrade, once/week</li>
              <li>Exclusive seasonal offers</li>
            </ul>
            <div v-if="loyalty.tier.name === 'Silver'" class="tier-current-badge">Your Current Tier</div>
          </div>

          <div class="tier-card gold-card" :class="{ active: loyalty.tier.name === 'Gold', achieved: loyalty.balance >= 5000 }">
            <div class="tier-icon gold-icon">
              <svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#d4a060" stroke-width="2.5"/><path d="M18 8l2.5 5 5.5.8-4 3.9.95 5.5L18 20.5l-4.95 2.7.95-5.5-4-3.9 5.5-.8z" fill="#d4a060"/></svg>
            </div>
            <div class="tier-name gold">Gold</div>
            <div class="tier-req">5,000+ pts</div>
            <ul class="tier-perks">
              <li>All Silver benefits</li>
              <li>15 pts per £1 spent</li>
              <li>Free delivery, always</li>
              <li>Monthly premium bean gift</li>
              <li>Invite-only cupping events</li>
              <li>Dedicated concierge line</li>
            </ul>
            <div v-if="loyalty.tier.name === 'Gold'" class="tier-current-badge gold-badge">✦ Gold Member</div>
          </div>
        </div>
      </div>

      <div class="lower">

        <!-- ── How it works ── -->
        <div class="info-section">
          <h2 class="section-title">How It Works</h2>
          <div class="how-grid">
            <div class="how-card">
              <div class="how-icon">🛍</div>
              <h3>Earn</h3>
              <p>Get <strong>{{ loyalty.POINTS_PER_POUND }} points</strong> for every £1 you spend on any order.</p>
            </div>
            <div class="how-card">
              <div class="how-icon">🎁</div>
              <h3>Redeem</h3>
              <p>Collect <strong>{{ loyalty.REDEEM_RATE }} points</strong> and redeem them for a <strong>£{{ loyalty.REDEEM_VALUE }}</strong> reward.</p>
            </div>
            <div class="how-card">
              <div class="how-icon">🏆</div>
              <h3>Tier Up</h3>
              <p>Reach <strong>1,500 pts</strong> for Silver, <strong>5,000 pts</strong> for Gold — unlock exclusive perks.</p>
            </div>
          </div>

          <!-- Redeem button -->
          <div class="redeem-wrap">
            <div class="redeem-info">
              <strong>{{ loyalty.balance.toLocaleString() }}</strong> / {{ loyalty.REDEEM_RATE }} pts
              <span class="redeem-sub"> — {{ loyalty.canRedeem ? 'Ready to redeem!' : `${(loyalty.REDEEM_RATE - loyalty.balance).toLocaleString()} pts needed` }}</span>
            </div>
            <button class="redeem-btn" :disabled="!loyalty.canRedeem" @click="redeem">
              {{ loyalty.canRedeem ? `Redeem £${loyalty.REDEEM_VALUE} Reward →` : 'Not enough points yet' }}
            </button>
          </div>
        </div>

        <!-- ── Points history ── -->
        <div class="history-section">
          <h2 class="section-title">Points History</h2>

          <div v-if="history.length === 0" class="empty-history">
            <div class="empty-icon">☕</div>
            <p>No activity yet. Place an order to start earning!</p>
          </div>

          <div v-else class="history-list">
            <div v-for="ev in history" :key="ev.id" class="history-row">
              <div class="history-icon" :class="ev.points > 0 ? 'earn' : 'spend'">
                {{ ev.points > 0 ? '+' : '−' }}
              </div>
              <div class="history-info">
                <div class="history-desc">{{ ev.description }}</div>
                <div class="history-date">{{ ev.date }}</div>
              </div>
              <div class="history-pts" :class="ev.points > 0 ? 'positive' : 'negative'">
                {{ ev.points > 0 ? '+' : '' }}{{ ev.points.toLocaleString() }} pts
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.loyalty-page  { min-height: 60vh; background: #faf7f2; }
.page-inner    { max-width: 860px; margin: 0 auto; padding: 36px 24px 72px; }

/* ── Hero ── */
.hero-card {
  position: relative; border-radius: 22px; overflow: hidden;
  background: linear-gradient(135deg, #1c0f06 0%, #2c1810 55%, #3a2015 100%);
  color: #fff; padding: 32px 32px 0; margin-bottom: 28px;
  box-shadow: 0 8px 32px rgba(28,15,6,0.35);
}
.hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 80% 20%, rgba(212,160,96,0.18) 0%, transparent 60%);
  pointer-events: none;
}
.hero-content  { position: relative; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.hero-left     { display: flex; flex-direction: column; gap: 10px; }
.hero-eyebrow  { font-size: 11px; font-weight: 700; color: #d4a060; text-transform: uppercase; letter-spacing: 0.14em; margin: 0; }
.hero-balance  { font-size: 56px; font-weight: 900; margin: 0; letter-spacing: -2px; line-height: 1; }
.hero-balance span { font-size: 22px; font-weight: 600; color: #d4a060; vertical-align: baseline; }
.tier-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 700;
  width: fit-content;
}
.tier-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tier-color); flex-shrink: 0; }
.hero-right    { font-size: 72px; opacity: 0.18; line-height: 1; user-select: none; }

.progress-wrap { position: relative; padding: 16px 0 22px; }
.progress-labels { display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
.progress-need { color: #d4a060; font-weight: 600; }
.progress-bar  { height: 6px; background: rgba(255,255,255,0.12); border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #d4a060, #f5c878); border-radius: 99px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }

.tier-max { padding: 12px 0 20px; font-size: 13px; color: #d4a060; font-weight: 600; }

/* ── Tier Roadmap ── */
.tier-roadmap { margin-bottom: 28px; }
.center-title { text-align: center; font-size: 22px; font-weight: 900; color: #1c1917; margin: 0 0 6px; }
.center-sub   { text-align: center; font-size: 13px; color: #78716c; margin: 0 0 24px; }
.tiers-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 700px) { .tiers-grid { grid-template-columns: 1fr; } }

.tier-card {
  background: #fff; border: 1.5px solid #f0ebe4; border-radius: 20px; padding: 24px 20px;
  display: flex; flex-direction: column; gap: 10px; position: relative; transition: all 0.25s;
  opacity: 0.7;
}
.tier-card.achieved { opacity: 1; }
.tier-card.active { border-color: #d4a060; box-shadow: 0 8px 32px rgba(212,160,96,0.2); transform: translateY(-4px); opacity: 1; }
.tier-card.silver-card.active { border-color: #94a3b8; box-shadow: 0 8px 32px rgba(148,163,184,0.2); }
.tier-card.gold-card.active   { border-color: #d4a060; box-shadow: 0 8px 32px rgba(212,160,96,0.3); background: linear-gradient(160deg, #fffbf5, #fff); }

.tier-icon { width: 44px; height: 44px; }
.tier-icon svg { width: 100%; height: 100%; }
.tier-name   { font-size: 18px; font-weight: 900; margin: 0; }
.bronze      { color: #c8813a; }
.silver      { color: #78909c; }
.gold        { color: #d4a060; }
.tier-req    { font-size: 12px; color: #a8a29e; font-weight: 600; margin-bottom: 4px; }

.tier-perks { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; flex: 1; }
.tier-perks li { font-size: 12px; color: #57534e; padding-left: 18px; position: relative; line-height: 1.5; }
.tier-perks li::before { content: '✓'; position: absolute; left: 0; color: #c8813a; font-weight: 800; font-size: 11px; }
.tier-card.silver-card .tier-perks li::before { color: #78909c; }
.tier-card.gold-card .tier-perks li::before   { color: #d4a060; }

.tier-current-badge {
  margin-top: 8px; background: rgba(200,129,58,0.12); color: #c8813a;
  border-radius: 20px; padding: 5px 12px; font-size: 11px; font-weight: 700;
  text-align: center; border: 1px solid rgba(200,129,58,0.25);
}
.gold-badge { background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border: none; }

/* ── Lower ── */
.lower { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
@media (max-width: 680px) { .lower { grid-template-columns: 1fr; } }

.section-title { font-size: 17px; font-weight: 800; color: #1c1917; margin: 0 0 16px; }

/* ── How it works ── */
.info-section { background: #fff; border-radius: 18px; padding: 24px; border: 1px solid #f0ebe4; }
.how-grid     { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.how-card     { display: flex; align-items: flex-start; gap: 12px; }
.how-icon     { font-size: 22px; flex-shrink: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #faf7f2; border-radius: 10px; }
.how-card h3  { font-size: 13px; font-weight: 700; color: #1c1917; margin: 0 0 2px; }
.how-card p   { font-size: 12px; color: #78716c; margin: 0; line-height: 1.5; }

.redeem-wrap  { background: #fdf3e7; border: 1px solid rgba(212,160,96,0.25); border-radius: 12px; padding: 14px 16px; }
.redeem-info  { font-size: 13px; color: #92400e; margin-bottom: 10px; }
.redeem-sub   { color: #a8a29e; font-size: 12px; }
.redeem-btn {
  display: block; width: 100%;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border: none; border-radius: 10px;
  padding: 12px; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(200,129,58,0.3);
}
.redeem-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,129,58,0.45); }
.redeem-btn:disabled { background: #e7e5e4; color: #a8a29e; cursor: not-allowed; box-shadow: none; }

/* ── History ── */
.history-section { background: #fff; border-radius: 18px; padding: 24px; border: 1px solid #f0ebe4; }
.empty-history   { text-align: center; padding: 32px 0; }
.empty-icon      { font-size: 40px; margin-bottom: 10px; }
.empty-history p { font-size: 13px; color: #a8a29e; }

.history-list { display: flex; flex-direction: column; gap: 2px; }
.history-row  { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #faf7f2; }
.history-row:last-child { border-bottom: none; }
.history-icon {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; flex-shrink: 0;
}
.history-icon.earn  { background: #dcfce7; color: #16a34a; }
.history-icon.spend { background: #fee2e2; color: #dc2626; }
.history-info   { flex: 1; min-width: 0; }
.history-desc   { font-size: 13px; font-weight: 600; color: #1c1917; }
.history-date   { font-size: 11px; color: #a8a29e; }
.history-pts    { font-size: 14px; font-weight: 800; white-space: nowrap; }
.history-pts.positive { color: #16a34a; }
.history-pts.negative { color: #dc2626; }
</style>