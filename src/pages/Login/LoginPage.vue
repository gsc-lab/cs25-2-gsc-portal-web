<template>
  <div
    v-if="!user.userInfo"
    class="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4 font-sans"
  >
    <div
      class="w-full max-w-[520px] bg-white rounded-[24px] p-10 md:p-12 text-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] animate-fade-in-up"
    >
      <div class="flex flex-col items-center mb-10">
        <div class="relative group mb-8">
          <img
            class="w-[240px] h-[240px] rounded-[1000px] object-cover shadow-sm transition-transform duration-500 ease-out group-hover:scale-105"
            src="/src/styles/Gemini_Generated_Image_4j52344j52344j52.png"
            alt="GSC-Portal Icon"
          />
          <div
            class="absolute inset-0 rounded-[20px] ring-1 ring-black/5 pointer-events-none"
          ></div>
        </div>

        <h1 class="text-[28px] font-semibold text-[#1d1d1f] tracking-tight mb-2">GSC-Portal</h1>
        <p class="text-[15px] text-[#86868b]">Global System Convergence</p>
      </div>

      <button
        @click="googleLogin"
        class="relative w-full flex items-center justify-center gap-3 bg-white text-[#1d1d1f] border border-[#d2d2d7] rounded-[14px] py-3.5 text-[17px] font-medium transition-all duration-200 hover:bg-[#F5F5F7] hover:border-[#c6c6c6] active:scale-[0.98]"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          class="w-5 h-5"
        />
        <span>Google 계정으로 계속하기</span>
      </button>
    </div>

    <div class="absolute bottom-6 text-[11px] text-[#86868b] text-center">
      Copyright © 2025 GSC Portal.
    </div>
  </div>
</template>

<script setup>
import { googleLogin } from '@/api/auth'
import { useUserStore } from '@/stores/user'
const user = useUserStore()
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
    transform: translateY(20px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
