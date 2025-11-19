<template>
  <AppLayout pageName="noticeEdit">
    <main class="notice-page-wrapper">
      <div class="notice-page-container">
        <div class="notice-write-card">
          <div class="notice-write-header">
            <h1 class="portal-title">공지사항 수정</h1>
            <button @click="openTargetModal = true" class="btn btn-secondary">
              공지사항 알림 대상 설정
            </button>
          </div>

          <div class="notice-form-body">
            <div class="form-row">
              <label class="form-label" for="notice-title">제목</label>
              <div class="title-input-group">
                <input id="notice-title" class="form-input" type="text" v-model="title" />
                <div class="checkbox-group">
                  <input type="checkbox" id="notice-important" v-model="isImportant" />
                  <label for="notice-important">중요</label>
                </div>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label" for="notice-author">작성자</label>
              <input id="notice-author" class="form-input" type="text" v-model="author" />
            </div>

            <div class="form-row">
              <label class="form-label" for="notice-grade">분류</label>
              <div class="select-group">
                <select id="notice-grade" class="form-select" v-model="targetSelect">
                  <option
                    v-for="notice in noticeTarget"
                    :key="notice.target"
                    :value="notice.target"
                  >
                    {{ targetFilter(notice.target) }}
                  </option>
                </select>
                <select class="form-select" v-model="courseTypeSelect">
                  <option
                    v-for="type in filterCourseType"
                    :key="type.course_type"
                    :value="type.course_type"
                  >
                    <span>
                      {{ courseTypeFilter(type.course_type) }}
                    </span>
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label" for="notice-course">과목</label>
              <select
                id="notice-course"
                class="form-select"
                v-if="courses.length"
                v-model="courseSelect"
              >
                <option value="">과목을 선택하세요</option>
                <option v-for="course in courses" :key="course.course_id" :value="course.course_id">
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
                <label for="file-upload" class="file-upload-btn">파일 추가</label>
                <ul class="file-list">
                  <li v-for="(file, index) in existing_file_ids" :key="'old-' + index">
                    <span>(기존) {{ file.name || fixFileName(file.file_name) }}</span>
                    <button @click="removeOldFile(index)" class="file-remove-btn">삭제</button>
                  </li>
                  <li v-for="(file, index) in newFiles" :key="'new-' + index">
                    <span>(신규) {{ fixFileName(file.name) }}</span>
                    <button @click="removeNewFile(index)" class="file-remove-btn">삭제</button>
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
            <button class="btn btn-primary" @click="updateNotice">수정하기</button>
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
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import {
  getNoticeView,
  getCourse,
  patchNotice,
  getAllUser,
  getCourseRegular,
  getCourseSpecial,
} from '@/api/apiNotice'
import { useRoute } from 'vue-router'
import router from '@/router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useNoticeStore } from '@/stores/notice'
import { storeToRefs } from 'pinia'

const route = useRoute()
const notice = ref(null)
const noticeStore = useNoticeStore()

const { noticeTarget, course_type } = storeToRefs(noticeStore)

// ======================= 기존 게시글 내용 저장 ========================

const title = ref('') // 제목
const isImportant = ref(false) // 중요
const author = ref('') // 작성자
const targetSelect = ref('전체') // 학년 선택
const courseTypeSelect = ref('general') // select 태그에서 선택시 변경 : 기본값 regular
const courseSelect = ref('') // 선택한 과목 명
const existing_file_ids = ref([]) // 유지하고 싶은 기존 파일
const newFiles = ref([]) // 새로 추가되는 파일
const content = ref('') // 내용

// ======================================================================

const openTargetModal = ref(false)
const gradeFilters = ref(['1학년', '2학년', '3학년'])
const modalGradeSelect = ref('1학년') // 모달) 학년 선택 (기본값 1학년)
const modalStudentSelect = ref([]) // 모달) 선택된 학생들

// ======================================================================

// API 요청받은값 저장
const courses = ref([]) // 과목 선택 배열
const students = ref([]) // 학생 목록 배열

const isInitial = ref(true) // 초기화 상태 확인

