<template>
  <section class="notice-board">
    <!-- 공지사항 필터링 (전체, 1학년, 2학년, 3학년) -->
    <div class="grade-filter">
      <button
        v-for="filter in ['', '1', '2', '3']"
        :key="filter"
        :class="['filter', { active: gradeSelect === filter }]"
        @click="gradeSelect = filter"
      >
        <p v-if="filter === ''">전체</p>
        <p v-else>{{ filter + "학년" }}</p>
      </button>
      <button
        class="detail-filter"
        @click="detailOpen = !detailOpen"
      >
        상세 필터링 설정
      </button>
    </div>
    <!-- 상세 필터링 ( 과목 유형, 과목 선택 )-->
    <div
      v-if="detailOpen"
      class="detail-list"
    >
      <template
        v-for="course in course_type"
        :key="course.course_type"
      >
        <div class="filter-item">
          <input
            type="radio"
            :id="`course-${course.course_type}`"
            :value="course.course_type"
            v-model="courseTypeSelect"
          />
          <label :for="`course-${course.course_type}`">
            {{ course.course_type === 'general' ? '전체' :
               course.course_type === 'regular' ? '정규' :
               course.course_type === 'special' ? '특강' : '한국어'}}
          </label>
        </div>
      </template>
    </div>
    <!-- 학년 별 과목 -->
    <div
      v-if="detailOpen && gradeSelect !== '' && courseTypeSelect !== 'general'"
      class="detail-list"
    >
      <template
        v-for="course in courses"
        :key="course.course_id"
      >
        <div
          v-if="gradeSelect === course.grade_id && course.title && course.title.trim() !== '' && course.course_type === courseTypeSelect"
          class="filter-item"
        >
          <div v-if="gradeSelect === course.grade_id">
            <input
              type="radio"
              :id="`${course.course_id}`"
              :value="course.course_id"
              v-model="courseSelect"
            />
            <label :for="course.course_id">
              {{ course.title }}
            </label>
          </div>
        </div>
      </template>
    </div>
    <!-- 상단 헤더 -->
    <div class="notice-header">
      <div class="col-num">번호</div>
      <div class="col-title">제목</div>
      <div class="col-content">내용</div>
      <div class="col-target">대상학년</div>
      <div class="col-author">작성자</div>
      <div class="col-date">작성날짜</div>
    </div>

    <!-- 공지사항 리스트 -->
    <div
      v-for="notice in filterNotices"
      :key="notice.notice_id"
    >
      <!-- course_id가 없을 때 타켓의 학년과 선택된 학년일치, course_id 가 있을 때 그 과목의 grade_id 값과 일치-->
      <div
        class="notice-item"
        @click="HandleNoticeClick(notice.notice_id)"
      >
        <div class="col-num">{{ notice.notice_id }}</div>
        <div class="col-title">{{ notice.title }}</div>
        <div class="col-content">{{ notice.content }}</div>
        <div
          v-if="notice.course_id || notice.targets[0]?.grade_id"
          class="col-target"
        >
          {{ courseIdGradeId(notice.course_id) }}
        </div>
        <div
          v-else
          class="col-target"
        >
          <p>{{ notice.targets[0]?.grade_id ? notice.targets[0]?.grade_id + "학년" : "전체" }}</p>
        </div>
        <div class="col-author">{{ notice.author?.name }}</div>
        <div class="col-date">{{ formatDate(notice.created_at) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect,  } from "vue";
import { storeToRefs } from "pinia";
import { useNoticeStore } from "@/stores/NoticeStore";
import { useCourseStore } from "@/stores/courseStore";
import router from "@/router";

const detailOpen = ref(false)

// 공지사항 store 사용, 과목 store 사용
const noticeStore = useNoticeStore()
const coursesStore = useCourseStore()

// store 가져오기
const { filterNotices, gradeSelect, courseTypeSelect, courseSelect } = storeToRefs(noticeStore)
const { courses, course_type } = storeToRefs(coursesStore)



onMounted(async () => {
  await coursesStore.fetchCourse()
  noticeStore.setCourse(courses.value)
  await noticeStore.fetchNotice()
});

// ==========================작성날짜================================

function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("ko-KR", {
    timeZone: "Asia/seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function courseIdGradeId (courseId) {
  const course = noticeStore.courseMap.get(courseId)
  return course ? course.grade_id + "학년" : "전체"
}

watchEffect(() => {
  console.log("공지사항 리스트 변경", noticeStore.noticeList)
  console.log("과목 목록 변경", courses.value)
  console.log("선택된 학년", gradeSelect.value)
  console.log(courseTypeSelect.value)
  // console.log(courseSelect.value)
  // console.log(gradeSelected.value)
  // console.log("필터링", filterNotices.course_id)
})

watch(gradeSelect, (newVal, oldVal) => {
  if (newVal === '' || newVal !== oldVal) {
    detailOpen.value = false
    courseTypeSelect.value = 'general'
    courseSelect.value = ''
  }
  if (newVal === '1' || newVal === '2') {
    detailOpen.value = true
  }
})

watch(courseTypeSelect, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    courseSelect.value = ''
  }
})

// 선택 공지사항으로 이동
const HandleNoticeClick = (notice_id) => {
  console.log(notice_id);
  router.push({ path: `/noticeView/${notice_id}` });
};
</script>

<style>
.grade-filter {
  display: flex;
  gap: 10px;
  margin: 10px 10px 10px 20px;
  margin-bottom: 12px;
  align-items: center;
}

.notice-search {
  background-color: lightcyan;
  color: blue;
}

.notice-search {
  display: flex;
  width: 350px;
  margin-right: 10px;
  padding: 4px;
  border-radius: 3px;
  border-width: 2px;
}

.notice-search-btn {
  background-color: lightcoral;
  width: 80px;
  height: 30px;
  align-items: center;
  text-align: center;
  border-radius: 2px;
}

.grade-filter .filter {
  padding: 6px 20px;
  border: none;
  border-radius: 6px;
  background-color: rgb(170, 240, 230);
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.grade-filter .filter:hover {
  background-color: #d9e8ff;
}

.grade-filter .filter.active {
  background-color: pink;
  color: #000;
}

.detail-filter {
  padding: 6px 20px;
  border: none;
  border-radius: 6px;
  background-color: rgb(255, 213, 0);
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  margin-left: auto;
}

.notice-board {
  width: 100%;
  max-width: 1500px;
  border: 3px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
  margin: 100px auto;
}

.notice-header,
.notice-item {
  display: grid;
  grid-template-columns: 80px 150px 1fr 100px 100px 120px;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.notice-header {
  background-color: #e6f2ff;
  font-weight: bold;
  text-align: center;
}


.notice-item {
  border-top: 1px solid #ccc;
  text-align: center;
}

.notice-item.important {
  background-color: #fff4f4;
  font-weight: bold;
  color: #d9534f;
}

.notice-item .title a {
  text-decoration: none;
  color: #0077cc;
}

.notice-item .title a:hover {
  text-decoration: underline;
}

.detail-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 14px 24px;
  background: linear-gradient(135deg, #d5e3f0, #b0c2d5);
  font-weight: 600;
  padding: 12px 18px;
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  background-color: white;
  padding: 6px 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: background 0.2s, transform 0.15s;
  cursor: pointer;
}

.filter-item:hover {
  background-color: #f2f8ff;
  transform: scale(1.02);
}

.filter-item input[type="radio"] {
  accent-color: #5b7cc4;
}
</style>
