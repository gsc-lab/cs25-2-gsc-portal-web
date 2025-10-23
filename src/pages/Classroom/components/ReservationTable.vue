<script setup>

const selectRes = defineModel()

const day = (enDay) => {
  if (enDay == "SUN") return "일요일"
  else if (enDay == "MON") return "월요일"
  else if (enDay == "TUE") return "화요일"
  else if (enDay == "WED") return "수요일"
  else if (enDay == "THU") return "목요일"
  else if (enDay == "FRI") return "금요일"
  else if (enDay == "SAT") return "토요일"
}
const time = (t) => {
  if (t < 10) return `0${t}:00:00`
  return `${t}:00:00`
}

const filterRes = (res) => {
  console.log("res", res);
  const result = res.filter((r) => r.start == t)
  console.log(result);
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
        <template v-for="(d, idx) in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="idx">
            <td style="border: 1px solid #000; padding: 10px;">
              <p>{{selectRes?.[d]}}</p>
            </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
