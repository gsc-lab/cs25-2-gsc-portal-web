import { getProfessors } from '@/api/authApi';
import { defineStore } from 'pinia'

// 교수 명단
export const useProfessorStore = defineStore('professors', {
  state: () => ({
    professors: []
  }),
  actions: {
    async setProfessors() {
      this.professors = await getProfessors();
      console.log("store: set", this.professors);
    },
    searchProfessorsId(name) {
      if (this.professors.length <= 0) {
        this.setProfessors()
      }
      const prfRow = this.professors.filter((prf) => prf.name == name)
      // console.log("store", name, prfRow);
      return prfRow[0].user_id
    },
  }
})
