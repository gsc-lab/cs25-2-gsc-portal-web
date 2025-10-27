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

      // 학년별 필터링 확인
      let gradeCheck = false
      // 과목 id 가 존재할 경우
      if (notice.course_id) {
        // course의 학년정보가 선택 학년과 동일할 경우 gradeCheck 는 True
        gradeCheck = course?.grade_id === gradeSelect.value
      } else {
        // 특정 학년에 대한 전체 공지사항은 공지사항의 targets에 grade_id 가 null 이 아니거나 빈객체 가 아닐경우 True
        const allGardeTarget = notice.targets.length !== 0 || notice.targets.some((target) => target.grade_id !== null)
        // notice.targets 의 배열길이가 0 이 아니거나 target.grade_id 가 null이 아닐경우
        if (allGardeTarget) {
          // 
          gradeCheck = notice.targets.some((target) => target.grade_id === gradeSelect.value)
        } else {
          gradeCheck = gradeSelect.value === ''
        }
      }

      // 과목별 필터링 확인

      let courseTypeCheck = false
      if (courseTypeSelect.value === 'general') {
        courseTypeCheck = true
      } else if (notice.course_id) {
        courseTypeCheck = course?.course_type === courseTypeSelect.value
      } else {
        courseTypeCheck = false
      }

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
  }

})
