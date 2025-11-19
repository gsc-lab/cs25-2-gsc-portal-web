<script setup>
import { ref, onMounted } from 'vue'
import { getClassroomsInfo, postClassroom, putClassroom, deleteClassroom } from '@/api/classroomApi'
import { useClassroomStore } from '@/stores/classroom'
const CRstore = useClassroomStore()

const classrooms = ref(null)
const postData = ref(null)

function resetPostData() {
  postData.value = {
    building: '',
    classroom_id: '',
    room_number: '',
    room_type: 'CLASSROOM',
  }
}

// 교실 조회
const setCRData = async () => {
  classrooms.value = await CRstore.getClassroomInfo()
}

onMounted(async () => {
  setCRData()
  resetPostData()
})

// ==============  추가  ===============
const handlePost = async () => {
  await postClassroom(postData.value)
  await CRstore.setClassroomInfo()
  setCRData()
  resetPostData()
}

// ==============  수정  ===============
const setPostData = (classroom) => {
  postData.value = {
    building: classroom.building,
    classroom_id: classroom.classroom_id,
    room_number: classroom.room_number,
    room_type: classroom.room_type,
  }
}
const handlePut = async () => {
  await putClassroom(postData.value)
  await CRstore.setClassroomInfo()
  setCRData()
  resetPostData()
}

// ==============  삭제  ===============
const handleDelete = async (classroom) => {
  if (confirm(`${classroom.building}-${classroom.room_number}을 삭제합니다`)) {
    await deleteClassroom(classroom.classroom_id)
    await CRstore.setClassroomInfo()
    setCRData()
  }
}
</script>

<template>
  <div style="background-color: aliceblue; margin: 3px">
    classroom

    <div v-if="postData?.classroom_id !== 'new'">
      <button @click="postData.classroom_id = 'new'">추가</button>
    </div>

    <div>
      <table style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 10px"></th>
            <th style="border: 1px solid #000; padding: 10px">장소</th>
            <th style="border: 1px solid #000; padding: 10px">타입</th>
            <th style="border: 1px solid #000; padding: 10px">수정</th>
            <th style="border: 1px solid #000; padding: 10px">삭제</th>
          </tr>
        </thead>
        <tbody>
          <!-- ====================  추가  ==================== -->
          <tr v-if="postData?.classroom_id == 'new'">
            <td style="border: 1px solid #000; padding: 10px">NEW</td>
            <td style="border: 1px solid #000; padding: 10px">
              <input v-model="postData.building" placeholder="창조관" />-
              <input v-model="postData.room_number" placeholder="101" />
            </td>
            <td style="border: 1px solid #000; padding: 10px">
              <select v-model="postData.room_type">
                <option value="CLASSROOM">강의실</option>
                <option value="LAB">실습실</option>
              </select>
            </td>
            <td style="border: 1px solid #000; padding: 10px">
              <button @click="handlePost">등록</button>
            </td>
            <td style="border: 1px solid #000; padding: 10px">
              <button @click="resetPostData">취소</button>
            </td>
          </tr>

          <!-- ====================  출력/수정  ==================== -->
          <tr v-for="(classroom, idx) in classrooms" :key="idx">
            <td style="border: 1px solid #000; padding: 10px">{{ idx + 1 }}</td>
            <!--  장소  -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <input v-model="postData.building" placeholder="창조관" />-
                <input v-model="postData.room_number" placeholder="101" />
              </div>
              <div v-else>{{ classroom.building }}-{{ classroom.room_number }}</div>
            </td>
            <!-- type -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <select v-model="postData.room_type">
                  <option value="CLASSROOM">강의실</option>
                  <option value="LAB">실습실</option>
                </select>
              </div>
              <div v-else>{{ classroom.room_type == 'LAB' ? '실습실' : '강의실' }}</div>
            </td>

            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <button @click="handlePut">등록</button>
              </div>
              <div v-else>
                <button @click="setPostData(classroom)">수정</button>
              </div>
            </td>

            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <button @click="postData.classroom_id = ''">취소</button>
              </div>
              <div v-else><button @click="handleDelete(classroom)">삭제</button></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
