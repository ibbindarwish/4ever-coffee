<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore, SIZE_NAME } from '../../stores/cart'

const cart = useCartStore()
</script>

<template>
  <div class="cart-page">
    <div class="page-inner">
      <h1 class="page-title">Your Order</h1>

      <div v-if="cart.items.length === 0" class="empty">
        <svg class="empty-cup" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 30h60l-7 52H27L20 30z" fill="#f5f0ea" stroke="#d4a060" stroke-width="2.5" stroke-linejoin="round"/>
          <rect x="17" y="24" width="66" height="9" rx="4.5" fill="#ede8e1" stroke="#d4a060" stroke-width="2"/>
          <path d="M70 44 Q86 44 86 56 Q86 68 70 68" stroke="#d4a060" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M40 14 Q43 7 40 2M50 11 Q53 4 50 0M60 14 Q63 7 60 2" stroke="#c8813a" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
        </svg>
        <h2>Your basket is empty</h2>
        <p>Discover our award-winning coffee, pastries and London sweets.</p>
        <RouterLink to="/shop/menu" class="browse-btn">Browse Menu →</RouterLink>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items">
          <div v-for="item in cart.items" :key="`${item.product.id}-${item.size}`" class="cart-row">
            <div class="cart-img">
              <div class="cart-img-bg" :style="{ background: item.product.gradient }"></div>
              <img :src="item.product.image" :alt="item.product.name" class="cart-photo"
                   @error="() => {}"/>
            </div>
            <div class="cart-info">
              <div class="cart-cat">{{ item.product.category }}</div>
              <div class="cart-name">{{ item.product.name }}</div>
              <div class="cart-meta">
                <span class="size-badge">{{ SIZE_NAME[item.size] }}</span>
                <span class="cart-scent">{{ item.product.scentType }}</span>
              </div>
            </div>
            <div class="cart-qty">
              <button @click="cart.setQty(item.product.id, item.size, item.qty - 1)">−</button>
              <span>{{ item.qty }}</span>
              <button @click="cart.setQty(item.product.id, item.size, item.qty + 1)">+</button>
            </div>
            <div class="cart-line-price">£{{ cart.effectivePrice(item).toFixed(2) }} ea</div>
            <button class="cart-remove" @click="cart.removeFromCart(item.product.id, item.size)" title="Remove">✕</button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="sum-row"><span>Subtotal</span><span>£{{ cart.subtotal.toFixed(2) }}</span></div>
          <div class="sum-row">
            <span>Delivery</span>
            <span :class="{ free: cart.shipping === 0 }">
              {{ cart.shipping === 0 ? 'FREE' : '£' + cart.shipping.toFixed(2) }}
            </span>
          </div>
          <div v-if="cart.shipping > 0" class="free-hint">Add £{{ (30 - cart.subtotal).toFixed(2) }} more for free delivery!</div>
          <div class="sum-total"><span>Total</span><span>£{{ cart.total.toFixed(2) }}</span></div>
          <RouterLink to="/shop/checkout" class="checkout-btn">Proceed to Checkout →</RouterLink>
          <RouterLink to="/shop/menu" class="continue-link">← Continue Ordering</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page { min-height: 60vh; background: #faf7f2; }
.page-inner { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }
.page-title { font-size: 32px; font-weight: 700; color: #1c1917; margin-bottom: 28px; font-family: 'Playfair Display', serif; }

.empty { text-align: center; padding: 80px 0; }
.empty-cup { width: 96px; height: 96px; margin: 0 auto 20px; }
.empty h2 { font-size: 24px; font-weight: 700; color: #1c1917; margin: 0 0 10px; font-family: 'Playfair Display', serif; }
.empty p { color: #78716c; margin: 0 0 28px; line-height: 1.65; max-width: 320px; margin-left: auto; margin-right: auto; }
.browse-btn { display: inline-block; background: linear-gradient(135deg, #c8813a, #d4a060); color: #fff; border-radius: 12px; padding: 13px 32px; font-weight: 700; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 16px rgba(200,129,58,0.35); }
.browse-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,129,58,0.5); }

.cart-layout { display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start; }
@media (max-width: 780px) { .cart-layout { grid-template-columns: 1fr; } }

.cart-items { display: flex; flex-direction: column; gap: 12px; }
.cart-row { background: #fff; border: 1px solid #f0ebe4; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 16px; transition: box-shadow 0.2s; }
.cart-row:hover { box-shadow: 0 4px 16px rgba(44,16,8,0.07); }

.cart-img { width: 76px; height: 76px; border-radius: 12px; flex-shrink: 0; position: relative; overflow: hidden; }
.cart-img-bg { position: absolute; inset: 0; }
.cart-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }

.cart-info { flex: 1; min-width: 0; }
.cart-cat  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #c8813a; margin-bottom: 2px; }
.cart-name { font-size: 15px; font-weight: 700; color: #1c1917; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-meta { display: flex; align-items: center; gap: 8px; margin-top: 3px; }
.size-badge { font-size: 10px; font-weight: 800; background: #1c1917; color: #d4a060; border-radius: 5px; padding: 2px 7px; letter-spacing: 0.04em; flex-shrink: 0; }
.cart-scent { font-size: 12px; color: #a8a29e; }

.cart-qty { display: flex; align-items: center; gap: 10px; }
.cart-qty button { width: 30px; height: 30px; border: 1px solid #e7e5e4; border-radius: 8px; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.cart-qty button:hover { background: #fdf3e7; border-color: #d4a060; color: #92400e; }
.cart-qty span { font-size: 15px; font-weight: 700; color: #1c1917; width: 24px; text-align: center; }

.cart-line-price { font-size: 13px; font-weight: 700; color: #57534e; min-width: 68px; text-align: right; white-space: nowrap; }
.cart-remove { background: none; border: none; font-size: 14px; color: #d1c9c2; cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.15s; }
.cart-remove:hover { color: #ef4444; background: #fee2e2; }

.cart-summary { background: #fff; border: 1px solid #f0ebe4; border-radius: 16px; padding: 24px; position: sticky; top: 88px; }
.cart-summary h3 { font-size: 16px; font-weight: 700; color: #1c1917; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #f5f0ea; }
.sum-row { display: flex; justify-content: space-between; font-size: 14px; color: #57534e; padding: 8px 0; }
.sum-row .free { color: #10b981; font-weight: 700; }
.free-hint { font-size: 12px; color: #c8813a; background: #fdf3e7; border-radius: 8px; padding: 8px 12px; margin: 6px 0 4px; text-align: center; border: 1px solid rgba(200,129,58,0.15); }
.sum-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #1c1917; padding: 14px 0 18px; border-top: 2px solid #f0ebe4; margin-top: 8px; }
.checkout-btn { display: block; background: linear-gradient(135deg,#c8813a,#d4a060); color: #fff; border-radius: 12px; padding: 14px; text-align: center; font-size: 15px; font-weight: 700; text-decoration: none; margin-bottom: 10px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(200,129,58,0.35); }
.checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(200,129,58,0.5); }
.continue-link { display: block; text-align: center; font-size: 13px; color: #a8a29e; text-decoration: none; transition: color 0.15s; }
.continue-link:hover { color: #d4a060; }
</style>