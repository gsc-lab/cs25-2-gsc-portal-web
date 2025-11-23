<template>
  <AppLayout>
    <main class="w-full max-w-[1400px] mx-auto px-6 py-8">
      <header class="flex items-baseline gap-4 py-8">
        <h1
          class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary text-text-heading"
        >
          GSC_Portal
        </h1>
        <span class="text-text-muted font-semibold text-base">
          {{ new Date().toLocaleDateString() }}
        </span>
      </header>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Main Area -->
        <div class="lg:col-span-8 flex flex-col gap-8">
          <!-- Timetable Card -->
          <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-text-heading mb-4">시간표</h2>
            <div class="flex gap-2 mb-4 flex-wrap">
              <button
                v-for="(target, key) in isUserInfoList"
                :key="key"
                class="px-4 py-2 rounded-full border border-gray-300 bg-white text-text-muted font-medium hover:bg-gray-100 transition-all duration-200"
                :class="{
                  'bg-primary text-black border-primary shadow-sm': targetGrade === target,
                }"
                @click="gradeSelect(target)"
              >
                <span>{{ getLabel(target) }}</span>
              </button>
            </div>

            <div
              class="rounded-lg bg-white overflow-hidden border border-gray-200 max-h-[300px] overflow-auto min-h-[250px]"
            >
              <div class="overflow-x-auto">
                <table
                  v-if="filterSchedule"
                  class="w-full border-collapse min-w-full divide-y divide-gray-200"
                >
                  <thead>
                    <tr>
                      <th
                        class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center sticky left-0 z-10 w-20"
                      >
                        교시
                      </th>
                      <th
                        v-for="day in dayList"
                        :key="day"
                        class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
                      >
                        {{ day }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="period in 12" :key="period">
                      <td
                        class="bg-gray-50 text-text-muted font-semibold text-sm py-2 px-3 border-b border-gray-100 text-center sticky left-0 z-10 w-20"
                      >
                        {{ period }}교시
                      </td>
                      <td
                        v-for="day in dayList"
                        :key="day"
                        class="text-sm py-2 px-3 border-b border-gray-100 text-center"
                      >
                        <div
                          class="text-xs bg-primary-light text-primary-dark font-semibold px-2 py-1 rounded-sm inline-block w-[90%] my-1"
                          v-for="(courseItem, index) in filterSchedule[day]?.[period]"
                          :key="index"
                        >
                          {{ courseItem['title'] }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="text-center text-text-muted text-sm py-8">
                  <p>표시할 시간표 데이터가 없습니다.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cleaning Roster & Classroom Poll (2 columns) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Cleaning Card -->
            <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-text-heading">이번주 청소 당번</h2>
                <button
                  @click="HandleCleaningMove"
                  class="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200"
                >
                  전체 보기
                </button>
              </div>
              <div class="flex flex-col max-h-[300px] overflow-y-auto">
                <div
                  v-for="clean in dashBoard.cleaning_duty"
                  :key="clean.grade_id"
                  class="flex items-center gap-4 py-2 border-b border-gray-200"
                >
                  <div
                    class="bg-primary text-white w-10 h-10 flex items-center justify-center font-semibold rounded-lg shadow-sm flex-shrink-0 text-sm"
                  >
                    {{ clean.grade_id }}학년
                  </div>
                  <div class="flex flex-col">
                    <span class="font-semibold text-text-heading text-sm">
                      {{ clean.classroom_name }}
                    </span>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="member in clean.members"
                        :key="member"
                        class="text-xs text-text-muted bg-white px-2 py-1 rounded border border-gray-200"
                      >
                        {{ member }}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="!dashBoard.cleaning_duty?.length"
                  class="text-center text-text-muted text-sm py-6"
                >
                  청소 당번 정보가 없습니다.
                </div>
              </div>
            </div>

            <!-- Classroom Poll Card -->
            <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-text-heading">강의실 개방 투표</h2>
                <button
                  class="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200"
                >
                  <router-link to="classroom">전체 보기</router-link>
                </button>
              </div>
              <div class="flex flex-col max-h-[300px] overflow-y-auto">
                <!-- Example content for poll, adjust as needed based on actual data structure -->

                <div class="text-center text-text-muted text-sm py-6">
                  진행중인 투표가 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Area -->
        <div class="lg:col-span-4 flex flex-col gap-8">
          <!-- Notice Card -->
          <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-text-heading">공지사항</h2>
              <button
                @click="HandleNoticeMove"
                class="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200"
              >
                전체 보기
              </button>
            </div>
            <div class="flex flex-col max-h-[300px] overflow-y-auto">
              <div
                class="flex justify-between items-center py-2 border-b border-gray-200 cursor-pointer hover:text-primary transition-colors duration-200"
                v-for="notice in dashBoard.notices?.notices"
                :key="notice.notice_id"
                @click="HandleNoticeClick(notice.notice_id)"
              >
                <div class="flex items-center gap-2 overflow-hidden">
                  <span
                    v-if="notice.is_pinned"
                    class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
                  >
                    중요
                  </span>
                  <p class="text-text-base text-sm truncate">{{ notice.title }}</p>
                </div>
                <span class="text-xs text-text-muted whitespace-nowrap">
                  {{ notice.created_at ? new Date(notice.created_at).toLocaleDateString() : '' }}
                </span>
              </div>
              <div
                v-if="!dashBoard.notices?.notices?.length"
                class="text-center text-text-muted text-sm py-6"
              >
                등록된 공지사항이 없습니다.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getDashBoard } from '@/api/apiDashBoard'
import router from '@/router' // Ensure this is the correct import for the router instance
import { useUserStore } from '@/stores/user'
import AppLayout from '@/layouts/AppLayout.vue' // Re-add the import for AppLayout

const user = useUserStore()
const dashBoard = ref({})
const Today = new Date().toISOString().split('T')[0]
// const day = '2025-04-30' // 테스트용 날짜

// 타겟 목록
const targetGradeList = ref(['1', '2', '3', 'special', 'korean'])

// 선택된 타겟
const targetGrade = ref('1')

// 타겟 키
const targetKey = {
  1: '1',
  2: '2',
  3: '3',
  special: 'special',
  korean: 'korean',
}

// 요일 목록
const dayList = ['MON', 'TUE', 'WED', 'THU', 'FRI']

onMounted(async () => {
  const response = await getDashBoard({ date: Today }) // date : Today 로 변경해야함
  dashBoard.value = response
  await user.fetchUser()
  console.log(user.userInfo)
  console.log(dashBoard.value)
  if (user.userInfo?.grade_id) {
    targetGrade.value = user.userInfo.grade_id
  }
})

// 시간표 필터링
const filterSchedule = computed(() => {
  // schedules 가 아니면 return
  if (!dashBoard.value.schedules) return null

  // dataKey = targetKey 안에 선택된 학년값 저장
  const dataKey = targetKey[targetGrade.value]

  console.log(dashBoard.value.schedules[dataKey])

  // dashBoard 안에 시간표에서 선택된 dataKey을 반환
  return dashBoard.value.schedules[dataKey]
})

// 버튼 클릭 시 실행될 함수
const gradeSelect = (grade) => {
  targetGrade.value = grade
}

// 사용자 유저 정보에 대한 필터링된 리스트
const isUserInfoList = computed(() => {
  if (!user.userInfo) return []

  const userInfo = user.userInfo

  if (userInfo.role_type === 'admin') {
    return targetGradeList.value
  }

  return targetGradeList.value.filter((target) => {
    if (target === userInfo.grade_id) {
      return true
    }

    if (userInfo.language_id === 'JP' && target === 'special') {
      return true
    }

    if (userInfo.language_id === 'KR' && target === 'korean') {
      return true
    }

    // 나머지는 숨김
    return false
  })
})

const getLabel = (target) => {
  if (['1', '2', '3'].includes(target)) return target + '학년'
  if (target === 'special') return '특강'
  if (target === 'korean') return '한국어'
  return target
}

const HandleNoticeMove = () => {
  if (user.userInfo?.grade_id) {
    router.push({ path: `/notice/grade/${user.userInfo?.grade_id}` })
  } else {
    router.push({ path: 'notice' })
  }
}

const HandleNoticeClick = (notice_id) => {
  router.push({ path: `/noticeView/${notice_id}` })
}

const HandleCleaningMove = () => {
  router.push({ path: `/cleaningH/grade/${user.userInfo.grade_id}` })
}
</script>
