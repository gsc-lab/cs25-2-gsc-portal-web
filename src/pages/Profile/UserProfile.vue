<template>
  <main class="user-info-wrapper">
    <div class="user-info-container">
      <div class="user-info-card">
        <h1 class="portal-title">사용자 정보</h1>

        <div class="info-row">
          <span class="label">학번</span>
          <span class="value">{{ userInfoStore.userInfo?.user_id }}</span>
        </div>

        <div class="info-row">
          <span class="label">이메일</span>
          <span class="value">{{ userInfoStore.userInfo?.email }}</span>
        </div>

        <div class="info-row">
          <span class="label">전화번호</span>
          <span class="value">{{ userInfoStore.userInfo?.phone }}</span>
        </div>

        <div class="info-row">
          <span class="label">권한</span>
          <span class="value role" :class="userInfoStore.userInfo?.role_type">
            {{ userInfoStore.userInfo?.role_type }}
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// ... (Script 내용은 변경 없음)
import { useUserStore } from '@/stores/user'

const userInfoStore = useUserStore()
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.user-info-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px); /* 100vh - 헤더 높이 */
  background-color: #f9fafb; /* 대시보드와 동일한 배경 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem; /* 상하 여백 */
}

.user-info-container {
  /* ✅ 고정 폭 컨테이너 (헤더/대시보드와 동일) */
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
  /* 카드를 중앙에 배치 */
  display: flex;
  justify-content: center;
}

/* ===== 2. 사용자 정보 카드 ===== */
.user-info-card {
  background-color: #fff;
  border-radius: 1.25rem; /* 20px (통일) */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg (통일) */
  padding: 2rem 2.5rem;
  width: 100%;
  max-width: 600px; /* 너비 조정 */
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

.user-info-card:hover {
  /* ✅ 동적 호버 효과 (통일) */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
  transform: translateY(-4px);
}

/* ===== 3. 타이틀 ===== */
.portal-title {
  /* ✅ 헤더/대시보드와 동일한 스타일 */
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
}

/* ===== 4. 정보 행 ===== */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem; /* 패딩 조정 */
  border-bottom: 1px solid #e5e7eb; /* 부드러운 구분선 */
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151; /* Dark gray */
}

.value {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937; /* Black */
  margin: 0;
}

/* ===== 5. 권한 뱃지 (기존 스타일 유지 및 개선) ===== */
.role {
  padding: 0.2rem 0.6rem;
  border-radius: 999px; /* ✅ 알약 모양으로 통일 */
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.role.admin {
  background-color: #ede7f6;
  color: #5e35b1;
}

.role.teacher {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.role.student {
  background-color: #e3f2fd;
  color: #1565c0;
}

.role.NA {
  background-color: #f0f0f0;
  color: #666;
}
</style>
