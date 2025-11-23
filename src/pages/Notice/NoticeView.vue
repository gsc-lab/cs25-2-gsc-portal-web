<template>
  <AppLayout>
    <div class="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
      <!-- Notice Sidebar (Target List) -->
      <aside v-show="noticeTargetAside"
        class="bg-bg-paper rounded-card shadow-subtle overflow-hidden sticky top-20 flex-shrink-0 transition-all duration-300 ease-in-out w-full lg:w-80"
      >
        <div class="p-4 border-b border-gray-200 text-lg font-bold text-text-heading">공지 확인 명단</div>
        <ul class="list-none p-0 m-0 max-h-96 overflow-y-auto">
          <li v-for="target in target" :key="target.student_name" class="flex justify-between items-center px-4 py-3 border-b border-gray-100 text-sm text-text-base">
            <span class="font-medium">{{ target.student_name }}</span>
            <span :class="{ 'text-red-500': !target.read_at, 'text-green-600': target.read_at }">{{ target.read_at ? '확인' : '미확인' }}</span>
          </li>
          <li v-if="!target.length" class="text-center text-text-muted py-8 text-sm">알림 대상자가 없습니다.</li>
        </ul>
      </aside>

      <!-- Notice View Card (Main Content) -->
      <div class="flex-1 bg-bg-paper rounded-card shadow-subtle overflow-hidden transition-all duration-300 ease-in-out border border-gray-200">
        <!-- Header for Actions -->
        <div v-if="user.userInfo.role_type !== 'student'" class="flex justify-between items-center p-6 border-b border-gray-200">
          <button
            v-if="user.userInfo.role_type !== 'student'"
            class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm"
            @click="noticeTargetAside = !noticeTargetAside"
          >
            공지 확인 명단 확인
          </button>
          <div class="flex gap-3">
            <button @click="handleAlarm(notice.notice_id)" class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm">
              알림 전송
            </button>
            <button @click="handleEdit(notice.notice_id)" class="px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm">
              수정
            </button>
            <button @click="handleDelete(notice.notice_id)" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-base hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm">
              삭제
            </button>
          </div>
        </div>

        <!-- Notice Info -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-3xl font-bold text-text-heading mb-3">{{ notice?.title }}</h2>
          <div class="flex items-center gap-3 text-text-muted text-sm flex-wrap">
            <span class="font-medium">{{ notice?.author?.name }}</span>
            <span class="text-gray-300">|</span>
            <span>{{ formatDate }}</span>
            <span class="bg-primary-light text-primary-dark px-2 py-1 rounded-full text-xs font-semibold ml-auto">{{ courseTypeName(notice?.course_type) }}</span>
            <span v-if="notice?.course_title" class="bg-primary-light text-primary-dark px-2 py-1 rounded-full text-xs font-semibold">{{ notice?.course_title }}</span>
          </div>
        </div>

        <!-- Attached Files -->
        <div class="p-6 border-b border-gray-200 bg-gray-50" v-if="notice?.attachments?.length">
          <span class="font-semibold text-text-base block mb-3">첨부파일</span>
          <ul class="list-none p-0 m-0 flex flex-col gap-2">
            <li v-for="file in notice.attachments" :key="file.file_id" class="bg-white border border-gray-200 rounded-md transition-colors duration-200 hover:bg-gray-100">
              <a href="#" @click.prevent.stop="fileDownLoad(file.file_id, file.file_name)" class="block px-4 py-2 text-primary hover:underline text-sm font-medium">
                {{ fixFileName(file.file_name) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Content Body -->
        <div class="p-6 min-h-[250px] text-text-base text-lg leading-relaxed whitespace-pre-wrap">
          {{ notice?.content }}
        </div>

        <!-- Footer Buttons -->
        <div class="flex justify-end p-6 bg-gray-50 border-t border-gray-200">
          <button class="px-4 py-2 bg-gray-200 text-text-base text-sm font-medium rounded-base hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200 shadow-sm" @click="backPage">
            목록으로
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  deleteNotice,
  getFileDownLoad,
  getNoticeTarget,
  getNoticeView,
  patchNoticeRead,
  postNoticeAlarm,
} from '@/api/apiNotice'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const notice = ref(null)

// 로그인 사용자 정보 불러오기
const user = useUserStore()

// 대상자 목록 확인 사이드바 on / off
const noticeTargetAside = ref(false)

// 대상자 목록 저장
const target = ref([])

onMounted(async () => {
  try {
    // 현재 공지사항의 notice_id
    const notice_id = route.params.id // noticeId 를 사용하여 특정 공지사항 조회 API 호출
    if (notice_id) {
      await fetchNoticeData(notice_id)
    }

    console.log(notice.value)
    console.log(target.value)
  } catch (err) {
    console.error(err)
  }
})

const formatDate = computed(() => {
  if (!notice.value?.created_at) return ''
  const date = new Date(notice.value.created_at)
  return date.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// 파일이름 설정

const fixFileName = (str) => {
  if (!str) return ''
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
}

// 파일 다운로드
const fileDownLoad = async (file_id, rawName) => {
  const name = rawName || 'download_file'

  try {
    const blob = await getFileDownLoad(file_id)
    const contentType = blob.type || 'application/octet-stream'

    let filename = fixFileName(name)
    if (filename.endsWith('.htm')) {
      filename = filename.replace(/\.htm/i, '.pdf')
    }

    const url = URL.createObjectURL(new Blob([blob], { type: contentType }))

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('파일 다운로드 실패', err)
  }
}

const courseTypeList = {
  general: '전체',
  regular: '정규',
  special: '특강',
  korean: '한국어',
}

const courseTypeName = (courseType) => {
  return courseTypeList[courseType] || courseType
}

// 공지사항 수정 버튼 클릭시 수정 컴포넌트로 이동 (notice_id 전달)
const handleEdit = (notice_id) => {
  console.log(notice_id)
  router.push({ path: `/noticeEdit/${notice_id}` })
}

// 상세보기 페이지 ( 알림 전송 여부 결정 ) -> 교수
// 알림 전송 여부를 결정하기 위해서는 알림 대상을 확인할 수 있는 api 요청 필요
const handleAlarm = async (notice_id) => {
  console.log(notice_id)

  const confirmSend = confirm('공지사항 알림을 전송하시겠습니까?')
  if (!confirmSend) {
    return
  }

  try {
    await postNoticeAlarm(notice_id)
    alert('공지사항이 성공적으로 전송되었습니다.')
  } catch (err) {
    console.error('공지사항 전송 실패', err)
  }
}

// 공지사항 삭제 버튼 클릭시 -> 교수
const handleDelete = async (notice_id) => {
  const isConfrim = window.confirm('삭제?')
  if (!isConfrim) return

  try {
    await deleteNotice(notice_id)
    alert('공지사항 삭제함')
    router.push({ path: '/notice/' })
  } catch (err) {
    console.error('에러: ', err)
  }
}

const fetchNoticeData = async (id) => {
  if (!id) return

  try {
    notice.value = await getNoticeView(id)

    // 학생이 아니면 확인 명단 갱신
    if (user.userInfo.role_type !== 'student') {
      target.value = await getNoticeTarget(id)
    }
    await patchNoticeRead(id)
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchNoticeData(newId)
    }
  },
)

const backPage = () => {
  router.push({ path: '/notice' })
}
</script>

<style scoped>
/* Scoped styles removed */
</style>