<template>
  <div style="border-bottom: 1px solid #eee; padding: 10px 0; margin-top: 10px;">
    <div style="margin-bottom: 5px;">
      <strong>{{ cleaningItem.grade_id }}학년 - {{ cleaningItem.classroom_name }}</strong>
    </div>
    <div>
      <span>담당자: </span>
      <span v-for="(member, i) in cleaningItem.members" :key="i">
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
