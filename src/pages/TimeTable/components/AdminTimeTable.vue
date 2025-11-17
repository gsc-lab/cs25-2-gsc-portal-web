<script setup>
import { ref, watch } from 'vue'
import { setTarget, day } from '@/utils/reName'
import { useTimetableStore } from '@/stores/timetable'

const Tstore = useTimetableStore()

//  학년에 맞는 시간표 조회 ====================================
const timetableData = ref(null)
const today = new Date('2025-06-05') // 오늘
const today_day = today.getDay() // 오늘의 요일 (일요일=0)
const selectDate = ref(today)

// 주 변경시 시간표 데이터 갱신
watch(
  () => selectDate.value,
  async () => {
    // console.log("selectDate", selectDate.value);
    await Tstore.setTimetable(selectDate.value.toISOString().split('T')[0])
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

// 선택 데이터 [{day : 요일, hour: 교시, val: 시간표 데이터}, ...]
const selectionData = ref([])

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

// ===================================== 선택 =====================================
// 선택 시작
function startSelection(grade, idx, day, hour, schedule) {
  // 선택한 날짜 계산
  const searchedDate = searchDate(idx)
  // console.log("searchedDate", searchedDate);

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
    emit('setRange', selectionData.value)
    selectionData.value = []
  }
}
// ===================================================================================
</script>

<template>
  <div style="background-color: aliceblue">
    TimeTable

    <div>
      <button @click="handleBefore">지난주</button>
      <p>{{ selectDate.toISOString().split('T')[0] }}</p>
      <button @click="handleAfter">다음주</button>
    </div>

    <table style="border-collapse: collapse; width: 100%">
      <thead>
        <!-- 요일 -->
        <tr>
          <th style="border: 1px solid #000; padding: 10px"></th>
          <th
            v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI']"
            :key="idx"
            colspan="5"
            style="border: 1px solid #000; padding: 10px"
          >
            {{ day(d) }} ({{ searchDate(idx + 1).slice(5) }})
          </th>
        </tr>
        <!-- 학년 * 5 -->
        <tr>
          <th style="border: 1px solid #000; padding: 10px"></th>
          <template v-for="_ in 5" :key="_">
            <th
              v-for="g in ['1', '2', '3', 'special', 'korean']"
              :key="g"
              style="border: 1px solid #000; padding: 10px"
            >
              {{ setTarget(String(g)) }}
            </th>
          </template>
        </tr>
      </thead>

      <tbody>
        <!-- 교시 1 ~ 12 : hour -->
        <tr v-for="hour in 12" :key="hour">
          <!-- 교시 -->
          <td style="border: 1px solid #000; padding: 10px; user-select: none">
            {{ hour }}교시
            <p>{{ hour + 8 }}:00~</p>
          </td>
          <!-- day -->
          <template v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI']" :key="idx">
            <!-- 학년 -->
            <td
              v-for="g in ['1', '2', '3', 'special', 'korean']"
              :key="g"
              @mousedown="
                timetableData?.[g]?.[d][String(hour)].length > 1 ||
                timetableData?.[g]?.[d][String(hour)][0]?.event?.status == 'CANCEL'
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
                timetableData?.[g]?.[d][String(hour)][0]?.event?.status == 'CANCEL'
                  ? updateSelection(g, d, hour)
                  : updateSelection(g, d, hour, timetableData?.[String(g)][d][String(hour)][0])
              "
              @mouseup="endSelection"
              style="border: 1px solid #000; padding: 10px; user-select: none"
            >
              <!-- timetableData?.[String(g)][d][String(hour)] 에 여러개 있으면 과복 데이터 저장 안함  -->
              <!-- 과목 / 교수 / 장소 -->
              <!-- {{g}} -->
              <div
                v-for="schedule in timetableData?.[g]?.[d][String(hour)]"
                :key="schedule"
                :style="
                  timetableData?.[g]?.[d][String(hour)][0]?.event?.status === 'CANCEL'
                    ? { backgroundColor: 'red' }
                    : timetableData?.[g]?.[d][String(hour)][0]?.event?.status === 'MAKEUP'
                      ? { backgroundColor: 'white' }
                      : { backgroundColor: 'blue', margin: '2px' }
                "
              >
                <p>{{ schedule?.title }}</p>
                <p v-if="schedule?.students">
                  {{ schedule?.students }}
                </p>
                <p>{{ schedule?.professor }}</p>
                <p>{{ schedule?.room }}</p>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
