<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-text-heading mb-4">사용자 승인</h3>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-subtle bg-bg-paper">
      <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              권한
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              이름
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              학번
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              학년
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              전화번호
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              이메일
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              승인 여부
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="appUser in approval"
            :key="appUser.user_id"
            class="divide-y divide-gray-200 hover:bg-gray-50"
          >
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ appUser.role_type }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ appUser.name }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ appUser.user_id }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ appUser.grade_name }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ appUser.phone }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ appUser.email }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div class="flex gap-2 justify-center">
                <button
                  @click="handleSubmit(appUser, 'active')"
                  class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
                >
                  승인
                </button>
                <button
                  @click="handleSubmit(appUser, 'inactive')"
                  class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm"
                >
                  거절
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="!approval || approval.length === 0"
        class="text-center text-text-muted text-lg py-8"
      >
        승인 대기중인 사용자가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getApproval, postApproval } from '@/api/adminApi'

const approval = ref(null) // 승인 대기 사용자 데이터

onMounted(async () => {
  approval.value = await getApproval()
})

// 승인 / 거절 등록
const handleSubmit = async (user, action) => {
  try {
    if (confirm(`${user.name} 님을 ${action === 'active' ? '승인' : '거절'}하시겠습니까?`)) {
      await postApproval(user.user_id, action)
      approval.value = await getApproval() // Refresh data
    }
  } catch (error) {
    console.error('승인/거절 처리 실패:', error)
    alert('승인/거절 처리 중 오류가 발생했습니다.')
  }
}
</script>
