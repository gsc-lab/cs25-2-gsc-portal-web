<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { useProfessorStore } from '@/stores/professor'
import {
  postCourse,
  getSections,
  postSection,
  getSpecialClasses,
  getKoreanClasses,
} from '@/api/timetableApi'

const Tstore = useTimetableStore()
const Pstore = useProfessorStore()
const professors = ref() // 교수 명단
const sections = ref(null)
const classes = ref(null)
onMounted(async () => {
  professors.value = await Pstore.getProfessors()
  sections.value = await getSections()
  console.log('professors', professors.value)
})

// 값 저장
const postCourseData = ref({
  target: null,
  course: null,
  professor_id: null,
  section: null,
  class_id: null,
  className: null,
})

const newSection = ref({
  year: null,
  semester: null,
  start_date: null,
  end_date: null,
})
const newSemesterName = ref('')

// ================================= 데이터 초기화 =================================
// selectTT를 감시하고 timetableData 갱신
watch(
  () => Tstore.selectTT,
  (timetableData) => {
    if (timetableData) {
      console.log('정상값:', timetableData.schedule?.professor)

      // 값 세팅
      postCourseData.value = {
        target: timetableData.target,
        course: timetableData.schedule?.title ?? null,
        professor_id: timetableData.schedule?.professor_id ?? null,
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
  () => postCourseData.value.target,
  async (target) => {
    if (target == 'special') {
      // target에 맞게 classes 정의
      classes.value = await getSpecialClasses()
    } else if (target == 'korean') {
      classes.value = await getKoreanClasses()
    }
  },
  { immediate: true },
)
// ================================= Submit =================================
// 저장버튼 누른 후 실행
const handleSubmit = async () => {
  // 학기 추가
  if (postCourseData.value.section == 'new') {
    // 1, 2, s, w외의 학기
    if (postCourseData.value.section.semester == 'new') {
      postCourseData.value.section.semester = newSemesterName.value
    }
    // 새로운 학기 등록
    await postSection(newSection.value)
    // sec_id 생성 -> postCourseData에 대입
    postCourseData.value.section = `${newSection.value.year}-${newSection.value.semester}`
    console.log('OK', postCourseData.value.section)
  }
  // 과목 등록
  await postCourse(postCourseData.value)
  await Tstore.setCourses()
}
// ===================================================================================
</script>

<template>
  CourseRegister
  <!-- Grade 등 선택 -->
  <div>
    <input type="radio" id="1" value="1" v-model="postCourseData.target" />
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="postCourseData.target" />
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="postCourseData.target" />
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="postCourseData.target" />
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="postCourseData.target" />
    <label for="korean">한국어</label>
  </div>

  <!-- 강의명 입력 -->
  <div>
    <label for="course">강의명 : </label>
    <input id="course" v-model="postCourseData.course" />
  </div>
  <!-- 교수명 입력 -->
  <div>
    <label for="professor">교수명 : </label>
    <select id="professor" v-model="postCourseData.professor_id">
      <option v-for="professor in professors" :value="professor.user_id" :key="professor.user_id">
        {{ professor.name }}
      </option>
    </select>
  </div>
  <!-- 분반 -->
  <div v-if="postCourseData.target == 'special' || postCourseData.target == 'korean'">
    <label for="class_id">반 : </label>
    <select id="class_id" v-model="postCourseData.class_id">
      <option v-for="cls in classes" :key="cls.class_id" :value="cls.class_id">
        {{ cls.class_group }}
      </option>
      <option :value="null">기타</option>
    </select>
    <div v-if="postCourseData.class_id == null">
      <label for="className">반 이름 입력 : </label>
      <input id="className" v-model="postCourseData.className" />
    </div>
  </div>

  <!-- 학기 입력 -->
  <div>
    <label for="section">학기 : </label>
    <select id="section" v-model="postCourseData.section">
      <option v-for="section in sections" :value="section.sec_id" :key="section.sec_id">
        {{ section.sec_id }}
      </option>
      <option value="new">새로 생성</option>
    </select>
    <!-- 새로 만들기 -->
    <div v-if="postCourseData.section == 'new'">
      <div>
        <label form="year">년도:</label>
        <input id="year" v-model="newSection.year" placeholder="2025" />
      </div>
      <div>
        <label form="semester">학기:</label>
        <select id="semester" v-model="newSection.semester">
          <option value="1">1학기</option>
          <option value="2">2학기</option>
          <option value="s">여름방학</option>
          <option value="w">겨울방학</option>
          <option value="new">기타</option>
        </select>
        <div v-if="newSection.semester == 'new'">
          <label for="semesterName">학기 이름:</label>
          <input id="semesterName" v-model="newSemesterName" />
        </div>
      </div>
      <div>
        <label for="date">학기 시작일 : </label>
        <input type="date" id="date" v-model="newSection.start_date" />
      </div>
      <div>
        <label for="date">학기 종료일 : </label>
        <input type="date" id="date" v-model="newSection.end_date" />
      </div>
    </div>
  </div>

  <button @click="handleSubmit">과목 등록</button>
</template>
