import { defineStore } from "pinia";
import {
  getNotice,
  getNoticeView,
  postNotice,
  patchNotice,
  deleteNotice
} from '@/api/apiNotice'

export const useNoticeStore = defineStore('Notice', {
  state: () => ({
    noticeList: [], // 전체 공지사항
    noticeOne: null, // 단일 공지사항
    isLoading: false,
    error: null
  }),

  actions: {
    // 전체 공지사항 조회
    async fetchNoticeList() {
      this.isLoading = true
      this.error = null
      try {
        const response = await getNotice();
        this.noticeList = response.notices
      } catch (err) {
        this.error = "전체 공지사항을 불러오는데 실패했습니다."
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    // 단일 공지사항 조회
    async fetchNoticeOne(noticeId) {
      this.isLoading = true
      this.error = null

      try {
        const response = await getNoticeView(noticeId)
        this.noticeOne = response
      } catch (err) {
        this.error = `${noticeId} 공지사항을 불러오는데 실패했습니다.`
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async createNotice(data, files) {
      this.isLoading = true
      this.error = null

      try {
        const newNotice = await postNotice(data, files)

        this.noticeList.unshift(newNotice);
      } catch (err) {
        this.error = "공지사항 등록에 실패했습니다."
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async updateNotice(noticeId, data, newFiles) {
      this.isLoading = true
      this.error = null

      try {
        const updateNotice = await patchNotice(noticeId, data, newFiles)

        const index = this.noticeList.findIndex(item => item.notice_id === noticeId)
        if (index !== -1) {
          this.noticeList[index] = updateNotice
        }

        if (this.noticeOne && this.noticeOne.notice_id === noticeId) {
          this.noticeOne = updateNotice
        }
      } catch (err) {
        console.log(err)
        throw new Error(`${noticeId}의 공지사항 수정에 실패했습니다.`)
      } finally {
        this.isLoading = false
      }
    },

    async deleteNotie(noticeId) {
      this.isLoading = true

      try {
        await deleteNotice(noticeId)

        this.noticeList.filter(item => item.notice_id !== noticeId)
      } catch (err) {
        console.log(err)
        throw new Error(`${noticeId}의 공지사항 삭제에 실패했습니다.`)
      } finally {
        this.isLoading = false
      }
    },

    // 학년 별 필터링

    // 과목별



  }
})
