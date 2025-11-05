<template>
  <div class="cleaning-card">
    청소 당번
    <div class="cleaning-header" style="font-size: 30px">
      <button
        v-for="grade in ['', '1', '2', '3']"
        :key="grade"
        :class="['filter-btn', { active: gradeSelect === grade }]"
        @click="HandleGradeCleaning(grade)"
        style="margin: 10px; padding: 10px; border-width: 4px; border-color: blue"
      >
        <p v-if="grade === ''">전체</p>
        <p v-else>{{ grade + '학년' }}</p>
      </button>
      <div>
        <button
          v-for="weekend in weekendList"
          :key="weekend"
          class="weekend-btn"
          @click="HandleWeekend(weekend)"
          style="margin: 10px; padding: 10px; border-width: 4px; border-color: brown"
        >
          {{ weekend === 'lastWeekend' ? '지난주' : '다음주' }}
        </button>
        {{ date.toLocaleDateString() }}
      </div>
    </div>
    <div class="cleaning-content"></div>
  </div>
  <div>
    <h1 style="font-size: 30px">청소 일정</h1>
    <div>
      <span style="font-size: 20px; padding: 10px">학기 정보:</span>
      <span>
        {{ cleaningRoster?.section }}
      </span>
    </div>
    <div
      class="cleaning-content-roster"
      v-for="(roster, index) in cleaningRoster?.rosters"
      :key="cleaningRoster?.rosters[index]?.grade_id"
    >
      <h1 style="background-color: red; font-size: 30px">{{ roster?.grade_id + '학년' }}</h1>
      <div style="background-color: lightblue">
        <span style="font-size: 20px; padding: 10px">청소 날짜:</span>
        <span>{{ cleaningRoster?.work_date }}</span>
        <div>
          <span style="font-size: 20px; padding: 10px">교실:</span>
          <span>{{ roster?.classroom_name }}</span>
        </div>
        <div>
          <span style="font-size: 20px; padding: 10px">담당 학생:</span>
          <span
            v-for="(member, index) in cleaningRoster?.rosters[index]?.members"
            :key="member[index]"
          >
            {{ member + '  ' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCleaningRoster } from '@/api/apiCleaning'
import router from '@/router'
import { onMounted, ref, watch, watchEffect } from 'vue'
// import { useRoute } from 'vue-router'

// const route = useRoute()

// 청소 당번 멤버 조회 값 저장
const cleaningRoster = ref(null)

// 주차별 날자 조회시 사용되는 데이터 값 ( 저번주, 다음주 )
const weekendList = ref(['lastWeekend', 'nextWeekend'])

// ==================================================================
const gradeSelect = ref('') // 선택된 학년
const weekendSelect = ref('')

const date = ref(new Date())
console.log('오늘 날짜:', date.value)

// ==================================================================

const HandleWeekend = (weekend) => {
  weekendSelect.value = weekend
  console.log('버튼 클릭 감지', weekendSelect.value)
  // 저번 주 버튼 클릭 시 ( date - 7 )
  if (weekend === 'lastWeekend') {
    // console.log('지금 날짜 - 7')
    console.log('지난주 클릭: ', date.value.toLocaleDateString())
    date.value = new Date(date.value.setDate(date.value.getDate() - 7))
  }
  // 다음 주 버튼 클릭 시 ( date + 7 )
  if (weekend === 'nextWeekend') {
    // console.log('지금 날짜 + 7')
    console.log('다음주 클릭: ', date.value.toLocaleDateString())
    date.value = new Date(date.value.setDate(date.value.getDate() + 7))
  }
}

// let date = new Date(2025, 4, 5) => 2025 년 5월 5일로 출력 ! 월 계산시 주의 !
// 연도 계산
// + : date.setFullYear(date.getFullYear() + 1 )
// - : date.setFullYear(date.getFullYear() - 1 )
// 월 계산 :
// + : date.setMonth(date.getMonth() + 1 )
// - : date.setMonth(date.getMonth() - 1 )
// 일 계산
// + : date.setDate(date.getDate() + 1 )
// - : date.setDate(date.getDate() - 1 )

const formData = ref({
  grade_id: null,
  date: date.value.toLocaleDateString('en-CA'),
})

onMounted(async () => {
  try {
    console.log('form-data: ', formData.value)
    cleaningRoster.value = await getCleaningRoster(formData)
    console.log(cleaningRoster.value)
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
    gradeSelect.value = grade
    console.log('전체 학년')
    router.push('/cleaningH')
  }
}
watchEffect(() => {
  console.log('watchEffect', gradeSelect.value)
})

watch([gradeSelect, date], async ([newGrade, newDate], [oldGrade, oldDate]) => {
  if (newGrade !== oldGrade || newDate !== oldDate) {
    console.log('선택 학년 변경 감지: ', newGrade)
    console.log('선택 날짜 변경 감지: ', newDate)

    formData.value.grade_id = newGrade || null
    formData.value.date = newDate.toLocaleDateString('en-CA')

    console.log('전달 데이터 확인: ', formData.value)

    try {
      cleaningRoster.value = await getCleaningRoster(formData)
      console.log('청소당번 호출: ', cleaningRoster.value)
    } catch (err) {
      console.error('청소당번 호출 실패: ', err)
    }
  }
})
</script>

<style scoped>
.filter-btn.active {
  background-color: lightgreen;
}
.weekend-btn:hover {
  background-color: aqua;
}
.weekend-btn:active {
  background-color: pink;
}
</style>
