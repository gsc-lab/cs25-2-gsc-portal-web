<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import TimeTable from './components/TimeTable.vue';
import Sidebar from './Sidebar/Sidebar.vue';
import { ref } from 'vue'

// 사이드바 상태
const sidebarIsOpen = ref(false);
const setData = (data) => {
  console.log("저장 완료:", data);
}

</script>

<template>
  <AppLayout pageName="Timetable">
    <div style="background-color:darkblue; padding: 5px;">
      <!-- 사이드바 버튼 -->
      <button @click="sidebarIsOpen = !sidebarIsOpen" style="background-color: aliceblue;">시간표 관리</button>

      <!-- 시간표 컴포넌트 -->
      <TimeTable @setRange="setData"/>

      <!-- 사이드바 컴포넌트 -->
      <Sidebar v-if="sidebarIsOpen"/>

    </div>
  </AppLayout>
</template>
