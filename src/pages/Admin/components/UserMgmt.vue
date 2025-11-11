<script setup>
import { ref, onMounted, watch } from 'vue'
import { getUserInfo, delUser } from '@/api/adminApi'
import UserModify from './UserModify.vue'

const users = ref(null) // 학생 데이터
const selectGrade = ref(null) // filter: 학년
const selectStatus = ref(null) // filter: 재학 상태
const selectUser = ref(null)
const isOpen = ref(false) // 수정 페이지 열림

// API 요청
const setData = async (grade = selectGrade.value, status = selectStatus.value) => {
  console.log(grade, status)
  users.value = await getUserInfo(grade, status)
}

onMounted(async () => {
  setData()
})
// 필터링
watch(
  () => selectGrade.value,
  (newGrade, oldGrade) => {
    if (newGrade != oldGrade) setData(newGrade, selectStatus.value)
  },
)
watch(
  () => selectStatus.value,
  (newStatus) => {
    setData(selectGrade.value, newStatus)
  },
)

const status = (enStatus) => {
  if (enStatus == 'enrolled') return '재학'
  else if (enStatus == 'leave') return '휴학'
  else if (enStatus == 'dropped') return '자퇴'
  else return '졸업'
}

// 수정 클릭
const handlePatch = (user) => {
  selectUser.value = user
  isOpen.value = true
  // console.log(selectUser.value);
}

// 삭제 클릭
const handleDelete = async (id) => {
  if (confirm(`${id}번 학생을 삭제합니다`)) {
    await delUser(id)
  }
}
</script>

<template>
  <div style="background-color: cornsilk; margin: 3px">
    UserMgmt

    <!-- 필터링 -->
    <div>
      <div>
        <label for="grade">학년 선택 :</label>
        <select id="grade" v-model="selectGrade">
          <option :value="null">전체</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>

      <div>
        <label for="status">상태 :</label>
        <select id="status" v-model="selectStatus">
          <option :value="null">전체</option>
          <option value="enrolled">재학</option>
          <option value="leave">휴학</option>
          <option value="dropped">자퇴</option>
          <option value="graduated">졸업</option>
        </select>
      </div>
    </div>

    <!-- 학생 정보 수정 -->
    <div>
      <button @click="isOpen = !isOpen">수정페이지</button>
      <div v-if="isOpen && selectUser">
        <UserModify v-model="selectUser" :key="selectUser.user_id" />
      </div>
    </div>

    <!-- 데이터 출력 -->
    <div>
      <table style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 10px">권한</th>
            <th style="border: 1px solid #000; padding: 10px">번호</th>
            <th style="border: 1px solid #000; padding: 10px">이름</th>
            <th style="border: 1px solid #000; padding: 10px">학년</th>
            <th style="border: 1px solid #000; padding: 10px">재학정보</th>
            <th style="border: 1px solid #000; padding: 10px">유학생 여부</th>
            <th style="border: 1px solid #000; padding: 10px">이메일</th>
            <th style="border: 1px solid #000; padding: 10px">전화번호</th>
            <th style="border: 1px solid #000; padding: 10px">언어</th>
            <th style="border: 1px solid #000; padding: 10px">반 이름</th>
            <th style="border: 1px solid #000; padding: 10px">수정</th>
            <th style="border: 1px solid #000; padding: 10px">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user">
            <td style="border: 1px solid #000; padding: 10px">{{ user.role_type }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.user_id }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.name }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.grade_name }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ status(user.status) }}</td>
            <td style="border: 1px solid #000; padding: 10px">
              {{ user.is_international = 'korean' ? '한국인' : '외국인' }}
            </td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.email }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.phone }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.language_name }}</td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.class_name }}</td>

            <td style="border: 1px solid #000; padding: 10px">
              <button @click="handlePatch(user)">수정</button>
            </td>
            <td style="border: 1px solid #000; padding: 10px">
              <button @click="handleDelete(user.user_id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
