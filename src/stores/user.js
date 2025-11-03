import { getUserInfo } from "@/api/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {

  const userInfo = ref(null)
  const isLoading = ref(false)
  const error = ref('')

  async function fetchUser() {
    isLoading.value = true

    try {
      const response = await getUserInfo()
      userInfo.value = response
    } catch (err) {
      console.warn("유저 정보 불러오기 실패", err)
      userInfo.value = null
    } finally {
      isLoading.value = false
    }
  }

  function logoutUser() {
    userInfo.value = null
  }

  return {
    fetchUser,
    isLoading,
    error,
    userInfo,
    logoutUser,
  }
})
