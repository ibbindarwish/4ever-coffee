<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { useOrdersStore } from '../../stores/orders'
import { useProductsStore } from '../../stores/products'
import { usePromoStore } from '../../stores/promo'
import { useLoyaltyStore } from '../../stores/loyalty'
import { useCheckoutStore } from '../../stores/checkout'

const router   = useRouter()
const cart     = useCartStore()
const orders   = useOrdersStore()
const products = useProductsStore()
const promo    = usePromoStore()
const loyalty  = useLoyaltyStore()
const checkout = useCheckoutStore()

// Guard — redirect back if no delivery info
onMounted(() => {
  if (!checkout.hasData()) router.replace('/shop/checkout')
})

// ── Payment method ──────────────────────────────────
type PayMethod = 'card' | 'paypal' | 'apple' | 'google'
const payMethod = ref<PayMethod>('card')

// ── Card form ───────────────────────────────────────
const cardNumber  = ref('')
const cardName    = ref('')
const cardExpiry  = ref('')
const cardCVV     = ref('')
const cvvFocused  = ref(false)
const errors      = ref<Record<string, string>>({})
const touched     = ref<Record<string, boolean>>({})
const processing  = ref(false)

// ── Card brand detection ─────────────────────────────
const cardBrand = computed(() => {
  const n = cardNumber.value.replace(/\s/g, '')
  if (/^4/.test(n))            return 'visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n))        return 'amex'
  if (/^6(?:011|22|4[4-9]|5)/.test(n)) return 'discover'
  return 'generic'
})

const cardGradient = computed(() => ({
  visa:       'linear-gradient(135deg, #1a1f71 0%, #1565c0 100%)',
  mastercard: 'linear-gradient(135deg, #1c1c1c 0%, #7b0000 100%)',
  amex:       'linear-gradient(135deg, #006fcf 0%, #00a8e0 100%)',
  discover:   'linear-gradient(135deg, #c25a17 0%, #f4a261 100%)',
  generic:    'linear-gradient(135deg, #1c1917 0%, #3a2e28 100%)',
}[cardBrand.value]))

const cardBrandLabel = computed(() => ({
  visa: 'VISA', mastercard: 'MC', amex: 'AMEX', discover: 'DISC', generic: '',
}[cardBrand.value]))

const cardNumberLength = computed(() => cardBrand.value === 'amex' ? 15 : 16)
const cvvLength        = computed(() => cardBrand.value === 'amex' ? 4  : 3)

