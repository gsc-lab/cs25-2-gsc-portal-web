<script setup>
import SidebarContent from './SidebarContent.vue'
import { ref } from 'vue'

const contents = ref('CourseView')
</script>

<template>
  <div style="background-color: aqua; padding: 3px">
    <nav>
      <button @click="contents = 'CourseView'">과목 열람 |</button>
      <button @click="contents = 'CourseRegister'">과목 등록 |</button>
      <button @click="contents = 'TimetableRegister'">시간표 등록 |</button>
      <button @click="contents = 'EventsRegister'">휴보강 등록 |</button>
      <button @click="contents = 'EventsView'">휴보강 이력 |</button>
      <button @click="contents = 'FukaPage'">후까센세 |</button>
      <button @click="contents = 'SpecialRegister'">분반 설정</button>
    </nav>

    <!-- 사이드바 내용 컴포넌트 -->
    <SidebarContent v-model:content="contents" />
  </div>
</template>
