<script setup>
import { ref } from 'vue'
import Approval from './components/Approval.vue'
import AddEmail from './components/AddEmail.vue'
import ClassroomSetting from './components/ClassroomSetting.vue'
import UserMgmt from './components/UserMgmt.vue'

const menu = ref('Approval')
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="flex justify-center mb-6">
      <div class="flex bg-gray-100 p-1.5 rounded-full shadow-inner">
        <button @click="menu = 'Approval'"
                :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', menu === 'Approval' ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']">
          사용자 승인
        </button>
        <button @click="menu = 'AddEmail'"
                :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', menu === 'AddEmail' ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']">
          외부 이메일 등록
        </button>
        <button @click="menu = 'ClassroomSetting'"
                :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', menu === 'ClassroomSetting' ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']">
          강의실 설정
        </button>
        <button @click="menu = 'UserMgmt'"
                :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', menu === 'UserMgmt' ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']">
          사용자 관리
        </button>
      </div>
    </div>

    <Approval v-if="menu == 'Approval'" />
    <AddEmail v-if="menu == 'AddEmail'" />
    <ClassroomSetting v-if="menu == 'ClassroomSetting'" />
    <UserMgmt v-if="menu == 'UserMgmt'" />
  </div>
</template>
