import { defineStore } from 'pinia'

export const useTimetableStore = defineStore('timetable', {
  state: () => ({
    selectTT: []
  }),
  actions: {
    addSchedule(schedule) {
      if (this.selectTT.length > 0) {
        this.removeSchedule()
      }
      this.selectTT = [schedule]
      console.log("schedule", this.selectTT);
    },
    removeSchedule() {
      this.selectTT = []
    }
  }
})
