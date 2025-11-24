<template>
  <AppLayout pageName="register">
    <div
      class="max-w-md mx-auto w-full bg-white rounded-card border border-gray-200 shadow-subtle p-6 mt-12"
    >
      <h1 class="text-xl font-bold text-text-heading mb-6 text-center">회원가입</h1>

      <div class="mb-4">
        <label class="text-sm font-medium text-text-muted mb-1 block">이름:</label>
        <input
          v-model="userInfo.name"
          type="text"
          class="w-full rounded-base border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div class="mb-4">
        <label class="text-sm font-medium text-text-muted mb-1 block">학번:</label>
        <input
          v-model="userInfo.studentId"
          type="text"
          class="w-full rounded-base border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="학번을 입력하세요"
        />
      </div>

      <div class="mb-4">
        <label class="text-sm font-medium text-text-muted mb-1 block">전화번호:</label>
        <input
          v-model="userInfo.phoneNumber"
          type="tel"
          class="w-full rounded-base border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="010-xxxx-xxxx"
        />
      </div>

      <div class="mb-4">
        <label class="text-sm font-medium text-text-muted mb-1 block">이메일:</label>
        <input
          v-model="userInfo.email"
          type="email"
          class="w-full rounded-base border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="abcdef@gmail.com"
        />
      </div>

      <div class="flex items-center mb-6">
        <input
          v-model="userInfo.is_student"
          id="is_student"
          type="checkbox"
          class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
        <label for="is_student" class="ml-2 text-sm font-medium text-text-muted">학생 여부</label>
      </div>

      <button
        class="bg-primary text-white px-4 py-2 rounded-base w-full hover:bg-primary-dark transition-colors duration-200"
        @click="submitRegister"
      >
        회원가입
      </button>
    </div>
  </AppLayout>
</template>

<script setup>
import router from '@/router'
import { userRegister } from '@/api/auth'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

// URL의 쿼리 파라미터에서 토큰을 읽어옴
const route = useRoute()
const token = route.query.token

const userInfo = reactive({
  name: '',
  studentId: '',
  phoneNumber: '',
  email: '',
  is_student: false,
})

const submitRegister = async () => {
  if (
    userInfo.name === '' ||
    userInfo.studentId === '' ||
    userInfo.phoneNumber === '' ||
    userInfo.email === ''
  ) {
    alert('회원입력 정보를 입력해주세요')
    return
  }

  const userData = {
    name: userInfo.name,
    user_id: userInfo.studentId,
    phone: userInfo.phoneNumber,
    email: userInfo.email,
    is_student: userInfo.is_student,
    token: token, // 읽어온 토큰을 데이터에 포함
  }

  // 토큰이 없는 경우 예외 처리
  if (!userData.token) {
    alert('유효하지 않은 접근입니다. 다시 로그인해주세요.')
    router.push('/login')
    return
  }

  try {
    await userRegister(userData)
    alert('회원가입 요청이 완료되었습니다.')
    router.push({ path: '/registerWait' })
  } catch (err) {
    const errorMessage = err.reponse?.data?.message || err.message

    if (errorMessage === '이메일, 학번, 이름, 전화번호는 필수 항목입니다.') {
      alert('이메일, 학번, 이름, 전화번호는 필수 항목입니다.')
      router.push({ path: '/login' })
    }

    if (errorMessage === '전화번호 형식이 올바르지 않습니다.') {
      alert('전화번호 형식이 올바르지 않습니다.')
      router.push({ path: '/login' })
    }

    if (errorMessage === '이미 가입된 이메일입니다.') {
      alert('이미 가입된 이메일입니다.')
      router.push({ path: '/login' })
    }

    if (errorMessage === '이미 등록된 학번입니다.') {
      alert('이미 등록된 학번입니다.')
      router.push({ path: '/login' })
    }
    console.error(err)
  }
}
</script>
