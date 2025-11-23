<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-4">휴보강 이력</h3>

    <!-- Target Filter Radio Buttons -->
    <div class="flex flex-wrap gap-2 mb-4">
      <input type="radio" id="ev-all" value="0" v-model="target" class="hidden" />
      <label for="ev-all"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '0' }]">
        전체
      </label>

      <input type="radio" id="ev-1" value="1" v-model="target" class="hidden" />
      <label for="ev-1"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '1' }]">
        1학년
      </label>

      <input type="radio" id="ev-2" value="2" v-model="target" class="hidden" />
      <label for="ev-2"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '2' }]">
        2학년
      </label>

      <input type="radio" id="ev-3" value="3" v-model="target" class="hidden" />
      <label for="ev-3"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === '3' }]">
        3학년
      </label>

      <input type="radio" id="ev-special" value="special" v-model="target" class="hidden" />
      <label for="ev-special"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === 'special' }]">
        특강
      </label>

      <input type="radio" id="ev-korean" value="korean" v-model="target" class="hidden" />
      <label for="ev-korean"
        :class="['block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent', { 'bg-primary-light border-primary text-primary-dark font-semibold': target === 'korean' }]">
        한국어
      </label>
    </div>

    <!-- Events Table -->
    <div v-if="events != null" class="rounded-lg overflow-hidden border border-gray-200 mt-4">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-200 text-left">학년</th>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-200 text-left">유형</th>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-200 text-left">과목명</th>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-200 text-left">날짜</th>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-200 text-left">시간</th>
              <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border border-gray-200">관리</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="event in events" :key="event">
              <!-- 휴강 (Cancel) -->
              <tr class="bg-bg-paper even:bg-gray-50">
                <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                  {{ event['cancel'].grade_name }}
                </td>
                <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                  <span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">휴강</span>
                </td>
                <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                  {{ event['cancel'].course_title }}
                </td>
                <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                  {{ event['cancel'].event_date }}
                </td>
                <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                  {{ event['cancel'].start_period }} ~ {{ event['cancel'].end_period }} 교시
                </td>
                <td class="py-2 px-3 border border-gray-200 text-sm text-center">
                  <button @click="handleDel(event['cancel'].event_id)" class="px-3 py-1 bg-red-500 text-white text-xs rounded-base hover:bg-red-600 shadow-sm">삭제</button>
                </td>
              </tr>
              <!-- 보강 (Makeup) -->
              <template v-if="event['makeup']?.length > 0">
                <tr v-for="(mu, idx) in event['makeup']" :key="idx" class="even:bg-gray-50">
                  <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                    <!-- Grade of makeup can be inferred or left empty for visual grouping -->
                  </td>
                  <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                    <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">보강</span>
                  </td>
                  <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                    <!-- Course title for makeup can be inferred or left empty -->
                  </td>
                  <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                    {{ mu.event_date }}
                  </td>
                  <td class="py-2 px-3 border border-gray-200 text-sm text-left">
                    {{ mu.start_period }} ~ {{ mu.end_period }} 교시
                  </td>
                  <td class="py-2 px-3 border border-gray-200 text-sm text-center">
                    <button @click="handleDel(mu.event_id)" class="px-3 py-1 bg-red-500 text-white text-xs rounded-base hover:bg-red-600 shadow-sm">삭제</button>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getEvent, delEvent } from '@/api/timetableApi'
import { ref, watch } from 'vue'
import { useTimetableStore } from '@/stores/timetable'

const eventList = ref(null) // 휴보강 정보
const target = ref('0')
const events = ref(null) // target 필터링 휴보강 정보

const Tstore = useTimetableStore() // 시간표 store

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
    events.value = await setEvents()
    await Tstore.setTimetable()
  }
}
</script>