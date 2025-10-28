<template>
  <div class="notice-detail">
    <!-- 헤더 -->
    <div class="notice-detail-header">
      <span>공지사항 수정</span>
      <button @click="openTargetModal = true">공지사항 알림 대상 설정</button>
      <!-- Modal 창 생성 -->
      <div
        v-if="openTargetModal"
        class="modal-overlay"
        @click.self="openTargetModal = false"
      >
        <div class="modal-container">
          <!-- 헤더 -->
          <div class="modal-header">
            <h3>공지사항 알림 대상 설정</h3>
            <button
              class="modal-close"
              @click="openTargetModal = false"
            >
              X
            </button>
          </div>

          <!-- 학생정보 리스트 -->
          <div class="modal-body">
            <div class="grade-list">
              <button
                v-for="filter in gradeFilters"
                :key="filter"
                @click="modalGradeSelect = filter"
              >
                {{ filter }}
              </button>
            </div>
            <div class="student-list">
              <div class="student-header">
                <div class="col-checked">선택</div>
                <div class="col-grade">학년</div>
                <div class="col-user_id">학번</div>
                <div class="col-name">이름</div>
                <div class="col-phone">전화번호</div>
              </div>
              <template
                v-for="student in students"
                :key="student"
              >
                <div
                  v-if="modalGradeSelect === student.grade_name"
                  class="student-item"
                >
                  <input
                    type="checkbox"
                    class="col-checked"
                    v-model="modalStudentSelect"
                    :value="student.user_id"
                  />
                  <div class="col-grade">{{ student.grade_name }}</div>
                  <div class="col-user_id">{{ student.user_id }}</div>
                  <div class="col-name">{{ student.name }}</div>
                  <div class="col-phone">{{ student.phone }}</div>
                </div>
              </template>
            </div>
          </div>

          <!-- 취소, 저장 버튼 -->
          <div class="modal-footer">
            <button
              class="cancel-btn"
              @click="openTargetModal = false"
            >
              닫기
            </button>
            <button
              class="save-btn"
              @click="saveAndClose"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 제목 -->
    <div class="notice-detail-section-title">
      <div>제목</div>
      <div>중요</div>
      <input
        type="checkbox"
        v-model="isImportant"
      />
      <input
        type="text"
        v-model="title"
      />
    </div>

    <!-- 작성자 -->
    <div class="notice-detail-section-author">
      <div>작성자</div>
      <!-- 로그인 정보 확인 후 이름 자동 입력 기능 구현 -->
      <input
        type="text"
        value="공지사항 작성자"
        v-model="author"
      />
    </div>

    <!-- 학년 -->
    <div class="notice-detail-section-select">
      <div>학년</div>
      <select v-model="gradeCheck">
        <option
          v-for="grade in grades"
          :key="grade.grade_id"
          :value="grade.grade_id"
        >
          {{ grade.grade_id === '전체' ? grade.grade_id : grade.grade_id + '학년' }}
        </option>
      </select>
    </div>
    <!-- 과목 유형 선택 -->
    <div class="notice-detail-section-select">
      <div>과목유형</div>
      <select v-model="courseTypeCheck">
        <option
          v-for="courseT in courseType"
          :key="courseT"
          :value="courseT.course_type"
        >
          {{ courseT.course_type === 'regular' ? '정규' : courseT.course_type === 'special' ? '특강' : '전체' }}
        </option>
      </select>
    </div>
    <!-- 학년, 과목 유형에 따른 과목 필터링 -->
    <div class="notice-detail-section-select">
      <div>과목</div>
      <select
        v-if="filterCourse.length"
        v-model="course_title"
      >
        <option
          v-for="course in filterCourse"
          :key="course.course_id"
          :value="course.title"
        >
          {{ course.title }}
        </option>
      </select>
    </div>

    <!-- 첨부파일 -->
    <div class="notice-detail-files">
      <span>첨부파일</span>
      <input
        type="file"
        multiple
        @change="handleFiles"
      />
      <ul>
        <li
          v-for="(file, index) in files"
          :key="'old-' + index"
        >
          {{ file.name || fixFileName(file.file_name) }}
          <button @click="removeOldFile(index)">삭제</button>
        </li>
        <li
          v-for="(file, index) in newFiles"
          :key="'new-' + index"
        >
          {{ fixFileName(file.name) }}
          <button @click="removeNewFile(index)">삭제</button>
        </li>
      </ul>
    </div>

    <!-- 내용 -->
    <div class="notice-detail-content">
      <textarea
        value="내용을 입력하세요"
        v-model="content"
      ></textarea>
    </div>

    <!-- 등록, 뒤로 버튼 -->
    <div class="notice-detail-footer">
      <button
        class="register-btn"
        @click="updateNotice"
      >
        수정하기
      </button>
      <button
        class="back-btn"
        @click="backPage"
      >
        뒤로
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getNoticeView, getCourse, gradeList, course_type, patchNotice as patchNotice, getAllUser } from '@/api/apiNotice';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const notice = ref(null);

