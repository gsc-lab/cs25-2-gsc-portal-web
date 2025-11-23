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
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 mb-6">
    <h2 class="text-xl font-bold text-text-heading mb-6">강의실 개방 투표</h2>

    <!-- Week Navigation -->
    <div class="flex items-center justify-center gap-4 mb-6">
      <button @click="handleBefore" class="px-3 py-1 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        지난주
      </button>
      <p class="font-semibold text-text-heading text-lg">{{ selectDate.toISOString().split('T')[0] }}</p>
      <button @click="handleAfter" class="px-3 py-1 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm">
        다음주
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <!-- Admin Settings Toggle -->
    <div v-if="!isStudent" class="mb-6">
      <button @click="isOpen = !isOpen" class="px-4 py-2 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200">
        설정
      </button>
      <div v-if="isOpen" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Setting @setPollData="setPollData" />
      </div>
    </div>

    <!-- Poll Data List -->
    <div class="space-y-4">
      <div v-for="data in pollData" :key="data" class="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex-grow">
          <p class="font-semibold text-text-heading text-base">{{ data.grade_name }}</p>
          <p class="text-text-muted text-sm">{{ data.poll_date }} ( {{ data.day_of_week }} )</p>
          <p class="text-text-base text-sm">제한: {{ data.required_count }}</p>
          <p class="text-text-base text-sm">현재 신청자 수: {{ data.vote_count }}</p>
        </div>

        <div v-if="isStudent && userGrade == data.grade_name.slice(0, 1)" class="flex-shrink-0">
          <button @click="handleAction(data.poll_id, data.user_voted)"
                  :class="['px-3 py-1 rounded-base text-sm font-medium shadow-sm transition-colors duration-200',
                             data.user_voted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary text-white hover:bg-primary-dark']">
            <p v-if="data.user_voted">취소</p>
            <p v-else>신청</p>
          </button>
        </div>
      </div>
       <div v-if="!pollData || pollData.length === 0" class="text-center text-text-muted text-lg py-8">
        현재 진행중인 투표가 없습니다.
      </div>
    </div>
  </div>
</template>
