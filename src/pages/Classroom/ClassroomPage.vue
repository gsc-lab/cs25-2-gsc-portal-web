<script setup>
import { ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import Reservation from './Reservation.vue'
import AttendancePoll from './AttendancePoll.vue'

const isReservation = ref(true)
</script>

<template>
  <AppLayout pageName="Classroom">
    <div style="background-color: antiquewhite; padding: 5px">
      <button @click="isReservation = true">실습실 예약</button> |
      <button @click="isReservation = false">강의실 개방</button>
    </div>

    <!-- 실습실 예약 -->
    <Reservation v-if="isReservation" />
    <!-- 강의실 개방 -->
    <AttendancePoll v-else />
  </AppLayout>
</template>
