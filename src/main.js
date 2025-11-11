import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './styles/index.css'
import { useUserStore } from '@/stores/user'

import pinia from '@/stores'

const app = createApp(App)
app.use(pinia)

// 로그인 상태 확인
const user = useUserStore()
try {
  await user.fetchUser()
} catch (err) {
  console.error('로그인 상태 확인 실패', err)
}

app.use(router)
app.mount('#app')
