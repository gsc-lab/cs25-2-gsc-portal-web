<script setup>
import {ref, watch, onMounted} from 'vue'
import { getClassroomsInfo, getReservation } from '@/api/classroomApi';
import ReservationTable from './components/ReservationTable.vue';
import { useClassroomStore } from '@/stores/classroom';
import { time } from '@/util/time';

const CRstore = useClassroomStore()
const classrooms = ref(null)
const selectCR = ref(null);
const selectRes = ref(null);

const setSelectRes = async (classroom_id) => {
  selectRes.value = await getReservation(classroom_id)
}

onMounted(async () => {
  classrooms.value = await CRstore.getClassroomInfo()
  selectCR.value = classrooms.value[0].classroom_id
  setSelectRes(selectCR.value)
})

watch(
  () => selectCR.value,
  async (newCRid, oldCRid) => {
    if (newCRid && newCRid !== oldCRid) {
      await setSelectRes(newCRid)
    }
  }
)
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
