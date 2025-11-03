<template>
  <MainHeader v-if="user.userInfo" />
  <router-view />
</template>

<script setup>
import MainHeader from './layouts/MainHeader.vue'
import { useUserStore } from './stores/user'

const user = useUserStore()
</script>
