<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
        <!-- Header Controls -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 border border-gray-200 rounded-lg">
          <!-- View Mode Buttons -->
          <div class="flex gap-2">
            <strong class="text-text-base text-sm font-medium mr-2">보기 방식:</strong>
            <button
              @click="setMode('week')"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm border', viewMode === 'week' ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-gray-300 hover:bg-gray-100']"
            >
              주간 보기
            </button>
            <button
              @click="setMode('month')"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm border', viewMode === 'month' ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-gray-300 hover:bg-gray-100']"
            >
              월간 보기
            </button>
          </div>
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <strong class="text-text-base text-sm font-medium mr-2">작업:</strong>
            <router-link
              to="/cleaning-rosters/generator"
              class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
              >등록</router-link
            >
            <button @click="showDeleteForm = true" class="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm">
              삭제
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <!-- Weekly View -->
          <div v-if="viewMode === 'week'">
            <!-- Week/Grade Controls -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
              <div class="flex items-center gap-2">
                <button @click="cleaningStore.moveWeek('prev')" class="px-3 py-1 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  이전 주
                </button>
                <strong class="text-lg font-semibold text-text-heading">{{ cleaningStore.weekDate?.date }}</strong>
                <button @click="cleaningStore.moveWeek('next')" class="px-3 py-1 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                  다음 주
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div>
                <label for="grade-select" class="block text-sm font-medium text-text-base mb-1">학년: </label>
                <select v-model="grade" id="grade-select" class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="null">전체 학년</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>
            </div>

            <!-- Roster List -->
            <div>
              <CleaningList
                v-for="(item, index) in cleaningStore.cleaningItems?.rosters"
                :key="index"
                :cleaningItem="item"
                @refresh="fetchData"
              >
              </CleaningList>
            </div>
          </div>

          <!-- Monthly View -->
          <div v-else>
            <CleaningMonth />
          </div>
        </div>

        <!-- Delete Modal -->
        <CleaningDelete v-if="showDeleteForm" @close="showDeleteForm = false" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCleaningStore } from '@/stores/cleaning'
import CleaningList from './components/CleaningList.vue'
import CleaningMonth from './components/CleaningMonth.vue'
import CleaningDelete from './components/CleaningDelete.vue'

const cleaningStore = useCleaningStore()
const viewMode = ref('week')
const grade = ref(null)
const showDeleteForm = ref(false)

// 오늘 날짜 기준
const targetDate = new Date()
targetDate.setDate(targetDate.getDate())
const startDate = targetDate.toISOString().split('T')[0]
const selectDate = ref(startDate)

// 주간 데이터 불러오기
async function fetchData() {
  cleaningStore.getCleaningRoster({ date: selectDate.value, grade })
}

function setMode(mode) {
  viewMode.value = mode
  if (mode === 'week') fetchData()
}

onMounted(() => {
  fetchData()
})
</script>
