import api from "./apiClient";

// ============= 모든 과목 데이터 조회 API 요청 ==============

export const getCourse = async () => {
  const Course = await api.get('/notices/form/courses')
  return Course.data
}

// ============= 정규 과목 데이터 조회 API 요청 ==============

export const getRegular = async (grade) => {
  const Regular = await api.get('/modal/subjects/courses/regular', {
    params: grade
  })

  return Regular.data
}

// ============= 특강 과목 데이터 조회 API 요청 ==============

export const getSpecial = async (grade) => {
  const special = await api.get('/modal/subjects/courses/special', {
    params: grade
  })

  return special.data
}

// ============= 한국어 과목 데이터 조회 API 요청 ==============

export const getKorean = async (grade) => {
  const korean = await api.get('/modal/subjects/courses/korean/classes', {
    params: grade
  })

  return korean.data
}
