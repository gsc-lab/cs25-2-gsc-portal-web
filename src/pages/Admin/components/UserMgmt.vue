<script setup>
import Student from './UserMgmtComponents/Student.vue'
import AdminProfessor from './UserMgmtComponents/Admin&Professor.vue'
import { ref } from 'vue'

const stdOpen = ref(false)
const adminOpen = ref(false)
</script>

<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 mb-6">
    <h2 class="text-xl font-bold text-text-heading mb-6">사용자 관리</h2>

    <!-- 학생 관리 -->
    <div class="mb-4">
      <button @click="stdOpen = !stdOpen" class="flex justify-between items-center w-full px-4 py-3 bg-gray-50 text-text-base font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
        <span>학생 관리</span>
        <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-90': stdOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      <div v-if="stdOpen" class="mt-4">
        <Student />
      </div>
    </div>

    <!-- 관리자, 교수 관리 -->
    <div>
      <button @click="adminOpen = !adminOpen" class="flex justify-between items-center w-full px-4 py-3 bg-gray-50 text-text-base font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
        <span>관리자, 교수 관리</span>
        <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-90': adminOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      <div v-if="adminOpen" class="mt-4">
        <AdminProfessor />
      </div>
    </div>
  </div>
</template>
