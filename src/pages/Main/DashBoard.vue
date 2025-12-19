<template>
  <AppLayout>
    <main class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 col-span-1 lg:col-span-1"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-text-heading">오늘의 시간표</h2>
          </div>

          <div class="flex gap-2 mb-4 flex-wrap">
            <button
              v-for="(target, key) in isUserInfoList"
              :key="key"
              class="px-4 py-2 rounded-full border border-gray-300 bg-white text-text-muted font-medium hover:bg-gray-100 transition-all duration-200"
              :class="{ 'bg-primary text-black border-primary shadow-sm': targetGrade === target }"
              @click="gradeSelect(target)"
            >
              <span>{{ getLabel(target) }}</span>
            </button>
          </div>

          <div class="rounded-lg bg-white overflow-hidden border border-gray-200">
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

        <div class="grid grid-cols-1 gap-6">
          <div
            class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 h-full min-h-[500px]"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-text-heading">공지사항</h2>
              <button
                @click="HandleNoticeMove"
                class="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200"
              >
                더보기 +
              </button>
            </div>
            <div class="flex flex-col gap-2">
              <div
                class="flex justify-between items-center py-2 border-b border-gray-100 cursor-pointer hover:text-primary transition-colors duration-200"
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
              </div>
              <div
                v-if="!dashBoard.notices?.notices?.length"
                class="text-center text-text-muted text-sm py-8"
              >
                등록된 공지사항이 없습니다.
              </div>
            </div>
          </div>
        </div>

        <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 col-span-1">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-text-heading">강의실 개방 투표</h2>
            <router-link
              to="classroom"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              신청
            </router-link>
          </div>

          <div class="flex flex-col gap-4">
            <div
              v-for="poll in dashBoard.weekend_poll"
              :key="poll"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex flex-col">
                  <span class="text-lg font-bold text-gray-800">
                    {{ poll.poll_date }}일 ({{ poll.day_of_week }})
                  </span>
                  <span class="text-sm text-gray-500 font-medium">
                    {{ poll.grade_name }}
                  </span>
                </div>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                  :class="
                    poll.is_opened
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  "
                >
                  {{ is_opened(poll.is_opened) }}
                </span>
              </div>

              <div class="mb-3">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>투표 현황</span>
                  <span class="font-semibold text-primary">
                    {{ poll.vote_count }}명 / {{ poll.required_count }}명
                  </span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="bg-primary h-2.5 rounded-full transition-all duration-500"
                    :style="{
                      width: Math.min((poll.vote_count / poll.required_count) * 100, 100) + '%',
                    }"
                  ></div>
                </div>
              </div>

              <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                <span class="text-xs text-gray-400">목표: {{ poll.required_count }}명 이상</span>
                <span
                  class="text-xs font-medium flex items-center gap-1"
                  :class="poll.user_voted ? 'text-primary' : 'text-gray-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="poll.user_voted ? 'bg-primary' : 'bg-gray-300'"
                  ></span>
                  {{ user_voted(poll.user_voted) }}
                </span>
              </div>
            </div>

            <div
              v-if="!dashBoard.weekend_poll?.length"
              class="text-center text-text-muted text-sm py-12 flex flex-col items-center justify-center h-full"
            >
              <p>진행 중인 투표가 없습니다.</p>
            </div>
          </div>
        </div>
        <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 h-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-text-heading">이번주 청소 당번</h2>
            <button
              @click="HandleCleaningMove"
              class="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200"
            >
              더보기 +
            </button>
          </div>
          <div class="flex flex-col gap-4">
            <div
              v-for="clean in dashBoard.cleaning_duty"
              :key="clean.grade_id"
              class="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
            >
              <div
                class="bg-primary text-white w-12 h-12 flex items-center justify-center font-semibold rounded-lg shadow-sm flex-shrink-0"
              >
                {{ clean.grade_id }}학년
              </div>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-text-heading text-base">
                  {{ clean.classroom_name }}
                </span>
                <div class="flex flex-wrap gap-2">
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
              class="text-center text-text-muted text-sm py-8"
            >
              청소 당번 정보가 없습니다.
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
import router from '@/router'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/layouts/AppLayout.vue'

const user = useUserStore()
const dashBoard = ref({})
const Today = new Date().toISOString().split('T')[0]

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
  const response = await getDashBoard({ date: Today })
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
  if (!dashBoard.value.schedules) return null

  const dataKey = targetKey[targetGrade.value]
  console.log(dashBoard.value.schedules[dataKey])
  return dashBoard.value.schedules[dataKey]
})

// 강의실 텍스트 반환
const is_opened = (val) => {
  if (val === false) return '미개방'
  if (val === true) return '개방'
  return '대기' // null이나 다른 값일 경우 처리
}

// 투표 여부 텍스트 반환
const user_voted = (val) => {
  if (val === false) return '미참여'
  if (val === true) return '참여완료'
  return '-'
}

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
