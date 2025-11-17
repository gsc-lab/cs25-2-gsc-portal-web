<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import Sidebar from './Sidebar/Sidebar.vue'
import { ref, watch } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { useUserStore } from '@/stores/user'
import AdminTimeTable from './components/AdminTimeTable.vue'
import TimeTable from './components/TimeTable.vue'

// 사이드바 상태
const sidebarIsOpen = ref(false)
const Ustore = useUserStore()
const Tstore = useTimetableStore()

const isStudent = ref(null) // 학생인지

// 사용자 정보 확인
watch(
  () => {
    isStudent.value = Ustore.userInfo.role_type == 'student' ? true : false
    // console.log(isStudent.value)
  },
  { immediate: true },
)

// 시간표에서 선택한 데이터
function setData(data) {
  Tstore.setSchedule(data)
  sidebarIsOpen.value = true
  // console.log("저장 완료:", store.selectTT);
}
</script>

<template>
  <AppLayout pageName="Timetable">
    <!-- ===============  학생 시간표 =============== -->
    <div v-if="isStudent">
      <TimeTable />
    </div>

    <!-- ===============  교수, 관리자 시간표  =============== -->
    <div v-else style="background-color: darkblue; padding: 5px">
      <!-- 사이드바 버튼 -->
      <button @click="sidebarIsOpen = !sidebarIsOpen" style="background-color: aliceblue">
        시간표 관리
      </button>

      <!-- 사이드바 컴포넌트 -->
      <Sidebar v-if="sidebarIsOpen" />

      <!-- 시간표 컴포넌트 -->
      <AdminTimeTable @setRange="setData" />
    </div>
  </AppLayout>
</template>
