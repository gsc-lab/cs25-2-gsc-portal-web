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
            <h2 class="card-title">오늘의 시간표</h2>
            <div>
              <button
                v-for="(target, key) in targetGradeList"
                :key="key"
                @click="gradeSelect(target)"
              >
                <span>
                  {{
                    target === '1'
                      ? target + '학년'
                      : target === '2'
                        ? target + '학년'
                        : target === '3'
                          ? target + '학년'
                          : target === '특강'
                            ? '특강'
                            : '한국어'
                  }}
                </span>
              </button>
            </div>
            <div class="card-content">
              <div class="dummy-box">
                <table v-if="filterSchedule" class="schedule-table">
                  <thead>
                    <tr>
                      <th>교시</th>
                      <th v-for="day in dayList" :key="day">{{ day }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="period in 12" :key="period">
                      <td>{{ period }}교시</td>
                      <td v-for="day in dayList" :key="day">
                        <span
                          v-for="(courseItem, index) in filterSchedule[day]?.[period]"
                          :key="index"
                        >
                          {{ courseItem['title'] }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                  <span v-if="notice.is_pinned" class="pinned">중요</span>
                  {{ notice.title }}
                </p>
              </div>
              <div v-if="!dashBoard.notices?.notices?.length" class="no-data">
                등록된 공지사항이 없습니다.
              </div>
            </div>
          </div>

          <div class="card cleaning">
            <div class="card-header">
              <h2 class="card-title">이번주 청소 당번</h2>
              <button @click="HandleCleaningMove" class="btn btn-secondary">더보기</button>
            </div>
            <div class="card-content cleaning-content">
              <div
                v-for="clean in dashBoard.cleaning_duty"
                :key="clean.grade_id"
                class="cleaning-info-group"
              >
                <div class="group-header">
                  <span class="grade-badge">{{ clean.grade_id }}학년</span>
                  <span class="room-info">{{ clean.classroom_name }}</span>
                </div>
                <div class="member-list">
                  <span v-for="member in clean.members" :key="member" class="member-tag">
                    {{ member }}
                  </span>
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
              <button class="btn btn-primary">
                <router-link to="huka" class="btn-link">일정 상세보기</router-link>
              </button>
            </div>
            <div class="card-content">
              <p>데이터 표시 예정</p>
            </div>
          </div>

          <div class="card pool">
            <div class="card-header">
              <h2 class="card-title">강의실 개방 투표</h2>
              <button class="btn btn-primary">
                <router-link to="weekendAttendance" class="btn-link">신청</router-link>
              </button>
            </div>
            <div class="card-content">
              <p class="room-number">투표 진행중인 강의실 표시 : 000호</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from 'vue'
import { getDashBoard } from '@/api/apiDashBoard'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/layouts/AppLayout.vue'

const user = useUserStore()
const dashBoard = ref({})
const Today = new Date().toISOString().split('T')[0]
const day = '2025-04-30' // 테스트용 날짜

// 타겟 목록
const targetGradeList = ref(['1', '2', '3', '특강', '한국어'])

// 선택된 타겟
const targetGrade = ref('1')

// 타겟 키
const targetKey = {
  1: '1',
  2: '2',
  3: '3',
  특강: 'special',
  한국어: 'korean',
}

// 요일 목록
const dayList = ['MON', 'TUE', 'WED', 'THU', 'FRI']

onMounted(async () => {
  const response = await getDashBoard({ date: day }) // date : Today 로 변경해야함
  dashBoard.value = response
  // const res = await getAllUser()
  await user.fetchUser()
  console.log(user.userInfo)
  console.log(dashBoard.value)
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

// 버튼 클릭 시 실행될 함수 (단순화)
const gradeSelect = (grade) => {
  targetGrade.value = grade
}

const HandleNoticeMove = () => {
  if (user.userInfo?.grade_id) {
    router.push({ path: `/notice/grade/${user.userInfo?.grade_id}` })
  } else {
    router.push({ path: 'notice' })
  }
}

watchEffect(() => {
  console.log(targetGrade.value)
})

const HandleNoticeClick = (notice_id) => {
  router.push({ path: `/noticeView/${notice_id}` })
}

const HandleCleaningMove = () => {
  router.push({ path: `/cleaningH/grade/${user.userInfo.grade_id}` })
}
</script>

<style scoped>
:root {
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
}

a.btn-link {
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}

/* ===== 전체 레이아웃 ===== */
.dashboard-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
  padding-bottom: 3rem;
}

.dashboard-container {
  width: 1800px;
  max-width: 1800px;
  margin: 0 auto;
}

/* ===== 헤더 ===== */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2.5rem 0.5rem 1.5rem;
  border-bottom: none;
}

.portal-title {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(45deg, #4caf50, #2196f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.today {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6b7280;
}

/* ===== 카드형 그리드 ===== */
.dashboard-grid {
  display: grid;
  grid-template-areas:
    'timetable notice'
    'cleaning notice'
    'huka pool';
  grid-template-columns: 1.5fr 2fr;
  grid-gap: 1.5rem;
  margin-top: 1rem;
}

/* ===== 카드 공통 ===== */
.card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
}

.card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  margin-top: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header .card-title {
  margin-bottom: 0;
}

.card-content {
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
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-item:hover {
  background-color: #f9fafb;
}

.notice-title {
  font-size: 1rem;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pinned {
  margin-right: 8px;
  color: #ff4d4f;
  font-weight: 600;
  font-size: 0.9rem;
}

/* ===== 청소 당번 카드 ===== */
.cleaning-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.cleaning-info-group {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 12px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.grade-badge {
  background-color: #eef2ff;
  color: #3f2b96;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
}

.room-info {
  font-weight: 600;
  color: #4b5563;
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.member-tag {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #374151;
}

/* ===== 강의실 개방 투표 카드 ===== */
.room-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3f2b96;
  text-align: center;
  margin-top: 1rem;
}

/* ===== 버튼 공통 스타일 ===== */
.btn {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
}
.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: #fff;
  color: #3f2b96;
  border: 1px solid #d1d5db;
}
.btn-secondary:hover {
  background: #f9fafb;
}

/* ===== 더미 박스 & No Data ===== */
.dummy-box {
  background: #eef2ff;
  border-radius: 12px;
  height: 100%;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  font-weight: 600;
  font-size: 1.1rem;
}

.no-data {
  color: #9ca3af;
  text-align: center;
  padding: 1rem 0;
}
</style>
