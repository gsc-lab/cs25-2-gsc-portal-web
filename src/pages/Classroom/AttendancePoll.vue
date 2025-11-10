<script setup>
import { ref, watch } from 'vue'
import { getPoll, postPoll } from '@/api/classroomApi'
import Setting from './Sidebar/components/Setting.vue'
import { useUserStore } from '@/stores/user'
const Ustore = useUserStore()

const isStudent = ref(true)

const pollData = ref() //해당 주 신청 데이터
const today = new Date()
const selectDate = ref(today)
const isOpen = ref(false)

watch(
  () => {
    isStudent.value = Ustore.userInfo.role_type == 'student' ? true : false
    // console.log(isStudent.value)
  },
  { immediate: true },
)
// ====================================================
watch(
  () => selectDate.value,
  async () => {
    pollData.value = await getPoll(selectDate.value.toISOString().split('T')[0])
  },
  { immediate: true },
)
// 지난주
const handleBefore = () => {
  selectDate.value = new Date(selectDate.value.setDate(selectDate.value.getDate() - 7))
}
// 다음주
const handleAfter = () => {
  selectDate.value = new Date(selectDate.value.setDate(selectDate.value.getDate() + 7))
}

// 신청 / 취소
const handleAction = async (poll_id, isVoted) => {
  const action = isVoted ? 'cancel' : 'apply'
  await postPoll(poll_id, action) // api전송
  pollData.value = await getPoll() // 신청 데이터 갱신
}
</script>

<template>
  <div style="background-color: khaki">
    AttendancePoll

    <div>
      <button @click="handleBefore">지난주</button>
      <p>{{ selectDate.toISOString().split('T')[0] }}</p>
      <button @click="handleAfter">다음주</button>
    </div>
    <div v-if="!isStudent">
      <button @click="isOpen = !isOpen">설정</button>
      <div v-if="isOpen">
        <Setting />
      </div>
    </div>

    <div v-for="data in pollData" :key="data" style="background-color: aliceblue; margin: 3px">
      <p>{{ data.grade_name }}</p>
      <p>{{ data.poll_date }} ( {{ data.day_of_week }} )</p>
      <p>제한 : {{ data.required_count }}</p>
      <p>현제 신청자 수: {{ data.vote_count }}</p>

      <div>
        <button @click="handleAction(data.poll_id, data.user_voted)">
          <p v-if="data.user_voted">취소</p>
          <p v-else>신청</p>
        </button>
      </div>
    </div>
  </div>
</template>
