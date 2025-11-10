<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { useProfessorStore } from '@/stores/professor'
import { useClassroomStore } from '@/stores/classroom'
import { setTarget, day } from '@/utils/reName'
import {
  putCourse,
  putTimetable,
  delCourse,
  delTimetable,
  getSpecialClasses,
  getKoreanClasses,
  getSections,
} from '@/api/timetableApi'

const Tstore = useTimetableStore() // 시간표 store
const Pstore = useProfessorStore() // 교수 store
const Cstore = useClassroomStore() // 장소 store
const professors = ref() // 교수 명단
const classrooms = ref(null) // 교실
const classes = ref() // 분반 클래스 목록
const sections = ref(null)
onMounted(async () => {
  professors.value = await Pstore.getProfessors()
  classrooms.value = await Cstore.getClassroom()
  sections.value = await getSections()
  console.log('professors', professors.value)
  console.log('classrooms', classrooms.value)
})

const originCourses = ref(null) // 원본 과목
const courses = ref(null) // 필터링 과목
const target = ref('0') // target 필터
const isView = ref([]) // 상세 보기 id저장
// 수정할 내용
const putData = ref({
  course_id: null,
  timetable_ids: [],
  data: {
    // 과목 수정
    professor_id: null,
    target: null,
    title: null,
    section: null,
    // 시간표 수정
    day: null,
    start_period: null,
    end_period: null,
    room_id: null,
    class_id: null,
  },
})
console.log('len', putData.value.timetable_ids.length)

// 전체 Courses 조회
async function setOriginCourses() {
  originCourses.value = await Tstore.getCourses()
  console.log('originCourses.value', originCourses.value)
}

// set originCourses, courses
async function setCourses() {
  await Tstore.setCourses()
  await setOriginCourses()
  courses.value = await Tstore.courseFilter(target.value)
  console.log('courses.value', courses.value)
}

// ================================= target 감시 =================================
// target 바뀌면 해당 과목 필터링
watch(
  () => target.value,
  async (newTarget) => {
    // 전체일 때 origin대입
    if (originCourses.value == null) await setOriginCourses()
    courses.value = await Tstore.courseFilter(newTarget) // target: 필터링
    console.log(courses.value)
    if (newTarget == 'special') {
      // target에 맞게 classes 정의
      classes.value = await getSpecialClasses()
    } else if (newTarget == 'korean') {
      classes.value = await getKoreanClasses()
    }
  },
  { immediate: true },
)

const toggleSelect = (course_id) => {
  // console.log('실행')
  if (isView.value.includes(course_id)) {
    // 이미 있으면 제거
    isView.value = isView.value.filter((i) => i !== course_id)
    // console.log('제거')
  } else {
    // 없으면 추가
    isView.value.push(course_id)
    // console.log('추가', isView.value)
    // console.log(isView.value?.includes(course_id))
  }
}
// ================================= 수정 =================================
const handlePut = async (courseId, argDate, timetableIds) => {
  console.log('수정: ', courseId, String(timetableIds))
  putData.value = {
    course_id: courseId,
    timetable_ids: !timetableIds ? [] : timetableIds,
    data: {
      professor_id: argDate?.professor ? await Pstore.searchProfessorsId(argDate?.professor) : null,
      target: argDate?.target ?? null,
      title: argDate?.title ?? null,
      section: argDate?.section ?? '2025-1',
      // 시간표 수정
      day: argDate?.day ?? null,
      start_period: argDate?.start_period ?? null,
      end_period: argDate?.end_period ?? null,
      room_id: argDate?.room ? await Cstore.searchClassroomId(argDate?.room) : null,
      class_id: argDate?.class_id ?? null,
    },
  }
  console.log(putData.value.timetable_ids)
}
// ================================= 등록 =================================
const handleSubmit = async () => {
  if (putData.value.timetable_ids.length == 0) {
    await putCourse(putData.value)
  } else {
    await putTimetable(putData.value)
  }
  console.log('등록', putData.value)
  // 초기화
  putData.value.course_id = null
  putData.value.timetable_ids = null
  setCourses()
}
// ================================= 삭제 =================================
// 과목
const handleCourseDel = async (course_id) => {
  console.log(course_id)
  if (confirm('정말 삭제하시겠습니까?')) {
    const res = await delCourse(course_id)
    console.log(res)
    // 초기화
    await setCourses()
  }
}
const handleTimetableDel = async (course_id, day) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    const res = await delTimetable(course_id, day)
    console.log(res)
    // 초기화
    await setCourses()
  }
}
</script>

