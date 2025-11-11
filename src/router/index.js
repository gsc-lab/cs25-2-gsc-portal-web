import { useUserStore } from '@/stores/user'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  // ==================================================  로그인  ==================================================
  { path: '/login', name: 'login', component: () => import('@/pages/Login/LoginPage.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Main/DashBoard.vue') },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/Register/RegisterPage.vue'),
  },
  {
    path: '/registerWait',
    name: 'registerWait',
    component: () => import('@/pages/Register/SignupWaitPage.vue'),
  },
  // ==================================================  공지사항  ==================================================
  { path: '/notice', name: 'notice', component: () => import('@/pages/Notice/NoticePage.vue') },
  {
    path: '/notice/grade/:gradeId',
    name: 'notice-grade',
    component: () => import('@/pages/Notice/NoticePage.vue'),
  },
  {
    path: '/notice/write',
    name: 'notice/write',
    component: () => import('@/pages/Notice/NoticeWrite.vue'),
  },
  {
    path: '/noticeView/:id',
    name: 'noticeView/:id',
    component: () => import('@/pages/Notice/NoticeView.vue'),
  },
  {
    path: '/noticeEdit/:id',
    name: 'noticeEdit/:id',
    component: () => import('@/pages/Notice/NoticeEdit.vue'),
  },
  // ==================================================  시간표  ==================================================
  {
    path: '/timetable',
    name: 'timetable',
    component: () => import('@/pages/TimeTable/TimeTablePage.vue'),
  },
  // ==================================================  청소  ==================================================
  {
    path: '/cleaningH',
    name: 'cleaningH',
    component: () => import('@/pages/Cleaning/CleaningPageH.vue'),
  },
  {
    path: '/cleaningH/grade/:gradeId',
    name: 'cleaning-grade',
    component: () => import('@/pages/Cleaning/CleaningPageH.vue'),
  },
  {
    path: '/cleaningH/cleaningRosterCreate',
    name: 'cleaning-create',
    component: () => import('@/pages/Cleaning/CleaningRosterCreate.vue'),
  },
  {
    path: '/cleaning',
    name: 'cleaning',
    component: () => import('@/pages/Cleaning/CleaningPage.vue'),
  },
  {
    path: '/cleaning-rosters',
    name: 'CleaningRosterPage',
    component: () => import('@/pages/Cleaning/CleaningPage.vue'),
  },
  {
    path: '/cleaning-rosters/generator',
    name: 'CleaningGeneratorPage',
    component: () => import('@/pages/Cleaning/components/CleaningPost.vue'),
  },
  {
    path: '/cleaning-rosters/delete',
    name: 'CleaningDeletePage',
    component: () => import('@/pages/Cleaning/components/CleaningDelete.vue'),
  },
  // ==================================================  강의실  ==================================================
  {
    path: '/classroom',
    name: 'ClassroomPage',
    component: () => import('@/pages/Classroom/ClassroomPage.vue'),
  },
  // ==================================================  Mypage  ==================================================
  { path: '/profile', name: 'profile', component: () => import('@/pages/Profile/UserProfile.vue') },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/NotFound.vue'),
  },
  // ==================================================  관리자  ==================================================
  { path: '/admin', name: 'AdminPage', component: () => import('@/pages/Admin/AdminPage.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 비로그인 사용자가 접근할 수 있는 페이지 목록
  const publicPaths = ['/login', '/register', '/registerWait']

  // 1. 비로그인 상태(userInfo 없음) + 가려는 곳이 publicPaths에 *포함되지 않은* 경우
  if (!userStore.userInfo && !publicPaths.includes(to.path)) {
    // /login 리다이렉트
    return next('/login')
  }

  // 2. 로그인 상태(userInfo 있음) + 가려는 곳이 /login인 경우
  if (userStore.userInfo && to.path === '/login') {
    // 대시보드로 리다이렉트
    return next('/dashboard')
  }

  next()
})

export default router
