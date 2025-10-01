<script setup>
import { ref, watch, onMounted } from 'vue'
import { getClassrooms } from '@/api/classroomApi';
import { getCancelSchedule, getCourses, postEvent } from '@/api/timetableApi';
import { useTimetableStore } from '@/stores/timetable';

const store = useTimetableStore();          // 시간표 store
const timetableData = ref();                // 사용자가 선택한 셀 내용 임시 저장
const classrooms = ref();
const courses = ref();

// api에서 정보 가져오기
onMounted(async () => {
  classrooms.value = await getClassrooms(); // 교실 리스트 -> { classroom_id: "101", label: "본관-101" }
  courses.value = await getCourses();       // 과목 리스트 -> { course_id: "C001", courseTitle: "인공지능 개론", grade_id: "1"}
  console.log("classrooms:", classrooms.value);
  console.log("courses:", courses.value);
});


// 장소 입력시 저장
const classroomName = ref("");             // 기타의 교실 이름
const startTime = ref()                    // 시작교시
const endTime = ref()                      // 종료 교시
const canceledSchedule = ref(null);        // [보강] 휴강의 스케줄
const selectMakeup = ref([]);              // [보강] 등록할 휴강 스케줄 (schedule_id)
const cancelMap = ref(null);                   // [보강] 과목 필터링 후 휴강 스케줄

// 값 저장
const postSpecialData = ref({
  target: null,
  event: null,
  course_id: null,
  date: null,
  startTime: null,
  endTime: null,
  classroom_label: null
})

// ================================= 휴 보강 =================================
// 휴강인지 채크 보강이면 휴강의 스케줄 조회 -> true/false
const isCANCEL = async () => {
  console.log("schedule::", timetableData.value?.[0].schedule?.course_id);
  if (timetableData.value?.[0].schedule?.course_id) {
    return true
  }
  // 해당 학년의 휴강 스케줄 조회
  console.log("학년", timetableData.value[0].grade);
  canceledSchedule.value = await getCancelSchedule(3);
  cancelMap.value = { ...canceledSchedule.value }
  console.log("canceledSchedule.value", canceledSchedule.value);
  return false
}

// 과목을 선택하면 해당 휴강 스케줄 반영
const handleCourseSelect = (e) => {
  if (postSpecialData.event === 'CANCEL') return
  console.log("newCourse", e.target.value);
  const row =  canceledSchedule.value.filter((cancel) => cancel.course_title == e.target.value)
    console.log(row);
  cancelMap.value = row
}

// ================================= 데이터 초기화 =================================
// 시간 저장
// 작은 값 : startTime ,  큰 값 : endTime
const lengthHour = () => {
  const len = timetableData.value.length
  if (timetableData.value?.[0].hour > timetableData.value?.[len - 1].hour) {
    startTime.value = timetableData.value?.[len - 1].hour
    endTime.value = timetableData.value?.[0].hour
  } else {
    startTime.value = timetableData.value?.[0].hour
    endTime.value = timetableData.value?.[len - 1].hour
  }
}

// 장소 이름 저장
const setRoomName = () => {
  if(!timetableData.value?.[0]?.schedule?.room) return
  const room = classrooms.value.filter((room) => room.label == timetableData.value?.[0]?.schedule?.room)
  // console.log("room", room[0]);
  return room[0]
}

// selectTT를 감시하고 timetableData 갱신
watch(() => store.selectTT, async (newVal) => {
  if (newVal?.[0]?.[0]) {
    console.log("정상값:", newVal[0][0])
    timetableData.value = newVal[0];    // 선택 된 데이터 대입
    lengthHour()                        // 교시 설정
    const selectRoom = setRoomName()    // 장소 조회 { classroom_id: "101", label: "본관-101" }

    const cancel = await isCANCEL();    // 휴강인지 조회 (true/false) / 보강이면 휴강 스케줄 세팅
    console.log("cancelMap", cancelMap);
    // 값 세팅
    postSpecialData.value = {
      target: timetableData.value[0].grade,
      event: cancel ? "CANCEL" : "MAKEUP",
      course_id: timetableData.value[0].schedule?.course_id ?? null,
      startTime: startTime.value,
      endTime: endTime.value,
      classroom_label: selectRoom?.label ?? null,
    }
  } else {
    console.log("아직 데이터 없음")
  }
}, { immediate: true })



// ================================= post =================================
// 저장버튼 누른 후 실행
const handleSubmit = () => {
  // 기타면 classroomName대입
  if (postSpecialData.value.classroom_label == "") {
    postSpecialData.value.classroom_label = classroomName.value;
  }
  if (postSpecialData.value.event == "MAKEUP") {
    postSpecialData.value.course_id = selectMakeup.value
  }
  console.log(postSpecialData.value);
  postEvent(postSpecialData.value)
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

  <!-- 날짜 (post : "0000-00-00")-->
  <div>
    <label for="date">날짜 : </label>
    <input type="date" id="date" v-model="postSpecialData.date">
  </div>

  <!-- 과목
    CANCEL : course_id
    MAKEUP : schedule_id  (handleCourseSelect() -> e.target.value = course.title)
  -->
  <div>
    <label for="course">과목 : </label>
    <select id="course" v-model="postSpecialData.course_id" @change="handleCourseSelect">
      <option v-for="course in courses"
        :value="postSpecialData.event == 'CANCEL' ? course.course_id : course.title">
        {{ course.title }}
      </option>
    </select>
  </div>
  <!-- 보강 등록시 휴강과목 선택 -->
  <div v-if="postSpecialData.event === 'MAKEUP' ">
    <p>휴강과목 :</p>
    <div v-if="Object.keys(cancelMap).length > 0">
      <div v-for="course in cancelMap" :key="course.event_id">
        <input type="checkbox"  :value="course.event_id" v-model="selectMakeup"/>
        <label for="course">{{ course.course_title }}:  {{ course.event_date }}, {{ course.period }}교시</label>
      </div>
    </div>
    <!-- 휴강 과목 없음 -->
    <div v-else>
      <p>해당 과목의 휴강 이력이 없음</p>
    </div>
  </div>

  <!-- 교시 (post: int형)-->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postSpecialData.startTime">
      <option v-for="startT in 13" :value="startT">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postSpecialData.endTime">
      <option v-for="endT in 13" :value="endT">{{ endT }}</option>
    </select>
    교시
  </div>

  <!-- 장소 (post: label(이름))-->
  <div v-if="postSpecialData.event === 'MAKEUP'">
    <label for="classroom">장소 : </label>
    <select id="classroom" v-model="postSpecialData.classroom_label">
      <option v-for="classroom in classrooms" :value="classroom.label">{{ classroom.label }}</option>
      <option value="">기타</option>
    </select>
    <div v-if="postSpecialData.classroom_label == ''">
      <label for="classroom">장소 입력: </label>
      <input  id="classroom" v-model="classroomName">
    </div>
  </div>

  <button @click="handleSubmit">등록</button>
</template>
