<template>
  <div style="padding: 20px;">

    <!-- Header Controls -->
    <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
      <!-- View Mode Buttons -->
      <div style="margin-bottom: 10px;">
        <strong>보기 방식:</strong>
        <button @click="setMode('week')" style="margin-left: 10px;">주간 보기</button>
        <button @click="setMode('month')">월간 보기</button>
      </div>
      <!-- Action Buttons -->
      <div>
        <strong>작업:</strong>
        <router-link to="/cleaning-rosters/generator" style="margin-left: 10px;">등록</router-link>
        <button @click="showDeleteForm = true">삭제</button>
      </div>
    </div>

    <!-- Main Content -->
    <div style="border: 1px solid #ccc; padding: 10px; background-color: lightyellow;">
      <!-- Weekly View -->
      <div v-if="viewMode === 'week'">
        <!-- Week/Grade Controls -->
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <div>
            <button @click="cleaningStore.moveWeek('prev')">&lt; 이전 주</button>
            <strong style="margin: 0 10px;">{{ cleaningStore.cleaningItems?.work_date }}</strong>
            <button @click="cleaningStore.moveWeek('next')">다음 주 &gt;</button>
          </div>
          <div style="margin-top: 10px;">
            <label for="grade-select">학년: </label>
            <select v-model="grade" id="grade-select">
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
    <CleaningDelete v-if="showDeleteForm" @close="showDeleteForm = false"/>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCleaningStore } from '@/stores/cleaning'
import CleaningList from './components/CleaningList.vue'
import CleaningMonth from './components/CleaningMonth.vue'
import CleaningDelete from './components/CleaningDelete.vue'

const cleaningStore = useCleaningStore();
const viewMode = ref('week');
const grade = ref(null);
const showDeleteForm = ref(false);


// 오늘 날짜 기준
const targetDate = new Date();
targetDate.setDate(targetDate.getDate());
const startDate = targetDate.toISOString().split("T")[0];
const selectDate = ref(startDate);


// 주간 데이터 불러오기
async function fetchData() {
  cleaningStore.getCleaningRoster({ date: selectDate.value, grade });
}

function setMode(mode) {
  viewMode.value = mode
  if (mode === 'week') fetchData()
}

onMounted(() => {
  fetchData();
})
</script>

<style scoped>
</style>