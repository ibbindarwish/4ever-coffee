import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import ShopLayout from '../layouts/ShopLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: () => import('../pages/HomePage.vue') },
        { path: 'analytics', name: 'analytics', component: () => import('../pages/AnalyticsPage.vue') },
        { path: 'users', name: 'users', component: () => import('../pages/UsersPage.vue') },
        { path: 'menu', name: 'menu', component: () => import('../pages/admin/ProductsPage.vue') },
        { path: 'orders', name: 'orders', component: () => import('../pages/admin/OrdersPage.vue') },
        { path: 'settings',    name: 'settings',    component: () => import('../pages/SettingsPage.vue') },
        { path: 'architector', name: 'architector', component: () => import('../pages/ArchitectorPage.vue') },
        { path: 'cups-daily', name: 'cups-daily', component: () => import('../pages/admin/CupsDailyPage.vue') },
      ],
    },
    {
      path: '/shop',
      component: ShopLayout,
      meta: { public: true },
      children: [
        { path: '', name: 'shop-home', component: () => import('../pages/shop/ShopHomePage.vue') },
        { path: 'menu', name: 'shop-menu', component: () => import('../pages/shop/ShopPage.vue') },
        { path: 'cart', name: 'cart', component: () => import('../pages/shop/CartPage.vue') },
        { path: 'checkout', name: 'checkout', component: () => import('../pages/shop/CheckoutPage.vue') },
        { path: 'success',  name: 'success',  component: () => import('../pages/shop/SuccessPage.vue') },
        { path: 'track',    name: 'track',    component: () => import('../pages/shop/OrderTrackPage.vue') },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('../stores/auth')
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) return { path: '/login' }
    if (!auth.checkSession())  return { path: '/login' }
  }
  if (to.path === '/login' && auth.isAuthenticated) return { path: '/' }
})

export default router
