import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/Login/LoginPage.vue'
import TimeTablePage from '@/pages/TimeTable/TimeTablePage.vue'
import ClassroomPage from '@/pages/Classroom/ClassroomPage.vue'
import AdminPage from '@/pages/Admin/AdminPage.vue'

const routes = [
  { path: '/', name: 'LoginPage', component: LoginPage },
  { path: '/timetable', name: 'TimeTablePage', component: TimeTablePage },
  { path: '/classroom', name: 'ClassroomPage', component: ClassroomPage },
  { path: '/admin', name: 'AdminPage', component: AdminPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