onMounted(async () => {
  try {
    const noticeId = route.params.id
    courses.value = await getCourse()
    students.value = await getAllUser()

    const res = await getNoticeView(noticeId)
    notice.value = res || {}

    // 1. 기본 정보 바인딩
    title.value = notice.value.title || ''
    isImportant.value = notice.value.is_pinned === 1
    author.value = notice.value.author?.name || ''
    content.value = notice.value.content || ''
    existing_file_ids.value = notice.value.attachments || []

    const targetData =
      notice.value.targets && notice.value.targets[0] ? notice.value.targets[0] : null

    if (targetData) {
      if (targetData.grade_id) {
        targetSelect.value = targetData.grade_id // 1, 2, 3
        courseTypeSelect.value = notice.value.course_type // general or regular

        // 정규 수업일 경우 과목 ID 연결
        if (notice.value.course_id) {
          courseSelect.value = notice.value.course_id
        }
      } else {
        // language_id
        if (targetData.language_id === 'JP') {
          targetSelect.value = 'special'
        } else if (targetData.language_id === 'KR') {
          targetSelect.value = 'korean'
        }

        if (targetData.class_id) {
          const typeChar = targetData.class_id.slice(-1)

          const courseId = targetData.class_id.slice(0, -1)

          courseTypeSelect.value = typeChar // A or B
          courseSelect.value = courseId // C003
        }
      }
    } else {
      // 타겟이 없는 경우
      targetSelect.value = '전체'
      courseTypeSelect.value = 'general'
    }

    // 초기화 완료 후 false로 변경하여 watch 동작

    await nextTick()
    isInitial.value = false
  } catch (err) {
    console.error('데이터 로드 실패', err)
  }
})

const filterCourseType = computed(() => {
  if (targetSelect.value === '전체') {
    return course_type.value.filter((type) => type.course_type === 'general')
  }
  if (['1', '2', '3'].includes(targetSelect.value)) {
    const typeList = ['general', 'regular']
    return course_type.value.filter((type) => typeList.includes(type.course_type))
  }
  if (['special', 'korean'].includes(targetSelect.value)) {
    const typeList = ['A', 'B']
    return course_type.value.filter((type) => typeList.includes(type.course_type))
  }

  return []
})
watch([courseTypeSelect, targetSelect], async ([newType, newTarget]) => {
  // 정규 과목 호출 API
  if (['1', '2', '3'].includes(newTarget)) {
    try {
      courses.value = await getCourseRegular(newType, newTarget)
      console.log('학년 별 정규 과목 조회', courses.value)
    } catch (err) {
      console.error('정규 과목 요청 실패', err)
    }
  }
  // 특강 과목 호출 API
  if (['special', 'korean'].includes(newTarget)) {
    try {
      courses.value = await getCourseSpecial(newTarget, newType)
      console.log('특강 과목 조회', courses.value)
    } catch (err) {
      console.error('과목 조회 실패', err)
    }
  }
})

const fixFileName = (str) => {
  try {
    return decodeURIComponent(escape(str))
  } catch {
    return str
  }
}

// 선택된 과목 정보 찾기 (수정 시 사용)
const selectedCourse = computed(() => {
  return courses.value.find((course) => course.course_id === courseSelect.value) || null
})

const handleFiles = (event) => {
  const selected = Array.from(event.target.files)
  newFiles.value.push(...selected)
}

const removeOldFile = (index) => {
  existing_file_ids.value.splice(index, 1)
}

const removeNewFile = (index) => {
  newFiles.value.splice(index, 1)
}

const targetFilter = (target) => {
  if (target === '1' || target === '2' || target === '3') {
    return target + '학년'
  }
  if (target === 'special') return '일본어 특강'
  if (target === 'korean') return '한국어'

  return target
}

const courseTypeFilter = (type) => {
  if (type === 'A' || type === 'B') {
    return type + '반'
  }
  if (type === 'general') {
    return '전체'
  }
  if (type === 'regular') {
    return '정규'
  }
}

