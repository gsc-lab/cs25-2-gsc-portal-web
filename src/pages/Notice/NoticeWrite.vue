<template>
  <h1>공지사항 작성</h1>
  <div class="notice-container">

    <div class="title-container">
      <div class="col-title">
        <label for="title">제목: </label>
      </div>
      <div class="title-important">
        <input type="checkbox" class="isImportant" id="isImportant" v-model="isImportant" />
        <label for="isImportant">중요</label>
      </div>
      <div class="title-input">
        <input type="text" class="notice-id" id="title" v-model="title" placeholder="제목을 입력하세요!">
      </div>
    </div>
    <div class="target-container">
      <label for="target">대상: </label>
      <div class="target-grade">
        학년
        <select>
          <option v-for="grade in targets.grade" :key="grade"> {{ grade }}</option>
        </select>
      </div>
      <div class="target-level">
        레벨
        <select>
          <option v-for="level in targets.level" :key="level">{{ level }}</option>
        </select>
      </div>
      <div class="target-language">
        언어
        <select>
          <option v-for="language_id in targets.language_id" :key="language_id"> {{ language_id }}</option>
        </select>
      </div>
      <div>
        과목
        <select v-model="course_id">
          <option v-for="course_id in course_id" :key="course_id">{{ course_id.course_title }}</option>
        </select>
      </div>
    </div>
    <div class="content-container">
      내용
      <textarea>내용을 입력하시오</textarea>
    </div>
    <div>
      {{ noticeInfo }}
    </div>
  </div>



</template>

<script setup>
import { reactive, ref } from 'vue';
import { getCourse_id } from '@/api/apiNotice';

// 제목
const title = ref('');
// 중요공지 확인
const isImportant = ref(false);
// 내용
const content = ref('')
// 과목 선택 / 전체 공지일 경우 공백
// 어떤 수업의 대한 공지사항인지 선택.
const course_id = getCourse_id();

console.log(course_id)
// 타겟
const targets = reactive({
  grade: ['1학년', '2학년', '3학년'],
  level: ['N1', 'N2', 'N3', "TOPIK 4", "TOPIK 6"],
  language_id: ['JP', 'KO']
});

const noticeFile = ref([]);

const noticeInfo = reactive({
  title: title.value,
  content: content.value,
  course_id: course_id.value,
  targets: targets.value,
  noticeFile: noticeFile.value,
})

console.log(targets.grade[0])
console.log(noticeInfo)


const courseList = ref([
  {
    course_id: "1",
    title: "인공지능 개론",
    course_id: "정규"
  },
  {
    course_id: "2",
    title: "데이터 구조",
    course_id: "정규"
  },
  {
    course_id: "3",
    title: "일본어 문법",
    course_id: "정규"
  },
  {
    course_id: "4",
    title: "일본어 회화",
    course_id: "정규"
  },
])


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

h1 {
  font-size: 50px;
}
</style>
