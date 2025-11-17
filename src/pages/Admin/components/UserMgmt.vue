<script setup>
import Student from './UserMgmtComponents/Student.vue'
import AdminProfessor from './UserMgmtComponents/Admin&Professor.vue'
import { ref } from 'vue'

const stdOpen = ref(false)
const adminOpen = ref(false)
</script>

<template>
  <div style="background-color: cornsilk; margin: 3px">
    UserMgmt
    <!-- 학생 관리 -->
    <div>
      <button @click="stdOpen = !stdOpen">{{ stdOpen ? '▼' : '▶' }}학생</button>
      <Student v-if="stdOpen" />
    </div>
    <!-- 관리자, 교수 관리 -->
    <div>
      <button @click="adminOpen = !adminOpen">{{ adminOpen ? '▼' : '▶' }}관리자, 교수</button>
      <AdminProfessor v-if="adminOpen" />
    </div>
  </div>
</template>
