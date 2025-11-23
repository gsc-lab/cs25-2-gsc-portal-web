<template>
  <AppLayout pageName="signup-wait">
    <div
      class="max-w-md mx-auto w-full bg-white rounded-card border border-gray-200 shadow-subtle p-6 mt-12 text-center space-y-4"
    >
      <h1 class="text-xl font-bold text-text-heading mb-6">회원가입 요청 완료</h1>

      <!-- Icon for waiting -->
      <svg
        class="mx-auto h-16 w-16 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>

      <p class="text-lg font-semibold text-primary">회원가입 요청이 성공적으로 접수되었습니다!</p>
      <p class="text-sm text-text-muted leading-relaxed">관리자의 승인을 기다려주세요.</p>
      <p><button @click="handleLoginPage">로그인 페이지로 이동</button></p>
    </div>
  </AppLayout>
</template>
<script setup>
import router from '@/router'

const handleLoginPage = () => {
  router.push({ path: '/login' })
}
</script>
