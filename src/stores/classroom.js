import { defineStore } from 'pinia'
import { getClassrooms, getClassroomsInfo, getReservation } from '@/api/classroomApi'

export const useClassroomStore = defineStore('classroom', {
  state: () => ({
    classrooms: [], // timetable: 교실 데이터

    classroomsInfo: {}, // 강의실 데이터
    selectCR: null, // 지금 선택 중인 classroom_id
    selectResSchedule: {}, // 해당 classroom_id의 예약 현환

    selectReTime: {
      date: null,
      start_time: null,
      end_time: null,
    }, // 선택한 일시 ["날짜", start_time, end_time]
  }),
  actions: {
    // ----------------------- classrooms -----------------------
    // [ set ] : classroom 세팅
    async setClassroom() {
      this.classrooms = await getClassrooms()
      console.log('store: classrooms', this.classrooms)
    },
    //  [ get ] : classroom 조회
    async getClassroom() {
      if (this.classrooms.length <= 0) {
        await this.setClassroom()
      }
      return this.classrooms
    },

    // [ search ] : label -> classroom_id
    async searchClassroomId(argLabel) {
      if (this.classrooms.length <= 0) {
        await this.setClassroom()
      }
      const newClassroom = this.classrooms.filter((classroom) => classroom.label == argLabel)
      return newClassroom[0].classroom_id
    },

    // [ search ] : classroom_id -> label
    async searchClassroomLabel(argId) {
      if (this.classrooms.length <= 0) {
        await this.setClassroom()
      }
      const newClassroom = this.classrooms.filter((classroom) => classroom.classroom_id == argId)
      return newClassroom[0].label
    },

    // ----------------------- ResClassroom -----------------------
    // [ set ] : classroomsInfo 세팅
    async setClassroomInfo() {
      this.classroomsInfo = await getClassroomsInfo()
      console.log('store: classroomsInfo', this.classroomsInfo)
    },
    //  [ get ] : classroomsInfo 조회
    async getClassroomInfo() {
      if (Object.keys(this.classroomsInfo.length <= 0)) {
        await this.setClassroomInfo()
      }
      return this.classroomsInfo
    },

    // ----------------------- selectCR -----------------------
    // [ set ] : selectCR(classroom_id) 세팅
    async setSelectCR(selected_id) {
      if (this.selectCR == selected_id) return
      this.selectCR = selected_id
      await this.setSelectResSchedule(selected_id) // selectResSchedule도 변경
      console.log('store: selectCR', this.selectCR)
    },
    //  [ get ] : selectCR(classroom_id) 조회
    async getSelectCR() {
      // selectCR 없으면 classroomsInfo의 0번째 id를 세트 후 반환
      if (this.selectCR == null) {
        console.log('selectCR 없음')
        if (Object.keys(this.classroomsInfo.length <= 0)) {
          console.log('classroomsInfo 없음')
          await this.setClassroomInfo()
        }
        await this.setSelectCR(this.classroomsInfo[0].classroom_id)
      }
      return this.selectCR
    },

    // ----------------------- selectResSchedule -----------------------
    // [ set ] : selectResSchedule 세팅
    async setSelectResSchedule(selected_id = this.selectCR, date = this.selectReTime.date) {
      this.selectResSchedule = await getReservation(selected_id, date)
      if (selected_id != this.selectCR) this.selectCR = selected_id
      console.log('store: selectResSchedule', this.selectResSchedule)
    },
    //  [ get ] : selectResSchedule 조회
    async getSelectResSchedule(date = this.selectReTime.date) {
      // selectResSchedule 없으면 classroomsInfo의 0번째 id를 세트 후 반환
      await this.setSelectResSchedule(this.selectCR, date)
      return this.selectResSchedule
    },

    // ----------------------- selectReTime -----------------------
    // [ set ] : selectReTime 세팅 ["날짜", start_time, end_time]
    async setSelectReTime(selectReTime) {
      this.selectReTime = selectReTime
      console.log('store: selectReTime', this.selectReTime)
    },
    //  [ get ] : selectReTime 조회
    async getSelectReTime() {
      return this.selectReTime
    },
  },
})
