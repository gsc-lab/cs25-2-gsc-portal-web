import api from "./apiClient";

// =============== 전체 메인 조회 API 요청 ===============

export const getDashBoard = async (dashBoardData) => {
  const dashBoard = await api.get('/dashboard/', {
    params: dashBoardData
  })

  return dashBoard.data;

}