<template>
  CourseView

  <div>
    <input type="radio" id="0" value="0" v-model="target" />
    <label for="0">전체</label>

    <input type="radio" id="1" value="1" v-model="target" />
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="target" />
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="target" />
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="target" />
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="target" />
    <label for="korean">한국어</label>
  </div>
  <table v-if="courses != null" style="border-collapse: collapse">
    <thead>
      <tr style="background-color: bisque">
        <th style="border: 1px solid #000; padding: 10px"></th>
        <th style="border: 1px solid #000; padding: 10px">학년</th>
        <th style="border: 1px solid #000; padding: 10px">과목</th>
        <th style="border: 1px solid #000; padding: 10px">교수</th>
        <th style="border: 1px solid #000; padding: 10px">학기</th>
        <th style="border: 1px solid #000; padding: 10px">수정</th>
        <th style="border: 1px solid #000; padding: 10px">삭제</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(course, course_id) in courses" :key="course">
        <tr>
          <td
            style="border: 1px solid #000; padding: 10px; user-select: none"
            @click="toggleSelect(course_id)"
          >
            ▶
          </td>
          <!--  학년  -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
              <select v-model="putData.data.target">
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
                <option value="special">특강</option>
                <option value="korean">한국어</option>
              </select>
            </div>
            <div v-else>{{ setTarget(course.target) }}</div>
          </td>
          <!--  과목 이름  -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
              <input v-model="putData.data.title" />
            </div>
            <div v-else>{{ course.title }}</div>
          </td>
          <!--  교수 이름  -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
              <select v-model="putData.data.professor_id">
                <option
                  v-for="professor in professors"
                  :value="professor.user_id"
                  :key="professor.user_id"
                >
                  {{ professor.name }}
                </option>
              </select>
            </div>
            <div v-else>{{ course.professor }}</div>
          </td>
          <!--  학기  -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
              <select id="section" v-model="putData.data.section">
                <option v-for="section in sections" :value="section.sec_id" :key="section.sec_id">
                  {{ section.sec_id }}
                </option>
              </select>
            </div>
            <div v-else>{{ course?.section }}</div>
          </td>
          <!-- 수정전환 / 등록 -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
              <button @click="handleSubmit()">등록</button>
            </div>
            <div v-else><button @click="handlePut(course_id, course)">수정</button></div>
          </td>
          <!-- 삭제 / 취소 -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
              <button @click="putData.course_id = null">취소</button>
            </div>
            <div v-else>
              <button @click="handleCourseDel(course_id)">삭제</button>
            </div>
          </td>
        </tr>

        <!-- -------------------------  시간표 내용  ------------------------- -->
        <template v-if="isView?.includes(course_id)">
          <tr
            v-for="schedule in course.schedule"
            :key="schedule"
            style="background-color: antiquewhite"
          >
            <td style="border: 1px solid #000; padding: 10px; user-select: none"></td>
            <!-- 분반 존재 시 -->
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-if="
                  schedule.class_id &&
                  course_id == putData?.course_id &&
                  schedule.schedule_ids == putData?.timetable_ids
                "
              >
                <select id="day" v-model="putData.data.class_id">
                  <option v-for="(cls, idx) in classes" :value="cls.class_id" :key="idx">
                    {{ cls.class_group }}
                  </option>
                </select>
              </div>
              <div v-else>
                {{ schedule.class_name }}
              </div>
            </td>
            <!--  요일  -->
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-if="
                  course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids
                "
              >
                <select id="day" v-model="putData.data.day">
                  <option
                    v-for="(day, idx) in { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금' }"
                    :value="idx"
                    :key="idx"
                  >
                    {{ day }}요일
                  </option>
                </select>
              </div>
              <div v-else>{{ day(schedule.day) }}</div>
              <!--  교시  -->
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-if="
                  course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids
                "
              >
                <select id="time" v-model="putData.data.start_period">
                  <option v-for="startT in 12" :value="startT" :key="startT">{{ startT }}</option>
                </select>
                ~
                <select id="time" v-model="putData.data.end_period">
                  <option v-for="endT in 12" :value="endT" :key="endT">{{ endT }}</option>
                </select>
                교시
              </div>
              <div v-else>{{ schedule.start_period }} ~ {{ schedule.end_period }} 교시</div>
            </td>
            <!--  교실  -->
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-if="
                  course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids
                "
              >
                <select id="classroom" v-model="putData.data.room_id">
                  <option
                    v-for="classroom in classrooms"
                    :key="classroom.label"
                    :value="classroom.classroom_id"
                  >
                    {{ classroom.label }}
                  </option>
                </select>
              </div>
              <div v-else>{{ schedule.room }}</div>
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-if="
                  course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids
                "
              >
                <button @click="handleSubmit()">등록</button>
              </div>
              <div v-else>
                <button @click="handlePut(course_id, schedule, schedule.schedule_ids)">수정</button>
              </div>
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-if="
                  course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids
                "
              >
                <button @click="((putData.course_id = null), (putData.timetable_ids = null))">
                  취소
                </button>
              </div>
              <div v-else>
                <button @click="handleTimetableDel(course_id, schedule.day)">삭제</button>
              </div>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
