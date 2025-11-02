<template>
  <div v-if="user.userInfo === null" class="login-container">
    <div class="login-card">
      <div class="logo-wrapper">
        <img
          class="portal-icon"
          src="/src\styles\Gemini_Generated_Image_4j52344j52344j52.png"
          alt="GSC-Portal Icon"
        />
        <h1 class="portal-title">GSC-Portal</h1>
      </div>

      <button @click="googleLogin" class="google-login-button">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          class="google-icon"
        />
        <span>Google 계정으로 시작하기</span>
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
/* 전체 페이지 배경 및 중앙 정렬 */
.login-container {
  @apply flex justify-center items-center h-screen p-4;
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  font-family:
    'Pretendard Variable',
    Pretendard,
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    'Helvetica Neue',
    'Segoe UI',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    sans-serif;
}

/* 로그인 카드 스타일
  ✅ 'max-w-2xl' 유지, 'py-24'로 세로 패딩을 더욱 늘려 세로 길이 추가 확장
*/
.login-card {
  @apply bg-white rounded-3xl p-8 sm:py-24 w-full max-w-2xl text-center transform transition-all duration-500 ease-in-out shadow-xl hover:shadow-2xl hover:-translate-y-1;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  animation: fadeInScale 0.8s ease-out forwards;
}

/* 등장 애니메이션 키프레임 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 로고/아이콘 래퍼 */
.logo-wrapper {
  @apply mb-14; /* 기존 mb-12에서 증가 */
}

/* 포털 아이콘 스타일
  ✅ 'w-80 h-80'으로 타이틀보다 훨씬 크게 증가
*/
.portal-icon {
  @apply w-80 h-80 rounded-full object-cover mx-auto mb-7 shadow-lg; /* 기존 mb-6에서 증가 */
  border: 4px solid #fff;
  transition: transform 0.3s ease;
}
.portal-icon:hover {
  transform: scale(1.05) rotate(5deg);
}

/* 포털 타이틀 스타일
  ✅ 'text-6xl' 유지
*/
.portal-title {
  @apply text-6xl font-extrabold text-gray-800 tracking-wide;
  background: linear-gradient(45deg, #4caf50, #2196f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Montserrat', sans-serif;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

/* Google 로그인 버튼 스타일
  ✅ 'font-size: 1.5rem' (text-2xl) 및 패딩('px-10 py-4') 유지
  ✅ 'mb-10'으로 하단 여백 증가
*/
.google-login-button {
  @apply flex items-center justify-center gap-4 bg-white text-gray-700 font-bold rounded-full px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300 w-full mb-8; /* mb-8에서 증가 */
  border: 2px solid #ddd;
  font-size: 1.5rem; /* text-2xl에 해당 */
  position: relative;
  overflow: hidden;
}

.google-login-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.3s ease,
    height 0.3s ease;
  z-index: 0;
}

.google-login-button:active::before {
  width: 300%;
  height: 300%;
}

.google-login-button span {
  @apply relative z-10;
}

/* Google 로고 아이콘
  ✅ 'w-8 h-8' 유지
*/
.google-icon {
  @apply w-8 h-8 relative z-10;
}
</style>
