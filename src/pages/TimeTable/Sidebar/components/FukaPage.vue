<script setup>
import StudentsSelect from '@/layouts/StudentsSelect.vue';
import { getUsers, setTarget } from '@/api/Data';
import { ref } from 'vue';

// 초기화
const selectType = ref("default");
const days = ["월", "화", "수", "목", "금"];
const enDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// api정보 가져오기
const users = getUsers();
// 선택 학생 정보 저장
const selectedUsers = ref([]);

// 학생 id를 받고 selectedUsers에 저장
const handleSelect = (id) => {
  const selectedUser = users.filter((user) => user.id == id);
  // console.log("selected", selectedUser[0]);
  // console.log(selectedUsers.value);
  selectedUsers.value.push(selectedUser[0]);
}

// 학생 선택 취소
const handleDelete = (id) => {
  selectedUsers.value = selectedUsers.value.filter((user) => user.id != id);
  // console.log(selectedUsers.value);
}

// 값 저장
const postFukaData = ref({
  day: null,
  room: "정보관 403",
  time: { start: null, end: null },
  students: selectedUsers._rawValue
})

// 저장버튼 누른 후 실행
const handleSubmit = () => {
  console.log(postFukaData.value);
}

</script>

<template>
  FukaPage
  <!-- 기본 / 날짜 지정 -->
  <div>
    <input type="radio" id="default" value="default" v-model="selectType">
    <label for="default">기본 설정</label>

    <input type="radio" id="pick" value="pick" v-model="selectType">
    <label for="pick">날짜 지정</label>
  </div>

  <!-- 요일 설정 -->
  <div v-if="selectType == 'default'">
    <label for="day">요일 : </label>
    <select id="day" v-model="postFukaData.day">
      <option v-for="(day, idx) in days" :value="enDays[idx]">{{ day }}요일</option>
    </select>
  </div>
  <div v-else>
    <label for="date">날짜 : </label>
    <input type="date" id="date" v-model="postFukaData.day">
  </div>

  <!-- 장소 -->
  <div>
    <label for="classroom">장소 입력: </label>
    <input id="classroom" v-model="postFukaData.room">
  </div>

  <!-- 교시 -->
  <div>
    <label for="time">교시 : </label>
    <select id="time" v-model="postFukaData.time.start">
      <option v-for="startT in 12" :value="String(startT)">{{ startT }}</option>
    </select>
    ~
    <select id="time" v-model="postFukaData.time.end">
      <option v-for="endT in 12" :value="String(endT)">{{ endT }}</option>
    </select>
    교시
  </div>

  <!-- 학생 선택 -->
  <div style="background-color: bisque;">
  <StudentsSelect :users="users" @select:user="handleSelect" />
  </div>
  <ul>
    <li v-for="user in selectedUsers" :key="user.user_id">
      - {{ user.name }} : {{ setTarget(user.grade_id) }}
      <button @click="handleDelete(user.id)">취소</button>
    </li>
  </ul>

  <button @click="handleSubmit">등록</button>
</template>
