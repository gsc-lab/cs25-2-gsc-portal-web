<script setup>
import {ref} from 'vue'
import Reservation from './components/Reservation.vue';
import Setting from './components/Setting.vue';

const isRes = ref(true)

</script>

<template>
  <button @click="isRes = true">예약</button> |
  <button @click="isRes = false">강의실 등록</button>
  <Reservation v-if="isRes"/>
  <Setting v-else />
</template>
