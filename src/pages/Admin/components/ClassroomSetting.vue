<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-text-heading mb-4">강의실 설정</h3>

    <div class="flex justify-end mb-4">
      <button
        @click="postData.classroom_id = 'new'"
        class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
      >
        교실 추가
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-subtle bg-bg-paper">
      <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              ID
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              장소
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              타입
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              수정
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              삭제
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- ====================  추가  ==================== -->
          <tr
            v-if="postData?.classroom_id == 'new'"
            class="divide-y divide-gray-200 hover:bg-gray-50"
          >
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">NEW</td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div class="flex items-center justify-center gap-1">
                <select
                  v-model="postData.building"
                  id="building"
                  class="px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="창조관">창조관</option>
                  <option value="청문관">청문관</option>
                  <option value="연서관">연서관</option>
                  <option value="공학관">공학관</option>
                  <option value="정보관">정보관</option>
                  <option value="본관">본관</option>
                </select>
                -
                <input
                  v-model="postData.room_number"
                  placeholder="101"
                  class="w-16 px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <select
                v-model="postData.room_type"
                class="w-full px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              >
                <option value="CLASSROOM">강의실</option>
                <option value="LAB">실습실</option>
              </select>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <button
                @click="handlePost"
                class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
              >
                등록
              </button>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <button
                @click="resetPostData"
                class="px-3 py-1 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
              >
                취소
              </button>
            </td>
          </tr>

          <!-- ====================  출력/수정  ==================== -->
          <tr
            v-for="(classroom, idx) in classrooms"
            :key="idx"
            class="divide-y divide-gray-200 hover:bg-gray-50"
          >
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ classroom.classroom_id }}
            </td>
            <!--  장소  -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div
                v-if="classroom.classroom_id == postData.classroom_id"
                class="flex items-center justify-center gap-1"
              >
                <select id="building" v-model="postData.building">
                  <option value="창조관">창조관</option>
                  <option value="청문관">청문관</option>
                  <option value="연서관">연서관</option>
                  <option value="공학관">공학관</option>
                  <option value="정보관">정보관</option>
                  <option value="본관">본관</option>
                </select>
                -
                <input
                  v-model="postData.room_number"
                  placeholder="101"
                  class="w-16 px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div v-else>{{ classroom.building }}-{{ classroom.room_number }}</div>
            </td>
            <!-- type -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <select
                  v-model="postData.room_type"
                  class="w-full px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="CLASSROOM">강의실</option>
                  <option value="LAB">실습실</option>
                </select>
              </div>
              <div v-else>{{ classroom.room_type == 'LAB' ? '실습실' : '강의실' }}</div>
            </td>

            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <button
                  @click="handlePut"
                  class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
                >
                  등록
                </button>
              </div>
              <div v-else>
                <button
                  @click="setPostData(classroom)"
                  class="px-3 py-1 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  수정
                </button>
              </div>
            </td>

            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="classroom.classroom_id == postData.classroom_id">
                <button
                  @click="postData.classroom_id = ''"
                  class="px-3 py-1 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  취소
                </button>
              </div>
              <div v-else>
                <button
                  @click="handleDelete(classroom)"
                  class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="!classrooms || classrooms.length === 0"
        class="text-center text-text-muted text-lg py-8"
      >
        등록된 강의실이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { postClassroom, putClassroom, deleteClassroom } from '@/api/classroomApi'
import { useClassroomStore } from '@/stores/classroom'
const CRstore = useClassroomStore()

const classrooms = ref(null)
const postData = ref(null)

function resetPostData() {
  postData.value = {
    building: '창조관',
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
  if (!postData.value.building || !postData.value.room_number || !postData.value.room_type) {
    alert('필수 값이 누락되었습니다.')
  } else {
    if (confirm(`${postData.value.building}-${postData.value.room_number} 교실을 추가하시겠습니까?`)) {
      await postClassroom(postData.value)
      await CRstore.setClassroomInfo()
      setCRData()
      resetPostData()
    }
  }
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
  if (!postData.value.building || !postData.value.room_number || !postData.value.room_type) {
    alert('필수 값이 누락되었습니다.')
  } else {
    if (confirm(`${postData.value.building}-${postData.value.room_number} 교실 정보를 수정하시겠습니까?`)) {
      await putClassroom(postData.value)
      await CRstore.setClassroomInfo()
      setCRData()
      resetPostData()
    }
  }
}

// ==============  삭제  ===============
const handleDelete = async (classroom) => {
  if (confirm(`${classroom.building}-${classroom.room_number}을 삭제하시겠습니까?`)) {
    await deleteClassroom(classroom.classroom_id)
    await CRstore.setClassroomInfo()
    setCRData()
  }
}
</script>
