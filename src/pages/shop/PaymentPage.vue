<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'
import { useCartStore } from '../../stores/cart'
import { usePromoStore } from '../../stores/promo'
import { useLoyaltyStore } from '../../stores/loyalty'
import { useCheckoutStore } from '../../stores/checkout'
import { useCustomerAuthStore } from '../../stores/customerAuth'

const router       = useRouter()
const cart         = useCartStore()
const promo        = usePromoStore()
const loyalty      = useLoyaltyStore()
const checkout     = useCheckoutStore()
const customerAuth = useCustomerAuthStore()

const discount      = computed(() => promo.calcDiscount(cart.subtotal))
const effectiveShip = computed(() => promo.isFreeShip() ? 0 : cart.shipping)
const finalTotal    = computed(() => Math.max(0, cart.subtotal - discount.value + effectiveShip.value))

const loading    = ref(true)
const processing = ref(false)
const errorMsg   = ref('')

let stripe: Stripe | null = null
let elements: StripeElements | null = null

onMounted(async () => {
  if (!checkout.hasData()) { router.replace('/shop/checkout'); return }

  try {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.items.map(i => ({ productId: i.product.id, size: i.size, qty: i.qty })),
        // Staff/admin auto-apply codes are never sent to the server — it has
        // no way to verify who's asking, so only customer-enterable codes qualify.
        promoCode: promo.applied && !promo.applied.staffRole ? promo.applied.code : undefined,
        delivery: { ...checkout.delivery },
        customerId: customerAuth.current?.id,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Failed to start payment')

    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    if (!stripe) throw new Error('Stripe failed to load')

    elements = stripe.elements({ clientSecret: data.clientSecret })
    elements.create('payment').mount('#payment-element')
  } catch (err: any) {
    errorMsg.value = err?.message ?? 'Something went wrong setting up payment.'
  } finally {
    loading.value = false
  }
})

async function pay() {
  if (!stripe || !elements || processing.value) return
  processing.value = true
  errorMsg.value = ''

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    redirect: 'if_required',
  })

  if (error) {
    errorMsg.value = error.message ?? 'Payment failed. Please try again.'
    processing.value = false
    return
  }

  if (paymentIntent?.status !== 'succeeded') {
    errorMsg.value = 'Payment did not complete. Please try again.'
    processing.value = false
    return
  }

  // The order itself is created server-side by the Stripe webhook once the
  // payment_intent.succeeded event lands — not here, and never trusting the
  // client to record its own paid order.
  loyalty.earnFromOrder(finalTotal.value, paymentIntent.id, cart.items.map(i => i.product.id))
  cart.clearCart()
  promo.clear()
  checkout.clear()
  router.push({ name: 'success', query: { payment_intent: paymentIntent.id } })
}
</script>

