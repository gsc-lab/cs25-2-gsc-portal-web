<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-text-heading mb-4">외부 이메일 등록</h3>

    <button @click="isOpen = !isOpen" class="px-4 py-2 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200 mb-4">
      {{ isOpen ? '폼 닫기' : '이메일 등록 폼 열기' }}
    </button>

    <div v-if="isOpen" class="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-text-base mb-1">Email : </label>
        <input id="email" v-model="inputEmail" type="email" class="block w-full px-3 py-2 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
      </div>
      <div class="mb-4">
        <label for="reason" class="block text-sm font-medium text-text-base mb-1">이름 / 사유 : </label>
        <input id="reason" v-model="inputReason" type="text" class="block w-full px-3 py-2 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
      </div>

      <div class="flex justify-end">
        <button @click="handlePost" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm">등록</button>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-subtle bg-bg-paper">
      <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">ID</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">이름 / 사유</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">이메일</th>
            <th class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in emailData" :key="data.id" class="divide-y divide-gray-200 hover:bg-gray-50">
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">{{ data.id }}</td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">{{ data.reason }}</td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">{{ data.email }}</td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <button @click="handleDelete(data.id)" class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!emailData || emailData.length === 0" class="text-center text-text-muted text-lg py-8">
        등록된 외부 이메일이 없습니다.
      </div>
    </div>
  </div>
</template>

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
  if (!inputEmail.value || !inputReason.value) {
    alert('이메일과 이름을 모두 입력해주세요.');
    return;
  }
  try {
    await postEmail(inputEmail.value, inputReason.value)
    alert('이메일이 성공적으로 등록되었습니다.');
    inputEmail.value = null;
    inputReason.value = null;
    isOpen.value = false; // Close form after submission
    setEmailData()
  } catch (error) {
    console.error('이메일 등록 실패:', error)
    alert('이메일 등록에 실패했습니다.');
  }
}

// ==============  삭제  ===============
const handleDelete = async (id) => {
  if (confirm(`${id}번 이메일을 삭제합니다`)) {
    try {
      await delEmail(id)
      alert('이메일이 성공적으로 삭제되었습니다.');
      setEmailData()
    } catch (error) {
      console.error('이메일 삭제 실패:', error)
      alert('이메일 삭제에 실패했습니다.');
    }
  }
}
</script>
