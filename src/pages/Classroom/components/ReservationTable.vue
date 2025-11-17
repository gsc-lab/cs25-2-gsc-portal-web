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

<template>
  <div>
    <button @click="handleBefore">지난주</button>
    <p>{{ selectDate.toISOString().split('T')[0] }}</p>
    <button @click="handleAfter">다음주</button>
  </div>

  <table style="border-collapse: collapse; width: 100%">
    <thead>
      <tr>
        <th style="border: 1px solid #000; padding: 10px"></th>
        <th
          v-for="(d, idx) in ['일', '월', '화', '수', '목', '금', '토']"
          :key="d"
          style="border: 1px solid #000; padding: 10px"
        >
          {{ d }}요일({{ searchDate(idx + 1).slice(5) }})
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(_, t) in 24" :key="t">
        <td style="border: 1px solid #000; padding: 10px">{{ time(t) }}</td>
        <template v-for="(d, idx) in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="d">
          <td
            style="border: 1px solid #000; padding: 10px"
            @mousedown="startSelection(filterRes(selectRes?.[d], time(t)), t, idx)"
            @mouseover="updateSelection(filterRes(selectRes?.[d], time(t)), t, idx)"
            @mouseup="endSelection"
          >
            <p>
              {{ filterRes(selectRes?.[d], time(t))?.user }}
            </p>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
