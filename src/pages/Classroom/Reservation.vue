<script setup>
import {ref, watch, onMounted} from 'vue'
import ReservationTable from './components/ReservationTable.vue';
import { useClassroomStore } from '@/stores/classroom';
import Sidebar from './Sidebar/Sidebar.vue';

const CRstore = useClassroomStore()   // classroom store
const classrooms = ref(null)          // classroom 데이터
const selectCR = ref(null);           // 선택한 강의실 id 저장
const isOpen = ref(false);            // Sidebar 열림 = true

// classroom 데이터 저장, 첫번째 강의실의 예약정보 저장
onMounted(async () => {
  classrooms.value = await CRstore.getClassroomInfo()
  selectCR.value = await CRstore.getSelectCR()
  console.log(" ");
})

// ===============  selectCR (classroom_id) 감시 ===============
watch(() => selectCR.value,
  async (newCRid, oldCRid) => {
    if (newCRid && newCRid !== oldCRid) {
      CRstore.setSelectCR(newCRid)
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
        <option v-for="clr in classrooms" :value="clr.classroom_id" :key="clr.classroom_id">
          {{ clr.building }}{{ clr.room_number }}
        </option>
      </select>
    </div>
    <button @click="isOpen = !isOpen">=</button>
    <Sidebar v-if="isOpen" />

    <!-- 예약 표 (초기화 후 렌더링) -->
    <ReservationTable v-if="selectCR" v-model="isOpen"/>
  </div>
</template>
