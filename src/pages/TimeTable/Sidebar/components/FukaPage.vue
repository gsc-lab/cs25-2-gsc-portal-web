<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-6">후까 교수님 설정</h3>

    <!-- Default / Pick Radio Buttons -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-text-base mb-2">설정 유형:</label>
      <div class="flex flex-wrap gap-3">
        <input type="radio" id="fuka-default" value="default" v-model="selectType" class="hidden" />
        <label for="fuka-default" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': selectType === 'default' }">
          기본 설정
        </label>

        <input type="radio" id="fuka-pick" value="pick" v-model="selectType" class="hidden" />
        <label for="fuka-pick" class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
          :class="{ 'bg-primary-light border-primary text-primary-dark font-semibold': selectType === 'pick' }">
          날짜 지정
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <!-- Section / Day / Date Settings -->
      <div v-if="selectType == 'default'" class="flex flex-col gap-4">
        <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
          <label class="block text-sm font-medium text-text-base pt-2" for="section">학기:</label>
          <select id="section" v-model="postFukaData.section"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option v-for="section in sections" :value="section.sec_id" :key="section.sec_id">
              {{ section.label }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
          <label class="block text-sm font-medium text-text-base pt-2" for="day">요일:</label>
          <select id="day" v-model="postFukaData.day"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option v-for="(day, idx) in days" :value="enDays[idx]" :key="idx">{{ day }}요일</option>
          </select>
        </div>
      </div>
      <div v-else class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="date">날짜:</label>
        <input type="date" id="date" v-model="postFukaData.date"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <!-- Classroom -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="classroom">장소 입력:</label>
        <input id="classroom" v-model="postFukaData.room"
          class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <!-- Period -->
      <div class="grid grid-cols-[120px_1fr] items-baseline gap-y-4">
        <label class="block text-sm font-medium text-text-base pt-2" for="time">교시:</label>
        <div class="flex items-center gap-2">
          <select id="time-start" v-model="postFukaData.startTime"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option v-for="startT in 12" :value="String(startT)" :key="startT">{{ startT }}</option>
          </select>
          <span class="text-text-base">~</span>
          <select id="time-end" v-model="postFukaData.endTime"
            class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option v-for="endT in 12" :value="String(endT)" :key="endT">{{ endT }}</option>
          </select>
          <span class="text-text-base">교시</span>
        </div>
      </div>
    </div>

    <!-- Student Selection -->
    <div class="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h4 class="text-lg font-bold text-text-heading mb-3">학생 선택</h4>
      <StudentsSelect :users="users" @select:user="handleSelect" />

      <ul class="list-none p-0 m-0 flex flex-col gap-2 mt-4">
        <li v-for="user in selectedUsers" :key="user.user_id" class="flex justify-between items-center bg-white p-2 rounded-md text-sm text-text-base shadow-sm">
          <span>- {{ user.name }} : {{ setTarget(user.grade_id) }}</span>
          <button @click="handleDelete(user.user_id)" class="px-3 py-1 bg-red-500 text-white text-xs rounded-sm hover:bg-red-600">취소</button>
        </li>
      </ul>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-6">
      <button @click="handleSubmit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        등록
      </button>
    </div>
  </div>
</template>

<script setup>
import StudentsSelect from '@/layouts/StudentsSelect.vue'
import { getUserInfo } from '@/api/adminApi'
import { getSections, postFukaStudents, postFukaCustomStudents } from '@/api/timetableApi'
import { setTarget } from '@/utils/reName'
import { onMounted, ref, watch } from 'vue'
import { useTimetableStore } from '@/stores/timetable'

const Tstore = useTimetableStore() // 시간표 store

// 초기화
const selectType = ref('default') // 기본(default) / 날짜 지정(pick)
const days = ['월', '화', '수', '목', '금']
const enDays = ['MON', 'TUE', 'WED', 'THU', 'FRI']

// api
const users = ref() // 학생 명단
const selectedUsers = ref([]) // 선택 학생 정보 저장
const sections = ref(null)
const postFukaData = ref()

// 값 저장
const setVal = () => {
  postFukaData.value = {
    section: null,
    date: null, // 날짜
    day: null, // 요일
    room: '정보관 403',
    startTime: null,
    endTime: null,
    student_ids: [],
  }
}

onMounted(async () => {
  sections.value = await getSections()
  setVal()
  // 재학생만 조회
  users.value = await getUserInfo(undefined, 'enrolled')
})

// ================================= 학생 선택 =================================
// 학생 id를 받고 selectedUsers에 저장
const handleSelect = (id) => {
  const selectedUser = users.value.filter((user) => user.user_id == id)
  selectedUsers.value.push(selectedUser[0])
}

// 학생 선택 취소
const handleDelete = (id) => {
  selectedUsers.value = selectedUsers.value.filter((user) => user.user_id != id)
}

// ================================= store 감시 =================================
// selectTT를 감시하고 timetableData 갱신
watch(
  () => Tstore.selectTT,
  (timetableData) => {
    if (timetableData) {
      console.log('-------------------------')
      console.log('정상값:', timetableData)

      // 값 세팅
      postFukaData.value = {
        date: timetableData.date,
        day: timetableData.day,
        room: '정보관 403',
        startTime: timetableData.startTime,
        endTime: timetableData.endTime,
      }
    } else {
      console.log('아직 데이터 없음')
    }
  },
  { immediate: true },
)

// ================================= 등록 =================================
// 저장버튼 누른 후 실행
const handleSubmit = async () => {
  // student_ids에는 id만 저장
  postFukaData.value.student_ids = selectedUsers.value.map((std) => std.user_id)
  // default 저장
  if (selectType.value == 'default') await postFukaStudents(postFukaData.value)
  // pick 저장
  else await postFukaCustomStudents(postFukaData.value)

  console.log(postFukaData.value)
  // 초기화
  setVal()
  await Tstore.setTimetable()
  selectedUsers.value = []
}
</script>
