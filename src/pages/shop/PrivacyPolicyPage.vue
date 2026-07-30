<script setup lang="ts">
import { useMeta } from '../../composables/useMeta'
useMeta()
</script>

<template>
  <div class="legal-page">
    <div class="legal-inner">
      <h1>Privacy Policy</h1>
      <p class="updated">Last updated: 29 July 2026</p>

      <div class="disclaimer">
        ⚠ This is a starting template, not legal advice. Have a qualified lawyer review it — and fill in your
        real company name/registration details — before relying on it for a live business.
      </div>

      <section>
        <h2>1. Who we are</h2>
        <p>4ever Coffee ("we", "us", "our") operates this website and the coffee ordering service available on it. This policy explains what personal data we collect, why, and what rights you have over it.</p>
      </section>

      <section>
        <h2>2. What we collect</h2>
        <ul>
          <li><strong>Account details</strong> — name, username, email, phone number, when you create a customer account.</li>
          <li><strong>Order details</strong> — delivery address, order contents, and order history.</li>
          <li><strong>Payment information</strong> — we never see or store your full card details. Payments are processed directly by Stripe, our payment provider, under their own privacy policy.</li>
          <li><strong>Marketing preferences</strong> — if you subscribe to our newsletter, we store your name, email, and the topics you opted into.</li>
        </ul>
      </section>

      <section>
        <h2>3. How we use it</h2>
        <ul>
          <li>To create and fulfil your orders.</li>
          <li>To let you log in and track past orders.</li>
          <li>To send you marketing emails, but only for the topics you specifically opted into, and only until you unsubscribe.</li>
          <li>To detect and prevent fraud or abuse of the ordering system.</li>
        </ul>
      </section>

      <section>
        <h2>4. Who we share it with</h2>
        <p>We share the minimum necessary data with the services that power this site:</p>
        <ul>
          <li><strong>Stripe</strong> — to process payments.</li>
          <li><strong>Supabase</strong> — our database and account provider, which stores your account and order data securely.</li>
          <li><strong>Resend</strong> — to deliver transactional and marketing emails.</li>
        </ul>
        <p>We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2>5. Your rights</h2>
        <p>You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete your account and associated data, subject to what we're legally required to retain (e.g. transaction records for tax purposes). Contact us using the details below to make a request.</p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>We use essential cookies/local storage to keep you logged in and remember your shopping cart. We don't currently use third-party advertising or tracking cookies.</p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>Questions about this policy? Contact us at <strong>[your business email here]</strong>.</p>
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
