<script setup>
import Header from "@/layouts/MainHeader.vue";
import { ref, watchEffect } from "vue";

// 페이지 타이틀 받아오기
const { pageName } = defineProps({pageName: { type: String },})
const title = ref("")

// title 추적
watchEffect(() => {
  title.value  = pageName
  console.log("slot:", pageName);
})

</script>

<template>
    <Header />
    <main>
      <h1>{{ title }}</h1>
      <slot></slot>
    </main>
</template>
