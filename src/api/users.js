import api from "./apiClient"

// 모든 학생 정보 요청
export const getAllUser = async () => {
  const user = await api.get('/admin/students')
  return user
}
