<template>
  <!-- Overlay -->
  <div @click.self="closeModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">

    <!-- Modal Content -->
    <div class="bg-bg-paper rounded-card shadow-lg p-6 border border-gray-200 max-w-sm w-full relative">
      <h3 class="text-xl font-bold text-text-heading mb-4">청소 기록 삭제</h3>
      <form @submit.prevent="onSubmit" class="mt-4">
          <div class="mb-4">
              <label for="section-select" class="block text-sm font-medium text-text-base mb-1">학기</label>
              <select v-model="formData.section" id="section-select"
                      class="block w-full px-3 py-2 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="">학기 선택</option>
                  <option v-for="s in sectionLists" :key="s.sec_id" :value="s.sec_id">
                      {{ s.label }}
                  </option>
              </select>
          </div>

          <div class="mb-6">
              <label for="grade-select" class="block text-sm font-medium text-text-base mb-1">해당 학년</label>
              <select v-model="selectGrade" id="grade-select"
                      class="block w-full px-3 py-2 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="">학년</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
              </select>
          </div>

          <div class="flex justify-end gap-2">
            <button type="submit"
                    class="px-4 py-2 bg-red-500 text-white rounded-base text-sm font-medium shadow-sm hover:bg-red-600 transition-colors duration-200">
              삭제
            </button>
            <button type="button" @click="closeModal"
                    class="px-4 py-2 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200">
              취소
            </button>
          </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { deleteCleaningRoster } from '@/api/cleaningApi'
import { getSection } from '@/api/jobApi'
import { onMounted, ref, defineEmits } from 'vue'

const emit = defineEmits(['close']);

const sectionLists = ref([]);
const selectGrade = ref('');

const formData = ref({
    section: '',
    grade_id: '',
})

function closeModal() {
  emit('close');
}

async function onSubmit() {
    formData.value.grade_id = selectGrade.value

    if (!formData.value.section || !formData.value.grade_id) {
        alert("학기와 학년을 모두 선택하세요")
        return
    }

    const confirmed = confirm(`${formData.value.section} 학기의 ${selectGrade.value}학년 청소 당번을 모두 삭제하시겠습니까?`);
    if (confirmed) {
      await deleteCleaningRoster(formData.value)
      alert('삭제완료');
      closeModal();
    }
}

async function fetchData() {
    const sectionRes = await getSection()
    sectionLists.value = Array.isArray(sectionRes) ? sectionRes : sectionRes.data
}

onMounted(() => {
    fetchData();
})

</script>

<style>

</style>
