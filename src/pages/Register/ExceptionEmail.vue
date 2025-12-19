<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4 font-sans">

    <div
      class="max-w-[400px] w-full bg-white rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] p-10 text-center animate-fade-in-up"
    >
      <div class="mx-auto w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <svg
          class="w-10 h-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <h1 class="text-[22px] font-semibold text-[#1d1d1f] mb-3 tracking-tight">
        허용되지 않은 이메일입니다
      </h1>

      <div class="space-y-1 mb-8">
        <p class="text-[15px] text-[#86868b] leading-relaxed">
          해당 구글 계정으로는 가입할 수 없습니다.
        </p>
        <p class="text-[15px] text-[#86868b] leading-relaxed">
          학교 웹메일 또는 승인된 계정을 사용해주세요.
        </p>
      </div>

      <div class="mb-8 p-3 bg-[#F5F5F7] rounded-xl">
        <p class="text-[13px] text-[#86868b]">
          <span class="font-semibold text-[#0071e3]">{{ countdown }}초</span> 뒤 로그인 화면으로 이동합니다.
        </p>
      </div>

      <button
        @click="handleLoginPage"
        class="w-full bg-[#1d1d1f] hover:bg-[#333336] text-white text-[15px] font-medium rounded-[14px] py-[14px] transition-all duration-200 active:scale-[0.98] shadow-sm"
      >
        지금 로그인 화면으로 이동
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5) // 5초 카운트다운
let timer = null

const handleLoginPage = () => {
  router.push({ path: '/login' })
}

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      handleLoginPage()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* Apple System Fonts */
.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Entrance Animation */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
