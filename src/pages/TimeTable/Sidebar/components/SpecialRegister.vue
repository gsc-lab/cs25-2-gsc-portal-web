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
const lenUnassignedStd = ref(null) // 배정 X 학생 수

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
  lenUnassignedStd.value = unassignedStd.value.length
}

// ==========================  등록 / 수정  ==========================
const handleSubmit = async () => {
  // 선택 중인 학생의 ID추출
  const student_ids = assignedStd.value.map((std) => std.user_id)
  console.log('student_ids', student_ids)
  if (lenUnassignedStd.value == 0) await postClassStudents(selectClassId.value, student_ids)
  else await putClassStudents(selectClassId.value, student_ids)
}
</script>

<template>
  {{ isJP ? '일본어 특강 분반' : '한국어 분반' }}
  <!-- 일본어 특강 or 한국어 수업 -->
  <div>
    <button @click="handleGetClasses()">
      {{ isJP ? '한국어 분반 설정' : '일본어 특강 분반 설정' }}
    </button>
  </div>

  <div>
    <!-- 반 선택 -->
    <div>
      <label for="className">반 선택 :</label>
      <select id="className" v-model="selectClassId">
        <option v-for="cls in classes" :value="cls.class_id" :key="cls.class_id">
          {{ cls.class_group }}
        </option>
      </select>
    </div>

    <!-- draggable -->
    <div style="display: flex; gap: 2rem">
      <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
        <h3>학생</h3>
        <draggable v-model="unassignedStd" group="items" itemKey="user_id">
          <template #item="{ element }">
            <div
              style="
                padding: 8px;
                border: 1px solid #ccc;
                margin: 4px 0;
                background: #e6f7ff;
                cursor: grab;
              "
            >
              {{ element.grade }}학년 : {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>

      <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
        <h3>선택 중:</h3>
        <draggable v-model="assignedStd" group="items" itemKey="user_id">
          <template #item="{ element }">
            <div
              style="
                padding: 8px;
                border: 1px solid #ccc;
                margin: 4px 0;
                background: #fff;
                cursor: grab;
              "
            >
              {{ element.grade }}학년 : {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <div>
      <button @click="handleSubmit()">등록</button>
    </div>
  </div>
</template>
