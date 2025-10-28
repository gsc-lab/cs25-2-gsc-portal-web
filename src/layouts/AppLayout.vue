<template>
  <div>
    <MainHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import MainHeader from '@/layouts/MainHeader.vue'
</script>