// ── Luhn checksum — catches mistyped digits, not just wrong length ──
function luhnValid(digits: string) {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = +digits[i]
    if (double) { d *= 2; if (d > 9) d -= 9 }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

// ── Formatted display values ────────────────────────
const displayNumber = computed(() => {
  const raw = cardNumber.value.replace(/\s/g, '').padEnd(16, '•')
  if (cardBrand.value === 'amex') {
    return `${raw.slice(0,4)} ${raw.slice(4,10)} ${raw.slice(10,15)}`
  }
  return raw.match(/.{1,4}/g)?.join(' ') ?? ''
})

const displayExpiry = computed(() =>
  cardExpiry.value || 'MM/YY'
)

// ── Input formatters ────────────────────────────────
function onCardNumberInput(e: Event) {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  val = val.slice(0, cardNumberLength.value)
  if (cardBrand.value === 'amex') {
    val = val.replace(/(\d{4})(\d{1,6})?(\d{1,5})?/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    )
  } else {
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  cardNumber.value = val
  if (touched.value.number) validateField('number')
}

function onNameInput(e: Event) {
  const input = e.target as HTMLInputElement
  cardName.value = input.value.replace(/[^A-Za-z\s'-]/g, '').toUpperCase().slice(0, 40)
  if (touched.value.name) validateField('name')
}

function onExpiryInput(e: Event) {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '').slice(0, 4)
  // auto-correct an impossible first month digit (e.g. "5" -> "05")
  if (val.length === 1 && +val[0] > 1) val = '0' + val[0]
  if (val.length >= 2) {
    const mm = Math.min(+val.slice(0, 2), 12) || 1
    val = String(mm).padStart(2, '0') + val.slice(2)
  }
  if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
  cardExpiry.value = val
  if (touched.value.expiry) validateField('expiry')
}

function onCVVInput(e: Event) {
  const input = e.target as HTMLInputElement
  cardCVV.value = input.value.replace(/\D/g, '').slice(0, cvvLength.value)
  if (touched.value.cvv) validateField('cvv')
}

function onFieldBlur(field: 'number' | 'name' | 'expiry' | 'cvv') {
  touched.value[field] = true
  validateField(field)
}

// ── Totals ──────────────────────────────────────────
const discount      = computed(() => promo.calcDiscount(cart.subtotal))
const effectiveShip = computed(() => promo.isFreeShip() ? 0 : cart.shipping)
const finalTotal    = computed(() => Math.max(0, cart.subtotal - discount.value + effectiveShip.value))

// ── Validation — checked live per field, not just on submit ──
function checkNumber() {
  const n = cardNumber.value.replace(/\s/g, '')
  if (!n)                                   return 'Card number is required'
  if (cardBrand.value === 'generic')        return 'Unrecognized or unsupported card type'
  if (n.length !== cardNumberLength.value)  return `Card number must be ${cardNumberLength.value} digits`
  if (!luhnValid(n))                        return 'Card number is invalid — please check the digits'
  return ''
}

function checkName() {
  const v = cardName.value.trim()
  if (!v)                              return 'Cardholder name is required'
  if (v.length < 3)                    return 'Name is too short'
  if (!/^[A-Z\s'-]+$/.test(v))         return 'Name may only contain letters'
  return ''
}

function checkExpiry() {
  const m = cardExpiry.value.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return 'Enter expiry as MM/YY'
  const mm = +m[1], yy = +m[2]
  if (mm < 1 || mm > 12) return 'Invalid month'
  const now = new Date()
  const nowY = now.getFullYear(), nowM = now.getMonth() + 1
  if (2000 + yy < nowY || (2000 + yy === nowY && mm < nowM)) return 'Card has expired'
  return ''
}

function checkCVV() {
  if (!cardCVV.value)                        return 'Security code is required'
  if (cardCVV.value.length !== cvvLength.value) return `${cvvLength.value}-digit security code required`
  return ''
}

const fieldChecks = { number: checkNumber, name: checkName, expiry: checkExpiry, cvv: checkCVV }

function validateField(field: keyof typeof fieldChecks) {
  const msg = fieldChecks[field]()
  if (msg) errors.value[field] = msg
  else     delete errors.value[field]
}

const isCardValid = computed(() =>
  payMethod.value !== 'card' ||
  (!checkNumber() && !checkName() && !checkExpiry() && !checkCVV())
)

function validate() {
  errors.value = {}
  if (payMethod.value !== 'card') return true
  ;(Object.keys(fieldChecks) as (keyof typeof fieldChecks)[]).forEach(f => {
    touched.value[f] = true
    validateField(f)
  })
  return Object.keys(errors.value).length === 0
}

// ── Place order ──────────────────────────────────────
async function pay() {
  if (!validate()) return
  processing.value = true

  await new Promise(r => setTimeout(r, 1800))

  const id = orders.placeOrder({
    items:     cart.items.map(i => ({ ...i })),
    customer:  { ...checkout.delivery },
    subtotal:  cart.subtotal,
    shipping:  effectiveShip.value,
    discount:  discount.value || undefined,
    promoCode: promo.applied?.code,
    total:     finalTotal.value,
  })
  cart.items.forEach(item => products.updateStock(item.product.id, -item.qty))
  loyalty.earnFromOrder(finalTotal.value, id)
  cart.clearCart()
  promo.clear()
  checkout.clear()
  router.push({ name: 'success', query: { id } })
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

          <!-- Payment method tabs -->
          <div class="method-tabs">
            <button class="method-tab" :class="{ active: payMethod === 'card' }" @click="payMethod = 'card'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Card
            </button>
            <button class="method-tab" :class="{ active: payMethod === 'paypal' }" @click="payMethod = 'paypal'">
              <span class="pp-icon">P</span> PayPal
            </button>
            <button class="method-tab" :class="{ active: payMethod === 'apple' }" @click="payMethod = 'apple'">
              <span class="ap-icon">🍎</span> Apple Pay
            </button>
            <button class="method-tab" :class="{ active: payMethod === 'google' }" @click="payMethod = 'google'">
              <span class="gp-icon">G</span> Google Pay
            </button>
          </div>

          <!-- ── CARD FORM ── -->
          <div v-if="payMethod === 'card'" class="card-section">

            <!-- Live card visual -->
            <div class="card-scene">
              <div class="credit-card" :class="{ flipped: cvvFocused }">

                <!-- Front -->
                <div class="card-face card-front" :style="{ background: cardGradient }">
                  <div class="card-shine"></div>
                  <div class="card-top-row">
                    <div class="card-chip">
                      <div class="chip-line h1"></div>
                      <div class="chip-line h2"></div>
                      <div class="chip-line v1"></div>
                      <div class="chip-line v2"></div>
                      <div class="chip-center"></div>
                    </div>
                    <div class="card-brand-label">{{ cardBrandLabel }}</div>
                  </div>
                  <div class="card-number-display">{{ displayNumber }}</div>
                  <div class="card-bottom-row">
                    <div class="card-holder-block">
                      <div class="card-field-label">Card Holder</div>
                      <div class="card-field-val">{{ cardName || 'FULL NAME' }}</div>
                    </div>
                    <div class="card-expiry-block">
                      <div class="card-field-label">Expires</div>
                      <div class="card-field-val">{{ displayExpiry }}</div>
                    </div>
                  </div>
                </div>

                <!-- Back -->
                <div class="card-face card-back" :style="{ background: cardGradient }">
                  <div class="card-shine"></div>
                  <div class="card-stripe"></div>
                  <div class="card-sig-row">
                    <div class="card-sig-strip">
                      <div class="sig-lines">
                        <span v-for="i in 8" :key="i"></span>
                      </div>
                      <div class="cvv-box">{{ cardCVV ? '•'.repeat(cardCVV.length) : '•••' }}</div>
                    </div>
                  </div>
                  <div class="card-back-brand">{{ cardBrandLabel }}</div>
                  <div class="card-back-note">This card is property of 4ever Coffee Ltd. Misuse is subject to prosecution.</div>
                </div>
              </div>
            </div>

            <!-- Card inputs -->
            <div class="card-form">
              <div class="form-group">
                <label>Card Number</label>
                <div class="input-icon-wrap">
                  <input
                    :value="cardNumber"
                    @input="onCardNumberInput"
                    @blur="onFieldBlur('number')"
                    class="input" :class="{ error: touched.number && errors.number, valid: touched.number && !errors.number && cardNumber }"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    spellcheck="false"
                  />
                  <span class="input-brand-chip" v-if="cardBrand !== 'generic'">{{ cardBrandLabel }}</span>
                </div>
                <span v-if="touched.number && errors.number" class="err">{{ errors.number }}</span>
              </div>

              <div class="form-group">
                <label>Cardholder Name</label>
                <input
                  :value="cardName"
                  @input="onNameInput"
                  @blur="onFieldBlur('name')"
                  class="input" :class="{ error: touched.name && errors.name, valid: touched.name && !errors.name && cardName }"
                  placeholder="As it appears on card"
                  autocomplete="cc-name"
                  spellcheck="false"
                />
                <span v-if="touched.name && errors.name" class="err">{{ errors.name }}</span>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label>Expiry Date</label>
                  <input
                    :value="cardExpiry"
                    @input="onExpiryInput"
                    @blur="onFieldBlur('expiry')"
                    class="input" :class="{ error: touched.expiry && errors.expiry, valid: touched.expiry && !errors.expiry && cardExpiry }"
                    placeholder="MM/YY" maxlength="5" inputmode="numeric"
                    autocomplete="cc-exp"
                  />
                  <span v-if="touched.expiry && errors.expiry" class="err">{{ errors.expiry }}</span>
                </div>
                <div class="form-group">
                  <label>CVV <span class="cvv-hint">({{ cvvLength }} digits)</span></label>
                  <div class="input-icon-wrap">
                    <input
                      :value="cardCVV"
                      @input="onCVVInput"
                      @focus="cvvFocused = true"
                      @blur="cvvFocused = false; onFieldBlur('cvv')"
                      class="input" :class="{ error: touched.cvv && errors.cvv, valid: touched.cvv && !errors.cvv && cardCVV }"
                      placeholder="•••" type="password"
                      :maxlength="cvvLength"
                      inputmode="numeric"
                      autocomplete="off"
                    />
                    <svg class="cvv-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <span v-if="touched.cvv && errors.cvv" class="err">{{ errors.cvv }}</span>
                  <span class="cvv-note">Never share this code — we never ask for it by phone or email.</span>
                </div>
              </div>
            </div>

            <!-- Security badges -->
            <div class="security-row">
              <div class="sec-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                256-bit SSL
              </div>
              <div class="sec-badge">🛡 PCI DSS</div>
              <div class="sec-badge">🔒 3D Secure</div>
              <div class="sec-badge">✓ Verified by Visa</div>
            </div>
          </div>

          <!-- ── PAYPAL ── -->
          <div v-else-if="payMethod === 'paypal'" class="alt-pay-panel">
            <div class="alt-pay-logo paypal-logo">Pay<span>Pal</span></div>
            <p class="alt-pay-desc">You will be redirected to PayPal to complete your payment securely.</p>
            <div class="alt-pay-email">Paying as: <strong>{{ checkout.delivery.email || 'your@email.com' }}</strong></div>
          </div>

          <!-- ── APPLE PAY ── -->
          <div v-else-if="payMethod === 'apple'" class="alt-pay-panel">
            <div class="alt-pay-logo apple-logo">🍎 Pay</div>
            <p class="alt-pay-desc">Use Face ID or Touch ID on your Apple device to authenticate.</p>
            <div class="apple-device-hint">Make sure you're on Safari on an Apple device to use Apple Pay.</div>
          </div>

          <!-- ── GOOGLE PAY ── -->
          <div v-else class="alt-pay-panel">
            <div class="alt-pay-logo google-logo"><span class="g-b">G</span>oogle Pay</div>
            <p class="alt-pay-desc">Pay quickly with your saved Google Pay card.</p>
            <div class="alt-pay-email">Paying as: <strong>{{ checkout.delivery.email || 'your@email.com' }}</strong></div>
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
          <button class="pay-btn" :class="{ loading: processing }" @click="pay" :disabled="processing || !isCardValid">
            <template v-if="processing">
              <span class="spinner"></span> Processing…
            </template>
            <template v-else>
              🔒 Pay £{{ finalTotal.toFixed(2) }}
            </template>
          </button>

          <p class="pay-note">Your payment is encrypted and secure. We never store your card details.</p>
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

/* ── Method tabs ── */
.method-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
@media (max-width: 500px) { .method-tabs { grid-template-columns: repeat(2, 1fr); } }

.method-tab {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 8px; border: 1.5px solid #e7e5e4; border-radius: 10px;
  background: #fff; font-size: 13px; font-weight: 600; color: #78716c;
  cursor: pointer; transition: all .15s; font-family: inherit;
}
.method-tab svg { width: 16px; height: 16px; }
.method-tab:hover  { border-color: #d4a060; color: #1c1917; }
.method-tab.active { border-color: #d4a060; background: #fffbf5; color: #1c1917; box-shadow: 0 0 0 3px rgba(212,160,96,.12); }

.pp-icon { font-weight: 900; color: #003087; font-style: italic; font-size: 14px; }
.ap-icon { font-size: 14px; }
.gp-icon { font-weight: 900; font-size: 14px; color: #4285f4; }

/* ── Credit card visual ── */
.card-scene { perspective: 1000px; height: 210px; margin-bottom: 4px; }

.credit-card {
  width: 340px; height: 210px; position: relative;
  transform-style: preserve-3d; transition: transform .6s cubic-bezier(.4,0,.2,1);
  margin: 0 auto;
}
.credit-card.flipped { transform: rotateY(180deg); }

.card-face {
  position: absolute; inset: 0; border-radius: 16px;
  backface-visibility: hidden; overflow: hidden;
  box-shadow: 0 24px 48px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.2);
  padding: 20px 24px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.card-back { transform: rotateY(180deg); }

.card-shine {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
}

/* Chip */
.card-top-row { display: flex; align-items: center; justify-content: space-between; }
.card-chip {
  width: 44px; height: 34px; border-radius: 6px;
  background: linear-gradient(135deg, #d4a060, #f0c060, #d4a060);
  position: relative; overflow: hidden;
}
.chip-line { position: absolute; background: rgba(0,0,0,0.15); }
.chip-line.h1 { top: 33%; left: 0; right: 0; height: 1px; }
.chip-line.h2 { top: 67%; left: 0; right: 0; height: 1px; }
.chip-line.v1 { left: 33%; top: 0; bottom: 0; width: 1px; }
.chip-line.v2 { left: 67%; top: 0; bottom: 0; width: 1px; }
.chip-center { position: absolute; inset: 25%; border-radius: 2px; background: rgba(0,0,0,0.1); }

.card-brand-label { font-size: 18px; font-weight: 900; color: rgba(255,255,255,0.9); letter-spacing: .08em; font-style: italic; }

.card-number-display {
  font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.9);
  letter-spacing: .18em; font-family: 'Courier New', monospace;
}

.card-bottom-row { display: flex; justify-content: space-between; align-items: flex-end; }
.card-field-label { font-size: 8px; text-transform: uppercase; letter-spacing: .12em; color: rgba(255,255,255,0.5); margin-bottom: 3px; }
.card-field-val   { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: .05em; }

/* Back face */
.card-stripe { height: 40px; background: rgba(0,0,0,0.6); margin: 0 -24px; }
.card-sig-row { padding: 8px 0; }
.card-sig-strip {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border-radius: 4px; padding: 8px 10px;
}
.sig-lines { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.sig-lines span { display: block; height: 5px; background: repeating-linear-gradient(90deg,#a0a0a0,#a0a0a0 3px,#e0e0e0 3px,#e0e0e0 6px); border-radius: 1px; }
.cvv-box { font-size: 16px; font-weight: 900; color: #1c1917; letter-spacing: .1em; font-family: 'Courier New', monospace; min-width: 40px; text-align: right; }
.card-back-brand { font-size: 14px; font-weight: 900; color: rgba(255,255,255,0.7); text-align: right; font-style: italic; }
.card-back-note  { font-size: 7px; color: rgba(255,255,255,0.35); line-height: 1.4; text-align: center; }

/* ── Card inputs ── */
.card-form  { display: flex; flex-direction: column; gap: 14px; background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 22px 24px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
label       { font-size: 11px; font-weight: 600; color: #78716c; text-transform: uppercase; letter-spacing: .06em; }
.cvv-hint   { font-weight: 400; text-transform: none; letter-spacing: 0; color: #a8a29e; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 480px) { .form-row-2 { grid-template-columns: 1fr; } }

.input {
  padding: 12px 14px; border: 1.5px solid #e7e5e4; border-radius: 9px;
  font-size: 14px; outline: none; background: #faf7f2; color: #1c1917;
  transition: border-color .15s, background .15s; width: 100%; box-sizing: border-box; font-family: inherit;
}
.input:focus { border-color: #d4a060; background: #fff; }
.input.error { border-color: #ef4444; background: #fef2f2; }
.input.valid { border-color: #22c55e; }
.err { font-size: 11px; color: #ef4444; font-weight: 600; }
.cvv-note { font-size: 10px; color: #a8a29e; line-height: 1.4; }

.input-icon-wrap { position: relative; }
.input-icon-wrap .input { padding-right: 52px; }
.input-brand-chip {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  font-size: 10px; font-weight: 900; color: #fff; background: #1c1917;
  border-radius: 4px; padding: 2px 6px; letter-spacing: .04em; font-style: italic;
}
.cvv-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #a8a29e; pointer-events: none; }

/* Security badges */
.security-row { display: flex; flex-wrap: wrap; gap: 8px; }
.sec-badge {
  display: flex; align-items: center; gap: 4px;
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
  padding: 5px 10px; font-size: 11px; font-weight: 600; color: #166534;
}
.sec-badge svg { width: 12px; height: 12px; }

/* Alt pay panels */
.alt-pay-panel {
  background: #fff; border: 1px solid #f0ebe4; border-radius: 16px;
  padding: 32px 24px; text-align: center;
}
.alt-pay-logo { font-size: 28px; font-weight: 900; margin-bottom: 12px; }
.paypal-logo { color: #003087; }
.paypal-logo span { color: #009cde; }
.apple-logo  { color: #1c1917; }
.google-logo { color: #1c1917; }
.g-b { color: #4285f4; font-weight: 900; }
.alt-pay-desc  { font-size: 14px; color: #57534e; line-height: 1.6; margin-bottom: 12px; }
.alt-pay-email { font-size: 13px; color: #a8a29e; }
.apple-device-hint { font-size: 12px; color: #f59e0b; background: #fffbeb; border-radius: 8px; padding: 8px 12px; margin-top: 8px; }

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