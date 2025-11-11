import api from "./apiClient";

// google 로그인 요청
export const googleLogin = () => {
  // '/api'가 중복되지 않도록 수정
  window.location.href = `${api.defaults.baseURL}/auth`
}

// 회원가입 요청 API
export const userRegister = async (data) => {

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })

  console.log([...formData.entries()])

  // 'api/'가 중복되지 않도록 수정
  const response = await api.post('/auth/register', formData, {
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

// 사용자 로그아웃 요청 API
export const postuserInfo = async () => {
  const userInfo = await api.post('/auth/logout')

  return userInfo.data
}
