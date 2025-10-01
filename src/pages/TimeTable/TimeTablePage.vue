<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import TimeTable from './components/TimeTable.vue';
import Sidebar from './Sidebar/Sidebar.vue';
import { ref } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { getTimetable } from '@/api/timetableApi';

// 사이드바 상태
const sidebarIsOpen = ref(false);
const store = useTimetableStore()
// const tt = await getTimetable()
// console.log("tt", tt);
const setData = (data) => {
  store.addSchedule(data);
  // console.log("저장 완료:", store.selectTT);
}



</script>

<template>
  <AppLayout pageName="Timetable">
    <div style="background-color:darkblue; padding: 5px;">
      <!-- 사이드바 버튼 -->
      <button @click="sidebarIsOpen = !sidebarIsOpen" style="background-color: aliceblue;">시간표 관리</button>

      <!-- 사이드바 컴포넌트 -->
      <Sidebar v-if="sidebarIsOpen"/>

      <!-- 시간표 컴포넌트 -->
      <TimeTable @setRange="setData"/>



    </div>
  </AppLayout>
</template>
