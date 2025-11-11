<template>
  <AppLayout pageName="register">
    <div class="register-container">
      <h1 class="register-title">GSC_Portal</h1>

      <div class="form-group">
        <label class="form-label">이름:</label>
        <input
          v-model="userInfo.name"
          type="text"
          class="form-input"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label class="form-label">학번:</label>
        <input
          v-model="userInfo.studentId"
          type="text"
          class="form-input"
          placeholder="학번을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label class="form-label">전화번호:</label>
        <input
          v-model="userInfo.phoneNumber"
          type="tel"
          class="form-input"
          placeholder="010-xxxx-xxxx"
        />
      </div>

      <div class="form-group">
        <label class="form-label">이메일:</label>
        <input
          v-model="userInfo.email"
          type="email"
          class="form-input"
          placeholder="abcdef@gmail.com"
        />
      </div>

      <div class="form-group">
        <label class="form-label">학생 여부</label>
        <input v-model="userInfo.is_student" type="checkbox" class="form-checkbox" />
      </div>

      <button class="btn-submit" @click="submitRegister">회원가입</button>

      <!-- 등록된 유저 정보 확인 -->
      <!-- <pre class="result-box">{{ userInfo }}</pre> -->
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
  is_student: false
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
    token: token // 읽어온 토큰을 데이터에 포함
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
    console.error(err)
    alert('회원가입 요청이 실패했습니다.')
  }
}
</script>
<style>
/* 전체 컨테이너 */
.register-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 25px;
  background: #f9fbff;
  border: 1px solid #d3e2f5;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

/* 제목 */
.register-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: bold;
  color: #005eff;
}

/* 입력 그룹 */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* 라벨 */
.form-label {
  flex: 0 0 100px;
  font-weight: bold;
  color: #333;
}

/* 텍스트 입력 */
.form-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 14px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus {
  border-color: #005eff;
  box-shadow: 0 0 4px rgba(0, 94, 255, 0.4);
  outline: none;
}

/* 체크박스 */
.form-checkbox {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  cursor: pointer;
}

/* 버튼 */
.btn-submit {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: #005eff;
  color: white;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #0041c2;
}

/* 결과 박스 */
.result-box {
  margin-top: 20px;
  padding: 12px;
  background: #f3f6fa;
  border: 1px solid #d9e3f5;
  border-radius: 6px;
  font-size: 13px;
  color: #444;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
