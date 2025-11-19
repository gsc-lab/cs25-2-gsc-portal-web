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

const roleType = ref(null) // 권한
const professorTT = ref(true)

// 사용자 정보 확인
watch(
  () => {
    roleType.value = Ustore.userInfo.role_type
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
    <div v-if="roleType == 'student'">
      <TimeTable v-model="professorTT" />
    </div>

    <!-- ===============  교수, 관리자 시간표  =============== -->
    <div v-else style="background-color: darkblue; padding: 5px">
      <!-- 사이드바 버튼 -->
      <button @click="sidebarIsOpen = !sidebarIsOpen" style="background-color: aliceblue">
        시간표 관리
      </button>

      <!-- 사이드바 컴포넌트 -->
      <Sidebar v-if="sidebarIsOpen" />

      <div v-if="roleType == 'professor'">
        <div v-if="professorTT">
          <button @click="professorTT = !professorTT">전체 시간표 보기</button>
          <TimeTable v-model="professorTT" />
        </div>
        <div v-else>
          <button @click="professorTT = !professorTT">담당 시간표 보기</button>
        </div>
      </div>

      <!-- 시간표 컴포넌트 -->
      <div v-if="!professorTT">
        <AdminTimeTable @setRange="setData" />
      </div>
    </div>
  </AppLayout>
</template>
