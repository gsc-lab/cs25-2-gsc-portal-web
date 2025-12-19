<template>
  <header
    v-if="user.userInfo && router.currentRoute.value.path !== '/login'"
    class="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-bg-paper text-text-heading sticky top-0 z-20"
  >
    <!-- Left Section: Mobile Sidebar Toggle and Logo -->
    <div class="flex items-center">
      <!-- Mobile Sidebar Toggle -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Desktop Sidebar Minimize Toggle -->
      <button
        @click="uiStore.toggleTabletSidebarMinimized()"
        class="hidden lg:flex p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ml-2"
      >
        <svg v-if="uiStore.isTabletSidebarMinimized" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l-7 7 7 7M17 5l-7 7 7 7"></path>
        </svg>
        <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
        </svg>
      </button>

      <router-link to="/" class="ml-4 text-xl font-semibold text-text-heading">GSC-Portal</router-link>
    </div>

    <!-- Right Section: User Actions -->
    <div class="flex items-center space-x-4">
      <!-- User Profile Link (Example) -->
      <router-link to="/profile" class="text-text-base hover:text-primary transition-colors duration-200 hidden md:block">
        프로필
      </router-link>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-base text-text-base bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-subtle"
      >
        로그아웃
      </button>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { postuserInfo } from '@/api/auth';
import { useUiStore } from '@/stores/ui'; // Import the UI store

const router = useRouter();
const user = useUserStore();
const uiStore = useUiStore(); // Initialize UI store

async function logout() {
  try {
    const response = await postuserInfo();
    console.log('로그아웃 요청완료', response);
  } catch (err) {
    console.error('로그아웃 실패', err);
  } finally {
    const storeLogout = user.logoutUser();
    console.log('store 사용자 정보 삭제', storeLogout);
    console.log('store userinfo', user.userInfo);
    router.push('/login');
  }
}
</script>

<style scoped>
/* Scoped styles removed. Tailwind CSS classes are used directly in the template. */
</style>