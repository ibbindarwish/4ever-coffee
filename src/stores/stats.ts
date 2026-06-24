import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number; name: string; email: string; role: string; status: 'active' | 'inactive'; avatar: string
}

export const useStatsStore = defineStore('stats', () => {
  const statCards = ref([
    { label: 'Today\'s Revenue', value: '$1,248', change: '+18.4%', positive: true, icon: '☕' },
    { label: 'Orders Today',     value: '184',    change: '+11.2%', positive: true, icon: '📋' },
    { label: 'Active Customers', value: '2,340',  change: '+6.7%',  positive: true, icon: '👥' },
    { label: 'Avg. Order Value', value: '$6.78',  change: '-1.2%',  positive: false, icon: '📈' },
  ])

  const users = ref<User[]>([
    { id: 1, name: 'Ahmad Karimi',   email: 'ahmad@4evercoffee.ae',   role: 'Admin',       status: 'active',   avatar: 'AK' },
    { id: 2, name: 'Sara Al Mansoori', email: 'sara@4evercoffee.ae',  role: 'Supervisor',  status: 'active',   avatar: 'SM' },
    { id: 3, name: 'Rami Haddad',    email: 'rami@4evercoffee.ae',    role: 'Team Leader', status: 'active',   avatar: 'RH' },
    { id: 4, name: 'Dina Yusuf',     email: 'dina@4evercoffee.ae',    role: 'Barista',     status: 'active',   avatar: 'DY' },
    { id: 5, name: 'Malik Osei',     email: 'malik@4evercoffee.ae',   role: 'Barista',     status: 'active',   avatar: 'MO' },
    { id: 6, name: 'Nora Patel',     email: 'nora@4evercoffee.ae',    role: 'Supervisor',  status: 'active',   avatar: 'NP' },
    { id: 7, name: 'Tarek Saleh',    email: 'tarek@4evercoffee.ae',   role: 'Team Leader', status: 'inactive', avatar: 'TS' },
  ])

  return { statCards, users }
})
