<script setup lang="ts">
import { useMeta } from '../../composables/useMeta'
useMeta()
</script>

<template>
  <div class="legal-page">
    <div class="legal-inner">
      <h1>Refund &amp; Delivery Policy</h1>
      <p class="updated">Last updated: 29 July 2026</p>

      <div class="disclaimer">
        ⚠ This is a starting template, not legal advice. Have a qualified lawyer review it — and fill in your
        real business specifics (delivery radius, exact timings, return address) — before relying on it for a live business.
      </div>

      <section>
        <h2>Delivery</h2>
        <ul>
          <li>Delivery windows shown at checkout are estimates based on current kitchen load, not guarantees.</li>
          <li>Free delivery applies to orders over £30; a standard delivery fee applies below that threshold, shown at checkout before you pay.</li>
          <li>If your order hasn't arrived within a reasonable time past the estimated window, contact us and we'll investigate — if it's genuinely lost, we'll offer a full refund or a free replacement, your choice.</li>
        </ul>
      </section>

      <section>
        <h2>Refunds</h2>
        <ul>
          <li>Because our products are made fresh to order, we can't accept returns for change-of-mind once preparation has started.</li>
          <li>If your order arrives wrong, damaged, or not as described, contact us within 24 hours with a photo where possible, and we'll issue a full refund or send a replacement.</li>
          <li>Approved refunds are issued back to your original payment method via Stripe, typically within 5–10 business days depending on your bank.</li>
          <li>If an order is cancelled or fails before payment completes, no charge is made in the first place — you'll only ever be charged for a confirmed, successful order.</li>
        </ul>
      </section>

      <section>
        <h2>Cancellations</h2>
        <p>If you need to cancel an order, contact us as soon as possible. We can cancel orders that haven't yet entered preparation for a full refund; once preparation has started, we may not be able to cancel, but we'll always try to make it right if something's gone wrong.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>For delivery issues or refund requests, contact us at <strong>[your business email here]</strong> with your order number.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-page { min-height: 70vh; background: #faf7f2; padding: 56px 24px 80px; }
.legal-inner { max-width: 760px; margin: 0 auto; }
h1 { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #1c1917; margin: 0 0 6px; }
.updated { font-size: 13px; color: #a8a29e; margin: 0 0 24px; }
.disclaimer {
  background: #fef3c7; border: 1px solid #fcd34d; border-radius: 10px;
  padding: 14px 18px; font-size: 13px; color: #92400e; margin-bottom: 32px; line-height: 1.6;
}
section { margin-bottom: 28px; }
h2 { font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 10px; }
p { font-size: 14px; color: #44403c; line-height: 1.75; margin: 0 0 10px; }
ul { margin: 0 0 10px; padding-left: 20px; }
li { font-size: 14px; color: #44403c; line-height: 1.75; margin-bottom: 4px; }
strong { color: #1c1917; }
</style>
