<script setup>
import { ref, watch } from 'vue'
import { day } from '@/utils/reName'
import { useTimetableStore } from '@/stores/timetable'

const Tstore = useTimetableStore()

//  시간표 조회 ====================================
const timetableData = ref(null)
const today = new Date('2025-06-05') // 오늘
const today_day = today.getDay() // 오늘의 요일 (일요일=0)
const selectDate = ref(today)

// 주 변경시 시간표 데이터 갱신
watch(
  () => selectDate.value,
  async () => {
    timetableData.value = await Tstore.getStdTimetable(selectDate.value.toISOString().split('T')[0])
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
</script>

<template>
  <div style="background-color: aliceblue">
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
            style="border: 1px solid #000; padding: 10px"
          >
            {{ day(d) }} ({{ searchDate(idx + 1).slice(5) }})
          </th>
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
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <div
                v-for="schedule in timetableData?.[d][String(hour)]"
                :key="schedule"
                :style="
                  timetableData?.[d][String(hour)][0]?.event?.status === 'CANCEL'
                    ? { backgroundColor: 'red' }
                    : timetableData?.[d][String(hour)][0]?.event?.status === 'MAKEUP'
                      ? { backgroundColor: 'white' }
                      : { backgroundColor: 'blue', margin: '2px' }
                "
              >
                <p>{{ schedule?.title }}</p>
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
