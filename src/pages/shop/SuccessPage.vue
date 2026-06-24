<script setup lang="ts">
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
const route = useRoute()
const orderId = route.query.id as string
</script>

<template>
  <div class="success-page">
    <div class="success-card">
      <div class="success-icon">☕</div>
      <h1>Order Placed!</h1>
      <p class="order-id">Order <strong>{{ orderId }}</strong></p>
      <p class="message">Thank you for choosing 4ever Coffee! Your drink is being prepared and will be on its way soon.</p>
      <div class="steps">
        <div class="step done">✓ Order Received</div>
        <div class="step-arrow">→</div>
        <div class="step active">☕ Preparing</div>
        <div class="step-arrow">→</div>
        <div class="step">🚴 On the Way</div>
        <div class="step-arrow">→</div>
        <div class="step">✓ Delivered</div>
      </div>
      <div class="actions">
        <RouterLink :to="{ name: 'track', query: { id: orderId } }" class="btn-primary">Track My Order →</RouterLink>
        <RouterLink to="/shop/menu" class="btn-ghost">Order More</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #faf7f2; padding: 40px 24px; }
.success-card { background: #fff; border-radius: 20px; padding: 48px 40px; max-width: 540px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(44,16,8,0.1); border: 1px solid #f0ebe4; }
.success-icon { font-size: 64px; margin-bottom: 16px; }
h1 { font-size: 28px; font-weight: 900; color: #1c1917; margin-bottom: 8px; }
.order-id { font-size: 14px; color: #a8a29e; margin-bottom: 12px; }
.order-id strong { color: #d4a060; font-weight: 700; }
.message { font-size: 15px; color: #57534e; line-height: 1.6; margin-bottom: 32px; }
.steps { display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: 36px; }
.step { font-size: 12px; font-weight: 600; color: #a8a29e; padding: 6px 12px; border-radius: 20px; border: 1px solid #e7e5e4; }
.step.done { color: #10b981; border-color: #a7f3d0; background: #f0fdf4; }
.step.active { color: #d4a060; border-color: #fcd34d; background: #fdf3e7; }
.step-arrow { font-size: 14px; color: #e7e5e4; }
.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-primary { display: inline-block; background: #d4a060; color: #fff; border-radius: 10px; padding: 12px 28px; font-size: 14px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
.btn-primary:hover { background: #c8813a; }
.btn-ghost { display: inline-block; border: 1px solid #e7e5e4; color: #57534e; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; }
.btn-ghost:hover { background: #faf7f2; }
</style>
