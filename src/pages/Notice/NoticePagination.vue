<template>
  <div class="flex justify-center items-center gap-2 mt-12 mb-8" v-if="totalPages > 0">
    <!-- Previous Page Button -->
    <button
      class="flex justify-center items-center min-w-9 h-9 px-1 border border-gray-200 bg-white text-gray-500 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 font-bold text-gray-400"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      &lt;
    </button>

    <!-- Page Number Buttons -->
    <button
      v-for="page in pageNumbers"
      :key="page"
      :class="['flex justify-center items-center min-w-9 h-9 px-1 border border-gray-200 bg-white text-gray-500 rounded-md text-sm font-medium cursor-pointer transition-all duration-200', { 'bg-primary border-primary text-white font-bold shadow-md': page === currentPage }]"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <!-- Next Page Button -->
    <button
      class="flex justify-center items-center min-w-9 h-9 px-1 border border-gray-200 bg-white text-gray-500 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 font-bold text-gray-400"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalCount: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize))

const pageNumbers = computed(() => {
  const pages = []
  // Only show a limited number of page numbers around the current page
  const maxPagesToShow = 5; // e.g., current page +/- 2
  let startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  // Adjust startPage if endPage hit the limit
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
/* Scoped styles removed */
</style>