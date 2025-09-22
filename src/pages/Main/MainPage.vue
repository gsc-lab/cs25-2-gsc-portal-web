<script setup>
import { ref } from "vue"
import { VueDraggableNext } from "vue-draggable-next"

// 예시 공지 데이터
const notices = ref([
  { id: 1, title: "개강일 공지", author: "학과사무실", date: "2025-09-01" },
  { id: 2, title: "수강신청 안내", author: "교무처", date: "2025-09-05" },
  { id: 3, title: "학과 행사 안내", author: "학생회", date: "2025-09-10" },
])

function onUpdate() {
  console.log("변경된 순서:", notices.value)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📌 공지사항</h1>

    <VueDraggableNext v-model="notices" item-key="id" @update="onUpdate" class="space-y-3">
      <template #item="{ element }">
        <div class="p-4 bg-white border rounded-lg shadow flex flex-col cursor-move hover:bg-gray-50">
          <!-- 제목 -->
          <h2 class="text-lg font-semibold text-gray-800">
            {{ element.title }}
          </h2>

          <!-- 작성자 + 날짜 -->
          <div class="text-sm text-gray-500 flex justify-between mt-2">
            <span>✍ {{ element.author }}</span>
            <span>📅 {{ element.date }}</span>
          </div>
        </div>
      </template>
    </VueDraggableNext>
  </div>
</template>
