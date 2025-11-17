<script setup>
import { ref, onMounted, watch } from 'vue'
import { getUserInfo, patchUser, delUser } from '@/api/adminApi'
import { setTarget } from '@/utils/reName'
import { getKoreanClasses, getSpecialClasses } from '@/api/timetableApi'

const users = ref(null) // 학생 데이터
const selectGrade = ref(null) // filter: 학년
const selectStatus = ref(null) // filter: 재학 상태
const KRclasses = ref(null) // 한국어 반 조회
const JPclasses = ref(null) // 특강 반 조회

//수정할 유저의 정보
const selectUser = ref(resetUser())

function resetUser() {
  return {
    user_id: null,
    name: null,
    phone: null,
    grade_id: null, // 1, 2, 3
    class_id: null,
    language_id: null, //  JP, KR
    status: null, // enrolled(재학), leave(휴학), dropped(자퇴), graduated(졸업)
    is_international: null, // korean, international
  }
}
// 학생 데이터 API 요청
const setStudentData = async (grade = selectGrade.value, status = selectStatus.value) => {
  console.log(grade, status)
  users.value = await getUserInfo(grade, status)
}
// 초기화
onMounted(async () => {
  // 학생 정보 조회
  setStudentData()
  // 분반 조회
  KRclasses.value = await getKoreanClasses()
  JPclasses.value = await getSpecialClasses()
})

// ===========================  필터링  ===========================
// 학년
watch(
  () => selectGrade.value,
  (newGrade, oldGrade) => {
    if (newGrade != oldGrade) setStudentData(newGrade, selectStatus.value)
  },
)
// 재학정보
watch(
  () => selectStatus.value,
  (newStatus) => {
    setStudentData(selectGrade.value, newStatus)
  },
)
// ===================================================================

const status = (enStatus) => {
  if (enStatus == 'enrolled') return '재학'
  else if (enStatus == 'leave') return '휴학'
  else if (enStatus == 'dropped') return '자퇴'
  else return '졸업'
}

// ===========================  수정  ===========================
// 수정 클릭 -> 수정할 유저 정보 저장
const handlePatch = (user) => {
  console.log(user)
  selectUser.value = {
    user_id: user.user_id,
    name: user.name,
    phone: user.phone,
    status: user.status,
    grade_id: user.grade_id,
    language_id: user.language_id,
    class_id: user.class_id,
    is_international: user.is_international == '한국인' ? 'korean' : 'international',
  }
}

// 수정등록
const handleSubmit = async () => {
  await patchUser(selectUser.value)
  // 초기화
  setStudentData()
  selectUser.value = resetUser()
}

// ===========================  삭제  ===========================
const handleDelete = async (id) => {
  if (confirm(`${id}번 학생을 삭제합니다`)) {
    await delUser(id)
    // 사용자 정보 초기화
    setStudentData()
  }
}
</script>

<template>
  <div style="background-color: cornsilk; margin: 3px">
    StdMgmt

    <!-- ==============  필터링  ============== -->
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

    <!-- ==============  데이터 출력 및 수정 ============== -->
    <div>
      <table style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 10px">학년</th>
            <th style="border: 1px solid #000; padding: 10px">재학정보</th>
            <th style="border: 1px solid #000; padding: 10px">번호</th>
            <th style="border: 1px solid #000; padding: 10px">이름</th>
            <th style="border: 1px solid #000; padding: 10px">이메일</th>
            <th style="border: 1px solid #000; padding: 10px">전화번호</th>
            <th style="border: 1px solid #000; padding: 10px">언어</th>
            <th style="border: 1px solid #000; padding: 10px">유학생 여부</th>
            <th style="border: 1px solid #000; padding: 10px">반 이름</th>
            <th style="border: 1px solid #000; padding: 10px">수정</th>
            <th style="border: 1px solid #000; padding: 10px">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user"
            :style="user.status != 'enrolled' ? { backgroundColor: '#fff' } : {}"
          >
            <!-- ====================  학년  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <select id="grade" v-model="selectUser.grade_id">
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>
              <div v-else>{{ setTarget(user.grade_id) }}</div>
            </td>
            <!-- ====================  재학정보  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <select id="status" v-model="selectUser.status">
                  <option value="enrolled">재학</option>
                  <option value="leave">휴학</option>
                  <option value="dropped">자퇴</option>
                  <option value="graduated">졸업</option>
                </select>
              </div>
              <div v-else>
                {{ status(user.status) }}
              </div>
              <!-- ====================  학번  ==================== -->
            </td>
            <td style="border: 1px solid #000; padding: 10px">{{ user.user_id }}</td>
            <!-- ====================  이름  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <input type="text" id="name" v-model="selectUser.name" />
              </div>
              <div v-else>
                {{ user.name }}
              </div>
            </td>
            <!-- ====================  email  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">{{ user.email }}</td>
            <!-- ====================  전화번호  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <input type="text" v-model="selectUser.phone" />
              </div>
              <div v-else>
                {{ user.phone }}
              </div>
            </td>
            <!-- ====================  언어  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <select id="language_id" v-model="selectUser.language_id">
                  <option value="JP">JP</option>
                  <option value="KR">KR</option>
                </select>
              </div>
              <div v-else>{{ user.language_id }}</div>
            </td>
            <!-- ====================  유학생 여부  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <select id="is_international" v-model="selectUser.is_international">
                  <option value="korean">한국인</option>
                  <option value="international">유학생</option>
                </select>
              </div>
              <div v-else>
                {{ user.is_international = 'korean' ? '한국인' : '외국인' }}
              </div>
            </td>
            <!-- ====================  반 이름  ==================== -->
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <select id="class_id" v-model="selectUser.class_id">
                  <option
                    v-for="cls in user.language_id == 'JP' ? JPclasses : KRclasses"
                    :value="cls.class_id"
                    :key="cls"
                  >
                    {{ cls.class_group }}
                  </option>
                </select>
              </div>
              <div v-else>{{ user.class_name }}</div>
            </td>

            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <button @click="handleSubmit()">등록</button>
              </div>
              <div v-else>
                <button @click="handlePatch(user)">수정</button>
              </div>
            </td>
            <td style="border: 1px solid #000; padding: 10px">
              <div v-if="selectUser?.user_id == user.user_id">
                <button @click="selectUser = resetUser()">취소</button>
              </div>
              <div v-else>
                <button @click="handleDelete(user.user_id)">삭제</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
