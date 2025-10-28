<template>
  <div style="padding: 10px;">
    <h2 style="text-align: center; margin-bottom: 20px;">{{ monthLabel }}</h2>

    <div>
      <!-- Loop through each day -->
      <div v-for="day in monthData.days" :key="day.work_date" style="border: 1px solid #ccc; margin-bottom: 20px; padding: 10px; background-color: #fff;">
        
        <!-- Centered Date Header -->
        <div style="text-align: center; font-weight: bold; font-size: 1.2em; padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
          {{ formatDate(day.work_date) }}
        </div>

        <!-- Rosters for the day -->
        <div>
          <div v-for="roster in day.rosters" :key="roster.classroom_id" style="margin-bottom: 10px; padding: 10px; border-left: 3px solid lightblue;">
            <strong style="font-size: 1.1em;">{{ roster.grade_id }}학년 - {{ roster.classroom_name }}</strong>
            <div style="padding-left: 15px; margin-top: 5px; color: #333;">
              <span><strong>담당자:</strong> </span>
              <span v-for="(member, memberIndex) in roster.members" :key="memberIndex">
                {{ member }}{{ memberIndex < roster.members.length - 1 ? ', ' : '' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { monthCleaningRoster } from '@/api/cleaningApi';

const monthData = ref({ days: [] });

const monthLabel = computed(() => {
  if (!monthData.value.days || monthData.value.days.length === 0) {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 청소 당번`;
  }
  const firstDay = new Date(monthData.value.days[0].work_date);
  return `${firstDay.getFullYear()}년 ${firstDay.getMonth() + 1}월 청소 당번`;
});

function formatDate(dateStr) {
    const d = new Date(dateStr)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`
}

onMounted(async () => {
  try {
    const res = await monthCleaningRoster();
    monthData.value = res.data ?? res;
  } catch (error) {
    console.error('월간 청소 데이터 조회 실패', error);
  }
});
</script>

<style scoped>
</style>
