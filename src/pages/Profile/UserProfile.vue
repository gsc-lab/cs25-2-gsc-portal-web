<template>
  <AppLayout pageName="Profile">
    <main
      class="max-w-7xl mx-auto w-full mt-12 mb-20 px-4 flex flex-col lg:flex-row items-start justify-center"
    >
      <div
        class="w-full max-w-lg bg-bg-paper rounded-card border border-gray-200 shadow-subtle p-8 transition-all duration-500 ease-in-out flex-shrink-0 z-10"
      >
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 class="text-xl font-bold text-text-heading">프로필</h2>
          <button
            @click="studentScoreInputForm"
            :class="[
              'px-4 py-2 rounded-base text-sm font-medium transition-colors duration-200',
              isForm
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-sm'
                : 'bg-primary text-white hover:bg-primary-dark shadow-sm',
            ]"
          >
            {{ isForm ? '입력창 닫기' : '성적 입력' }}
          </button>
        </div>

        <div class="flex flex-col items-center pt-4 mb-6">
          <img
            class="w-24 h-24 rounded-full object-cover shadow-sm mx-auto mb-4 bg-gray-100"
            src="/src/styles/Gemini_Generated_Image_4j52344j52344j52.png"
            alt="User Profile Icon"
          />
          <p class="text-lg font-semibold text-text-heading text-center">
            {{ user.userInfo?.name }}
          </p>
          <p class="text-sm text-text-muted text-center mb-4">{{ user.userInfo?.user_id }}</p>
        </div>

        <div class="bg-gray-50 rounded-base border border-gray-200 p-4 mb-6">
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">학번</span>
            <span class="text-sm text-text-base">{{ user.userInfo?.user_id }}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">학년</span>
            <span class="text-sm text-text-base">{{ user.userInfo?.grade_id + '학년' }}</span>
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
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold uppercase',
                user.userInfo?.role_type === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : user.userInfo?.role_type === 'professor'
                    ? 'bg-green-100 text-green-800'
                    : user.userInfo?.role_type === 'student'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ user.userInfo?.role_type }}
            </span>
          </div>
        </div>

        <div
          v-if="user.userInfo?.role_type === 'student' && userGrade"
          class="bg-gray-50 rounded-base border border-gray-200 p-4"
        >
          <h3 class="text-lg font-semibold text-text-heading mb-3">성적 정보</h3>
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">시험 종류</span>
            <span class="text-sm text-text-base">{{ userGrade.exam_type || '-' }}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-sm font-medium text-text-muted">점수</span>
            <span class="text-sm text-text-base">{{ userGrade.score || '-' }}</span>
          </div>
          <div class="flex justify-between items-center py-3">
            <span class="text-sm font-medium text-text-muted">레벨</span>
            <span class="text-sm text-text-base">{{ userGrade.level_code || '-' }}</span>
          </div>
        </div>
      </div>

      <div
        :class="[
          'transition-all duration-500 ease-in-out overflow-hidden',
          isForm
            ? 'max-w-lg opacity-100 lg:ml-6 mt-6 lg:mt-0'
            : 'max-w-0 opacity-0 ml-0 mt-0 h-0 lg:h-auto',
        ]"
      >
        <div
          class="w-full min-w-[32rem] bg-bg-paper rounded-card border border-gray-200 shadow-subtle p-8"
        >
          <h2 class="text-xl font-bold text-text-heading mb-6">성적 정보 입력</h2>

          <div class="mb-4">
            <span class="text-sm font-medium text-text-muted block mb-2">시험 유형</span>
            <div class="flex gap-2">
              <button
                v-for="type in examType"
                :key="type.value"
                @click="gradeInput.exam_type = type.label"
                :class="[
                  'px-4 py-2 rounded-base text-sm font-medium border transition-colors duration-200',
                  gradeInput.exam_type === type.label
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50',
                ]"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <div v-if="gradeInput.exam_type" class="mb-4">
            <label class="text-sm font-medium text-text-muted mb-2 block">Level</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="level in gradeInput.exam_type === 'JLPT' ? JLPT_Level : TOPIK_Level"
                :key="level.value"
                @click="gradeInput.level = level.label"
                :class="[
                  'px-3 py-1.5 rounded-base text-sm font-medium border transition-colors duration-200',
                  gradeInput.level === level.label
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50',
                ]"
              >
                {{ level.label }}
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="text-sm font-medium text-text-muted mb-1 block">Score</label>
            <input
              type="text"
              :placeholder="
                gradeInput.exam_type
                  ? `${gradeInput.exam_type} 점수를 입력하세요`
                  : '시험 유형을 먼저 선택하세요'
              "
              v-model="gradeInput.score"
              :disabled="!gradeInput.exam_type"
              class="w-full border border-gray-200 rounded-base py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
            />
          </div>

          <div class="mb-6">
            <label class="text-sm font-medium text-text-muted mb-1 block">성적파일</label>
            <input
              type="file"
              @change="handleFiles"
              class="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-base file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary-light/80 cursor-pointer"
            />
          </div>

          <button
            class="w-full bg-primary text-white rounded-base py-2.5 font-medium shadow-sm hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="scoreSubmit"
            :disabled="!gradeInput.exam_type || !gradeInput.score || !gradeInput.level"
          >
            성적 등록
          </button>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { getUserGrade, postUserGrade } from '@/api/auth'
