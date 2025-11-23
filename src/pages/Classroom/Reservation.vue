<script setup>
import { ref, watch, onMounted } from 'vue'
import ReservationTable from './components/ReservationTable.vue'
import { useClassroomStore } from '@/stores/classroom'

const CRstore = useClassroomStore() // classroom store
const classrooms = ref(null) // classroom 데이터
const selectCR = ref(null) // 선택한 강의실 id 저장

// classroom 데이터 저장, 첫번째 강의실의 예약정보 저장
onMounted(async () => {
  const resClassroom = await CRstore.getClassroomInfo()
  classrooms.value = resClassroom.filter((cls) => cls.room_type == 'LAB')

  const date = new Date().toISOString().split('T')[0]
  CRstore.selectReTime.date = date

  if (classrooms.value.length > 0) {
    selectCR.value = classrooms.value[0].classroom_id
  }
  console.log(' ')
})

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
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 mb-6">
    <h2 class="text-xl font-bold text-text-heading mb-6">실습실 예약</h2>

    <!-- 강의실 필터링 -->
    <div class="mb-4">
      <label for="classroom" class="block text-sm font-medium text-text-base mb-1">강의실 선택 :</label>
      <select id="classroom" v-model="selectCR"
              class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        <option v-for="clr in classrooms" :value="clr.classroom_id" :key="clr.classroom_id">
          {{ clr.building }}-{{ clr.room_number }}
        </option>
      </select>
    </div>

    <!-- 예약 표 (초기화 후 렌더링) -->
    <ReservationTable v-if="selectCR" />
  </div>
</template>
