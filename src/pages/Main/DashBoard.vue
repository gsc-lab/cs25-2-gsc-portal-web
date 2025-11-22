<template>
  <AppLayout pageName="dashBoard">
    <main class="dashboard-wrapper">
      <div class="dashboard-container">
        <header class="dashboard-header">
          <div class="header-left">
            <h1 class="portal-title">GSC_Portal</h1>
            <span class="today">{{ new Date().toLocaleDateString() }}</span>
          </div>
        </header>

        <section class="dashboard-grid">
          <div class="card timetable">
            <div class="card-header">
              <h2 class="card-title">오늘의 시간표</h2>
            </div>

            <div class="grade-tabs">
              <button
                v-for="(target, key) in isUserInfoList"
                :key="key"
                class="grade-btn"
                :class="{ active: targetGrade === target }"
                @click="gradeSelect(target)"
              >
                <span>{{ getLabel(target) }}</span>
              </button>
            </div>

            <div class="card-content table-wrapper">
              <div class="table-scroll">
                <table v-if="filterSchedule" class="schedule-table">
                  <thead>
                    <tr>
                      <th class="fixed-col">교시</th>
                      <th v-for="day in dayList" :key="day">{{ day }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="period in 12" :key="period">
                      <td class="period-cell">{{ period }}교시</td>
                      <td v-for="day in dayList" :key="day">
                        <div
                          class="class-info"
                          v-for="(courseItem, index) in filterSchedule[day]?.[period]"
                          :key="index"
                        >
                          {{ courseItem['title'] }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="empty-state">
                  <p>표시할 시간표 데이터가 없습니다.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card notice">
            <div class="card-header">
              <h2 class="card-title">공지사항</h2>
              <button @click="HandleNoticeMove" class="btn btn-text">더보기 +</button>
            </div>
            <div class="card-content notice-list-wrapper">
              <div
                class="notice-item"
                v-for="notice in dashBoard.notices?.notices"
                :key="notice.notice_id"
                @click="HandleNoticeClick(notice.notice_id)"
              >
                <div class="notice-row">
                  <span v-if="notice.is_pinned" class="badge-pinned">중요</span>
                  <p class="notice-text">{{ notice.title }}</p>
                </div>
              </div>
              <div v-if="!dashBoard.notices?.notices?.length" class="no-data">
                등록된 공지사항이 없습니다.
              </div>
            </div>
          </div>

          <div class="card cleaning">
            <div class="card-header">
              <h2 class="card-title">이번주 청소 당번</h2>
              <button @click="HandleCleaningMove" class="btn btn-text">더보기 +</button>
            </div>
            <div class="card-content cleaning-content">
              <div
                v-for="clean in dashBoard.cleaning_duty"
                :key="clean.grade_id"
                class="cleaning-row"
              >
                <div class="clean-badge">{{ clean.grade_id }}학년</div>
                <div class="clean-info">
                  <span class="room-name">{{ clean.classroom_name }}</span>
                  <div class="members">
                    <span v-for="member in clean.members" :key="member">
                      {{ member }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="!dashBoard.cleaning_duty?.length" class="no-data">
                청소 당번 정보가 없습니다.
              </div>
            </div>
          </div>

          <div class="card huka">
            <div class="card-header">
              <h2 class="card-title">후까 교수님</h2>
              <button class="btn btn-sm btn-primary">
                <router-link to="huka" class="btn-link-inner">일정 상세보기</router-link>
              </button>
            </div>
            <div class="card-content flex-center">
              <p class="placeholder-text">데이터 표시 예정</p>
            </div>
          </div>

          <div class="card pool">
            <div class="card-header">
              <h2 class="card-title">강의실 개방 투표</h2>
              <button class="btn btn-sm btn-outline">
                <router-link to="weekendAttendance" class="btn-link-inner link-colored">
                  신청
                </router-link>
              </button>
            </div>
            <div class="card-content flex-center">
              <p class="room-number-text">투표 진행중인 강의실 표시 : 000호</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getDashBoard } from '@/api/apiDashBoard'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/layouts/AppLayout.vue'

const user = useUserStore()
const dashBoard = ref({})
const Today = new Date().toISOString().split('T')[0]
const day = '2025-04-30' // 테스트용 날짜

// 타겟 목록
const targetGradeList = ref(['1', '2', '3', 'special', 'korean'])

// 선택된 타겟
const targetGrade = ref('1')

// 타겟 키
const targetKey = {
  1: '1',
  2: '2',
  3: '3',
  special: 'special',
  korean: 'korean',
}

// 요일 목록
const dayList = ['MON', 'TUE', 'WED', 'THU', 'FRI']

onMounted(async () => {
  const response = await getDashBoard({ date: day }) // date : Today 로 변경해야함
  dashBoard.value = response
  await user.fetchUser()
  console.log(user.userInfo)
  console.log(dashBoard.value)
  if (user.userInfo?.grade_id) {
    targetGrade.value = user.userInfo.grade_id
  }
})

// 시간표 필터링
const filterSchedule = computed(() => {
  // schedules 가 아니면 return
  if (!dashBoard.value.schedules) return null

  // dataKey = targetKey 안에 선택된 학년값 저장
  const dataKey = targetKey[targetGrade.value]

  console.log(dashBoard.value.schedules[dataKey])

  // dashBoard 안에 시간표에서 선택된 dataKey을 반환
  return dashBoard.value.schedules[dataKey]
})

// 버튼 클릭 시 실행될 함수
const gradeSelect = (grade) => {
  targetGrade.value = grade
}

// 사용자 유저 정보에 대한 필터링된 리스트
const isUserInfoList = computed(() => {
  if (!user.userInfo) return []

  const userInfo = user.userInfo

  if (userInfo.role_type === 'admin') {
    return targetGradeList.value
  }

  return targetGradeList.value.filter((target) => {
    if (target === userInfo.grade_id) {
      return true
    }

    if (userInfo.language_id === 'JP' && target === 'special') {
      return true
    }

    if (userInfo.language_id === 'KR' && target === 'korean') {
      return true
    }

    // 나머지는 숨김
    return false
  })
})

const getLabel = (target) => {
  if (['1', '2', '3'].includes(target)) return target + '학년'
  if (target === 'special') return '특강'
  if (target === 'korean') return '한국어'
  return target
}

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

const HandleCleaningMove = () => {
  router.push({ path: `/cleaningH/grade/${user.userInfo.grade_id}` })
}
</script>

<style scoped>
:root {
  --primary-color: #3f2b96;
  --primary-light: #eef2ff;
  --text-main: #1f2937;
  --text-sub: #6b7280;
  --border-color: #e5e7eb;
  --bg-color: #f8f9fa;
}

/* ===== 전체 레이아웃 ===== */
.dashboard-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 0 2rem 3rem;
  box-sizing: border-box;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* ===== 헤더 ===== */
.dashboard-header {
  padding: 2rem 0;
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.portal-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #3f2b96, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.today {
  color: #6b7280;
  font-weight: 600;
  font-size: 1rem;
}

/* ===== 그리드 레이아웃 ===== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 1.5rem;
  grid-template-areas:
    'timetable notice'
    'timetable cleaning'
    'huka pool';
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'timetable'
      'notice'
      'cleaning'
      'huka'
      'pool';
  }
}

/* ===== 카드 공통 ===== */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.card-content {
  flex: 1;
  position: relative;
}

/* 각 영역 할당 */
.timetable {
  grid-area: timetable;
}
.notice {
  grid-area: notice;
  min-height: 300px;
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

/* ===== 시간표 (Timetable) 스타일링 ===== */
.grade-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.grade-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: #fff;
  color: var(--text-sub);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.grade-btn:hover {
  background: #f3f4f6;
}

.grade-btn.active {
  background: #3f2b96;
  color: #fff;
  border-color: #3f2b96;
  box-shadow: 0 2px 8px rgba(63, 43, 150, 0.3);
}

.table-wrapper {
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 500px;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #e5e7eb;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9rem;
}

.schedule-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 700;
  padding: 10px 0;
  border-top: none;
}
.schedule-table th:first-child {
  border-left: none;
}
.schedule-table th:last-child {
  border-right: none;
}

.schedule-table td {
  height: 50px;
  padding: 4px;
}

.period-cell {
  background-color: #fcfcfc;
  color: #9ca3af;
  font-weight: 600;
  width: 60px;
}

.class-info {
  font-size: 0.85rem;
  color: #3f2b96;
  font-weight: 600;
  background-color: #eef2ff;
  padding: 4px;
  border-radius: 6px;
  display: inline-block;
  width: 90%;
}

/* ===== 공지사항 스타일 ===== */
.notice-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-item:hover .notice-text {
  color: #3f2b96;
}

.notice-row {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.badge-pinned {
  background: #ffe2e5;
  color: #f64e60;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  white-space: nowrap;
}

.notice-text {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
  color: #333;
}

/* ===== 청소 당번 스타일 ===== */
.cleaning-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cleaning-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 12px;
}

.clean-badge {
  background: #3f2b96;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(63, 43, 150, 0.2);
}

.clean-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.room-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
}

.members {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.members span {
  font-size: 0.85rem;
  color: #4b5563;
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* ===== 버튼 & 링크 ===== */
.btn {
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.btn-sm {
  /* 버튼 크기는 잡되 패딩은 링크가 가득 채우도록 */
  height: 32px;
  padding: 0 12px;
}

.btn-text {
  background: none;
  color: #6b7280;
  padding: 0;
  font-size: 0.9rem;
}
.btn-text:hover {
  color: #3f2b96;
}

.btn-primary {
  background: #3f2b96;
  color: #fff;
}
.btn-primary:hover {
  background: #2a1b6e;
}

.btn-outline {
  background: #fff;
  border: 1px solid #3f2b96;
}
.btn-outline:hover {
  background: #eef2ff;
}

/* Router Link 스타일 재정의 */
.btn-link-inner {
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.link-colored {
  color: #3f2b96;
}

/* 유틸리티 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.no-data,
.placeholder-text {
  color: #9ca3af;
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem 0;
}

.room-number-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3f2b96;
}
</style>
