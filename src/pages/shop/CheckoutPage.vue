<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { usePromoStore } from '../../stores/promo'
import { useCheckoutStore } from '../../stores/checkout'
import { useAuthStore } from '../../stores/auth'

const router   = useRouter()
const cart     = useCartStore()
const promo    = usePromoStore()
const checkout = useCheckoutStore()
const auth     = useAuthStore()

const form   = ref({
  name:       checkout.delivery.name    || '',
  email:      checkout.delivery.email   || '',
  phone:      checkout.delivery.phone   || '',
  address:    checkout.delivery.address || '',
  city:       checkout.delivery.city    || '',
  zip:        checkout.delivery.zip     || '',
  cupMessage: '',
})
const errors = ref<Partial<typeof form.value>>({})
const promoInput = ref('')
const promoApplied = ref(false)

// Auto-apply staff/admin discount if an admin user is browsing the shop
onMounted(() => {
  if (auth.user?.role && !promo.applied?.staffRole) {
    promo.autoApplyForRole(auth.user.role)
  }
})

const isStaffDiscount = computed(() => !!promo.applied?.staffRole)
const staffLabel = computed(() => {
  const role = promo.applied?.staffRole
  if (role === 'admin') return '👑 Admin benefit — 50% off'
  if (role === 'staff') return '🏷 Staff benefit — 15% off'
  return ''
})

const discount        = computed(() => promo.calcDiscount(cart.subtotal))
const effectiveShip   = computed(() => promo.isFreeShip() ? 0 : cart.shipping)
const finalTotal      = computed(() => Math.max(0, cart.subtotal - discount.value + effectiveShip.value))
const stillNeedsFree  = computed(() =>
  !promo.isFreeShip() && cart.shipping > 0
    ? (30 - cart.subtotal).toFixed(2)
    : null
)

function applyPromo() {
  const ok = promo.apply(promoInput.value)
  promoApplied.value = ok
}

function removePromo() {
  promo.clear()
  promoInput.value = ''
  promoApplied.value = false
}

function validate() {
  errors.value = {}
  if (!form.value.name)    errors.value.name    = 'Name is required'
  if (!form.value.email)   errors.value.email   = 'Email is required'
  if (!form.value.phone)   errors.value.phone   = 'Phone is required'
  if (!form.value.address) errors.value.address = 'Address is required'
  if (!form.value.city)    errors.value.city    = 'City is required'
  return Object.keys(errors.value).length === 0
}

function proceedToPayment() {
  if (!validate()) return
  checkout.save(form.value)
  router.push('/shop/payment')
}
</script>

