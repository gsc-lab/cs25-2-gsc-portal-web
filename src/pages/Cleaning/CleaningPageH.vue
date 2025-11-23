<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-text-heading">청소 구역 배정</h2>
        <router-link
          to="/cleaningH/cleaningRosterCreate"
          class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
        >
          + 청소 로스터 생성
        </router-link>
      </div>

      <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
        <CleaningMemberList />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import CleaningMemberList from './CleaningMemberList.vue'
</script>

<style scoped>
/* Scoped styles removed */
</style>
