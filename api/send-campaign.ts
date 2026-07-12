// Uses native fetch (Node 18+) — no SDK import that could crash at module load
const RESEND_API = 'https://api.resend.com/emails'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  try {
    // Safe body parse — handles both pre-parsed object and raw string
    let body: any = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' })
    }

    const type      = String(body.type      ?? '')
    const subject   = String(body.subject   ?? '4ever Coffee Update')
    const promoCode = body.promoCode ? String(body.promoCode) : undefined
    const recipients: Array<{ email: string; name: string }> =
      Array.isArray(body.recipients) ? body.recipients : []

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients. Add subscribers in the CRM first.' })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return res.status(200).json({
        ok: true, sent: 0,
        note: 'RESEND_API_KEY is not set. Go to Vercel → Settings → Environment Variables and add it.',
      })
    }

    const from = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

    // Send up to 10 in parallel (Vercel functions timeout at 10 s). The CRM UI
    // chunks larger audiences into multiple calls of 10, but a direct API
    // caller could still send more — report what got skipped rather than
    // silently dropping it.
    const MAX_PER_CALL = 10
    const batch   = recipients.slice(0, MAX_PER_CALL)
    const skipped = recipients.length - batch.length
    const results = await Promise.allSettled(
      batch.map(r =>
        fetch(RESEND_API, {
          method:  'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            from,
            to:      [r.email],
            subject,
            html:    buildEmail(type, r.name ?? 'Coffee Lover', promoCode),
          }),
        })
          .then(async httpRes => {
            const json: any = await httpRes.json().catch(() => ({}))
            if (!httpRes.ok) throw new Error(json?.message ?? json?.name ?? `HTTP ${httpRes.status}`)
            return json
          })
      )
    )

    let sent = 0
    const errors: string[] = []
    results.forEach(r => {
      if (r.status === 'fulfilled') sent++
      else errors.push(r.reason?.message ?? 'send failed')
    })

    if (sent === 0 && errors.length > 0) {
      const isTestSender = from.includes('resend.dev')
      const hint = isTestSender
        ? ' — Using the Resend test sender. You can only send to YOUR OWN email (the one you signed up with at resend.com). Add real subscribers or set FROM_EMAIL in Vercel to your verified domain.'
        : ''
      return res.status(400).json({ error: errors[0] + hint })
    }

    return res.status(200).json({
      ok: true, sent, failed: errors.length,
      ...(skipped > 0 ? { skipped, note: `${skipped} recipient(s) skipped — this endpoint only sends up to ${MAX_PER_CALL} per call.` } : {}),
    })

  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err ?? 'unknown')
    console.error('[send-campaign]', msg)
    return res.status(500).json({ error: 'Unexpected error: ' + msg })
  }
}

