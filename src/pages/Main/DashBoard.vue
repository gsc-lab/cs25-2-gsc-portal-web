<template>
  <AppLayout pageName="dashBoard">
    <main class="dashboard-wrapper">
      <div class="dashboard-container">
        <header class="dashboard-header">
          <h1 class="portal-title">GSC_Portal</h1>
          <div class="today">{{ new Date().toLocaleDateString() }}</div>
        </header>

        <section class="dashboard-grid">
          <div class="card timetable">
            <h2 class="card-title">오늘의 시간표 {{}}</h2>
            <div class="card-content">
              <div class="dummy-box">
                <span>시간표 데이터</span>
              </div>
            </div>
          </div>

          <div class="card notice">
            <div class="card-header">
              <h2 class="card-title">공지사항</h2>
              <button @click="HandleNoticeMove" class="btn btn-secondary">더보기</button>
            </div>
            <div class="card-content">
              <div
                class="notice-item"
                v-for="notice in dashBoard.notices?.notices"
                :key="notice.notice_id"
                @click="HandleNoticeClick(notice.notice_id)"
              >
                <p class="notice-title">
                  <span v-if="notice.is_pinned" class="pinned">♥ 중요</span>
                  {{ notice.title }}
                </p>
              </div>
            </div>
          </div>

          <div class="card cleaning">
            <h2 class="card-title">이번주 청소 당번</h2>
            <div class="card-content">
              <div v-for="clean in dashBoard.cleaning_duty" :key="clean.grade_id">
                <h3>{{ clean.grade_id + '학년' }}</h3>
                <p>
                  교실:
                  {{ clean.classroom_name }}
                </p>
                <div v-for="member in clean.members" :key="member">
                  <p>
                    {{ member }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card huka">
            <div class="card-header">
              <h2 class="card-title">후까 교수님</h2>
              <button class="btn btn-primary">
                <router-link to="huka">일정 상세보기</router-link>
              </button>
            </div>
            <div class="card-content">
              <p>1학년 일정</p>
            </div>
          </div>

          <div class="card pool">
            <div class="card-header">
              <h2 class="card-title">강의실 개방 투표</h2>
              <button class="btn btn-primary">
                <router-link to="weekendAttendance">신청</router-link>
              </button>
            </div>
            <div class="card-content">
              <p>000호</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashBoard } from '@/api/apiDashBoard'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { getAllUser } from '@/api/apiNotice'
import AppLayout from '@/layouts/AppLayout.vue'

// user store ( user.userInfo ) 불러오기
const user = useUserStore()

const dashBoard = ref({})

const Today = new Date().toISOString().split('T')[0]

onMounted(async () => {
  const response = await getDashBoard({ date: Today })
  dashBoard.value = response
  const res = await getAllUser()
  await user.fetchUser()
  console.log('현재 로그인 사용자 정보: ', user.userInfo)
  console.log('메인 대시보드 정보: ', dashBoard.value)
  console.log('모든 학생 정보: ', res)
})

const HandleNoticeMove = () => {
  if (user.userInfo?.grade_id) {
    router.push({ path: `/notice/grade/${user.userInfo?.grade_id}` })
  } else {
    router.push({ path: 'notice' })
  }
}

const HandleNoticeClick = (notice_id) => {
  router.push({ path: `/noticeView/${notice_id}` })
}
</script>

<style scoped>
/* ===== 폰트 ===== */
/* Pretendard와 Montserrat 폰트가 프로젝트에 로드되어 있어야 합니다. */
:root {
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
}

/* ===== 전체 레이아웃 ===== */
.dashboard-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px); /* (100vh - 헤더 높이) */
  background-color: #f9fafb; /* ✅ 매우 연한 회색 배경 */
  padding-bottom: 3rem;
}

.dashboard-container {
  /* ✅ 고정 폭 레이아웃 (헤더와 동일하게) */
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
}

/* ===== 헤더 ===== */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2.5rem 0.5rem 1.5rem; /* ✅ 상단 여백 추가 */
  border-bottom: none; /* ✅ 하단 테두리 제거 */
}

.portal-title {
  /* ✅ 로그인/헤더 스타일과 통일 */
  font-size: 2.5rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(45deg, #4caf50, #2196f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.today {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6b7280; /* ✅ 부드러운 회색 */
}

/* ===== 카드형 그리드 ===== */
.dashboard-grid {
  display: grid;
  grid-template-areas:
    'timetable notice'
    'cleaning notice'
    'huka pool';
  grid-template-columns: 1.5fr 2fr;
  grid-gap: 1.5rem; /* ✅ 카드 간격 증가 */
  margin-top: 1rem;
}

/* ===== 카드 공통 ===== */
.card {
  /* ✅ 로그인 카드 스타일 적용 */
  background: #fff;
  border-radius: 1.25rem; /* 20px */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
}

.card:hover {
  /* ✅ 동적 호버 효과 */
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
  transform: translateY(-4px);
}

.card-title {
  font-size: 1.3rem; /* ✅ 제목 크기 증가 */
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.card-header {
  /* ✅ 카드 내 헤더 (공지, 투표) */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem; /* 제목과 겹치므로 마진 조정 */
}

.card-header .card-title {
  margin-bottom: 0; /* 헤더 사용 시 제목 마진 제거 */
}

.card-content {
  /* ✅ .card-body 스타일 제거 -> .card-content로 변경 */
  flex: 1;
  font-size: 1rem;
  color: #374151;
}

/* ===== 각 카드 위치 ===== */
.timetable {
  grid-area: timetable;
}
.notice {
  grid-area: notice;
}
.cleaning {
  grid-area: cleaning;
}
.huka {
  grid-area: huka;
}
.pool {
  grid-area: pool;
}

/* ===== 공지사항 카드 ===== */
.notice-item {
  padding: 0.6rem 0.2rem;
  border-bottom: 1px solid #e5e7eb;
}
.notice-item:last-child {
  border-bottom: none;
}

.notice-title {
  font-size: 1rem;
  color: #333;
}

.pinned {
  margin-right: 5px;
  /* 핀 이모티콘은 기본 색상을 사용해도 충분히 강조됩니다 */
}

/* ===== 버튼 공통 스타일 ===== */
.btn {
  border: none;
  border-radius: 999px; /* 둥근 버튼 */
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* ✅ Primary 버튼 (신청) */
.btn-primary {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
}
.btn-primary:hover {
  opacity: 0.9;
}

/* ✅ Secondary 버튼 (더보기) */
.btn-secondary {
  background: #fff;
  color: #3f2b96;
  border: 1px solid #d1d5db; /* 연한 테두리 */
}
.btn-secondary:hover {
  background: #f9fafb;
}

/* ===== 더미 박스 (시간표 자리 표시용) ===== */
.dummy-box {
  background: #eef2ff; /* ✅ 연한 보라색 배경 */
  border-radius: 8px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1; /* ✅ 보라색 텍스트 */
  font-weight: 500;
}
</style>
