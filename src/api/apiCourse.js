import apiClient from "./index";

// ============= 모든 과목 데이터 조회 API 요청 ==============

export const getCourse = async () => {
  const Course = await apiClient.get('/notices/form/courses')
  return Course.data
}
