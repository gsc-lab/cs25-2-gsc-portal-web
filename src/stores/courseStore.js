import { defineStore } from "pinia";
import { getCourse } from "@/api/apiCourse";

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    isLoading: false,
    error: null,

    course_type: [
      { course_type: 'general' },
      { course_type: 'regular' },
      { course_type: 'special' },
      { course_type: 'korean' },
    ],
  }),

  actions: {

    async fetchCourse() {
      this.isLoading = true

      try {
        const response = await getCourse()
        this.courses = response
      } catch (err) {
        this.error = "과목 조회를 실패했습니다."
        console.error(err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
