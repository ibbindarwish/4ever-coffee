import { stripe } from './_lib/stripe.js'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { SIZE_PRICE, type CupSize } from './_lib/pricing.js'
import { alertAdmin } from './_lib/alertAdmin.js'

// Stripe needs the raw request body to verify the signature — disable Vercel's
// default JSON body parsing for this route only.
export const config = { api: { bodyParser: false } }

interface DeliveryInput {
  name: string; email: string; phone: string
  address: string; city: string; zip?: string
  cupMessage?: string
}

interface CartItem { productId: number; size: CupSize; qty: number }

function genOrderId(): string {
  return `ORD-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()
}

function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sig = req.headers['stripe-signature']
  let event: any

  try {
    const rawBody = await getRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    console.error('[stripe-webhook] signature verification failed:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  if (event.type !== 'payment_intent.succeeded') {
    return res.status(200).json({ received: true })
  }

  const pi = event.data.object

  try {
    // Idempotency — Stripe can redeliver the same event; never double-create.
    const { data: existing } = await supabaseAdmin
      .from('orders').select('id').eq('stripe_payment_intent_id', pi.id).maybeSingle()
    if (existing) return res.status(200).json({ received: true, orderId: existing.id })

    const cart: CartItem[] = JSON.parse(pi.metadata.cart || '[]')
    const delivery: DeliveryInput = JSON.parse(pi.metadata.delivery || '{}')
    const customerId: string | null = pi.metadata.customerId || null
    const subtotal  = Number(pi.metadata.subtotal || 0)
    const discount  = Number(pi.metadata.discount || 0)
    const shipping  = Number(pi.metadata.shipping || 0)
    const total     = Number(pi.metadata.total || 0)
    const promoCode = pi.metadata.promoCode || null

    const productIds = [...new Set(cart.map(i => i.productId))]
    const { data: products } = await supabaseAdmin
      .from('products').select('id, name, price').in('id', productIds)

    const orderId = genOrderId()

    const { error: orderErr } = await supabaseAdmin.from('orders').insert({
      id: orderId,
      customer_id: customerId,
      customer_name: delivery.name,
      customer_email: delivery.email,
      customer_phone: delivery.phone,
      customer_address: delivery.address,
      customer_city: delivery.city,
      subtotal, shipping, discount,
      promo_code: promoCode,
      total,
      status: 'pending',
      stripe_payment_intent_id: pi.id,
      note: delivery.cupMessage || null,
    })
    if (orderErr) throw orderErr

    const orderItems = cart.map(item => {
      const product = products?.find(p => p.id === item.productId)
      return {
        order_id:   orderId,
        product_id: item.productId,
        name:       product?.name ?? 'Unknown item',
        price:      (product?.price ?? 0) + SIZE_PRICE[item.size],
        size:       item.size,
        qty:        item.qty,
      }
    })
    const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems)
    if (itemsErr) throw itemsErr

    for (const item of cart) {
      await supabaseAdmin.rpc('decrement_stock', { p_product_id: item.productId, p_qty: item.qty })
    }

    return res.status(200).json({ received: true, orderId })
  } catch (err: any) {
    console.error('[stripe-webhook] processing failed:', err)
    // A payment succeeded but the order failed to be recorded — a customer
    // may have paid with nothing to show for it. Worth waking someone up.
    await alertAdmin(
      'Payment succeeded but order creation failed',
      `Payment Intent: ${pi.id}\nAmount: ${pi.amount / 100} ${pi.currency}\nError: ${err?.message ?? String(err)}\n\nThis customer paid but has no order — check Stripe and create the order manually.`,
    )
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}
