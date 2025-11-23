<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-6">휴보강 등록</h3>

    <!-- Target Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-text-base mb-2">대상 선택:</label>
      <div class="flex flex-wrap gap-3">
        <input type="radio" id="er-1" value="1" v-model="postSpecialData.target" class="hidden" />
        <label for="er-1" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.target === '1' }">
          1학년
        </label>

        <input type="radio" id="er-2" value="2" v-model="postSpecialData.target" class="hidden" />
        <label for="er-2" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.target === '2' }">
          2학년
        </label>

        <input type="radio" id="er-3" value="3" v-model="postSpecialData.target" class="hidden" />
        <label for="er-3" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.target === '3' }">
          3학년
        </label>

        <input type="radio" id="er-special" value="special" v-model="postSpecialData.target" class="hidden" />
        <label for="er-special" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.target === 'special' }">
          특강
        </label>

        <input type="radio" id="er-korean" value="korean" v-model="postSpecialData.target" class="hidden" />
        <label for="er-korean" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.target === 'korean' }">
          한국어
        </label>
      </div>
    </div>

    <!-- Event Type (Cancel/Makeup) -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-text-base mb-2">이벤트 유형:</label>
      <div class="flex flex-wrap gap-3">
        <input type="radio" id="er-cancel" value="CANCEL" v-model="postSpecialData.event" class="hidden" />
        <label for="er-cancel" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.event === 'CANCEL' }">
          휴강
        </label>

        <input type="radio" id="er-makeup" value="MAKEUP" v-model="postSpecialData.event" class="hidden" />
        <label for="er-makeup" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': postSpecialData.event === 'MAKEUP' }">
          보강
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <!-- Date -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="date">날짜:</label>
        <input type="date" id="date" v-model="postSpecialData.date" readonly
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-100 text-text-muted cursor-not-allowed" />
      </div>

      <!-- Course Selection (MAKEUP vs CANCEL) -->
      <div v-if="postSpecialData.event === 'MAKEUP'">
        <div class="grid grid-cols-[120px_1fr] items-start gap-y-4">
          <label class="block text-sm font-medium text-text-base pt-2">휴강과목:</label>
          <div v-if="Object.keys(cancelMap).length > 0" class="flex flex-col gap-2 p-2 border border-gray-200 rounded-base bg-gray-50">
            <div v-for="course in cancelMap" :key="course.event_id" class="flex items-center gap-2">
              <input type="checkbox" :value="course.event_id" v-model="selectMakeup" :id="`makeup-${course.event_id}`"
                class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label :for="`makeup-${course.event_id}`" class="text-sm text-text-base cursor-pointer">
                {{ course.course_title }}: {{ course.event_date }}, {{ course.period }}교시
              </label>
            </div>
          </div>
          <div v-else class="text-sm text-text-muted p-2 border border-gray-200 rounded-base bg-gray-50">
            해당 과목의 휴강 이력이 없음
          </div>
        </div>
      </div>
      <div v-else>
        <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
          <label class="block text-sm font-medium text-text-base pt-2" for="course-id">과목:</label>
          <select id="course-id" v-model="postSpecialData.course_id"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-100 text-text-muted cursor-not-allowed">
            <option v-for="(course, idx) in courses" :value="idx" :key="idx">
              {{ course.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Period -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="time">교시:</label>
        <div class="flex items-center gap-2">
          <select id="time-start" v-model="postSpecialData.startTime"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-100 text-text-muted cursor-not-allowed">
            <option v-for="startT in 13" :value="startT" :key="startT">{{ startT }}</option>
          </select>
          <span class="text-text-base">~</span>
          <select id="time-end" v-model="postSpecialData.endTime"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-100 text-text-muted cursor-not-allowed">
            <option v-for="endT in 13" :value="endT" :key="endT">
              {{ endT }}
            </option>
          </select>
          <span class="text-text-base">교시</span>
        </div>
      </div>

      <!-- Classroom -->
      <div v-if="postSpecialData.event === 'MAKEUP'">
        <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
          <label class="block text-sm font-medium text-text-base pt-2" for="classroom-label">장소:</label>
          <div>
            <select id="classroom-label" v-model="postSpecialData.classroom_label"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              <option v-for="classroom in classrooms" :value="classroom.label" :key="classroom">
                {{ classroom.label }}
              </option>
              <option value="">기타</option>
            </select>
            <div v-if="postSpecialData.classroom_label == ''" class="mt-4">
              <label class="block text-sm font-medium text-text-base mb-1" for="classroom-name">장소 입력:</label>
              <input id="classroom-name" v-model="classroomName"
                class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-6">
      <button @click="handleSubmit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        등록
      </button>
    </div>
  </div>
</template>

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
