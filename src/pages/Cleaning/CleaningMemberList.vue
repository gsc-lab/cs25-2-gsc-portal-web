<template>
  <main class="cleaning-page-wrapper">
    <div class="cleaning-page-container">
      <header class="cleaning-header-section">
        <h1 class="portal-title">청소 당번</h1>
        <div class="main-tabs">
          <button
            v-for="period in periods"
            :key="period"
            :class="['tab-btn', { active: periodSelect === period }]"
            @click="periodSelect = period"
          >
            {{ period === 'weekend' ? '주간 일정' : '월간 일정' }}
          </button>
        </div>
      </header>

      <section v-if="periodSelect === 'weekend'" class="cleaning-card filter-card">
        <div class="filter-row">
          <span class="filter-label">학년 선택</span>
          <div class="grade-filters">
            <button
              v-for="grade in ['', '1', '2', '3']"
              :key="grade"
              :class="['filter-btn', { active: gradeSelect === grade }]"
              @click="HandleGradeCleaning(grade)"
            >
              {{ grade === '' ? '전체' : grade + '학년' }}
            </button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">기간 선택</span>
          <div class="date-controller">
            <button class="btn-outline" @click="HandleWeekend('lastWeekend')">← 지난주</button>
            <span class="current-date">{{ date.toLocaleDateString() }} 기준</span>
            <button class="btn-outline" @click="HandleWeekend('nextWeekend')">다음주 →</button>
          </div>
        </div>
      </section>

      <section class="cleaning-card main-card">
        <div class="card-header">
          <h2 class="card-title">
            {{
              periodSelect === 'weekend'
                ? '주간 청소 일정'
                : (cleaningRosterMonth?.month || '') + ' 월간 청소 일정'
            }}
          </h2>
          <span class="semester-info" v-if="cleaningRoster?.section">
            {{ cleaningRoster?.section + '학기' }}
          </span>
        </div>

        <div class="card-body">
          <div
            v-if="periodSelect === 'weekend' && cleaningRoster?.rosters"
            class="weekend-schedule"
          >
            <div class="schedule-date-header">
              {{ cleaningRoster?.work_date }}
            </div>

            <div class="roster-grid">
              <div
                class="roster-item"
                v-for="(roster, index) in cleaningRoster.rosters"
                :key="index"
              >
                <div class="roster-header" :class="`grade-${roster?.grade_id}`">
                  <span class="grade-badge">{{ roster?.grade_id }}학년</span>
                  <span class="classroom-name">{{ roster?.classroom_name }}</span>
                </div>
                <div class="roster-members">
                  <span class="member-label">담당:</span>
                  <div class="member-list">
                    <span
                      v-for="(member, mIndex) in roster?.members"
                      :key="mIndex"
                      class="member-name"
                    >
                      {{ member }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="periodSelect === 'month' && cleaningRoster?.days" class="month-schedule">
            <div v-for="day in cleaningRoster.days" :key="day.work_date" class="daily-schedule">
              <h3 class="daily-date">{{ day.work_date }}</h3>
              <div class="roster-grid">
                <div v-for="roster in day.rosters" :key="roster.grade_id" class="roster-item">
                  <div class="roster-header" :class="`grade-${roster.grade_id}`">
                    <span class="grade-badge">{{ roster.grade_id }}학년</span>
                    <span v-if="roster.classroom_name" class="classroom-name">
                      {{ roster.classroom_name }}
                    </span>
                  </div>
                  <div class="roster-members">
                    <div class="member-list">
                      <span v-for="member in roster.members" :key="member" class="member-name">
                        {{ member }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-data">일정 데이터가 없습니다.</div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { getCleaningRoster, getCleaningRosterMonthly } from '@/api/apiCleaning'
import router from '@/router'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// const route = useRoute()
const periods = ref(['weekend', 'month'])

// 청소 당번 멤버 조회 값 저장 ( 주간 )
const cleaningRoster = ref(null)

// 청소 당번 멤버 조회 값 저장 ( 월간 )
const cleaningRosterMonth = ref(null)

// ==================================================================

const periodSelect = ref('weekend')
const gradeSelect = ref('') // 선택된 학년
const weekendSelect = ref('') // 선택된 주 ( 지난주, 다음주 )

const date = ref(new Date())
console.log('오늘 날짜:', date.value)

// ==================================================================

const HandleWeekend = (weekend) => {
  weekendSelect.value = weekend
  console.log('버튼 클릭 감지', weekendSelect.value) // 저번 주 버튼 클릭 시 ( date - 7 )
  if (weekend === 'lastWeekend') {
    // console.log('지금 날짜 - 7')
    console.log('지난주 클릭: ', date.value.toLocaleDateString())
    date.value = new Date(date.value.setDate(date.value.getDate() - 7))
  } // 다음 주 버튼 클릭 시 ( date + 7 )
  if (weekend === 'nextWeekend') {
    // console.log('지금 날짜 + 7')
    console.log('다음주 클릭: ', date.value.toLocaleDateString())
    date.value = new Date(date.value.setDate(date.value.getDate() + 7))
  }
}

// let date = new Date(2025, 4, 5) => 2025 년 5월 5일로 출력 ! 월 계산시 주의 !
// 연도 계산
// + : date.setFullYear(date.getFullYear() + 1 )
// - : date.setFullYear(date.getFullYear() - 1 )
// 월 계산 :
// + : date.setMonth(date.getMonth() + 1 )
// - : date.setMonth(date.getMonth() - 1 )
// 일 계산
// + : date.setDate(date.getDate() + 1 )
// - : date.setDate(date.getDate() - 1 )

const formData = ref({
  grade_id: null,
  date: date.value.toLocaleDateString('en-CA'),
})

onMounted(async () => {
  try {
    console.log('form-data: ', formData.value)
    cleaningRoster.value = await getCleaningRoster(formData)
    console.log('주간 청소 당번 조회: ', cleaningRoster.value)
    cleaningRosterMonth.value = await getCleaningRosterMonthly()
    console.log('월간 청소 당번 조회: ', cleaningRosterMonth.value)
  } catch (err) {
    console.error('청소 조회 실패 ', err)
  }
})

const HandleGradeCleaning = (grade) => {
  console.log('청소, 선택된 학년: ', grade)
  if (grade) {
    gradeSelect.value = grade
    console.log('선택된 학년', gradeSelect.value)
    router.push(`/cleaningH/grade/${grade}`)
  } else {
    gradeSelect.value = grade
    console.log('전체 학년')
    router.push('/cleaningH')
  }
}
watchEffect(() => {
  console.log('watchEffect', gradeSelect.value)
  console.log('period_value: ', periodSelect.value)
})

watch(
  [gradeSelect, date, periodSelect],
  async ([newGrade, newDate, newPeriod], [oldGrade, oldDate, oldPeriod]) => {
    if (newGrade !== oldGrade || newDate !== oldDate || newPeriod !== oldPeriod) {
      console.log('선택 학년 변경 감지: ', newGrade)
      console.log('선택 날짜 변경 감지: ', newDate)
      console.log('선택 기간 변경 감지: ', newPeriod)

      formData.value.grade_id = newGrade || null
      formData.value.date = newDate.toLocaleDateString('en-CA')

      console.log('전달 데이터 확인: ', formData.value)
      if (newPeriod === 'weekend') {
        try {
          cleaningRoster.value = await getCleaningRoster(formData)
          console.log('주간 청소당번 호출: ', cleaningRoster.value)
        } catch (err) {
          console.error('청소당번 호출 실패: ', err)
        }
      }
      if (newPeriod === 'month') {
        try {
          // 월간 청소 ( store로 관리 예정 )
          cleaningRoster.value = await getCleaningRosterMonthly()
          console.log('월간 청소당번 호출: ', cleaningRoster.value)
        } catch (err) {
          console.error('월간 청소 당번 호출: ', err)
        }
      }
    }
  },
)
watch(
  () => route.params.gradeId,
  async (newGrade) => {
    if (newGrade) {
      gradeSelect.value = newGrade
    } else {
      gradeSelect.value = ''
      router.push({ path: '/cleaningH' })
    }
  },
)
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.cleaning-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem;
}

.cleaning-page-container {
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 카드 간 간격 */
}

/* ===== 2. 헤더 섹션 & 탭 ===== */
.cleaning-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.portal-title {
  font-size: 2rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #111827;
  margin: 0;
}

.main-tabs {
  display: flex;
  background-color: #e5e7eb;
  padding: 0.3rem;
  border-radius: 999px;
}

.tab-btn {
  padding: 0.6rem 1.5rem;
  border: none;
  background: none;
  border-radius: 999px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background-color: #fff;
  color: #3f2b96;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ===== 3. 공통 카드 스타일 ===== */
.cleaning-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 1.5rem 2rem;
}

/* ===== 4. 필터 카드 ===== */
.filter-card {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  min-width: 80px;
}

.grade-filters {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1.2rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background-color: #fff;
  color: #374151;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: #f3f4f6;
}

.filter-btn.active {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
  border-color: transparent;
}

.date-controller {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-date {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
  min-width: 150px;
  text-align: center;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #3f2b96;
  border-radius: 8px;
  background-color: #fff;
  color: #3f2b96;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  background-color: #eef2ff;
}

/* ===== 5. 메인 일정 카드 ===== */
.main-card {
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.semester-info {
  background-color: #f3f4f6;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  color: #4b5563;
}

/* 일정 그리드 */
.weekend-schedule,
.month-schedule {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.schedule-date-header {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3f2b96;
  margin-bottom: 1rem;
}

.daily-schedule {
  margin-bottom: 2rem;
}
.daily-date {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.8rem;
  padding-left: 0.5rem;
  border-left: 4px solid #3f2b96;
}

.roster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 반응형 그리드 */
  gap: 1.5rem;
}

.roster-item {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.roster-item:hover {
  transform: translateY(-3px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.roster-header {
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

/* 학년별 헤더 색상 구분 (옵션) */
.grade-1 {
  background-color: #e3f2fd;
  color: #1565c0;
}
.grade-2 {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.grade-3 {
  background-color: #fff3e0;
  color: #e65100;
}

.grade-badge {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.roster-members {
  padding: 1rem 1.2rem;
  display: flex;
  gap: 0.8rem;
}

.member-label {
  font-weight: 600;
  color: #6b7280;
  min-width: 40px;
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.member-name {
  background-color: #f3f4f6;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #374151;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 1.1rem;
}
</style>
