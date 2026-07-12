import { Resend } from 'resend'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ── Everything inside one top-level try/catch ──────────────────────────────
  try {
    // Safe body parse — req.body may be a string or object depending on runtime
    let body: Record<string, any> = {}
    if (req.body && typeof req.body === 'object') {
      body = req.body
    } else if (typeof req.body === 'string') {
      body = JSON.parse(req.body)
    }

    const type       = String(body.type       ?? '')
    const subject    = String(body.subject    ?? '4ever Coffee Update')
    const promoCode  = body.promoCode ? String(body.promoCode) : undefined
    const recipients: Array<{ email: string; name: string }> = Array.isArray(body.recipients)
      ? body.recipients
      : []

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients provided. Add subscribers first.' })
    }

    const key = process.env.RESEND_API_KEY
    if (!key) {
      return res.status(200).json({
        ok: true,
        sent: 0,
        note: 'RESEND_API_KEY is not set in Vercel. Go to Vercel → Settings → Environment Variables and add it.',
      })
    }

    const resend = new Resend(key)
    const from   = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

    // Send in parallel (capped at 10 to stay inside Vercel's 10s timeout)
    const batch = recipients.slice(0, 10)
    const results = await Promise.allSettled(
      batch.map(r =>
        resend.emails.send({
          from,
          to:      [r.email],
          subject,
          html:    buildCampaignEmail(type, r.name ?? 'Coffee Lover', promoCode),
        })
      )
    )

    let sent = 0
    const errors: string[] = []

    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        errors.push(result.reason?.message ?? 'send failed')
      } else if (result.value?.error) {
        errors.push(result.value.error.message)
      } else {
        sent++
      }
    })

    if (sent === 0 && errors.length > 0) {
      const isTestSender = from.includes('resend.dev')
      const hint = isTestSender
        ? '\n\nNote: using the Resend test sender (onboarding@resend.dev) only works for your own registered email. To send to real customers, add your own domain in Resend → Domains and set FROM_EMAIL in Vercel env vars.'
        : ''
      return res.status(400).json({ error: errors[0] + hint })
    }

    return res.status(200).json({
      ok:     true,
      sent,
      failed: errors.length,
      note:   errors.length ? `${errors.length} email(s) failed: ${errors[0]}` : undefined,
    })

  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err ?? 'Unknown error')
    console.error('[send-campaign]', message)
    return res.status(500).json({ error: 'Server error: ' + message })
  }
}

