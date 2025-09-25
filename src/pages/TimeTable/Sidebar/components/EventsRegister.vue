<script setup>
import { ref } from 'vue'
import { getCourses, getClassrooms } from '@/api/Data';

// mock Data
// 시간표에서 지정이 있으면 적용
const data = {
  target: "1",
  event: "MAKEUP",
  course_id: "1",
  date: "2025-09-22",
  time: { start: "2", end: "3" },
  classroom: "101"
}

// api에서 정보 가져오기
const courses = getCourses();
const classrooms = getClassrooms();
// 장소 입력시 저장
const classroomName = ref("");

// 값 저장
const postSpecialData = ref({
  target: data?.target ?? null,
  event: data?.event ?? null,
  course_id: data?.course_id ?? null,
  date: data?.date ?? null,
  time: { start: data?.time.start ?? null, end: data?.time.end ?? null },
  classroom: data?.classroom ?? null
});


// 저장버튼 누른 후 실행
const handleSubmit = () => {
  // 기타면 classroomName대입
  if (postSpecialData.value.classroom == "") {
    postSpecialData.value.classroom = classroomName.value;
  }
  console.log(postSpecialData.value);
}

</script>


<template>
  EventsRegister
  <!-- Grade 등 선택 -->
  <div>
    <input type="radio" id="1" value="1" v-model="postSpecialData.target">
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="postSpecialData.target">
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="postSpecialData.target">
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="postSpecialData.target">
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="postSpecialData.target">
    <label for="korean">한국어</label>
  </div>
  <!-- 휴 / 보 -->
  <div>
    <input type="radio" id="CANCEL" value="CANCEL" v-model="postSpecialData.event">
    <label for="CANCEL">휴강</label>

    <input type="radio" id="MAKEUP" value="MAKEUP" v-model="postSpecialData.event">
    <label for="MAKEUP">보강</label>
  </div>

  <!-- 날짜 -->
  <div>
    <label for="date">날짜 : </label>
    <input type="date" id="date" v-model="postSpecialData.date">
  </div>

  <!-- 과목 -->
  <div>
    <label for="course">과목 : </label>
    <select id="course" v-model="postSpecialData.course_id">
      <option v-for="course in courses" :value="course.course_id">{{ course.courseTitle }}</option>
    </select>
  </div>

  <!-- 교시 -->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postSpecialData.time.start">
      <option v-for="startT in 13" :value="String(startT)">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postSpecialData.time.end">
      <option v-for="endT in 13" :value="String(endT)">{{ endT }}</option>
    </select>
    교시
  </div>

  <!-- 장소 -->
  <div v-if="postSpecialData.event === 'MAKEUP'">
    <label for="classroom">장소 : </label>
    <select id="classroom" v-model="postSpecialData.classroom">
      <option v-for="classroom in classrooms" :value="classroom.classroom_id">{{ classroom.building }} {{ classroom.room_number }}</option>
      <option value="">기타</option>
    </select>
    <div v-if="postSpecialData.classroom == ''">
      <label for="classroom">장소 입력: </label>
      <input  id="classroom" v-model="classroomName">
    </div>
  </div>

  <button @click="handleSubmit">등록</button>
</template>
