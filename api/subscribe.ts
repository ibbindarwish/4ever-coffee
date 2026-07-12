import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, tags } = req.body as { name: string; email: string; tags: string[] }
  if (!email) return res.status(400).json({ error: 'Email is required' })

  if (!process.env.RESEND_API_KEY) {
    console.warn('[subscribe] RESEND_API_KEY not set — skipping email delivery')
    return res.status(200).json({ ok: true, note: 'Email service not configured yet' })
  }

  try {
    const { error } = await resend.emails.send({
      from:    FROM,
      to:      [email],
      subject: "☕ Welcome to 4ever Coffee — You're In!",
      html:    buildWelcomeEmail(name ?? 'Coffee Lover', tags ?? []),
    })
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('[subscribe] send error:', err)
    return res.status(500).json({ error: err?.message ?? 'Send failed' })
  }
}

// ── Welcome email HTML ──────────────────────────────────────────────────────
const TAG_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  deals:     { label: 'New Deals & Arrivals', icon: '🆕', desc: 'First to know about new menu launches'     },
  roastery:  { label: 'Roastery Updates',     icon: '🌍', desc: 'Bean origins, roast profiles & diary notes' },
  reviews:   { label: 'Customer Reviews',     icon: '⭐', desc: 'What our community is loving right now'    },
  discounts: { label: 'Exclusive Discounts',  icon: '🏷', desc: 'Subscriber-only promo codes & offers'      },
}

function buildWelcomeEmail(name: string, tags: string[]): string {
  const tagItems = (tags.length ? tags : ['deals', 'discounts']).map(t => {
    const m = TAG_LABELS[t]
    return m
      ? `<div style="display:flex;align-items:flex-start;gap:14px;padding:14px;background:#fff;border-radius:10px;border:1px solid #ede8e0;margin-bottom:10px;">
           <div style="font-size:22px;flex-shrink:0;">${m.icon}</div>
           <div>
             <div style="font-size:14px;font-weight:700;color:#1c1917;">${m.label}</div>
             <div style="font-size:12px;color:#78716c;margin-top:2px;">${m.desc}</div>
           </div>
         </div>`
      : ''
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to 4ever Coffee</title></head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#1a0804 0%,#2c1008 50%,#4a1e0a 100%);padding:52px 40px 44px;text-align:center;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:42px;font-weight:900;color:#fdf6ec;letter-spacing:-2px;line-height:1;">
            4<span style="color:#d4a060;">ever</span>
          </div>
          <div style="font-size:11px;letter-spacing:.2em;color:#78716c;margin:4px 0 0;text-transform:uppercase;">Coffee Roastery</div>
          <div style="height:1px;background:rgba(212,160,96,.2);margin:28px auto;max-width:160px;"></div>
          <div style="font-size:13px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px;">Welcome to the Community</div>
          <div style="font-family:Georgia,serif;font-size:30px;font-weight:700;color:#fdf6ec;line-height:1.25;">
            You're in, ${name}! ☕
          </div>
          <div style="font-size:14px;color:#a8a29e;margin-top:12px;line-height:1.7;">
            Thank you for joining 2,400+ coffee lovers who stay ahead<br>with exclusive drops, deals and roastery stories.
          </div>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="background:#fff;padding:36px 40px;">
          <div style="font-size:16px;font-weight:700;color:#1c1917;margin-bottom:6px;">Here's what you've signed up for:</div>
          <div style="font-size:13px;color:#78716c;margin-bottom:20px;">We'll send you exactly what you asked for — nothing more.</div>
          ${tagItems}

          <!-- Welcome promo -->
          <div style="background:linear-gradient(135deg,#2c1008,#4a1e0a);border-radius:16px;padding:28px;margin-top:24px;text-align:center;">
            <div style="font-size:11px;font-weight:700;color:#d4a060;text-transform:uppercase;letter-spacing:.14em;margin-bottom:10px;">
              🎁 Welcome Gift
            </div>
            <div style="font-size:13px;color:#a8a29e;margin-bottom:14px;">Use this code on your first order:</div>
            <div style="display:inline-block;background:rgba(212,160,96,.15);border:2px dashed rgba(212,160,96,.5);border-radius:12px;padding:14px 32px;">
              <div style="font-family:Georgia,serif;font-size:32px;font-weight:900;color:#d4a060;letter-spacing:.08em;">WELCOME10</div>
            </div>
            <div style="font-size:12px;color:#78716c;margin-top:12px;">10% off your first order · No minimum · Valid 30 days</div>
          </div>
        </td>
      </tr>

      <!-- Quick links -->
      <tr>
        <td style="background:#faf7f2;padding:28px 40px;">
          <div style="font-size:13px;font-weight:700;color:#78716c;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px;">Explore 4ever Coffee</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;">
                <a href="https://4ever-roastery.vercel.app/shop/menu" style="display:block;text-align:center;background:linear-gradient(135deg,#c8813a,#d4a060);color:#fff;text-decoration:none;padding:13px 10px;border-radius:10px;font-size:13px;font-weight:700;">☕ Shop Menu</a>
              </td>
              <td style="padding-right:8px;">
                <a href="https://4ever-roastery.vercel.app/shop/roastery" style="display:block;text-align:center;background:#fff;color:#c8813a;text-decoration:none;padding:13px 10px;border-radius:10px;font-size:13px;font-weight:700;border:1.5px solid #ede8e0;">🌍 Roastery</a>
              </td>
              <td>
                <a href="https://4ever-roastery.vercel.app/shop/loyalty" style="display:block;text-align:center;background:#fff;color:#c8813a;text-decoration:none;padding:13px 10px;border-radius:10px;font-size:13px;font-weight:700;border:1.5px solid #ede8e0;">⭐ Loyalty</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1c1008;padding:24px 40px;text-align:center;">
          <div style="font-size:11px;color:#44403c;line-height:1.9;">
            You're receiving this because you subscribed at
            <a href="https://4ever-roastery.vercel.app/shop" style="color:#78716c;text-decoration:none;">4ever Coffee</a>.<br>
            <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Unsubscribe</a>
            &nbsp;·&nbsp;
            <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Privacy Policy</a>
            &nbsp;·&nbsp;
            <a href="https://4ever-roastery.vercel.app/shop" style="color:#c8813a;text-decoration:none;font-weight:600;">Visit Shop</a>
          </div>
          <div style="font-size:10px;color:#2c2018;margin-top:10px;">© 2026 4ever Coffee. All rights reserved.</div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}