<template>
  <div>
    <!-- Search and Control Area -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      <div
        class="flex items-center gap-2 text-sm text-text-muted"
        v-if="user.userInfo.role_type !== 'student'"
      >
        <input
          type="checkbox"
          id="myPost"
          :checked="!!authorSelect"
          @change="myPost"
          class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
        <label for="myPost" class="cursor-pointer">내가 쓴 글 보기</label>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <input
          type="text"
          v-model="inputWord"
          @keyup.enter="handleSearch"
          placeholder="제목을 검색하세요"
          class="flex-1 block px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200"
        >
          검색
        </button>
      </div>
    </div>

    <!-- Grade Filter -->
    <div class="flex flex-wrap gap-3 mb-6 items-center">
      <button
        v-for="(notice, key) in isUserInfoList"
        :key="key"
        :class="[
          'px-4 py-2 rounded-full border border-gray-300 bg-white text-text-muted font-medium hover:bg-gray-100 transition-all duration-200 shadow-sm',
          { 'bg-primary text-black border-primary shadow-sm': targetSelect === notice.target },
        ]"
        @click="handleGradeNotice(notice.target)"
      >
        <span>{{ targetFilter(notice.target) }}</span>
      </button>
      <button
        class="ml-auto px-4 py-2 rounded-full border border-gray-300 bg-white text-text-muted font-medium hover:bg-gray-100 transition-all duration-200 shadow-sm"
        @click="detailOpen = !detailOpen"
      >
        상세 필터링 설정
      </button>
    </div>

    <!-- Detail Filters (Course Type) -->
    <div
      v-if="detailOpen && targetSelect !== '전체'"
      class="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-lg mb-6"
    >
      <template v-for="(course, key) in course_type" :key="key">
        <div
          v-if="course.course_type === 'general' || course.course_type === 'regular'"
          class="flex items-center"
        >
          <input
            type="radio"
            :id="key"
            :value="course.course_type"
            v-model="courseTypeSelect"
            class="hidden"
          />
          <label
            v-if="targetSelect === '1' || targetSelect === '2' || targetSelect === '3'"
            :for="key"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                courseTypeSelect === course.course_type,
            }"
          >
            {{ typeFilter(course.course_type) }}
          </label>
        </div>
        <div
          v-if="course.course_type === 'A' || course.course_type === 'B'"
          class="flex items-center"
        >
          <input
            type="radio"
            :id="key"
            :value="course.course_type"
            v-model="courseTypeSelect"
            class="hidden"
          />
          <label
            v-if="targetSelect === 'special' || targetSelect === 'korean'"
            :for="key"
            class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
            :class="{
              'bg-primary-light border-primary text-primary-dark font-semibold':
                courseTypeSelect === course.course_type,
            }"
          >
            {{ typeFilter(course.course_type) }}
          </label>
        </div>
      </template>
    </div>

    <!-- Detail Filters (Courses) -->
    <div
      v-if="detailOpen && targetSelect !== '전체' && courseTypeSelect !== 'general'"
      class="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-lg mb-6"
    >
      <template v-for="course in courses" :key="course.course_id">
        <div class="flex items-center">
          <div>
            <input
              type="radio"
              :id="`${course.course_id}`"
              :value="course.course_id"
              v-model="courseSelect"
              class="hidden"
            />
            <label
              :for="course.course_id"
              class="block text-sm bg-white px-4 py-2 rounded-base shadow-sm transition-all duration-200 cursor-pointer border border-transparent"
              :class="{
                'bg-primary-light border-primary text-primary-dark font-semibold':
                  courseSelect === course.course_id,
              }"
            >
              {{ course.title || course.class_name }}
            </label>
          </div>
        </div>
      </template>
    </div>

    <!-- Notice List Card -->
    <div class="bg-bg-paper rounded-card shadow-subtle overflow-hidden border border-gray-200">
      <div
        class="grid grid-cols-6 md:grid-cols-[80px_2.5fr_4fr_120px_120px_170px] items-center p-3 text-center text-sm font-semibold text-text-heading bg-gray-50 border-b border-gray-200"
      >
        <div class="col-span-1">번호</div>
        <div class="col-span-1 text-left px-2">제목</div>
        <div class="col-span-1 text-left px-2">내용</div>
        <div class="col-span-1">대상</div>
        <div class="col-span-1">작성자</div>
        <div class="col-span-1">작성날짜</div>
      </div>

      <div v-for="(notice, index) in filterNotices" :key="notice.notice_id">
        <div
          class="grid grid-cols-6 md:grid-cols-[80px_2.5fr_4fr_120px_120px_170px] items-center p-3 text-center text-sm text-text-base border-b border-gray-100 cursor-pointer hover:bg-gray-50"
          @click="handleNoticeClick(notice.notice_id)"
        >
          <div class="col-span-1">
            <p v-if="notice.is_pinned">
              <span
                class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap"
              >
                중요
              </span>
            </p>
            <p v-else>
              {{ totalCount - (page - 1) * 10 - index }}
            </p>
          </div>
          <div class="col-span-1 text-left px-2 truncate">{{ notice.title }}</div>
          <div class="col-span-1 text-left px-2 truncate">
            <span>{{ notice.content }}</span>
            <span v-if="notice.attachments.length > 0">📁</span>
          </div>

          <div
            v-if="notice.course_type === 'regular' || notice.course_type === 'general'"
            class="col-span-1"
          >
            <span v-if="notice.course_type === 'general'">
              {{ notice.course_type === 'general' ? '전체' : '정규' }}
            </span>
            <span>
              {{ notice.targets[0]?.grade_id ? notice.targets[0]?.grade_id + '학년' : '' }}
            </span>
          </div>
          <div v-else class="col-span-1">
            <span>
              {{ courseTypeSelect === 'A' ? 'A반' : 'B반' }}
            </span>
          </div>
          <div class="col-span-1">{{ notice?.author?.name }}</div>
          <div class="col-span-1">{{ formatDate(notice.created_at) }}</div>
        </div>
      </div>

      <div v-if="filterNotices.length === 0" class="text-center text-text-muted py-8">
        등록된 공지사항이 없습니다.
      </div>
    </div>

    <NoticePagination
      v-if="totalCount > 0"
      :totalCount="totalCount"
      :currentPage="page"
      @page-change="handlePageMove"
    />
  </div>
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
  router.push({ path: `/noticeView/${notice_id}` })
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
  console.log('학년: ', userInfo.grade_id)
  console.log('학년 타입: ', typeof userInfo.grade_id)

  return noticeTarget.value.filter((t) => {
    if (t.target === '전체') {
      return true
    }
    if (t.target === userInfo.grade_id) {
      console.log('학생 학년은: ', userInfo.grade_id)
      return true
    }
    if (userInfo.language_id === 'JP' && t.target === 'special') {
      console.log('사용자 언어: ', userInfo.language_id)
      return true
    }
    if (userInfo.language_id === 'KR' && t.target === 'korean') {
      return true
    }
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
