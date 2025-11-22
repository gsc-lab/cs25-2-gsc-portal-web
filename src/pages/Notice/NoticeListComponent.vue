<template>
  <main class="notice-board-wrapper">
    <section class="notice-board-container">
      <div class="search-control-area">
        <div class="my-post-check" v-if="user.userInfo">
          <input type="checkbox" id="myPost" :checked="!!authorSelect" @change="myPost" />
          <label for="myPost">내가 쓴 글 보기</label>
        </div>
        <div class="search-box">
          <input
            type="text"
            v-model="inputWord"
            @keyup.enter="handleSearch"
            placeholder="제목이나 내용을 검색하세요"
          />
          <button @click="handleSearch">검색</button>
        </div>
      </div>

      <div class="grade-filter">
        <button
          v-for="(notice, key) in isUserInfoList"
          :key="key"
          :class="['filter-btn', { active: targetSelect === notice.target }]"
          @click="handleGradeNotice(notice.target)"
        >
          <span>{{ targetFilter(notice.target) }}</span>
        </button>
        <button class="filter-btn detail-filter" @click="detailOpen = !detailOpen">
          상세 필터링 설정
        </button>
      </div>

      <div v-if="detailOpen && targetSelect !== '전체'" class="detail-list">
        <template v-for="(course, key) in course_type" :key="key">
          <div
            v-if="course.course_type === 'general' || course.course_type === 'regular'"
            class="filter-item"
          >
            <input type="radio" :id="key" :value="course.course_type" v-model="courseTypeSelect" />
            <label
              v-if="targetSelect === '1' || targetSelect === '2' || targetSelect === '3'"
              :for="key"
            >
              {{ typeFilter(course.course_type) }}
            </label>
          </div>
          <div v-if="course.course_type === 'A' || course.course_type === 'B'" class="filter-item">
            <input type="radio" :id="key" :value="course.course_type" v-model="courseTypeSelect" />
            <label v-if="targetSelect === 'special' || targetSelect === 'korean'" :for="key">
              {{ typeFilter(course.course_type) }}
            </label>
          </div>
        </template>
      </div>

      <div
        v-if="detailOpen && targetSelect !== '전체' && courseTypeSelect !== 'general'"
        class="detail-list"
      >
        <template v-for="course in courses" :key="course.course_id">
          <div class="filter-item">
            <div>
              <input
                type="radio"
                :id="`${course.course_id}`"
                :value="course.course_id"
                v-model="courseSelect"
              />
              <label :for="course.course_id">
                {{ course.title || course.class_name }}
              </label>
            </div>
          </div>
        </template>
      </div>

      <div class="notice-list-card">
        <div class="notice-header">
          <div class="col-num">번호</div>
          <div class="col-title">제목</div>
          <div class="col-content">내용</div>
          <div class="col-target">대상</div>
          <div class="col-author">작성자</div>
          <div class="col-date">작성날짜</div>
        </div>

        <div v-for="(notice, index) in filterNotices" :key="notice.notice_id">
          <div class="notice-item" @click="handleNoticeClick(notice.notice_id)">
            <div class="col-num">
              <p v-if="notice.is_pinned">
                <span class="badge-pinned">중요</span>
              </p>
              <p v-else>
                {{ totalCount - (page - 1) * 10 - index }}
              </p>
            </div>
            <div class="col-title">{{ notice.title }}</div>
            <div class="col-content">
              <span>{{ notice.content }}</span>
              <span v-if="notice.attachments.length > 0">📁</span>
            </div>

            <div
              v-if="notice.course_type === 'regular' || notice.course_type === 'general'"
              class="col-target"
            >
              <span v-if="notice.course_type === 'general'">
                {{ notice.course_type === 'general' ? '전체' : '정규' }}
              </span>
              <span>
                {{ notice.targets[0]?.grade_id ? notice.targets[0]?.grade_id + '학년' : '' }}
              </span>
            </div>
            <div v-else class="col-target">
              <span>
                {{ courseTypeSelect === 'A' ? 'A반' : 'B반' }}
              </span>
            </div>
            <div class="col-author">{{ notice?.author_name }}</div>
            <div class="col-date">{{ formatDate(notice.created_at) }}</div>
          </div>
        </div>

        <div v-if="filterNotices.length === 0" class="no-data">등록된 공지사항이 없습니다.</div>
      </div>

      <NoticePagination
        v-if="totalCount > 0"
        :totalCount="totalCount"
        :currentPage="page"
        @page-change="handlePageMove"
      />
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useNoticeStore } from '@/stores/notice'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { useRoute } from 'vue-router'
import { getCourseRegular, getCourseSpecial } from '@/api/apiNotice'
import NoticePagination from './NoticePagination.vue'
// import { useUserStore } from '@/stores/user'
// import { getRegularCourse } from '@/api/apiCourse'

