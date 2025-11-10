<template>
  <AppLayout pageName="noticeWrite">
    <main class="notice-page-wrapper">
      <div class="notice-page-container">
        <div class="notice-write-card">
          <div class="notice-write-header">
            <h1 class="portal-title">공지사항 작성</h1>
            <button @click="openTargetModal = true" class="btn btn-secondary">
              공지사항 알림 대상 설정
            </button>
          </div>

          <div class="notice-form-body">
            <div class="form-row">
              <label class="form-label" for="notice-title">제목</label>
              <div class="title-input-group">
                <input
                  id="notice-title"
                  class="form-input"
                  type="text"
                  placeholder="공지사항 제목을 입력하세요"
                  v-model="title"
                />
                <div class="checkbox-group">
                  <input
                    type="checkbox"
                    id="notice-important"
                    v-model="isImportant"
                    @click="handleImportant"
                  />
                  <label for="notice-important">중요</label>
                </div>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label" for="notice-author">작성자</label>
              <input
                id="notice-author"
                class="form-input"
                value="author.value"
                type="text"
                placeholder="작성자 이름"
                v-model="author"
              />
            </div>

            <div class="form-row">
              <label class="form-label" for="notice-grade">분류</label>
              <div class="select-group">
                <select id="notice-grade" class="form-select" v-model="gradeSelect">
                  <option v-for="grade in grade_id" :key="grade.grade_id" :value="grade.grade_id">
                    {{ grade.grade_id === '전체' ? '전체 학년' : grade.grade_id + '학년' }}
                  </option>
                </select>
                <select class="form-select" v-model="courseTypeSelect">
                  <option
                    v-for="courseT in filterCourseType"
                    :key="courseT"
                    :value="courseT.course_type"
                  >
                    {{
                      courseT.course_type === 'general'
                        ? '전체'
                        : courseT.course_type === 'regular'
                          ? '정규'
                          : courseT.course_type === 'special'
                            ? '특강'
                            : '한국어'
                    }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label" for="notice-course">과목</label>
              <select
                id="notice-course"
                class="form-select"
                v-if="filterCourse.length"
                v-model="courseSelect"
              >
                <option value="">과목을 선택하세요</option>
                <option
                  v-for="course in filterCourse"
                  :key="course.course_id"
                  :value="course.course_id"
                >
                  {{ course.title }}
                </option>
              </select>
              <div v-else class="form-input-placeholder">선택 가능한 과목이 없습니다.</div>
            </div>

            <div class="form-row">
              <label class="form-label">첨부파일</label>
              <div class="file-upload-area">
                <input
                  type="file"
                  multiple
                  @change="handleFiles"
                  id="file-upload"
                  class="file-input-hidden"
                />
                <label for="file-upload" class="file-upload-btn">파일 선택</label>
                <ul class="file-list">
                  <li v-for="(file, index) in files" :key="index">
                    <span>{{ file.name }} ( {{ (file.size / 1024).toFixed(1) }} KB)</span>
                    <button @click="removeFile(index)" class="file-remove-btn">삭제</button>
                  </li>
                </ul>
              </div>
            </div>

            <div class="form-row content-row">
              <label class="form-label" for="notice-content">내용</label>
              <textarea
                id="notice-content"
                class="form-textarea"
                placeholder="내용을 입력하세요"
                v-model="content"
              ></textarea>
            </div>
          </div>

          <div class="notice-write-footer">
            <button class="btn btn-gray" @click="backPage">뒤로</button>
            <button class="btn btn-primary" @click="submitNotice">등록하기</button>
          </div>
        </div>
      </div>

      <div v-if="openTargetModal" class="modal-overlay" @click.self="openTargetModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h3>공지사항 알림 대상 설정</h3>
            <button class="modal-close" @click="openTargetModal = false">×</button>
          </div>

          <div class="modal-body">
            <div class="grade-list">
              <button
                v-for="filter in gradeFilters"
                :key="filter"
                @click="modalGradeSelect = filter"
                :class="['filter-btn', { active: modalGradeSelect === filter }]"
              >
                {{ filter }}
              </button>
            </div>
            <div class="student-list-card">
              <div class="student-list">
                <div class="student-header">
                  <div class="col-checked">선택</div>
                  <div class="col-grade">학년</div>
                  <div class="col-user_id">학번</div>
                  <div class="col-name">이름</div>
                  <div class="col-phone">전화번호</div>
                </div>
                <div class="student-items-container">
                  <template v-for="student in students" :key="student.user_id">
                    <div v-if="modalGradeSelect === student.grade_name" class="student-item">
                      <input
                        type="checkbox"
                        class="col-checked"
                        v-model="modalStudentSelect"
                        :value="student.user_id"
                        :id="`student-${student.user_id}`"
                      />
                      <label :for="`student-${student.user_id}`" class="student-item-content">
                        <div class="col-grade">{{ student.grade_name }}</div>
                        <div class="col-user_id">{{ student.user_id }}</div>
                        <div class="col-name">{{ student.name }}</div>
                        <div class="col-phone">{{ student.phone }}</div>
                      </label>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-gray" @click="openTargetModal = false">닫기</button>
            <button class="btn btn-primary" @click="saveAndClose">저장</button>
          </div>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { getCourse, postNotice, getAllUser } from '@/api/apiNotice'
import AppLayout from '@/layouts/AppLayout.vue'
import router from '@/router'
import { useNoticeStore } from '@/stores/Notice'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'

const user = useUserStore()
const noticeStore = useNoticeStore()

const { grade_id, course_type } = storeToRefs(noticeStore)

// ======================================================================

const openTargetModal = ref(false)
const title = ref('') // 제목
const isImportant = ref(false) // 중요
const author = ref(user.userInfo.name) // 작성자
const gradeSelect = ref('전체') // 학년 선택
const courseTypeSelect = ref('general') // 과목유형 선택 (전체, 정규, 특강, 한국어)
const courseSelect = ref('') // 과목명 선택
const files = ref([]) // 파일 배열
const content = ref('') // 내용
// ======================================================================

const gradeFilters = ref(['1학년', '2학년', '3학년'])
const modalGradeSelect = ref('1학년') // 모달) 학년 선택 (기본값 1학년)
const modalStudentSelect = ref([]) // 모달) 선택된 학생들
// ======================================================================

// API 요청받은값 저장
const courses = ref([]) // 과목 선택 배열
const students = ref([]) // 학생 목록 배열
// ======================================================================

// ======================================================================

onMounted(async () => {
  try {
    courses.value = await getCourse()
    students.value = await getAllUser()

    console.log('과목 목록', courses.value)
    // console.log('학생 정보', students.value)
  } catch (err) {
    console.error('데이터 로드 실패', err)
  }
})

// ======================================================================

const handleImportant = () => {
  // 클릭 시 값 토글 (true -> false, false -> true)
  isImportant.value = !isImportant.value
}

const filterCourseType = computed(() => {
  if (gradeSelect.value === '전체') {
    return course_type.value.filter((type) => type.course_type === 'general')
  } else {
    return course_type.value.filter((type) => type.course_type !== 'general')
  }
})

// 학년, 과목 유형에 따른 과목 필터링
const filterCourse = computed(() => {
  // if (gradeCheck.value === '전체') return courses.value
  // 선택된 학년이 전체일 경우 => 전체 과목배열을 순회하여 선택된 과목타입이 같을 경우 반환 !
  if (gradeSelect.value === '전체') {
    return courses.value.filter((course) => course.course_type === courseTypeSelect.value)
  } else {
    return courses.value.filter(
      (course) =>
        course.grade_id === gradeSelect.value && course.course_type === courseTypeSelect.value,
    )
  }
})

// 과목 배열에서 과목의 ID 값을 이용하여 선택된 과목의 값이 일치하는 값 저장
const selectedCourseId = computed(() => {
  const selected = courses.value.find((course) => course.course_id === courseSelect.value)
  return selected ? selected.course_id : null
})

const selectedCourseTitle = computed(() => {
  const selected = courses.value.find((course) => course.course_id === selectedCourseId.value)
  return selected ? selected.title : null
})

const handleFiles = (event) => {
  const selected = event.target.files
  files.value = [...files.value, ...Array.from(selected)]
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

// 공지사항 등록 ( API POST 요청 )
const submitNotice = async () => {
  if (title.value === '' || content.value === '') {
    alert('제목 및 내용을 입력해주세요')
    return
  }

  const noticeData = {
    title: title.value,
    author: author.value,
    is_pinned: isImportant.value ? 1 : 0,
    course_id: selectedCourseId.value ? selectedCourseId.value : null,
    course_title: selectedCourseTitle.value ? selectedCourseTitle.value?.title : null,
    specific_users: modalStudentSelect.value || [],
    course_type: courseTypeSelect.value,
    content: content.value,
  }

  // 학년 선택 정보가 있을 경우
  if (gradeSelect.value !== '전체') {
    noticeData.targets = [
      {
        grade_id: gradeSelect.value || null,
        level_id: null,
        language_id: null,
      },
    ]
    // 학년 전체일 경우 빈 객체 [] 로 전달
  } else {
    noticeData.targets = []
  }

  console.log('등록 데이터', noticeData)

  try {
    await postNotice(noticeData, files.value)
    alert('공지사항이 업로드 되었습니다.')
    router.push({ path: '/notice' })
  } catch (err) {
    console.error(err)
    alert('업로드 중 오류가 발생했습니다.')
  }
}

watch(gradeSelect, (newGrade) => {
  if (newGrade === '전체') {
    courseTypeSelect.value = 'general'
  } else {
    courseTypeSelect.value = 'regular'
  }
})

watchEffect(() => {
  console.log('선택된 학년: ', gradeSelect.value)
  console.log('선택된 과목 타입: ', courseTypeSelect.value)
  console.log('선택과목 아이디: ', courseSelect.value)
  console.log('필터링: ', selectedCourseId.value)
  console.log('선택된 과목이름: ', selectedCourseTitle.value)
})
const saveAndClose = () => {
  console.log(modalStudentSelect.value)
  openTargetModal.value = false
}

const backPage = () => {
  router.back()
}
</script>

<style scoped>
/* ✅ 'scoped'로 변경 */

/* ===== 1. 전체 레이아웃 ===== */
.notice-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  /* 100vh - 헤더 높이 */
  background-color: #f9fafb;
  /* 대시보드와 동일한 배경 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem;
  /* 상하 여백 */
}

.notice-page-container {
  /* ✅ 고정 폭 컨테이너 (헤더/대시보드와 동일) */
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
}

/* ===== 2. 공지사항 작성 카드 ===== */
.notice-write-card {
  background: #fff;
  border-radius: 1.25rem;
  /* 20px */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  /* shadow-lg */
  overflow: hidden;
  color: #1f2937;
}

/* ===== 3. 카드 헤더 ===== */
.notice-write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.portal-title {
  /* ✅ 로그인/헤더 스타일과 통일 */
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #111827;
}

/* ===== 4. 폼 영역 ===== */
.notice-form-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  /* 폼 행 간의 간격 */
}

