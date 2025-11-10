import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/Login/LoginPage.vue'
import ClassroomPage from '@/pages/Classroom/ClassroomPage.vue'

const routes = [
  { path: '/', name: 'LoginPage', component: LoginPage },
  { path: '/classroom', name: 'ClassroomPage', component: ClassroomPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
