<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-text-heading mb-4">관리자 및 교수 목록</h3>

    <!-- ==============  데이터 출력 ============== -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-subtle bg-bg-paper">
      <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">권한</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">번호</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">이름</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">이메일</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">전화번호</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id" class="divide-y divide-gray-200 hover:bg-gray-50">
            <!-- ====================  권한  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.role_type == 'professor' ? '교수' : '관리자' }}
            </td>
            <!-- ====================  학번  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.user_id }}
            </td>
            <!-- ====================  이름  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.name }}
            </td>
            <!-- ====================  email  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.email }}
            </td>
            <!-- ====================  전화번호  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.phone }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <button @click="handleDelete(user.user_id)" class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!users || users.length === 0" class="text-center text-text-muted text-lg py-8">
        사용자 정보가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminsInfo, delUser } from '@/api/adminApi'

const users = ref(null) // 사용자 데이터

// 관리자, 교수 데이터 API 요청
const setUserData = async () => {
  users.value = await getAdminsInfo()
}

// 초기화
onMounted(async () => {
  // 관리자 및 교수 정보 조회
  setUserData()
})

// ===========================  삭제  ===========================
const handleDelete = async (id) => {
  if (confirm(`${id}번 사용자를 삭제합니다`)) {
    await delUser(id)
    // 사용자 정보 초기화
    setUserData()
  }
}
</script>
