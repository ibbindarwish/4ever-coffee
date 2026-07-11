import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface RoastingBatch {
  id: string; bean: string; flag: string; origin: string
  startedAt: string; readyIn: number // minutes until ready
  roastLevel: string; batchKg: number; roaster: string
}

export interface LastSip {
  id: string; author: string; city: string; text: string; bean: string; date: string
}

export interface BatchVote {
  id: string; name: string; votes: number; submittedBy: string
}

export interface DecafConfession {
  id: string; text: string; reason: string; date: string
}

export interface EmployeePick {
  name: string; role: string; productId: number; quote: string; avatar: string
}

export const useRoasteryStore = defineStore('roastery', () => {

  const roastingNow = ref<RoastingBatch[]>([
    { id: 'b1', bean: 'Ethiopian Yirgacheffe', flag: '🇪🇹', origin: 'Gedeo Zone', startedAt: '09:14', readyIn: 18, roastLevel: 'Light', batchKg: 12, roaster: 'Omar' },
    { id: 'b2', bean: 'Colombian Supremo',    flag: '🇨🇴', origin: 'Huila',      startedAt: '09:40', readyIn: 42, roastLevel: 'Medium', batchKg: 20, roaster: 'Sara' },
    { id: 'b3', bean: 'Kenya AA',             flag: '🇰🇪', origin: 'Nyeri',      startedAt: '10:05', readyIn: 67, roastLevel: 'Medium-Light', batchKg: 8, roaster: 'Khalid' },
  ])

  const lastSips = ref<LastSip[]>([
    { id: 's1', author: 'Sara M.',    city: 'Dubai',      text: 'Drank it watching the sunrise from my balcony. Worth every sip.', bean: 'Panama Geisha', date: '2026-07-10' },
    { id: 's2', author: 'Ahmed K.',   city: 'Abu Dhabi',  text: 'The last cup before Ramadan. I will miss you, Yemen Mokha.', bean: 'Yemen Mokha', date: '2026-07-09' },
    { id: 's3', author: 'Lena R.',    city: 'Sharjah',    text: 'Finished the whole bag in 4 days. No regrets.', bean: 'Ethiopian Yirgacheffe', date: '2026-07-09' },
    { id: 's4', author: 'Tariq H.',   city: 'Riyadh',     text: 'My daughter made this for me. Best cup I ever had, for the company.', bean: 'Colombian Supremo', date: '2026-07-08' },
    { id: 's5', author: 'Nadia F.',   city: 'London',     text: 'Cold, rainy Tuesday. This Rwanda carried me through the whole day.', bean: 'Rwanda Bourbon', date: '2026-07-08' },
    { id: 's6', author: 'James W.',   city: 'Dubai',      text: 'Last sip before my flight home. 4ever Coffee follows me everywhere.', bean: 'Kenya AA', date: '2026-07-07' },
  ])

  const batchVotes = ref<BatchVote[]>([
    { id: 'v1', name: 'Golden Hour',    votes: 47, submittedBy: 'Fatima A.' },
    { id: 'v2', name: 'Desert Wind',    votes: 38, submittedBy: 'Hassan M.' },
    { id: 'v3', name: 'Midnight Roast', votes: 61, submittedBy: 'Leila K.' },
    { id: 'v4', name: 'The First Light', votes: 29, submittedBy: 'Omar R.' },
  ])

  const decafConfessions = ref<DecafConfession[]>([
    { id: 'd1', text: 'My doctor said my heart rate was too high. Switched to decaf. Still pretend it\'s the real thing.', reason: 'Doctor\'s orders', date: '2026-07-10' },
    { id: 'd2', text: 'Pregnant with twins. I miss espresso so much I dream about it.', reason: 'Pregnancy', date: '2026-07-09' },
    { id: 'd3', text: 'Anxiety attacks at 3am finally stopped. Worth it.', reason: 'Anxiety', date: '2026-07-08' },
    { id: 'd4', text: 'My wife switched first. I followed to be supportive. Now I actually prefer it.', reason: 'Partner', date: '2026-07-07' },
    { id: 'd5', text: 'I just can\'t sleep anymore after 2pm. Age is humbling.', reason: 'Sleep', date: '2026-07-06' },
    { id: 'd6', text: 'Training for a marathon. Coach banned caffeine after 12pm. Decaf at 4ever saves my evenings.', reason: 'Fitness', date: '2026-07-05' },
  ])

  const employeePicks = ref<EmployeePick[]>([
    { name: 'Omar', role: 'Head Roaster', productId: 7, quote: 'Panama Geisha is the reason I became a roaster. Once you taste it, nothing else feels the same.', avatar: '👨‍🍳' },
    { name: 'Sara', role: 'Barista', productId: 1, quote: 'Ethiopian Yirgacheffe on a V60, early morning, window open. That\'s my religion.', avatar: '👩‍💼' },
    { name: 'Khalid', role: 'Delivery', productId: 2, quote: 'I drive 200km a day. Colombian Supremo keeps me sharp and never burns my stomach.', avatar: '🚚' },
  ])

  const diaryEntries = ref([
    { date: '2026-07-11', author: 'Omar', title: 'I pulled the Ethiopia 3 minutes early today', body: 'The first crack came faster than expected — humidity was low this morning. I made the call to pull early. Lighter body, more jasmine on the nose. Come try it this weekend and tell me if I was right.' },
    { date: '2026-07-09', author: 'Sara', title: 'Why I stopped using a timer for the pour', body: "Everyone says 'always use a timer.' I disagree. The Kenya AA taught me to listen — when the bloom rises a certain way, you just know. You can't put that in a timer." },
    { date: '2026-07-07', author: 'Omar', title: 'The Panama Geisha lot we almost didn\'t buy', body: 'The exporter wanted more than we\'ve ever paid per kilo. I almost said no. Then I cupped it. We bought everything he had. You\'ll understand when you taste it.' },
  ])

  function voteForBatch(id: string) {
    const b = batchVotes.value.find(v => v.id === id)
    if (b) b.votes++
  }

  function submitLastSip(text: string, bean: string, author: string, city: string) {
    lastSips.value.unshift({
      id: Date.now().toString(),
      author, city, text, bean,
      date: new Date().toISOString().split('T')[0]
    })
  }

  function submitDecafConfession(text: string, reason: string) {
    decafConfessions.value.unshift({
      id: Date.now().toString(),
      text, reason,
      date: new Date().toISOString().split('T')[0]
    })
  }

  return {
    roastingNow, lastSips, batchVotes, decafConfessions,
    employeePicks, diaryEntries,
    voteForBatch, submitLastSip, submitDecafConfession,
  }
})