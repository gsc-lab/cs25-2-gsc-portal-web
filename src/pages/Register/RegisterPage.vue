<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div
      class="bg-bg-paper rounded-card shadow-subtle overflow-hidden border border-gray-200 max-w-4xl mx-auto"
    >
      <div class="flex justify-center items-center p-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-text-heading">
          {{ typeNameChange(registerType) + ' 회원가입' }}
        </h1>
      </div>

      <div class="px-6 mt-6 mb-2">
        <div class="relative bg-gray-100 p-1 rounded-base flex">
          <div
            class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-0"
            :class="registerType === 'student' ? 'left-1' : 'left-[calc(50%+0.25rem)]'"
          ></div>

          <button
            v-for="type in registerTypes"
            :key="type.value"
            @click="registerType = type.label"
            class="flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none rounded-md"
            :class="
              registerType === type.label
                ? 'text-primary font-bold'
                : 'text-text-muted hover:text-gray-600'
            "
          >
            {{ typeNameChange(type.label) }}
          </button>
        </div>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="registerType === 'student'" key="student" class="p-6 flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="user-name">이름</label>
            <input
              id="user-name"
              v-model="studentInfo.name"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="이름을 입력해주세요"
            />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="student-id">학번</label>
            <input
              id="student-id"
              v-model="studentInfo.user_id"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="학번을 입력해주세요"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="phone-number">
              전화번호
            </label>
            <input
              id="phone-number"
              v-model="studentInfo.phone"
              type="tel"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="010-xxxx-xxxx"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="email">이메일</label>
            <input
              id="email"
              v-model="studentInfo.email"
              type="email"
              disabled
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm bg-gray-100 text-text-muted sm:text-sm cursor-not-allowed"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base pt-2">학년</label>
            <div class="flex flex-wrap gap-2">
              <div v-for="grade in grades" :key="grade.value" class="relative">
                <input
                  type="radio"
                  :id="`grade-${grade.value}`"
                  :value="grade.value"
                  v-model="studentInfo.grade"
                  class="peer sr-only"
                />
                <label
                  :for="`grade-${grade.value}`"
                  class="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary"
                >
                  {{ grade.label }}
                </label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base pt-2">유학생 여부</label>
            <div class="flex flex-wrap gap-3">
              <div v-for="select in yseORno" :key="select.value" class="relative">
                <input
                  type="radio"
                  :id="`select-${select.value}`"
                  name="is_international_group"
                  class="peer sr-only"
                  :value="select.value"
                  :checked="isChecked(select.value)"
                  @change="updateInternational(select.value)"
                />

                <label
                  :for="`select-${select.value}`"
                  class="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary"
                >
                  {{ select.label }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-else key="professor" class="p-6 flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="prof-name">이름</label>
            <input
              id="prof-name"
              v-model="professorInfo.name"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="이름을 입력해주세요"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="prof-phone">
              전화번호
            </label>
            <input
              id="prof-phone"
              v-model="professorInfo.phone"
              type="tel"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="010-xxxx-xxxx"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
            <label class="block text-sm font-medium text-text-base" for="prof-email">이메일</label>
            <input
              id="prof-email"
              v-model="professorInfo.email"
              type="email"
              disabled
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm bg-gray-100 text-text-muted sm:text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </Transition>

      <div class="flex justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200">
        <button
          @click="goBack"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-base text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          취소
        </button>
        <button
          @click="submitRegister"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          회원가입 완료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { professorRegister, studentRegister } from '@/api/auth'
import { reactive, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = route.query.email
const token = route.query.token
const registerType = ref('student')
const smartPhone = /^010-?\d{4}-?\d{4}$/

// 상태 관리
const studentInfo = reactive({
  name: '',
  user_id: '',
  phone: '',
  email: email,
  grade_id: 1, // 기본값 1학년
  language_id: 'JP',
  token: token,
  is_international: '', // 유학생 여부 기본값 (아니요)
})

const professorInfo = reactive({
  name: '',
  phone: '',
  email: email,
  token: token,
})

const registerTypes = [
  { label: 'student', value: 1 },
  { label: 'professor', value: 2 },
]

// 학년 데이터
const grades = [
  { label: '1학년', value: 1 },
  { label: '2학년', value: 2 },
  { label: '3학년', value: 3 },
]

const yseORno = [
  { label: 'yes', value: 1 },
  { label: 'no', value: 2 },
]

const submitRegister = async () => {
  // 유효성 검사
  if (registerType.value === 'student') {
    if (!studentInfo.name) {
      alert('학생 이름을 입력해주세요.')
      return
    }
    if (registerType.value === 'student' && !studentInfo.user_id) {
      alert('학번을 입력해주세요.')
      return
    }
    if (registerType.value === 'student' && studentInfo.user_id.length > 7) {
      alert('학번은 7자리 입니다.')
      return
    }
    if (!smartPhone.test(studentInfo.phone)) {
      alert('전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678')
      return
    }
    if (!studentInfo.token) {
      alert('유효하지 않은 접근입니다. 다시 로그인해주세요.')
      router.push('/login')
      return
    }
  } else if (registerType.value === 'professor') {
    if (!professorInfo.name) {
      alert('교수님 이름을 입력해주세요')
    }
    if (!smartPhone.test(professorInfo.phone)) {
      alert('전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678')
      return
    }
    if (!professorInfo.token) {
      alert('유효하지 않은 접근입니다. 다시 로그인해주세요.')
      router.push('/login')
      return
    }
  }
  try {
    if (registerType.value === 'student') {
      console.log(studentInfo)
      await studentRegister(studentInfo)
      alert('학생 회원가입 요청이 완료되었습니다.')
    } else {
      console.log(professorInfo)
      await professorRegister(professorInfo)
      alert('교수님 회원가입 요청이 완료되었습니다.')
    }
    router.push({ path: '/registerWait' })
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message

    if (errorMessage === '이메일, 학번, 이름, 전화번호는 필수 항목입니다.') alert(errorMessage)
    else if (errorMessage === '전화번호 형식이 올바르지 않습니다.') alert(errorMessage)
    else if (errorMessage === '이미 가입된 이메일입니다.') alert(errorMessage)
    else if (errorMessage === '이미 등록된 학번입니다.') alert(errorMessage)
    else alert('오류가 발생했습니다: ' + errorMessage)

    console.error(err)
  }
}

watch(
  () => studentInfo.studentId,
  (newNum, oldNum) => {
    if (newNum.length >= 8) {
      console.log('삐용삐용 한도초과')
    }
  },
)

watchEffect(() => {
  console.log(registerType.value)
  console.log(studentInfo.language_id)
  console.log(studentInfo.is_international)
})

// ui 표시용
const isChecked = (val) => {
  if (val === 1) return studentInfo.is_international === true
  if (val === 2) return studentInfo.is_international === false
  return false
}

const updateInternational = (val) => {
  if (val === 1) {
    studentInfo.is_international = 'korean'
    studentInfo.language_id = 'KR'
    console.log('유학생입니다 (True)')
  } else {
    studentInfo.is_international = 'international'
    studentInfo.language_id = 'JP'
    console.log('유학생이 아닙니다 (False)')
  }
}

const typeNameChange = (type) => {
  if (type === 'student') return '학생'
  if (type === 'professor') return '교수'
}

const goBack = () => {
  router.push({ path: '/login' })
}
</script>

<style scoped>
/* 부드러운 전환을 위한 CSS */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
