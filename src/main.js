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

const userStore = useUserStore()
await userStore.fetchUser()


app.mount('#app')