const title = ref('') // 제목
const isImportant = ref(false); // 중요
const author = ref('') // 작성자
const gradeCheck = ref(''); // 학년 선택
const courseTypeCheck = ref('general') // select 태그에서 선택시 변경 : 기본값 regular
const course_title = ref('') // 선택한 과목 명
const files = ref([]) // 기존 파일
const newFiles = ref([]) // 새로 추가되는 파일
// const files = ref([]) // 파일 배열
const content = ref('') // 내용

// ======================================================================

const openTargetModal = ref(false)
const gradeFilters = ref(['1학년', '2학년', '3학년'])
const modalGradeSelect = ref('')          // 모달) 학년 선택
const modalStudentSelect = ref([])        // 모달) 선택된 학생들

// ======================================================================

const courses = ref([]) // 과목 선택 배열
const grades = ref([]) // 학년 저장 배열
const courseType = ref([]) // 과목 타입 저장 배열 : 'regular' , 'special'
const students = ref([]);                 // 학생 목록 배열

onMounted(async () => {
  try {
    const noticeId = route.params.id;
    courses.value = await getCourse()
    students.value = await getAllUser();
    grades.value = gradeList();
    courseType.value = course_type()
    console.log(noticeId)

    const res = await getNoticeView(noticeId)
    notice.value = res || {}

    console.log(notice.value)

    title.value = notice.value.title || ''
    isImportant.value = notice.value.is_pinned === 1
    author.value = notice.value.author.name || ''
    gradeCheck.value = notice.value.targets[0].grade_id || '전체'
    courseTypeCheck.value = notice.value.course_type || 'general'
    course_title.value = notice.value.course_title || ''
    content.value = notice.value.content || ''
    files.value = notice.value.attachments || []
    console.log(files.value)
  } catch (err) {
    console.log(err)
  }
})

const filterCourse = computed(() => {
  // if (gradeCheck.value === '전체') return courses.value
  if (gradeCheck.value === '전체') {
    // 대상 (grade) 이 전체일 경우 과목 명에 따라 courses에 담기는 데이터를 구분
    return courses.value.filter(c => c.course_type === courseTypeCheck.value)
  } else {
    return courses.value.filter(c => c.grade_id === gradeCheck.value && c.course_type === courseTypeCheck.value)
  }
})

const fixFileName = (str) => {
  try {
    return decodeURIComponent(escape(str))
  } catch {
    return str
  }
}

// const selectedCourse = computed(() =>
//   courses.value.find((c) => c.course_id === course_title.value)
// )

const selectedCourseId = computed(() => {
  const selected = courses.value.find(c => c.title === course_title.value)
  return selected ? selected.course_id : null
}
)

const handleFiles = (event) => {
  const selected = Array.from(event.target.files);
  newFiles.value.push(...selected)
}

const removeOldFile = (index) => {
  files.value.splice(index, 1)
}

const removeNewFile = (index) => {
  newFiles.value.splice(index, 1)
}


