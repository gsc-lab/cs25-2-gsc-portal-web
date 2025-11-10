<script setup>
import { ref, watch, onMounted } from 'vue'
import { getCancelSchedule, postEvent } from '@/api/timetableApi'
import { useTimetableStore } from '@/stores/timetable'
import { useClassroomStore } from '@/stores/classroom'

const Tstore = useTimetableStore() // 시간표 store
const Cstore = useClassroomStore() // 장소 store

const courses = ref() // target필터링 과목들
const classrooms = ref(null) // 장소
onMounted(async () => {
  classrooms.value = await Cstore.getClassroom()
})

// 장소 입력시 저장
const classroomName = ref('') // 기타의 교실 이름
const canceledSchedule = ref(null) // [보강] 휴강의 스케줄
const selectMakeup = ref([]) // [보강] 등록할 휴강 스케줄 (event_id)
const cancelMap = ref([]) // [보강] 과목 필터링 후 휴강 스케줄

// 값 저장
const setNull = () => {
  postSpecialData.value = {
    target: null,
    event: null,
    course_id: null,
    date: null,
    startTime: null,
    endTime: null,
    classroom_label: null,
  }
}
const postSpecialData = ref(setNull)

// ================================= 데이터 초기화 =================================
// selectTT를 감시하고 timetableData 갱신
watch(
  () => Tstore.selectTT,
  async (timetableData) => {
    if (timetableData) {
      console.log('정상값:', timetableData)

      courses.value = await Tstore.courseFilter(timetableData.target)
      console.log('courses', courses.value)
      // 값 세팅
      postSpecialData.value = {
        target: timetableData.target,
        event: timetableData.schedule ? 'CANCEL' : 'MAKEUP',
        course_id: timetableData.schedule?.course_id ?? null,
        date: timetableData.date,
        startTime: timetableData.startTime,
        endTime: timetableData.schedule
          ? timetableData.endTime
          : selectMakeup.value.length > 0
            ? timetableData.startTime + selectMakeup.value.length - 1
            : null,
        classroom_label: timetableData.label ?? null,
      }
    } else {
      console.log('아직 데이터 없음')
    }
  },
  { immediate: true },
)

// ================================= target, selectMakeup 감시 =================================
// 보강일 때 학년을 선택하면 해당학년의 휴강정보 조회
watch(
  () => postSpecialData.value.target,
  async (newTarget) => {
    // 학년의 과목 조회
    courses.value = await Tstore.courseFilter(newTarget)
    if (postSpecialData.value.event === 'MAKEUP') {
      // 해당 학년의 휴강 스케줄 조회
      canceledSchedule.value = await getCancelSchedule(newTarget)
      cancelMap.value = { ...canceledSchedule.value }
      console.log('canceledSchedule.value', canceledSchedule.value)
    }
  },
)

// 휴강 선택 개수에 맞춰서 endTime 저장
watch(
  () => selectMakeup.value,
  () => {
    postSpecialData.value.endTime =
      selectMakeup.value.length > 0
        ? postSpecialData.value.startTime + selectMakeup.value.length - 1
        : null
  },
)
// ==================================  post  ==================================
// 저장버튼 누른 후 실행
const handleSubmit = async () => {
  // 기타면 classroomName 대입
  if (postSpecialData.value.classroom_label == '') {
    postSpecialData.value.classroom_label = classroomName.value
  }
  if (postSpecialData.value.event == 'MAKEUP') {
    // selectMakeup 대입
    postSpecialData.value.course_id = selectMakeup.value
  }
  // console.log(postSpecialData.value)
  await postEvent(postSpecialData.value)
  await Tstore.setTimetable()
  // 초기화
  setNull()
}
// ==========================================================================================
</script>

<template>
  EventsRegister
  <!-- 예외 입력을 막기 위해 시간표에서 선택해야 값이 들어감 -->
  <!-- Grade 등 선택 -->
  <div>
    <input type="radio" id="1" value="1" v-model="postSpecialData.target" />
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="postSpecialData.target" />
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="postSpecialData.target" />
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="postSpecialData.target" />
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="postSpecialData.target" />
    <label for="korean">한국어</label>
  </div>

  <!-- 휴 / 보 -->
  <div>
    <input type="radio" id="CANCEL" value="CANCEL" v-model="postSpecialData.event" />
    <label for="CANCEL">휴강</label>

    <input type="radio" id="MAKEUP" value="MAKEUP" v-model="postSpecialData.event" />
    <label for="MAKEUP">보강</label>
  </div>

  <!-- 날짜 (post : "0000-00-00")-->
  <div>
    <label for="date">날짜 : </label>
    <input type="date" id="date" v-model="postSpecialData.date" readonly />
  </div>

  <!-- -------------------------------------- 과목 설정 ---------------------------------------------
    CANCEL : course_id
    MAKEUP : event_id  selectMakeup에 저장
  -->
  <!-- --------------  보강 --------------- -->
  <div v-if="postSpecialData.event === 'MAKEUP'">
    <p>휴강과목 :</p>
    <div v-if="Object.keys(cancelMap).length > 0">
      <div v-for="course in cancelMap" :key="course.event_id">
        <input type="checkbox" :value="course.event_id" v-model="selectMakeup" />
        <label for="course"
          >{{ course.course_title }}: {{ course.event_date }}, {{ course.period }}교시</label
        >
      </div>
    </div>
    <!-- 휴강 과목 없음 -->
    <div v-else>
      <p>해당 과목의 휴강 이력이 없음</p>
    </div>
  </div>
  <!-- --------------  휴강 --------------- -->
  <div v-else>
    <label for="course">과목 : </label>
    <select id="course" v-model="postSpecialData.course_id" style="pointer-events: none">
      <option v-for="(course, idx) in courses" :value="idx" :key="idx">
        {{ course.title }}
      </option>
    </select>
  </div>
  <!-- -------------------------------------------------------------------------------------- -->

  <!-- 교시 (post: int형)-->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postSpecialData.startTime" style="pointer-events: none">
      <option v-for="startT in 13" :value="startT" :key="startT">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postSpecialData.endTime" style="pointer-events: none">
      <option v-for="endT in 13" :value="endT" :key="endT">
        {{ endT }}
      </option>
    </select>
    교시
  </div>

  <!-- 장소 (post: label(이름))-->
  <div v-if="postSpecialData.event === 'MAKEUP'">
    <label for="classroom">장소 : </label>
    <select id="classroom" v-model="postSpecialData.classroom_label">
      <option v-for="classroom in classrooms" :value="classroom.label" :key="classroom">
        {{ classroom.label }}
      </option>
      <option value="">기타</option>
    </select>
    <div v-if="postSpecialData.classroom_label == ''">
      <label for="classroom">장소 입력: </label>
      <input id="classroom" v-model="classroomName" />
    </div>
  </div>

  <button @click="handleSubmit">등록</button>
</template>
