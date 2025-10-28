import apiClient from "@/api";

// google 로그인 요청
export const googleLogin = () => {
  window.location.href = `${apiClient.defaults.baseURL}/auth`
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

  const response = await apiClient.post('auth/register', formData, {
    headers: {
      "content-Type": "application/json"
    }
  })
  return response.data
}

