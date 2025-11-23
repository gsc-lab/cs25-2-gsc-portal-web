<template>
  <AppLayout>
    <div v-if="user.userInfo.role_type !== 'student'" class="flex justify-end items-center mb-6">
      <router-link to="/notice/write" class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-subtle">공지사항 작성</router-link>
    </div>

    <NoticeListComponent class="ListComponent" />
  </AppLayout>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import NoticeListComponent from './NoticeListComponent.vue'
import AppLayout from '@/layouts/AppLayout.vue'

// user store ( user.userInfo ) 불러오기
const user = useUserStore()
</script>

<style scoped>
/* Scoped styles removed */
</style>
