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
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">수정</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id" class="divide-y divide-gray-200 hover:bg-gray-50">
            <!-- ====================  권한  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="user.user_id == putUser.user_id">
                <select
                  id="role_type"
                  v-model="putUser.role_type"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="professor">교수님</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              <div v-else>
                {{ user.role_type == 'professor' ? '교수님' : '관리자' }}
              </div>
            </td>
            <!-- ====================  학번  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.user_id }}
            </td>
            <!-- ====================  이름  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="user.user_id == putUser.user_id">
                <input
                  type="text"
                  id="name"
                  v-model="putUser.name"
                  class="w-20 px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div v-else>
                {{ user.name }}
              </div>
            </td>
            <!-- ====================  email  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ user.email }}
            </td>
            <!-- ====================  전화번호  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="user.user_id == putUser.user_id">
                <input
                  type="text"
                  v-model="putUser.phone"
                  placeholder="010-xxxx-xxxx"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div v-else>
                {{ user.phone }}
              </div>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="user.user_id == putUser.user_id">
                <button
                  @click="handleSubmit"
                  class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
                >
                  등록
                </button>
              </div>
              <div v-else>
                <button
                  @click="setPut(user)"
                  class="px-3 py-1 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  수정
                </button>
              </div>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div v-if="user.user_id == putUser.user_id">
                <button
                  @click="resetUser"
                  class="px-3 py-1 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  취소
                </button>
              </div>
              <div v-else>
                <button
                  @click="handleDelete(user.user_id)"
                  class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm"
                >
                  삭제
                </button>
              </div>
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
import { getAdminsInfo, delUser, putAdmin } from '@/api/adminApi'

const users = ref(null) // 사용자 데이터
const putUser = ref() // 수정 user

// 관리자, 교수 데이터 API 요청
const setUserData = async () => {
  users.value = await getAdminsInfo()
}
// 수정 정보 초기화
const resetUser = () => {
  putUser.value = {
    user_id: undefined,
    role_type: undefined,
    name: undefined,
    phone: undefined,
  }
}

// 초기화
onMounted(async () => {
  // 관리자 및 교수 정보 조회
  setUserData()
  resetUser()
})

// ===========================  수정  ===========================
const setPut = (user) => {
  putUser.value = {
    user_id: user.user_id,
    role_type: user.role_type,
    name: user.name,
    phone: user.phone,
  }
}

const handleSubmit = async () => {
  if (confirm(`${putUser.value.name}님의 정보를 수정합니까?`)) {
    await putAdmin(putUser.value)
    // 초기화
    setUserData()
  }
  resetUser()
}

// ===========================  삭제  ===========================
const handleDelete = async (id) => {
  if (confirm(`${id}번 사용자를 삭제합니다`)) {
    await delUser(id)
    // 사용자 정보 초기화
    setUserData()
  }
}
</script>
