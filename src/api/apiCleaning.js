import apiClient from "./index";

// 청소 당번 호출 API
// formData : 학년 정보, 날짜 정보 ( 학년 정보가 없을 경우에는 전체 호출 )
export const getCleaningRoster = async (formData) => {
  const cleaningRoster = await apiClient.get('/cleaning-rosters', {
    params: formData.value
  })

  return cleaningRoster.data
}

// 학기 목록 조회
export const getSections = async () => {
  const section = await apiClient.get('/modal/setctions')

  return section.data
}

// 강의실 목록 조회
export const getClassRooms = async () => {
  const classRooms = await apiClient.get('/modal/common/classrooms')

  return classRooms.data
}
