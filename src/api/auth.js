import api from "./apiClient";

// google 로그인 요청
export const googleLogin = () => {
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

  const response = await api.post('auth/register', formData, {
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

// 사용자 성정 등록

export const postUserGrade = async (scoreData, files) => {
  let response

  if (files.length > 0) {
    const formData = new FormData()

    Object.entries(scoreData).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    })

    if (files && files.length > 0) {
      for (const file of files) {
        formData.append("files", file)
      }
    }
    console.log("파일 포함 form Data 전송", formData)
    response = await api.post('/auth/me', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  } else {
    console.log("파일 x 전송", scoreData)
    response = await api.post('auth/me', scoreData, {
      headers: { "Content-Type": "application/json" }
    })
  }
  return response.data


}

// 사용자 로그아웃 요청 API
export const postuserInfo = async () => {
  const userInfo = await api.post('/auth/logout')

  return userInfo.data
}
