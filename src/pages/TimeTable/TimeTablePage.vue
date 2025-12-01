<template>
  <AppLayout>
    <!-- ===============  학생 시간표 =============== -->
    <div v-if="roleType == 'student'" class="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
      <TimeTable v-model="professorTT" />
    </div>

    <!-- ===============  교수, 관리자 시간표  =============== -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
      <!-- Main TimeTable View (Left/Central Section) -->
      <div
        class="overflow-auto"
        :class="{
          'lg:col-span-12': !uiStore.isTimeTablePanelOpen,
          'lg:col-span-8': uiStore.isTimeTablePanelOpen,
        }"
      >
        <div class="max-w-full lg:max-w-9xl lg:mx-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-text-heading">시간표</h2>
            <div class="flex gap-2 items-center">
              <div v-if="roleType == 'professor'" class="flex gap-2">
                <div v-if="professorTT">
                  <button
                    @click="professorTT = !professorTT"
                    class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm"
                  >
                    전체 시간표 보기
                  </button>
                </div>
                <div v-else>
                  <button
                    @click="professorTT = !professorTT"
                    class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm"
                  >
                    담당 시간표 보기
                  </button>
                </div>
              </div>
              <!-- Button to toggle TimeTable Slide Panel -->
              <button
                @click="uiStore.toggleTimeTablePanel()"
                class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
              >
                {{ uiStore.isTimeTablePanelOpen ? '패널 닫기' : '패널 열기' }}
              </button>
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

      <!-- TimeTable Panel Overlay -->
      <div
        v-if="uiStore.isTimeTablePanelOpen"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
        @click="uiStore.setTimeTablePanel(false)"
      ></div>

      <!-- TimeTable Sidebar -->
      <Sidebar v-model="isEventMode" :class="{ 'lg:col-span-4': uiStore.isTimeTablePanelOpen }" />
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import Sidebar from './Sidebar/Sidebar.vue' // Import the correct Sidebar
import { ref, watch, onUnmounted } from 'vue' // Add onUnmounted to imports
import { useTimetableStore } from '@/stores/timetable'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui' // Import uiStore
import AdminTimeTable from './components/AdminTimeTable.vue'
import TimeTable from './components/TimeTable.vue'
import { postEvent } from '@/api/timetableApi'

const uiStore = useUiStore() // Initialize uiStore

// 사이드바 상태 (now managed by uiStore.isTimeTablePanelOpen)
// const sidebarIsOpen = ref(false) // Removed
const Ustore = useUserStore()
const Tstore = useTimetableStore()

const roleType = ref(null) // 권한
const professorTT = ref(false)
const isEventMode = ref(false)

// 사용자 정보 확인
watch(
  () => {
    roleType.value = Ustore.userInfo.role_type
    // console.log(isStudent.value)
  },
  { immediate: true },
)

// Watch for isTimeTablePanelOpen to manage body scroll
watch(
  () => uiStore.isTimeTablePanelOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  },
)

// Ensure scroll is re-enabled if component is unmounted while panel is open
onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

// 시간표에서 선택한 데이터
async function setData(data, isEM) {
  await Tstore.setSchedule(data)
  // console.log('d', isEM, data[0])
  if (isEM && data[0].schedule) {
    const specialData = {
      event: 'CANCEL',
      date: data[0].date,
      startTime: Tstore.selectTT.startTime,
      endTime: Tstore.selectTT.endTime,
      course_id: data[0].schedule.course_id,
    }
    // console.log(specialData)
    if (confirm(`${specialData.date}  ${data[0].schedule.title} 수업을 휴강하시겠습니까?`)) {
      await postEvent(specialData)
      await Tstore.setTimetable()
    }
  } else {
    isEventMode.value = isEM
    uiStore.setTimeTablePanel(true) // Open panel via uiStore
    // console.log("저장 완료:", store.selectTT);
  }
}
</script>