// 공지사항 수정 등록 ( API POST 요청 )
const updateNotice = async () => {
  const noticeData = {}

  if (title.value !== notice.value?.title) {
    noticeData.title = title.value
  }

  noticeData.is_pinned = isImportant.value ? 1 : 0

  if (content.value !== notice.value?.content) {
    noticeData.content = content.value
  }

  if (selectedCourseId.value !== notice.value?.course_id) {
    noticeData.course_id = selectedCourseId.value
  }

  const newTargets = [
    {
      target_grade_id: gradeCheck.value || null,
      target_level_id: null,
      target_language_id: null,
    },
  ]
  if (JSON.stringify(newTargets) !== JSON.stringify(notice.value?.targets)) {
    noticeData.targets = newTargets
  }

  try {
    await patchNotice(route.params.id, noticeData, newFiles.value);
    alert('공지사항이 수정 되었습니다.')
    router.push({ path: '/notice' })
  } catch (err) {
    console.error(err);
    alert('업로드 중 오류가 발생했습니다.')
  }
}

const saveAndClose = () => {
  console.log(modalStudentSelect.value)
  openTargetModal.value = false
}

const backPage = () => {
  router.back()
}
</script>

<style>
.notice-detail {
  width: 100%;
  max-width: 1000px;
  margin: 60px auto;
  border: 3px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  overflow: hidden;
  font-size: 15px;
  color: #333;
}

/* 🔹 헤더 타이틀 영역 */
.notice-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6f2ff;
  border-bottom: 2px solid #ccc;
  padding: 12px 20px;
  font-size: 20px;
  font-weight: bold;
}

.notice-detail-header button {
  background-color: lightcoral;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.notice-detail-header button:hover {
  background-color: #e65b5b;
}

/* 🔸 항목 블록 공통 스타일 */
.notice-detail-section-title {
  display: grid;
  grid-template-columns: 80px 50px 30px 1fr;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #9cd3dc;
}

.notice-detail-section-author {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #9cd3dc;
}

.notice-detail-section-select {
  display: grid;
  grid-template-columns: 80px 200px 100px 200px;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #9cd3dc;
}

/* 블록 내의 항목명 스타일 */
.notice-detail-section>div:first-child,
.notice-detail-section>div:nth-child(3) {
  font-weight: bold;
  text-align: center;
  color: #444;
}

/* 블록 내의 값 스타일 */
.notice-detail-section>div:nth-child(2),
.notice-detail-section>div:nth-child(4) {
  text-align: center;
}

/* 🔸 첨부파일 섹션 (1행 전용) */
.notice-detail-files {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #fffafc;
}

.notice-detail-files span {
  font-weight: bold;
  text-align: center;
  margin-right: 12px;
}

.notice-detail-files a {
  color: #0077cc;
  text-decoration: none;
}

.notice-detail-files a:hover {
  text-decoration: underline;
}

/* 🧾 본문 영역 */
.notice-detail-content {
  padding: 20px;
  height: 200px;
  min-height: 250px;
  background-color: #f9f9f9;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
  line-height: 1.7;
  font-size: 15px;
}

textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  font-size: 20px;
}

/* 🔙 버튼 영역 */
.notice-detail-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #fefefe;
}

.notice-detail-footer button {
  width: 120px;
  height: 36px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.notice-detail-footer .back-btn {
  background-color: lightcoral;
  color: white;
}

.notice-detail-footer .back-btn:hover {
  background-color: #e65b5b;
}

.notice-detail-footer .register-btn {
  background-color: lightskyblue;
  color: white;
}

.notice-detail-footer .register-btn:hover {
  background-color: #0077cc;
}

.notice-detail-footer .confirm-btn {
  background-color: #b0e0e6;
}

.notice-detail-footer .confirm-btn:hover {
  background-color: #9cd3dc;
}

.modal {
  position: fixed;
  background-color: lightgreen;
  z-index: 999;
  top: 20%;
  left: 30%;
  width: 800px;
  margin-left: -150px;
}
</style>
