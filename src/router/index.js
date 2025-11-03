import { useUserStore } from '@/stores/user'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/login', name: 'login', component: () => import('@/pages/Login/LoginPage.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Main/DashBoard.vue') },
  { path: '/register', name: 'register', component: () => import('@/pages/Register/RegisterPage.vue') },
  { path: '/registerWait', name: 'registerWait', component: () => import('@/pages/Register/SignupWaitPage.vue') },
  { path: '/notice', name: 'notice', component: () => import('@/pages/Notice/NoticePage.vue') },
  { path: '/notice/grade/:gradeId', name: 'notice-grade', component: () => import('@/pages/Notice/NoticePage.vue') },
  { path: '/notice/write', name: 'notice/write', component: () => import('@/pages/Notice/NoticeWrite.vue') },
  { path: '/noticeView/:id', name: 'noticeView/:id', component: () => import('@/pages/Notice/NoticeView.vue') },
  { path: '/noticeEdit/:id', name: 'noticeEdit/:id', component: () => import('@/pages/Notice/NoticeEdit.vue') },
  { path: '/timetable', name: 'timetable', component: () => import('@/pages/TimeTable/TimeTablePage.vue') },
  { path: '/cleaning', name: 'cleaning', component: () => import('@/pages/Cleaning/CleaningPage.vue') },
  { path: '/cleaning-rosters', name: 'CleaningRosterPage', component: () => import('@/pages/Cleaning/CleaningPage.vue') },
  { path: '/cleaning-rosters/generator', name: 'CleaningGeneratorPage', component: () => import('@/pages/Cleaning/components/CleaningPost.vue') },
  { path: '/cleaning-rosters/delete', name: 'CleaningDeletePage', component: () => import('@/pages/Cleaning/components/CleaningDelete.vue') },
  { path: '/weekendAttendance', name: 'weekendAttendance', component: () => import('@/pages/AttendanceRoom/WeekendAttendance.vue') },
  // { path: '/profile', name: 'profile', component }
  { path: '/profile', name: 'profile', component: () => import('@/pages/Profile/UserProfile.vue') },
  { path: '/:pathMatch(.*)', name: 'NotFound', component: () => import('@/pages/NotFound/NotFound.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (!userStore.userInfo && to.path !== '/login') {
    return next('/login')
  }

  if (userStore.userInfo && to.path === '/login') {
    return next('/dashboard')
  }

  next()
})

export default router;
