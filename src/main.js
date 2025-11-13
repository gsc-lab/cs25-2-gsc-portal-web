import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './styles/index.css'
import { useUserStore } from '@/stores/user'

import pinia from '@/stores'

const app = createApp(App)
app.use(pinia)
document.cookie =
  'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5OTk5MDAxLCJyb2xlIjoiYWRtaW4ifQ.d8YwPqCpN8YJ0ymZFvdQ1lnt7c2SRDaiSHOIqPoOFJI; path=/;'

// 로그인 상태 확인
const user = useUserStore()
try {
  await user.fetchUser()
} catch (err) {
  console.error('로그인 상태 확인 실패', err)
}

app.use(router)
app.mount('#app')
