<script setup>
import { getEvent } from '@/api/timetableApi';
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
  console.log("eventList.value", eventList.value);
  if (eventList.value == null) {
    eventList.value = await getEvent();
  }
  if(newTarget == "0") events.value = eventList.value
  events.value = eventList.value.filter((course) => course.grade_id == newTarget)
  }, { immediate: true })

// =================================================================================================
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

  <table v-if="events != null">
    <thead>
      <tr>
        <th>학년</th>
        <th>휴/보</th>
        <th>과목</th>
        <th>날짜</th>
        <th>시작 시간</th>
        <th>종료 시간</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in events">
        <td>{{ event.grade_name }}</td>
        <td>{{ event.event_status == "CANCEL" ? "휴강" : "보강" }}</td>
        <td>{{ event.course_title }}</td>
        <td>{{ event.event_date }}</td>
        <td>{{ event.start_time }}</td>
        <td>{{ event.end_time }}</td>
      </tr>
    </tbody>
  </table>
</template>
