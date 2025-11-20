<template>
  <AppLayout pageName="cleaningRoster">
    <main class="roster-page-wrapper">
      <div class="roster-page-container">
        <div class="roster-create-card">
          <div class="card-header">
            <h1 class="portal-title">청소 멤버 자동 생성</h1>
          </div>

          <div class="card-body">
            <section class="form-section">
              <h2 class="section-title">학기 선택</h2>
              <div class="radio-group">
                <div v-for="section in sections" :key="section?.sec_id" class="radio-item">
                  <input
                    type="radio"
                    name="section"
                    :id="`section-${section?.sec_id}`"
                    :value="section?.sec_id"
                    v-model="sectionSelect"
                  />
                  <label :for="`section-${section?.sec_id}`">{{ section?.sec_id + '학기' }}</label>
                </div>
              </div>
            </section>

            <section class="form-section">
              <h2 class="section-title">요일 선택</h2>
              <div class="radio-group">
                <div v-for="day in weekDays" :key="day" class="radio-item">
                  <input
                    type="radio"
                    name="day"
                    :id="`day-${day}`"
                    :value="day"
                    v-model="daySelect"
                  />
                  <label :for="`day-${day}`">{{ day }}</label>
                </div>
              </div>
            </section>

            <section class="form-section">
              <h2 class="section-title">인원 수</h2>
              <div class="radio-group">
                <div v-for="member in [1, 2, 3, 4]" :key="member" class="radio-item">
                  <input
                    type="radio"
                    name="member"
                    :id="'member-' + member"
                    :value="member"
                    v-model="team_size"
                  />
                  <label :for="'member-' + member">{{ member + '명' }}</label>
                </div>
              </div>
            </section>

            <div class="grid-row">
              <section class="form-section">
                <h2 class="section-title">학년 선택</h2>
                <div class="radio-group vertical">
                  <div v-for="grade in ['1', '2', '3']" :key="grade" class="radio-item">
                    <input
                      type="radio"
                      name="grade"
                      :id="'grade-' + grade"
                      :value="grade"
                      v-model="gradeSelect"
                    />
                    <label :for="'grade-' + grade">{{ grade + '학년' }}</label>
                  </div>
                </div>
              </section>

              <section class="form-section">
                <h2 class="section-title">교실 정보</h2>
                <div class="radio-group grid-layout">
                  <div
                    v-for="classroom in classRooms"
                    :key="classroom.classroom_id"
                    class="radio-item"
                  >
                    <input
                      type="radio"
                      name="classroom"
                      :id="'classroom-' + classroom.classroom_id"
                      :value="classroom.classroom_id"
                      v-model="classroomSelect"
                    />
                    <label :for="'classroom-' + classroom.classroom_id">
                      {{ classroom.label }}
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary" @click="HandleCreateRoster">생성하기</button>
          </div>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { getClassRooms, postCleaningRoster } from '@/api/apiCleaning'
import { getSection } from '@/api/jobApi'
import AppLayout from '@/layouts/AppLayout.vue'
import router from '@/router'
import { onMounted, ref, watch, watchEffect } from 'vue'

// ====================================================

const sections = ref([]) // 학기 정보
const classRooms = ref([]) // 교실 정보
const weekDays = ref(['MON', 'TUE', 'WED', 'THU', 'FRI']) // 요일 배열

// ====================================================

// ====================================================

const sectionSelect = ref('') // 선택된 학기
const daySelect = ref('') // 선택된 요일
const team_size = ref(0) // 선택된 팀 멤버수
const classroomSelect = ref('') // 선택된 교실 정보
const gradeSelect = ref('') // 선택된 학년

// ====================================================

// 필요한 정보
// 1. 학기 = OK
// 2. 청소 요일 = OK
// 3. 팀 멤버 수 = OK
// 4. 학년별 학생 교실 정보 ( 학년과 교실 ) = OK
onMounted(async () => {
  sections.value = await getSection()
  classRooms.value = await getClassRooms()
  console.log(sections.value)
  console.log(classRooms.value)
})

const HandleCreateRoster = async () => {
  console.log('로스터 생성')
  const roster = {
    section: sectionSelect.value,
    weekday: daySelect.value,
    team_size: team_size.value,
    grade_rooms: [],
  }

  if (gradeSelect.value && classroomSelect.value) {
    roster.grade_rooms.push({
      grade_id: gradeSelect.value,
      classroom_id: classroomSelect.value,
    })
  }
  console.log(roster)
  try {
    await postCleaningRoster(roster)
  } catch (err) {
    console.error(err)
  }
  router.push({ path: '/cleaningH' })
}

watchEffect(() => {
  console.log('선택된 학기: ', sectionSelect.value)
  console.log('선택된 요일: ', daySelect.value)
  console.log('인원수: ', team_size.value)
  console.log('선택된 교실: ', classroomSelect.value)
  console.log('선택된 학년: ', gradeSelect.value)
})

watch(sectionSelect, (newSections, oldSections) => {
  if (newSections !== oldSections) {
    daySelect.value = ''
    team_size.value = 0
  }
})
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.roster-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem;
}

.roster-page-container {
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
}

/* ===== 2. 카드 스타일 ===== */
.roster-create-card {
  background: #fff;
  border-radius: 1.25rem; /* 20px */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  color: #1f2937;
  max-width: 800px; /* 폼이 너무 넓어지지 않도록 제한 */
  margin: 0 auto; /* 중앙 정렬 */
}

.card-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

.portal-title {
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #111827;
  margin: 0;
}

.card-body {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 섹션 간 간격 */
}

/* ===== 3. 폼 섹션 스타일 ===== */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
}

/* 라디오 버튼 그룹 스타일 */
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

/* 세로 배치 옵션 */
.radio-group.vertical {
  flex-direction: column;
}

/* 그리드 배치 옵션 (교실 정보 등 많을 때) */
.radio-group.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.8rem;
}

/* 커스텀 라디오 버튼 아이템 */
.radio-item {
  position: relative;
}

.radio-item input[type='radio'] {
  /* 실제 라디오 버튼 숨김 */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-item label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none; /* 텍스트 드래그 방지 */
  text-align: center;
}

.radio-item label:hover {
  background-color: #f3f4f6;
}

/* 선택된 라디오 버튼 스타일 */
.radio-item input[type='radio']:checked + label {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 6px -1px rgba(63, 43, 150, 0.3); /* Primary 색상 그림자 */
  font-weight: 600;
}

/* 2단 그리드 레이아웃 (학년/교실) */
.grid-row {
  display: grid;
  grid-template-columns: 1fr 3fr; /* 학년 1 : 교실 3 비율 */
  gap: 2rem;
  align-items: flex-start;
}

/* ===== 4. 카드 푸터 (버튼) ===== */
.card-footer {
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 0.8rem 2rem; /* 버튼 크기 조금 더 키움 */
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
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
  opacity: 0.9;
}
</style>
