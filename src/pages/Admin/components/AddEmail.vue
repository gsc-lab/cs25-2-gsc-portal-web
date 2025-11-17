<script setup>
import { ref, onMounted } from 'vue'
import { getEmail, postEmail, delEmail } from '@/api/adminApi'

const emailData = ref(null) // 이메일 데이터
const isOpen = ref(false) // 추가 / 수정 창
const inputEmail = ref(null) // 입력 받는 Email
const inputReason = ref(null) // 입력 받는 Reason

// 외부 이메일 조회
const setEmailData = async () => {
  emailData.value = await getEmail()
}

onMounted(async () => {
  setEmailData()
})

// ==============  추가  ===============
const handlePost = async () => {
  await postEmail(inputEmail.value, inputReason.value)
  setEmailData()
}

// ==============  삭제  ===============
const handleDelete = async (id) => {
  if (confirm(`${id}번 이메일을 삭제합니다`)) {
    await delEmail(id)
    setEmailData()
  }
}
</script>

<template>
  <div style="background-color: aliceblue; margin: 3px">
    AddEmail

    <div>
      <button @click="isOpen = true">등록</button>
      <template v-if="isOpen">
        <div>
          <label for="email">Email : </label>
          <input id="email" v-model="inputEmail" />
        </div>
        <div>
          <label for="reason">이름 : </label>
          <input id="reason" v-model="inputReason" />
        </div>

        <button @click="handlePost">등록</button>
      </template>
    </div>

    <table style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>
          <th style="border: 1px solid #000; padding: 10px"></th>
          <th style="border: 1px solid #000; padding: 10px">이름</th>
          <th style="border: 1px solid #000; padding: 10px">이메일</th>
          <th style="border: 1px solid #000; padding: 10px">삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in emailData" :key="data">
          <td style="border: 1px solid #000; padding: 10px">{{ data.id }}</td>
          <td style="border: 1px solid #000; padding: 10px">{{ data.reason }}</td>
          <td style="border: 1px solid #000; padding: 10px">{{ data.email }}</td>
          <td style="border: 1px solid #000; padding: 10px">
            <button @click="handleDelete(data.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
