<template>
  <h1>공지사항 작성</h1>
  <div class="notice-container">
    <div class="title-container">
      <div class="col-title">
        <label for="title">제목: </label>
      </div>
      <div class="title-important">
        <input type="checkbox" class="isImportant" id="isImportant" v-model="noticeInfo.isImportant" />
        <label for="isImportant">중요</label>
      </div>
      <div class="title-input">
        <input type="text" class="notice-id" id="title" v-model="noticeInfo.title" placeholder="제목을 입력하세요!">
      </div>
    </div>
    <div class="target-container">
      <label for="target">대상: </label>
      <div class="target-grade">
        학년
        <select v-model="noticeInfo.target_grade_id">
          <option v-for="grade in targets.grade" :key="grade"> {{ grade }}</option>
        </select>
      </div>
      <div class="target-level">
        <label for="level">레벨</label>
        <select v-model="noticeInfo.target_level_id">
          <option v-for="level in targets.level" :key="level" :value="level">{{ level }}</option>
        </select>
      </div>
      <div class="target-language">
        <label for="language_id">언어</label>
        <select v-model="noticeInfo.target_language_id">
          <option v-for="language_id in targets.language_id" :key="language_id" :value="language_id"> {{ language_id }}
          </option>
        </select>
      </div>
      <div>
        <label for="course">과목</label>
        <select v-model="noticeInfo.course_id">
          <option v-for="course in courses" :key="course.course_title" :value="course.course_title">{{
            course.course_title
          }}
          </option>
        </select>
      </div>
    </div>
    <div class="content-container">
      <label for="content">내용</label>
      <textarea v-model="noticeInfo.content"></textarea>
    </div>
    <div>
      {{ noticeInfo }}
    </div>
    <div class="fileUpload">
      <label for="files">파일 첨부</label>
      <NoticeFileUpload v-model="noticeInfo.noticeFile" />
    </div>

    <button class="submit-btn" @click="submitNotice">작성하기</button>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { getCourse_id } from '@/api/apiNotice';
import NoticeFileUpload from './NoticeFileUpload.vue'

const courses = ref([]);

onMounted(async () => {
  courses.value = await getCourse_id();
})
console.log(courses)
// 타겟
const targets = reactive({
  grade: ['전체', '1학년', '2학년', '3학년'],
  level: ['N1', 'N2', 'N3', "TOPIK 4", "TOPIK 6"],
  language_id: ['JP', 'KO']
});


const noticeInfo = reactive({
  title: '',
  isImportant: false,
  content: '',
  course_id: '',
  target_grade_id: '전체',
  target_level_id: 'N1',
  target_language_id: 'JP',
  noticeFile: [],
})

const submitNotice = async () => {
  const formData = new FormData();
  formData.append("title", noticeInfo.title);
  formData.append("isImportant", noticeInfo.isImportant);
  formData.append("content", noticeInfo.content);
  formData.append("course_id", noticeInfo.course_id);
  formData.append("target_grade_id", noticeInfo.target_grade_id);
  formData.append("target_level_id", noticeInfo.target_level_id);
  formData.append("target_language_id", noticeInfo.target_language_id);

  noticeInfo.noticeFile.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + "/notices", formData, {
      headers: { "content-Type": "multipart/form-data" },
    });
    alert("공지사항 등록 완료");
    console.log(response.data);
  } catch (err) {
    console.error("공지사항 등록 실패", err)
    alert("등록 중 오류 발생")
  }
}


</script>

<style>
.notice-container {
  width: 80%;
  height: auto;
  padding: 25px;
  background-color: aquamarine;
  margin: 80px auto;
  border: 1px solid #d3e2f5;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.fileUpload {
  background-color: blue;
  display: flex;
}

.submit-btn {
  background-color: red;
}

h1 {
  font-size: 50px;
}
</style>
