<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/adminApi';
const users = ref(null)

onMounted(async () =>  {
  users.value = await getUserInfo()
})
</script>

<template>
  <div style="background-color:cornsilk; margin: 3px; ">
    UserMgmt

    {{ users }}
  </div>
</template>
