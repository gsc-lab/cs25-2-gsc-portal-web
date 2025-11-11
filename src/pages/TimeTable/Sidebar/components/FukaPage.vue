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
  // 저장
  if (selectType.value == 'default') await postFukaStudents(postFukaData.value)
  // pick면 학기를 계산해서 저장
  else {
    // 학기 검색
    const section = sections.value.find(
      (section) =>
        section.start_date <= postFukaData.value.date &&
        section.end_date >= postFukaData.value.date,
    )
    postFukaData.value.section = section.sec_id // 학기 id 대입
    await postFukaCustomStudents(postFukaData.value)
  }
  console.log(postFukaData.value)
  // 초기화
  setVal()
  await Tstore.setTimetable()
  selectedUsers.value = []
}
</script>

<template>
  FukaPage
  <!-- 기본 / 날짜 지정 -->
  <div>
    <input type="radio" id="default" value="default" v-model="selectType" />
    <label for="default">기본 설정</label>

    <input type="radio" id="pick" value="pick" v-model="selectType" />
    <label for="pick">날짜 지정</label>
  </div>

  <!-- 요일 설정 -->
  <div v-if="selectType == 'default'">
    <div>
      <label for="section">학기:</label>
      <select id="section" v-model="postFukaData.section">
        <option v-for="section in sections" :value="section.sec_id" :key="section">
          {{ section.sec_id }}
        </option>
      </select>
    </div>
    <div>
      <label for="day">요일 :</label>
      <select id="day" v-model="postFukaData.day">
        <option v-for="(day, idx) in days" :value="enDays[idx]" :key="idx">{{ day }}요일</option>
      </select>
    </div>
  </div>
  <div v-else>
    <label for="date">날짜 :</label>
    <input type="date" id="date" v-model="postFukaData.date" />
  </div>

  <!-- 장소 -->
  <div>
    <label for="classroom">장소 입력:</label>
    <input id="classroom" v-model="postFukaData.room" />
  </div>

  <!-- 교시 -->
  <div>
    <label for="time">교시 :</label>
    <select id="time" v-model="postFukaData.startTime">
      <option v-for="startT in 12" :value="String(startT)" :key="startT">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postFukaData.endTime">
      <option v-for="endT in 12" :value="String(endT)" :key="endT">{{ endT }}</option>
    </select>
    교시
  </div>

  <!-- 학생 선택 -->
  <div style="background-color: bisque">
    <StudentsSelect :users="users" @select:user="handleSelect" />
  </div>
  <ul>
    <li v-for="user in selectedUsers" :key="user.user_id">
      - {{ user.name }} : {{ setTarget(user.grade_id) }}
      <button @click="handleDelete(user.user_id)">취소</button>
    </li>
  </ul>

  <button @click="handleSubmit">등록</button>
</template>