// 공지사항 수정 등록 ( API 요청 )
const updateNotice = async () => {
  if (title.value === '' || content.value === '') {
    alert('제목 및 내용을 입력해주세요')
    return
  }

  // 1. 기본 데이터 구성
  const noticeData = {
    title: title.value,
    author: author.value,
    is_pinned: isImportant.value ? 1 : 0,
    course_id: selectedCourse.value ? selectedCourse.value.course_id : null,
    course_title: selectedCourse.value ? selectedCourse.value.title : null,
    specific_users: modalStudentSelect.value || [],
    content: content.value,
    existing_file_ids: existing_file_ids.value.map((file) => file.file_id),

    // course_type 설정 로직
    course_type: ['special', 'korean'].includes(targetSelect.value)
      ? targetSelect.value
      : courseTypeSelect.value,
  }

  // 2. target
  if (targetSelect.value !== '전체') {
    const targetObject = {
      grade_id: null,
      class_id: null,
      language_id: null,
    }

    // 학년일 경우
    if (['1', '2', '3'].includes(targetSelect.value)) {
      targetObject.grade_id = targetSelect.value
    }
    // 특강/한국어일 경우
    else if (['special', 'korean'].includes(targetSelect.value)) {
      // course_id(C007) + 반(A) = C007A로 합침
      if (courseSelect.value && courseTypeSelect.value) {
        targetObject.class_id = courseSelect.value + courseTypeSelect.value
      }

      if (targetSelect.value === 'special') {
        targetObject.language_id = 'JP'
      }
      if (targetSelect.value === 'korean') {
        targetObject.language_id = 'KR'
      }
    }

    noticeData.targets = [targetObject]
  } else {
    // 전체일 경우
    noticeData.targets = []
    noticeData.course_type = 'general'
  }

  console.log('수정 요청 데이터:', noticeData)

  try {
    await patchNotice(route.params.id, noticeData, newFiles.value)
    alert('공지사항이 수정 되었습니다.')
    router.push({ path: '/notice' })
  } catch (err) {
    console.error(err)
    alert('수정 중 오류가 발생했습니다.')
  }
}

// 타입 변경 시 과목 선택 초기화
watch(courseTypeSelect, (newType, oldType) => {
  if (isInitial.value) return
  if (newType !== oldType) {
    courseSelect.value = ''
  }
})

// targetSelect) 변경 시
watch(targetSelect, async (newTarget) => {
  // isInitial false 시 실행하지 않음
  if (isInitial.value) return

  if (newTarget === '전체') {
    courseTypeSelect.value = 'general'
    courseSelect.value = ''
  } else if (['1', '2', '3'].includes(newTarget)) {
    // DOM 업데이트까지 대기
    await nextTick()
    courseTypeSelect.value = 'regular'
    courseSelect.value = ''
  } else if (['special', 'korean'].includes(newTarget)) {
    courseTypeSelect.value = 'A' // 특강 기본값 A반
    courseSelect.value = ''
  }
})

watchEffect(() => {
  //   console.log('선택된 학년: ', targetSelect.value)
  //   console.log('선택된 과목 타입: ', courseTypeSelect.value)
  //   console.log('선택과목 아이디: ', courseSelect.value)
})

const saveAndClose = () => {
  console.log(modalStudentSelect.value)
  openTargetModal.value = false
}

const backPage = () => {
  router.push({ path: '/notice' })
}
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.notice-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px); /* 100vh - 헤더 높이 */
  background-color: #f9fafb; /* 대시보드와 동일한 배경 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem; /* 상하 여백 */
}

.notice-page-container {
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
}

/* ===== 2. 공지사항 작성 카드 ===== */
.notice-write-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
}

.form-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: flex-start;
  gap: 1rem;
}

.form-row.content-row {
  align-items: flex-start;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  padding-top: 0.6rem;
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

.title-input-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.title-input-group .form-input {
  flex: 1;
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

.select-group {
  display: flex;
  gap: 1rem;
}
.select-group .form-select {
  width: 200px;
}

/* ===== 6. 파일 업로드 영역 ===== */
.file-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.file-input-hidden {
  display: none;
}
.file-upload-btn {
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
.file-list li span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
}
.file-remove-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  flex-shrink: 0;
}

/* ===== 7. 카드 푸터 (버튼) ===== */
.notice-write-footer {
  display: flex;
  justify-content: flex-end;
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
  z-index: 9999; /* ✅ 수정 1: z-index 상향 */
}
.modal-container {
  width: 900px; /* 너비 조정 */
  height: 700px; /* 높이 조정 */
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
  overflow-y: hidden; /* 스크롤을 학생 목록에서 처리 */
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
  flex: 1; /* 남은 공간 모두 차지 */
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
  grid-template-columns: 80px 100px 1fr 1fr; /* 체크박스 제외하고 4단 */
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
  overflow-y: auto; /* 여기서만 스크롤 */
  flex: 1;
}

.student-item {
  display: grid; /* 체크박스와 내용 분리 */
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
  background: #f4f6ff;
}

.btn-gray {
  background: #e5e7eb;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-gray:hover {
  background: #d1d5db;
}

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
