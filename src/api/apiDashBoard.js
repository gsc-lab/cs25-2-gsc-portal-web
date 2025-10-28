import apiClient from "./index";

export const getDashBoard = async (dashBoardData) => {
  const dashBoard = await apiClient.get('/dashboard/', {
    params: dashBoardData
  })

  return dashBoard.data
}
