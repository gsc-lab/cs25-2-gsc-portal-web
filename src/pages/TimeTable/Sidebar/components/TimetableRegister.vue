<script setup>
import { ref, watch, onMounted } from 'vue'
import { getClassrooms } from '@/api/classroomApi';
import { useTimetableStore } from '@/stores/timetable';
import { postTimetable, getCourses } from '@/api/timetableApi';

const store = useTimetableStore();
const timetableData = ref();
const classrooms = ref();
const courses = ref();

// 초기화
const days = ["월", "화", "수", "목", "금"];
const enDays = ["MON", "TUE", "WED", "THU", "FRI"];
onMounted(async () => {
  courses.value = await getCourses();
  classrooms.value = await getClassrooms();
  console.log("test");
})
const classroomName = ref("");
const selectRoom = ref();
const startTime = ref()
const endTime = ref()

// 값 저장
const postTimetableData = ref({
  target: null,
  room_id: null,
  course_id: null,
  day: null,
  startTime: null,
  endTime: null
})
// ================================= 데이터 초기화 =================================
// 시간 저장
// 작은 값 : startTime ,  큰 값 : endTime
const lengthHour = () => {
  const len = timetableData.value.length
  console.log("time", len);
  if (timetableData.value?.[0].hour > timetableData.value?.[len - 1].hour) {
    startTime.value = timetableData.value?.[len - 1].hour
    endTime.value = timetableData.value?.[0].hour
  } else {
    startTime.value = timetableData.value?.[0].hour
    endTime.value = timetableData.value?.[len - 1].hour
  }
}

const setRoomName = () => {
  const room = classrooms.value.filter((room) => room.label == timetableData.value?.[0].schedule?.room)
  console.log("room", room);
  selectRoom.value = room[0]
}


// target 바뀌면 해당 과목 필터링
watch(
  () => postTimetableData.value.target,
  (target) => {
    console.log("postTimetableData.target", target);
  })

// selectTT를 감시하고 timetableData 갱신
watch(() => store.selectTT, (newVal) => {
  if (newVal?.[0]?.[0]) {
    console.log("정상값:", newVal[0][0])
    timetableData.value = newVal[0];
    lengthHour()

    if (timetableData.value?.[0].schedule) {
      setRoomName()
    }
    console.log("selectRoom", selectRoom.value);

    // 값 세팅
    postTimetableData.value = {
      target: timetableData.value[0].grade,
      room_id: selectRoom.value?.classroom_id ?? null,
      course_id: timetableData.value[0].schedule?.course_id ?? null,
      day: timetableData.value[0].day,
      startTime: startTime.value,
      endTime: endTime.value
    }
  } else {
    console.log("아직 데이터 없음")
  }
}, { immediate: true })


// 저장버튼 누른 후 실행
const handleSubmit = async () => {
  if (postTimetableData.value.room_id == "") {
    postTimetableData.value.room_id = classroomName.value;
  }
  console.log("등록", postTimetableData.value);
  await postTimetable(postTimetableData.value)
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
      <option v-for="course in courses" :value="course.course_id">{{ course.title }}</option>
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
    <select id="classroom" v-model="postTimetableData.room_id">
      <option v-for="classroom in classrooms" :key="classroom.label" :value="classroom.classroom_id">
        {{ classroom.label }}
      </option>
      <!-- 특강이면 데이터에 없는 장소 등록 가능-->
      <option v-if="postTimetableData.target == 'special'" value="">기타</option>
    </select>
    <div v-if="postTimetableData.room_id == ''" >
      <label for="classroom">장소 입력 : </label>
      <input  id="classroom" v-model="classroomName">
    </div>
  </div>

  <!-- 교시 -->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postTimetableData.startTime">
      <option v-for="startT in 12" :value="startT">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postTimetableData.endTime">
      <option v-for="endT in 12" :value="endT">{{ endT }}</option>
    </select>
    교시
  </div>

  <button @click="handleSubmit">시간표 등록</button>
</template>
