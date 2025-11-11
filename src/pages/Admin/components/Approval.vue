<script setup>
import { ref, onMounted } from 'vue'
import { getApproval, postApproval } from '@/api/adminApi';

const approval = ref(null)        // 승인 대기 사용자 데이터

onMounted(async () =>  {
  approval.value = await getApproval()
})

// 승인 / 거절 등록
const handleSubmit = async (user_id, action) => {
  await postApproval(user_id, action)
  approval.value = await getApproval()
}

</script>

<template>
  <div style="background-color: azure; margin: 3px; ">
  approval

  <table style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr>
        <th style=" border: 1px solid #000; padding: 10px;">권한</th>
        <th style=" border: 1px solid #000; padding: 10px;">이름</th>
        <th style=" border: 1px solid #000; padding: 10px;">학번</th>
        <th style=" border: 1px solid #000; padding: 10px;">승인 여부</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="appUser in approval">
        <td style=" border: 1px solid #000; padding: 10px;">{{ appUser.role_type }}</td>
        <td style=" border: 1px solid #000; padding: 10px;">{{ appUser.name }}</td>
        <td style=" border: 1px solid #000; padding: 10px;">{{ appUser.user_id }}</td>
        <td style=" border: 1px solid #000; padding: 10px;">
          <button @click="handleSubmit(appUser.user_id, 'active')">승인 |</button>{{' '}}
          <button @click="handleSubmit(appUser.user_id, 'inactive')">거절</button>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
