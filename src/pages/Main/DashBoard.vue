<template>
  <div>메인화면</div>

  <div>
    {{ dashBoard }}
  </div>
</template>

<script setup>
import { getDashBoard } from '@/api/apiDashBoard';
import { onMounted, ref } from 'vue';

const targetDate = new Date();
targetDate.setDate(targetDate.getDate());
const Today = targetDate.toISOString().split("T")[0];

const dashBoard = ref([])
const data = ref({
  date: Today
})

onMounted(async () => {
  try {
    const response = await getDashBoard(data.value)
    dashBoard.value = response
    console.log(response)
  } catch (err) {
    console.error("에러발생: ", err)
  }
})
</script>
