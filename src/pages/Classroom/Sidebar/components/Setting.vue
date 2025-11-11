<script setup>
import { ref, watch, onMounted } from 'vue'
import { useClassroomStore } from '@/stores/classroom'
import { postClassroom, patchClassroom } from '@/api/classroomApi'

const isPost = ref(true) // 등록: true, 수정: false
const CRstore = useClassroomStore() // classroom store
const classrooms = ref() // 수정: classrooms 데이터
const selectCR = ref() // 수정: 수정할 대상 선택

const buildingName = ref('') // building 기타 -> 이름 저장

const postData = ref({
  classroom_id: null,
  building: '창조관',
  room_number: null,
  room_type: 0,
  mode: 'free',
  limit: null,
})

// 수정: classrooms 데이터 초기화
onMounted(async () => {
  classrooms.value = await CRstore.getClassroomInfo()
})
// 수정 : 값 반영
watch(
  () => selectCR.value,
  (newCR) => {
    postData.value.classroom_id = newCR.classroom_id
    postData.value.building = newCR.building
    postData.value.room_number = newCR.room_number
  },
)

const handleSubmitPost = async () => {
  if (postData.value.building == null && buildingName.value != '')
    postData.value.building = buildingName.value
  else if (postData.value.room_number == '' || buildingName.value == '') return

  await postClassroom(postData.value)
}
const handleSubmitPatch = async () => {
  if (postData.value.building == null && buildingName.value != '') postData.value.building = buildingName.value
  else if (postData.value.room_number == '' || buildingName.value == '') return

  await patchClassroom(postData.value)
}
</script>

<template>
  <div style="background-color: azure">
    <h3>강의실 등록</h3>

    <button @click="isPost = !isPost">
      <p v-if="isPost">강의실 설정 변경</p>
      <p v-else>돌아가기</p>
    </button>

    <div v-if="!isPost">
      <label for="pa">수정대상 : </label>
      <select id="pa" v-model="selectCR">
        <option v-for="clr in classrooms" :value="clr" :key="clr">
          {{ clr.building }}{{ clr.room_number }}
        </option>
      </select>
    </div>

    <!-- 관, 동 -->
    <div>
      <label for="building">장소 : </label>
      <select id="building" v-model="postData.building">
        <option value="창조관">창조관</option>
        <option value="연서관">연서관</option>
        <option value="공학관">공학관</option>
        <option value="정보관">정보관</option>
        <option value="청문관">청문관</option>
        <option value="본관">본관</option>
        <option value="null">기타</option>
      </select>
      <div v-if="postData.building == null">
        <label for="room_number">장소 입력 : </label>
        <input id="room_number" placeholder="xx관" v-model="buildingName" required />
      </div>
    </div>

    <!-- 호실 -->
    <div>
      <label for="room_number">호실 : </label>
      <input id="room_number" placeholder="000" v-model="postData.room_number" />호
    </div>

    <!-- 사용대상 -->
    <div>
      <label for="room_type">사용대상 : </label>
      <select id="room_type" v-model="postData.room_type">
        <option value="0">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
    </div>

    <!-- 강의실 설정 -->
    <div v-if="postData.room_type != '0'">
      <!-- 운영 방식 (free or poll) -->
      <div>
        <label for="mode">운영 방식 : </label>
        <select id="mode" v-model="postData.mode">
          <option value="poll">신청제</option>
          <option value="free">자율</option>
        </select>
      </div>

      <!-- 제한 내용 (x명 이상) -->
      <div v-if="postData.mode == 'poll'">
        <label for="limit">제한 : </label>
        <input id="limit" placeholder="5" v-model="postData.limit" /> 명 이상
      </div>
    </div>

    <button v-if="isPost" @click="handleSubmitPost">등록하기</button>
    <button v-else @click="handleSubmitPatch">수정하기</button>
  </div>
</template>