const route = useRoute()
const detailOpen = ref(false)
const inputWord = ref('')

const user = useUserStore()
const noticeStore = useNoticeStore()

const {
  filterNotices,
  targetSelect,
  courseTypeSelect,
  courseSelect,
  noticeTarget,
  course_type,
  courses,
  page,
  totalCount,
  keyword,
  authorSelect,
} = storeToRefs(noticeStore)
// const { courses } = storeToRefs(coursesStore)

onMounted(async () => {
  if (route.params.gradeId) {
    targetSelect.value = route.params.gradeId
    detailOpen.value = true
  }

  inputWord.value = keyword.value

  await noticeStore.fetchNotice()
})

// 이벤트 핸들러

// 검색 시
const handleSearch = () => {
  noticeStore.keyword = inputWord.value
  noticeStore.page = 1
  noticeStore.fetchNotice()
}

// 페이지 이동 시
const handlePageMove = (newPage) => {
  noticeStore.page = newPage
  noticeStore.fetchNotice()
}

// 나의 게시물 보기
const myPost = (my) => {
  if (my.target.checked) {
    noticeStore.authorSelect = user.userInfo.user_id
  } else {
    noticeStore.authorSelect = ''
  }
  noticeStore.page = 1
  noticeStore.fetchNotice()
}

// 학년 별 공지사항 이동
const handleGradeNotice = (target) => {
  if (target) {
    targetSelect.value = target
    if (target === '전체') {
      router.push({ path: '/notice' })
    } else {
      router.push({ path: `/notice/grade/${target}` })
    }
  } else {
    targetSelect.value = '전체'
    courseSelect.value = ''
  }
}

const handleNoticeClick = (notice_id) => {
  router.push({ path: `noticeView/${notice_id}` })
}

// 타켓 목록 필터링
const targetFilter = (target) => {
  if (['1', '2', '3'].includes(target)) return target + '학년'
  if (target === 'special') return '일본어 특강'
  if (target === 'korean') return '한국어'

  return target
}

watch(
  [targetSelect, courseTypeSelect, courseSelect],
  async ([newTarget, newType], [oldTarget, oldType]) => {
    // 값이 변하지 않았으면 스킵
    if (
      newTarget === oldTarget &&
      newType === oldType &&
      courseSelect.value === storeToRefs(noticeStore).courseSelect.value
    ) {
      return
    }

    // 과목 목록 조회
    if (newTarget !== oldTarget || newType !== oldType) {
      if (['1', '2', '3'].includes(newTarget) && newType === 'regular') {
        try {
          const response = await getCourseRegular(newType, newTarget)
          noticeStore.setCourse(response) // Store에 저장
        } catch (err) {
          console.error(err)
        }
      } else if (['special', 'korean'].includes(newTarget) && ['A', 'B'].includes(newType)) {
        try {
          const response = await getCourseSpecial(newTarget, newType)
          noticeStore.setCourse(response)
        } catch (err) {
          console.error(err)
        }
      } else {
        noticeStore.setCourse([]) // 그 외 경우는 과목 목록 비움
      }
    }

    // 공지사항 데이터 불러오기 page 는 1로 초기화
    noticeStore.page = 1
    await noticeStore.fetchNotice()
  },
  { deep: true },
)

// 과목 타입 필터링
const typeFilter = (type) => {
  const map = { general: '전체', regular: '정규', A: 'A반', B: 'B반' }
  return map[type] || type
}

// 사용자 유저 정보에 대한 필터링된 리스트
const isUserInfoList = computed(() => {
  if (!user.userInfo) return []
  const userInfo = user.userInfo
  if (userInfo.role_type === 'admin') return noticeTarget.value

  return noticeTarget.value.filter((target) => {
    if (target === userInfo.grade_id) return true
    if (userInfo.language_id === 'JP' && target === 'special') return true
    if (userInfo.language_id === 'KR' && target === 'korean') return true
    return false
  })
})

watchEffect(() => {
  console.log('공지사항 리스트 변경', noticeStore.noticeList)
  console.log('선택된 타켓', targetSelect.value)
  console.log('선택된 타입', courseTypeSelect.value)
  console.log('선택된 과목', courseSelect.value)
  // console.log('과목 목록 변경', courses.value)
  console.log('url 변동 감지', route.params.gradeId)
})

