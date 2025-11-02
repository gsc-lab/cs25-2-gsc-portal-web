import apiClient from "./index"

export const getAllUser = async () => {
  const user = await apiClient.get('/admin/students')
  return user
}
