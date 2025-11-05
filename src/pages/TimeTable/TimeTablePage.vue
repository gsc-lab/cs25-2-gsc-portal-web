<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import Sidebar from './Sidebar/Sidebar.vue'
import { ref } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import AdminTimeTable from './components/AdminTimeTable.vue'

// 사이드바 상태
const sidebarIsOpen = ref(false)
const Tstore = useTimetableStore()

const setData = (data) => {
  Tstore.setSchedule(data)
  // console.log("저장 완료:", store.selectTT);
}
</script>

<template>
  <AppLayout pageName="Timetable">
    <!-- <div v-if="user.role_type == 'admin'" style="background-color:darkblue; padding: 5px;"> -->
    <div style="background-color: darkblue; padding: 5px">
      <!-- 사이드바 버튼 -->
      <button @click="sidebarIsOpen = !sidebarIsOpen" style="background-color: aliceblue">
        시간표 관리
      </button>

      <!-- 사이드바 컴포넌트 -->
      <Sidebar v-if="sidebarIsOpen" />

      <!-- 시간표 컴포넌트 -->
      <AdminTimeTable @setRange="setData" />
    </div>
    <!-- <div v-else>
      <TimeTable />
    </div> -->
  </AppLayout>
</template>
