<script setup>
import CourseView from './components/CourseView.vue'
import CourseRegister from './components/CourseRegister.vue'
import TimetableRegister from './components/TimetableRegister.vue'
import EventsRegister from './components/EventsRegister.vue'
import EventsView from './components/EventsView.vue'
import FukaPage from './components/FukaPage.vue'
import SpecialRegister from './components/SpecialRegister.vue'

// v-model:content="contents"
const content = defineModel('content')
</script>

<!-- 페이지 연결 -->
<template>
  <div style="background-color: aliceblue">
    <CourseView v-if="content === 'CourseView'" />
    <!-- 과목 열람 -->
    <CourseRegister v-if="content === 'CourseRegister'" />
    <!-- 과목 등록 -->
    <TimetableRegister v-if="content === 'TimetableRegister'" />
    <!-- 시간표 등록 -->
    <EventsRegister v-if="content === 'EventsRegister'" />
    <!-- 휴보강 등록 -->
    <EventsView v-if="content === 'EventsView'" />
    <!-- 휴보강 이력 -->
    <FukaPage v-if="content === 'FukaPage'" />
    <!-- 후까센세 -->
    <SpecialRegister v-if="content === 'SpecialRegister'" />
    <!-- 분반 설정 -->
  </div>
</template>
