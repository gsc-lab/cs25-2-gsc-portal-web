<script setup>
import { ref, watch } from 'vue'
import Reservation from './components/Reservation.vue'
import Setting from './components/Setting.vue'
import { useUserStore } from '@/stores/user'
const Ustore = useUserStore()

const isStudent = ref(true)
const isRes = ref(true)

watch(
  () => {
    isStudent.value = Ustore.userInfo.role_type == 'student' ? true : false
    // console.log(isStudent.value)
  },
  { immediate: true },
)
</script>

<template>
  <button @click="isRes = true">예약</button> |
  <div v-if="!isStudent">
    <button @click="isRes = false">강의실 등록</button>
  </div>
  <div v-if="isRes">
    <Reservation />
  </div>
  <div v-else>
    <Setting v-if="!isStudent" />
  </div>
</template>