.form-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  /* 라벨 140px, 나머지 영역 */
  align-items: flex-start;
  /* 라벨을 상단에 정렬 */
  gap: 1rem;
}

.form-row.content-row {
  /* 내용은 높이가 기므로 flex-start 정렬이 중요 */
  align-items: flex-start;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  padding-top: 0.6rem;
  /* input 높이와 비슷하게 맞춤 */
  color: #374151;
}

/* ===== 5. 폼 입력 요소 스타일 ===== */
.form-input,
.form-select,
.form-textarea,
.form-input-placeholder {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  color: #1f2937;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.form-input-placeholder {
  color: #9ca3af;
  background-color: #f9fafb;
}

.form-textarea {
  min-height: 300px;
  resize: vertical;
}

/* 제목 + 중요 체크박스 */
.title-input-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.title-input-group .form-input {
  flex: 1;
  /* input이 남은 공간을 다 차지 */
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type='checkbox'] {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #6366f1;
}

.checkbox-group label {
  font-weight: 500;
  cursor: pointer;
}

/* 학년 + 과목유형 */
.select-group {
  display: flex;
  gap: 1rem;
}

.select-group .form-select {
  width: 200px;
  /* 고정 너비 */
}

/* ===== 6. 파일 업로드 영역 ===== */
.file-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input-hidden {
  display: none;
  /* 기본 input 숨기기 */
}

