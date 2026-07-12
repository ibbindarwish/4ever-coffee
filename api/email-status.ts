import { Resend } from 'resend'

// GET /api/email-status — returns current email config status
// Use this to verify your RESEND_API_KEY is working before sending campaigns
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' })

  const key = process.env.RESEND_API_KEY
  const from = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

  if (!key) {
    return res.status(200).json({
      ok: false,
      configured: false,
      message: 'RESEND_API_KEY is not set in Vercel environment variables.',
      from,
    })
  }

  // Verify the key by fetching account info
  try {
    const resend = new Resend(key)
    const { data, error } = await (resend as any).domains?.list?.() ??
      await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${key}` },
      }).then((r: any) => r.json()).then((d: any) => ({ data: d, error: null })).catch((e: any) => ({ data: null, error: e }))

    if (error) {
      return res.status(200).json({
        ok: false,
        configured: true,
        message: 'RESEND_API_KEY is set but appears invalid: ' + (error.message ?? JSON.stringify(error)),
        from,
      })
    }

    const keyMasked = key.slice(0, 6) + '…' + key.slice(-4)
    return res.status(200).json({
      ok: true,
      configured: true,
      message: 'RESEND_API_KEY is valid and working.',
      keyMasked,
      from,
      fromWarning: from === 'onboarding@resend.dev'
        ? 'You are using the Resend test sender (onboarding@resend.dev). This can only send to your own registered email. Set FROM_EMAIL in Vercel env vars to a verified domain address to send to anyone.'
        : null,
    })
  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      configured: true,
      message: 'Error verifying key: ' + (err?.message ?? String(err)),
      from,
    })
  }
}