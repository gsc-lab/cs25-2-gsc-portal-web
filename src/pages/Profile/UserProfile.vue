<template>
  <AppLayout pageName="Profile">
    <main class="max-w-lg mx-auto w-full mt-12 mb-20">
      <div class="bg-bg-paper rounded-card border border-gray-200 shadow-subtle p-8">
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 class="text-xl font-bold text-text-heading">프로필</h2>
          <button
            @click="studentScoreInputForm"
            :class="['px-4 py-2 rounded-base text-sm font-medium transition-colors duration-200',
                     isForm ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-sm' : 'bg-primary text-white hover:bg-primary-dark shadow-sm']"
          >
            {{ isForm ? '입력창 닫기' : '성적 입력' }}
          </button>
        </div>

        <!-- Profile Basic Info Area -->
        <div class="flex flex-col items-center pt-4 mb-6">
          <img
            class="w-24 h-24 rounded-full object-cover shadow-sm mx-auto mb-4"
            src="/src/styles/Gemini_Generated_Image_4j52344j52344j52.png"
            alt="User Profile Icon"
          />
          <p class="text-lg font-semibold text-text-heading text-center">{{ user.userInfo?.name }}</p>
          <p class="text-sm text-text-muted text-center mb-4">{{ user.userInfo?.user_id }}</p>
          <!-- Additional sub-text can go here if needed -->
        </div>

        <!-- Information List -->
        <div class="bg-gray-50 rounded-base border border-gray-200 p-4 mb-6">
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">학번</span>
            <span class="text-sm text-text-base">{{ user.userInfo?.user_id }}</span>
          </div>

          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">이메일</span>
            <span class="text-sm text-text-base">{{ user.userInfo?.email }}</span>
          </div>

          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">전화번호</span>
            <span class="text-sm text-text-base">{{ user.userInfo?.phone }}</span>
          </div>

          <div class="flex justify-between items-center py-3">
            <span class="text-sm font-medium text-text-muted">권한</span>
            <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold uppercase',
                           user.userInfo?.role_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                           user.userInfo?.role_type === 'professor' ? 'bg-green-100 text-green-800' :
                           user.userInfo?.role_type === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800']">
              {{ user.userInfo?.role_type }}
            </span>
          </div>
        </div>

        <!-- Student Specific Info -->
        <div v-if="user.userInfo?.role_type === 'student'" class="bg-gray-50 rounded-base border border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-text-heading mb-3">성적 정보</h3>
            <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-sm font-medium text-text-muted">시험 종류</span>
                <span class="text-sm text-text-base">{{ user.userInfo?.exam_type || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-sm font-medium text-text-muted">점수</span>
                <span class="text-sm text-text-base">{{ user.userInfo?.score || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
                <span class="text-sm font-medium text-text-muted">레벨</span>
                <span class="text-sm text-text-base">{{ user.userInfo?.level || 'N/A' }}</span>
            </div>
        </div>
      </div>

      <!-- 성적 등록 -->
      <div v-show="isForm" class="bg-bg-paper rounded-card border border-gray-200 shadow-subtle p-8 mt-6">
        <h2 class="text-xl font-bold text-text-heading mb-6">성적 정보 입력</h2>

        <div class="mb-4">
          <span class="text-sm font-medium text-text-muted block mb-2">시험 유형</span>
          <div class="flex gap-4">
            <label class="inline-flex items-center">
              <input type="radio" name="testType" value="JLPT" v-model="exam_type" class="form-radio h-4 w-4 text-primary transition duration-150 ease-in-out" />
              <span class="ml-2 text-sm text-text-base">JLPT</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="testType" value="TOPIK" v-model="exam_type" class="form-radio h-4 w-4 text-primary transition duration-150 ease-in-out" />
              <span class="ml-2 text-sm text-text-base">TOPIK</span>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium text-text-muted mb-1 block">Score</label>
          <input type="text" placeholder="점수를 입력하세요" v-model="score"
                 class="w-full border border-gray-200 rounded-base py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium text-text-muted mb-1 block">Level</label>
          <input type="text" placeholder="급수를 입력하세요 (예: N1)" v-model="level"
                 class="w-full border border-gray-200 rounded-base py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:focus:border-primary" />
        </div>

        <div class="mb-6">
          <label class="text-sm font-medium text-text-muted mb-1 block">성적파일</label>
          <input type="file" @change="handleFiles"
                 class="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-base file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary-light/80" />
        </div>
        
        <button class="w-full bg-primary text-white rounded-base py-2 hover:bg-primary-dark transition-colors duration-200" @click="scoreSubmit">성적 등록</button>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { postUserGrade } from '@/api/auth'
import AppLayout from '@/layouts/AppLayout.vue'
import { useUserStore } from '@/stores/user'
import { ref, watchEffect } from 'vue' // [추가] ref 임포트

// user store ( user.userInfo ) 불러오기
const user = useUserStore()

const isForm = ref(false)

const exam_type = ref('')
const score = ref('')
const level = ref('')
const files = ref([])

const handleFiles = (event) => {
  const selected = event.target.files
  files.value = Array.from(selected)
}
const scoreSubmit = async () => {
  const formData = new FormData()

  formData.append('exam_type', exam_type.value)
  formData.append('score', score.value)
  formData.append('level', level.value)

  if (files.value.length > 0) {
    formData.append('files', files.value[0])
  }

  try {
    await postUserGrade(formData)
  } catch (err) {
    console.error('성적 등록 실패', err)
  }
}

const studentScoreInputForm = () => {
  isForm.value = !isForm.value
}

watchEffect(() => {
  console.log(exam_type.value)
  console.log(score.value)
  console.log(level.value)
  console.log(files.value)
})
</script>
