import { createWebHistory, createRouter } from 'vue-router'
import DashBoard from '@/pages/Main/DashBoard.vue'
import NoticePage from '@/pages/Notice/NoticePage.vue'
import TimeTablePage from '@/pages/TimeTable/TimeTablePage.vue'
import NoticeView from '@/pages/Notice/NoticeView.vue'
import RegisterPage from '@/pages/Register/RegisterPage.vue'
import NoticeWrite from '@/pages/Notice/NoticeWrite.vue'
import LoginPage from '@/pages/Login/LoginPage.vue'
import CleaningPage from '@/pages/Cleaning/CleaningPage.vue'
import NoticeEdit from '@/pages/Notice/NoticeEdit.vue'
import SignupWaitPage from '@/pages/Register/SignupWaitPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/dashboard', component: DashBoard },
  { path: '/register', component: RegisterPage },
  { path: '/registerWait', component: SignupWaitPage },
  { path: '/notice', component: NoticePage },
  { path: '/notice/write', component: NoticeWrite },
  { path: '/noticeView/:id', component: NoticeView },
  { path: '/noticeEdit/:id', component: NoticeEdit },
  { path: '/timetable', component: TimeTablePage },
  { path: '/cleaning', component: CleaningPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
