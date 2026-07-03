<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReviewsStore } from '../../stores/reviews'

const props = defineProps<{ productId: number; productName: string }>()

const store = useReviewsStore()

const reviews = computed(() => store.forProduct(props.productId))
const avg     = computed(() => store.avgRating(props.productId))
const dist    = computed(() => store.ratingDist(props.productId))

const showForm = ref(false)
const form = ref({ author: '', rating: 5, comment: '' })
const hovered = ref(0)
const submitted = ref(false)

function stars(n: number) { return Array.from({ length: 5 }, (_, i) => i < n) }

function submit() {
  if (!form.value.author.trim() || !form.value.comment.trim()) return
  store.addReview(props.productId, form.value.author.trim(), form.value.rating, form.value.comment.trim())
  submitted.value = true
  showForm.value = false
  form.value = { author: '', rating: 5, comment: '' }
  setTimeout(() => { submitted.value = false }, 3000)
}
</script>

<template>
  <div class="reviews">

    <!-- Summary bar -->
    <div class="rev-summary">
      <div class="avg-block">
        <div class="avg-num">{{ avg.toFixed(1) }}</div>
        <div class="avg-stars">
          <span v-for="(on, i) in stars(Math.round(avg))" :key="i" class="star" :class="{ on }">★</span>
        </div>
        <div class="avg-count">{{ reviews.length }} review{{ reviews.length !== 1 ? 's' : '' }}</div>
      </div>
      <div class="dist-bars">
        <div v-for="d in dist" :key="d.star" class="dist-row">
          <span class="dist-star">{{ d.star }}★</span>
          <div class="dist-bar">
            <div class="dist-fill" :style="{ width: d.pct + '%' }"></div>
          </div>
          <span class="dist-pct">{{ d.count }}</span>
        </div>
      </div>
    </div>

    <!-- Write a review button -->
    <div class="rev-actions">
      <button v-if="!showForm" class="write-btn" @click="showForm = true">Write a Review</button>
      <span v-if="submitted" class="thanks">✓ Thanks for your review!</span>
    </div>

    <!-- Review form -->
    <div v-if="showForm" class="rev-form">
      <h4>Your Review for {{ productName }}</h4>

      <div class="form-field">
        <label>Name</label>
        <input v-model="form.author" class="r-input" placeholder="Your name"/>
      </div>

      <div class="form-field">
        <label>Rating</label>
        <div class="star-picker">
          <button v-for="n in 5" :key="n" type="button" class="pick-star"
            :class="{ on: n <= (hovered || form.rating) }"
            @mouseenter="hovered = n"
            @mouseleave="hovered = 0"
            @click="form.rating = n">
            ★
          </button>
        </div>
      </div>

      <div class="form-field">
        <label>Comment</label>
        <textarea v-model="form.comment" class="r-input r-textarea" placeholder="Tell us what you think…" rows="3"></textarea>
      </div>

      <div class="form-btns">
        <button class="cancel-btn" @click="showForm = false; form = { author: '', rating: 5, comment: '' }">Cancel</button>
        <button class="submit-btn" @click="submit">Post Review</button>
      </div>
    </div>

    <!-- Review list -->
    <div v-if="reviews.length === 0 && !showForm" class="no-reviews">
      No reviews yet — be the first!
    </div>

    <div class="rev-list">
      <div v-for="r in reviews" :key="r.id" class="rev-card">
        <div class="rev-header">
          <div class="rev-avatar">{{ r.author[0] }}</div>
          <div class="rev-meta">
            <div class="rev-author">{{ r.author }}</div>
            <div class="rev-date">{{ r.date }}</div>
          </div>
          <div class="rev-stars">
            <span v-for="(on, i) in stars(r.rating)" :key="i" class="star" :class="{ on }">★</span>
          </div>
        </div>
        <p class="rev-comment">{{ r.comment }}</p>
        <button class="helpful-btn" @click="store.markHelpful(r.id)">
          👍 Helpful ({{ r.helpful }})
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviews { display: flex; flex-direction: column; gap: 20px; }

