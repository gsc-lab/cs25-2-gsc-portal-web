<template>
  <div class="pagination-container" v-if="totalPages > 0">
    <!-- 이전 페이지 버튼 -->
    <button class="page-control" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
      &lt;
    </button>

    <!-- 페이지 번호 버튼들 -->
    <button
      v-for="page in pageNumbers"
      :key="page"
      :class="['page-number', { active: page === currentPage }]"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <!-- 다음 페이지 버튼 -->
    <button
      class="page-control"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalCount: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize))

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px; /* 버튼 사이 간격 */
  margin-top: 3rem;
  margin-bottom: 2rem;
}

/* 공통 버튼 스타일 */
button {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 36px; /* 정사각형 느낌 */
  height: 36px;
  padding: 0 6px;
  border: 1px solid #e5e7eb; /* 연한 회색 테두리 */
  background-color: #fff;
  color: #6b7280; /* 기본 글자색 */
  border-radius: 8px; /* 둥근 모서리 */
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease; /* 부드러운 전환 효과 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
}

/* 호버 효과 (마우스 올렸을 때) */
button:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #3f2b96; /* 메인 컬러 */
  transform: translateY(-1px); /* 살짝 떠오르는 효과 */
}

/* 활성화된 페이지 (현재 페이지) */
button.active {
  background-color: #3f2b96; /* 메인 컬러 배경 */
  border-color: #3f2b96;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(63, 43, 150, 0.3); /* 그림자 효과 */
}

/* 비활성화 상태 (이전/다음 버튼 불가 시) */
button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  background-color: #f9fafb;
  border-color: #f3f4f6;
}

/* 화살표 버튼 스타일 미세 조정 */
.page-control {
  font-weight: bold;
  color: #9ca3af;
}
</style>