import AppLayout from '@/layouts/AppLayout.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, reactive, ref, watch, watchEffect } from 'vue'

const user = useUserStore()
const userGrade = ref('')
const isForm = ref(false)

// 성적 입력 저장
const gradeInput = reactive({
  exam_type: '',
  score: '',
  level: '',
  files: [],
})

onMounted(async () => {
  try {
    userGrade.value = await getUserGrade()
  } catch (error) {
    console.log('성적 정보를 불러오지 못했습니다.', error)
  }
})

// 과목 타입
const examType = [
  { label: 'JLPT', value: 1 },
  { label: 'TOPIK', value: 2 },
]

// JLPT 등급
const JLPT_Level = [
  { label: 'N1', value: 1 },
  { label: 'N2', value: 2 },
  { label: 'N3', value: 3 },
]

// TOPIK 등급
const TOPIK_Level = [
  { label: '1급', value: 1 },
  { label: '2급', value: 2 },
  { label: '3급', value: 3 },
  { label: '4급', value: 4 },
  { label: '5급', value: 5 },
  { label: '6급', value: 6 },
]

const handleFiles = (event) => {
  const selected = event.target.files
  gradeInput.files = Array.from(selected)
}

const scoreSubmit = async () => {
  // console.log(typeof Number(gradeInput.score))
  if (gradeInput.exam_type === 'JLPT') {
    // console.log('JLPT 검증')
    if (Number(gradeInput.score) < 0 || Number(gradeInput.score) >= 180) {
      // console.log('범위 검증')
      alert('JLPT 점수는 0 ~ 180점 입니다.')
      return
    }
  }
  if (gradeInput.exam_type === 'TOPIK') {
    if (Number(gradeInput.score < 0) || Number(gradeInput.score) > 300) {
      alert('TOPIK 점수는 0 ~ 300점 입니다.')
      return
    }
  }
  if (gradeInput.files.length === 0) {
    alert('성적 파일을 업로드 해주세요')
    return
  }

  const formData = new FormData()
  formData.append('exam_type', gradeInput.exam_type)
  formData.append('score', gradeInput.score)
  formData.append('level', gradeInput.level)

  if (gradeInput.files.length > 0) {
    formData.append('files', gradeInput.files[0])
  }

  try {
    await postUserGrade(formData)
    alert('성적이 등록되었습니다.')
    isForm.value = false
    // 성공 시 성적 정보 갱신
    userGrade.value = await getUserGrade()
  } catch (err) {
    console.error('성적 등록 실패', err)
  }
}

const studentScoreInputForm = () => {
  isForm.value = !isForm.value
}

watchEffect(() => {
  console.log(user.userInfo)
  console.log('현재 상태:', { ...gradeInput })
  console.log(typeof Number(gradeInput.score))
})

watch(
  () => gradeInput.exam_type,
  (newType, oldType) => {
    if (newType && newType !== oldType) {
      gradeInput.level = ''
      gradeInput.score = ''
      gradeInput.files = []
    }
  },
)

watch(isForm, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    gradeInput.exam_type = ''
    gradeInput.score = ''
    gradeInput.level = ''
    gradeInput.files = []
  }
})
</script>
