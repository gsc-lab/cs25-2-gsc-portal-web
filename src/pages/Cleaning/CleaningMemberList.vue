<template>
  <div class="bg-bg-paper rounded-card shadow-subtle p-6 border border-gray-200 min-h-[400px]">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-text-heading">청소 당번</h2>
      <div class="flex bg-gray-100 p-1.5 rounded-full shadow-inner">
        <button
          v-for="period in periods"
          :key="period"
          :class="['px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200', periodSelect === period ? 'bg-white text-primary-dark shadow-md' : 'text-text-muted hover:text-primary-dark']"
          @click="periodSelect = period"
        >
          {{ period === 'weekend' ? '주간 일정' : '월간 일정' }}
        </button>
      </div>
    </header>

    <!-- Filters Section -->
    <section v-if="periodSelect === 'weekend'" class="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center flex-wrap gap-2">
          <span class="font-semibold text-text-base text-sm min-w-[80px]">학년 선택:</span>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="grade in ['', '1', '2', '3']"
              :key="grade"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm border', gradeSelect === grade ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-gray-300 hover:bg-gray-100']"
              @click="HandleGradeCleaning(grade)"
            >
              {{ grade === '' ? '전체' : grade + '학년' }}
            </button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-3 py-1 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm" @click="HandleWeekend('lastWeekend')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            지난주
          </button>
          <span class="font-bold text-text-heading text-base min-w-[120px] text-center">{{ date.toLocaleDateString() }}</span>
          <button class="px-3 py-1 bg-white border border-gray-300 text-text-base text-sm font-medium rounded-base hover:bg-gray-50 transition-colors duration-200 shadow-sm" @click="HandleWeekend('nextWeekend')">
            다음주
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Schedule Display -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-text-heading">
          {{ periodSelect === 'weekend' ? '주간 청소 일정' : (cleaningRosterMonth?.month || '') + ' 월간 청소 일정' }}
        </h3>
        <span v-if="cleaningRoster?.section" class="bg-gray-100 px-3 py-1 rounded-md font-medium text-text-muted text-sm">
          {{ cleaningRoster?.section + '학기' }}
        </span>
      </div>

      <!-- Weekend Schedule -->
      <div v-if="periodSelect === 'weekend' && cleaningRoster?.rosters" class="space-y-6">
        <div class="font-bold text-lg text-primary mb-3">{{ cleaningRoster?.work_date }}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(roster, index) in cleaningRoster.rosters"
            :key="index"
            class="bg-bg-paper border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <div
              class="p-3 flex justify-between items-center font-semibold text-text-heading"
              :class="{
                'bg-blue-50 text-blue-700': roster.grade_id === '1',
                'bg-green-50 text-green-700': roster.grade_id === '2',
                'bg-orange-50 text-orange-700': roster.grade_id === '3',
                'bg-gray-100 text-gray-700': !roster.grade_id,
              }"
            >
              <span class="bg-white bg-opacity-70 px-2 py-1 rounded-full text-xs font-medium">{{ roster?.grade_id }}학년</span>
              <span class="text-text-base text-sm">{{ roster?.classroom_name }}</span>
            </div>
            <div class="p-3 flex gap-2 border-t border-gray-100">
              <span class="font-semibold text-text-muted text-sm min-w-[40px]">담당:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(member, mIndex) in roster?.members"
                  :key="mIndex"
                  class="bg-gray-100 px-2 py-1 rounded-md text-xs text-text-base"
                >
                  {{ member }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Schedule -->
      <div v-else-if="periodSelect === 'month' && cleaningRoster?.days" class="space-y-6">
        <div v-for="day in cleaningRoster.days" :key="day.work_date" class="mb-6">
          <h3 class="font-semibold text-text-heading text-base pl-2 border-l-4 border-primary mb-2">
            {{ day.work_date }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="roster in day.rosters" :key="roster.grade_id" class="bg-bg-paper border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <div
                class="p-3 flex justify-between items-center font-semibold text-text-heading"
                :class="{
                  'bg-blue-50 text-blue-700': roster.grade_id === '1',
                  'bg-green-50 text-green-700': roster.grade_id === '2',
                  'bg-orange-50 text-orange-700': roster.grade_id === '3',
                  'bg-gray-100 text-gray-700': !roster.grade_id,
                }"
              >
                <span class="bg-white bg-opacity-70 px-2 py-1 rounded-full text-xs font-medium">{{ roster.grade_id }}학년</span>
                <span v-if="roster.classroom_name" class="text-text-base text-sm">
                  {{ roster.classroom_name }}
                </span>
              </div>
              <div class="p-3 flex gap-2 border-t border-gray-100">
                <span class="font-semibold text-text-muted text-sm min-w-[40px]">담당:</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="member in roster.members" :key="member" class="bg-gray-100 px-2 py-1 rounded-md text-xs text-text-base">
                    {{ member }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-12 text-text-muted text-lg">일정 데이터가 없습니다.</div>
    </section>
  </div>
</template>

<script setup>
import { getCleaningRoster, getCleaningRosterMonthly } from '@/api/apiCleaning'
import router from '@/router'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const periods = ref(['weekend', 'month'])

const cleaningRoster = ref(null)
const cleaningRosterMonth = ref(null)

const periodSelect = ref('weekend')
const gradeSelect = ref('') // 선택된 학년
const weekendSelect = ref('') // 선택된 주 ( 지난주, 다음주 )

const date = ref(new Date())
console.log('오늘 날짜:', date.value)

const HandleWeekend = (weekend) => {
  weekendSelect.value = weekend
  console.log('버튼 클릭 감지', weekendSelect.value)
  if (weekend === 'lastWeekend') {
    console.log('지난주 클릭: ', date.value.toLocaleDateString())
    date.value = new Date(date.value.setDate(date.value.getDate() - 7))
  }
  if (weekend === 'nextWeekend') {
    console.log('다음주 클릭: ', date.value.toLocaleDateString())
    date.value = new Date(date.value.setDate(date.value.getDate() + 7))
  }
}

const formData = ref({
  grade_id: null,
  date: date.value.toLocaleDateString('en-CA'),
})

onMounted(async () => {
  try {
    console.log('form-data: ', formData.value)
    cleaningRoster.value = await getCleaningRoster(formData)
    console.log('주간 청소 당번 조회: ', cleaningRoster.value)
    cleaningRosterMonth.value = await getCleaningRosterMonthly()
    console.log('월간 청소 당번 조회: ', cleaningRosterMonth.value)
  } catch (err) {
    console.error('청소 조회 실패 ', err)
  }
})

const HandleGradeCleaning = (grade) => {
  console.log('청소, 선택된 학년: ', grade)
  if (grade) {
    gradeSelect.value = grade
    console.log('선택된 학년', gradeSelect.value)
    router.push(`/cleaningH/grade/${grade}`)
  } else {
    gradeSelect.value = '' // '전체' 선택 시 gradeSelect를 빈 문자열로 설정
    console.log('전체 학년')
    router.push('/cleaningH')
  }
}

watch(
  [gradeSelect, date, periodSelect],
  async ([newGrade, newDate, newPeriod], [oldGrade, oldDate, oldPeriod]) => {
    if (newGrade !== oldGrade || newDate !== oldDate || newPeriod !== oldPeriod) {
      console.log('선택 학년 변경 감지: ', newGrade)
      console.log('선택 날짜 변경 감지: ', newDate)
      console.log('선택 기간 변경 감지: ', newPeriod)

      formData.value.grade_id = newGrade || null
      formData.value.date = newDate.toLocaleDateString('en-CA')

      console.log('전달 데이터 확인: ', formData.value)
      if (newPeriod === 'weekend') {
        try {
          cleaningRoster.value = await getCleaningRoster(formData)
          console.log('주간 청소당번 호출: ', cleaningRoster.value)
        } catch (err) {
          console.error('청소당번 호출 실패: ', err)
        }
      }
      if (newPeriod === 'month') {
        try {
          cleaningRoster.value = await getCleaningRosterMonthly() // 'cleaningRoster' 에 월간 데이터 저장
          console.log('월간 청소당번 호출: ', cleaningRoster.value)
        } catch (err) {
          console.error('월간 청소 당번 호출: ', err)
        }
      }
    }
  },
)
watch(
  () => route.params.gradeId,
  async (newGrade) => {
    if (newGrade) {
      gradeSelect.value = newGrade
    } else {
      gradeSelect.value = ''
      router.push({ path: '/cleaningH' })
    }
  },
)

</script>
