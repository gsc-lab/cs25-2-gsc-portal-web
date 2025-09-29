<template>
  <div>
    공지사항
  </div>
  <NoticeListComponent class="ListComponent" />
</template>

<script setup>
import NoticeListComponent from './NoticeListComponent.vue';

</script>

<style>
ListComponent {
  display: flexbox;
  align-content: center;
}
</style>
