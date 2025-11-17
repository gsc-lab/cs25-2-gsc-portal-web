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

<template>
  <div style="background-color: cornsilk; margin: 3px">
    UserMgmt

    <!-- ==============  데이터 출력 및 수정 ============== -->
    <div>
      <table style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 10px">권한</th>
            <th style="border: 1px solid #000; padding: 10px">번호</th>
            <th style="border: 1px solid #000; padding: 10px">이름</th>
            <th style="border: 1px solid #000; padding: 10px">이메일</th>
            <th style="border: 1px solid #000; padding: 10px">전화번호</th>
            <th style="border: 1px solid #000; padding: 10px">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user">
            <!-- ====================  권한  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              {{ user.role_type == 'professor' ? '교수' : '관리자' }}
            </td>
            <!-- ====================  학번  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">{{ user.user_id }}</td>
            <!-- ====================  이름  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              {{ user.name }}
            </td>
            <!-- ====================  email  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">{{ user.email }}</td>
            <!-- ====================  전화번호  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              {{ user.phone }}
            </td>
            <td style="border: 1px solid #000; padding: 10px">
              <button @click="handleDelete(user.user_id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
