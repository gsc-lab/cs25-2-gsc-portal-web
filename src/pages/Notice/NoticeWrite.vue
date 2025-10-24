<template>
  <div class="notice-detail">
    <!-- 헤더 -->
    <div class="notice-detail-header">
      <span>공지사항 작성</span>
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
              ×
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
        @click="handleImportant"
      />
      <input
        type="text"
        value="공지사항 제목"
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
      <select v-model="selectGrade">
        <option
          v-for="grade in grades"
          :key="grade.grade_id"
          :value="grade.grade_id"
        >
          {{ grade.grade_id === "전체" ? grade.grade_id : grade.grade_id + "학년" }}
        </option>
      </select>
    </div>
    <!-- 과목 유형 선택 -->
    <div class="notice-detail-section-select">
      <div>과목유형</div>
      <select v-model="selectCourseType">
        <option
          v-for="courseT in courseType"
          :key="courseT"
          :value="courseT.course_type"
        >
          {{
            courseT.course_type === "general"
              ? "전체"
              : courseT.course_type === "regular"
                ? "정규"
                : courseT.course_type === "special"
                  ? "특강"
                  : "한국어"
          }}
        </option>
      </select>
    </div>
    <!-- 학년, 과목 유형에 따른 과목 필터링 -->
    <div class="notice-detail-section-select">
      <div>과목</div>
      <select
        v-if="filterCourse.length"
        v-model="selectCourse"
      >
        <option
          v-for="course in filterCourse"
          :key="course.course_id"
          :value="course.course_id"
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
          :key="index"
        >
          {{ file.name }} ( {{ (file.size / 1024).toFixed(1) }} KB)
          <button @click="removeFile(index)">삭제</button>
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
        @click="submitNotice"
      >
        등록하기
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
import { course_type, getCourse, gradeList, postNotice, getAllUser } from "@/api/apiNotice";
import router from "@/router";
import { computed, onMounted, ref } from "vue";


// ======================================================================

const openTargetModal = ref(false)
const title = ref("");                    // 제목
const isImportant = ref(false);           // 중요
const author = ref("");                   // 작성자
const selectGrade = ref("전체");          // 학년 선택
const selectCourseType = ref("general");  // 선택된 과목 유형 (전체, 정규, 특강, 한국어)
const selectCourse = ref("");             // 과목 명
const files = ref([]);                    // 파일 배열
const content = ref("");                  // 내용

// ======================================================================

const gradeFilters = ref(['1학년', '2학년', '3학년'])
const modalGradeSelect = ref('')          // 모달) 학년 선택
const modalStudentSelect = ref([])        // 모달) 선택된 학생들

// ======================================================================


// API 요청받은값 저장
const courses = ref([]);                  // 과목 선택 배열
const grades = ref([]);                   // 학년 저장 배열
const courseType = ref([]);               // 과목 타입 저장 배열 : 'regular' , 'special'
const students = ref([]);

// ======================================================================

// ======================================================================

onMounted(async () => {
  try {
    courses.value = await getCourse();
    students.value = await getAllUser();

    grades.value = gradeList();
    courseType.value = course_type();
    console.log("과목 목록", courses.value);
    console.log("학생 정보", students.value)
  } catch (err) {
    console.error("데이터 로드 실패", err);
  }
});

// ======================================================================

const handleImportant = () => {
  isImportant.value = true;
};

// 학년, 과목 유형에 따른 과목 필터링
const filterCourse = computed(() => {
  // if (gradeCheck.value === '전체') return courses.value
  // 선택된 학년이 전체일 경우 => 전체 과목배열을 순회하여 선택된 과목타입이 같을 경우 반환 !
  if (selectGrade.value === "전체") {
    return courses.value.filter((c) => c.course_type === selectCourseType.value);
  } else {
    return courses.value.filter(
      (c) => c.grade_id === selectGrade.value && c.course_type === selectCourseType.value,
    );
  }
});

// 과목 배열에서 과목의 ID 값을 이용하여 선택된 과목의 값이 일치하는 값 저장
const selectedCourse = computed(() =>
  courses.value.find((c) => c.course_id === selectCourse.value),
);

const handleFiles = (event) => {
  const selected = event.target.files;
  files.value = [...files.value, ...selected];
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

// 공지사항 등록 ( API POST 요청 )
const submitNotice = async () => {
  if (title.value === "" || content.value === "") {
    alert("제목 및 내용을 입력해주세요");
    return;
  }
  const noticeData = {
    title: title.value,
    author: author.value,
    is_pinned: isImportant.value ? 1 : 0,
    // 타켓이 없을 경우 빈 객체로 전달해야 함 !
    targets: [
      {
        grade_id: null,
        class_id: null,
        language_id: null,
      },
    ],
    course_title: selectCourse.value || null,
    course_id: selectedCourse.value?.course_id || null,
    course_type: selectedCourse.value?.course_type || selectCourseType.value,
    content: content.value,
  };

  try {
    await postNotice(noticeData, files.value);
    alert("공지사항이 업로드 되었습니다.");
    router.push({ path: "/notice" });
  } catch (err) {
    console.error(err);
    alert("업로드 중 오류가 발생했습니다.");
  }
};

const saveAndClose = () => {
  console.log(modalStudentSelect.value)
  openTargetModal.value = false
}

const backPage = () => {
  router.back();
};
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
.notice-detail-section > div:first-child,
.notice-detail-section > div:nth-child(3) {
  font-weight: bold;
  text-align: center;
  color: #444;
}

/* 블록 내의 값 스타일 */
.notice-detail-section > div:nth-child(2),
.notice-detail-section > div:nth-child(4) {
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
/* 🔹 배경 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 🔹 모달 본체 */
.modal-container {
  width: 850px;              /* 가로 확대 */
  height: 600px;             /* 세로 확대 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalPop 0.25s ease;
}

/* 🔹 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6f2ff;
  border-bottom: 1px solid #ccc;
  padding: 16px 24px;
}

.modal-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 32px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #000;
}

/* 🔹 바디 */
.modal-body {
  flex: 1;
  padding: 40px 48px;         /* 내부 여백 확대 */
  background-color: #f9fafb;
  overflow-y: auto;           /* 스크롤 가능 */
  font-size: 16px;
  color: #444;
  line-height: 1.6;
  min-height: 300px;
}

/* 🔹 푸터 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding: 18px 28px;
  border-top: 1px solid #ccc;
  background-color: #fafafa;
}

.modal-footer button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #ccc;
  color: #222;
}

.cancel-btn:hover {
  background-color: #b3b3b3;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.save-btn:hover {
  background-color: #43a047;
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
.student-list {
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  overflow: hidden;
  font-size: 15px;
  color: #333;
  background-color: #fff;
}

/* 공통 레이아웃 (grid로 일정한 간격 유지) */
.student-header,
.student-item {
  display: grid;
  grid-template-columns: 60px 80px 120px 200px 1fr; /* 열 너비 고정 */
  align-items: center;
  text-align: center;
}

/* 헤더 */
.student-header {
  background-color: #e9f2fc;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding: 10px 16px;
}

/* 행(학생 항목) */
.student-item {
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.15s;
}

.student-item:hover {
  background-color: #f8faff;
}

/* 체크박스 중앙정렬 */
.student-item input[type="checkbox"] {
  margin: 0 auto;
  transform: scale(1.2);
  cursor: pointer;
}

/* 텍스트 정렬 */
.col-grade {
  text-align: center;
  font-weight: 600;
  color: #2a3d66;
}

.col-student-id {
  text-align: center;
  font-family: monospace;
}

.col-name {
  padding-left: 8px;
}
</style>
