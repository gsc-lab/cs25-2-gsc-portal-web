<template>
  <div class="bg-gray-100 rounded-card shadow-subtle p-6 border border-gray-300">
    <h3 class="text-xl font-bold text-text-heading mb-4">내 시간표</h3>

    <!-- Week Navigation -->
    <div class="flex items-center justify-between mb-4">
      <button
        @click="handleBefore"
        class="px-4 py-2 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 inline-block mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        지난주
      </button>
      <p class="text-lg font-semibold text-text-heading">
        {{ selectDate.toISOString().split('T')[0] }}
      </p>
      <button
        @click="handleAfter"
        class="px-4 py-2 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm"
      >
        다음주
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 inline-block ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Timetable Table -->
    <div class="rounded-lg overflow-hidden border border-gray-300 mt-4">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th
                class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-400 sticky left-0 z-10 w-16"
              ></th>
              <th
                v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI']"
                :key="idx"
                class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-400"
              >
                {{ day(d) }} ({{ searchDate(idx + 1).slice(5) }})
                <!-- 공휴일 -->
                <p v-if="timetableData?.[1]?.[d]?.isHoliday">
                  {{ timetableData?.[d]?.holidayName }}
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in 12" :key="hour">
              <td
                class="bg-gray-50 text-text-muted font-semibold text-sm py-2 px-3 border border-gray-400 sticky left-0 z-10 w-16"
              >
                {{ hour }}교시
                <p class="text-xs text-gray-700 mt-1">{{ hour + 8 }}:00~</p>
              </td>
              <template v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI']" :key="idx">
                <td class="border border-gray-400 py-1 px-1 text-center relative">
                  <div
                    v-for="schedule in timetableData?.[d][String(hour)]"
                    :key="schedule"
                    :class="[
                      'p-0.5 my-0.5 rounded-sm',
                      timetableData?.[d][String(hour)][0]?.event?.status === 'CANCEL'
                        ? 'bg-red-500 text-white'
                        : timetableData?.[d][String(hour)][0]?.event?.status === 'MAKEUP'
                          ? 'bg-white border border-gray-300 text-text-base'
                          : getSubjectColor(schedule?.course_id || schedule?.title),
                    ]"
                  >
                    <p class="text-xs font-semibold">{{ schedule?.title }}</p>
                    <p class="text-xs">{{ schedule?.professor }}</p>
                    <p class="text-xs">{{ schedule?.room }}</p>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { day } from '@/utils/reName'
import { useTimetableStore } from '@/stores/timetable'
import { getStudentTimetable } from '@/api/timetableApi'

const Tstore = useTimetableStore()

//  시간표 조회 ====================================
const timetableData = ref(null)
const today = new Date() // 오늘
const today_day = today.getDay() // 오늘의 요일 (일요일=0)
const selectDate = ref(null)

const professorTT = defineModel()

// 주 변경시 시간표 데이터 갱신
watch(
  () => selectDate.value,
  async () => {
    if (selectDate.value == null) selectDate.value = Tstore.date ? new Date(Tstore.date) : today
    if (professorTT.value) {
      timetableData.value = await Tstore.getPfsTimetable(
        selectDate.value.toISOString().split('T')[0],
      )
    } else {
      timetableData.value = await getStudentTimetable(selectDate.value.toISOString().split('T')[0])
    }
  },
  { immediate: true },
)

// ======================  기간 선택  ======================
// 지난주
const handleBefore = () => {
  selectDate.value = new Date(selectDate.value.setDate(selectDate.value.getDate() - 7))
}
// 다음주
const handleAfter = () => {
  selectDate.value = new Date(selectDate.value.setDate(selectDate.value.getDate() + 7))
}
// 선택 날짜 계산
const searchDate = (idxOfDay) => {
  const lossDate = idxOfDay - today_day
  const select = new Date(selectDate.value)
  select.setDate(selectDate.value.getDate() + lossDate)
  return select.toISOString().split('T')[0]
}

// ===================================================================================
// 과목별 색 지정
const colors = [
  'bg-blue-300',
  'bg-green-300',
  'bg-yellow-300',
  'bg-purple-300',
  'bg-pink-300',
  'bg-orange-300',
  'bg-teal-300',
  'bg-indigo-300',
]
const subjectColorMap = reactive({})
function getSubjectColor(subjectKey) {
  if (!subjectKey) return 'bg-gray-300'

  if (!subjectColorMap[subjectKey]) {
    const index = Object.keys(subjectColorMap).length % colors.length
    subjectColorMap[subjectKey] = colors[index]
  }

  return subjectColorMap[subjectKey]
}
</script>