<template>
  <div class="pay-page">
    <div class="pay-inner">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <RouterLink to="/shop/cart" class="bc-link">Cart</RouterLink>
        <span class="bc-sep">›</span>
        <RouterLink to="/shop/checkout" class="bc-link">Delivery</RouterLink>
        <span class="bc-sep">›</span>
        <span class="bc-current">Payment</span>
      </div>

      <h1 class="page-title">Secure Payment</h1>

      <div class="pay-layout">

        <!-- ── LEFT: payment form ── -->
        <div class="pay-left">

          <div class="card-form">
            <div v-if="loading" class="stripe-loading">
              <span class="spinner"></span> Preparing secure payment…
            </div>
            <div v-show="!loading" id="payment-element"></div>
            <p v-if="errorMsg" class="err">{{ errorMsg }}</p>
          </div>

          <!-- Security badges -->
          <div class="security-row">
            <div class="sec-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              256-bit SSL
            </div>
            <div class="sec-badge">🛡 PCI DSS via Stripe</div>
            <div class="sec-badge">🔒 3D Secure</div>
          </div>

          <!-- ── Delivery summary strip ── -->
          <div class="delivery-strip">
            <div class="ds-icon">📦</div>
            <div class="ds-info">
              <div class="ds-name">{{ checkout.delivery.name }}</div>
              <div class="ds-addr">{{ checkout.delivery.address }}, {{ checkout.delivery.city }} {{ checkout.delivery.zip }}</div>
            </div>
            <RouterLink to="/shop/checkout" class="ds-edit">Edit</RouterLink>
          </div>

          <!-- Pay button -->
          <button class="pay-btn" :class="{ loading: processing }" @click="pay" :disabled="loading || processing || !stripe">
            <template v-if="processing">
              <span class="spinner"></span> Processing…
            </template>
            <template v-else>
              🔒 Pay £{{ finalTotal.toFixed(2) }}
            </template>
          </button>

          <p class="pay-note">Your payment is processed securely by Stripe. We never see or store your card details.</p>
        </div>

        <!-- ── RIGHT: order summary ── -->
        <div class="order-summary">
          <h3>Order Summary</h3>

          <div v-for="item in cart.items" :key="`${item.product.id}-${item.size}`" class="sum-item">
            <div class="sum-thumb" :style="{ background: item.product.gradient }"></div>
            <div class="sum-info">
              <div class="sum-name">{{ item.product.name }}</div>
              <div class="sum-meta">{{ item.size }} × {{ item.qty }}</div>
            </div>
            <span class="sum-price">£{{ (cart.effectivePrice(item) * item.qty).toFixed(2) }}</span>
          </div>

          <div class="sum-divider"></div>

          <div class="sum-row"><span>Subtotal</span><span>£{{ cart.subtotal.toFixed(2) }}</span></div>
          <div v-if="discount > 0" class="sum-row green">
            <span>Promo ({{ promo.applied?.code }})</span><span>−£{{ discount.toFixed(2) }}</span>
          </div>
          <div class="sum-row">
            <span>Delivery</span>
            <span :class="{ 'sum-free': effectiveShip === 0 }">
              {{ effectiveShip === 0 ? 'FREE' : '£' + effectiveShip.toFixed(2) }}
            </span>
          </div>

          <div class="sum-total">
            <span>Total</span>
            <span>£{{ finalTotal.toFixed(2) }}</span>
          </div>

          <!-- What's included -->
          <div class="includes">
            <div class="inc-item">✓ 48-hr tracked delivery</div>
            <div class="inc-item">✓ Freshness guarantee</div>
            <div class="inc-item">✓ Free returns within 14 days</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Processing overlay -->
    <Transition name="overlay">
      <div v-if="processing" class="processing-overlay">
        <div class="processing-card">
          <div class="proc-ring"></div>
          <div class="proc-icon">🔒</div>
          <div class="proc-title">Processing Payment</div>
          <div class="proc-sub">Please don't close this window…</div>
          <div class="proc-amount">£{{ finalTotal.toFixed(2) }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pay-page  { min-height: 100vh; background: #faf7f2; }
.pay-inner { max-width: 1040px; margin: 0 auto; padding: 32px 24px 80px; }

/* Breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
.bc-link    { font-size: 13px; color: #a8a29e; text-decoration: none; transition: color .15s; }
.bc-link:hover { color: #d4a060; }
.bc-sep     { color: #d0c8c0; font-size: 13px; }
.bc-current { font-size: 13px; font-weight: 700; color: #1c1917; }

.page-title { font-size: 30px; font-weight: 700; color: #1c1917; margin-bottom: 28px; font-family: 'Playfair Display', serif; }

.pay-layout { display: grid; grid-template-columns: 1fr 310px; gap: 28px; align-items: start; }
@media (max-width: 760px) { .pay-layout { grid-template-columns: 1fr; } }

.pay-left { display: flex; flex-direction: column; gap: 16px; }

/* ── Stripe payment element container ── */
.card-form  { display: flex; flex-direction: column; gap: 14px; background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 22px 24px; min-height: 120px; }
.stripe-loading { display: flex; align-items: center; gap: 10px; color: #78716c; font-size: 14px; padding: 20px 0; }
.err { font-size: 12px; color: #ef4444; font-weight: 600; }

/* Security badges */
.security-row { display: flex; flex-wrap: wrap; gap: 8px; }
.sec-badge {
  display: flex; align-items: center; gap: 4px;
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
  padding: 5px 10px; font-size: 11px; font-weight: 600; color: #166534;
}
.sec-badge svg { width: 12px; height: 12px; }

/* Delivery strip */
.delivery-strip {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 1px solid #f0ebe4; border-radius: 12px; padding: 14px 16px;
}
.ds-icon { font-size: 22px; flex-shrink: 0; }
.ds-info { flex: 1; min-width: 0; }
.ds-name { font-size: 13px; font-weight: 700; color: #1c1917; }
.ds-addr { font-size: 12px; color: #a8a29e; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ds-edit { font-size: 12px; font-weight: 700; color: #d4a060; text-decoration: none; flex-shrink: 0; }
.ds-edit:hover { color: #c8813a; }

/* Pay button */
.pay-btn {
  width: 100%; padding: 16px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, #c8813a, #d4a060);
  color: #fff; font-size: 17px; font-weight: 800; cursor: pointer;
  box-shadow: 0 6px 20px rgba(200,129,58,.4); transition: all .2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,129,58,.55); }
.pay-btn:disabled { opacity: .7; cursor: not-allowed; }
.pay-btn.loading  { background: #44403c; }

@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: spin .7s linear infinite;
}
.stripe-loading .spinner { border-color: rgba(28,25,23,.15); border-top-color: #d4a060; }

.pay-note { font-size: 12px; color: #a8a29e; text-align: center; }

/* ── Order summary ── */
.order-summary {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 16px;
  padding: 22px; position: sticky; top: 88px;
}
.order-summary h3 { font-size: 15px; font-weight: 700; color: #1c1917; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f5f0ea; }

.sum-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #faf7f2; }
.sum-thumb { width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0; }
.sum-info  { flex: 1; min-width: 0; }
.sum-name  { font-size: 12px; font-weight: 600; color: #1c1917; }
.sum-meta  { font-size: 11px; color: #a8a29e; margin-top: 1px; text-transform: capitalize; }
.sum-price { font-size: 13px; font-weight: 700; color: #1c1917; white-space: nowrap; }

.sum-divider { border: none; border-top: 1px solid #f0ebe4; margin: 10px 0; }
.sum-row     { display: flex; justify-content: space-between; font-size: 13px; color: #57534e; padding: 4px 0; }
.sum-row.green span { color: #16a34a; font-weight: 600; }
.sum-free    { color: #10b981; font-weight: 700; }
.sum-total   { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #1c1917; padding: 12px 0 0; border-top: 2px solid #f0ebe4; margin-top: 6px; }

.includes { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; }
.inc-item { font-size: 12px; color: #10b981; font-weight: 600; }

/* ── Processing overlay ── */
.processing-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 999; backdrop-filter: blur(4px);
}
.processing-card {
  background: #fff; border-radius: 24px; padding: 48px 40px;
  text-align: center; width: 300px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.3);
}
.proc-ring {
  width: 64px; height: 64px; border-radius: 50%;
  border: 4px solid #f5f0ea; border-top-color: #d4a060;
  animation: spin .8s linear infinite;
  margin: 0 auto 16px;
}
.proc-icon  { font-size: 28px; margin-bottom: 12px; }
.proc-title { font-size: 18px; font-weight: 800; color: #1c1917; margin-bottom: 6px; }
.proc-sub   { font-size: 13px; color: #a8a29e; margin-bottom: 16px; }
.proc-amount { font-size: 28px; font-weight: 900; color: #d4a060; letter-spacing: -1px; }

.overlay-enter-active, .overlay-leave-active { transition: opacity .3s; }
.overlay-enter-from, .overlay-leave-to       { opacity: 0; }
</style>
