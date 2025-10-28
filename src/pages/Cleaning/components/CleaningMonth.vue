<template>
    <div>
        <h2>{{ monthLabel }}</h2>

        <div
            v-for="(day, index) in monthData.days"
            :key="index"
        >
        <h3> {{ formatDate(day.work_date) }}</h3>
        
        <div
            v-for="(item, i) in day.rosters"
            :key="i"
        >
        <h4>{{ item.grade_id }}학년 - {{ item.classroom_name }}</h4>
        <div
            v-for="(member, i) in item.members"
            :key="i"
        >
            <p>{{ member }}</p>

        </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { monthCleaningRoster } from '@/api/cleaningApi';

const monthData = ref({ days: [] })

const monthLabel = computed(() => {
    const now = new Date()
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 청소 당번`
})

function formatDate(dateStr) {
    const d = new Date(dateStr)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`
}

onMounted(async () => {
    try {
        const res = await monthCleaningRoster()
        monthData.value = res.data ?? res
    } catch (error) {
        console.error('월간 청소 데이터 조회 실패', error)
    }
})
</script>

<style>

</style>