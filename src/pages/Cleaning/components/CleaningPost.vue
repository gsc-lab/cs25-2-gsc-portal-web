<template>
  <div style="background-color: lightgreen; padding: 20px;">
    <form @submit.prevent="submitForm">
        <div>
            <label >학기</label>
            <select v-model="formData.section">
                <option value="">학기 선택</option>
                <option v-for="s in sectionList" :key="s.sec_id" :value="s.sec_id">
                    {{ s.label }}
                </option>
            </select>
        </div>
        <div>
            <label>요일</label>
            <select v-model="formData.weekday">
                <option v-for="day in weekdays" :key="day"  :value="day"> {{ day }} </option>
            </select>
        </div>
        <div>
            <label>배치 인원</label>
            <input type="number" v-model="formData.team_size" min="1" />
        </div>
        
        <h3>학년 & 강의실</h3>
        <div v-for="(room, index) in formData.grade_rooms" :key="index">
            <span>{{ room.grade_id }} → {{ room.classroom_id }}</span>
        </div>
        
        <div>
            <select v-model="selectedGrade">
                <option value="">학년 선택</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
            </select>

            <select v-model="selectedClassroom">
                <option value="">강의실 선택</option>
                <option v-for="c in classroomList" :key="c.classroom_id" :value="c.classroom_id">
                    {{ c.label }}
                </option>
            </select>

            <button type="button" @click="addGradeRoom">추가</button>
        </div>

        <div style="margin-top: 20px;">
          <button type="submit">등록</button>
          <button type="button" @click="goBack" style="margin-left: 10px;">취소</button>
        </div>

    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { craeteCleaningRoster } from '@/api/cleaningApi';
import { getSection, getClassroom } from '@/api/jobApi';

const weekdays = ["MON", "TUE", "WHE", "THU", "FRI", "SAT", "SUN"]
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
    }
}

async function submitForm() {
    console.log('제출 데이터', formData.value)
    await craeteCleaningRoster(formData.value)
    router.back()
}

function goBack() {
  router.back();
}

async function fetchData() {
    const sectionRes = await getSection()
    const classroomRes = await getClassroom()
    sectionList.value = sectionRes || sectionRes.data
    classroomList.value = classroomRes || classroomRes.data
}

onMounted(() => {
    fetchData()
})
</script>

<style>

</style>
