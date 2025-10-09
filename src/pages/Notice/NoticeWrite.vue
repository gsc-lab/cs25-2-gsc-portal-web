<template>
  <div class="notice-detail">
    <!-- 헤더 -->
    <div class="notice-detail-header">
      <span>공지사항 작성</span>
    </div>

    <!-- 제목 / 작성일 -->
    <div class="notice-detail-section">
      <div>제목</div>
      <input type="text" />
      <div>학년</div>
      <select v-model="gradeCheck">
        <option v-for="grade in grades" :key="grade.grade_id" :value="grade.grade_id">
          {{ grade.grade_id === '전체' ? grade.grade_id : grade.grade_id + '학년' }}
        </option>
      </select>
    </div>

    <!-- 작성자 / 조회수 -->
    <div class="notice-detail-section">
      <div>작성자</div>
      <input type="text" value="">
      <div>과목</div>
      <select v-if="filterCourse.length">
        <option v-for="course in filterCourse" :key="course.course_id" :value="course.course_id">{{ course.title }}
        </option>
      </select>
    </div>

    <!-- 첨부파일 -->
    <div class="notice-detail-files">
      <span>첨부파일</span>
      <input type="file">
    </div>

    <!-- 내용 -->
    <div class="notice-detail-content">
    </div>

    <!-- 하단 버튼 -->
    <div class="notice-detail-footer">
      <button class="register-btn">등록하기</button>
      <button class="back-btn">뒤로</button>
    </div>
  </div>
</template>

<script setup>
import { getCourse, gradeList } from '@/api/apiNotice';
import { computed, onMounted, ref } from 'vue';


const courses = ref([])
const grades = ref([])
const gradeCheck = ref("전체");

const filterCourse = computed(() => {
  if (gradeCheck.value === '전체') return courses.value
  return courses.value.filter(c => c.grade_id === gradeCheck.value)
})

onMounted(async () => {
  try {
    courses.value = await getCourse();

    grades.value = gradeList();
    console.log(courses.value)
  } catch (err) {
    console.error("데이터 로드 실패", err)
  }
})

console.log(courses)

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
.notice-detail-section {
  display: grid;
  grid-template-columns: 100px 1fr 120px 250px;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #fffafc;
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
  min-height: 250px;
  background-color: #f9f9f9;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
  line-height: 1.7;
  font-size: 15px;
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
</style>
