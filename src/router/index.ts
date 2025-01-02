import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/BillsManagement.vue'
import Login from '@/views/Login.vue'
import BillsManagement from '../views/BillsManagement.vue'
import { AuthStorageUtils } from '@/utils/auth/auth-storage-utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BillsManagement',
      component: BillsManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthStorageUtils.getAccessTokenFromLocalStorage()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
