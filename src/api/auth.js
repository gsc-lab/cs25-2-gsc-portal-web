import api from '@/api/apiClient'

// google 로그인 요청
export const googleLogin = () => {
  window.location.href = `${api.defaults.baseURL}/auth`
}

// 회원가입 요청 API 학생
export const studentRegister = async (data) => {

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })

  console.log([...formData.entries()])

  const response = await api.post('auth/register/student', formData, {
    headers: {
      "content-Type": "application/json"
    }
  })
  return response.data
}

// 회원가입 요청 API 교수
export const professorRegister = async (data) => {

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })

  console.log([...formData.entries()])

  const response = await api.post('auth/register/professor', formData, {
    headers: {
      "content-Type": "application/json"
    }
  })
  return response.data
}

// 사용자 정보 요청 API

export const getUserInfo = async () => {
  const userInfo = await api.get('/auth/me')

  return userInfo.data
}

// 사용자 성적 등록

export const postUserGrade = async (formData) => {

  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  const userGrade = await api.post('/auth/me', formData, {
    headers: { 'Content-Type': 'mutipart/form-data' }
  })

  return userGrade.data
}

// 사용자 성적 조회

export const getUserGrade = async () => {
  const userGrade = await api.get('/auth/me/exam')

  return userGrade.data
}

// 사용자 로그아웃 요청 API
export const postuserInfo = async (formData) => {
  const userInfo = await api.post('/auth/logout', formData, {
    headers: { "Content-Type": "mutipart/form-data" }
  })

  return userInfo.data
}
