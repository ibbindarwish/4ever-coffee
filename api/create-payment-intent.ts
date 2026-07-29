import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { stripe } from './_lib/stripe.js'
import { calcTotals, type CartItemInput } from './_lib/pricing.js'

interface DeliveryInput {
  name: string; email: string; phone: string
  address: string; city: string; zip?: string
}

interface RequestBody {
  items: CartItemInput[]
  promoCode?: string
  delivery: DeliveryInput
  customerId?: string // Supabase auth.users id, if the buyer is logged in
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body: RequestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { items, promoCode, delivery, customerId } = body

    if (!items?.length)     return res.status(400).json({ error: 'Cart is empty' })
    if (!delivery?.email)   return res.status(400).json({ error: 'Delivery details are required' })

    const productIds = [...new Set(items.map(i => i.productId))]
    const { data: products, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, price')
      .in('id', productIds)

    if (prodErr) return res.status(500).json({ error: 'Failed to load products' })

    let promo = null
    if (promoCode) {
      const { data } = await supabaseAdmin
        .from('promo_codes')
        .select('code, type, value, min_order, active, staff_role')
        .eq('code', promoCode.trim().toUpperCase())
        .is('staff_role', null) // staff/admin auto-apply codes can never be redeemed via this field
        .maybeSingle()
      promo = data
    }

    const { subtotal, discount, shipping, total } = calcTotals(items, products ?? [], promo)

    if (total <= 0) return res.status(400).json({ error: 'Order total must be greater than zero' })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'gbp',
      metadata: {
        cart:       JSON.stringify(items),
        promoCode:  promo?.code ?? '',
        delivery:   JSON.stringify(delivery),
        customerId: customerId ?? '',
        subtotal:   subtotal.toFixed(2),
        discount:   discount.toFixed(2),
        shipping:   shipping.toFixed(2),
        total:      total.toFixed(2),
      },
    })

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      subtotal, discount, shipping, total,
    })
  } catch (err: any) {
    console.error('[create-payment-intent] error:', err)
    return res.status(500).json({ error: err?.message ?? 'Failed to create payment intent' })
  }
}
