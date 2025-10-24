import { defineStore } from 'pinia'
import { getClassrooms, getClassroomsInfo } from '@/api/classroomApi';


export const useClassroomStore = defineStore('classroom', {
  state: () => ({
    classrooms: [],
    classroomsInfo:{},
  }),
  actions: {
    // ----------------------- classrooms -----------------------
    // [ set ] : classroom 세팅
    async setClassroom() {
      this.classrooms = await getClassrooms();
      console.log("store: classrooms", this.classrooms);
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
      const newClassroom = this.classrooms.filter((classroom) => classroom.label == argLabel);
      return newClassroom[0].classroom_id;
    },

    // [ search ] : classroom_id -> label
    async searchClassroomLabel(argId) {
      if (this.classrooms.length <= 0) {
        await this.setClassroom()
      }
      const newClassroom = this.classrooms.filter((classroom) => classroom.classroom_id == argId);
      return newClassroom[0].label;
    },

    // ----------------------- ResClassroom -----------------------
    // [ set ] : classroomsInfo 세팅
    async setClassroomInfo() {
      this.classroomsInfo = await getClassroomsInfo();
      console.log("store: classroomsInfo", this.classroomsInfo);
    },
    //  [ get ] : classroomsInfo 조회
    async getClassroomInfo() {
      if (Object.keys(this.classroomsInfo.length <= 0)) {
        await this.setClassroomInfo()
      }
      return this.classroomsInfo
    },

  }
})
