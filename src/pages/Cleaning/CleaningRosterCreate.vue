<template>
  <div><button>청소 멤버 자동 생성</button></div>
  <div>학기 선택</div>
  <div v-for="section in sections" :key="section?.sec_id">
    <input
      type="radio"
      name="section"
      :id="section?.sec_id"
      :value="section?.sec_id"
      v-model="sectionSelect"
    />
    <label :for="section?.sec_id">{{ section?.sec_id + '학기' }}</label>
  </div>
  <div>요일 선택</div>
  <div v-for="day in weekDays" :key="day">
    <input type="radio" name="day" :id="day" :value="day" v-model="daySelect" />
    <label :for="day">{{ day + '' }}</label>
  </div>
  <div>인원 수</div>
  <div v-for="member in ['1', '2', '3', '4']" :key="member">
    <input
      type="radio"
      name="member"
      :id="'member-' + member"
      :value="member"
      v-model="team_size"
    />
    <label :for="'member-' + member">{{ member + '명' }}</label>
  </div>
  <div>
    <div>학년 선택</div>
    <div v-for="grade in ['1', '2', '3']" :key="grade">
      <input
        type="radio"
        name="grade"
        :id="'grade-' + grade"
        :value="grade"
        v-model="gradeSelect"
      />
      <label :for="'grade-' + grade">{{ grade + '학년' }}</label>
    </div>

    <div>교실 정보</div>
    <div v-for="classroom in classRooms" :key="classroom.classroom_id">
      <input
        type="radio"
        name="classroom"
        :id="classroom.classroom_id"
        :value="classroom.classroom_id"
        v-model="classroomSelect"
      />
      <label :for="classroom.classroom_id">{{ classroom.label }}</label>
    </div>
    <!-- <div v-for="classroom in classRooms" :key="classroom">
      {{ classroom.classroom_id }}
    </div> -->
  </div>
</template>

<script setup>
import { getClassRooms } from '@/api/apiCleaning'
import { getSection } from '@/api/jobApi'
import { onMounted, ref, watch, watchEffect } from 'vue'

// ====================================================

const sections = ref([]) // 학기 정보
const classRooms = ref([]) // 교실 정보
const weekDays = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']) // 요일 배열

// ====================================================

// ====================================================

const sectionSelect = ref('') // 선택된 학기
const daySelect = ref('') // 선택된 요일
const team_size = ref(0) // 선택된 팀 멤버수
const classroomSelect = ref('') // 선택된 교실 정보
const gradeSelect = ref('') // 선택된 학년

// ====================================================

// 필요한 정보
// 1. 학기 = OK
// 2. 청소 요일 = OK
// 3. 팀 멤버 수 = OK
// 4. 학년별 학생 교실 정보 ( 학년과 교실 ) = OK
onMounted(async () => {
  sections.value = await getSection()
  classRooms.value = await getClassRooms()
  console.log(sections.value)
  console.log(classRooms.value)
})

watchEffect(() => {
  console.log('선택된 학기: ', sectionSelect.value)
  console.log('선택된 요일: ', daySelect.value)
  console.log('인원수: ', team_size.value)
  console.log('선택된 교실: ', classroomSelect.value)
  console.log('선택된 학년: ', gradeSelect.value)
})

watch(sectionSelect, (newSections, oldSections) => {
  if (newSections !== oldSections) {
    daySelect.value = ''
    team_size.value = 0
  }
})
</script>
