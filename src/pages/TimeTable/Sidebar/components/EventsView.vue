<script setup>
import { getEvent, delEvent } from '@/api/timetableApi'
import { ref, watch } from 'vue'

const eventList = ref(null) // 휴보강 정보
const target = ref('0')
const events = ref(null) // target 필터링 휴보강 정보

// const selectEvent = ref({
//   schedule_ids: [],

// })

async function setEvents() {
  eventList.value = await getEvent()
  if (target.value == '0') return eventList.value
  return eventList.value.filter((course) => course.cancel.grade_id == target.value)
}

// ================================= target 감시 =================================
watch(
  () => target.value,
  async (newTarget) => {
    if (eventList.value == null) {
      eventList.value = await getEvent()
    }
    if (newTarget == '0') return (events.value = eventList.value)
    events.value = eventList.value.filter((course) => course.cancel.grade_id == newTarget)
  },
  { immediate: true },
)

// ================================= 삭제 =================================
const handleDel = async (event_ids) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    for (const event_id of event_ids) {
      console.log('event_id', event_id)
      const res = await delEvent(event_id)
      console.log(res)
    }
    // 초기화
    events.value = setEvents()
  }
}
</script>

<template>
  EventView

  <div>
    <input type="radio" id="0" value="0" v-model="target" />
    <label for="0">전체</label>

    <input type="radio" id="1" value="1" v-model="target" />
    <label for="1">1학년</label>

    <input type="radio" id="2" value="2" v-model="target" />
    <label for="2">2학년</label>

    <input type="radio" id="3" value="3" v-model="target" />
    <label for="3">3학년</label>

    <input type="radio" id="special" value="special" v-model="target" />
    <label for="special">특강</label>

    <input type="radio" id="korean" value="korean" v-model="target" />
    <label for="korean">한국어</label>
  </div>

  <table v-if="events != null" style="border-collapse: collapse">
    <thead>
      <tr>
        <th style="border: 1px solid #000; padding: 10px">학년</th>
        <th style="border: 1px solid #000; padding: 10px">휴/보</th>
        <th style="border: 1px solid #000; padding: 10px">과목</th>
        <th style="border: 1px solid #000; padding: 10px">날짜</th>
        <th style="border: 1px solid #000; padding: 10px">교시</th>
        <!-- <th style="border: 1px solid #000; padding: 10px">수정</th> -->
        <th style="border: 1px solid #000; padding: 10px">삭제</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(E, idx) in events" :key="idx">
        <template v-for="event in E" :key="event">
          <tr v-if="event">
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              {{ event.event_status == 'CANCEL' ? event.grade_name : '' }}
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              {{ event.event_status == 'CANCEL' ? '휴강' : '보강' }}
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              {{ event.event_status == 'CANCEL' ? event.course_title : '' }}
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              {{ event.event_date }}
            </td>
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              {{ event.start_period }} ~ {{ event.end_period }} 교시
            </td>
            <!-- <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <button @click="handlePut(idx)">수정</button>
            </td> -->
            <td style="border: 1px solid #000; padding: 10px; user-select: none">
              <button @click="handleDel(event.event_id)">삭제</button>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
