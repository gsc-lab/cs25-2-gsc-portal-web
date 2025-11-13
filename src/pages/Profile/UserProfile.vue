<template>
  <AppLayout pageName="Profile">
    <main class="user-info-wrapper">
      <div class="user-info-container">
        <div class="user-info-card">
          <div class="card-header">
            <h1 class="portal-title">사용자 정보</h1>
            <button
              @click="studentScoreInputForm"
              class="grade-btn"
              :class="{ 'btn-close': isForm }"
            >
              {{ isForm ? '입력창 닫기' : '성적 입력' }}
            </button>
          </div>

          <div class="info-row">
            <span class="label">학번</span>
            <span class="value">{{ user.userInfo?.user_id }}</span>
          </div>

          <div class="info-row">
            <span class="label">이메일</span>
            <span class="value">{{ user.userInfo?.email }}</span>
          </div>

          <div class="info-row">
            <span class="label">전화번호</span>
            <span class="value">{{ user.userInfo?.phone }}</span>
          </div>

          <div class="info-row">
            <span class="label">권한</span>
            <span class="value role" :class="user.userInfo?.role_type">
              {{ user.userInfo?.role_type }}
            </span>
          </div>

          <div v-if="user.userInfo?.role_type === 'student'" class="info-row">
            <span class="label">(JLPT / TOPIK)</span>
            <span class="value role">JLPT / TOPIK</span>
          </div>

          <div v-if="user.userInfo?.role_type === 'student'" class="info-row">
            <span class="label">Score</span>
            <span class="value role">100</span>
          </div>

          <div v-if="user.userInfo?.role_type === 'student'" class="info-row">
            <span class="label">Level</span>
            <span class="value role">N2</span>
          </div>
        </div>
      </div>

      <!-- 성정 등록 -->
      <div v-show="isForm" class="user-info-container">
        <div class="user-info-card">
          <h1 class="portal-title">성적 정보</h1>

          <div class="info-row">
            <span class="label">시험 유형</span>
            <div class="radio-group">
              <label>
                <input type="radio" name="testType" value="jlpt" v-model="exam_type" />
                <span>JLPT</span>
              </label>
              <label>
                <input type="radio" name="testType" value="topik" v-model="exam_type" />
                <span>TOPIK</span>
              </label>
            </div>
          </div>

          <div class="info-row">
            <span class="label">Score</span>
            <input type="text" placeholder="점수를 입력하세요" v-model="score" />
          </div>

          <div class="info-row">
            <span class="label">Level</span>
            <input type="text" placeholder="급수를 입력하세요 (예: N1)" v-model="level" />
          </div>

          <div class="info-row">
            <span class="label">성적파일</span>
            <input type="file" @change="handleFiles" />
          </div>
          <div class="info-row">
            <button class="submit-btn" @click="scoreSubmit">성적 등록</button>
          </div>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { postUserGrade } from '@/api/auth'
import AppLayout from '@/layouts/AppLayout.vue'
import { useUserStore } from '@/stores/user'
import { ref, watchEffect } from 'vue' // [추가] ref 임포트

// user store ( user.userInfo ) 불러오기
const user = useUserStore()

const isForm = ref(false)

const exam_type = ref('')
const score = ref('')
const level = ref('')
const files = ref([])

const handleFiles = (event) => {
  const selected = event.target.files
  files.value = Array.from(selected)
}
const scoreSubmit = async () => {
  const formData = new FormData()

  formData.append('exam_type', exam_type.value)
  formData.append('score', score.value)
  formData.append('level', level.value)

  if (files.value.length > 0) {
    formData.append('files', files.value[0])
  }

  try {
    await postUserGrade(formData)
  } catch (err) {
    console.error('성적 등록 실패', err)
  }
}

const studentScoreInputForm = () => {
  isForm.value = !isForm.value
}

watchEffect(() => {
  console.log(exam_type.value)
  console.log(score.value)
  console.log(level.value)
  console.log(files.value)
})
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.user-info-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem;
}

.user-info-container {
  max-width: 1440px; /* [수정] width -> max-width */
  width: 100%; /* [추가] 화면 너비에 맞게 조절 */
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* ===== 2. 사용자 정보 카드 ===== */
.user-info-card {
  background-color: #fff;
  border-radius: 1.25rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem 2.5rem;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

.user-info-card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}

/* ===== 3. 타이틀 및 카드 헤더 (수정) ===== */

/* [추가] h1과 버튼을 양쪽으로 정렬하기 위한 래퍼 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; /* h1의 margin-bottom을 이쪽으로 이동 */
}

.portal-title {
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #111827;
  /* [수정] margin-bottom과 text-align 제거 (card-header가 제어) */
  margin-bottom: 0;
  /* text-align: center; */ /* 제거됨 */
}

/* [신규] 성적 입력 토글 버튼 스타일 */
.grade-btn {
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem; /* 8px */
  border: 1px solid #d1d5db; /* gray-300 */
  background-color: #fff;
  color: #374151; /* gray-700 */
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; /* '입력창 닫기' 시 줄바꿈 방지 */
}

.grade-btn:hover {
  background-color: #f9fafb; /* gray-50 */
}

/* [신규] 닫기 버튼일 때 (동적 클래스) */
.grade-btn.btn-close {
  background-color: #fef2f2; /* red-50 */
  border-color: #fca5a5; /* red-300 */
  color: #b91c1c; /* red-700 */
}

.grade-btn.btn-close:hover {
  background-color: #fee2e2; /* red-100 */
}

.submit-btn {
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem; /* 8px */
  border: 1px solid #d1d5db; /* gray-300 */
  background-color: #fff;
  color: #374151; /* gray-700 */
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; /* '입력창 닫기' 시 줄바꿈 방지 */
}

.submit-btn:hover {
  background-color: #f9fafb; /* gray-50 */
}

/* ===== 4. 정보 행 ===== */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.value {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

/* ===== 5. 권한 뱃지 ===== */
.role {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: capitalize;
  /* 기본 색상 (학년 등) */
  background-color: #f0f0f0;
  color: #666;
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

/* ===== 6. 성적 정보 폼 스타일 ===== */

/* (이전 답변과 동일한 폼 스타일링) */

/* 텍스트 인풋 (Score, Level) */
.info-row input[type='text'] {
  width: 280px;
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  color: #1f2937;
  background-color: #fff;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.info-row input[type='text']:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

/* 라디오 버튼 그룹 (시험 유형) */
.radio-group {
  display: flex;
  gap: 0.5rem;
}

.radio-group label {
  display: block;
  cursor: pointer;
}

.radio-group input[type='radio'] {
  display: none;
}

.radio-group label span {
  display: block;
  background-color: #fff;
  border: 1px solid #d1d5db;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
  user-select: none;
}

.radio-group label:hover span {
  background-color: #f9fafb;
}

.radio-group input[type='radio']:checked + span {
  background-color: #e3f2fd;
  color: #1565c0;
  border-color: #a6d5fa;
  font-weight: 700;
}

/* 파일 업로드 (성적파일) */
.info-row input[type='file'] {
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  font-size: 0.9rem;
  color: #374151;
  width: 280px;
}

.info-row input[type='file']::file-selector-button {
  background-color: #fff;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  color: #374151;
  cursor: pointer;
  margin-right: 0.75rem;
  transition: background-color 0.2s ease;
}

.info-row input[type='file']::file-selector-button:hover {
  background-color: #f9fafb;
}
</style>
