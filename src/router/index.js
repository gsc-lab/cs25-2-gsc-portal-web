import { createWebHistory, createRouter } from 'vue-router'
import MainPage from '@/pages/Main/MainPage.vue'
import NoticePage from '@/pages/Notice/NoticePage.vue'
import TimeTablePage from '@/pages/TimeTable/TimeTablePage.vue'
import NoticeView from '@/pages/Notice/NoticeView.vue'
import RegisterPage from '@/pages/Register/RegisterPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/register', component: RegisterPage},
  { path: '/notice', component: NoticePage },
  { path: '/notice/:notice_id', name: 'notice', component: NoticeView },
  { path: '/timetable', component: TimeTablePage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
