import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './styles/index.css'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const user = useUserStore()

try {
  await user.fetchUser()
} catch (err) {
  console.error('로그인 상태 확인 실패', err)
}

app.use(router)
app.mount('#app')
