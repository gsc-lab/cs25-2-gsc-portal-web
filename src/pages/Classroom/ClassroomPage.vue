<script setup>
import { ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import Reservation from './Reservation.vue'
import AttendancePoll from './AttendancePoll.vue'

const isReservation = ref(true)
</script>

<template>
  <AppLayout pageName="Classroom">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex justify-center mb-6">
        <div class="flex bg-gray-100 p-1.5 rounded-full shadow-inner">
          <button
            @click="isReservation = true"
            :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', isReservation ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']"
          >
            실습실 예약
          </button>
          <button
            @click="isReservation = false"
            :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', !isReservation ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']"
          >
            강의실 개방
          </button>
        </div>
      </div>

      <!-- Content for Reservation or AttendancePoll -->
      <Reservation v-if="isReservation" />
      <AttendancePoll v-else />
    </div>
  </AppLayout>
</template>
