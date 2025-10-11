import { getProfessors } from '@/api/authApi';
import { defineStore } from 'pinia'

// 교수 명단
export const useProfessorStore = defineStore('professors', {
  state: () => ({
    professors: []
  }),
  actions: {
    // ----------------------- professors -----------------------
    // [ set ] : professors 세팅
    async setProfessors() {
      this.professors = await getProfessors();
    },
    // [ get ] : professors조회
    async getProfessors() {
      if (this.professors.length <= 0) {
        await this.setProfessors()
      }
      console.log(this.professors);
      return this.professors
    },

    // [ search ] : name -> user_id
    async searchProfessorsId(name) {
      if (this.professors.length <= 0) {
        await this.setProfessors()
      }
      const prfRow = this.professors.filter((prf) => prf.name == name)
      // console.log("store", prfRow[0].user_id);
      return prfRow[0].user_id
    },
  }
})
