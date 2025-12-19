import { defineStore } from "pinia";
import { getCourse } from "@/api/apiCourse";
import { ref, computed } from "vue";

export const useCourseStore = defineStore('course', () => {

  // 전체 과목 정보
  const courses = ref([])
  // 선택 학년
  const targetSelect = ref('')

  // 상태확인, 에러 메시지 저장
  const isLoading = ref(false)
  const error = ref('')

  const courseMap = computed(() => {
    const map = new Map()

    for (const course of courses.value) {
      map.set(course.course_id, course)
    }
    return map
  })


  async function fetchCourse() {
    isLoading.value = true

    try {
      courses.value = await getCourse()
    } catch (err) {
      error.value = err
      console.error("전체 과목 정보 불러오기 실패", err)
    } finally {
      isLoading.value = false
    }
  }


  return {
    courses,
    fetchCourse,
    targetSelect,
    courseMap,
  }
})
