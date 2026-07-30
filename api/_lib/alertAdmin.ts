// Best-effort admin alert email — never throws, since a failed alert should
// never mask the original error that triggered it.
export async function alertAdmin(subject: string, message: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_ALERT_EMAIL
  if (!apiKey || !to) {
    console.warn('[alertAdmin] skipped — RESEND_API_KEY or ADMIN_ALERT_EMAIL not set')
    return
  }

  const from = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [to],
        subject: `⚠ 4ever Coffee Alert: ${subject}`,
        html: `<p style="font-family:monospace;white-space:pre-wrap;">${message.replace(/</g, '&lt;')}</p>`,
      }),
    })
  } catch (err) {
    console.error('[alertAdmin] failed to send:', err)
  }
}