// ── Email HTML builders ────────────────────────────────────────────────────────
function buildEmail(type: string, name: string, promoCode?: string): string {
  const hi = `<p style="font-size:15px;color:#44403c;margin:0 0 20px;">Hi ${name},</p>`
  const hdr = (tag: string, h: string, sub: string) =>
    `<tr><td style="background:linear-gradient(135deg,#1a0804,#2c1008,#4a1e0a);padding:52px 40px;text-align:center;">
      <div style="font-family:Georgia,serif;font-size:38px;font-weight:900;color:#fdf6ec;letter-spacing:-1.5px;">4<span style="color:#d4a060;">ever</span></div>
      <div style="font-size:10px;letter-spacing:.2em;color:#78716c;margin:3px 0 0;text-transform:uppercase;">Coffee Roastery</div>
      <div style="height:1px;background:rgba(212,160,96,.2);margin:22px auto;max-width:160px;"></div>
      <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:10px;">${tag}</div>
      <div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fdf6ec;line-height:1.3;">${h}</div>
      <div style="font-size:13px;color:#a8a29e;margin-top:10px;">${sub}</div>
    </td></tr>`
  const ftr = () =>
    `<tr><td style="background:#1c1008;padding:24px 40px;text-align:center;">
      <div style="font-size:11px;color:#44403c;line-height:1.9;">
        You received this because you subscribed at
        <a href="https://4ever-roastery.vercel.app/shop" style="color:#78716c;">4ever Coffee</a>.<br>
        <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Unsubscribe</a>
        &nbsp;·&nbsp;
        <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Visit Shop</a>
      </div>
    </td></tr>`
  const wrap = (rows: string) =>
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12);">
    ${rows}</table></td></tr></table></body></html>`
  const btn = (href: string, label: string) =>
    `<div style="text-align:center;margin-top:24px;"><a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:15px 40px;border-radius:12px;font-weight:700;font-size:15px;">${label}</a></div>`

  if (type === 'customer-review') return wrap(`
    ${hdr('Customer Reviews', 'What Our Coffee Lovers Are Saying', 'Real experiences from our community')}
    <tr><td style="background:#fff;padding:36px 40px;">
      ${hi}
      <p style="font-size:15px;color:#44403c;line-height:1.75;margin:0 0 24px;">Here's what our community has been saying about 4ever Coffee this week.</p>
      ${[
        { a:'Sarah M.',        s:'★★★★★', t:'The Ethiopia Yirgacheffe changed my relationship with coffee. World-class.' },
        { a:'Ahmad Al-Rashid', s:'★★★★★', t:"I've tried every specialty shop in London. 4ever is the one I keep coming back to." },
        { a:'Priya K.',        s:'★★★★★', t:'The Victoria Sponge with a flat white is the best afternoon break I\'ve had.' },
      ].map(r=>`<div style="padding:18px;background:#faf7f2;border-radius:12px;margin-bottom:12px;border:1px solid #ede8e0;">
        <div style="font-size:18px;color:#d4a060;margin-bottom:8px;">${r.s}</div>
        <p style="font-size:14px;color:#292524;line-height:1.75;margin:0 0 10px;font-style:italic;">${r.t}</p>
        <div style="font-size:12px;font-weight:700;color:#78716c;">— ${r.a}</div>
      </div>`).join('')}
      ${btn('https://4ever-roastery.vercel.app/shop/menu', 'Shop &amp; Leave Your Review →')}
    </td></tr>
    ${ftr()}`)

  if (type === 'roastery-update') return wrap(`
    ${hdr('Roastery Update', 'Fresh From The Roastery', 'New origins. New stories. New flavours.')}
    <tr><td style="background:#fff;padding:36px 40px;">
      ${hi}
      <div style="background:#faf7f2;border-radius:14px;padding:26px;margin-bottom:22px;border:1px solid #ede8e0;">
        <div style="font-size:48px;margin-bottom:12px;">🇪🇹</div>
        <div style="font-size:10px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">Now Roasting</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#1c1917;margin-bottom:4px;">Ethiopian Yirgacheffe</div>
        <div style="font-size:12px;color:#78716c;margin-bottom:14px;">Gedeo Zone · 1,750–2,200m</div>
        <p style="font-size:14px;color:#44403c;line-height:1.75;margin:0;">Vivid citrus brightness, jasmine florals and a tea-like clean finish. Medium-light roast.</p>
      </div>
      <div style="background:#1c1008;border-radius:14px;padding:22px 26px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Roaster's Notes</div>
        <p style="font-size:14px;color:#e7e0d8;line-height:1.8;margin:0;font-style:italic;">"Roasted at medium-light over 9 minutes. Pull as pour-over at 92°C for the full floral experience."</p>
        <div style="margin-top:10px;font-size:12px;color:#78716c;font-weight:600;">— James, Head Roaster</div>
      </div>
      ${btn('https://4ever-roastery.vercel.app/shop/roastery', 'Explore the Roastery →')}
    </td></tr>
    ${ftr()}`)

  if (type === 'new-deals') return wrap(`
    ${hdr('New Arrivals', "What's New at 4ever Coffee", 'Freshly added — discover your next favourite')}
    <tr><td style="background:#fff;padding:36px 40px;">
      ${hi}
      ${[
        { n:'Iced Latte',        e:'🧊', p:'£5.00', d:'Double espresso over ice with cold milk.', t:'New' },
        { n:'Biscoff Cheesecake',e:'🍰', p:'£5.50', d:'No-bake cheesecake on a Lotus biscuit base.', t:'Best Seller' },
        { n:'Matcha Latte',      e:'🍵', p:'£5.25', d:'Ceremonial-grade matcha with oat milk.', t:'Seasonal' },
      ].map(p=>`<div style="display:flex;gap:14px;padding:16px;background:#faf7f2;border-radius:12px;margin-bottom:12px;border:1px solid #ede8e0;">
        <div style="font-size:36px;flex-shrink:0;line-height:1;">${p.e}</div>
        <div>
          <div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:4px;">${p.n} <span style="font-size:10px;font-weight:700;color:#d4a060;">${p.t}</span></div>
          <div style="font-size:13px;color:#78716c;line-height:1.6;margin-bottom:6px;">${p.d}</div>
          <div style="font-size:18px;font-weight:900;color:#c8813a;">${p.p}</div>
        </div>
      </div>`).join('')}
      ${btn('https://4ever-roastery.vercel.app/shop/menu', 'Browse Full Menu →')}
    </td></tr>
    ${ftr()}`)

  // discount (default)
  const code = promoCode ?? 'SAVE20'
  return wrap(`
    ${hdr('Exclusive Offer', 'A Special Deal Just For You', 'Subscriber-only — valid this week only')}
    <tr><td style="background:#fff;padding:36px 40px;">
      ${hi}
      <p style="font-size:15px;color:#44403c;line-height:1.75;margin:0 0 24px;">Here's an exclusive promo code reserved just for you. Apply it at checkout for an instant discount.</p>
      <div style="background:linear-gradient(135deg,#2c1008,#4a1e0a);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px;">Your Exclusive Code</div>
        <div style="display:inline-block;background:rgba(212,160,96,.15);border:2px dashed rgba(212,160,96,.5);border-radius:12px;padding:16px 36px;margin-bottom:14px;">
          <div style="font-family:Georgia,serif;font-size:36px;font-weight:900;color:#d4a060;letter-spacing:.08em;">${code}</div>
        </div>
        <div style="font-size:14px;color:#a8a29e;">20% off your order · No minimum spend</div>
      </div>
      ${btn('https://4ever-roastery.vercel.app/shop/menu', 'Claim Your Discount →')}
      <div style="text-align:center;margin-top:16px;font-size:12px;color:#a8a29e;">Valid for 7 days. One use per order.</div>
    </td></tr>
    ${ftr()}`)
}