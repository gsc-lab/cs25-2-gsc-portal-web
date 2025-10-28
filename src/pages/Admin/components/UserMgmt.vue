<script setup>
import { ref, onMounted, watch } from 'vue'
import { getUserInfo } from '@/api/adminApi';

const users = ref(null)
const selectGrade = ref(null)
const selectStatus = ref(null)

const setData = async (grade, status) => {
  console.log(grade, status);
  users.value = await getUserInfo(grade, status)
}

onMounted(async () =>  {
  setData()
})

watch(() => selectGrade.value, (newGrade, oldGrade) => {
  if(newGrade != oldGrade)
  setData(newGrade, selectStatus.value)
})
watch(() => selectStatus.value, (newStatus) =>{
  setData(selectGrade.value, newStatus)
})
</script>

<template>
  <div style="background-color:cornsilk; margin: 3px; ">
    UserMgmt


    <!-- 필터링 -->
    <div>
    <div>
      <label for="grade">학년 선택 : </label>
      <select id="grade" v-model="selectGrade">
        <option :value="null">전체</option>
        <option value="1학년">1학년</option>
        <option value="2학년">2학년</option>
        <option value="3학년">3학년</option>
      </select>
    </div>

    <div>
      <label for="status">상태 : </label>
      <select id="status" v-model="selectStatus">
        <option :value="null">전체</option>
        <option value="enrolled">재학</option>
        <option value="leave">휴학</option>
        <option value="dropped">자퇴</option>
        <option value="dropped">졸업</option>
      </select>
    </div>
    </div>

    <!-- 데이터 출력 -->
    <div>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style=" border: 1px solid #000; padding: 10px;">권한</th>
            <th style=" border: 1px solid #000; padding: 10px;">번호</th>
            <th style=" border: 1px solid #000; padding: 10px;">이름</th>
            <th style=" border: 1px solid #000; padding: 10px;">학년</th>
            <th style=" border: 1px solid #000; padding: 10px;">재학정보</th>
            <th style=" border: 1px solid #000; padding: 10px;">유학생 여부</th>
            <th style=" border: 1px solid #000; padding: 10px;">이메일</th>
            <th style=" border: 1px solid #000; padding: 10px;">전화번호</th>
            <th style=" border: 1px solid #000; padding: 10px;">언어</th>
            <th style=" border: 1px solid #000; padding: 10px;">반 이름</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users">
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.role_type }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.user_id }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.name }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.grade_name }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.status }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.is_international='korean' ? '한국인':'외국인' }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.email }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.phone }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.language_name }}</td>
            <td style=" border: 1px solid #000; padding: 10px;">{{ user.class_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
