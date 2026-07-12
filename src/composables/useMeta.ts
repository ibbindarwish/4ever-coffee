import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const BASE = 'https://4ever-roastery.vercel.app'
const DEFAULT_IMG = `${BASE}/og-image.svg`

const META: Record<string, { title: string; description: string; path?: string }> = {
  'shop-home': {
    title: "4ever Coffee — London's Premier Specialty Roastery & Café",
    description: 'Award-winning specialty coffee roastery in London. Single-origin beans from Ethiopia, Colombia, Yemen and beyond. Free delivery over £30.',
  },
  'shop-menu': {
    title: 'Coffee Menu — 4ever Coffee Roastery',
    description: 'Browse our full menu of specialty coffees, seasonal drinks, cakes and pastries. Order online for delivery or collection in London.',
  },
  'roastery': {
    title: '4ever Roastery — Single-Origin Beans from 14 Origins',
    description: 'Discover our roastery. Ethiopian Yirgacheffe, Colombian Huila, Yemeni Mokha and 11 more — sourced and roasted in-house. Vote on the next origin.',
  },
  'loyalty': {
    title: 'Rewards & Loyalty — 4ever Coffee',
    description: 'Earn points with every purchase and unlock exclusive rewards. Join over 2,400 members of the 4ever loyalty programme.',
  },
  'reservation': {
    title: 'Book a Table — 4ever Coffee',
    description: 'Reserve your table at 4ever Coffee. No waiting — book online for mornings, afternoons, evenings and private events.',
  },
  'gift': {
    title: 'Coffee Gift Experience — 4ever Coffee',
    description: 'The perfect gift for coffee lovers. Curated specialty collections, gift cards, and bespoke subscription boxes. Free delivery included.',
  },
  'flavor-compass': {
    title: 'Coffee Flavor Compass — Find Your Perfect Coffee',
    description: 'Take our interactive flavor quiz and discover the perfect specialty coffee for your taste. 14 origins, 200+ flavor notes, 1 recommendation.',
  },
  'passport': {
    title: 'Coffee Passport — Explore 14 Origins with 4ever',
    description: 'Your personal guide to coffee origins around the world. Collect stamps, learn flavor profiles, and unlock exclusive blends as you explore.',
  },
  'horoscope': {
    title: 'Coffee Horoscope — What Coffee Are You? | 4ever Coffee',
    description: 'Which specialty coffee matches your star sign? A fun and shareable taste experience from 4ever Coffee Roastery.',
  },
  'blend-builder': {
    title: 'Blend Builder — Create Your Own Coffee Blend | 4ever',
    description: 'Mix single-origin beans to create your custom coffee blend. Choose your ratio, name it, and we roast it fresh for you.',
  },
  'tasting-challenge': {
    title: 'Blind Tasting Challenge — Test Your Coffee Knowledge',
    description: 'How well do you know your coffee? Take the 4ever blind tasting challenge and prove your specialty coffee knowledge.',
  },
  'waiting-room': {
    title: 'Coffee Waiting Room — 4ever Coffee',
    description: 'Waiting for your order? The 4ever waiting room keeps you entertained with coffee trivia, music, and live roastery updates.',
  },
  'decaf-confessions': {
    title: 'Decaf Confessions — It\'s OK to Love Decaf | 4ever',
    description: 'The secret is out. Our specialty decaf is extraordinary. Share your decaf confession and join a surprisingly proud community.',
  },
  'cart': {
    title: 'Your Cart — 4ever Coffee',
    description: 'Review your specialty coffee selection. Free delivery on orders over £30.',
  },
  'checkout': {
    title: 'Checkout — 4ever Coffee',
    description: 'Complete your 4ever Coffee order. Secure checkout, fast delivery, satisfaction guaranteed.',
  },
}

function setMeta(key: 'property' | 'name', attr: string, content: string) {
  let el = document.querySelector(`meta[${key}="${attr}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(key, attr)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function applyMeta(routeName: string, routePath: string) {
  const m = META[routeName]
  if (!m) return

  const url = BASE + routePath

  document.title = m.title

  setMeta('property', 'og:title', m.title)
  setMeta('property', 'og:description', m.description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', DEFAULT_IMG)
  setMeta('name', 'twitter:title', m.title)
  setMeta('name', 'twitter:description', m.description)
  setMeta('name', 'description', m.description)

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}

export function useMeta() {
  const route = useRoute()

  function update() {
    applyMeta(String(route.name ?? ''), route.path)
  }

  onMounted(update)
  watch(() => route.name, update)
}