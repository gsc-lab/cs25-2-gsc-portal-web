<script setup>
import { ref, watch } from 'vue'
import { useTimetableStore } from '@/stores/timetable';
import { setTarget } from '@/api/Data'
import {delCourse} from '@/api/timetableApi'


const Tstore = useTimetableStore();      // 시간표 store

const originCourses = ref(null);        // 원본 과목
const courses = ref(null);              // 필터링 과목
const target = ref('0');                // target 필터
const isView = ref([])                // 상세 보기 id저장

// 전체 Courses 조회
async function setOriginCourses(){
  originCourses.value = await Tstore.getCourses();
  console.log("originCourses.value", originCourses.value);
}

// ================================= target 감시 =================================
// target 바뀌면 해당 과목 필터링
watch(() => target.value, async (newTarget) => {
  if (newTarget == '0') {
    if (originCourses.value == null) await setOriginCourses();
    courses.value = originCourses.value  // 0: 초기화
  }
  else courses.value = await Tstore.courseFilter(newTarget)  // target: 필터링

  console.log(courses.value);
}, { immediate: true })

const toggleSelect = (course_id) => {
  console.log("실행");
  if (isView.value.includes(course_id)) {
    // 이미 있으면 제거
    isView.value = isView.value.filter(i => i !== course_id)
    console.log("제거");
  } else {
    // 없으면 추가
    isView.value.push(course_id)
    console.log("추가", isView.value);
    console.log(isView.value?.includes(course_id));
  }
}

// ================================= 삭제 =================================
// 과목
const handleCourseDel = async (course_id) => {
  const res = await delCourse(course_id)
  console.log(res);
}
const handleTimetableDel = async (course_id) => {
  const res = await delCourse(course_id)
  console.log(res);
}
</script>

<template>
  CourseView

  <div>
    <input type="radio" id="0" value="0" v-model="target">
    <label for="0">전체</label>

    <input type="radio" id="1" value="1" v-model="target">
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="target">
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="target">
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="target">
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="target">
    <label for="korean">한국어</label>
  </div>

  <table v-if="courses != null" style="border-collapse: collapse;">
    <thead>
      <tr style="background-color:bisque">
        <th style="border: 1px solid #000; padding: 10px;"></th>
        <th style="border: 1px solid #000; padding: 10px;">학년</th>
        <th style="border: 1px solid #000; padding: 10px;">과목</th>
        <th style="border: 1px solid #000; padding: 10px;">교수</th>
        <th style="border: 1px solid #000; padding: 10px;">학기</th>
        <th style="border: 1px solid #000; padding: 10px;">수정</th>
        <th style="border: 1px solid #000; padding: 10px;">삭제</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="course in courses">
      <tr>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;" @click="toggleSelect(course.course_id)">▶</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ setTarget(course.target) }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ course.title }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">?? 교수</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">20xx</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">
          <button @click="handlePut(course.course_id)">수정</button>
        </td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">
          <button @click="handleCourseDel(course.course_id)">삭제</button>
        </td>
      </tr>

      <tr v-if="isView?.includes(course.course_id)" style="background-color: antiquewhite;">
        <td style="border: 1px solid #000; padding: 10px; user-select: none;"></td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;"></td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">O요일</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">O 교시 ~ O 교시</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">O 호실</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">
          <button @click="handlePut(course.course_id)">수정</button>
        </td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">
          <button @click="handleTimetableDel(course.course_id)">삭제</button>
        </td>
      </tr>
      </template>
    </tbody>
  </table>
</template>
