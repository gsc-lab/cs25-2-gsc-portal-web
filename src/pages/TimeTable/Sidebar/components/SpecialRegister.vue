<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
    <h3 class="text-xl font-bold text-text-heading mb-4">
      {{ isJP ? '일본어 특강 분반' : '한국어 분반' }} 설정
    </h3>

    <!-- Toggle Language Button -->
    <div class="mb-4">
      <button @click="handleGetClasses()" class="px-4 py-2 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
        {{ isJP ? '한국어 분반 설정' : '일본어 특강 분반 설정' }}
      </button>
    </div>

    <!-- Class Selection -->
    <div class="mb-6">
      <label for="className" class="block text-sm font-medium text-text-base mb-1">반 선택:</label>
      <select id="className" v-model="selectClassId"
        class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        <option v-for="cls in classes" :value="cls.class_id" :key="cls.class_id">
          {{ cls.class_group }}
        </option>
      </select>
    </div>

    <!-- Draggable Student Lists -->
    <div class="flex flex-col md:flex-row gap-8 mt-4">
      <!-- Unassigned Students -->
      <div class="flex-1 border-2 border-dashed border-blue-300 rounded-md p-4 min-h-48">
        <h3 class="text-lg font-bold text-text-heading mb-2">학생 목록 (미배정):</h3>
        <draggable v-model="unassignedStd" group="items" itemKey="user_id">
          <template #item="{ element }">
            <div class="p-2 border border-gray-300 mb-1 rounded-sm cursor-grab bg-blue-50 text-blue-800 text-sm">
              {{ element.grade }}학년 : {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>

      <!-- Assigned Students -->
      <div class="flex-1 border-2 border-dashed border-blue-300 rounded-md p-4 min-h-48">
        <h3 class="text-lg font-bold text-text-heading mb-2">선택 중 (배정):</h3>
        <draggable v-model="assignedStd" group="items" itemKey="user_id">
          <template #item="{ element }">
            <div class="p-2 border border-gray-300 mb-1 rounded-sm cursor-grab bg-white text-text-base text-sm">
              {{ element.grade }}학년 : {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-6">
      <button @click="handleSubmit()" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import {
  getSpecialClasses,
  getKoreanClasses,
  getClassStudents,
  postClassStudents,
  putClassStudents,
} from '@/api/timetableApi'

const isJP = ref(false) // 일본어 특강 or 한국어
const classes = ref(null) // isJP -> 반 조회
const selectClassId = ref(null) // (select) 반 저장
const assignedStd = ref([]) // [students] 배정 O
const unassignedStd = ref([]) // [students] 배정 X
const lenAssignedStd = ref(null) // 배정 X 학생 수

// 반 조회
const handleGetClasses = async () => {
  isJP.value = !isJP.value
  if (isJP.value) classes.value = await getSpecialClasses()
  else classes.value = await getKoreanClasses()
  selectClassId.value = classes.value[0].class_id
  console.log(classes.value)
}
// 반 초기화
onMounted(async () => {
  await handleGetClasses()
  if (selectClassId.value == null) selectClassId.value = classes.value[0].class_id
})

// ==========================  반 선택 감시  ==========================
watch(
  () => selectClassId.value,
  async () => {
    await getClassStd()
  },
)

// 해당 반 학생 조회
async function getClassStd() {
  const clsStd = await getClassStudents(selectClassId.value)
  console.log('학생: ', clsStd)
  assignedStd.value = [...clsStd.assigned_students]
  unassignedStd.value = [...clsStd.unassigned_students]
  lenAssignedStd.value = assignedStd.value.length
}

// ==========================  등록 / 수정  ==========================
const handleSubmit = async () => {
  // 선택 중인 학생의 ID추출
  const student_ids = assignedStd.value.map((std) => std.user_id)
  console.log('student_ids', lenAssignedStd.value, student_ids)
  if (lenAssignedStd.value == 0) await postClassStudents(selectClassId.value, student_ids)
  else await putClassStudents(selectClassId.value, student_ids)
}
</script>
