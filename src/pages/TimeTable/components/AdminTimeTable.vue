<template>
  <div class="bg-gray-100 rounded-card shadow-subtle p-6 border border-gray-300">
    <h3 class="text-xl font-bold text-text-heading mb-4">관리자 시간표</h3>

    <!-- Grade Filter Buttons -->
    <div class="flex gap-2 mb-4 flex-nowrap overflow-x-auto sm:text-xs sm:gap-1">
      <button
        v-for="g in ['1', '2', '3', 'special', 'korean']"
        :key="g"
        @click="handleSelect(g)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm border',
          targets[g]
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-text-muted border-gray-300 hover:bg-gray-100',
        ]"
      >
        <span class="whitespace-nowrap">{{ setTarget(String(g)) }}</span>
      </button>
    </div>

    <div class="flex items-center space-x-3 mb-4">
      <span class="text-base font-medium text-text-heading">모드 설정 : </span>
      <span class="text-base font-medium text-text-heading">시간표</span>

      <button
        @click="isEventMode = !isEventMode"
        :class="[
          'relative inline-flex flex-shrink-0 h-7 w-14 border-4 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ',
          isEventMode ? 'bg-primary' : 'bg-sky-500/50',
        ]"
        role="switch"
        :aria-checked="isEventMode.toString()"
      >
      <span
          :class="[
            'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            isEventMode ? 'translate-x-7' : 'translate-x-0',
          ]"
        >
          <span
            :class="[
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ease-in-out duration-200',
              isEventMode ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            ]"
            aria-hidden="true"
          ></span>
          <span
            :class="[
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ease-in-out duration-200',
              isEventMode ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            ]"
            aria-hidden="true"
          ></span>
        </span>
      </button>
      <span class="text-base font-medium text-text-heading">휴보강</span>
    </div>

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
            <!-- Days of the week -->
            <tr>
              <th
                class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-400 sticky left-0 z-10 w-16"
              ></th>
              <th
                v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI']"
                :key="idx"
                :colspan="selectTargets.length"
                class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-400"
              >
                {{ day(d) }} ({{ searchDate(idx + 1).slice(5) }})
                <!-- 공휴일 -->
                <p v-if="timetableData?.[1]?.[d]?.isHoliday">
                  {{ timetableData?.[1]?.[d]?.holidayName }}
                </p>
              </th>
            </tr>
            <!-- Grades/Targets for each day -->
            <tr>
              <th
                class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-400 sticky left-0 z-10 w-16"
              ></th>
              <template v-for="_ in 5" :key="_">
                <th
                  v-for="g in selectTargets"
                  :key="g"
                  class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-400"
                >
                  {{ setTarget(String(g)) }}
                </th>
              </template>
            </tr>
          </thead>

          <tbody>
            <!-- Periods 1 to 12 -->
            <tr v-for="hour in 12" :key="hour">
              <!-- Period Cell -->
              <td
                class="bg-gray-50 text-text-muted font-semibold text-sm py-2 px-3 border border-gray-400 sticky left-0 z-10 w-16 user-select-none"
              >
                {{ hour }}교시
                <p class="text-xs text-gray-700 mt-1">{{ hour + 8 }}:00~</p>
              </td>
              <!-- Day and Grade Cells -->
              <template v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI']" :key="idx">
                <td
                  v-for="g in selectTargets"
                  :key="g"
                  @mousedown="
                    timetableData?.[g]?.[d][String(hour)].length > 1 ||
                    timetableData?.[g]?.[d][String(hour)][0]?.event?.status == 'CANCEL' ||
                    timetableData?.[g]?.[d][String(hour)][0]?.event?.status == 'MAKEUP'
                      ? startSelection(g, idx + 1, d, hour)
                      : startSelection(
                          g,
                          idx + 1,
                          d,
                          hour,
                          timetableData?.[String(g)][d][String(hour)][0],
                        )
                  "
                  @mouseover="
                    timetableData?.[g]?.[d][String(hour)].length > 1 ||
                    timetableData?.[g]?.[d][String(hour)][0]?.event?.status == 'CANCEL' ||
                    timetableData?.[g]?.[d][String(hour)][0]?.event?.status == 'MAKEUP'
                      ? updateSelection(g, d, hour)
                      : updateSelection(g, d, hour, timetableData?.[String(g)][d][String(hour)][0])
                  "
                  @mouseup="endSelection"
                  class="border border-gray-400 py-1 px-1 text-center relative user-select-none"
                  :class="{ 'bg-pink-200': isSelecting && isSelectedCell(g, d, hour) }"
                >
                  <div
                    v-for="schedule in timetableData?.[g]?.[d][String(hour)]"
                    :key="schedule"
                    :class="[
                      'p-0.5 my-0.5 rounded-sm',
                      timetableData?.[g]?.[d][String(hour)][0]?.event?.status === 'CANCEL'
                        ? 'bg-red-500 text-white'
                        : timetableData?.[g]?.[d][String(hour)][0]?.event?.status === 'MAKEUP'
                          ? 'bg-white border border-gray-300 text-text-base'
                          : getSubjectColor(schedule?.subject_id || schedule?.title),
                    ]"
                  >
                    <p class="text-xs font-semibold">{{ schedule?.title }}</p>
                    <p v-if="schedule?.students" class="text-xs">{{ schedule?.students }}</p>
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
import { ref, reactive, watch, computed } from 'vue'
import { setTarget, day } from '@/utils/reName'
import { useTimetableStore } from '@/stores/timetable'

