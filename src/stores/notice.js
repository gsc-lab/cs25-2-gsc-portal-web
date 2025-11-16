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

  // ===================================================
  // 파라미터 요청시 필요한 데이터
  // 1. page : 페이지
  // 2. size : 공지수
  // 3. search : 조회할 게시글 제목
  // 4. course_id : 특정 과목 id
  // 5. course_type : 과목 타입
  // 6. grade_id : 타켓 학년
  // 7. language_id : 타켓 언어
  // 8. author_id : 작성자
  // const params = {
  //   page: 1,
  //   size: 10,
  //   search: '',
  //   course_id: '',
  //   course_type: '',
  //   grade_id: 1,
  //   language_id: '',
  //   author_id: '',
  // }
  // ===================================================

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
  const targetSelect = ref("전체")
  const courseTypeSelect = ref("general")
  const courseSelect = ref("")


  // apiCourse에서 요청받은 과목 정보 가져오기
  function setCourse(course_list) {
    courses.value = course_list
  }

  // 전체 과목 정보에서 course_id를 키값으로 하여 빠르게 접근 가능
  const courseMap = computed(() => {
    const map = new Map()
    for (const course of courses.value) {
      map.set(course.course_id, course)
    }
    return map
  })


  // 전체 공지사항 조회
  async function fetchNotice() {
    isLoading.value = true

    try {
      const response = await getNotice()
      noticeList.value = response.notices
    } catch (err) {
      error.value = err
      console.error("전체 공지사항을 조회 실패", err)
    } finally {
      isLoading.value = false
    }
  }

  // 공지사항 필터링
  const filterNotices = computed(() => {
    return noticeList.value.filter((notice) => {
      const course = courseMap.value.get(notice.course_id)

      // 타겟 체크 ture 시 해당 학년 게시글만 반환
      let targetCheck = false
      if (notice.course_id) {
        targetCheck = course?.grade_id === targetSelect.value || course?.course_type === targetSelect.value
      } else {

        if (notice.targets.length > 0 || notice.targets.some((target) => target?.grade_id !== null)) {
          targetCheck = notice.targets.some((target) => target.grade_id === targetSelect.value)
        } else {
          targetCheck = targetSelect.value === '전체'
        }
      }

      // 과목별 ture 시 해당 과목 x 게시글만 반환

      let courseTypeCheck = false
      if (courseTypeSelect.value === 'general') {
        courseTypeCheck = true
      } else if (notice.course_id && course?.course_type === 'special' || course?.course_type === 'korean') {
        courseTypeCheck = course?.course_type === courseTypeSelect.value
      } else if (notice.course_id) {
        courseTypeCheck = course?.course_type === courseTypeSelect.value
      } else {
        courseTypeCheck = false
      }

      // 과목 선택 필터링 확인
      let courseSelectCheck = false
      if (courseSelect.value === '') {
        courseSelectCheck = true
      } else {
        courseSelectCheck = notice.course_id === courseSelect.value;
      }

      return targetCheck && courseTypeCheck && courseSelectCheck
    })
  })

  // 일본어 특강 A 반 필터링
  const coursesA = computed(() => {
    const filterA = courses.value.filter((course) => {
      const targetCheck = targetSelect.value === course.course_type
      const titleCheck = course.title && course.title.trim() !== ''
      const courseTypeCheck = courseTypeSelect.value === 'A'
      const classCheck = course.class_id && course.class_id.includes('A')

      return targetCheck && titleCheck && courseTypeCheck && classCheck
    })
    return filterA
  })

  // 일본어 특강 B 반 필터링
  const coursesB = computed(() => {
    const filterB = courses.value.filter((course) => {
      const targetCheck = targetSelect.value === course.course_type
      const titleCheck = course.title && course.title.trim() !== ''
      const courseTypeCheck = courseTypeSelect.value === 'B'
      const classCheck = course.class_id && course.class_id.includes('B')

      return targetCheck && titleCheck && courseTypeCheck && classCheck
    })
    return filterB
  })




  // 학년 별 필터링

  // 과목별
  return {
    noticeList,
    courses,
    targetSelect,
    courseTypeSelect,
    courseSelect,
    fetchNotice,
    filterNotices,
    noticeTarget,
    course_type,
    setCourse,
    courseMap,
    coursesA,
    coursesB,
  }

})
