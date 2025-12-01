<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-6">시간표 등록</h3>

    <div class="flex flex-col gap-4">
      <!-- Section Select -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="section">학기:</label>
        <select
          id="section"
          v-model="section"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option v-for="s in sections" :value="s.sec_id" :key="s.sec_id">
            {{ s.label }}
          </option>
        </select>
      </div>

      <!-- Target Selection -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2">대상 선택:</label>
        <div class="flex flex-wrap gap-3">
          <input
            type="radio"
            id="tr-1"
            value="1"
            v-model="postTimetableData.target"
            class="hidden"
          />
          <label
            for="tr-1"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                postTimetableData.target === '1',
            }"
          >
            1학년
          </label>

          <input
            type="radio"
            id="tr-2"
            value="2"
            v-model="postTimetableData.target"
            class="hidden"
          />
          <label
            for="tr-2"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                postTimetableData.target === '2',
            }"
          >
            2학년
          </label>

          <input
            type="radio"
            id="tr-3"
            value="3"
            v-model="postTimetableData.target"
            class="hidden"
          />
          <label
            for="tr-3"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                postTimetableData.target === '3',
            }"
          >
            3학년
          </label>

          <input
            type="radio"
            id="tr-special"
            value="special"
            v-model="postTimetableData.target"
            class="hidden"
          />
          <label
            for="tr-special"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                postTimetableData.target === 'special',
            }"
          >
            특강
          </label>

          <input
            type="radio"
            id="tr-korean"
            value="korean"
            v-model="postTimetableData.target"
            class="hidden"
          />
          <label
            for="tr-korean"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                postTimetableData.target === 'korean',
            }"
          >
            한국어
          </label>
        </div>
      </div>

      <!-- Course Select -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="course">과목:</label>
        <select
          id="course"
          v-model="postTimetableData.course_id"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option v-for="(course, idx) in courses" :value="idx" :key="idx">
            {{ course.title }}
          </option>
        </select>
      </div>

      <!-- Day Select -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="day">요일:</label>
        <select
          id="day"
          v-model="postTimetableData.day"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option v-for="(d, idx) in days" :value="enDays[idx]" :key="idx">{{ d }}요일</option>
        </select>
      </div>

      <!-- Classroom Select -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="classroom">장소:</label>
        <div>
          <select
            id="classroom"
            v-model="postTimetableData.room_id"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
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
          <div v-if="postTimetableData.room_id == ''" class="mt-4">
            <label class="block text-sm font-medium text-text-base mb-1" for="classroom-name">
              장소 입력:
            </label>
            <input
              id="classroom-name"
              v-model="classroomName"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Period Select -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="time">교시:</label>
        <div class="flex items-center gap-2">
          <select
            id="time-start"
            v-model="postTimetableData.startTime"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option v-for="startT in startTimes" :value="startT" :key="startT">{{ startT }}</option>
          </select>
          <span class="text-text-base">~</span>
          <select
            id="time-end"
            v-model="postTimetableData.endTime"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option v-for="endT in endTimes" :value="endT" :key="endT">{{ endT }}</option>
          </select>
          <span class="text-text-base">교시</span>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-6">
      <button
        @click="handleSubmit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        시간표 등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useClassroomStore } from '@/stores/classroom'
import { useTimetableStore } from '@/stores/timetable'
import { postTimetable } from '@/api/timetableApi'

const Tstore = useTimetableStore() // 시간표 store
const Cstore = useClassroomStore() // 장소 store
const courses = ref() // 필터링 과목
const classrooms = ref(null) // 원본 교실
const sections = ref(null)
const section = ref() // 조회 학기

const noneTimes = ref()
const startTimes = ref(['학년와 요일을 입력해주세요'])
const endTimes = ref([])

onMounted(async () => {
  classrooms.value = await Cstore.getClassroom() // 원본 교실 정의
  sections.value = await Tstore.getSections() // sections 조회
  section.value = await Tstore.sectionOfDate() // 현재 section 초기화
})

// 초기화
const days = ['월', '화', '수', '목', '금']
const enDays = ['MON', 'TUE', 'WED', 'THU', 'FRI']

const classroomName = ref('') // 교실 이름

// 값 저장
const postTimetableData = ref({
  target: null,
  room_id: null,
  course_id: null,
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

      noneTimes.value = await Tstore.noneTime[timetableData.target][timetableData.day]
      // 값 세팅
      postTimetableData.value = {
        target: timetableData.target,
        room_id: timetableData.schedule?.room_id ?? null,
        course_id: timetableData.schedule?.course_id ?? null,
        day: timetableData.day,
        startTime: String(timetableData.startTime),
        endTime: String(timetableData.endTime),
      }
      console.log(noneTimes.value, typeof postTimetableData.value.startTime)
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
  },
  { immediate: true },
)
// section 바뀌면 과목조회
watch(
  () => section.value,
  async () => {
    await Tstore.setCourses(section.value)
    courses.value = await Tstore.courseFilter(postTimetableData.value.target)
  },
  { immediate: true },
)

// target와 요일이 바뀌면 교시 정보 갱신
watch(
  () => [postTimetableData.value.target, postTimetableData.value.day],
  async (val) => {
    console.log('target, day', val[0], val[1])
    if (val[0] && val[1]) {
      noneTimes.value = await Tstore.noneTime[val[0]][val[1]]
      startTimes.value = noneTimes.value
      endTimes.value = noneTimes.value
      // console.log('endTimes', endTimes.value)
    }
  },
)
// 교시 입력을 받으면 필터링
watch(
  () => [postTimetableData.value.startTime, postTimetableData.value.endTime],
  ([newS, newE], [oldS, oldE]) => {
    // startTime를 입력하면 endTimes는 해당 시간 이후
    if (newS != oldS) {
      for (let idx = 0; noneTimes.value.length > idx; idx++) {
        if (noneTimes.value[idx] == newS) {
          endTimes.value = noneTimes.value.slice(idx)
          break
        }
      }
    }
    // endTime를 입력하면 startTimes는 해당 시간 이전
    if (newE != oldE) {
      for (let idx = 0; noneTimes.value.length > idx; idx++) {
        if (noneTimes.value[idx] == newE) {
          startTimes.value = noneTimes.value.slice(0, idx + 1)
          break
        }
      }
    }
  },
)

// ================================= Submit =================================
// 저장버튼 누른 후 실행
const handleSubmit = async () => {
  if (postTimetableData.value.room_id == '') {
    postTimetableData.value.room_id = classroomName.value
  }
  if (
    postTimetableData.value.target &&
    postTimetableData.value.room_id &&
    postTimetableData.value.course_id &&
    postTimetableData.value.day &&
    postTimetableData.value.startTime &&
    postTimetableData.value.endTime
  ) {
    if (confirm(`시간표를 등록하시겠습니까?`)) {
      await postTimetable(postTimetableData.value)
      await Tstore.setTimetable()
    }
  } else {
    alert('필수 값이 누락되었습니다.')
  }
}
// ===================================================================================
</script>
