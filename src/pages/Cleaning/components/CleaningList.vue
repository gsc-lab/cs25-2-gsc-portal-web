<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-4 border border-gray-200 mb-4">
    <h3 class="font-semibold text-text-heading text-lg mb-2">
      {{ cleaningItem.grade_id }}학년 - {{ cleaningItem.classroom_name }}
    </h3>
    <div>
      <span class="text-text-base text-sm font-medium mr-1">담당자: </span>
      <span v-for="(member, i) in cleaningItem.members" :key="i" class="text-text-base text-sm">
        {{ member }}{{ i < cleaningItem.members.length - 1 ? ', ' : '' }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
    cleaningItem: {
        type: Object,
        required: true,
    }
});
</script>
