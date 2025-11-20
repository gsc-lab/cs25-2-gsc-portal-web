<template>
  <!-- Overlay -->
  <div @click.self="closeModal" 
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); 
        display: flex; justify-content: center; align-items: center; z-index: 99;">
    
    <!-- Modal Content -->
    <div style="background-color: lightcoral; padding: 20px; border: 2px solid red; z-index: 100; border-radius: 8px;">
      <h4>삭제할 학기와 학년을 선택하세요</h4>
      <form @submit.prevent="onSubmit" style="margin-top: 15px;">
          <label>학기</label>
          <div>
              <select v-model="formData.section">
                  <option value="">학기 선택</option>
                  <option v-for="s in sectionLists" :key="s.sec_id" :value="s.sec_id">
                      {{ s.label }}
                  </option>
              </select>
          </div>

          <label style="margin-top: 10px; display: block;">해당 학년</label>
          <div>
              <select v-model="selectGrade">
                  <option value="">학년</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
              </select>
          </div>
        
          <div style="margin-top: 20px; text-align: right;">
            <button type="submit">삭제</button>
            <button type="button" @click="closeModal" style="margin-left: 10px;">취소</button>
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
