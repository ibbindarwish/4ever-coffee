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
        { path: 'cups-daily',    name: 'cups-daily',    component: () => import('../pages/admin/CupsDailyPage.vue') },
        { path: 'cup-showcase', name: 'cup-showcase', component: () => import('../pages/admin/CupShowcasePage.vue') },
        { path: 'roastery-admin', name: 'roastery-admin', component: () => import('../pages/admin/RoasteryAdminPage.vue') },
        { path: 'schedule',   name: 'schedule',   component: () => import('../pages/admin/StaffSchedulePage.vue') },
        { path: 'promo-codes', name: 'promo-codes', component: () => import('../pages/admin/PromoCodesPage.vue'), meta: { adminOnly: true } },
        { path: 'packaging-designer', name: 'packaging-designer', component: () => import('../pages/admin/PackagingDesignerPage.vue') },
        { path: 'cup-designer', name: 'cup-designer', component: () => import('../pages/admin/CupDesignerPage.vue') },
        { path: 'crm', name: 'crm', component: () => import('../pages/admin/CrmPage.vue') },
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
        { path: 'payment',  name: 'payment',  component: () => import('../pages/shop/PaymentPage.vue') },
        { path: 'success',  name: 'success',  component: () => import('../pages/shop/SuccessPage.vue') },
        { path: 'track',    name: 'track',    component: () => import('../pages/shop/OrderTrackPage.vue') },
        { path: 'loyalty',     name: 'loyalty',     component: () => import('../pages/shop/LoyaltyPage.vue') },
        { path: 'reservation', name: 'reservation', component: () => import('../pages/shop/ReservationPage.vue') },
        { path: 'roastery',    name: 'roastery',    component: () => import('../pages/shop/RoasteryPage.vue') },
        { path: 'signup',           name: 'signup',             component: () => import('../pages/shop/SignupPage.vue') },
        { path: 'login',            name: 'customer-login',     component: () => import('../pages/shop/CustomerLoginPage.vue') },
        { path: 'flavor-compass',   name: 'flavor-compass',     component: () => import('../pages/shop/FlavorCompassPage.vue') },
        { path: 'passport',         name: 'passport',           component: () => import('../pages/shop/PassportPage.vue') },
        { path: 'horoscope',        name: 'horoscope',          component: () => import('../pages/shop/HoroscopePage.vue') },
        { path: 'blend-builder',    name: 'blend-builder',      component: () => import('../pages/shop/BlendBuilderPage.vue') },
        { path: 'tasting-challenge',name: 'tasting-challenge',  component: () => import('../pages/shop/TastingChallengePage.vue') },
        { path: 'gift',             name: 'gift',               component: () => import('../pages/shop/GiftExperiencePage.vue') },
        { path: 'waiting-room',     name: 'waiting-room',       component: () => import('../pages/shop/WaitingRoomPage.vue') },
        { path: 'decaf-confessions',name: 'decaf-confessions',  component: () => import('../pages/shop/DecafConfessionsPage.vue') },
        { path: 'refer',            name: 'refer',              component: () => import('../pages/shop/ReferralPage.vue'), meta: { public: true } },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/MaintenancePage.vue'),
      meta: { public: true },
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
  if (to.meta.adminOnly && auth.user?.role !== 'Admin') return { path: '/' }
  if (to.path === '/login' && auth.isAuthenticated) return { path: '/' }
})

export default router
