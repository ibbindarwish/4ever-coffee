import type { VercelRequest, VercelResponse } from '@vercel/node'

const KEY = '4evercoffee2026indexnow'
const HOST = '4ever-roastery.vercel.app'

const URLS = [
  `https://${HOST}/shop`,
  `https://${HOST}/shop/menu`,
  `https://${HOST}/shop/roastery`,
  `https://${HOST}/shop/loyalty`,
  `https://${HOST}/shop/reservation`,
  `https://${HOST}/shop/gift`,
  `https://${HOST}/shop/refer`,
  `https://${HOST}/shop/flavor-compass`,
  `https://${HOST}/shop/passport`,
  `https://${HOST}/shop/horoscope`,
  `https://${HOST}/shop/blend-builder`,
  `https://${HOST}/shop/tasting-challenge`,
  `https://${HOST}/shop/waiting-room`,
  `https://${HOST}/shop/decaf-confessions`,
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  // Ping IndexNow (Bing, Yandex, Seznam — instant indexing)
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: URLS,
  }

  const results = await Promise.allSettled([
    // IndexNow aggregator — distributes to Bing, Yandex, Seznam, DuckDuckGo
    fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    }),
    // Bing directly
    fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    }),
  ])

  const statuses = results.map(r => r.status === 'fulfilled' ? r.value.status : 'network-error')
  return res.status(200).json({ ok: true, pings: statuses, urls: URLS.length })
}