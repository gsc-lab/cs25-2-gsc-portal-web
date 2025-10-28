<template>
  <div>

    <div>
      <button
        @click="setMode('week')"
      >주간 보기</button>
      <button
        @click="setMode('month')"
      >월간 보기</button>
    </div>

    <div v-if="viewMode === 'week'">
      <div>
        <button @click="cleaningStore.moveWeek('prev')">이전 주</button>
        <h2>{{ cleaningStore.cleaningItems?.work_date }}</h2>
        <button @click="cleaningStore.moveWeek('next')">다음 주</button>
      </div>
      
      <div>
        <select v-model="grade">
          <option value="null">학년</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>
      <ul>
        <CleaningList
          v-for="(item, index) in cleaningStore.cleaningItems?.rosters"
          :key="index"
          :cleaningItem="item"
          @refresh="fetchData"
          >
        </CleaningList>
      </ul>
      <router-link ></router-link>
    </div>
    <div v-else>
      <CleaningMonth />
    </div>
  <button></button>
  <router-link to="/cleaning-rosters/generator">등록</router-link>
  <button @click="showDeleteForm = true">삭제</button>
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
