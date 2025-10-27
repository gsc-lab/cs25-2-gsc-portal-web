<template>
  <li>
    <h1>청소 리스트</h1>
    <div>
        <h3>{{ cleaningItem.grade_id }}학년 - {{ cleaningItem.classroom_name }}</h3>
    </div>

    <ul>
        <li v-for="(duty, i) in cleaningItem.weekly_duties"
        :key="i"
        >   
        <div>{{ duty.work_date }}</div>
        <div>{{ duty.members.join(', ') }}</div>
            
        </li>
    </ul>
  </li>
</template>

<script setup>
import { useCleaningStore } from '@/stores/cleaning';

const cleaningStore = useCleaningStore();

const props = defineProps({
    cleaningItem: {
        type: Object,
        required: true,
    }
});
const emit = defineEmits(['refresh']);

</script>

<style>

</style>