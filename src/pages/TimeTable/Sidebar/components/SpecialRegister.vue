<script setup>
import { onMounted, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { getSpecialClasses, getKoreanClasses, getClassStudents } from '@/api/timetableApi'

const isJP = ref(false) // 일본어 특강 or 한국어
const classes = ref(null) // isJP -> 반 조회
const selectClass = ref(null) // [select] 반 저장
const originAssignedStd = ref([]) // [students] 배정 X  (원본)
const assignedStd = ref([]) // [originAssignedStd copy] (수정용)
const unassignedStd = ref([]) // [students] 배정 O

// 반 조회
const handleGetClasses = async () => {
  isJP.value = !isJP.value
  if (isJP.value) classes.value = await getSpecialClasses()
  else classes.value = await getKoreanClasses()
  console.log(classes.value)
}
// 반 초기화
onMounted(() => {
  handleGetClasses()
})

// ==========================  반 선택 감시  ==========================
watch(
  () => selectClass.value,
  async () => {
    await getClassStd()
  },
  { immediate: true },
)

// 해당 반 학생 조회
async function getClassStd() {
  const clsStd = await getClassStudents()
  console.log('학생: ', clsStd)
  originAssignedStd.value = [...clsStd.assigned_students] // 원본
  assignedStd.value = [...originAssignedStd.value] // 복사본
  unassignedStd.value = [...clsStd.unassigned_students]
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

  <!-- 반 선택 -->
  <div>
    <label for="className">반 선택 :</label>
    <select id="className" v-model="selectClass">
      <option v-for="cls in classes" :value="cls.class_id" :key="cls.class_id">
        {{ cls.className }}
      </option>
    </select>

    <div style="display: flex; gap: 2rem">
      <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
        <h3>학생</h3>
        <draggable v-model="assignedStd" group="items" itemKey="user_id">
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
        <draggable v-model="unassignedStd" group="items" itemKey="user_id">
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
  </div>
</template>
