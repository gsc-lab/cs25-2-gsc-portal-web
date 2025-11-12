import { getUserInfo } from "@/api/auth";
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/apiClient";

export const useUserStore = defineStore('user', () => {

  // 유저 정보 저장
  const userInfo = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchUser() {
    isLoading.value = true
    error.value = null

    const response = await getUserInfo()

    userInfo.value = response
    isLoading.value = false
  }

  function logoutUser() {
    userInfo.value = null
    error.value = null
    isLoading.value = false

    localStorage.removeItem('accessToken')
    delete api.defaults.headers.common['Authorization'];
  }

  return {
    fetchUser,
    isLoading,
    error,
    userInfo,
    logoutUser,
  }
})
