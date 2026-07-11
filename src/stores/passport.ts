import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface PassportStamp {
  country: string; flag: string; bean: string; date: string; continent: string
}

const CONTINENTS: Record<string, string[]> = {
  Africa:       ['Ethiopia', 'Kenya', 'Rwanda', 'Uganda', 'Tanzania', 'Burundi'],
  Americas:     ['Colombia', 'Brazil', 'Guatemala', 'Panama', 'Costa Rica', 'Peru'],
  Asia:         ['Indonesia', 'Vietnam', 'India', 'Myanmar', 'Laos'],
  'Middle East': ['Yemen', 'Saudi Arabia', 'Oman'],
  Oceania:      ['Papua New Guinea', 'Australia', 'Hawaii'],
}

export const usePassportStore = defineStore('passport', () => {
  const stamps = ref<PassportStamp[]>([
    { country: 'Ethiopia',  flag: '🇪🇹', bean: 'Ethiopian Yirgacheffe', date: '2026-07-01', continent: 'Africa' },
    { country: 'Colombia',  flag: '🇨🇴', bean: 'Colombian Supremo',    date: '2026-07-05', continent: 'Americas' },
    { country: 'Kenya',     flag: '🇰🇪', bean: 'Kenya AA',             date: '2026-07-08', continent: 'Africa' },
    { country: 'Yemen',     flag: '🇾🇪', bean: 'Yemen Mokha',          date: '2026-07-10', continent: 'Middle East' },
  ])

  const visitedContinents = computed(() => {
    const set = new Set(stamps.value.map(s => s.continent))
    return [...set]
  })

  const totalCountries = computed(() => stamps.value.length)

  const middleEastComplete = computed(() => {
    const me = CONTINENTS['Middle East']
    return me.every(c => stamps.value.some(s => s.country === c))
  })

  const allContinentsComplete = computed(() => {
    return Object.keys(CONTINENTS).every(cont =>
      stamps.value.some(s => s.continent === cont)
    )
  })

  function continentProgress(continent: string) {
    const countries = CONTINENTS[continent] ?? []
    const done = countries.filter(c => stamps.value.some(s => s.country === c)).length
    return { done, total: countries.length }
  }

  function addStamp(country: string, flag: string, bean: string, continent: string) {
    if (stamps.value.some(s => s.country === country)) return
    stamps.value.push({ country, flag, bean, continent, date: new Date().toISOString().split('T')[0] })
  }

  return { stamps, visitedContinents, totalCountries, middleEastComplete, allContinentsComplete, continentProgress, addStamp, CONTINENTS }
})