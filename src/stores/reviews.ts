import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Review {
  id: string
  productId: number
  author: string
  rating: number
  comment: string
  date: string
  helpful: number
}

const SEED: Review[] = [
  { id: 'r1',  productId: 1, author: 'Sara A.',   rating: 5, comment: 'Absolutely the best espresso I\'ve had outside Italy. Rich crema, perfect balance.',      date: '2026-06-10', helpful: 12 },
  { id: 'r2',  productId: 1, author: 'James K.',  rating: 4, comment: 'Love the depth of flavour. The caramel notes come through beautifully.',                    date: '2026-06-02', helpful: 7  },
  { id: 'r3',  productId: 2, author: 'Nour M.',   rating: 5, comment: 'Cold brew perfection — smooth, never bitter. I order this every morning.',                  date: '2026-05-28', helpful: 9  },
  { id: 'r4',  productId: 2, author: 'Tom B.',    rating: 4, comment: 'Great on a hot day. Could be slightly stronger but overall very enjoyable.',                date: '2026-05-20', helpful: 4  },
  { id: 'r5',  productId: 3, author: 'Layla H.',  rating: 5, comment: 'The matcha latte is a work of art — both visually and taste-wise. Highly recommend!',      date: '2026-06-15', helpful: 18 },
  { id: 'r6',  productId: 4, author: 'Ahmed S.',  rating: 5, comment: 'Best cappuccino in Dubai. The milk foam is silky and the espresso is spot-on.',            date: '2026-06-08', helpful: 14 },
  { id: 'r7',  productId: 5, author: 'Priya N.',  rating: 4, comment: 'The croissant is flaky and buttery — pairs perfectly with their flat white.',              date: '2026-06-12', helpful: 6  },
  { id: 'r8',  productId: 6, author: 'Carlos R.', rating: 5, comment: 'This cold brew really hits differently. So refreshing after a long day at the beach.',     date: '2026-06-01', helpful: 11 },
]

const LS_KEY = 'fc_reviews'

function load(): Review[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return [...SEED]
}

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref<Review[]>(load())

  function forProduct(id: number) {
    return reviews.value.filter(r => r.productId === id)
  }

  function avgRating(id: number) {
    const rs = forProduct(id)
    if (!rs.length) return 0
    return rs.reduce((s, r) => s + r.rating, 0) / rs.length
  }

  function addReview(productId: number, author: string, rating: number, comment: string) {
    reviews.value.push({
      id:      crypto.randomUUID(),
      productId,
      author,
      rating,
      comment,
      date:    new Date().toISOString().split('T')[0],
      helpful: 0,
    })
    persist()
  }

  function markHelpful(id: string) {
    const r = reviews.value.find(r => r.id === id)
    if (r) { r.helpful++; persist() }
  }

  function persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(reviews.value))
  }

  const ratingDist = computed(() => (id: number) => {
    const rs = forProduct(id)
    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: rs.filter(r => r.rating === star).length,
      pct:   rs.length ? Math.round(rs.filter(r => r.rating === star).length / rs.length * 100) : 0,
    }))
  })

  return { reviews, forProduct, avgRating, addReview, markHelpful, ratingDist }
})