.file-upload-btn {
  /* Secondary 버튼 스타일 적용 */
  display: inline-block;
  background: #fff;
  color: #3f2b96;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 120px;
  text-align: center;
}

.file-upload-btn:hover {
  background: #f4f6ff;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-list li {
  background-color: #f4f6ff;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.file-remove-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
}

/* ===== 7. 카드 푸터 (버튼) ===== */
.notice-write-footer {
  display: flex;
  justify-content: flex-end;
  /* 오른쪽 정렬 */
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* ===== 8. 모달 스타일 (전체 테마 적용) ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 900px;
  /* 너비 조정 */
  height: 700px;
  /* 높이 조정 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalPop 0.25s ease;
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
}

/* 모달 바디 */
.modal-body {
  flex: 1;
  padding: 1.5rem;
  background-color: #f9fafb;
  overflow-y: hidden;
  /* 스크롤을 학생 목록에서 처리 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 모달 - 학년 필터 */
.grade-list {
  display: flex;
  gap: 10px;
}

.filter-btn {
  /* ✅ 공지사항 목록 필터와 동일한 스타일 */
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background-color: #fff;
  color: #3f2b96;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background-color: #f4f6ff;
}

.filter-btn.active {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
  border-color: transparent;
}

/* 모달 - 학생 목록 */
.student-list-card {
  flex: 1;
  /* 남은 공간 모두 차지 */
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.student-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.student-header,
.student-item-content {
  display: grid;
  grid-template-columns: 80px 100px 1fr 1fr;
  /* 체크박스 제외하고 4단 */
  align-items: center;
  text-align: center;
  padding: 0 1rem;
}

.student-header {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  /* 헤더와 아이템 그리드 맞추기 위해 체크박스 영역만큼 패딩 */
  padding-left: calc(1rem + 60px);
}

.student-items-container {
  overflow-y: auto;
  /* 여기서만 스크롤 */
  flex: 1;
}

.student-item {
  display: grid;
  /* 체크박스와 내용 분리 */
  grid-template-columns: 60px 1fr;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.student-item:last-child {
  border-bottom: none;
}

.student-item:hover {
  background-color: #f4f6ff;
}

.student-item input[type='checkbox'] {
  justify-self: center;
  accent-color: #6366f1;
  width: 1.1rem;
  height: 1.1rem;
}

.student-item-content {
  padding: 0.75rem 0;
  cursor: pointer;
}

.col-name {
  text-align: left;
  padding-left: 1rem;
}

.col-phone {
  text-align: left;
  padding-left: 1rem;
}

/* 모달 푸터 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

/* ===== 9. 공통 버튼 스타일 ===== */
.btn {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Primary 버튼 (등록, 저장) */
.btn-primary {
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Secondary 버튼 (알림 대상 설정) */
.btn-secondary {
  background: #fff;
  color: #3f2b96;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f4f6ff;
}

/* Gray 버튼 (뒤로, 닫기) */
.btn-gray {
  background: #e5e7eb;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-gray:hover {
  background: #d1d5db;
}

/* 🔸 등장 애니메이션 */
@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
