<template>
  <AppLayout>
    <!-- ===============  학생 시간표 =============== -->
    <div v-if="roleType == 'student'" class="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
      <TimeTable v-model="professorTT" />
    </div>

    <!-- ===============  교수, 관리자 시간표  =============== -->
    <div v-else class="flex min-h-screen w-full gap-6 p-4 sm:p-6 lg:p-8">
      <!-- Main TimeTable View (Left/Central Section) -->
      <div class="flex-[2] overflow-auto pr-8">
        <div class="max-w-full lg:max-w-7xl lg:mx-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-text-heading">시간표</h2>
            <div v-if="roleType == 'professor'" class="flex gap-2">
              <div v-if="professorTT">
                <button @click="professorTT = !professorTT" class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm">전체 시간표 보기</button>
              </div>
              <div v-else>
                <button @click="professorTT = !professorTT" class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm">담당 시간표 보기</button>
              </div>
            </div>
          </div>

          <!-- TimeTable Components -->
          <div v-if="!professorTT">
            <AdminTimeTable @setRange="setData" />
          </div>
          <div v-if="roleType == 'professor' && professorTT">
            <TimeTable v-model="professorTT" />
          </div>
        </div>
      </div>

      <!-- Registration/Management Panel (Right Section) -->
      <div class="flex-[1]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-text-heading">관리 패널</h2>
          <button @click="sidebarIsOpen = !sidebarIsOpen" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm">
            {{ sidebarIsOpen ? '패널 닫기' : '패널 열기' }}
          </button>
        </div>
        <Sidebar v-if="sidebarIsOpen" />
      </div>
    </div>
  </AppLayout>
</template>

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
const professorTT = ref(false)

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
