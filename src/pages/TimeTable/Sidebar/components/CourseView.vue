<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-4">과목 열람</h3>

    <!-- Section Filter -->
    <div class="mb-4">
      <label for="section-filter" class="block text-sm font-medium text-text-base mb-1">학기 선택:</label>
      <select id="section-filter" v-model="section"
        class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        <option v-for="s in sections" :value="s.sec_id" :key="s.sec_id">
          {{ s.label }}
        </option>
      </select>
    </div>

    <!-- Target Filter Radio Buttons -->
    <div class="flex flex-wrap gap-2 mb-4">
      <input type="radio" id="view-all" value="0" v-model="target" class="hidden" />
      <label for="view-all"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '0' }]">
        전체
      </label>

      <input type="radio" id="view-1" value="1" v-model="target" class="hidden" />
      <label for="view-1"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '1' }]">
        1학년
      </label>

      <input type="radio" id="view-2" value="2" v-model="target" class="hidden" />
      <label for="view-2"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '2' }]">
        2학년
      </label>

      <input type="radio" id="view-3" value="3" v-model="target" class="hidden" />
      <label for="view-3"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '3' }]">
        3학년
      </label>

      <input type="radio" id="view-special" value="special" v-model="target" class="hidden" />
      <label for="view-special"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === 'special' }]">
        특강
      </label>

      <input type="radio" id="view-korean" value="korean" v-model="target" class="hidden" />
      <label for="view-korean"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === 'korean' }]">
        한국어
      </label>
    </div>

    <!-- Courses Table -->
    <div v-if="courses != null" class="rounded-lg overflow-hidden border border-gray-200 mt-4">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200 text-text-muted">
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium"></th>
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium">학년</th>
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium">과목</th>
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium">교수</th>
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium">학기</th>
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium">수정</th>
              <th class="py-2 px-3 border border-gray-200 text-sm font-medium">삭제</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(course, course_id) in courses" :key="course">
              <tr class="bg-bg-paper" @click="putData.course_id == null && toggleSelect(course_id)">
                <td class="py-1 px-2 border border-gray-200 text-sm text-center cursor-pointer">
                  ▶
                </td>
                <!-- Grade -->
                <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                  <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
                    <select v-model="putData.data.target"
                      class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs">
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                      <option value="special">특강</option>
                      <option value="korean">한국어</option>
                    </select>
                  </div>
                  <div v-else>{{ setTarget(course.target) }}</div>
                </td>
                <!-- Course Name -->
                <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                  <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
                    <input v-model="putData.data.title"
                      class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs" />
                  </div>
                  <div v-else>{{ course.title }}</div>
                </td>
                <!-- Professor Name -->
                <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                  <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
                    <select v-model="putData.data.professor_id"
                      class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs">
                      <option v-for="professor in professors" :value="professor.user_id" :key="professor.user_id">
                        {{ professor.name }}
                      </option>
                    </select>
                  </div>
                  <div v-else>{{ course.professor }}</div>
                </td>
                <!-- Section -->
                <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                  <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
                    <select id="section-edit" v-model="putData.data.section"
                      class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs">
                      <option v-for="s in sections" :value="s.sec_id" :key="s.sec_id">
                        {{ s.sec_id }}
                      </option>
                    </select>
                  </div>
                  <div v-else>{{ course?.section }}</div>
                </td>
                <!-- Edit Button -->
                <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                  <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
                    <button @click.stop="handleSubmit()" class="px-3 py-1 bg-primary text-white text-xs rounded-base hover:bg-primary-dark">등록</button>
                  </div>
                  <div v-else>
                    <button @click.stop="handlePut(course_id, course)" class="px-3 py-1 bg-primary text-white text-xs rounded-base hover:bg-primary-dark">수정</button>
                  </div>
                </td>
                <!-- Delete Button -->
                <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                  <div v-if="course_id == putData?.course_id && putData?.timetable_ids.length == 0">
                    <button @click.stop="putData = resetPutData()" class="px-3 py-1 bg-gray-300 text-text-base text-xs rounded-base hover:bg-gray-400">취소</button>
                  </div>
                  <div v-else>
                    <button @click.stop="handleCourseDel(course_id)" class="px-3 py-1 bg-red-500 text-white text-xs rounded-base hover:bg-red-600">삭제</button>
                  </div>
                </td>
              </tr>

              <!-- Nested Timetable Details -->
              <template v-if="isView?.includes(course_id)">
                <tr v-for="schedule in course.schedule" :key="schedule" class="bg-gray-50">
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center"></td>
                  <!-- Class ID (분반) -->
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                    <div v-if="schedule.class_id && course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids">
                      <select id="class_id-edit" v-model="putData.data.class_id"
                        class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs">
                        <option
                          v-for="(cls, idx) in putData.data.target == 'special'
                            ? specialClasses
                            : KoreanClasses"
                          :value="cls.class_id"
                          :key="idx"
                        >
                          {{ cls.class_group }}
                        </option>
                      </select>
                    </div>
                    <div v-else>{{ schedule.class_name }}</div>
                  </td>
                  <!-- Day -->
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                    <div v-if="course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids">
                      <select id="day-edit" v-model="putData.data.day"
                        class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs">
                        <option
                          v-for="(d, idx) in { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금' }"
                          :value="idx"
                          :key="idx"
                        >
                          {{ d }}요일
                        </option>
                      </select>
                    </div>
                    <div v-else>{{ day(schedule.day) }}</div>
                  </td>
                  <!-- Period -->
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                    <div v-if="course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids">
                      <select id="start-period-edit" v-model="putData.data.start_period"
                        class="block w-1/2 px-1 py-0.5 border border-gray-300 rounded-sm text-xs inline-block">
                        <option v-for="startT in startTimes" :value="startT" :key="startT">{{ startT }}</option>
                      </select>
                      ~
                      <select id="end-period-edit" v-model="putData.data.end_period"
                        class="block w-1/2 px-1 py-0.5 border border-gray-300 rounded-sm text-xs inline-block">
                        <option v-for="endT in endTimes" :value="endT" :key="endT">{{ endT }}</option>
                      </select>
                      교시
                    </div>
                    <div v-else>{{ schedule.start_period }} ~ {{ schedule.end_period }} 교시</div>
                  </td>
                  <!-- Classroom -->
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                    <div v-if="course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids">
                      <select id="classroom-edit" v-model="putData.data.room_id"
                        class="block w-full px-1 py-0.5 border border-gray-300 rounded-sm text-xs">
                        <option v-for="classroom in classrooms" :key="classroom.label" :value="classroom.classroom_id">
                          {{ classroom.label }}
                        </option>
                      </select>
                    </div>
                    <div v-else>{{ schedule.room }}</div>
                  </td>
                  <!-- Edit/Submit Timetable -->
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                    <div v-if="course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids">
                      <button @click="handleSubmit()" class="px-3 py-1 bg-primary text-white text-xs rounded-base hover:bg-primary-dark">등록</button>
                    </div>
                    <div v-else>
                      <button @click="handlePut(course_id, schedule, schedule.schedule_ids)" class="px-3 py-1 bg-primary text-white text-xs rounded-base hover:bg-primary-dark">수정</button>
                    </div>
                  </td>
                  <!-- Delete/Cancel Timetable -->
                  <td class="py-1 px-2 border border-gray-200 text-sm text-center">
                    <div v-if="course_id == putData?.course_id && schedule.schedule_ids == putData?.timetable_ids">
                      <button @click="putData = resetPutData()" class="px-3 py-1 bg-gray-300 text-text-base text-xs rounded-base hover:bg-gray-400">취소</button>
                    </div>
                    <div v-else>
                      <button @click="handleTimetableDel(schedule.schedule_ids)" class="px-3 py-1 bg-red-500 text-white text-xs rounded-base hover:bg-red-600">삭제</button>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

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
} from '@/api/timetableApi'

