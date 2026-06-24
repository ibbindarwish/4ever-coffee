<script setup lang="ts">
import { ref } from 'vue'
import { useStatsStore } from '../stores/stats'

const stats = useStatsStore()
const search = ref('')
const filtered = () => stats.users.filter(u =>
  u.name.toLowerCase().includes(search.value.toLowerCase()) ||
  u.email.toLowerCase().includes(search.value.toLowerCase())
)
</script>

<template>
  <div class="page">
    <div class="toolbar">
      <input v-model="search" class="search-input" placeholder="Search team..."/>
      <button class="btn-primary">+ Add Member</button>
    </div>
    <div class="panel">
      <table class="data-table">
        <thead>
          <tr><th>Member</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="u in filtered()" :key="u.id">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ u.avatar }}</div>
                <span>{{ u.name }}</span>
              </div>
            </td>
            <td class="muted">{{ u.email }}</td>
            <td><span class="role-badge" :class="'role-' + u.role.toLowerCase().replace(' ', '-')">{{ u.role }}</span></td>
            <td><span class="status-badge" :class="u.status">{{ u.status }}</span></td>
            <td>
              <div class="actions">
                <button class="action-btn">Edit</button>
                <button class="action-btn danger">Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.search-input { padding: 9px 14px; border: 1px solid #e7e5e4; border-radius: 8px; font-size: 14px; width: 280px; outline: none; }
.search-input:focus { border-color: #d4a060; }
.btn-primary { background: #d4a060; color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #c8813a; }
.panel { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(44,16,8,0.06); border: 1px solid #f0ebe4; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { text-align: left; padding: 10px 12px; font-size: 11px; color: #a8a29e; border-bottom: 1px solid #f5f0ea; text-transform: uppercase; letter-spacing: 0.05em; }
.data-table td { padding: 14px 12px; border-bottom: 1px solid #faf7f2; }
.user-cell { display: flex; align-items: center; gap: 10px; font-weight: 500; color: #1c1917; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #d4a060; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.muted { color: #78716c; }
.role-badge { border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
.role-admin       { background: #fdf3e7; color: #92400e; }
.role-supervisor  { background: #fef3c7; color: #78350f; }
.role-team-leader { background: #dbeafe; color: #1e40af; }
.role-barista     { background: #d1fae5; color: #065f46; }
.status-badge { border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
.status-badge.active   { background: #d1fae5; color: #065f46; }
.status-badge.inactive { background: #fee2e2; color: #991b1b; }
.actions { display: flex; gap: 8px; }
.action-btn { background: none; border: 1px solid #e7e5e4; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; color: #374151; }
.action-btn:hover { background: #faf7f2; }
.action-btn.danger { color: #ef4444; border-color: #fecaca; }
.action-btn.danger:hover { background: #fee2e2; }
</style>