/* Summary */
.rev-summary { display: flex; gap: 24px; background: #faf7f2; border-radius: 14px; padding: 18px 20px; border: 1px solid #f0ebe4; }
.avg-block   { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 72px; }
.avg-num     { font-size: 40px; font-weight: 900; color: #1c1917; line-height: 1; }
.avg-stars   { display: flex; gap: 2px; }
.star        { font-size: 14px; color: #d1c9c2; }
.star.on     { color: #f59e0b; }
.avg-count   { font-size: 11px; color: #a8a29e; }

.dist-bars { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.dist-row  { display: flex; align-items: center; gap: 8px; }
.dist-star { font-size: 11px; color: #78716c; min-width: 22px; }
.dist-bar  { flex: 1; height: 6px; background: #e7e5e4; border-radius: 99px; overflow: hidden; }
.dist-fill { height: 100%; background: #f59e0b; border-radius: 99px; transition: width 0.6s ease; }
.dist-pct  { font-size: 11px; color: #a8a29e; min-width: 18px; text-align: right; }

/* Actions */
.rev-actions { display: flex; align-items: center; gap: 12px; }
.write-btn   { background: #1c1917; color: #fff; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.write-btn:hover { background: #c8813a; }
.thanks      { font-size: 13px; color: #16a34a; font-weight: 600; }

/* Form */
.rev-form { background: #fff; border: 1px solid #f0ebe4; border-radius: 14px; padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
.rev-form h4 { font-size: 14px; font-weight: 800; color: #1c1917; margin: 0; }
.form-field  { display: flex; flex-direction: column; gap: 5px; }
.form-field label { font-size: 10px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; }
.r-input  { padding: 9px 12px; border: 1.5px solid #e7e5e4; border-radius: 8px; font-size: 13px; outline: none; background: #faf7f2; color: #1c1917; transition: border-color 0.15s; }
.r-input:focus { border-color: #d4a060; background: #fff; }
.r-textarea { resize: vertical; min-height: 72px; }

.star-picker { display: flex; gap: 4px; }
.pick-star   { background: none; border: none; font-size: 24px; cursor: pointer; color: #d1c9c2; transition: color 0.1s; padding: 0; line-height: 1; }
.pick-star.on { color: #f59e0b; }

.form-btns  { display: flex; gap: 8px; justify-content: flex-end; }
.cancel-btn { background: none; border: 1px solid #e7e5e4; border-radius: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; color: #78716c; transition: all 0.15s; }
.cancel-btn:hover { background: #faf7f2; }
.submit-btn { background: #d4a060; color: #fff; border: none; border-radius: 8px; padding: 8px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.submit-btn:hover { background: #c8813a; }

/* List */
.no-reviews { font-size: 13px; color: #a8a29e; text-align: center; padding: 24px; }
.rev-list   { display: flex; flex-direction: column; gap: 12px; }
.rev-card   { background: #fff; border: 1px solid #f0ebe4; border-radius: 12px; padding: 16px 18px; }
.rev-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.rev-avatar { width: 34px; height: 34px; border-radius: 50%; background: #d4a060; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rev-meta   { flex: 1; }
.rev-author { font-size: 13px; font-weight: 700; color: #1c1917; }
.rev-date   { font-size: 11px; color: #a8a29e; }
.rev-stars  { display: flex; gap: 2px; }
.rev-comment { font-size: 13px; color: #57534e; line-height: 1.6; margin: 0 0 10px; }
.helpful-btn { background: none; border: 1px solid #e7e5e4; border-radius: 7px; padding: 4px 12px; font-size: 12px; color: #78716c; cursor: pointer; transition: all 0.15s; }
.helpful-btn:hover { background: #fdf3e7; border-color: #d4a060; color: #92400e; }
</style>