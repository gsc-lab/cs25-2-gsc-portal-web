import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isMobileSidebarOpen: false,
    isTabletSidebarMinimized: false,
  }),
  actions: {
    toggleMobileSidebar() {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    },
    setMobileSidebar(isOpen) {
      this.isMobileSidebarOpen = isOpen;
    },
    toggleTabletSidebarMinimized() {
      this.isTabletSidebarMinimized = !this.isTabletSidebarMinimized;
    },
    setTabletSidebarMinimized(isMinimized) {
      this.isTabletSidebarMinimized = isMinimized;
    }
  },
});
