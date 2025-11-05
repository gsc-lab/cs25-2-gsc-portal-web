<script setup>
import { ref, watch, onMounted } from 'vue'
import { useClassroomStore } from '@/stores/classroom'
import { useTimetableStore } from '@/stores/timetable'
import { postTimetable } from '@/api/timetableApi'

const Tstore = useTimetableStore() // 시간표 store
const Cstore = useClassroomStore() // 장소 store
const courses = ref() // 필터링 과목
const classrooms = ref(null) // 원본 교실
// const classes = ref()                // 분반 클래스 목록
onMounted(async () => {
  classrooms.value = await Cstore.getClassroom() // 원본 교실 정의
  // classes.value = await getLevels()
  // console.log("originCourses", originCourses.value);
})

// 초기화
const days = ['월', '화', '수', '목', '금']
const enDays = ['MON', 'TUE', 'WED', 'THU', 'FRI']

const spClassName = ref('') // 분반 반이름
const classroomName = ref('') // 교실 이름

// 값 저장
const postTimetableData = ref({
  target: null,
  room_id: null,
  course_id: null,
  spClass_id: null,
  day: null,
  startTime: null,
  endTime: null,
})

// ================================= 데이터 초기화 =================================
// selectTT를 감시하고 timetableData 갱신
watch(
  () => Tstore.selectTT,
  async (timetableData) => {
    if (timetableData) {
      console.log('-------------------------')
      console.log('정상값:', timetableData)

      // 값 세팅
      postTimetableData.value = {
        target: timetableData.target,
        room_id: timetableData.schedule?.room_id ?? null,
        course_id: timetableData.schedule?.course_id ?? null,
        day: timetableData.day,
        startTime: timetableData.startTime,
        endTime: timetableData.endTime,
      }
    } else {
      console.log('아직 데이터 없음')
    }
  },
  { immediate: true },
)

// ================================= target 감시 =================================
// target 바뀌면 해당 과목 필터링
watch(
  () => postTimetableData.value.target,
  async (target) => {
    courses.value = await Tstore.courseFilter(target)
    if (target == 'special') {
      // target에 맞게 classes 정의
    }
  },
  { immediate: true },
)

// ================================= Submit =================================
// 저장버튼 누른 후 실행
const handleSubmit = async () => {
  if (postTimetableData.value.room_id == '') {
    postTimetableData.value.room_id = classroomName.value
  }
  console.log('등록', postTimetableData.value)
  await postTimetable(postTimetableData.value)
  await Tstore.setTimetable()
}
// ===================================================================================
</script>

<template>
  <!-- --------------------------------------------------------------------------- -->
  <!-- TimetableRegister -->

  <!-- Grade 등 선택 -->
  <div>
    <input type="radio" id="1" value="1" v-model="postTimetableData.target" />
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="postTimetableData.target" />
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="postTimetableData.target" />
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="postTimetableData.target" />
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="postTimetableData.target" />
    <label for="korean">한국어</label>
  </div>

  <!-- 과목 -->
  <div>
    <label for="course">과목 : </label>
    <select id="course" v-model="postTimetableData.course_id">
      <option v-for="(course, idx) in courses" :value="idx" :key="idx">
        {{ course.title }}
      </option>
    </select>
  </div>

  <!-- 특강이면 그룹 저장 / 없으면 등록 -->
  <div v-if="postTimetableData.target == 'special'">
    <label for="">반 : </label>
    <select id="" v-model="postTimetableData.spClass_id">
      <!-- <option v-for="c in classes" :key="c.class_id" :value="c.class_id">
        {{ c.name }}
      </option> -->
      <option value="">기타</option>
    </select>
    <div v-if="postTimetableData.spClass_id == ''">
      <label for="spClassName">반 이름 입력 : </label>
      <input id="spClassName" v-model="spClassName" />
    </div>
  </div>

  <!-- 요일 -->
  <div>
    <label for="day">요일 : </label>
    <select id="day" v-model="postTimetableData.day">
      <option v-for="(day, idx) in days" :value="enDays[idx]" :key="idx">{{ day }}요일</option>
    </select>
  </div>

  <!-- 장소 -->
  <div>
    <label for="classroom">장소 : </label>
    <select id="classroom" v-model="postTimetableData.room_id">
      <option
        v-for="classroom in classrooms"
        :key="classroom.label"
        :value="classroom.classroom_id"
      >
        {{ classroom.label }}
      </option>
      <!-- 특강이면 데이터에 없는 장소 등록 가능-->
      <option v-if="postTimetableData.target == 'special'" value="">기타</option>
    </select>
    <div v-if="postTimetableData.room_id == ''">
      <label for="classroom">장소 입력 : </label>
      <input id="classroom" v-model="classroomName" />
    </div>
  </div>

  <!-- 교시 -->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postTimetableData.startTime">
      <option v-for="startT in 12" :value="startT" :key="startT">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postTimetableData.endTime">
      <option v-for="endT in 12" :value="endT" :key="endT">{{ endT }}</option>
    </select>
    교시
  </div>

  <button @click="handleSubmit">시간표 등록</button>
</template>
