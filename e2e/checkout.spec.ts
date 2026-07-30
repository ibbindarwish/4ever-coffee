import { test, expect } from '@playwright/test'

// Full happy-path: log in, add an item, checkout, pay with a real Stripe test
// card, and confirm a real order is created server-side by the webhook.
// Requires a test customer account to already exist.
//
// Navigation deliberately uses in-app link clicks (SPA routing) rather than
// page.goto() for every step, past the initial load — a full page.goto()
// triggers a hard reload that resets Pinia state and forces the customer
// auth store to re-hydrate its session from scratch, which is not how a
// real user moves through the app and made this test flaky when tried.
const TEST_EMAIL = process.env.E2E_CUSTOMER_EMAIL ?? 'testcustomer1@example.com'
const TEST_PASSWORD = process.env.E2E_CUSTOMER_PASSWORD ?? 'TestPass123!'

test('customer can log in, buy a coffee, and get a real order', async ({ page }) => {
  await page.goto('/shop/login')

  const declineCookies = page.getByRole('button', { name: /decline/i })
  if (await declineCookies.isVisible().catch(() => false)) await declineCookies.click()

  await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL)
  await page.getByPlaceholder('Your password').fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('**/shop', { timeout: 15_000 })

  await page.locator('a.nav-link[href="/shop/menu"]').click()
  await page.waitForURL('**/shop/menu', { timeout: 15_000 })

  const firstOrderButton = page.locator('.order-btn:not(:disabled)').first()
  await firstOrderButton.waitFor({ state: 'visible', timeout: 15_000 })
  await firstOrderButton.click()

  await page.locator('a.cart-btn').first().click()
  await page.waitForURL('**/shop/cart', { timeout: 15_000 })

  await page.getByRole('link', { name: /proceed to checkout/i }).click()
  await page.waitForURL('**/shop/checkout', { timeout: 15_000 })

  await page.getByPlaceholder('Sara Ahmed').fill('E2E Test')
  await page.getByPlaceholder('sara@example.com').fill(TEST_EMAIL)
  await page.getByPlaceholder('+44 7700 900000').fill('+44 7700 900000')
  await page.getByPlaceholder('12 Baker Street').fill('1 Test Street')
  await page.getByPlaceholder('London').fill('London')
  await page.getByRole('button', { name: /continue to payment/i }).click()

  await page.waitForURL('**/shop/payment', { timeout: 15_000 })

  const stripeFrame = page.frameLocator('iframe[title="Secure payment input frame"][src*="componentName=payment"]')
  await stripeFrame.getByPlaceholder('1234 1234 1234 1234').fill('4242424242424242', { timeout: 20_000 })
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/30')
  await stripeFrame.getByPlaceholder('CVC').fill('123')

  // Dismiss the cookie banner now — it overlaps the email/name fields below
  const declineCookiesAgain = page.getByRole('button', { name: /decline/i })
  if (await declineCookiesAgain.isVisible().catch(() => false)) await declineCookiesAgain.click()

  const stripeEmail = stripeFrame.getByPlaceholder('you@example.com')
  if (await stripeEmail.isVisible().catch(() => false)) await stripeEmail.fill(TEST_EMAIL)

  const stripeName = stripeFrame.getByPlaceholder('First and last name')
  if (await stripeName.isVisible().catch(() => false)) await stripeName.fill('E2E Test')

  const zip = stripeFrame.getByPlaceholder('ZIP')
  if (await zip.isVisible().catch(() => false)) await zip.fill('12345')

  await page.getByRole('button', { name: /pay £/i }).click()

  await expect(page.getByText('Order Placed!')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText(/Order ORD-/)).toBeVisible()
})
