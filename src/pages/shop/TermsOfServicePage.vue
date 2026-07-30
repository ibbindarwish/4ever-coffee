<script setup lang="ts">
import { useMeta } from '../../composables/useMeta'
useMeta()
</script>

<template>
  <div class="legal-page">
    <div class="legal-inner">
      <h1>Terms of Service</h1>
      <p class="updated">Last updated: 29 July 2026</p>

      <div class="disclaimer">
        ⚠ This is a starting template, not legal advice. Have a qualified lawyer review it — and fill in your
        real company name/registration details — before relying on it for a live business.
      </div>

      <section>
        <h2>1. Acceptance of terms</h2>
        <p>By creating an account or placing an order on this site, you agree to these terms. If you don't agree, please don't use the service.</p>
      </section>

      <section>
        <h2>2. Accounts</h2>
        <p>You're responsible for keeping your account password secure and for all activity under your account. Let us know immediately if you believe your account has been compromised.</p>
      </section>

      <section>
        <h2>3. Orders and payment</h2>
        <ul>
          <li>Prices are shown in GBP (£) and include any applicable taxes unless stated otherwise.</li>
          <li>Payment is processed securely by Stripe at the time of ordering. We do not charge your card ourselves and never see your full card number.</li>
          <li>An order is only confirmed once payment has been successfully processed — you'll see an order confirmation with an order number.</li>
          <li>We reserve the right to refuse or cancel an order (e.g. suspected fraud, stock unavailability), in which case you'll be refunded in full.</li>
        </ul>
      </section>

      <section>
        <h2>4. Delivery</h2>
        <p>We aim to deliver within the estimated windows shown at checkout, but these are estimates, not guarantees. See our <RouterLink to="/shop/refund-policy">Refund &amp; Delivery Policy</RouterLink> for details on delayed or missing orders.</p>
      </section>

      <section>
        <h2>5. Promo codes and loyalty rewards</h2>
        <p>Promotional codes and loyalty rewards are provided at our discretion, may have expiry dates or minimum order values, and cannot be combined unless explicitly stated. We reserve the right to withdraw or change promotions at any time.</p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You agree not to misuse the site — including attempting to interfere with its normal operation, submit fraudulent payment details, or abuse promotional offers by creating multiple accounts.</p>
      </section>

      <section>
        <h2>7. Limitation of liability</h2>
        <p>We provide this service "as is." To the extent permitted by law, we aren't liable for indirect or consequential losses arising from your use of the site. Nothing in these terms limits liability that cannot legally be limited (e.g. for fraud or death/personal injury caused by negligence).</p>
      </section>

      <section>
        <h2>8. Changes to these terms</h2>
        <p>We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.</p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>Questions? Contact us at <strong>[your business email here]</strong>.</p>
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
a { color: #c8813a; font-weight: 600; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
