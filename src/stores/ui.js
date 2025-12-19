import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isMobileSidebarOpen: false,
    isTabletSidebarMinimized: false,
    isDesktop: false,
    isTimeTablePanelOpen: false, // Re-add new state
  }),
  getters: {
    isSidebarWide: (state) => state.isDesktop && !state.isTabletSidebarMinimized,
    isSidebarMinimized: (state) => state.isDesktop && state.isTabletSidebarMinimized,
  },
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
    },
    setIsDesktop(value) {
      this.isDesktop = value;
    },
    // Re-add actions for TimeTable panel
    toggleTimeTablePanel() {
      this.isTimeTablePanelOpen = !this.isTimeTablePanelOpen;
    },
    setTimeTablePanel(isOpen) {
      this.isTimeTablePanelOpen = isOpen;
    },
  },
});
