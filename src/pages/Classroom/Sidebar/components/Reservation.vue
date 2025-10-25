<script setup>
import { useClassroomStore } from '@/stores/classroom';
import { ref, onMounted, watch } from 'vue'
import { time } from '@/util/time';
import { postReservation } from '@/api/classroomApi';

// 초기화
const CRstore = useClassroomStore()   // classroom store
const classrooms = ref(null)          // classroom 데이터
const username = "홍길동"

const postData = ref({
  classroom_id: null,
  name: null,
  reserve_date: null,
  start_time: "00:00:00",
  end_time: "01:00:00"
})

onMounted(async () => {
  classrooms.value = await CRstore.getClassroomInfo()
  postData.value.classroom_id = await CRstore.getSelectCR()
  if (CRstore.selectReTime.length > 0) {
    postData.value.reserve_date = CRstore.selectReTime[0]
    postData.value.start_time = CRstore.selectReTime[1]
    postData.value.end_time = CRstore.selectReTime[2]
  }
  postData.value.name = username
})

// ===============  selectCR (classroom_id) 감시 ===============
watch(() => CRstore.selectCR,
  async (newCRid, oldCRid) => {
    if (newCRid && newCRid !== oldCRid) {
      postData.value.classroom_id = CRstore.selectCR
    }
  }
)
// 시간 감시
watch(() => CRstore.selectReTime,
  async (newTime, oldTime) => {
    if (newTime && newTime !== oldTime) {
      postData.value.reserve_date = CRstore.selectReTime[0]
      postData.value.start_time = CRstore.selectReTime[1]
      postData.value.end_time = CRstore.selectReTime[2]
    }
  }
)
// ==================  Submit  ==================
const handleSubmit = async () => {
  console.log("등록");
  await postReservation(postData.value)
  CRstore.setSelectResSchedule(postData.value.classroom_id)
}
</script>
<template>
  <div style="background-color:burlywood;">
  입력

    <!-- 이름 입력 -->
    <div>
      <label for="name">이름: </label>
      <input id="name" v-model="postData.name" />
    </div>

    <!-- 강의실 선택 -->
    <div>
      <label for="classroom">강의실 선택 : </label>
      <select id="classroom" v-model="postData.classroom_id">
        <option v-for="clr in classrooms" :value="clr.classroom_id" :key="clr.classroom_id">
          {{ clr.building }}{{ clr.room_number }}
        </option>
      </select>
    </div>

    <!-- 날짜 -->
    <div>
      <label for="date">날짜: </label>
      <input type="date" id="date" v-model="postData.reserve_date"/>
    </div>

    <!-- 시간 (start_time ~ end_time) -->
    <div>
      <!-- 0 ~ 23 -->
      <label for="resTime">시간 : </label>
      <select id="resTime" v-model="postData.start_time">
        <option v-for="(_, idx) in 24" :value="time(idx)" :key="idx">
          {{ time(idx) }}
        </option>
      </select>
      ~
      <!-- 1 ~ 24 -->
      <select id="resTime" v-model="postData.end_time">
        <option v-for="et in 24" :value="time(et)" :key="et">
          {{ time(et) }}
        </option>
      </select>
    </div>

    <button @click="handleSubmit">예약하기</button>
  </div>
</template>
