import apiClient from "./index"

// 모든 학생 정보 요청 -> 현재 관리자만 가능 -> 교수도 되도록 변경해야할듯
export const getAllUser = async () => {
  const user = await apiClient.get('/admin/students')
  return user
}
