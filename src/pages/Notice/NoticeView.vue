<template>
  <main class="notice-page-wrapper">
    <div class="notice-page-container">
      <div class="notice-view-layout">
        <aside v-show="noticeTargetAside" class="notice-sidebar">
          <div class="sidebar-header">공지 확인 명단</div>
          <ul class="target-list">
            <li v-for="target in target" :key="target.student_name" class="target-item">
              <span class="student-name">{{ target.student_name }}</span>
              <span v-if="!target.read_at">미확인</span>
              <span v-else>확인</span>
            </li>
            <li v-if="!target.length" class="target-item-empty">알림 대상자가 없습니다.</li>
          </ul>
        </aside>

        <div class="notice-view-card">
          <div v-if="user.userInfo.role_type !== 'student'" class="notice-view-header">
            <button
              v-if="user.userInfo.role_type !== 'student'"
              class="btn btn-secondary"
              @click="noticeTargetAside = !noticeTargetAside"
            >
              공지 확인 명단 확인
            </button>
            <h1 class="portal-title"></h1>
            <div class="header-button">
              <button @click="HandleAlarm(notice.notice_id)" class="btn btn-secondary">
                알림 전송
              </button>
              <button @click="HandleEdit(notice.notice_id)" class="btn btn-secondary">수정</button>
              <button @click="HandleDelete(notice.notice_id)" class="btn btn-danger">삭제</button>
            </div>
          </div>

          <div class="notice-view-info">
            <h2 class="notice-title">{{ notice?.title }}</h2>
            <div class="meta-group">
              <span class="author">{{ notice?.author?.name }}</span>
              <span class="separator">|</span>
              <span class="date">{{ formatDate }}</span>
              <span class="badge">{{ courseTypeName }}</span>
            </div>
          </div>

          <div class="notice-view-files" v-if="notice?.attachments?.length">
            <span class="file-label">첨부파일</span>
            <ul>
              <li v-for="file in notice.attachments" :key="file.file_id">
                <a href="#" @click.prevent.stop="fileDownLoad(file.file_id, file.file_name)">
                  {{ fixFileName(file.file_name) }}
                </a>
              </li>
            </ul>
          </div>

          <div class="notice-view-content">
            <div class="content-body">{{ notice?.content }}</div>
          </div>

          <div class="notice-view-footer">
            <button class="btn btn-gray" @click="backPage">목록으로</button>
          </div>
        </div>
      </div>
    </div>
  </main>
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
    const noticeId = route.params.id // noticeId 를 사용하여 특정 공지사항 조회 API 호출
    notice.value = await getNoticeView(noticeId)

    if (user.userInfo.role_type !== 'student') {
      target.value = await getNoticeTarget(noticeId)
    }
    await patchNoticeRead(notice.value.notice_id)

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
    timeZone: 'Asia/seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

// 파일이름 설정
const fixFileName = (str) => {
  try {
    return decodeURIComponent(escape(str))
  } catch {
    return str
  }
}

