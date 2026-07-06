import { defineStore } from 'pinia'
import { ref } from 'vue'

const LS_VOTE_KEY  = 'fc_cupping_vote'
const VOTE_BONUS = 25   // pts awarded for casting a monthly cupping vote

interface StoredVote { originId: number; month: string }

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function loadVote(): StoredVote | null {
  try {
    const raw = localStorage.getItem(LS_VOTE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

export const useRoasteryVotesStore = defineStore('roasteryVotes', () => {
  const stored = loadVote()
  const month  = currentMonthKey()

  // A vote from a previous month no longer counts — a new cycle has opened
  const votedOriginId = ref<number | null>(stored?.month === month ? stored.originId : null)

  function hasVoted() {
    return votedOriginId.value !== null
  }

  function castVote(originId: number) {
    if (hasVoted()) return false
    votedOriginId.value = originId
    localStorage.setItem(LS_VOTE_KEY, JSON.stringify({ originId, month }))
    return true
  }

  return { votedOriginId, hasVoted, castVote, VOTE_BONUS }
})