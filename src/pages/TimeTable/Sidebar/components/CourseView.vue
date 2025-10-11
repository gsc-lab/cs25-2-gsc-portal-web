<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTimetableStore } from '@/stores/timetable';
import {setTarget} from '@/api/Data'


const Tstore = useTimetableStore();      // 시간표 store

const originCourses = ref(null);        // 원본 과목
const courses = ref(null);              // 필터링 과목
const target = ref('0');                // target 필터
onMounted(async () => {
  originCourses.value = await Tstore.getCourses();
})

// ================================= target 감시 =================================
// target 바뀌면 해당 과목 필터링
watch(() => target.value, async (newTarget) => {
  if (newTarget == '0') courses.value = originCourses.value  // 0: 초기롸
  else courses.value = await Tstore.courseFilter(newTarget)  // target: 필터링

  console.log(courses.value);
  }, { immediate: true })


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

  <table v-if="courses != null">
    <thead>
      <tr>
        <th>type</th>
        <th>학년</th>
        <th>과목</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="course in courses">
        <td>{{ course.type }}</td>
        <td>{{ setTarget(course.target) }}</td>
        <td>{{ course.title }}</td>
      </tr>
    </tbody>
  </table>
</template>