const Tstore = useTimetableStore() // 시간표 store
const Pstore = useProfessorStore() // 교수 store
const Cstore = useClassroomStore() // 장소 store
const professors = ref() // 교수 명단
const classrooms = ref(null) // 교실
const specialClasses = ref() // 분반 클래스 목록
const KoreanClasses = ref()
const sections = ref(null)
const section = ref() // 조회 학기

onMounted(async () => {
  professors.value = await Pstore.getProfessors()
  classrooms.value = await Cstore.getClassroom()
  sections.value = await Tstore.getSections()
  specialClasses.value = await getSpecialClasses()
  KoreanClasses.value = await getKoreanClasses()
  section.value = await Tstore.sectionOfDate()
})

const originCourses = ref(null) // 원본 과목
const courses = ref(null) // 필터링 과목
const target = ref('0') // target 필터
const isView = ref([]) // 상세 보기 id저장
// 수정할 내용
const putData = ref(resetPutData())
function resetPutData() {
  return {
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
  }
}

// 전체 Courses 조회
async function setOriginCourses() {
  originCourses.value = await Tstore.getCourses()
}

// set originCourses, courses
async function setCourses() {
  await Tstore.setCourses(section.value)
  await setOriginCourses()
  courses.value = await Tstore.courseFilter(target.value)
}

// 교시
const putDay = ref('') // 수정 대상의 원본요일
const putDayNoneTimes = ref([]) // 수정 대상의 원본요일의 등록 가능 교시
const noneTimes = ref([])
const startTimes = ref(['학년와 요일을 입력해주세요'])
const endTimes = ref([])

// =================================  과목 target 감시 =================================
// target 바뀌면 해당 과목 필터링
watch(
  () => target.value,
  async (newTarget) => {
    // 전체일 때 origin대입
    if (originCourses.value == null) await setOriginCourses()
    courses.value = await Tstore.courseFilter(newTarget) // target: 필터링
  },
  { immediate: true },
)
// section 바뀌면 과목조회
watch(
  () => section.value,
  async () => {
    setCourses()
  },
)

