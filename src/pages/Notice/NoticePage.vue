<template>
  <main class="notice-page-wrapper">
    <div class="notice-page-container">
      <div v-if="user.userInfo.role_type !== 'student'" class="header-bar">
        <router-link to="/notice/write" class="write-btn">공지사항 작성</router-link>
      </div>

      <NoticeListComponent class="ListComponent" />
    </div>
  </main>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import NoticeListComponent from './NoticeListComponent.vue'

// user store ( user.userInfo ) 불러오기
const user = useUserStore()
</script>

<style scoped>
/* ✅ 'scoped'로 변경 */

/* 1. 전체 페이지 래퍼 */
.notice-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px); /* 100vh - 헤더 높이 */
  background-color: #f9fafb; /* 대시보드와 동일한 배경 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem; /* 상하 여백 */
}

/* 2. 고정 폭 컨테이너 (헤더/대시보드와 동일) */
.notice-page-container {
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
}

/* 3. 버튼 배치를 위한 헤더 바 */
.header-bar {
  display: flex;
  justify-content: flex-end; /* ✅ 버튼을 오른쪽 끝으로 배치 */
  align-items: center;
  margin-bottom: 1.5rem; /* 리스트와의 간격 */
}

/* 4. '공지사항 작성' 버튼 스타일 (Primary 버튼) */
.write-btn {
  display: inline-block;
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
  border: none;
  border-radius: 999px; /* 둥근 버튼 */
  padding: 0.7rem 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none; /* router-link의 밑줄 제거 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.write-btn:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  opacity: 0.9;
}

/* .ListComponent는 부모 컨테이너가 너비를
  결정하므로 별도 스타일이 필요 없습니다.
*/
.ListComponent {
  width: 100%;
}
</style>
