<script setup>
import { ref } from 'vue'
import {time} from '@/util/time'

const selectRes = defineModel()
const val = ref(null)

const day = (enDay) => {
  if (enDay == "SUN") return "일요일"
  else if (enDay == "MON") return "월요일"
  else if (enDay == "TUE") return "화요일"
  else if (enDay == "WED") return "수요일"
  else if (enDay == "THU") return "목요일"
  else if (enDay == "FRI") return "금요일"
  else if (enDay == "SAT") return "토요일"
}

const filterRes = (res, t) => {
  // console.log("res", typeof(res));
  // 객체가 없거나 내용이 없으면 반환
   if(!res || Object.keys(res).length == 0) return ""
  // console.log("res", res);
  // 해당 요일의 예약의 시간과 임자값의 시간이 일치하는 항목 찾기
  const result = Object.keys(res).filter((r) => res[r].start == t)
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
        <th v-for="(_, idx) in selectRes" style="border: 1px solid #000; padding: 10px;">{{ day(idx) }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="t in 24">
        <td style="border: 1px solid #000; padding: 10px;">{{time(t)}}</td>
        <template v-for="d in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="d">
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