// ── Email templates ────────────────────────────────────────────────────────────
function buildCampaignEmail(type: string, name: string, promoCode?: string): string {
  const greeting = `<p style="font-size:15px;color:#44403c;margin:0 0 20px;">Hi ${name},</p>`

  function header(eyebrow: string, headline: string, sub: string): string {
    return `<tr><td style="background:linear-gradient(135deg,#1a0804 0%,#2c1008 50%,#4a1e0a 100%);padding:52px 40px 44px;text-align:center;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:38px;font-weight:900;color:#fdf6ec;letter-spacing:-1.5px;">4<span style="color:#d4a060;">ever</span></div>
      <div style="font-size:10px;letter-spacing:.2em;color:#78716c;margin:3px 0;text-transform:uppercase;">Coffee Roastery</div>
      <div style="height:1px;background:rgba(212,160,96,.2);margin:22px auto;max-width:160px;"></div>
      <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:10px;">${eyebrow}</div>
      <div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fdf6ec;line-height:1.3;">${headline}</div>
      <div style="font-size:13px;color:#a8a29e;margin-top:10px;">${sub}</div>
    </td></tr>`
  }

  function footer(): string {
    return `<tr><td style="background:#1c1008;padding:24px 40px;text-align:center;">
      <div style="font-size:11px;color:#44403c;line-height:1.9;">
        You received this because you subscribed at
        <a href="https://4ever-roastery.vercel.app/shop" style="color:#78716c;">4ever Coffee</a>.<br>
        <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Unsubscribe</a>
        &nbsp;·&nbsp;
        <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Visit Shop</a>
      </div>
    </td></tr>`
  }

  function wrap(rows: string): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12);">
          ${rows}
        </table>
      </td></tr>
    </table></body></html>`
  }

  if (type === 'customer-review') {
    return wrap(`
      ${header('Customer Reviews', 'What Our Coffee Lovers Are Saying', 'Real experiences from our community')}
      <tr><td style="background:#fff;padding:36px 40px;">
        ${greeting}
        <p style="font-size:15px;color:#44403c;line-height:1.75;margin:0 0 24px;">We've been blown away by your feedback lately. Here's a taste of what our community has been saying about 4ever Coffee this week.</p>
        ${[
          { author: 'Sarah M.', stars: '★★★★★', text: 'The Ethiopia Yirgacheffe changed my relationship with coffee. Genuinely world-class.' },
          { author: 'Ahmad Al-Rashid', stars: '★★★★★', text: "I've tried every specialty shop in London and 4ever is the one I keep coming back to." },
          { author: 'Priya K.', stars: '★★★★★', text: 'The Victoria Sponge paired with a flat white is the best afternoon break I\'ve had.' },
        ].map(r => `<div style="padding:18px;background:#faf7f2;border-radius:12px;margin-bottom:12px;border:1px solid #ede8e0;">
          <div style="font-size:18px;color:#d4a060;margin-bottom:8px;">${r.stars}</div>
          <p style="font-size:14px;color:#292524;line-height:1.75;margin:0 0 10px;font-style:italic;">${r.text}</p>
          <div style="font-size:12px;font-weight:700;color:#78716c;">— ${r.author}</div>
        </div>`).join('')}
        <div style="text-align:center;margin-top:24px;">
          <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 40px;border-radius:12px;font-weight:700;font-size:15px;">Shop &amp; Leave Your Review →</a>
        </div>
      </td></tr>
      ${footer()}`)
  }

  if (type === 'roastery-update') {
    return wrap(`
      ${header('Roastery Update', 'Fresh From The Roastery', 'New origins. New stories. New flavours.')}
      <tr><td style="background:#fff;padding:36px 40px;">
        ${greeting}
        <div style="background:#faf7f2;border-radius:14px;padding:26px;margin-bottom:22px;border:1px solid #ede8e0;">
          <div style="font-size:48px;margin-bottom:12px;">🇪🇹</div>
          <div style="font-size:10px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">Now Roasting</div>
          <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#1c1917;margin-bottom:4px;">Ethiopian Yirgacheffe</div>
          <div style="font-size:12px;color:#78716c;margin-bottom:14px;">Gedeo Zone, Southern Ethiopia · 1,750–2,200m altitude</div>
          <p style="font-size:14px;color:#44403c;line-height:1.75;margin:0 0 16px;">Washed lot with vivid citrus brightness, jasmine florals and a tea-like clean finish. Roasted to a medium-light profile to preserve the delicate floral character.</p>
        </div>
        <div style="background:#1c1008;border-radius:14px;padding:22px 26px;margin-bottom:24px;">
          <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Roaster's Notes</div>
          <p style="font-size:14px;color:#e7e0d8;line-height:1.8;margin:0;font-style:italic;">"This lot roasted beautifully at medium-light over 9 minutes. Pull it as a pour-over at 92°C for the full floral experience."</p>
          <div style="margin-top:10px;font-size:12px;color:#78716c;font-weight:600;">— James, Head Roaster</div>
        </div>
        <div style="text-align:center;">
          <a href="https://4ever-roastery.vercel.app/shop/roastery" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 40px;border-radius:12px;font-weight:700;font-size:15px;">Explore the Roastery →</a>
        </div>
      </td></tr>
      ${footer()}`)
  }

  if (type === 'new-deals') {
    return wrap(`
      ${header('New Arrivals', "What's New at 4ever Coffee", 'Freshly added — discover your next favourite')}
      <tr><td style="background:#fff;padding:36px 40px;">
        ${greeting}
        <p style="font-size:15px;color:#44403c;line-height:1.75;margin:0 0 24px;">We've just added some exciting new items to our menu. Here are our top picks for this week.</p>
        ${[
          { name: 'Iced Latte', emoji: '🧊', price: '£5.00', desc: 'Double espresso over fresh ice with cold milk — the perfect warm-day pick-me-up.', tag: 'New Seasonal' },
          { name: 'Biscoff Cheesecake', emoji: '🍰', price: '£5.50', desc: 'No-bake cheesecake on a Lotus biscuit base topped with silky Biscoff spread.', tag: 'Best Seller' },
          { name: 'Matcha Latte', emoji: '🍵', price: '£5.25', desc: 'Ceremonial-grade matcha whisked smooth with oat milk — energising and vibrant.', tag: 'Seasonal' },
        ].map(p => `<div style="display:flex;gap:14px;padding:16px;background:#faf7f2;border-radius:12px;margin-bottom:12px;border:1px solid #ede8e0;">
          <div style="font-size:36px;flex-shrink:0;line-height:1;">${p.emoji}</div>
          <div>
            <div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:4px;">${p.name} <span style="font-size:10px;font-weight:700;color:#d4a060;text-transform:uppercase;">${p.tag}</span></div>
            <div style="font-size:13px;color:#78716c;line-height:1.6;margin-bottom:6px;">${p.desc}</div>
            <div style="font-size:18px;font-weight:900;color:#c8813a;">${p.price}</div>
          </div>
        </div>`).join('')}
        <div style="text-align:center;margin-top:24px;">
          <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 40px;border-radius:12px;font-weight:700;font-size:15px;">Browse Full Menu →</a>
        </div>
      </td></tr>
      ${footer()}`)
  }

  // Default: discount
  const code = promoCode ?? 'SAVE20'
  return wrap(`
    ${header('Exclusive Offer', 'A Special Deal Just For You', 'Subscriber-only — valid this week only')}
    <tr><td style="background:#fff;padding:36px 40px;">
      ${greeting}
      <p style="font-size:15px;color:#44403c;line-height:1.75;margin:0 0 24px;">As one of our valued subscribers, here's an exclusive promo code — just for you. Apply it at checkout for an instant discount.</p>
      <div style="background:linear-gradient(135deg,#2c1008,#4a1e0a);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px;">Your Exclusive Code</div>
        <div style="display:inline-block;background:rgba(212,160,96,.15);border:2px dashed rgba(212,160,96,.5);border-radius:12px;padding:16px 36px;margin-bottom:14px;">
          <div style="font-family:Georgia,serif;font-size:36px;font-weight:900;color:#d4a060;letter-spacing:.08em;">${code}</div>
        </div>
        <div style="font-size:14px;color:#a8a29e;">20% off your entire order · No minimum spend</div>
      </div>
      <div style="text-align:center;">
        <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 40px;border-radius:12px;font-weight:700;font-size:15px;">Claim Your Discount →</a>
      </div>
      <div style="text-align:center;margin-top:16px;font-size:12px;color:#a8a29e;">Offer expires 7 days from receipt. One code per order.</div>
    </td></tr>
    ${footer()}`)
}