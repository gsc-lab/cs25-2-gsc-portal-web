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

  // 학년 목록
  const grade_id = ref([
    { grade_id: '전체' },
    { grade_id: '1' },
    { grade_id: '2' },
    { grade_id: '3' },
  ])

  // 과목 타입 목록
  const course_type = ref([
    { course_type: 'general' },
    { course_type: 'regular' },
    { course_type: 'special' },
    { course_type: 'korean' },
  ])

  // 필터링 시 필요 조건 항목
  const gradeSelect = ref("")
  const courseTypeSelect = ref("general")
  const courseSelect = ref("")

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

  const filterNotices = computed(() => {
    return noticeList.value.filter((notice) => {
      const course = courseMap.value.get(notice.course_id)

      // 학년 체크 ture 시 해당 학년 게시글만 반환
      let gradeCheck = false
      if (notice.course_id) {
        gradeCheck = course?.grade_id === gradeSelect.value
      } else {

        if (notice.targets.length > 0 || notice.targets.some((target) => target?.grade_id !== null)) {
          gradeCheck = notice.targets.some((target) => target.grade_id === gradeSelect.value)
        } else {
          gradeCheck = gradeSelect.value === ''
        }
      }

      // 과목별 ture 시 해당 과목 게시글만 반환

      let courseTypeCheck = false
      if (courseTypeSelect.value === 'general') {
        courseTypeCheck = true
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

      return gradeCheck && courseTypeCheck && courseSelectCheck
    })
  })




  // 학년 별 필터링

  // 과목별
  return {
    noticeList,
    courses,
    courseMap,
    gradeSelect,
    courseTypeSelect,
    courseSelect,
    fetchNotice,
    setCourse,
    filterNotices,
    grade_id,
    course_type
  }

})
