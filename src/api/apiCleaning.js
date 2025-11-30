import api from "./apiClient";

// 청소 당번 주간 호출 API
// formData : 학년 정보, 날짜 정보 ( 학년 정보가 없을 경우에는 전체 호출 )
export const getCleaningRoster = async (formData) => {
  const cleaningRoster = await api.get('/cleaning-rosters', {
    params: formData.value
  })

  return cleaningRoster.data
}

// 청소 당번 한달 호출 API (monthly)
export const getCleaningRosterMonthly = async () => {
  const response = await api.get('/cleaning-rosters/monthly')

  return response.data
}


// 학기 목록 조회
export const getSections = async () => {
  const section = await api.get('/modal/setctions')
  return section.data.data
}

// 강의실 목록 조회
export const getClassRooms = async () => {
  const classRooms = await api.get('/modal/common/classrooms')

  return classRooms.data.data
}

// 청소 로스터 추가
export const postCleaningRoster = async (roster) => {
  const createRoster = await api.post('/cleaning-rosters/generate', roster, {
    headers: { 'Content-Type': 'application/json' }
  })
  return createRoster.data
}
