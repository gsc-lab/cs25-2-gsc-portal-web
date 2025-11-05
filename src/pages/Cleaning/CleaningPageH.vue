<template>
  <div>
    <router-link to="/cleaningH/cleaningRosterCreate">청소 로스터 생성</router-link>
  </div>
  <div>
    <CleaningMemberList />
  </div>
</template>
<script setup>
import CleaningMemberList from './CleaningMemberList.vue'
</script>
