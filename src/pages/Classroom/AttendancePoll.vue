<script setup>
import { onMounted, ref, watch } from 'vue'
import { getPoll, postPoll } from '@/api/classroomApi'
import Setting from './components/Setting.vue'
import { useUserStore } from '@/stores/user'
const Ustore = useUserStore()

const isStudent = ref(true)
const userGrade = ref('')

const pollData = ref() //해당 주 신청 데이터
const today = new Date()
const selectDate = ref(today)
const isOpen = ref(false)

onMounted(() => {
  isStudent.value = Ustore.userInfo.role_type == 'student' ? true : false
  if (isStudent.value) userGrade.value = Ustore.userInfo.grade_id
})
// ====================================================

async function setPollData() {
  pollData.value = await getPoll(selectDate.value.toISOString().split('T')[0])
}

watch(
  () => selectDate.value,
  () => {
    setPollData()
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
  setPollData() // 신청 데이터 갱신
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
        <Setting @setPollData="setPollData" />
      </div>
    </div>

    <div v-for="data in pollData" :key="data" style="background-color: aliceblue; margin: 3px">
      <p>{{ data.grade_name }}</p>
      <p>{{ data.poll_date }} ( {{ data.day_of_week }} )</p>
      <p>제한 : {{ data.required_count }}</p>
      <p>현제 신청자 수: {{ data.vote_count }}</p>

      <div v-if="isStudent && userGrade == data.grade_name.slice(0, 1)">
        <button @click="handleAction(data.poll_id, data.user_voted)">
          <p v-if="data.user_voted">취소</p>
          <p v-else>신청</p>
        </button>
      </div>
    </div>
  </div>
</template>
