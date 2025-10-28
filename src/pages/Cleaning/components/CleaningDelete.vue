<template>
  <div>
    <form @submit.prevent="onSubmit">
        <label>학기</label>
        <div>
            <select v-model="formData.section">
                <option value="">학기 선택</option>
                <option v-for="s in sectionLists" :key="s.sec_id" :value="s.sec_id">
                    {{ s.label }}
                </option>
            </select>
        </div>

        <label>해당 학년</label>
        <div>
            <select v-model="selectGrade">
                <option value="">학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
            </select>
        </div>
        
        <button type="submit">삭제</button>
    </form>
  </div>
</template>

<script setup>
import { deleteCleaningRoster } from '@/api/cleaningApi'
import { getSection } from '@/api/jobApi'
import { onMounted, ref } from 'vue'

const sectionLists = ref([]);
const selectGrade = ref('');


const formData = ref({
    section: '',
    grade_id: '',
})

async function onSubmit() {
    formData.value.grade_id = selectGrade.value

    console.log(formData.value)

    if (!formData.value.section && !formData.value.grade_id) {
        alert("학기와 학년을 모두 선택하세요")
        return
    }

    await deleteCleaningRoster(formData.value)
    alert('삭제완료');
    
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