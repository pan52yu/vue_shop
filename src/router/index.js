import Vue from 'vue'
import VueRouter from 'vue-router'
import { getLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/view/Login')
  },
  {
    path: '/home',
    component: () => import('@/view/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/view/Home/components/welcome')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = getLocal(USERKEYS)
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
