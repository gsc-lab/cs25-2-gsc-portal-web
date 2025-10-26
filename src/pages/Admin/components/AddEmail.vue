<script setup>
import { ref, onMounted } from 'vue'
import { getEmail } from '@/api/adminApi';
const email = ref(null)

onMounted(async () =>  {
  email.value = await getEmail()
})
</script>

<template>
  <div style="background-color:aliceblue; margin: 3px; ">
    AddEmail

    {{ email }}
  </div>
</template>
