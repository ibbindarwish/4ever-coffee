import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface PeriodStat {
  value: string
  change: string
  positive: boolean
  compLabel: string
}

export interface StatCard {
  icon: string
  labels: Record<Period, string>
  data: Record<Period, PeriodStat>
}

export interface User {
  id: number; name: string; email: string; role: string; status: 'active' | 'inactive'; avatar: string
}

export const useStatsStore = defineStore('stats', () => {
  const statCards = ref<StatCard[]>([
    {
      icon: '☕',
      labels: { daily: "Today's Revenue", weekly: 'Weekly Revenue', monthly: 'Monthly Revenue', yearly: 'Yearly Revenue' },
      data: {
        daily:   { value: '£1,247',   change: '+8.3%',  positive: true,  compLabel: 'vs yesterday' },
        weekly:  { value: '£7,914',   change: '-3.7%',  positive: false, compLabel: 'vs last week' },
        monthly: { value: '£34,587',  change: '+14.8%', positive: true,  compLabel: 'vs last month' },
        yearly:  { value: '£409,340', change: '+23.6%', positive: true,  compLabel: 'vs last year' },
      },
    },
    {
      icon: '📋',
      labels: { daily: 'Orders Today', weekly: 'Weekly Orders', monthly: 'Monthly Orders', yearly: 'Yearly Orders' },
      data: {
        daily:   { value: '179',    change: '+4.2%',  positive: true,  compLabel: 'vs yesterday' },
        weekly:  { value: '1,156',  change: '-5.1%',  positive: false, compLabel: 'vs last week' },
        monthly: { value: '4,830',  change: '+11.2%', positive: true,  compLabel: 'vs last month' },
        yearly:  { value: '57,960', change: '+19.4%', positive: true,  compLabel: 'vs last year' },
      },
    },
    {
      icon: '📈',
      labels: { daily: 'Avg. Order Value', weekly: 'Avg. Order Value', monthly: 'Avg. Order Value', yearly: 'Avg. Order Value' },
      data: {
        daily:   { value: '£6.96', change: '+3.9%', positive: true,  compLabel: 'vs yesterday' },
        weekly:  { value: '£6.84', change: '-1.2%', positive: false, compLabel: 'vs last week' },
        monthly: { value: '£7.16', change: '+3.2%', positive: true,  compLabel: 'vs last month' },
        yearly:  { value: '£7.07', change: '+4.6%', positive: true,  compLabel: 'vs last year' },
      },
    },
    {
      icon: '🔄',
      labels: { daily: 'Repeat Customers', weekly: 'Repeat Customers', monthly: 'Repeat Customers', yearly: 'Repeat Customers' },
      data: {
        daily:   { value: '68%', change: '-3.1%', positive: false, compLabel: 'vs yesterday' },
        weekly:  { value: '71%', change: '+1.8%', positive: true,  compLabel: 'vs last week' },
        monthly: { value: '76%', change: '+2.3%', positive: true,  compLabel: 'vs last month' },
        yearly:  { value: '72%', change: '+4.7%', positive: true,  compLabel: 'vs last year' },
      },
    },
  ])

  const users = ref<User[]>([
    { id: 1, name: 'Ahmad Karimi',     email: 'ahmad@4evercoffee.ae',   role: 'Admin',       status: 'active',   avatar: 'AK' },
    { id: 2, name: 'Sara Al Mansoori', email: 'sara@4evercoffee.ae',    role: 'Supervisor',  status: 'active',   avatar: 'SM' },
    { id: 3, name: 'Rami Haddad',      email: 'rami@4evercoffee.ae',    role: 'Team Leader', status: 'active',   avatar: 'RH' },
    { id: 4, name: 'Dina Yusuf',       email: 'dina@4evercoffee.ae',    role: 'Barista',     status: 'active',   avatar: 'DY' },
    { id: 5, name: 'Malik Osei',       email: 'malik@4evercoffee.ae',   role: 'Barista',     status: 'active',   avatar: 'MO' },
    { id: 6, name: 'Nora Patel',       email: 'nora@4evercoffee.ae',    role: 'Supervisor',  status: 'active',   avatar: 'NP' },
    { id: 7, name: 'Tarek Saleh',      email: 'tarek@4evercoffee.ae',   role: 'Team Leader', status: 'inactive', avatar: 'TS' },
  ])

  return { statCards, users }
})