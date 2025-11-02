<template>
  <div v-if="user.userInfo">
    <MainHeader />
  </div>
  <router-view :key="$route.fullPath" />
</template>

<script setup>
import MainHeader from './layouts/MainHeader.vue'
import { useUserStore } from './stores/user'

const user = useUserStore()
</script>
