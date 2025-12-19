<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 max-w-lg mx-auto">
    <h2 class="text-xl font-bold text-text-heading mb-6">청소 기록 생성 / 수정</h2>

    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="section-select" class="block text-sm font-medium text-text-base mb-1">학기</label>
        <select
          v-model="formData.section"
          id="section-select"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="">학기 선택</option>
          <option v-for="s in sectionList" :key="s.sec_id" :value="s.sec_id">
            {{ s.label }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="weekday-select" class="block text-sm font-medium text-text-base mb-1">요일</label>
        <select
          v-model="formData.weekday"
          id="weekday-select"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option v-for="day in weekdays" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>

      <div class="mb-6">
        <label for="team-size-input" class="block text-sm font-medium text-text-base mb-1">배치 인원</label>
        <input
          type="number"
          v-model="formData.team_size"
          min="1"
          id="team-size-input"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <h3 class="text-lg font-semibold text-text-heading mb-3 mt-6">학년 & 강의실</h3>
      <div v-for="(room, index) in formData.grade_rooms" :key="index" class="bg-gray-50 rounded-md p-3 mb-2 flex justify-between items-center">
        <span class="text-text-base text-sm">{{ room.grade_id }}학년 → {{ room.classroom_id }}</span>
        <button type="button" @click="removeGradeRoom(index)" class="text-red-500 hover:text-red-700 text-sm font-medium">삭제</button>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <select
          v-model="selectedGrade"
          class="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="">학년 선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>

        <select
          v-model="selectedClassroom"
          class="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="">강의실 선택</option>
          <option v-for="c in classroomList" :key="c.classroom_id" :value="c.classroom_id">
            {{ c.label }}
          </option>
        </select>
      </div>
      <div class="flex justify-end mb-6">
        <button
          type="button"
          @click="addGradeRoom"
          class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
        >
          추가
        </button>
      </div>

      <div class="flex justify-end gap-2 mt-6 border-t border-gray-200 pt-4">
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
        >
          등록
        </button>
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center px-4 py-2 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          취소
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { craeteCleaningRoster } from '@/api/cleaningApi'; // Note: Typo in API function name 'craete'
import { getSection, getClassroom } from '@/api/jobApi';

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const router = useRouter();

const sectionList = ref([])
const classroomList = ref([])

const formData = ref({
    section: '',
    weekday: 'MON',
    team_size: 1,
    grade_rooms: []
});

const selectedGrade = ref('')
const selectedClassroom = ref('')

function addGradeRoom() {
    if (selectedGrade.value && selectedClassroom.value) {
        formData.value.grade_rooms.push({
            grade_id: selectedGrade.value,
            classroom_id: selectedClassroom.value
        })
        selectedGrade.value = ''
        selectedClassroom.value = ''
    } else {
      alert("학년과 강의실을 모두 선택해주세요.")
    }
}

function removeGradeRoom(index) {
  formData.value.grade_rooms.splice(index, 1);
}


async function submitForm() {
    if (!formData.value.section || !formData.value.weekday || !formData.value.team_size || formData.value.grade_rooms.length === 0) {
        alert("모든 필수 항목을 선택해주세요.")
        return;
    }
    try {
        await craeteCleaningRoster(formData.value) // Typo: Should be 'createCleaningRoster'
        alert('청소 로스터가 성공적으로 등록되었습니다.');
        router.back()
    } catch (error) {
        console.error('청소 로스터 등록 실패:', error)
        alert('청소 로스터 등록에 실패했습니다.');
    }
}

function goBack() {
  router.back();
}

async function fetchData() {
    try {
        const sectionRes = await getSection()
        const classroomRes = await getClassroom()
        sectionList.value = sectionRes || [] // Handle potential null/undefined response
        classroomList.value = classroomRes || [] // Handle potential null/undefined response
    } catch (error) {
        console.error('데이터 로드 실패:', error)
        alert('데이터 로드에 실패했습니다.');
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
/* Scoped styles removed. Tailwind CSS classes are used directly in the template. */
</style>
