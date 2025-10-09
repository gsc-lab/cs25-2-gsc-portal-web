<template>
  <div class="notice-detail">
    <!-- 헤더 -->
    <div class="notice-detail-header">
      <span>공지사항 상세보기</span>
      <button>수정</button>
    </div>

    <!-- 제목 / 작성일 -->
    <div class="notice-detail-section">
      <div>제목</div>
      <div> {{ notice?.title }}</div>
      <div>작성일</div>
      <div>{{ formatDate }}</div>
    </div>

    <!-- 작성자 / 조회수 -->
    <div class="notice-detail-section">
      <div>작성자</div>
      <div>{{ notice?.author?.name }}</div>
      <div>과목</div>
      <div>{{ notice?.course_type }}</div>
    </div>

    <!-- 첨부파일 -->
    <div class="notice-detail-files">
      <span>첨부파일</span>
      <div>asdasd</div>
    </div>

    <!-- 내용 -->
    <div class="notice-detail-content">
      <div>{{ notice?.content }}</div>
    </div>

    <!-- 하단 버튼 -->
    <div class="notice-detail-footer">
      <button class="back-btn">뒤로</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getNoticeView } from '@/api/apiNotice';
import { useRoute } from 'vue-router';

const route = useRoute();
const notice = ref(null);

onMounted(async () => {
  try {
    const noticeId = route.params.id;
    console.log(noticeId)
    const res = await getNoticeView(noticeId);
    notice.value = res
    console.log(notice.value)
  } catch (err) {
    console.log(err);
  }
})

const formatDate = computed(() => {
  if (!notice.value?.created_at) return "";
  const date = new Date(notice.value.created_at);
  return date.toLocaleDateString("ko-KR", {
    timeZone: 'Asia/seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

</script>

<style>
.notice-detail {
  width: 100%;
  max-width: 1000px;
  margin: 60px auto;
  border: 3px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  overflow: hidden;
  font-size: 15px;
  color: #333;
}

/* 🔹 헤더 타이틀 영역 */
.notice-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6f2ff;
  border-bottom: 2px solid #ccc;
  padding: 12px 20px;
  font-size: 20px;
  font-weight: bold;
}

.notice-detail-header button {
  background-color: lightcoral;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.notice-detail-header button:hover {
  background-color: #e65b5b;
}

/* 🔸 항목 블록 공통 스타일 */
.notice-detail-section {
  display: grid;
  grid-template-columns: 100px 1fr 120px 250px;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #fffafc;
}

/* 블록 내의 항목명 스타일 */
.notice-detail-section>div:first-child,
.notice-detail-section>div:nth-child(3) {
  font-weight: bold;
  text-align: left;
  color: #444;
}

/* 블록 내의 값 스타일 */
.notice-detail-section>div:nth-child(2),
.notice-detail-section>div:nth-child(4) {
  text-align: left;
}

/* 🔸 첨부파일 섹션 (1행 전용) */
.notice-detail-files {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #fffafc;
}

.notice-detail-files span {
  font-weight: bold;
  margin-right: 12px;
}

.notice-detail-files a {
  color: #0077cc;
  text-decoration: none;
}

.notice-detail-files a:hover {
  text-decoration: underline;
}

/* 🧾 본문 영역 */
.notice-detail-content {
  padding: 20px;
  min-height: 250px;
  background-color: #f9f9f9;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
  line-height: 1.7;
  font-size: 15px;
}

/* 🔙 버튼 영역 */
.notice-detail-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #fefefe;
}

.notice-detail-footer button {
  width: 120px;
  height: 36px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.notice-detail-footer .back-btn {
  background-color: lightcoral;
  color: white;
}

.notice-detail-footer .back-btn:hover {
  background-color: #e65b5b;
}

.notice-detail-footer .confirm-btn {
  background-color: #b0e0e6;
}

.notice-detail-footer .confirm-btn:hover {
  background-color: #9cd3dc;
}
</style>