const Tstore = useTimetableStore()

//  학년에 맞는 시간표 조회 ====================================
const timetableData = ref(null)
const today = new Date('2025-06-05') // 오늘
const today_day = today.getDay() // 오늘의 요일 (일요일=0)
const selectDate = ref(null)
// 선택한 target만 보이게
const targets = ref({
  1: true,
  2: false,
  3: false,
  special: false,
  korean: false,
})
const selectTargets = ref(['1'])

// 주 변경시 시간표 데이터 갱신
watch(
  () => selectDate.value,
  async () => {
    if (selectDate.value == null) selectDate.value = Tstore.date ? new Date(Tstore.date) : today
    // console.log("selectDate", selectDate.value);
    await Tstore.setTimetable(selectDate.value.toISOString().split('T')[0])
    await Tstore.setNoneTime()
  },
  { immediate: true },
)

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
  // console.log("selectDate.value", selectDate.value, "idxOfDay", idxOfDay, "today_day", today_day, "lossDate", lossDate);
  const select = new Date(selectDate.value)
  select.setDate(selectDate.value.getDate() + lossDate)
  return select.toISOString().split('T')[0]
}

// ===================================== 초기화 =====================================
const isSelecting = ref(false)
const isEventMode = ref(false)

// 선택 데이터 [{day : 요일, hour: 교시, val: 시간표 데이터}, ...]
const selectionData = ref([])

const isSelectedCell = computed(() => (grade, day, hour) => {
  return selectionData.value.some(
    (item) => item.grade === grade && item.day === day && item.hour === hour,
  )
})

// 반환 설정
const emit = defineEmits(['setRange'])

// adminTimetable 감시 timetableData 갱신
watch(
  () => Tstore.adminTimetable,
  async (newTimetable) => {
    if (newTimetable) {
      timetableData.value = newTimetable

      // console.log("timetableData", timetableData.value);

      // console.log("1", timetableData.value['1'])
      // console.log("2", timetableData.value['2']);
      // console.log("3", timetableData.value['3']);
      // console.log("sp", timetableData.value['special']);
      // console.log("ko", timetableData.value['korean']);
    } else {
      console.log('아직 데이터 없음')
    }
  },
  { immediate: true },
)

// ================================= target 선택 =================================
const handleSelect = (t) => {
  // true/false 설정
  targets.value[t] = !targets.value[t]
  // true인 키 값으로 배열 생성
  const targetsKey = Object.keys(targets.value).filter((target) => targets.value[target])
  // console.log(targetsKey)
  // selectTargets 대입
  selectTargets.value = targetsKey
}

// ===================================== 선택 =====================================
// 선택 시작
function startSelection(grade, idx, day, hour, schedule) {
  // 선택한 날짜 계산
  const searchedDate = searchDate(idx)
  // console.log('searchedDate', searchedDate)

  isSelecting.value = true
  selectionData.value.push({ grade, date: searchedDate, day, hour, schedule })
  // console.log(selectionData.value);
}

// 선택 범위 업데이트 (드래그 중)
function updateSelection(grade, day, hour, schedule) {
  if (isSelecting.value) {
    // 이미 등록되어있는 값과 새로 선택된 값 비교
    // console.log(
    //   "같은 시간",selectionData.value.filter((data) =>
    //   data.hour == hour),
    //   "다른 요일", selectionData.value.filter((data) =>
    //     data.day != day),
    //   "다른 과목", selectionData.value.filter((data) =>
    //   data.schedule?.title != val?.title)
    // );

    // 다른 요일이거나 다른 학년, 다른 과목이면 안됨
    if (
      Object.keys(
        selectionData.value.filter(
          (data) =>
            data.day != day || data.grade != grade || data.schedule?.title != schedule?.title,
        ),
      ).length <= 0
    ) {
      // 같은 시간이면 저장 안함
      if (Object.keys(selectionData.value.filter((d) => d.hour == hour)).length <= 0) {
        selectionData.value.push({ grade, day, hour, schedule })
      }
    } else {
      endSelection()
    }
  }
}

// ===================================== 완료 =====================================
// 선택 완료
function endSelection() {
  if (isSelecting.value) {
    isSelecting.value = false
    // 반환
    emit('setRange', selectionData.value, isEventMode.value)
    selectionData.value = []
  }
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
