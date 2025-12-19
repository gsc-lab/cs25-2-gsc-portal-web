<template>
  <aside
    :class="{
      'fixed inset-y-0 right-0 z-50 w-full md:w-[700px] bg-bg-paper shadow-lg transform transition-transform duration-300 ease-in-out': true,
      'translate-x-full': !uiStore.isTimeTablePanelOpen,
      'translate-x-0': uiStore.isTimeTablePanelOpen,
    }"
  >
    <div class="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
      <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <h3 class="text-xl font-bold text-text-heading">관리 패널</h3>
        <button
          @click="uiStore.setTimeTablePanel(false)"
          class="text-text-muted hover:text-text-heading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav class="flex flex-col gap-1 border-b border-gray-200 pb-4 mb-4 overflow-y-auto flex-grow">
        <button
          @click="contents = 'CourseView'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'CourseView' },
          ]"
        >
          과목 열람
        </button>
        <button
          @click="contents = 'CourseRegister'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'CourseRegister' },
          ]"
        >
          과목 등록
        </button>
        <button
          @click="contents = 'TimetableRegister'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'TimetableRegister' },
          ]"
        >
          시간표 등록
        </button>
        <button
          @click="contents = 'EventsRegister'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'EventsRegister' },
          ]"
        >
          보강 등록
        </button>
        <button
          @click="contents = 'EventsView'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'EventsView' },
          ]"
        >
          휴보강 이력
        </button>
        <button
          @click="contents = 'FukaPage'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'FukaPage' },
          ]"
        >
          후까센세
        </button>
        <button
          @click="contents = 'SpecialRegister'"
          :class="[
            'flex w-full text-left p-2 rounded-md text-text-base hover:bg-gray-100 transition-colors duration-200',
            { 'bg-gray-100 text-primary-dark font-medium': contents === 'SpecialRegister' },
          ]"
        >
          분반 설정
        </button>
      </nav>

      <!-- 사이드바 내용 컴포넌트 -->
      <SidebarContent v-model:content="contents" />
    </div>
  </aside>
</template>

<script setup>
import SidebarContent from './SidebarContent.vue'
import { ref, watch } from 'vue'
import { useUiStore } from '@/stores/ui' // Import uiStore

const uiStore = useUiStore() // Initialize uiStore
const contents = ref('CourseView')

const isEventMode = defineModel()
console.log('isEventMode', isEventMode.value)

watch(
  () => isEventMode.value,
  () => {
    if (isEventMode.value == true) contents.value = 'EventsRegister'
    else if (isEventMode.value == false) contents.value = 'TimetableRegister'
  },
  { immediate: true },
)
</script>