// 파일 다운로드
const fileDownLoad = async (file_id, rawName = 'download') => {
  try {
    const blob = await getFileDownLoad(file_id)
    const contentType = blob.type || 'application/octet-stream'

    let filename = fixFileName(rawName)
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

// 과목유형이름 설정
const courseTypeName = computed(() => {
  if (!notice.value) {
    return ''
  }
  switch (notice.value.course_type) {
    case 'general':
      return '전체'
    case 'regular':
      return '정규'
    case 'special':
      return '특강'
    default:
      return '한국어'
  }
})

// 공지사항 수정 버튼 클릭시 수정 컴포넌트로 이동 (notice_id 전달)
const HandleEdit = (notice_id) => {
  console.log(notice_id)
  router.push({ path: `/noticeEdit/${notice_id}` })
}

// 상세보기 페이지 ( 알림 전송 여부 결정 ) -> 교수
// 알림 전송 여부를 결정하기 위해서는 알림 대상을 확인할 수 있는 api 요청 필요
const HandleAlarm = async (notice_id) => {
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
const HandleDelete = async (notice_id) => {
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

watch(
  () => route.params.noticeId,
  (newId, oldId) => {
    if (newId !== oldId) {
      getNoticeView()
    }
  },
)

const backPage = () => {
  router.push({ path: '/notice/' })
}
</script>

<style scoped>
/* ===== 1. 전체 레이아웃 ===== */
.notice-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px); /* 100vh - 헤더 높이 */
  background-color: #f9fafb; /* 대시보드와 동일한 배경 */
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 2.5rem 0.5rem; /* 상하 여백 */
}

.notice-page-container {
  /* ✅ 고정 폭 컨테이너 (헤더/대시보드와 동일) */
  width: 1440px;
  max-width: 1440px;
  margin: 0 auto;
  /* (수정)
    여기서 display: grid를 설정하지 않고,
    내부 래퍼(.notice-view-layout)에서 설정합니다.
  */
}

/* ✅ (신규) 2단 그리드 레이아웃 */
.notice-view-layout {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

/* 사이드바 토글 효과 */
.notice-sidebar {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: sticky;
  flex-shrink: 0; /* ✅ 사이드바 있을 때 메인카드 압축 방지 */
  top: 105px;
  width: 320px;
  transition: all 0.3s ease;
}

/* 슬라이드 애니메이션 (v-show 시) */
.notice-sidebar[style*='display: none'] {
  opacity: 0;
  transform: translateX(-50px);
  pointer-events: none;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.target-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 60vh; /* 최대 높이 (이 이상이면 스크롤) */
  overflow-y: auto;
}

.target-item {
  padding: 0.8rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.95rem;
  color: #374151;
}
.target-item:last-child {
  border-bottom: none;
}
.target-item-empty {
  padding: 2rem 1.5rem;
  text-align: center;
  color: #9ca3af;
}

/* ===== 2. 공지사항 상세 카드 (메인 컨텐츠) ===== */
.notice-view-card {
  flex: 1;
  min-width: 0;
  transition: all 0.3s ease;
  background: #fff;
  border-radius: 1.25rem; /* 20px */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.07),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  overflow: hidden;
  color: #1f2937;
}

/* 사이드바가 사라졌을 때 공간 확장 */
.notice-view-layout:not(:has(.notice-sidebar[style*='display: block'])) .notice-view-card {
  width: 100%;
}

/* ===== 3. 카드 헤더 ===== */
.notice-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.portal-title {
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #111827;
}

.header-button {
  display: flex;
  gap: 0.75rem;
}

/* ===== 4. 메타 정보 (제목, 작성자 등) ===== */
.notice-view-info {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.notice-title {
  font-size: 2rem; /* 32px */
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.meta-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280; /* 부드러운 회색 */
  font-size: 0.95rem;
}

.separator {
  color: #d1d5db; /* 구분자 */
}

.badge {
  background-color: #eef2ff;
  color: #3f2b96;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}

/* ===== 5. 첨부파일 ===== */
.notice-view-files {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.file-label {
  font-weight: 600;
  font-size: 1rem;
  color: #374151;
  display: block;
  margin-bottom: 0.75rem;
}

.notice-view-files ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notice-view-files li {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.notice-view-files a {
  padding: 0.5rem 0.8rem;
  display: block;
  color: #3f2b96; /* 링크 색상 통일 */
  text-decoration: none;
  font-weight: 500;
}

.notice-view-files li:hover {
  background-color: #f4f6ff;
}
.notice-view-files a:hover {
  text-decoration: underline;
}

/* ===== 6. 본문 내용 ===== */
.notice-view-content {
  padding: 2rem;
  min-height: 250px;
}

.content-body {
  font-size: 1.1rem; /* 17.6px */
  line-height: 1.7; /* 줄 간격 */
  color: #374151;
  white-space: pre-wrap;
}

/* ===== 7. 카드 푸터 (버튼) ===== */
.notice-view-footer {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* ===== 8. 공통 버튼 스타일 ===== */
.btn {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.btn:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Secondary 버튼 (수정) */
.btn-secondary {
  background: #fff;
  color: #3f2b96;
  border: 1px solid #d1d5db;
}
.btn-secondary:hover {
  background: #f4f6ff;
}

/* Gray 버튼 (목록으로) */
.btn-gray {
  background: #e5e7eb;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-gray:hover {
  background: #d1d5db;
}

/* ✅ Danger 버튼 (삭제) */
.btn-danger {
  background-color: #ff4d4f;
  color: white;
  border: 1px solid #ff4d4f;
}
.btn-danger:hover {
  background-color: #e63939;
  border-color: #e63939;
}
</style>
