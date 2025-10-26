<script setup>
import { ref, onMounted } from 'vue'
import { getApproval } from '@/api/adminApi';
const approval = ref(null)

onMounted(async () =>  {
  approval.value = await getApproval()
})
</script>

<template>
  <div style="background-color: azure; margin: 3px; ">
  approval
  {{ approval }}
  </div>
</template>
