<script setup>
import {ref} from 'vue'
import Approval from './components/Approval.vue';
import AddEmail from './components/AddEmail.vue';
import UserMgmt from './components/UserMgmt.vue';

const menu = ref('Approval');

</script>

<template>
  <div style="background-color: antiquewhite;">
    <div>
      <button @click="menu='Approval'">사용자 승인 | </button>
      <button @click="menu='AddEmail'"> 외부 이메일 등록 | </button>
      <button @click="menu='UserMgmt'">사용자 관리</button>
    </div>
    
    <Approval v-if="menu=='Approval'"/>
    <AddEmail v-if="menu=='AddEmail'"/>
    <UserMgmt v-if="menu=='UserMgmt'"/>
  </div>
</template>
