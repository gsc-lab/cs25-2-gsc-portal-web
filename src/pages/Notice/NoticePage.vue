<template>
  <div class="Notice-Container">
    <router-link to="/notice/write" class="write-btn">공지사항 작성</router-link>
    <NoticeListComponent class="ListComponent" />
  </div>
</template>

<script setup>
import NoticeListComponent from './NoticeListComponent.vue';
</script>

<style>
.Notice-container {
  display: flexbox;
}

.ListComponent {

  align-content: center;
}

.write-btn {
  background-color: lightseagreen;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
}
</style>
