// 基础路由配置（登录、档案列表两个路由，其余待后续开发）
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/archive/list',
    name: 'ArchiveList',
    component: () => import('../views/ArchiveList.vue')
  },
  {
    path: '/',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