watch(targetSelect, (newTarget, oldTarget) => {
  if (!newTarget || newTarget === oldTarget) return

  // 전체가 아닐 경우 상세 필터 열기
  if (newTarget !== '전체') {
    detailOpen.value = true
  } else {
    detailOpen.value = false
  }

  if (['1', '2', '3'].includes(newTarget)) {
    if (courseTypeSelect.value !== 'general' && courseTypeSelect.value !== 'regular') {
      courseTypeSelect.value = 'general'
    }
  }

  if (['special', 'korean'].includes(newTarget)) {
    if (courseTypeSelect.value !== 'A' && courseTypeSelect.value !== 'B') {
      courseTypeSelect.value = 'A'
    }
  }

  // 코스 선택은 초기화
  courseSelect.value = ''
})

watch(
  () => route.params.gradeId,
  async (newGrade) => {
    if (newGrade) {
      targetSelect.value = newGrade
      detailOpen.value = true
    } else {
      targetSelect.value = '전체'
      detailOpen.value = false
      // 초기화
      courseTypeSelect.value = 'general'
      courseSelect.value = ''
      noticeStore.keyword = ''
      inputWord.value = ''
    }
  },
)

// ==========================작성날짜================================

function formatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.notice-board-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  /* 100vh - 헤더 높이 */
  background-color: #f9fafb;
  /* 대시보드와 동일한 배경 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
}

.notice-board-container {
  /* ✅ 고정 폭 컨테이너 (헤더/대시보드와 동일) */
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 2.5rem 0.5rem;
  /* 상하 여백 */
}

/* ===== 2. 필터 버튼 ===== */
.grade-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 1.5rem;
  align-items: center;
}

.filter-btn {
  /* ✅ Secondary 버튼 스타일 (대시보드 '더보기'와 유사) */
  padding: 0.6rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background-color: #fff;
  color: #3f2b96;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  background-color: #f4f6ff;
  border-color: #c7d2fe;
  transform: translateY(-2px);
}

.filter-btn.active {
  /* ✅ Primary 버튼 스타일 (활성화) */
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  color: white;
  border-color: transparent;
}

.detail-filter {
  /* ✅ '상세 필터' 버튼 오른쪽 정렬 */
  margin-left: auto;
  background-color: #fff;
  color: #1f2937;
  border-color: #d1d5db;
}

.detail-filter:hover {
  background-color: #f9fafb;
}

/* ===== 3. 상세 필터 (라디오) ===== */
.detail-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background-color: #f4f6ff;
  /* 연한 보라색 배경 */
  font-weight: 500;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.filter-item {
  display: flex;
  align-items: center;
}

/* ✅ 기본 라디오 버튼 숨기기 */
.filter-item input[type='radio'] {
  display: none;
}

/* ✅ 라벨을 버튼처럼 스타일링 */
.filter-item label {
  display: block;
  font-size: 0.9rem;
  background-color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.filter-item label:hover {
  background-color: #f9fafb;
  transform: scale(1.02);
}

/* ✅ 라디오 버튼이 선택되었을 때 라벨 스타일 */
.filter-item input[type='radio']:checked + label {
  background-color: #eef2ff;
  border-color: #6366f1;
  color: #3f2b96;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* ===== 4. 공지사항 목록 (카드) ===== */
.notice-list-card {
  /* ✅ 대시보드 카드와 동일한 스타일 */
  background: #fff;
  border-radius: 1.25rem;
  /* 20px */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  /* shadow-lg */
  overflow: hidden;
  /* 모서리 radius 유지를 위해 */
}

/* ✅ Grid 레이아웃 재조정 */
.notice-header,
.notice-item {
  display: grid;
  /* 번호 | 제목 | 내용 | 대상 | 작성자 | 작성날짜 */
  grid-template-columns: 80px 2.5fr 4fr 120px 120px 170px;
  align-items: center;
  padding: 1rem 1.25rem;
  text-align: center;
  font-size: 0.95rem;
  color: #374151;
}

.notice-header {
  background-color: #f9fafb;
  /* 연한 회색 배경 */
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.85rem;
  padding: 0.75rem 1.25rem;
}

.notice-item {
  border-bottom: 1px solid #e5e7eb;
  /* 부드러운 구분선 */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notice-item:last-child {
  border-bottom: none;
  /* 마지막 아이템 구분선 제거 */
}

.notice-item:hover {
  background-color: #f4f6ff;
  /* 호버 시 연한 보라색 */
}

/* ✅ 제목과 내용은 왼쪽 정렬 */
.notice-header .col-title,
.notice-item .col-title,
.notice-header .col-content,
.notice-item .col-content {
  text-align: left;
  padding: 0 10px;
}

/* ✅ 내용 잘림 처리 (한 줄) */
.col-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-num {
  font-weight: 600;
}

.col-date {
  font-size: 0.9rem;
  color: #6b7280;
}

.col-author {
  font-weight: 500;
}

.col-target {
  font-weight: 500;
}
.badge-pinned {
  background: #ffe2e5;
  color: #f64e60;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  white-space: nowrap;
}
</style>
