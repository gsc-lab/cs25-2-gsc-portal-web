<template>
  <AppLayout pageName="CleaningPage">
    <div>
      
      <div>
        <button @click="cleaningStore.moveWeek('prev')">이전</button>
        <!-- <h2>{{ cleaningStore.cleaningItems.rosters }}</h2> -->
        <button @click="cleaningStore.moveWeek('next')">다음 주</button>
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
  <button></button>
  <router-link  to="/cleaning-rosters/generator">등록</router-link>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useCleaningStore } from '@/stores/cleaning';
import CleaningList from './components/CleaningList.vue';

const cleaningStore = useCleaningStore();

const targetDate = new Date();
targetDate.setDate(targetDate.getDate());
const startDate = targetDate.toISOString().split("T")[0];

const selectDate = ref(startDate);
const grade = ref(null);

async function fetchData() {
  cleaningStore.getCleaningRoster({date: selectDate.value, grade});
}

onMounted(() => {
  fetchData();
})
</script>


<style scoped>

</style>
