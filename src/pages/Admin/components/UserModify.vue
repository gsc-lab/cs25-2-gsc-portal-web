<script setup>
import { ref, watch } from 'vue'
import { getKoreanClasses, getSpecialClasses } from '@/api/timetableApi'
import { patchUser } from '@/api/adminApi'

const user_id = ref(null)
const selectUser = ref({
  name: null,
  phone: null,
  status: null,
  grade: null,
  language_id: null,
  level_name: null,
  class_name: null,
})

const classes = ref(null)

const user = defineModel()
console.log(user.value)

watch(
  () => user,
  async () => {
    if (user.value.language_name == '한국어') {
      classes.value = await getKoreanClasses()
    } else {
      classes.value = await getSpecialClasses()
    }

    user_id.value = user.value.user_id
    selectUser.value = {
      name: user.value.name,
      phone: user.value.phone,
      status: user.value.status,
      grade: user.value.grade_id,
      language_id: user.value.language_name == '한국어' ? 'KR' : 'JP',
      // level_name: user.value.level_name,
      class_name: user.value.class_name,
    }
  },
  { immediate: true },
)

const handleSubmit = async () => {
  console.log(user_id.value, selectUser.value)
  await patchUser(user_id.value, selectUser.value)
}
</script>

<template>
  UserModify

  <!-- 정보 수정 -->
  <div>
    <div>
      <label for="name">이름 :</label>
      <input type="text" id="name" v-model="selectUser.name" />
    </div>
    <div>
      <label for="phone">전화번호 :</label>
      <input type="text" id="phone" v-model="selectUser.phone" />
    </div>
    <div>
      <label for="status">상태 :</label>
      <select id="status" v-model="selectUser.status">
        <option value="enrolled">재학</option>
        <option value="leave">휴학</option>
        <option value="dropped">자퇴</option>
        <option value="dropped">졸업</option>
      </select>
    </div>
    <div>
      <label for="grade">학년 :</label>
      <select id="grade" v-model="selectUser.grade">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
    </div>
    <div>
      <label for="language_id">언어 :</label>
      <select id="language_id" v-model="selectUser.language_id">
        <option value="JP">일본어</option>
        <option value="KR">한국어</option>
      </select>
    </div>
    <!-- <div>
      <label for="level_name">레벨 : </label>
      <select id="level_name" v-model="selectUser.level_name">
        <option value="JP">일본어</option>
        <option value="KR">한국어</option>
      </select>
    </div> -->

    <div>
      <label for="class_name">반 이름 :</label>
      <select id="class_name" v-model="selectUser.class_name">
        <option v-for="cls in classes" :value="cls.class_id" :key="cls">
          {{ cls.course_name }} {{ '-' }} {{ cls.class_group }}
        </option>
      </select>
    </div>

    <div>
      <button @click="handleSubmit">수정하기</button>
    </div>
  </div>
</template>
