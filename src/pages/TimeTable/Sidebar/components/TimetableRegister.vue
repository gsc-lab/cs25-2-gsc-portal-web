<script setup>
import { ref, watch } from 'vue'
import { getCourses, getClassrooms } from '@/api/Data';

// 받은 값
const getTarget = "1";

// 초기화
const days = ["월", "화", "수", "목", "금"];
const enDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const courses = getCourses();
const classrooms = getClassrooms();
const classroomName = ref("");

// 선택이 있으면 적용 ?? null
const selectDay = "Mon"
const startTime = "1";
const endTime = "3";

// 값 저장
const postTimetableData = ref({
  target: getTarget,
  course_id: courses[0].course_id,
  day: selectDay,
  room: classrooms[0].classroom_id,
  time: {start: startTime, end: endTime}
});

// target 바뀌면 해당 과목 필터링
watch(
  () => postTimetableData.value.target,
  (target) => {
    console.log("postTimetableData.target", target);
})


// 저장버튼 누른 후 실행
const handleSubmit = () => {
  if (postTimetableData.value.room == "") {
    postTimetableData.value.room = classroomName.value;
  }
  console.log(postTimetableData.value);
}
</script>

<template>
  TimetableRegister

  <!-- Grade 등 선택 -->
  <div>
    <input type="radio" id="1" value="1" v-model="postTimetableData.target">
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="postTimetableData.target">
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="postTimetableData.target">
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="postTimetableData.target">
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="postTimetableData.target">
    <label for="korean">한국어</label>
  </div>

  <!-- 과목 -->
  <div>
    <label for="course">과목 : </label>
    <select id="course" v-model="postTimetableData.course_id">
      <option v-for="course in courses" :value="course.course_id">{{ course.courseTitle }}</option>
    </select>
  </div>

  <!-- 요일 -->
  <div>
    <label for="day">요일 : </label>
    <select id="day" v-model="postTimetableData.day">
      <option v-for="(day, idx) in days" :value="enDays[idx]">{{ day }}요일</option>
    </select>
  </div>

  <!-- 장소 -->
  <div>
    <label for="classroom">장소 : </label>
    <select id="classroom" v-model="postTimetableData.room">
      <option v-for="classroom in classrooms" :value="classroom.classroom_id">
        {{ classroom.label }}
      </option>
      <!-- 특강이면 데이터에 없는 장소 등록 가능-->
      <option v-if="postTimetableData.target == 'special'" value="">기타</option>
    </select>
    <div v-if="postTimetableData.room == ''" >
      <label for="classroom">장소 입력 : </label>
      <input  id="classroom" v-model="classroomName">
    </div>
  </div>

  <!-- 교시 -->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postTimetableData.time.start">
      <option v-for="startT in 12" :value="String(startT)">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postTimetableData.time.end">
      <option v-for="endT in 12" :value="String(endT)">{{ endT }}</option>
    </select>
    교시
  </div>

  <button @click="handleSubmit">시간표 등록</button>
</template>
