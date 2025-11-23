<template>
  <div class="bg-bg-paper rounded-lg shadow-subtle p-4 border border-gray-200">
    <nav class="flex flex-col gap-1 border-b border-gray-200 pb-4 mb-4">
      <button
        @click="contents = 'CourseView'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'CourseView' }]"
      >
        과목 열람
      </button>
      <button
        @click="contents = 'CourseRegister'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'CourseRegister' }]"
      >
        과목 등록
      </button>
      <button
        @click="contents = 'TimetableRegister'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'TimetableRegister' }]"
      >
        시간표 등록
      </button>
      <button
        @click="contents = 'EventsRegister'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'EventsRegister' }]"
      >
        휴보강 등록
      </button>
      <button
        @click="contents = 'EventsView'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'EventsView' }]"
      >
        휴보강 이력
      </button>
      <button
        @click="contents = 'FukaPage'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'FukaPage' }]"
      >
        후까센세
      </button>
      <button
        @click="contents = 'SpecialRegister'"
        :class="['flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200', { 'bg-gray-100 text-primary-dark font-medium': contents === 'SpecialRegister' }]"
      >
        분반 설정
      </button>
    </nav>

    <!-- 사이드바 내용 컴포넌트 -->
    <SidebarContent v-model:content="contents" />
  </div>
</template>

<script setup>
import SidebarContent from './SidebarContent.vue'
import { ref } from 'vue'

const contents = ref('CourseView')
</script>
