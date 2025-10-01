<script setup>
import { getTimetable } from '@/api/timetableApi.js';
import { ref, watch, onMounted } from 'vue';
import { useProfessorStore } from '@/stores/auth';

// =================== 교수 명담 조회 =======================
const PFstore = useProfessorStore();
let professors = PFstore.professors;
onMounted(async () => {
  if (PFstore.professors.length <= 0) {
    await PFstore.setProfessors();
  }
  professors.value = PFstore.professors;
  console.log("professors", professors.value);
});

//  학년에 맞는 시간표 조회 ====================================
const selectGrade = ref("1");
const timetableData = ref(null);

watch(() => selectGrade.value, async (newGrade) => {
  timetableData.value = await getTimetable();
  console.log(Object.keys(timetableData.value['MON']).length);
}, { immediate: true })

// 초기화 ===================================================
const isSelecting = ref(false);

// 선택 데이터 [{day : 요일, hour: 교시, val: 시간표 데이터}, ...]
const selectionData = ref([]);

// 반환 설정
const emit = defineEmits(["setRange"]);

//  요일 변환
const day = (enDay) => {
  if (enDay == "MON") return "월요일"
  else if (enDay == "TUE") return "화요일"
  else if (enDay == "WED") return "수요일"
  else if (enDay == "THU") return "목요일"
  else return "금요일"
}

// ===================================================================================
// 선택 시작
function startSelection(day, hour, val) {
  const schedule = ref(null);
  console.log(val.length);
  if (Object.keys(val).length > 0) {
    schedule.value = { ...val }
    // 교수 이름을 Id로 변환
    const professorId = PFstore.searchProfessorsId(schedule.value.professor)
    // console.log(professorId);
    schedule.value.professor = professorId
  }
  isSelecting.value = true;
  selectionData.value.push({ grade: selectGrade.value, day, hour, schedule: schedule.value });
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
    if (Object.keys((selectionData.value.filter((data) =>
      data.hour == hour || data.day != day ||
      data.schedule?.course_id != val?.course_id))).length <= 0
    ){
      const schedule = ref(null)
      if (Object.keys(val).length > 0) {
        schedule.value ={ ...val }
        // 교수 이름을 Id로 변환
        const professorId = PFstore.searchProfessorsId(schedule.value.professor)
        // console.log(professorId);
        schedule.value.professor = professorId
      }
      selectionData.value.push({ grade: selectGrade.value, day, hour, schedule: schedule.value });
    } else {
      endSelection()
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
// ===================================================================================
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
        <tr v-for="hour in 12" :key="hour">
          <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ hour }}</td>
          <!-- 각 주 데이터 day: MON,TUE... -->
          <td v-for="(data, day) in timetableData"
            :key="day"
            @mousedown="startSelection(day, hour, data[String(hour)])"
            @mouseover="updateSelection(day, hour, data[String(hour)])"
            @mouseup="endSelection"
            style="border: 1px solid #000; padding: 10px; user-select: none;">
              <p v-if="data[String(hour)]?.event">{{ data[String(hour)]?.event }}</p>
              <p>{{ data[String(hour)]?.title}}</p>      <!-- 강의명 ("MON"["1"].title)-->
              <p>{{ data[String(hour)]?.room}}</p>       <!-- 교실 -->
              <p>{{ data[String(hour)]?.professor}}</p>  <!-- 교수명 -->
            </td>
        </tr>
    </tbody>
  </table>

  </div>
</template>
