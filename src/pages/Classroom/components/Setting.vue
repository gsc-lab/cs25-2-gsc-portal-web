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
  // console.log('resPollClassroom', resPollClassroom)
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
const handleSetPut = (data) => {
  // Renamed from classroomData to data to avoid conflict
  postData.value = {
    rule_id: data.rule_id,
    grade_id: data.grade_id,
    required_count: data.required_count != undefined ? data.required_count : 0,
  }
  // console.log(postData.value)
}

// 등록
const handleSubmit = async () => {
  if (!postData.value.grade_id) {
    alert('학년을 선택해주세요.')
    return
  }
  if (confirm(`${postData.value.grade_id}학년 제한을 수정하시겠습니까?`)) {
    if (classroomData.value[Number(postData.value.grade_id) - 1].rule_id == undefined) {
      await postPollClassroom(postData.value)
    } else {
      await putPollClassroom(postData.value)
    }
    // 초기화
    postData.value.grade_id = ''
    postData.value.required_count = 0
    await resetPollClassroom()
    emit('setPollData')
  }
}
</script>

<template>
  <div>
    <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th
            class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
          >
            학년
          </th>
          <th
            class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
          >
            제한
          </th>
          <th
            class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
          >
            수정
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="data in classroomData"
          :key="data.grade_id"
          class="divide-y divide-gray-100 hover:bg-gray-50"
        >
          <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
            {{ data.grade_id }}학년
          </td>
          <!-- 제한 -->
          <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
            <div v-if="postData.grade_id == data.grade_id">
              <input
                type="number"
                v-model="postData.required_count"
                class="w-20 px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm inline-block mr-1"
              />
              명 이상
            </div>
            <div v-else>
              {{ data.required_count != undefined ? data.required_count : 0 }}명 이상
            </div>
          </td>
          <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
            <div v-if="postData.grade_id == data.grade_id">
              <button
                @click="handleSubmit"
                class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
              >
                등록
              </button>
            </div>
            <div v-else>
              <button
                @click="handleSetPut(data)"
                class="px-3 py-1 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
              >
                수정
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
