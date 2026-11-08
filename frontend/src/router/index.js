import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import ArchiveList from '../views/ArchiveList.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/archive', component: ArchiveList }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('isLogin')
  if (to.path === '/archive' && !isLogin) {
    next('/login')
  } else {
    next()
  }
})

export default router
