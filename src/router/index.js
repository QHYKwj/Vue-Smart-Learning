/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

import index from '@/pages/index.vue'

const routes = [
  {
    path: '/',
    component: index,
  },
  {
    path: '/home',
    name: 'main',
    component: () => import('@/pages/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path:'/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () =>import('@/pages/RegisterPage.vue'),
  },
  {
    path: '/task-manager',
    component: () =>import('@/pages/TaskManagerPage.vue'),
  },
  {
    path: '/online',
    component: () =>import('@/pages/ChatPage.vue'),
  },
  {
    path: '/video',
    component: () =>import('@/pages/VideoPage.vue'),
  },
  {
    path: '/settings',
    component: () =>import('@/pages/SettingPage.vue'),
  },
  {
    path: '/:forgot-password',
    component: () =>import('@/pages/ForgotPasswordPage.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (to.meta.requiresAuth && !user) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
