<template>
  <div>
    <!-- Week Navigation -->
    <div class="flex items-center justify-center gap-4 mb-6">
      <button @click="handleBefore" class="px-3 py-1 bg-white border border-gray-200 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        지난주
      </button>
      <p class="font-semibold text-text-heading text-lg">{{ selectDate.toISOString().split('T')[0] }}</p>
      <button @click="handleAfter" class="px-3 py-1 bg-white border border-gray-200 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
        다음주
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <!-- Reservation Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-300 shadow-subtle bg-bg-paper">
      <table class="w-full border-collapse min-w-full">
        <thead>
          <tr>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-300 text-center sticky left-0 z-10 w-20"></th>
            <th
              v-for="(d, idx) in ['월', '화', '수', '목', '금', '토', '일']"
              :key="d"
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-300 text-center"
            >
              {{ d }}요일({{ searchDate(idx + 1).slice(5) }})
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(_, t) in 24" :key="t" class="hover:bg-gray-50">
            <td class="bg-gray-50 text-text-muted font-semibold text-sm py-2 px-3 border border-gray-300 text-center sticky left-0 z-10 w-20">{{ time(t) }}</td>
            <template v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']" :key="d">
              <td
                class="text-sm py-2 px-3 border border-gray-300 text-center relative"
                :class="{
                  'bg-blue-100 text-blue-800 font-semibold': filterRes(selectRes?.[d], time(t))?.user_id === Ustore.userInfo.user_id,
                  'bg-red-100 text-red-800': filterRes(selectRes?.[d], time(t))?.user_id && filterRes(selectRes?.[d], time(t))?.user_id !== Ustore.userInfo.user_id,
                  'bg-gray-200': isSelecting && selectTime.date === searchDate(idx + 1) && ((time(t) >= selectTime.start_time && time(t) < selectTime.end_time) || (time(t) < selectTime.start_time && time(t) >= selectTime.end_time)), // Visual feedback for selection
                }"
                @mousedown="startSelection(filterRes(selectRes?.[d], time(t)), t, idx)"
                @mouseover="updateSelection(filterRes(selectRes?.[d], time(t)), t, idx)"
                @mouseup="endSelection"
              >
                <p class="text-xs font-medium">
                  {{ filterRes(selectRes?.[d], time(t))?.user }}
                </p>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useClassroomStore } from '@/stores/classroom'
import { time } from '@/utils/time'
import { useUserStore } from '@/stores/user'
import { deleteReservation, postReservation } from '@/api/classroomApi'
const Ustore = useUserStore()

const CRstore = useClassroomStore()
const selectRes = ref(null) // 선택한 강의실 예약 데이터 (배열순: 일->토 )

const isSelecting = ref(false)

// 날짜
const today = new Date()
const today_day = today.getDay()
const selectDate = ref(today)

const selectTime = ref(resetTime())
function resetTime() {
  return {
    date: null,
    start_time: null,
    end_time: null,
  }
}

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

// selectResSchedule 감시
watch(
  () => CRstore.selectResSchedule,
  async (newCR, oldCR) => {
    if (newCR && newCR !== oldCR) {
      selectRes.value = CRstore.selectResSchedule
    }
  },
  { immediate: true },
)

// selectDate 감시
watch(
  () => selectDate.value,
  async () => {
    // console.log('selectDate.value', selectDate.value)
    selectRes.value = CRstore.getSelectResSchedule(selectDate.value.toISOString().split('T')[0])
  },
)

const filterRes = (res, t) => {
  // 객체가 없거나 내용이 없으면 반환
  if (!res || Object.keys(res).length == 0) return null
  // console.log("res", res);
  // 임자값시간이 해당 요일의 예약의 시간 범위안에 있는 항목 찾기
  const result = Object.keys(res).filter((r) => res[r].start <= t && res[r].end > t)
  // 없으면 반환
  if (result.length == 0) return null
  else {
    // 있으면 해당 내용 저장후 예약자 이름 반환
    return res[result]
  }
}

// =================  시간 선택  ======================
// 선택 시작
function startSelection(data, t, idxOfDay) {
  if (data?.user_id == Ustore.userInfo.user_id) {
    handleDelete(data)
  } else if (data?.user_id == null) {
    selectTime.value.date = searchDate(idxOfDay + 1)
    selectTime.value.start_time = t
    isSelecting.value = true
  }
}
// 업데이트
function updateSelection(data, t, idxOfDay) {
  if (isSelecting.value) {
    console.log(data?.user_id)
    if (data?.user_id != null || selectTime.value.date != searchDate(idxOfDay + 1)) endSelection()
    // 추가되는 값이 더 크면 [1] 작으면 [0]  (시간은 end에 +1)
    if (selectTime.value.start_time + 1 <= t) selectTime.value.end_time = t + 1
    else {
      selectTime.value.end_time = selectTime.value.start_time + 1
      selectTime.value.start_time = t
    }
  }
}
// 선택 종료
async function endSelection() {
  if (isSelecting.value) {
    isSelecting.value = false
    console.log('selectTime.value', selectTime.value)
    // 만약에 한시간만 선택하면 end시간 정의
    if (selectTime.value.end_time == null) {
      selectTime.value.end_time = selectTime.value.start_time + 1
    }
    // 00:00:00형식으로 변환
    selectTime.value.start_time = time(selectTime.value.start_time)
    selectTime.value.end_time = time(selectTime.value.end_time)

    // 예약
    handleSubmit()
  }
}

// =======================  저장  ==========================
const handleSubmit = async () => {
  if (
    confirm(
      selectTime.value.date +
        ' : ' +
        selectTime.value.start_time +
        ' ~ ' +
        selectTime.value.end_time +
        '예약합니다.',
    )
  ) {
    const res = await postReservation(CRstore.selectCR, selectTime.value)
    alert(res.message)
    await CRstore.setSelectResSchedule()
  }
}

// =======================  삭제  ==========================
const handleDelete = async (data) => {
  if (confirm(data.date + ' : ' + data.start + ' ~ ' + data.end + '예약을 삭제 합니다.')) {
    await deleteReservation(CRstore.selectCR, data.id)
    await CRstore.setSelectResSchedule()
  }
}
</script>
