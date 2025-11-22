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

        course_type: (() => {
          const target = targetSelect.value
          const type = courseTypeSelect.value
          if (type === 'general') return 'general'
          if (['special', 'korean'].includes(target)) return target
          if (type === 'regular') return 'regular'
          return null
        })()
      }

      const params = removeNull(postParams)
      const response = await getNotice(params)

      noticeList.value = response.notices
      totalCount.value = response.total_count
    } catch (err) {
      error.value = err
      console.error('공지사항 조회 실패', err)
    } finally {
      isLoading.value = false
    }
  }

  const filterNotices = computed(() => {
    const list = noticeList.value
    const target = targetSelect.value
    const type = courseTypeSelect.value

    if (['special', 'korean'].includes(target) && ['A', 'B'].includes(type)) {
      return list.filter(notice => {
        return notice.target?.some(target => target.class_id && target.class_id.includes(type))
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

  // // 전체 공지사항 조회
  // async function fetchNotice() {
  //   isLoading.value = true

  //   try {

  //     const params = {
  //       page: page.value,
  //       size: 10,
  //       keyword: keyword.value,
  //       target: targetSelect.value === '전체' ? null : targetSelect.value
  //     }


  //     const response = await getNotice()
  //     noticeList.value = response.notices
  //   } catch (err) {
  //     error.value = err
  //     console.error("전체 공지사항을 조회 실패", err)
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  // // 공지사항 필터링
  // const filterNotices = computed(() => {
  //   return noticeList.value.filter((notice) => {
  //     const target = targetSelect.value;
  //     const type = courseTypeSelect.value;
  //     const selectedCourseId = courseSelect.value;

  //     // 선택된 과목 id가 선택디고 공지사항의 과목 id 가 선택한 과목 id 와 일치하지 않을 경우 false
  //     if (selectedCourseId && notice.course_id !== selectedCourseId) {
  //       return false;
  //     }

  //     // 공지사항 타겟이 전체일 경우
  //     if (target === '전체') {
  //       // 공지사항의 과목 id 가 존재하지 않고 과목 타입이 general 이며, targets의 값이 빈 배열일 경우
  //       return !notice.course_id && notice.course_type === 'general' && notice.targets.length === 0;
  //     }

  //     // course 안에는 courseMap 에 있는 course_id 값과 일치하는 공지사항의 course_id 를 가져와서 저장
  //     // 존재하지 않을 경우 undifined
  //     const course = courseMap.value.get(notice.course_id);

  //     // 3. [1, 2, 3 학년] 안에 선택된 target에 해당하면 통과
  //     if (['1', '2', '3'].includes(target)) {

  //       // ( course 가 존재 하며, 과목의 학년과 선택한 학년의 값, 과목의 타입이 선택한 타입과 일치여부 확인)
  //       const isCourse =
  //         course &&
  //         course.grade_id === target &&
  //         course.course_type === type;

  //       const isTarget =
  //         notice.targets &&
  //         notice.targets.some((tar) => tar.grade_id === target) &&
  //         notice.course_type === type;

  //       return isCourse || isTarget;
  //     }


  //     if (['special', 'korean'].includes(target)) {

  //       // 1. 공지사항의 타입이 'special'이나 'korean'인지 확인
  //       if (notice.course_type !== target) return false;

  //       return notice.targets?.some(t => t.class_id && t.class_id.includes(type));
  //     }
  //   });
  // });

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
