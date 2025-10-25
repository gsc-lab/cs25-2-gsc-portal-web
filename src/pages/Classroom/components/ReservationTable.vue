<script setup>
import {ref, watch} from 'vue'
import { useClassroomStore } from '@/stores/classroom'
import { time, getWeekDates } from '@/util/time'

const CRstore = useClassroomStore()
const selectRes = ref(null)  // 선택한 강의실 예약 데이터 (배열순: 일->토  / 날짜순: 월->일 )

const selectTime = ref([])
const isSelecting = ref(false)
const isOpen = defineModel()
const weekDates = getWeekDates('2025-10-18')

// selectResSchedule 감시
watch(() => CRstore.selectResSchedule,
  async (newCR, oldCR) => {
    if (newCR && newCR !== oldCR) {
      selectRes.value = await CRstore.selectResSchedule
    }
  }, { immediate: true }
)

const filterRes = (res, t) => {
  // console.log("res", typeof(res));
  // 객체가 없거나 내용이 없으면 반환
  if(!res || Object.keys(res).length == 0) return ""
  // console.log("res", res);
  // 임자값시간이 해당 요일의 예약의 시간 범위안에 있는 항목 찾기
  const result = Object.keys(res).filter((r) => res[r].start <= t && res[r].end > t)
  // 없으면 반환
  if (result.length == 0) return ""
  else {
    // console.log("re", res[Number(result[0])]);
    // 있으면 해당 내용 저장후 예약자 이름 반환
    return res[Number(result[0])].user
  }
}

// =================  시간 선택  ======================
// 선택 시작
function startSelection(user, t, idxOfDay) {
  if (user != "") return
  selectTime.value[0] = idxOfDay
  selectTime.value[1] = t
  isSelecting.value = true
}
// 업데이트
function updateSelection(user, t, idxOfDay) {
  if (isSelecting.value) {
    if (user != "" || selectTime.value[0] != idxOfDay) endSelection()
    // 추가되는 값이 더 크면 [1] 작으면 [0]  (시간은 end에 +1)
    if (selectTime.value[1] + 1 <= t)
      selectTime.value[2] = t + 1
    else {
      selectTime.value[2] = selectTime.value[1] + 1
      selectTime.value[1] = t
    }
  }
}
// 선택 종료
async function endSelection() {
  if (isSelecting.value) {
    isSelecting.value = false
    console.log(selectTime.value);
    // 만약에 한시간만 선택하면 end시간 정의
    if (selectTime.value.length == 2) {
      selectTime.value[2] = selectTime.value[1] + 1
    }
    // 2000-00-00 형식으로 변환
    selectTime.value[0] = weekDates[selectTime.value[0]]
    // 00:00:00형식으로 변환
    selectTime.value[1] = time(selectTime.value[1])
    selectTime.value[2] = time(selectTime.value[2])
    // store에 저장
    await CRstore.setSelectReTime(selectTime.value)
    isOpen.value = true
    // 초기화
    selectTime.value = []
  }
}

</script>

<template>
  <table style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr>
        <th style="border: 1px solid #000; padding: 10px;"></th>
        <th v-for="d in ['월', '화', '수', '목', '금', '토', '일']" style="border: 1px solid #000; padding: 10px;">{{ d }}요일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(_, t) in 24">
        <td style="border: 1px solid #000; padding: 10px;">{{time(t)}}</td>
        <template v-for="(d, idx) in ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT','SUN']" :key="d">
            <td style="border: 1px solid #000; padding: 10px;"
              @mousedown="startSelection(filterRes(selectRes?.[d], time(t)), t, idx)"
              @mouseover="updateSelection(filterRes(selectRes?.[d], time(t)), t, idx)"
              @mouseup="endSelection"
            >
              <p>
                {{filterRes(selectRes?.[d], time(t))}}
              </p>
            </td>
        </template>
      </tr>

    </tbody>
  </table>
</template>