// 과목 클릭시 시간표 출력 제어 (course_id를 배열로 관리)
const toggleSelect = (course_id) => {
  if (isView.value.includes(course_id)) {
    // 이미 있으면 제거
    isView.value = isView.value.filter((i) => i !== course_id)
  } else {
    // 없으면 추가
    isView.value.push(course_id)
  }
}
// ================================= 수정 =================================
const handlePut = async (courseId, argDate, timetableIds) => {
  // 초기화
  if (putData.value.course_id) putData.value = resetPutData()
  // 수정 정보 대입
  putData.value = {
    course_id: courseId,
    timetable_ids: !timetableIds ? [] : timetableIds,
    data: {
      professor_id: argDate?.professor ? await Pstore.searchProfessorsId(argDate?.professor) : null,
      target: courses.value?.[courseId].target ?? null,
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
}
// =================================  시간표 target 감시 =================================
// 교시 설정
const setTime = async (s, e) => {
  // 해당 학년, 요일의 등록 가능한 교시
  noneTimes.value = await Tstore.noneTime[putData.value.data.target][putData.value.data.day]
  // 만약 임자 값이 있으면 (수정대상의 요일)
  // -> 기존 교시를 포함한 배열 생성
  if (s && e) {
    let res = []
    // start_period, end_period범위의 배열 생성 * 1~3교시 -> ['1', '2', '3']
    const periods = Array.from({ length: e + 1 - s }, (_, i) => String(s + i))
    for (let idx = 0; idx < noneTimes.value.length; idx++) {
      // noneTimes의 첫번째 요소보다 작면 맨 앞에
      if (idx == 0 && noneTimes.value[idx] >= e) {
        res = [...periods, ...noneTimes.value]
        break
      } // 중간
      else if (noneTimes.value[idx] <= s && noneTimes.value[idx + 1] >= e) {
        res = [...noneTimes.value.slice(0, idx + 1), ...periods, ...noneTimes.value.slice(idx + 1)]
        break
      } // 마지막
      else if (idx == noneTimes.value.length - 1) {
        res = [...noneTimes.value, ...periods]
      }
    }
    // 초기화
    putDayNoneTimes.value = res
    startTimes.value = res
    // 시작교시에 맞춰서 종료교시 범위를 설정
    setEndTimes(true)
  } else {
    startTimes.value = noneTimes.value
    setEndTimes(false)
  }
}

// target와 요일이 바뀌면 교시 정보 갱신
watch(
  () => putData.value.data.day,
  async (newDay, oldDay) => {
    // 수정상태 확인
    if (newDay) {
      if (oldDay == null) {
        // 새로 수정 -> 요일 저장
        putDay.value = newDay
      } else {
        // 요일 확인후 교시 등록
        if (newDay != putDay.value) await setTime()
        else {
          startTimes.value = putDayNoneTimes.value
          setEndTimes(true)
        }
      }
    }
  },
)

// 교시 입력을 받으면 필터링
watch(
  () => putData.value.data.start_period,
  async (newS, oldS) => {
    // 수정상태 확인
    if (newS) {
      if (oldS == null) {
        // 새로 수정 -> 교시 초기화
        await setTime(putData.value.data.start_period, putData.value.data.end_period)
      }
      // endTimes 설정
      else {
        if (putData.value.data.day == putDay.value) setEndTimes(true)
        else setEndTimes(false)
      }
    }
  },
)

// 종료 교시 범위 제한
const setEndTimes = (isPutDay) => {
  // 원본 수정일과 동일하면 isPutDay = true
  const times = isPutDay ? putDayNoneTimes.value : noneTimes.value
  // endTimes를 시작교시 이후 연속되는 교시
  for (let idx = 0; times.length > idx; idx++) {
    if (times[idx] == putData.value.data.start_period) {
      let end = 0
      for (let i = idx; times.length > i; i++) {
        if (Number(times[i]) + 1 != Number(times[i + 1])) {
          end = i + 1
          break
        }
      }
      endTimes.value = times.slice(idx, end)
      break
    }
  }
}

// ================================= 등록 =================================
const handleSubmit = async () => {
  if (confirm('정말 수정하시겠습니까?')) {
    if (putData.value.timetable_ids.length == 0) {
      await putCourse(putData.value)
    } else {
      await putTimetable(putData.value)
    }
  }
  // 초기화
  putData.value = resetPutData()
  await setCourses()
  await Tstore.setTimetable()
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
    await Tstore.setTimetable()
  }
}
const handleTimetableDel = async (schedule_ids) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    const res = await delTimetable(schedule_ids)
    console.log(res)
    // 초기화
    await setCourses()
    await Tstore.setTimetable()
  }
}
</script>
