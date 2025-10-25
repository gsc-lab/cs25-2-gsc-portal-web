<script setup>
import {ref, watch} from 'vue'
import { useClassroomStore } from '@/stores/classroom'
import {time} from '@/util/time'
const CRstore = useClassroomStore()
const selectRes = ref(null)  // 선택한 강의실 예약 데이터 (배열순: 일->토  / 날짜순: 월->일 )

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
        <template v-for="d in ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT','SUN']" :key="d">
            <td style="border: 1px solid #000; padding: 10px;">
              <p>
                {{filterRes(selectRes?.[d], time(t))}}
              </p>
            </td>
        </template>
      </tr>

    </tbody>
  </table>
</template>
