<template>
  <div v-if="!user.userInfo" class="min-h-screen flex items-center justify-center bg-bg-default px-4">
    <div
      class="w-full max-w-md bg-white rounded-card border border-gray-200 shadow-subtle p-8 text-center"
    >
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <img
          class="w-24 h-24 rounded-full object-cover shadow-md mb-4 transition-transform duration-300 hover:scale-[1.03]"
          src="/src/styles/Gemini_Generated_Image_4j52344j52344j52.png"
          alt="GSC-Portal Icon"
        />
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">
          GSC-Portal
        </h1>
      </div>

      <!-- Google Login Button -->
      <button
        @click="googleLogin"
        class="relative w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-base py-3 text-base font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm overflow-hidden"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          class="w-6 h-6 relative z-10"
        />
        <span class="relative z-10">Google 계정으로 시작하기</span>

        <!-- 웨이브 이펙트 -->
        <span
          class="absolute inset-0 bg-gray-200 opacity-0 rounded-base scale-0 transition-transform duration-300"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { googleLogin } from '@/api/auth'
import { useUserStore } from '@/stores/user'
const user = useUserStore()
</script>

<style scoped>
button:active span:first-of-type {
  opacity: 0.15;
  transform: scale(2.5);
}
</style>
