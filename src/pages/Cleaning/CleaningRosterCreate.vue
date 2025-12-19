<template>
  <AppLayout pageName="cleaningRoster">
    <main class="p-4 sm:p-6 lg:p-8">
      <div
        class="max-w-3xl mx-auto bg-bg-paper rounded-card shadow-subtle border border-gray-200 overflow-hidden"
      >
        <div class="p-6 border-b border-gray-200 text-center">
          <h2 class="text-xl font-bold text-text-heading">청소 멤버 자동 생성</h2>
        </div>

        <div class="p-6 flex flex-col gap-6">
          <section class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold text-text-heading">학기 선택</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="section in sections.data" :key="section.sec_id" class="relative">
                <input
                  type="radio"
                  name="section"
                  :id="`section-${section?.sec_id}`"
                  :value="section?.sec_id"
                  v-model="sectionSelect"
                  class="sr-only peer"
                />
                <label
                  :for="`section-${section?.sec_id}`"
                  class="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-text-muted cursor-pointer transition-all duration-200 select-none text-center peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-sm"
                >
                  {{ section?.sec_id }}
                </label>
              </div>
            </div>
          </section>

          <section class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold text-text-heading">요일 선택</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="day in weekDays" :key="day" class="relative">
                <input
                  type="radio"
                  name="day"
                  :id="`day-${day}`"
                  :value="day"
                  v-model="daySelect"
                  class="sr-only peer"
                />
                <label
                  :for="`day-${day}`"
                  class="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-text-muted cursor-pointer transition-all duration-200 select-none text-center peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-sm"
                >
                  {{ day }}
                </label>
              </div>
            </div>
          </section>

          <section class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold text-text-heading">인원 수</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="member in [1, 2, 3, 4]" :key="member" class="relative">
                <input
                  type="radio"
                  name="member"
                  :id="'member-' + member"
                  :value="member"
                  v-model="team_size"
                  class="sr-only peer"
                />
                <label
                  :for="'member-' + member"
                  class="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-text-muted cursor-pointer transition-all duration-200 select-none text-center peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-sm"
                >
                  {{ member + '명' }}
                </label>
              </div>
            </div>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <section class="flex flex-col gap-3 col-span-1">
              <h3 class="text-lg font-semibold text-text-heading">학년 선택</h3>
              <div class="flex flex-col gap-2">
                <div v-for="grade in ['1', '2', '3']" :key="grade" class="relative">
                  <input
                    type="radio"
                    name="grade"
                    :id="'grade-' + grade"
                    :value="grade"
                    v-model="gradeSelect"
                    class="sr-only peer"
                  />
                  <label
                    :for="'grade-' + grade"
                    class="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-text-muted cursor-pointer transition-all duration-200 select-none text-center peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-sm"
                  >
                    {{ grade + '학년' }}
                  </label>
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-3 md:col-span-3">
              <h3 class="text-lg font-semibold text-text-heading">교실 정보</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <div v-for="classroom in classRooms" :key="classroom.classroom_id" class="relative">
                  <input
                    type="radio"
                    name="classroom"
                    :id="'classroom-' + classroom.classroom_id"
                    :value="classroom.classroom_id"
                    v-model="classroomSelect"
                    class="sr-only peer"
                  />
                  <label
                    :for="'classroom-' + classroom.classroom_id"
                    class="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-text-muted cursor-pointer transition-all duration-200 select-none text-center peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-sm"
                  >
                    {{ classroom.label }}
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            class="inline-flex items-center px-6 py-3 bg-primary text-white text-base font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm"
            @click="HandleCreateRoster"
          >
            생성하기
          </button>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { getClassRooms, postCleaningRoster } from '@/api/apiCleaning'
import { getSection } from '@/api/jobApi'
import AppLayout from '@/layouts/AppLayout.vue'
import router from '@/router'
import { onMounted, ref, watch, watchEffect } from 'vue'

const sections = ref([]) // 학기 정보
const classRooms = ref([]) // 교실 정보
const weekDays = ref(['MON', 'TUE', 'WED', 'THU', 'FRI']) // 요일 배열

const sectionSelect = ref('') // 선택된 학기
const daySelect = ref('') // 선택된 요일
const team_size = ref(0) // 선택된 팀 멤버수
const classroomSelect = ref('') // 선택된 교실 정보
const gradeSelect = ref('') // 선택된 학년

onMounted(async () => {
  sections.value = await getSection()
  // console.log('학기정보: ', sections.value)
  classRooms.value = await getClassRooms()
  // console.log('교실정보: ', classRooms.value)
})

const HandleCreateRoster = async () => {
  const roster = {
    section: sectionSelect.value,
    weekday: daySelect.value,
    team_size: team_size.value,
    grade_rooms: [],
  }

  if (gradeSelect.value && classroomSelect.value) {
    roster.grade_rooms.push({
      grade_id: gradeSelect.value,
      classroom_id: classroomSelect.value,
    })
  }

  if (!roster.section || !roster.weekday || !roster.team_size || roster.grade_rooms.length === 0) {
    alert('모든 필수 항목을 선택해주세요.')
    return
  }

  try {
    await postCleaningRoster(roster)
    alert('청소 로스터가 성공적으로 생성되었습니다.')
    router.push({ path: '/cleaningH' })
  } catch (err) {
    console.error('청소 로스터 생성 실패: ', err)
    alert('청소 로스터 생성에 실패했습니다.')
  }
}

watch(sectionSelect, (newSections, oldSections) => {
  if (newSections !== oldSections) {
    daySelect.value = ''
    team_size.value = 0
  }
})
</script>

<style scoped>
/* Scoped styles removed. Tailwind CSS classes are used directly in the template. */
</style>
