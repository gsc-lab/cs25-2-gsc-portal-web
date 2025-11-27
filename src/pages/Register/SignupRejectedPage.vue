<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4 font-sans">
    <div
      class="max-w-[400px] w-full bg-white rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] p-10 text-center animate-fade-in-up"
    >
      <div class="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg
          class="w-10 h-10 text-[#FF3B30]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>

      <h1 class="text-[24px] font-semibold text-[#1d1d1f] mb-3 tracking-tight">
        가입 요청이 승인되지 않았습니다
      </h1>

      <div class="space-y-1 mb-10">
        <p class="text-[15px] text-[#86868b] leading-relaxed">
          내부 심사 기준에 따라 가입 요청이 반려되었습니다.
        </p>
        <p class="text-[15px] text-[#86868b] leading-relaxed">
          자세한 사유는 관리자에게 문의해주세요.
        </p>
      </div>

      <button
        @click="handleLoginPage"
        class="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white text-[15px] font-medium rounded-[14px] py-[14px] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md"
      >
        로그인 페이지로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'

const handleLoginPage = () => {
  router.push({ path: '/login' })
}
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
