import { defineConfig, devices } from '@playwright/test'

// Runs against the live deployment by default — this app's checkout flow
// depends on real Supabase/Stripe/webhook infrastructure that a local dev
// server can't fully replicate (see PaymentPage/create-payment-intent).
// Override with E2E_BASE_URL to point at a different environment.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://4ever-roastery-git-main-4ever-roastery.vercel.app',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