<template>
  <div class="checkout-page">
    <div class="page-inner">
      <h1 class="page-title">Checkout</h1>

      <div class="checkout-layout">

        <!-- ── Left: delivery form ── -->
        <div class="checkout-left">
          <form class="checkout-form" @submit.prevent="proceedToPayment">

            <div class="form-section">
              <h3 class="form-section-title">
                <span class="step-num">1</span> Delivery Details
              </h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Full Name</label>
                  <input v-model="form.name" class="input" :class="{ error: errors.name }" placeholder="Sara Ahmed"/>
                  <span v-if="errors.name" class="err">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="form.email" type="email" class="input" :class="{ error: errors.email }" placeholder="sara@example.com"/>
                  <span v-if="errors.email" class="err">{{ errors.email }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input v-model="form.phone" class="input" :class="{ error: errors.phone }" placeholder="+44 7700 900000"/>
                <span v-if="errors.phone" class="err">{{ errors.phone }}</span>
              </div>
              <div class="form-group">
                <label>Delivery Address</label>
                <input v-model="form.address" class="input" :class="{ error: errors.address }" placeholder="12 Baker Street"/>
                <span v-if="errors.address" class="err">{{ errors.address }}</span>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>City</label>
                  <input v-model="form.city" class="input" :class="{ error: errors.city }" placeholder="London"/>
                  <span v-if="errors.city" class="err">{{ errors.city }}</span>
                </div>
                <div class="form-group">
                  <label>Postcode</label>
                  <input v-model="form.zip" class="input" placeholder="SW1A 1AA"/>
                </div>
              </div>
            </div>

            <!-- Cup message section -->
            <div class="form-section">
              <h3 class="form-section-title">
                <span class="step-num">2</span> Message on Your Cup
              </h3>
              <div class="cup-msg-wrap">
                <textarea v-model="form.cupMessage" class="input cup-msg-input" rows="2" maxlength="60"
                          placeholder="e.g. Happy Birthday Sarah! ☕ or Good morning, you've got this!"></textarea>
                <div class="cup-msg-meta">
                  <span class="cup-msg-hint">Printed inside the lid. 60 chars max.</span>
                  <span class="cup-msg-count">{{ (form.cupMessage || '').length }}/60</span>
                </div>
              </div>
            </div>

            <!-- Promo code section -->
            <div class="form-section promo-section">
              <h3 class="form-section-title">
                <span class="step-num">3</span> Promo Code
              </h3>

              <!-- Staff / Admin auto-applied benefit -->
              <div v-if="isStaffDiscount" class="staff-benefit-banner">
                <div class="sbb-icon">{{ promo.applied?.staffRole === 'admin' ? '👑' : '🏷' }}</div>
                <div class="sbb-info">
                  <div class="sbb-title">{{ staffLabel }}</div>
                  <div class="sbb-sub">Automatically applied to your order as a {{ promo.applied?.staffRole === 'admin' ? 'Admin' : 'Staff' }} member</div>
                </div>
                <div class="sbb-saving">−£{{ discount.toFixed(2) }}</div>
              </div>

              <!-- Manually applied promo -->
              <div v-else-if="promo.applied" class="promo-applied">
                <div class="promo-applied-left">
                  <span class="promo-tag">{{ promo.applied.code }}</span>
                  <span class="promo-label">{{ promo.applied.label }}</span>
                </div>
                <button type="button" class="promo-remove" @click="removePromo">Remove</button>
              </div>

              <!-- Entry field -->
              <div v-else>
                <div class="promo-row">
                  <input v-model="promoInput" class="input promo-input" placeholder="Enter promo code"
                         @keydown.enter.prevent="applyPromo"/>
                  <button type="button" class="promo-btn" @click="applyPromo">Apply</button>
                </div>
                <p v-if="promo.error" class="err promo-err">{{ promo.error }}</p>
              </div>
            </div>

            <button type="submit" class="place-btn">
              🔒 Continue to Payment &middot; £{{ finalTotal.toFixed(2) }} →
            </button>
          </form>
        </div>

        <!-- ── Right: order summary ── -->
        <div class="order-summary">
          <h3>Your Order</h3>
          <div v-for="item in cart.items" :key="`${item.product.id}-${item.size}`" class="sum-item">
            <div class="sum-item-img">
              <div class="sum-img-bg" :style="{ background: item.product.gradient }"></div>
              <img :src="item.product.image" :alt="item.product.name" class="sum-photo"
                   @error="() => {}"/>
            </div>
            <div class="sum-name-wrap">
              <span class="sum-name">{{ item.product.name }} × {{ item.qty }}</span>
              <span class="sum-size-badge">{{ item.size[0].toUpperCase() }}</span>
            </div>
            <span class="sum-price">£{{ (cart.effectivePrice(item) * item.qty).toFixed(2) }}</span>
          </div>

          <div class="sum-divider"></div>

          <div class="sum-row"><span>Subtotal</span><span>£{{ cart.subtotal.toFixed(2) }}</span></div>

          <div v-if="discount > 0" class="sum-row discount-row">
            <span>Promo ({{ promo.applied?.code }})</span>
            <span>−£{{ discount.toFixed(2) }}</span>
          </div>

          <div class="sum-row">
            <span>Delivery</span>
            <span :class="{ free: effectiveShip === 0 }">
              {{ effectiveShip === 0 ? 'FREE' : '£' + effectiveShip.toFixed(2) }}
            </span>
          </div>

          <div v-if="stillNeedsFree" class="free-hint">
            Add £{{ stillNeedsFree }} more for free delivery!
          </div>
          <div v-else-if="promo.isFreeShip()" class="promo-ship-badge">
            🎉 Free delivery applied!
          </div>

          <div class="sum-total">
            <span>Total</span>
            <span>£{{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page  { min-height: 60vh; background: #faf7f2; }
.page-inner     { max-width: 1040px; margin: 0 auto; padding: 40px 24px 72px; }
.page-title     { font-size: 30px; font-weight: 700; color: #1c1917; margin-bottom: 28px; font-family: 'Playfair Display', serif; }

.checkout-layout { display: grid; grid-template-columns: 1fr 310px; gap: 28px; align-items: start; }
@media (max-width: 740px) { .checkout-layout { grid-template-columns: 1fr; } }

.checkout-left  { display: flex; flex-direction: column; gap: 18px; }
.checkout-form  { display: flex; flex-direction: column; gap: 18px; }

.form-section { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; }
.form-section-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; color: #1c1917; margin: 0; }
.step-num { width: 26px; height: 26px; border-radius: 50%; background: #d4a060; color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.form-row    { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
.form-group  { display: flex; flex-direction: column; gap: 5px; }
label        { font-size: 11px; font-weight: 600; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.input { padding: 11px 14px; border: 1.5px solid #e7e5e4; border-radius: 9px; font-size: 14px; outline: none; background: #faf7f2; color: #1c1917; transition: border-color 0.15s, background 0.15s; width: 100%; box-sizing: border-box; }
.input:focus { border-color: #d4a060; background: #fff; }
.input.error { border-color: #ef4444; }
.err { font-size: 11px; color: #ef4444; }

/* Promo */
.promo-section {}
.promo-row   { display: flex; gap: 8px; }
.promo-input { flex: 1; }
.promo-btn   { padding: 11px 18px; background: #1c1917; color: #fdf6ec; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
.promo-btn:hover { background: #2c1917; }
.promo-hint  { font-size: 11px; color: #a8a29e; margin-top: 8px; }
.promo-err   { margin-top: 6px; }
.promo-applied { display: flex; align-items: center; justify-content: space-between; background: #d1fae5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px 16px; }
.promo-applied-left { display: flex; align-items: center; gap: 10px; }
.promo-tag   { background: #065f46; color: #fff; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 800; letter-spacing: 0.06em; }
.promo-label { font-size: 13px; font-weight: 600; color: #065f46; }
.promo-remove { background: none; border: 1px solid #a7f3d0; border-radius: 6px; color: #065f46; font-size: 12px; font-weight: 600; cursor: pointer; padding: 4px 10px; transition: background 0.15s; }
.promo-remove:hover { background: rgba(16,185,129,0.15); }

/* Staff / Admin benefit banner */
.staff-benefit-banner {
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, #1c0a04 0%, #2a1208 100%);
  border: 1px solid rgba(212,160,96,0.35);
  border-radius: 12px; padding: 14px 18px;
}
.sbb-icon { font-size: 28px; flex-shrink: 0; }
.sbb-info { flex: 1; }
.sbb-title { font-size: 14px; font-weight: 800; color: #d4a060; margin-bottom: 2px; }
.sbb-sub   { font-size: 11px; color: #78716c; }
.sbb-saving { font-size: 18px; font-weight: 900; color: #4ade80; white-space: nowrap; }

.place-btn { background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border: none; border-radius: 12px; padding: 15px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(200,129,58,0.35); }
.place-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,129,58,0.5); }
.cup-msg-input { resize: none; font-family: 'Playfair Display', serif; font-style: italic; }
.cup-msg-meta { display: flex; justify-content: space-between; margin-top: 6px; }
.cup-msg-hint { font-size: 11px; color: #a8a29e; }
.cup-msg-count { font-size: 11px; color: #a8a29e; }

/* Order summary */
.order-summary { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 22px; position: sticky; top: 88px; }
.order-summary h3 { font-size: 15px; font-weight: 700; color: #1c1917; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f5f0ea; }

.sum-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #faf7f2; }
.sum-item-img { width: 40px; height: 40px; border-radius: 8px; flex-shrink: 0; position: relative; overflow: hidden; }
.sum-img-bg { position: absolute; inset: 0; }
.sum-photo  { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.sum-name-wrap { flex: 1; display: flex; align-items: center; gap: 6px; min-width: 0; }
.sum-name  { font-size: 13px; color: #57534e; flex: 1; min-width: 0; }
.sum-size-badge { font-size: 9px; font-weight: 800; background: #1c1917; color: #d4a060; border-radius: 4px; padding: 2px 5px; flex-shrink: 0; }
.sum-price { font-size: 13px; font-weight: 700; color: #1c1917; white-space: nowrap; }

.sum-divider    { border: none; border-top: 1px solid #f0ebe4; margin: 10px 0; }
.sum-row        { display: flex; justify-content: space-between; font-size: 13px; color: #57534e; padding: 5px 0; }
.discount-row span { color: #16a34a; font-weight: 600; }
.sum-row .free  { color: #10b981; font-weight: 700; }
.free-hint      { font-size: 12px; color: #c8813a; background: #fdf3e7; border-radius: 8px; padding: 8px 12px; margin: 6px 0; text-align: center; }
.promo-ship-badge { font-size: 13px; color: #065f46; background: #d1fae5; border-radius: 8px; padding: 8px 12px; margin: 6px 0; text-align: center; font-weight: 600; }
.sum-total      { display: flex; justify-content: space-between; font-size: 17px; font-weight: 900; color: #1c1917; padding: 12px 0 0; border-top: 2px solid #f0ebe4; margin-top: 6px; }
</style>