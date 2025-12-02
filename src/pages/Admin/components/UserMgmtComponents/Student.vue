<script setup>
import { ref, onMounted, watch } from 'vue'
import { getUserInfo, putUser, delUser } from '@/api/adminApi'
import { setTarget } from '@/utils/reName' // Assuming setTarget is a utility function
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
  users.value = await getUserInfo(grade, status, 'student') // Pass role_type
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

const phoneRegex = /^010-?\d{3,4}-?\d{4}$/
// 수정등록
const handleSubmit = async () => {
  if (
    selectUser.value.user_id &&
    selectUser.value.name &&
    selectUser.value.phone &&
    selectUser.value.grade_id &&
    selectUser.value.class_id &&
    selectUser.value.language_id &&
    selectUser.value.status &&
    selectUser.value.is_international
  ) {
    if (!phoneRegex.test(selectUser.value.phone)) return alert('전화번호 형식이 올바르지 않습니다.')
    if (confirm(`${selectUser.value.name} 학생 정보를 수정하시겠습니까?`)) {
      await putUser(selectUser.value)
      // 초기화
      setStudentData()
      selectUser.value = resetUser()
    }
  } else {
    alert('필수 값이 누락되었습니다.')
  }
}

// ===========================  삭제  ===========================
const handleDelete = async (user) => {
  if (confirm(`${user.user_id}번 ${user.name} 학생을 삭제하시겠습니까?`)) {
    await delUser(user.user_id)
    // 사용자 정보 초기화
    setStudentData()
  }
}
</script>

<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-text-heading mb-4">학생 목록</h3>

    <!-- ==============  필터링  ============== -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div>
        <label for="grade" class="block text-sm font-medium text-text-base mb-1">학년 선택 :</label>
        <select
          id="grade"
          v-model="selectGrade"
          class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option :value="null">전체</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>

      <div>
        <label for="status" class="block text-sm font-medium text-text-base mb-1">상태 :</label>
        <select
          id="status"
          v-model="selectStatus"
          class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option :value="null">전체</option>
          <option value="enrolled">재학</option>
          <option value="leave">휴학</option>
          <option value="dropped">자퇴</option>
          <option value="graduated">졸업</option>
        </select>
      </div>
    </div>

    <!-- ==============  데이터 출력 및 수정 ============== -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-subtle bg-white">
      <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              학년
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              재학정보
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              번호
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              이름
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              이메일
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              전화번호
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              언어
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              유학생 여부
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              반 이름
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              수정
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              삭제
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.user_id"
            class="divide-y divide-gray-100 hover:bg-gray-50"
            :class="{ 'bg-red-50': user.status != 'enrolled' }"
          >
            <!-- ====================  학년  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <select
                  id="grade"
                  v-model="selectUser.grade_id"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>
              <div v-else>{{ setTarget(user.grade_id) }}</div>
            </td>
            <!-- ====================  재학정보  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <select
                  id="status"
                  v-model="selectUser.status"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
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
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              {{ user.user_id }}
            </td>
            <!-- ====================  이름  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <input
                  type="text"
                  id="name"
                  v-model="selectUser.name"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div v-else>
                {{ user.name }}
              </div>
            </td>
            <!-- ====================  email  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">{{ user.email }}</td>
            <!-- ====================  전화번호  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <input
                  type="text"
                  v-model="selectUser.phone"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div v-else>
                {{ user.phone }}
              </div>
            </td>
            <!-- ====================  언어  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <select
                  id="language_id"
                  v-model="selectUser.language_id"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="JP">JP</option>
                  <option value="KR">KR</option>
                </select>
              </div>
              <div v-else>{{ user.language_id }}</div>
            </td>
            <!-- ====================  유학생 여부  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <select
                  id="is_international"
                  v-model="selectUser.is_international"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="korean">한국인</option>
                  <option value="international">유학생</option>
                </select>
              </div>
              <div v-else>
                {{ user.is_international == 'korean' ? '한국인' : '외국인' }}
              </div>
            </td>
            <!-- ====================  반 이름  ==================== -->
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id">
                <select
                  id="class_id"
                  v-model="selectUser.class_id"
                  class="w-full px-2 py-1 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                >
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

            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id" class="flex gap-1 justify-center">
                <button
                  @click="handleSubmit()"
                  class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
                >
                  등록
                </button>
              </div>
              <div v-else>
                <button
                  @click="handlePatch(user)"
                  class="px-3 py-1 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  수정
                </button>
              </div>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-100 text-center">
              <div v-if="selectUser?.user_id == user.user_id" class="flex gap-1 justify-center">
                <button
                  @click="selectUser = resetUser()"
                  class="px-3 py-1 bg-white text-text-base border border-gray-300 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  취소
                </button>
              </div>
              <div v-else>
                <button
                  @click="handleDelete(user)"
                  class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!users || users.length === 0" class="text-center text-text-muted text-lg py-8">
        학생 정보가 없습니다.
      </div>
    </div>
  </div>
</template>
