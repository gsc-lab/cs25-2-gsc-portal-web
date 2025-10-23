<script setup>
import { getEvent, delEvent } from '@/api/timetableApi';
import { ref, onMounted, watch } from 'vue'

const eventList = ref(null);        // 휴보강 정보
const target = ref("0");
const events = ref(null);           // target 필터링 휴보강 정보

onMounted(async () => {
  eventList.value = await getEvent();
  events.value = eventList.value
  console.log( "eventList",eventList.value);
})

// ================================= target 감시 =================================
watch(() => target.value, async (newTarget) => {
  if (eventList.value == null) {
    eventList.value = await getEvent();
  }
  if(newTarget == "0") return events.value = eventList.value
  events.value = eventList.value.filter((course) => course.grade_id == newTarget)
  }, { immediate: true })

// =================================================================================================

// 삭제
const handleDel = async (idx) => {
  console.log(idx);
  const res = await delEvent(idx)
  console.log(res);
}
</script>

<template>
  EventView

  <div>
    <input type="radio" id="0" value="0" v-model="target">
    <label for="0">전체</label>

    <input type="radio" id="1" value="1" v-model="target">
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="target">
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="target">
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="target">
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="target">
    <label for="korean">한국어</label>
  </div>

  <table v-if="events != null" style="border-collapse: collapse;">
    <thead>
      <tr>
        <th style="border: 1px solid #000; padding: 10px;">학년</th>
        <th style="border: 1px solid #000; padding: 10px;">휴/보</th>
        <th style="border: 1px solid #000; padding: 10px;">과목</th>
        <th style="border: 1px solid #000; padding: 10px;">날짜</th>
        <th style="border: 1px solid #000; padding: 10px;">시작 시간</th>
        <th style="border: 1px solid #000; padding: 10px;">종료 시간</th>
        <th style="border: 1px solid #000; padding: 10px;">삭제</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event, idx in events">
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ event.grade_name }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ event.event_status == "CANCEL" ? "휴강" : "보강" }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ event.course_title }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ event.event_date }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ event.start_time }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">{{ event.end_time }}</td>
        <td style="border: 1px solid #000; padding: 10px; user-select: none;">
          <button @click="handleDel(idx)">삭제</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
