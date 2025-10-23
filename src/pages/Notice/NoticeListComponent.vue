<template>
  <section class="notice-board">
    <div class="grade-filter">
      <button
        v-for="filter in filters"
        :key="filter"
        :class="['filter', { active: gradeSelectedFilter === filter }]"
        @click="gradeSelectedFilter = filter"
      >
        <p v-if="filter === ''">전체</p>
        <p v-else>{{ filter + "학년" }}</p>
      </button>
      <input
        class="notice-search"
        v-model="noticeSearch"
        type="text"
        placeholder="검색어를 입력하세요"
      />
      <button
        class="detail-filter"
        @click="detailOpen = !detailOpen"
      >
        상세 필터링 설정
      </button>
    </div>
    <!-- 수업 유형 선택 -->
    <div
      v-if="detailOpen"
      class="detail-list"
    >
      <div
        v-for="course in courseType"
        :key="course.course_type"
        class="filter-item"
      >
        <input
          type="radio"
          :id="`course-${course.course_type}`"
          :value="course.course_type"
          v-model="courseTypeCheck"
        />
        <label :for="`course-${course.course_type}`">
          {{ course.course_type === 'general' ? '전체' : course.course_type === 'regular' ? '정규' : course.course_type === 'special' ? '특강' : '한국어'}}
        </label>
      </div>
    </div>
    <!-- 학년 별 과목 -->
    <div
      v-if="detailOpen && gradeSelectedFilter !== ''"
      class="detail-list"
    >
      <template
        v-for="course in courses"
        :key="course.course_id"
      >
        <div
          v-if="gradeSelectedFilter === course.grade_id && course.title && course.title.trim() !== '' && course.course_type === courseTypeCheck"
          class="filter-item"
        >
          <div v-if="gradeSelectedFilter === course.grade_id">
            <input
              type="radio"
              :id="`${course.course_id}`"
              :value="course.course_id"
              v-model="courseTypeCheck"
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
      <div
        class="notice-item"
        v-if="gradeSelectedFilter === '' || notice.targets?.[0]?.grade_id === gradeSelectedFilter"
        @click="HandleNoticeClick(notice.notice_id)"
      >
        <div class="col-num">{{ notice.notice_id }}</div>
        <div class="col-title">{{ notice.title }}</div>
        <div class="col-content">{{ notice.content }}</div>
        <div class="col-target">
          <p>{{ notice.targets[0]?.grade_id ? notice.targets[0].grade_id + "학년" : "전체" }}</p>
        </div>
        <div class="col-author">{{ notice.author?.name }}</div>
        <div class="col-date">{{ formatDate(notice.created_at) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { course_type, getCourse, getNotice } from "@/api/apiNotice";
import router from "@/router";

// ==========================================================

const notices = ref([]);                  // 공지사항 저장 배열
const noticeSearch = ref("");             // 검색어 입력값 저장
const search = ref("");                   // 입력 버튼 클릭시 검색어 입력값 저장
const filters = ref(["", "1", "2", "3"]); // 전체, 학년 선택
const gradeSelectedFilter = ref("");      // 학년선택된 값
const courseType = ref([]);               // 과목 타입 저장 (regular, special)
const courseTypeCheck = ref("general");   // 선택된 과목 타입
const courses = ref([]);                  // 모든 과목 데이터

const detailOpen = ref(false)

// ==========================================================

onMounted(async () => {
  const notice = await getNotice(); // 공지사항 API 요청
  const course = await getCourse(); // 과목 API 요청
  courseType.value = course_type(); // 과목 타입 API 요청

  courses.value = course;
  notices.value = notice.notices;

  console.log("1~10번 공지:", notices.value);
  console.log("과목 정보: ", courses.value);
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

const filterNotices = computed(() => {
  // 학년 선택 필터링을 기준으로 공지사항 조회
  return notices.value.filter((notice) => {
    let gradeMatch = false
    // 공지사항 course_id 가 있다! -> courses를 타고 grade_id 확인

    if (notice.course_id) {
      const course = courses.value.find((course) => {
        course.course_id === notice.course_id
      })
      if (gradeSelectedFilter.value === '') {
        gradeMatch = false
      } else {
        gradeMatch = course?.grade_id === gradeSelectedFilter.value
      }

    } else {
      if (gradeSelectedFilter.value === '') {
        gradeMatch =
          notice.targets.length === 0 ||
          notice.targets.some((target) => target.grade_id === null)
      } else {
        gradeMatch = notice.targets.some((target) => target.grade_id === gradeSelectedFilter.value)
      }
    }

    return gradeMatch






    // 공지사항 course_id 가 없다! -> targets 의 grade_id 값을 확인

    // 검색어 x : 모든 공지, 검색어 o 제목, 내용에 단어가 포함된 공지만 보여준다.
    // const matchSearch =
    //   !noticeSearch.value ||
    //   notice.title.includes(search.value) ||
    //   notice.content.includes(search.value);

    // const courseTypeFilter = notice.course_type === courseTypeCheck.value;

    // return allMatchFilter && grade1MatchFilter && matchSearch && courseTypeFilter;
  });
});

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
