<script setup>
import { ref, onMounted } from 'vue'
import { getPollClassrooms, postPollClassroom, putPollClassroom } from '@/api/classroomApi'

const emit = defineEmits(['setPollData'])

const classroomData = ref()
const postData = ref({
  rule_id: undefined,
  grade_id: '',
  required_count: 0,
})

const resetPollClassroom = async () => {
  // 조회
  const resPollClassroom = await getPollClassrooms()
  console.log('resPollClassroom', resPollClassroom)
  // 개수 확인하고 부족하면 자동 추가
  if (resPollClassroom.length < 3) setClassroomData(resPollClassroom)
  else classroomData.value = resPollClassroom
}

// 수정: classrooms 데이터 초기화
onMounted(async () => {
  classroomData.value = [
    { rule_id: undefined, grade_id: '1', required_count: undefined },
    { rule_id: undefined, grade_id: '2', required_count: undefined },
    { rule_id: undefined, grade_id: '3', required_count: undefined },
  ]
  await resetPollClassroom()
})

// 해당 학년에 required_count 대입
function setClassroomData(resPollClassroom) {
  for (const res of resPollClassroom) {
    for (let idx = 0; idx < classroomData.value.length; idx++) {
      if (classroomData.value[idx].grade_id == res?.grade_id) {
        classroomData.value[idx].required_count = res?.required_count
        break
      }
    }
  }
}

// 수정 대상 세트
const handleSetPut = (classroomData) => {
  postData.value = {
    rule_id: classroomData.rule_id,
    grade_id: classroomData.grade_id,
    required_count: classroomData.required_count != undefined ? classroomData.required_count : 0,
  }
  console.log(postData.value)
}

// 등록
const handleSubmit = async () => {
  if (classroomData.value[Number(postData.value.grade_id) - 1].rule_id == undefined) {
    await postPollClassroom(postData.value)
  } else {
    await putPollClassroom(postData.value)
  }
  // 초기화
  postData.value.grade_id = ''
  await resetPollClassroom()
  emit('setPollData')
}
</script>

<template>
  <div style="background-color: azure">
    <table style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>
          <th style="border: 1px solid #000; padding: 10px">학년</th>
          <th style="border: 1px solid #000; padding: 10px">제한</th>
          <th style="border: 1px solid #000; padding: 10px">수정</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in classroomData" :key="data">
          <td style="border: 1px solid #000; padding: 10px">{{ data.grade_id }}학년</td>
          <!-- 제한 -->
          <td style="border: 1px solid #000; padding: 10px">
            <div v-if="postData.grade_id == data.grade_id">
              <input type="number" v-model="postData.required_count" />명 이상
            </div>
            <div v-else>
              {{ data.required_count != undefined ? data.required_count : 0 }}명 이상
            </div>
          </td>
          <td style="border: 1px solid #000; padding: 10px">
            <div v-if="postData.grade_id == data.grade_id">
              <button @click="handleSubmit">등록</button>
            </div>
            <div v-else><button @click="handleSetPut(data)">수정</button></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
