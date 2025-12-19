<template>
  <div class="p-4">
    <h2 class="text-center mb-6 text-xl font-bold text-text-heading">{{ monthLabel }}</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Loop through each day -->
      <div
        v-for="day in monthData.days"
        :key="day.work_date"
        class="bg-bg-paper rounded-card shadow-subtle p-4 border border-gray-200"
      >
        <!-- Centered Date Header -->
        <div class="text-center font-bold text-lg p-2 border-b border-gray-200 mb-3 text-text-heading">
          {{ formatDate(day.work_date) }}
        </div>

        <!-- Rosters for the day -->
        <div>
          <div
            v-for="roster in day.rosters"
            :key="roster.classroom_id"
            class="mb-2 p-3 border-l-4 border-primary-light bg-gray-50 rounded-md"
          >
            <strong class="font-semibold text-text-heading text-base"
              >{{ roster.grade_id }}학년 - {{ roster.classroom_name }}</strong
            >
            <div class="pl-4 mt-1 text-text-base text-sm">
              <span><strong>담당자:</strong> </span>
              <span v-for="(member, memberIndex) in roster.members" :key="memberIndex">
                {{ member }}{{ memberIndex < roster.members.length - 1 ? ', ' : '' }}
              </span>
            </div>
          </div>
          <div v-if="day.rosters.length === 0" class="text-center text-text-muted text-sm py-4">
            청소 당번이 없습니다.
          </div>
        </div>
      </div>
      <div v-if="monthData.days.length === 0" class="col-span-full text-center text-text-muted text-lg py-8">
        월간 청소 데이터가 없습니다.
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
