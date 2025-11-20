import api from "./apiClient";

// ============= 학년별 과목 조회 API 요청 ==============

export const getCourse = async () => {
  const course = await api.get('/notices/form/courses/')

  return course.data;
}
