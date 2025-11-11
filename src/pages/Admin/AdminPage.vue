<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import Menubar from './Menubar.vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
const Ustore = useUserStore()
const isAdmin = ref(null) // 학생인지

// 사용자 정보 확인
watch(
  () => {
    isAdmin.value = Ustore.userInfo.role_type == 'admin' ? true : false
    // console.log(isStudent.value)
  },
  { immediate: true },
)
</script>

<template>
  <AppLayout pageName="AdminPage" v-if="isAdmin">
    <Menubar />
  </AppLayout>
</template>
