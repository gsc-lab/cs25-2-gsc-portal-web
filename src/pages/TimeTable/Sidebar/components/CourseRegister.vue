<script setup>
import { ref } from 'vue'

// 값 저장
const postCourseData = ref({
  target: null,
  course: null,
  professor: null,
  section: null
});

// 저장버튼 누른 후 실행
const handleSubmit = (() => {
  console.log(postCourseData.value);
})

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
    <input id="professor" v-model="postCourseData.professor">
  </div>

  <!-- 학기 입력 -->
  <div>
    <label for="section">학기 : </label>
    <input id="section" v-model="postCourseData.section" placeholder="2025-1">
  </div>

  <button @click="handleSubmit">과목 등록</button>
</template>
