<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 col-span-1 lg:col-span-1">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-text-heading">오늘의 시간표</h2>
    </div>

    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="(target, key) in isUserInfoList"
        :key="key"
        class="px-4 py-2 rounded-full border border-gray-300 bg-white text-text-muted font-medium hover:bg-gray-100 transition-all duration-200"
        :class="{ 'bg-primary text-white border-primary shadow-sm': targetGrade === target }"
        @click="gradeSelect(target)"
      >
        <span>{{ getLabel(target) }}</span>
      </button>
    </div>

    <div class="rounded-lg bg-white overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table v-if="filterSchedule" class="w-full border-collapse min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center sticky left-0 z-10 w-20">교시</th>
              <th v-for="day in dayList" :key="day" class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">{{ day }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="period in 12" :key="period">
              <td class="bg-gray-50 text-text-muted font-semibold text-sm py-2 px-3 border-b border-gray-100 text-center sticky left-0 z-10 w-20">{{ period }}교시</td>
              <td v-for="day in dayList" :key="day" class="text-sm py-2 px-3 border-b border-gray-100 text-center">
                <div
                  class="text-xs bg-primary-light text-primary-dark font-semibold px-2 py-1 rounded-sm inline-block w-[90%] my-1"
                  v-for="(courseItem, index) in filterSchedule[day]?.[period]"
                  :key="index"
                >
                  {{ courseItem['title'] }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center text-text-muted text-sm py-8">
          <p>표시할 시간표 데이터가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  schedulesData: Object,
  userInfo: Object,
});

// 타겟 목록
const targetGradeList = ref(['1', '2', '3', 'special', 'korean']);

// 선택된 타겟 (초기값은 userInfo에서 가져오거나 '1'학년)
const targetGrade = ref(props.userInfo?.grade_id || '1');

// Watch for changes in userInfo prop and update targetGrade if grade_id is available
watch(() => props.userInfo?.grade_id, (newGradeId) => {
  if (newGradeId) {
    targetGrade.value = newGradeId;
  }
}, { immediate: true });


// 타겟 키
const targetKey = {
  1: '1',
  2: '2',
  3: '3',
  special: 'special',
  korean: 'korean',
};

// 요일 목록
const dayList = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

// 시간표 필터링
const filterSchedule = computed(() => {
  if (!props.schedulesData) return null;
  const dataKey = targetKey[targetGrade.value];
  return props.schedulesData[dataKey];
});

// 버튼 클릭 시 실행될 함수
const gradeSelect = (grade) => {
  targetGrade.value = grade;
};

// 사용자 유저 정보에 대한 필터링된 리스트
const isUserInfoList = computed(() => {
  if (!props.userInfo) return [];

  const userInfo = props.userInfo;

  if (userInfo.role_type === 'admin') {
    return targetGradeList.value;
  }

  return targetGradeList.value.filter((target) => {
    if (target === userInfo.grade_id) {
      return true;
    }

    if (userInfo.language_id === 'JP' && target === 'special') {
      return true;
    }

    if (userInfo.language_id === 'KR' && target === 'korean') {
      return true;
    }

    return false;
  });
});

const getLabel = (target) => {
  if (['1', '2', '3'].includes(target)) return target + '학년';
  if (target === 'special') return '특강';
  if (target === 'korean') return '한국어';
  return target;
};
</script>
