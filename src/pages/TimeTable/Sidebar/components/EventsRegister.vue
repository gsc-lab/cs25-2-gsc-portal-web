<script setup>
import { ref, watch, computed } from 'vue'
import { getCourses, getClassrooms } from '@/api/Data';
import { useTimetableStore } from '@/stores/timetable';

const store = useTimetableStore();
const timetableData = ref();

// api에서 정보 가져오기
const courses = getCourses();
const classrooms = getClassrooms();
// 장소 입력시 저장
const classroomName = ref("");
const selectRoom = ref();
const startTime = ref()
const endTime = ref()

const isCANCEL = () => {
  if (timetableData.value?.[0].val == null) {
    return false
  }
  return true
}

// 시간 저장
const lengthHour = () => {
  const len = timetableData.value.length
  console.log(len);
  if (timetableData.value?.[0].hour > timetableData.value?.[len - 1].hour) {
    startTime.value = timetableData.value?.[len - 1].hour
    endTime.value = timetableData.value?.[0].hour
  } else {
    startTime.value = timetableData.value?.[0].hour
    endTime.value = timetableData.value?.[len - 1].hour
  }
  console.log();
}

// 장소 이름 저장
const setRoomName = () => {
  const room = classrooms.filter((room) => room.label == timetableData.value?.[0]?.val?.room)
  console.log("room", room[0]);
  selectRoom.value = room[0]
}

// 값 저장
const postSpecialData = ref({
  target: null,
  event: null,
  course_id: null,
  date: null,
  startTime: null,
  endTime: null,
  classroom: null
})

// selectTT를 감시하고 timetableData 갱신
watch(() => store.selectTT, (newVal) => {
  if (newVal?.[0]?.[0]) {
    console.log("정상값:", newVal[0][0])
    timetableData.value = newVal[0];
    lengthHour()
    setRoomName()
    console.log(selectRoom.value);

    // 값 세팅
    postSpecialData.value = {
      target: timetableData.value[0].grade,
      event: isCANCEL() ? "CANCEL" : "MAKEUP",
      course_id: timetableData.value[0].val?.course_id ?? null,
      startTime: startTime.value,
      endTime: endTime.value,
      classroom: selectRoom.value?.classroom_id ?? null,
    }
  } else {
    console.log("아직 데이터 없음")
  }
}, { immediate: true })


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
    <select id="time" v-model="postSpecialData.startTime">
      <option v-for="startT in 13" :value="String(startT)">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postSpecialData.endTime">
      <option v-for="endT in 13" :value="String(endT)">{{ endT }}</option>
    </select>
    교시
  </div>

  <!-- 장소 -->
  <div v-if="postSpecialData.event === 'MAKEUP'">
    <label for="classroom">장소 : </label>
    <select id="classroom" v-model="postSpecialData.classroom">
      <option v-for="classroom in classrooms" :value="classroom.classroom_id">{{ classroom.label }}</option>
      <option value="">기타</option>
    </select>
    <div v-if="postSpecialData.classroom == ''">
      <label for="classroom">장소 입력: </label>
      <input  id="classroom" v-model="classroomName">
    </div>
  </div>

  <button @click="handleSubmit">등록</button>
</template>
