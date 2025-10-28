import { defineStore } from 'pinia';
import { fetchCleaningRoster } from '@/api/cleaningApi';

function toDate(date) {
  const d = new Date(date)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().split('T')[0]
}

export const useCleaningStore = defineStore('cleaning', {
  // 반응형 데이터
  state: () => ({
    weekDate: { date: toDate(new Date()) },
    cleaningItems: null,
    isLoading: false,
    gradeId: null,
  }),

  // 계산된 속성
  getters: {},

  // 메서드 state 변경 및 비동기처리
  actions: {
    async getCleaningRoster({ date, gradeId }) {
      this.isLoading = true
      const res = await fetchCleaningRoster({ date, gradeId })
      this.cleaningItems = res
      this.weekDate.date = date
      this.isLoading = false
    },
    // next | prev
    async moveWeek(direction) {
      const base = new Date(this.weekDate.date)
      console.log(base)
      const diff = direction === 'next' ? 7 : -7
      base.setDate(base.getDate() + diff)

      const nextDate = toDate(base)
      console.log(nextDate)
      await this.getCleaningRoster({
        date: nextDate,
        gradeId: this.gardeId,
      })
    },
  },
})
