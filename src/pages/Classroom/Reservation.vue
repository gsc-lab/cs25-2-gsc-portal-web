<script setup>
import { ref, watch, onMounted } from 'vue'
import ReservationTable from './components/ReservationTable.vue'
import Setting from './components/Setting.vue'
import { useClassroomStore } from '@/stores/classroom'
import { useUserStore } from '@/stores/user'

const Ustore = useUserStore() // 사용자 store
const isStudent = ref(true) // 학생인지

const CRstore = useClassroomStore() // classroom store
const classrooms = ref(null) // classroom 데이터
const selectCR = ref(null) // 선택한 강의실 id 저장
const isOpen = ref(false) // Sidebar 열림 = true

// classroom 데이터 저장, 첫번째 강의실의 예약정보 저장
onMounted(async () => {
  classrooms.value = await CRstore.getClassroomInfo()
  const date = new Date().toISOString().split('T')[0]
  CRstore.selectReTime.date = date

  selectCR.value = await CRstore.getSelectCR()
  console.log(' ')
})
// 사용자 권한이 학생인지
watch(
  () => {
    isStudent.value = Ustore.userInfo.role_type == 'student' ? true : false
    // console.log(isStudent.value)
  },
  { immediate: true },
)
// ===============  selectCR (classroom_id) 감시 ===============
watch(
  () => selectCR.value,
  async (newCRid, oldCRid) => {
    if (newCRid && newCRid !== oldCRid) {
      console.log('newCRid', newCRid)
      CRstore.setSelectCR(newCRid)
    }
  },
)
</script>

<template>
  <div style="background-color: aquamarine">
    Reservation
    <!-- 강의실 필터링 -->
    <div>
      <label for="classroom">강의실 선택 :</label>
      <select id="classroom" v-model="selectCR">
        <option v-for="clr in classrooms" :value="clr.classroom_id" :key="clr.classroom_id">
          {{ clr.building }}{{ clr.room_number }}
        </option>
      </select>
    </div>
    <div v-if="!isStudent">
      <button @click="isOpen = !isOpen">강의실 등록</button>
    </div>
    <Setting v-if="isOpen" />

    <!-- 예약 표 (초기화 후 렌더링) -->
    <ReservationTable v-if="selectCR" />
  </div>
</template>
