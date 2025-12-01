import { defineStore } from 'pinia'
import { lengthHour } from '@/utils/lengthHour'
import { useClassroomStore } from '@/stores/classroom'
import { useProfessorStore } from '@/stores/professor'
import {
  getProfessorTimetable,
  getAdminTimetable,
  getCourses,
  getSections,
} from '@/api/timetableApi'

export const useTimetableStore = defineStore('timetable', {
  state: () => ({
    // 교수 Timetable
    professorTimetable: [],
    // 관리자 Timetable / 기준 date
    adminTimetable: [],
    date: null,
    // 공강
    noneTime: {
      1: {},
      2: {},
      3: {},
      special: {},
      korean: {},
    },

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
    // 학기
    sections: [],
  }),
  actions: {
    // ------------------------ studentTimetable --------------------------
    // [ set ] : studentTimetable 셋팅
    async setPfsTimetable(day = this.date) {
      if (day == null) day = new Date().toISOString().split('T')[0]
      this.professorTimetable = await getProfessorTimetable(day)
      this.date = day
    },

    // [ get ] : studentTimetable 반환
    async getPfsTimetable(day) {
      if (this.date != day) {
        await this.setPfsTimetable(day)
      }
      return this.professorTimetable
    },

    // ------------------------ adminTimetable --------------------------
    // [ set ] : Timetable 셋팅
    async setTimetable(day = this.selectTT.date) {
      if (day == null) day = new Date('2025-06-02').toISOString().split('T')[0]
      this.adminTimetable = await getAdminTimetable(day)
      this.date = day
      // console.log('store: adminTimetable', this.adminTimetable)
    },

    // [ get ] : adminTimetable 반환
    async getTimetable(day) {
      if (this.date != day) {
        await this.setTimetable(day)
      }
      return this.adminTimetable
    },

    async setNoneTime() {
      for (const target of ['1', '2', '3', 'special', 'korean']) {
        for (const day of ['MON', 'TUE', 'WED', 'THU', 'FRI']) {
          this.noneTime[target][day] = Object.keys(this.adminTimetable[target][day])
            .map((h) => {
              if (Number(h) <= 12 && !this.adminTimetable[target][day][h]?.[0]) return h
            })
            .filter((v) => v !== undefined)
        }
      }
      // console.log('noneTime', this.noneTime)
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
    async setCourses(sec_id) {
      if (!sec_id) sec_id = await this.sectionOfDate()
      const res = await getCourses(sec_id)
      const sorted = Object.fromEntries(
        Object.entries(res).sort(([, a], [, b]) => {
          if (a?.section !== b?.section) return a?.section.localeCompare(b?.section)
          return String(a.target).localeCompare(String(b?.target))
        }),
      )
      this.courses = sorted
      // console.log('store: courses', this.courses)
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
      // 전체 조회
      if (argTarget == '0') return this.courses
      // 객체로 필터링
      const newCourses = Object.fromEntries(
        Object.entries(this.courses).filter(([, course]) => course.target === argTarget),
      )
      // console.log('newCourses', newCourses)
      return newCourses
    },

    // 과목 id 조회
    // searchCourseId(argTitle) {
    //   const row = this.courses.filter((course) => course.title == argTitle);
    //   return row.course_id;
    // }

    // ------------------------ sections --------------------------
    // [ set ] : sections 셋팅
    async setSections() {
      this.sections = await getSections()
      // console.log('store: setSections', this.sections)
    },

    // [ get ] : sections 반환
    async getSections() {
      if (this.sections.length <= 0) {
        await this.setSections()
      }
      return this.sections
    },

    // 날짜기준 학기 조회
    async sectionOfDate(date) {
      if (this.sections.length <= 0) {
        await this.setSections()
      }
      if (!date) date = new Date().toISOString().slice(0, 10)
      const section = this.sections.find((s) => s.start_date <= date && s.end_date >= date)
      // console.log('section', section)
      return section?.sec_id ?? this.sections[this.sections.length - 1].sec_id
    },
  },
})
