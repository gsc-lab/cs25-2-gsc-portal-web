<template>
  <AppLayout pageName="signup-rejected">
    <div class="max-w-md mx-auto w-full bg-white rounded-card border border-gray-200 shadow-subtle p-6 mt-12 text-center">
      <h1 class="text-xl font-bold text-text-heading mb-6">회원가입 요청 거부</h1>

      <!-- Icon for rejected status -->
      <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>

      <p class="text-red-600 font-semibold text-center text-lg mb-4">승인 거절됨</p>
      <p class="text-text-muted text-sm text-center whitespace-pre-line leading-relaxed mb-6">
        회원가입 요청이 거부되었습니다.
        <br>
        자세한 사유는 관리자에게 문의해주세요.
      </p>

      <router-link to="/register" class="bg-primary text-white rounded-base py-2 w-full hover:bg-primary-dark mt-6 block text-center transition-colors duration-200">
        재시도
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup></script>
