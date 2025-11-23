<template>
  <div class="flex flex-col min-h-screen bg-bg-default">
    <!-- Header -->
    <MainHeader @toggle-sidebar="uiStore.toggleMobileSidebar" />

    <div class="flex flex-1">
      <!-- Sidebar for Desktop/Tablet and Drawer for Mobile -->
      <Sidebar />

      <!-- Overlay for mobile sidebar -->
      <div
        v-if="uiStore.isMobileSidebarOpen"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
        @click="uiStore.setMobileSidebar(false)"
      ></div>

      <!-- Main Content Area -->
      <main
        class="flex-1 transition-all duration-300 ease-in-out"
        :class="{
          'lg:ml-64': !uiStore.isTabletSidebarMinimized, // Desktop wide sidebar
          'lg:ml-16': uiStore.isTabletSidebarMinimized, // Desktop icon sidebar (when tablet mode is active on desktop)
          'ml-0': uiStore.isMobileSidebarOpen, // Mobile drawer open
        }"
      >
        <div
          class="container mx-auto py-6"
          :class="{
            'px-4 sm:px-6 md:px-8 lg:px-10': true, // Responsive padding
          }"
        >
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import MainHeader from '@/layouts/MainHeader.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { onMounted, onUnmounted } from 'vue'

const uiStore = useUiStore()
const user = useUserStore()

// Reset mobile sidebar state on mount and unmount (e.g., for hot module reloading)
onMounted(() => {
  uiStore.setMobileSidebar(false)
  // Optional: Add a listener for screen resize to adjust tablet sidebar state
})

onUnmounted(() => {
  uiStore.setMobileSidebar(false)
})
</script>

<style scoped>
/* You can add global layout styles here if necessary, though Tailwind should handle most */
</style>
