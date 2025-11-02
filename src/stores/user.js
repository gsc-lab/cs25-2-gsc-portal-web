import { getUserInfo } from "@/api/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {

  const userInfo = ref([])
  const isLoading = ref(false)
  const error = ref('')

  async function fetchUser() {
    isLoading.value = true

    try {
      const response = await getUserInfo()
      userInfo.value = response
      console.log("사용자 정보", userInfo.value)
    } catch {
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
