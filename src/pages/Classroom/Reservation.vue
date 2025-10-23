<script setup>
import {ref, watch} from 'vue'
import { getClassroomsInfo, getReservation } from '@/api/classroomApi';
import ReservationTable from './components/ReservationTable.vue';

const classrooms = ref(null)
const selectCR = ref(null);
const selectRes = ref(null);


watch(() => selectCR, async (newCRid) => {
  if (classrooms.value == null) {
    classrooms.value = await getClassroomsInfo();
    selectCR.value = classrooms.value[0].classroom_id
    selectRes.value = await getReservation(selectCR.value);
  }

}, { immediate: true })
</script>

<template >
  <div style="background-color: aquamarine;">
    Reservation
    <!-- 강의실 필터링 -->
    <div>
      <label for="classroom">강의실 선택 : </label>
      <select id="classroom" v-model="selectCR">
        <option v-for="clr in classrooms" :value="clr.classroom_id" :key="clr.classroom_id">{{ clr.building }}{{ clr.room_number }}</option>
      </select>
    </div>

    <!-- 예약 표 -->
    <ReservationTable v-model="selectRes" />
  </div>
</template>
