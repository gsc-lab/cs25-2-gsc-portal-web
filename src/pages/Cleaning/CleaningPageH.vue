<template>
  <main class="cleaning-home-wrapper">
    <div class="cleaning-home-container">
      <div class="action-bar">
        <router-link to="/cleaningH/cleaningRosterCreate" class="btn btn-primary">
          + 청소 로스터 생성
        </router-link>
      </div>

      <section class="content-area">
        <CleaningMemberList />
      </section>
    </div>
  </main>
</template>

<script setup>
import CleaningMemberList from './CleaningMemberList.vue'
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.cleaning-home-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem;
}

.cleaning-home-container {
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
}

/* ===== 2. 액션 바 (버튼 우측 정렬) ===== */
.action-bar {
  display: flex;
  justify-content: flex-end; /* ✅ 우측 정렬 핵심 */
  margin-bottom: 1.5rem; /* 아래 컨텐츠와의 간격 */
  padding-right: 1rem; /* 오른쪽 여백 살짝 추가 */
}

/* ===== 3. 버튼 스타일 (Primary) ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.8rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
}
.btn-primary:hover {
  opacity: 0.95;
}
</style>
