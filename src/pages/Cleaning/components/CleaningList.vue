<template>
  <li>
    <div>
        <h3>{{ cleaningItem.grade_id }}학년 - {{ cleaningItem.classroom_name }}</h3>
        <span>{{ cleaningItem.members.length }}</span>
    </div>

    <ul>
        <li v-for="(member, i) in cleaningItem.members"
        :key="i"
        >   
        {{ member }}
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