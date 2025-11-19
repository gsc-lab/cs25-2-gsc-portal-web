import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './styles/index.css'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {

  const userStore = useUserStore()
  const publicPaths = ['/login', '/register', '/registerWait']
  const isPublic = publicPaths.includes(to.path)

  // 로그인 정보가 스토어에 있는지 확인
  if (userStore.userInfo) {

    if (to.path === '/login') {
      return next('/')
    }
    return next()
  }

  // 스토어에 로그인 정보가 없다 ?
  try {
    // 정보 요청 성공시 userInfo 채워짐
    await userStore.fetchUser()

    if (to.path === '/login') {
      return next('/') // 대시보드로 이동
    }
    return next()

  } catch (err) {
    // 정보 요청 실패시 err 처리

    // 백엔드에서 넘겨주는 에러메시지 저장하여 메시지별 분류
    const errorMessage = err.response?.data?.message || err.message

    // 미승인 상태 = pedding 일 경우 registerWait 로 이동
    if (errorMessage === "관리자의 승인을 기다리는 중입니다.") {
      if (to.path !== '/registerWait') {
        return next('/registerWait')
      }
      return next()
    }

    // 승인 거절 = inactive 일 경우 알림을 띄운 후 로그인으로 이동
    if (errorMessage === "가입이 거절된 계정입니다.") {
      alert("가입이 거절된 계정입니다. 관리자에게 문의하세요.")
      return next('/login')
    }

    // 그 외 에러는 전부 login 페이지로 이동
    if (!isPublic) {
      return next('/login')
    }
    return next()
  }
})

app.mount('#app')
