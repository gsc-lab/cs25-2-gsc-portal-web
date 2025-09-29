<template>
  <section class="notice-board">
    <div class="grade-filter">
      <button v-for="filter in filters" :key="filter" :class="['filter', { active: selectedFilter === filter }]"
        @click="HandleFilter(filter)"> {{ filter }}</button>
      <input class="notice-search" v-model="NoticeSearch" type="text" placeholder="검색어를 입력하세요" />
      <select>
        <option>asd</option>
      </select>
      <button class="notice-search-btn" @click="titleFilter()">검색</button>
    </div>
    <!-- 상단 헤더 -->
    <div class="notice-header">
      <div class="col-num">번호</div>
      <div class="col-title">제목</div>
      <div class="col-content">내용</div>
      <div class="col-target">대상학년</div>
      <div class="col-author">작성자</div>
      <div class="col-date">작성날짜</div>
    </div>

    <!-- 공지사항 리스트 -->
    <div v-for="notice in filterNotices" :key="notice.notice_id">
      <div class="notice-item" v-if="selectedFilter === '전체' || notice.targets[0].grade_id === selectedFilter"
        @click="HandleClick(notice.notice_id)">
        <div class="col-num">{{ notice.notice_id }}</div>
        <div class="col-title">{{ notice.title }}</div>
        <div class="col-content">{{ notice.content }}</div>
        <div class="col-target">{{ notice.targets[0].grade_id }}</div>
        <div class="col-author">{{ notice.author_name }}</div>
        <div class="col-date">{{ notice.created_at }}</div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { computed, ref } from 'vue'
import { getNotice } from '@/api/apiNotice';
import router from '@/router';

const Notices = ref([]);
const NoticeSearch = ref('');
const Search = ref('')
const selectedFilter = ref('전체');
const filters = ref(['전체', 'G1', 'G2', 'G3']);

console.log(Notices)
console.log(NoticeSearch)

Notices.value = getNotice();

const filterNotices = computed(() => {
  return Notices.value.filter((notice) => {
    const matchFilter = selectedFilter.value === '전체' ||
      notice.targets[0].grade_id === selectedFilter.value;

    const matchSearch = !NoticeSearch.value ||
      notice.title.includes(Search.value) ||
      notice.content.includes(Search.value);

    return matchFilter && matchSearch;
  })
})

const titleFilter = () => {
  Search.value = NoticeSearch.value;
}


const HandleFilter = (value) => {
  selectedFilter.value = value
  console.log(selectedFilter.value)
}

const HandleClick = (notice_id) => {
  console.log(notice_id)
  router.push({ path: `/notice/${notice_id}` })
}


</script>

<style>
.grade-filter {
  display: flex;
  gap: 10px;
  margin: 10px 10px 10px 20px;
  margin-bottom: 12px;
  align-items: center;
}

.notice-search {
  background-color: lightcyan;
  color: blue;
}

.notice-search {
  display: flex;
  width: 350px;
  margin-right: 10px;
  padding: 4px;
  border-radius: 3px;
  border-width: 2px;
}

.notice-search-btn {
  background-color: lightcoral;
  width: 80px;
  height: 30px;
  align-items: center;
  text-align: center;
  border-radius: 2px;
}


.grade-filter .filter {
  padding: 6px 20px;
  border: none;
  border-radius: 6px;
  background-color: rgb(170, 240, 230);
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;

}

.grade-filter .filter:hover {
  background-color: #d9e8ff;
}

.grade-filter .filter.active {
  background-color: pink;
  color: #000;
}

.notice-board {
  width: 100%;
  max-width: 1000px;
  border: 3px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
  margin: 100px auto;
}

.notice-header,
.notice-item {
  display: grid;
  grid-template-columns: 80px 120px 1fr 100px 100px 120px;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.notice-header {
  background-color: #e6f2ff;
  font-weight: bold;
  text-align: center;
}


.notice-item {
  border-top: 1px solid #ccc;
  text-align: center;
}

.notice-item.important {
  background-color: #fff4f4;
  font-weight: bold;
  color: #d9534f;
}

.notice-item .title a {
  text-decoration: none;
  color: #0077cc;
}

.notice-item .title a:hover {
  text-decoration: underline;
}
</style>
