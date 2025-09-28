<script setup>
import { getTimetable } from '@/api/Data';
import { ref } from 'vue';

const selectGrade = ref("1");
const timetableData = getTimetable();
// 초기화
const isSelecting = ref(false);
// 선택 데이터 [{day : 요일, hour: 교시, val: 시간표 데이터}, ...]
const selectionData = ref([]);

// 반환 설정
const emit = defineEmits(["setRange"]);

const day = (enDay) => {
  if (enDay == "MON") return "월요일"
  else if (enDay == "TUE") return "화요일"
  else if (enDay == "WED") return "수요일"
  else if (enDay == "THU") return "목요일"
  else return "금요일"
}
// 선택 시작
function startSelection(day, hour, val) {
  isSelecting.value = true;
  selectionData.value.push({ grade: selectGrade.value, day, hour, val });
  // console.log(selectionData.value);
}

// 선택 범위 업데이트 (드래그 중)
function updateSelection(day, hour, val) {
  if (isSelecting.value) {
    // 이미 등록되어있는 값과 새로 선택된 값 비교
  //   console.log(
  //     "같은 시간",selectionData.value.filter((data) =>
  //     data.hour == hour),
  //     "다른 요일", selectionData.value.filter((data) =>
  //       data.day != day),
  //     "다른 과목", selectionData.value.filter((data) =>
  //     data.val?.course_id == val?.course_id)
    // );

    // 같은 시간이거나 다른 요일이거나 다른 과목이면 안됨
    if ((selectionData.value.filter((data) =>
      data.hour == hour || data.day != day ||
      data.val?.course_id != val?.course_id)).length <= 0) {
      selectionData.value.push({ grade: selectGrade.value, day, hour, val });
    }
  }
}

// 선택 완료
function endSelection() {
  if (isSelecting.value) {
    isSelecting.value = false;
    // 반환
    emit("setRange", selectionData.value);
    selectionData.value = [];
  }
}

</script>

<template>
  <div style="background-color: cornflowerblue;">
    TimeTable

    <div>
      <select v-model="selectGrade">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
    </div>

  <table style="border-collapse: collapse; width: 100%;">
    <thead>
        <th style="border: 1px solid #000; padding: 10px;"></th>
        <!-- 요일 -->
        <th v-for = "(_, idx) in timetableData" style="border: 1px solid #000; padding: 10px;">{{day(idx)}}</th>
    </thead>
    <tbody>
      <!-- 교시 1 ~ 12 : hour -->
        <tr v-for="hour in Object.keys(timetableData['MON']).length" :key="String(hour)">
          <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ hour }}</td>
          <!-- 각 주 데이터 day: MON,TUE... -->
          <td v-for="(data, day) in timetableData"
            :key="day"
            @mousedown="startSelection(day, hour, data[String(hour)])"
            @mouseover="updateSelection(day, hour, data[String(hour)])"
            @mouseup="endSelection"
            style="border: 1px solid #000; padding: 10px; user-select: none;">
              <p>{{ data[String(hour)]?.title}}</p>      <!-- 강의명 ("MON"["1"].title)-->
              <p>{{ data[String(hour)]?.room}}</p>       <!-- 교실 -->
              <p>{{ data[String(hour)]?.professor}}</p>  <!-- 교수명 -->
            </td>
        </tr>
    </tbody>
  </table>

  </div>
</template>
