<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-6">과목 등록</h3>

    <!-- Target Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-text-base mb-2">대상 선택:</label>
      <div class="flex flex-wrap gap-3">
        <input type="radio" id="cr-1" value="1" v-model="postCourseData.target" class="hidden" />
        <label
          for="cr-1"
          class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{
            'bg-primary-light border-primary text-primary-dark font-semibold':
              postCourseData.target === '1',
          }"
        >
          1학년
        </label>

        <input type="radio" id="cr-2" value="2" v-model="postCourseData.target" class="hidden" />
        <label
          for="cr-2"
          class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{
            'bg-primary-light border-primary text-primary-dark font-semibold':
              postCourseData.target === '2',
          }"
        >
          2학년
        </label>

        <input type="radio" id="cr-3" value="3" v-model="postCourseData.target" class="hidden" />
        <label
          for="cr-3"
          class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{
            'bg-primary-light border-primary text-primary-dark font-semibold':
              postCourseData.target === '3',
          }"
        >
          3학년
        </label>

        <input
          type="radio"
          id="cr-special"
          value="special"
          v-model="postCourseData.target"
          class="hidden"
        />
        <label
          for="cr-special"
          class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{
            'bg-primary-light border-primary text-primary-dark font-semibold':
              postCourseData.target === 'special',
          }"
        >
          특강
        </label>

        <input
          type="radio"
          id="cr-korean"
          value="korean"
          v-model="postCourseData.target"
          class="hidden"
        />
        <label
          for="cr-korean"
          class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{
            'bg-primary-light border-primary text-primary-dark font-semibold':
              postCourseData.target === 'korean',
          }"
        >
          한국어
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <!-- Course Name -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="course">강의명:</label>
        <input
          id="course"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          v-model="postCourseData.course"
          placeholder="강의명 입력"
        />
      </div>

      <!-- Professor Name -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="professor">교수명:</label>
        <select
          id="professor"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          v-model="postCourseData.professor_id"
        >
          <option value="" disabled>교수 선택</option>
          <option
            v-for="professor in professors"
            :value="professor.user_id"
            :key="professor.user_id"
          >
            {{ professor.name }}
          </option>
        </select>
      </div>

      <!-- Class ID (for Special/Korean) -->
      <div
        v-if="postCourseData.target == 'special' || postCourseData.target == 'korean'"
        class="grid grid-cols-[120px_1fr] items-baseline gap-y-4"
      >
        <label class="block text-sm font-medium text-text-base pt-2" for="class_id">반:</label>
        <div>
          <select
            id="class_id"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            v-model="postCourseData.class_id"
          >
            <option v-for="cls in classes" :key="cls.class_id" :value="cls.class_id">
              {{ cls.class_group }}
            </option>
            <option :value="'new'">기타</option>
          </select>
          <div v-if="postCourseData.class_id == 'new'" class="mt-4">
            <label class="block text-sm font-medium text-text-base mb-1" for="className">
              반 이름 입력:
            </label>
            <input
              id="className"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              v-model="postCourseData.className"
              placeholder="반 이름"
            />
          </div>
        </div>
      </div>

      <!-- Section (Semester) -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="section">학기:</label>
        <div>
          <select
            id="section"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            v-model="postCourseData.section"
          >
            <option v-for="section in sections" :value="section.sec_id" :key="section.sec_id">
              {{ section.label }}
            </option>
            <option value="new">새로 생성</option>
          </select>

          <!-- New Section Details -->
          <div v-if="postCourseData.section == 'new'" class="mt-4 flex flex-col gap-4">
            <div class="grid grid-cols-[120px_1fr] items-baseline">
              <label class="block text-sm font-medium text-text-base pt-2" for="year">년도:</label>
              <input
                id="year"
                type="number"
                class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                v-model="newSection.year"
                placeholder="2025"
                :min="2025"
              />
            </div>
            <div class="grid grid-cols-[120px_1fr] items-baseline">
              <label class="block text-sm font-medium text-text-base pt-2" for="semester">
                학기:
              </label>
              <select
                id="semester"
                class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                v-model="newSection.semester"
              >
                <option value="1">1학기</option>
                <option value="2">2학기</option>
                <option value="s">여름방학</option>
                <option value="w">겨울방학</option>
              </select>
            </div>
            <div class="grid grid-cols-[120px_1fr] items-baseline">
              <label class="block text-sm font-medium text-text-base pt-2" for="start_date">
                학기 시작일:
              </label>
              <input
                type="date"
                id="start_date"
                class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                v-model="newSection.start_date"
                :max="newSection.end_date"
              />
            </div>
            <div class="grid grid-cols-[120px_1fr] items-baseline">
              <label class="block text-sm font-medium text-text-base pt-2" for="end_date">
                학기 종료일:
              </label>
              <input
                type="date"
                id="end_date"
                class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                v-model="newSection.end_date"
                :min="newSection.start_date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-6">
      <button
        @click="handleSubmit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        과목 등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { useProfessorStore } from '@/stores/professor'
import { postCourse, postSection, getSpecialClasses, getKoreanClasses } from '@/api/timetableApi'

const Tstore = useTimetableStore()
const Pstore = useProfessorStore()
const professors = ref() // 교수 명단
const sections = ref(null)
const classes = ref(null)
onMounted(async () => {
  professors.value = await Pstore.getProfessors()
  sections.value = await Tstore.getSections()
  console.log('professors', professors.value)
})

// 값 저장
const postCourseData = ref(resetCourseData())
const newSection = ref(resetSection())

function resetCourseData() {
  return {
    target: null,
    course: null,
    professor_id: null,
    section: null,
    class_id: null,
    className: null,
  }
}
function resetSection() {
  return {
    year: null,
    semester: null,
    start_date: null,
    end_date: null,
  }
}

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
  try {
    // 학기 추가
    if (postCourseData.value.section == 'new') {
      if (
        newSection.value.year &&
        newSection.value.semester &&
        newSection.value.start_date &&
        newSection.value.end_date
      ) {
        if (newSection.value.year < 2025 || newSection.value.year >= 2099)
          return alert('년도 값이 올바르지 않습니다.')
        const newS = sections.value.find(
          (s) => s.sec_id == `${newSection.value.year}-${newSection.value.semester}`,
        )
        console.log(newS.sec_id)
        if (!newS) {
          // 새로운 학기 등록
          const res = await postSection(newSection.value)
          // sec_id 생성 -> postCourseData에 대입
          postCourseData.value.section = res.sec_id
          console.log('OK', postCourseData.value.section)
          // 초기화
          await Tstore.setSections()
          sections.value = await Tstore.getSections()
        } else {
          throw new Error('이미 존재하는 학기입니다.')
        }
      } else {
        throw new Error('학기 입력 값이 부족합니다.')
      }
    }
    if (
      postCourseData.value.target &&
      postCourseData.value.course &&
      postCourseData.value.professor_id &&
      postCourseData.value.section &&
      (postCourseData.value.target === 'special' || postCourseData.value.target === 'korean'
        ? postCourseData.value.class_id === 'new'
          ? postCourseData.value.className
          : postCourseData.value.class_id
        : true)
    ) {
      if (confirm(`과목을 등록하시겠습니까?`)) {
        if (postCourseData.value.class_id === 'new') postCourseData.value.class_id = null
        // 과목 등록
        await postCourse(postCourseData.value)
        // 초기화
        await Tstore.setCourses()
        postCourseData.value = resetCourseData()
        newSection.value = resetSection()
      }
    } else {
      throw new Error('입력 값이 부족합니다.')
    }
  } catch (e) {
    alert(e)
  }
}
// ===================================================================================
</script>
