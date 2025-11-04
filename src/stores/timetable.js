import { defineStore } from 'pinia'
import { lengthHour } from '@/utils/lengthHour'
import { useClassroomStore } from '@/stores/classroom'
import { useProfessorStore } from '@/stores/auth'
import { getAdminTimetable, getCourses } from '@/api/timetableApi'

export const useTimetableStore = defineStore('timetable', {
  state: () => ({
    // 관리자 Timetable / 기준 date
    adminTimetable: [],
    date: null,

    // drag선택 내용
    selectTT: {
      target: null,
      date: null,
      day: null,
      startTime: null,
      endTime: null,
      schedule: null,
      // schedule{
      //    course_id
      //    title
      //    event
      //    professor
      //    professor_id  * 추가
      //    room
      //    room_id * 추가
      //    source
      // }
    },

    // 과목
    courses: [],
  }),
  actions: {
    // ------------------------ adminTimetable --------------------------
    // [ set ] : Timetable 셋팅
    async setTimetable(day = this.selectTT.date) {
      if (day == null) new Date().toISOString().split('T')[0]
      this.adminTimetable = await getAdminTimetable(day)
      this.date = day
      console.log('store: adminTimetable', this.adminTimetable)
    },

    // [ get ] : adminTimetable 반환
    async getTimetable(day) {
      if (this.date != day) {
        await this.setTimetable(day)
      }
      return this.adminTimetable
    },

    // --------------------------- selectTT -----------------------------
    // [ set ] : 시간표 드랙 선택
    async setSchedule(schedule) {
      if (this.selectTT.length > 0) {
        this.removeSchedule()
      }
      // console.log("schedule", schedule);

      // 시간 계산
      const time = lengthHour(schedule)

      if (schedule[0].schedule) {
        // 교수 이름으로 Id 찾기
        const Pstore = useProfessorStore()
        const professor_id = await Pstore.searchProfessorsId(schedule[0].schedule.professor)
        schedule[0].schedule.professor_id = professor_id

        // 장소 이름으로 id 찾기
        const Cstore = useClassroomStore()
        const room_id = await Cstore.searchClassroomId(schedule[0].schedule.room)
        schedule[0].schedule.room_id = room_id
      }

      // 받은 값으로 초기화
      this.selectTT = {
        target: schedule[0].grade,
        date: schedule[0].date,
        day: schedule[0].day,
        startTime: time[0],
        endTime: time[1],
        schedule: schedule[0].schedule,
      }
      console.log('selectTT', this.selectTT)
    },
    // [ del ] : 시간표 드랙 선택
    removeSchedule() {
      this.selectTT = []
    },

    // --------------------------- courses -----------------------------
    // [ set ] : courses셋팅
    async setCourses() {
      this.courses = await getCourses()
      console.log('store: courses', this.courses)
    },

    // [ get ] : courses 반환
    async getCourses() {
      if (this.courses.length <= 0) {
        await this.setCourses()
      }
      return this.courses
    },

    // [ filter ] : target 필터링 과목 목록
    async courseFilter(argTarget) {
      if (this.courses.length <= 0) {
        await this.setCourses()
      }
      // 객체로 필터링
      const newCourses = Object.fromEntries(
        Object.entries(this.courses).filter(([, course]) => course.target === argTarget),
      )
      console.log('newCourses', newCourses)
      return newCourses
    },

    // 과목 id 조회
    // searchCourseId(argTitle) {
    //   const row = this.courses.filter((course) => course.title == argTitle);
    //   return row.course_id;
    // }
  },
})
