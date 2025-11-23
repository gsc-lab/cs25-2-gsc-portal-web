import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { getNotice } from '@/api/apiNotice'

export const useNoticeStore = defineStore('Notice', () => {

  // 전체 공지사항 정보
  const noticeList = ref([])
  // 전체 과목 정보
  const courses = ref([])

  // 상태 확인, 에러메시지 저장
  const isLoading = ref(false)
  const error = ref('')

  // 타겟 목록 ( 전체, 1학년, 2학년, 3학년, 특강, 한국어)
  const noticeTarget = ref([
    { target: '전체' },
    { target: '1' },
    { target: '2' },
    { target: '3' },
    { target: 'special' },
    { target: 'korean' }
  ])

  // 과목 타입 목록 ( 전체, 정규 )
  const course_type = ref([
    { course_type: 'general' },
    { course_type: 'regular' },
    { course_type: 'A' },
    { course_type: 'B' }
  ])

  // 필터링 시 필요 조건 항목
  const targetSelect = ref('전체')
  const courseTypeSelect = ref('general')
  const courseSelect = ref('')

  // 페이지네이션 및 검색 상태 / 내 글 보기
  const page = ref(1)       // 현재 페이지
  const totalCount = ref(0) // 전체 게시글 수 (서버에서 받아옴)
  const keyword = ref('')   // 검색어
  const authorSelect = ref('')

  // apiCourse에서 요청받은 과목 정보 가져오기
  function setCourse(course_list) {
    courses.value = course_list
  }

  // 전체 과목 정보에서 course_id를 키값으로 하여 객체 접근 가능
  const courseMap = computed(() => {
    const map = new Map()
    for (const course of courses.value) {
      map.set(course.course_id, course)
    }
    return map
  })

  // 조건에 맞는 공지사항 필터링
  async function fetchNotice() {
    isLoading.value = true

    try {
      const postParams = {
        page: page.value,
        size: 10,
        search: keyword.value || null,
        author_id: authorSelect.value || null,
        course_id: courseSelect.value || null,
        grade_id: ['1', '2', '3'].includes(targetSelect.value) ? targetSelect.value : null,

        language_id: (() => {
          if (targetSelect.value === 'special') return 'JP';
          if (targetSelect.value === 'korean') return 'KR';
          return null;
        })(),

        course_type: (() => {
          if (['1', '2', '3'].includes(targetSelect.value)) {
            return courseTypeSelect.value === 'general' ? 'general' : 'regular';
          }
          if (['special', 'korean'].includes(targetSelect.value)) {
            return targetSelect.value;
          }
          return 'general'; // 기본값
        })(),
      }

      const params = removeNull(postParams)
      const response = await getNotice(params)

      noticeList.value = response.notices
      totalCount.value = response.total
    } catch (err) {
      error.value = err
      console.error('공지사항 조회 실패', err)
    } finally {
      isLoading.value = false
    }
  }

  const filterNotices = computed(() => {
    let list = noticeList.value

    if (courseSelect.value) {
      list = list.filter(notice => notice.course_id === courseSelect.value)
    }

    const target = targetSelect.value
    const type = courseTypeSelect.value

    if (['special', 'korean'].includes(target) && ['A', 'B'].includes(type)) {
      return list.filter(notice => {
        // notice.targets 배열을 순회하며 class_id가 현재 타입(A or B)으로 끝나는지 확인
        return notice.targets?.some(t => t.class_id && t.class_id.endsWith(type))
      })
    }

    return list
  })

  function removeNull(arg) {
    const paramVal = {}
    for (const key in arg) {
      if (arg[key] !== null && arg[key] !== undefined && arg[key] !== '') {
        paramVal[key] = arg[key]
      }
    }
    return paramVal
  }

  return {
    noticeList,
    courses,
    targetSelect,
    courseTypeSelect,
    courseSelect,
    noticeTarget,
    course_type,
    isLoading,
    error,
    page,
    totalCount,
    keyword,
    authorSelect,
    setCourse,
    courseMap,
    fetchNotice,
    filterNotices
  }
})
