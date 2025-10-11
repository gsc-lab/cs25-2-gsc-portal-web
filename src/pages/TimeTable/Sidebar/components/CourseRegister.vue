<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTimetableStore } from '@/stores/timetable';
import { useProfessorStore } from '@/stores/auth';
import { postCourse } from '@/api/timetableApi';

const Tstore = useTimetableStore();
const Pstore = useProfessorStore();
const professors = ref()            // 교수 명단
onMounted(async () => {
  professors.value = await Pstore.getProfessors()
  console.log("professors", professors.value);
})

// 값 저장
const postCourseData = ref({
  target: null,
  course_id: null,
  course: null,
  professor_id: null,
  section: null
})

// ================================= 데이터 초기화 =================================
// selectTT를 감시하고 timetableData 갱신
watch(() => Tstore.selectTT, (timetableData) => {
  if (timetableData) {
    console.log("정상값:", timetableData.schedule?.professor)

    // 값 세팅
    postCourseData.value = {
      target: timetableData.target,
      course_id: timetableData.schedule?.course_id ?? null,
      course: timetableData.schedule?.title ?? null,
      professor_id: timetableData.schedule?.professor_id ?? null,
    }
  } else {
    console.log("아직 데이터 없음")
  }
}, { immediate: true })


// ================================= Submit =================================
// 저장버튼 누른 후 실행
const handleSubmit = (async () => {
  console.log(postCourseData.value);
  await postCourse(postCourseData.value)
  await Tstore.setCourses()
})
// ===================================================================================
</script>

<template>
  CourseRegister
  <!-- Grade 등 선택 -->
  <div>
    <input type="radio" id="1" value="1" v-model="postCourseData.target">
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="postCourseData.target">
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="postCourseData.target">
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="postCourseData.target">
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="postCourseData.target">
    <label for="korean">한국어</label>
  </div>

  <!-- 강의명 입력 -->
  <div>
    <label for="course">강의명 : </label>
    <input id="course" v-model="postCourseData.course">
  </div>
  <!-- 교수명 입력 -->
  <div>
    <label for="professor">교수명 : </label>
    <select id="professor" v-model="postCourseData.professor_id">
      <option v-for="professor in professors" :value="professor.user_id">{{ professor.name }}</option>
    </select>
  </div>

  <!-- 학기 입력 -->
  <div>
    <label for="section">학기 : </label>
    <input id="section" v-model="postCourseData.section" placeholder="2025-1">
  </div>

  <button @click="handleSubmit">과목 등록</button>
</template>
