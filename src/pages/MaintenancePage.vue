<script setup lang="ts">
import AppLogo from '../components/AppLogo.vue'
</script>

<template>
  <div class="mnt-root">
    <div class="mnt-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="mnt-card">
      <AppLogo :size="40" />

      <div class="mnt-scene">
        <div class="steam">
          <span class="sp sp1"></span>
          <span class="sp sp2"></span>
          <span class="sp sp3"></span>
        </div>
        <div class="mnt-badge">
          <span class="mnt-emoji">☕</span>
          <span class="mnt-tool">🔧</span>
        </div>
      </div>

      <h1 class="mnt-title">Under Maintenance</h1>
      <p class="mnt-text">
        We're brewing a few updates behind the scenes to make your 4ever Coffee
        experience even better. We'll be back online shortly — thanks for your patience.
      </p>

      <RouterLink to="/shop" class="mnt-btn">← Back to Home</RouterLink>

      <p class="mnt-contact">
        Need something urgently? <a href="mailto:support@4evercoffee.ae">support@4evercoffee.ae</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.mnt-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0603 0%, #1a0a04 50%, #2c1008 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px; position: relative; overflow: hidden;
}
.mnt-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); }
.orb-1 { width: 400px; height: 400px; background: #c8813a; top: -120px; left: -80px; opacity: 0.3; }
.orb-2 { width: 300px; height: 300px; background: #d4a060; bottom: -60px; right: -60px; opacity: 0.2; }
.orb-3 { width: 200px; height: 200px; background: #8B4513; top: 60%; left: 60%; opacity: 0.15; }

.mnt-card {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px; padding: 44px 40px;
  width: 100%; max-width: 460px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  display: flex; flex-direction: column; align-items: center; text-align: center;
}

.mnt-scene { position: relative; width: 120px; height: 130px; margin: 20px 0 8px; }

.steam { position: absolute; top: -6px; left: 0; right: 0; display: flex; justify-content: center; gap: 14px; }
.sp {
  display: block; width: 3px; height: 20px; border-radius: 3px;
  background: rgba(212,160,96,0.35); transform-box: fill-box; transform-origin: bottom center;
}
.sp1 { animation: rise 2.6s ease-in-out infinite 0s; }
.sp2 { animation: rise 2.6s ease-in-out infinite 0.6s; }
.sp3 { animation: rise 2.6s ease-in-out infinite 1.2s; }
@keyframes rise {
  0%   { transform: translateY(6px) scaleX(1);    opacity: 0; }
  25%  { opacity: 0.8; }
  75%  { opacity: 0.2; }
  100% { transform: translateY(-22px) scaleX(0.5); opacity: 0; }
}

.mnt-badge {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100px; height: 100px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #3a2410, #1a0a04);
  border: 1px solid rgba(212,160,96,0.3);
  display: flex; align-items: center; justify-content: center;
  animation: float 3.2s ease-in-out infinite;
  box-shadow: 0 12px 32px rgba(0,0,0,0.4), inset 0 0 24px rgba(212,160,96,0.08);
}
@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(-8px); }
}
.mnt-emoji { font-size: 46px; line-height: 1; }
.mnt-tool {
  position: absolute; bottom: 2px; right: 2px; font-size: 26px; line-height: 1;
  background: #1c1917; border-radius: 50%; padding: 6px;
  border: 2px solid #1a0a04; box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}

.mnt-title { font-size: 24px; font-weight: 800; color: #fdf6ec; margin: 4px 0 10px; }
.mnt-text  { font-size: 14px; line-height: 1.6; color: #a89684; margin: 0 0 26px; }

.mnt-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; border-radius: 10px; text-decoration: none;
  font-size: 14px; font-weight: 700; transition: all 0.2s;
  box-shadow: 0 6px 20px rgba(200,129,58,0.4);
}
.mnt-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,129,58,0.55); }

.mnt-contact { font-size: 12px; color: #64748b; margin: 20px 0 0; }
.mnt-contact a { color: #d4a060; text-decoration: none; }
.mnt-contact a:hover { text-decoration: underline; }
</style>