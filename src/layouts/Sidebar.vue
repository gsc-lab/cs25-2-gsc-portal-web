<template>
  <aside
    :class="{
      'fixed inset-y-0 left-0 z-40 lg:static lg:inset-auto lg:translate-x-0': true,
      'transform -translate-x-full': !uiStore.isMobileSidebarOpen && !isDesktop, // Mobile hidden
      'transform translate-x-0': uiStore.isMobileSidebarOpen, // Mobile open
      'w-64': !uiStore.isTabletSidebarMinimized && isDesktop, // Desktop wide
      'w-16': uiStore.isTabletSidebarMinimized && isDesktop, // Desktop icon mode
    }"
    class="flex-shrink-0 bg-bg-paper border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto"
  >
    <div class="h-14 flex items-center justify-center border-b border-gray-200 px-4">
      <!-- Logo or App Name -->
      <router-link to="/" class="flex items-center text-lg font-semibold text-text-heading whitespace-nowrap">
        <span v-if="!uiStore.isTabletSidebarMinimized && isDesktop">GSC Portal</span>
        <span v-else>GP</span>
      </router-link>
    </div>

    <nav class="mt-4 px-2">
      <ul>
        <li v-for="item in navItems" :key="item.name" class="mt-1">
          <router-link
            :to="item.path"
            class="flex items-center p-2 text-text-base rounded-md hover:bg-gray-100 group"
            :class="{ 'bg-gray-100 text-primary-dark': route.path === item.path }"
          >
            <svg class="flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-primary-dark"
                 :class="{ 'text-primary-dark': route.path === item.path }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
            </svg>
            <span v-if="!uiStore.isTabletSidebarMinimized && isDesktop" class="ml-3">{{ item.name }}</span>
            <span v-else class="sr-only">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const uiStore = useUiStore();
const userStore = useUserStore(); // Use the user store to check roles
const route = useRoute(); // Get current route information
const router = useRouter();

const isDesktop = ref(window.innerWidth >= 1024); // Tailwind's lg breakpoint

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
  // If moving from mobile to desktop, ensure mobile sidebar is closed
  if (isDesktop.value && uiStore.isMobileSidebarOpen) {
    uiStore.setMobileSidebar(false);
  }
  // Adjust tablet sidebar minimized state based on window size
  if (window.innerWidth >= 768 && window.innerWidth < 1024) { // md breakpoint range
    uiStore.setTabletSidebarMinimized(true); // Always minimized on tablet
  } else if (window.innerWidth < 768) { // sm breakpoint range (mobile)
    // On mobile, the sidebar is a drawer, not minimized in the same way
    uiStore.setTabletSidebarMinimized(false);
  } else { // lg breakpoint range (desktop)
    // On desktop, retain user's preference or default to not minimized
    // No change to uiStore.isTabletSidebarMinimized on desktop unless user clicks toggle
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial check
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const navItems = computed(() => {
  const items = [
    { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }, // Home
    { name: 'Notice', path: '/notice', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }, // Clipboard/Document
    { name: 'Timetable', path: '/timetable', icon: 'M12 6.253v13m0-13C10.832 5.477 9.206 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.794 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.794 5 16.5 5c1.706 0 3.332.477 4.5 1.253v13C19.832 18.477 18.206 18 16.5 18c-1.706 0-3.332.477-4.5 1.253' }, // Calendar
    { name: 'Cleaning', path: '/cleaningH', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H5.456a2 2 0 01-1.995-1.897L2.613 9.74A1 1 0 013.636 9h10.063a1 1 0 01.954.764zM20 7h-6M10 11V5a2 2 0 00-2-2H4a2 2 0 00-2 2v6m6-6h2' }, // Brush/Cleaning (Placeholder for now)
    { name: 'Classroom', path: '/classroom', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' }, // Building/School
    { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }, // User
  ];

  if (userStore.userInfo && userStore.userInfo.role_type === 'admin') {
    items.push({ name: 'Admin', path: '/admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' }); // Settings/Cog
  }
  return items;
});
</script>

<style scoped>
/* You can add custom styles here if necessary, but prefer Tailwind utilities */
</style>
