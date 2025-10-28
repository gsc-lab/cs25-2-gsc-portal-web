<template>
  <div>
    <button @click="googleLogin">로그인</button>
  </div>
</template>

<script setup>
import { googleLogin } from '@/api/apiClient';
</script>
