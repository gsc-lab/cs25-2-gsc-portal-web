<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F7] py-12 px-4 font-sans">
    <div
      class="w-full max-w-[520px] bg-white rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in-up"
    >
      <div class="pt-10 pb-6 px-10 text-center">
        <h1 class="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
          {{ typeNameChange(registerType) }} 계정 생성
        </h1>
        <p class="text-[15px] text-[#86868b] mt-2">필수 정보를 입력하여 가입을 완료하세요.</p>
      </div>

      <div class="px-10 mb-8">
        <div class="relative bg-[#7676801f] p-1 rounded-[12px] flex h-[40px]">
          <div
            class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[9px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-0"
            :class="registerType === 'student' ? 'left-1' : 'left-[calc(50%+2px)]'"
          ></div>

          <button
            v-for="type in registerTypes"
            :key="type.value"
            @click="registerType = type.label"
            class="flex-1 relative z-10 text-[13px] font-medium transition-colors duration-200 focus:outline-none"
            :class="
              registerType === type.label ? 'text-[#1d1d1f]' : 'text-[#86868b] hover:text-[#1d1d1f]'
            "
          >
            {{ typeNameChange(type.label) }}
          </button>
        </div>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="registerType === 'student'" key="student" class="px-10 pb-10 space-y-6">
          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1" for="user-name">이름</label>
            <input
              id="user-name"
              v-model="studentInfo.name"
              type="text"
              class="apple-input"
              placeholder="이름을 입력해주세요"
            />
            <p v-if="errors.name" class="text-[12px] text-[#FF3B30] ml-1">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1" for="student-id">학번</label>
            <input
              id="student-id"
              v-model="studentInfo.user_id"
              type="text"
              class="apple-input"
              placeholder="7자리 학번 입력"
              maxlength="7"
            />
            <p v-if="errors.user_id" class="text-[12px] text-[#FF3B30] ml-1">
              {{ errors.user_id }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1" for="phone-number">
              전화번호
            </label>
            <input
              id="phone-number"
              v-model="studentInfo.phone"
              type="tel"
              class="apple-input"
              placeholder="010-0000-0000"
            />
            <p v-if="errors.phone" class="text-[12px] text-[#FF3B30] ml-1">{{ errors.phone }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1">이메일</label>
            <input
              v-model="studentInfo.email"
              type="email"
              disabled
              class="apple-input bg-[#F5F5F7] text-[#86868b] cursor-not-allowed"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1">학년</label>
            <div class="flex gap-2">
              <button
                v-for="grade in grades"
                :key="grade.value"
                @click="studentInfo.grade_id = grade.value"
                class="flex-1 py-2.5 rounded-[12px] text-[14px] font-medium border transition-all duration-200"
                :class="
                  studentInfo.grade_id === grade.value
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-md'
                    : 'bg-white border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#F5F5F7]'
                "
              >
                {{ grade.label }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1">유학생 여부</label>
            <div class="flex gap-2">
              <button
                v-for="select in yseORno"
                :key="select.value"
                @click="updateInternational(select.value)"
                class="flex-1 py-2.5 rounded-[12px] text-[14px] font-medium border transition-all duration-200"
                :class="
                  isChecked(select.value)
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-md'
                    : 'bg-white border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#F5F5F7]'
                "
              >
                {{ select.label === 'yes' ? '예' : '아니요' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else key="professor" class="px-10 pb-10 space-y-6">
          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1" for="prof-name">이름</label>
            <input
              id="prof-name"
              v-model="professorInfo.name"
              type="text"
              class="apple-input"
              placeholder="이름을 입력해주세요"
            />
            <p v-if="errors.name" class="text-[12px] text-[#FF3B30] ml-1">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1" for="prof-phone">
              전화번호
            </label>
            <input
              id="prof-phone"
              v-model="professorInfo.phone"
              type="tel"
              class="apple-input"
              placeholder="010-0000-0000"
            />
            <p v-if="errors.phone" class="text-[12px] text-[#FF3B30] ml-1">{{ errors.phone }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-[13px] font-medium text-[#86868b] ml-1">이메일</label>
            <input
              v-model="professorInfo.email"
              type="email"
              disabled
              class="apple-input bg-[#F5F5F7] text-[#86868b] cursor-not-allowed"
            />
          </div>
        </div>
      </Transition>

      <div
        class="px-10 py-6 bg-[#F5F5F7]/50 border-t border-[#d2d2d7]/30 flex flex-col-reverse gap-3 md:flex-row md:justify-end"
      >
        <button
          @click="goBack"
          class="px-6 py-3 rounded-[14px] text-[15px] font-medium text-[#86868b] hover:bg-[#0000000d] transition-colors"
        >
          취소
        </button>
        <button
          @click="submitRegister"
          class="px-8 py-3 rounded-[14px] text-[15px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ED] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          회원가입 완료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { professorRegister, studentRegister } from '@/api/auth'
import { reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = route.query.email
const token = route.query.token
const registerType = ref('student')
const phoneRegex = /^010-?\d{3,4}-?\d{4}$/

// 에러 메시지
const errors = reactive({
  name: '',
  user_id: '',
  phone: '',
})

// 상태 관리
const studentInfo = reactive({
  name: '',
  user_id: '',
  phone: '',
  email: email,
  grade_id: '',
  language_id: '',
  token: token,
  is_international: '',
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

const grades = [
  { label: '1학년', value: 1 },
  { label: '2학년', value: 2 },
  { label: '3학년', value: 3 },
]

const yseORno = [
  { label: 'yes', value: 1 },
  { label: 'no', value: 2 },
]

// API 요청 전 예외 처리
const submitRegister = async () => {
  if (registerType.value === 'student') {
    if (!studentInfo.name) return alert('학생 이름을 입력해주세요.')
    if (!studentInfo.user_id) return alert('학번을 입력해주세요.')
    if (studentInfo.user_id.length !== 7) return alert('학번은 7자리 입니다.')
    if (!phoneRegex.test(studentInfo.phone)) return alert('전화번호를 올바르게 입력하세요')
    if (studentInfo.grade_id === '') return alert('학년을 선택해주세요.')
    if (studentInfo.is_international === '') return alert('유학생 여부를 선택해주세요')
    if (!studentInfo.token) {
      alert('유효하지 않은 접근입니다.')
      router.push('/login')
      return
    }
  } else if (registerType.value === 'professor') {
    if (!professorInfo.name) return alert('교수님 이름을 입력해주세요')
    if (!phoneRegex.test(professorInfo.phone)) return alert('전화번호 형식이 올바르지 않습니다.')
    if (!professorInfo.token) {
      alert('유효하지 않은 접근입니다.')
      router.push('/login')
      return
    }
  }

  try {
    if (registerType.value === 'student') {
      if (!errors.name && !errors.phone && !errors.user_id) await studentRegister(studentInfo)
      alert('학생 회원가입 요청이 완료되었습니다.')
    } else {
      await professorRegister(professorInfo)
      alert('교수님 회원가입 요청이 완료되었습니다.')
    }
    router.push({ path: '/registerWait' })
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message
    alert(errorMessage)
  }
}

// Watchers
watchEffect(() => {
  const targetInfo = registerType.value === 'student' ? studentInfo : professorInfo

  // Phone Validation
  if (targetInfo.phone && !phoneRegex.test(targetInfo.phone)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다 (010-XXXX-XXXX)'
  } else {
    errors.phone = ''
  }

  // Name Validation
  if (!targetInfo.name) {
    errors.name = '' // 초기엔 에러 안보이게 처리하거나 필요시 메시지 추가
  } else {
    errors.name = ''
  }

  // Student ID Validation
  if (registerType.value === 'student') {
    if (studentInfo.user_id && studentInfo.user_id.length !== 7) {
      errors.user_id = '학번 7자리를 입력해주세요'
    } else {
      errors.user_id = ''
    }
  }
})

// UI Helpers
const isChecked = (value) => {
  if (value === 1) return studentInfo.is_international === 'international'

  if (value === 1) return studentInfo.is_international === 'international'
  if (value === 2) return studentInfo.is_international === 'korean'
  return false
}

const updateInternational = (value) => {
  if (value === 1) {
    studentInfo.is_international = 'international'
    studentInfo.language_id = 'KR'
  } else {
    studentInfo.is_international = 'korean'
    studentInfo.language_id = 'JP'
  }
}

const typeNameChange = (type) => {
  if (type === 'student') return '학생'
  if (type === 'professor') return '교수'
  return ''
}

const goBack = () => {
  router.push({ path: '/login' })
}
</script>

<style scoped>
/* Apple System Fonts */
.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Common Input Style */
.apple-input {
  display: block;
  width: 100%;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  outline: none;
}

.apple-input:focus {
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.apple-input::placeholder {
  color: #86868b;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
