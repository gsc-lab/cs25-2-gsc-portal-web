<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-text-heading mb-4">학기 설정</h3>

    <button
      @click="isOpen = !isOpen"
      class="px-4 py-2 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200 mb-4"
    >
      {{ isOpen ? '폼 닫기' : '학기 등록' }}
    </button>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-subtle bg-bg-paper">
      <table class="w-full border-collapse min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            ></th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              학기
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              시작일
            </th>
            <th
              class="bg-gray-50 text-text-muted font-medium text-sm py-2 px-3 border-b border-gray-200 text-center"
            >
              종료일
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- ====================  추가  ==================== -->
          <tr v-if="isOpen" class="divide-y divide-gray-200 hover:bg-gray-50">
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">NEW</td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <div class="flex items-center justify-center gap-1">
                <input
                  id="section"
                  v-model="newSection.year"
                  type="number"
                  min="2025"
                  max="2099"
                  class="w-16 px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
                -
                <select
                  class="px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  v-model="newSection.semester"
                >
                  <option value="1">1학기</option>
                  <option value="2">2학기</option>
                  <option value="s">여름방학</option>
                  <option value="w">겨울방학</option>
                </select>
              </div>
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <input
                type="date"
                id="start_date"
                class="w-full px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                v-model="newSection.start_date"
                :max="newSection.end_date"
              />
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <input
                type="date"
                id="end_date"
                class="w-full px-2 py-1 border border-gray-200 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                v-model="newSection.end_date"
                :min="newSection.start_date"
              />
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <button
                @click="handleSubmit"
                class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-base hover:bg-primary-dark transition-colors duration-200 shadow-sm mr-2"
              >
                등록
              </button>
              <button
                @click="((isOpen = false), resetSection())"
                class="px-3 py-1 bg-white text-text-base border border-gray-200 rounded-base text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors duration-200"
              >
                취소
              </button>
            </td>
          </tr>
          <!-- ====================  출력/수정  ==================== -->
          <tr
            v-for="(section, idx) in sections"
            :key="idx"
            class="divide-y divide-gray-200 hover:bg-gray-50"
          >
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">{{ idx + 1 }}</td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ section.label }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ section.start_date }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              {{ section.end_date }}
            </td>
            <td class="text-sm py-2 px-3 border-b border-gray-200 text-center">
              <button
                @click="handleDelete(section.sec_id)"
                class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-base hover:bg-red-600 transition-colors duration-200 shadow-sm"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="!sections || sections.length === 0"
        class="text-center text-text-muted text-lg py-8"
      >
        등록된 학기가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { postSection } from '@/api/timetableApi'

const Tstore = useTimetableStore()
const sections = ref(null)
const isOpen = ref(false)

// 추가할 학기 저장 변수
const newSection = ref()
function resetSection() {
  newSection.value = {
    year: 2025,
    semester: 1,
    start_date: null,
    end_date: null,
  }
}
// 초기화
onMounted(async () => {
  sections.value = await Tstore.getSections()
  resetSection()
})

// ==============  등록  ==============
const handleSubmit = async () => {
  const res = await postSection(newSection.value)
  if (res.success) alert(`${res.sec_id}가 등록 되었습니다.`)
  // 초기화
  isOpen.value = false
  await Tstore.setSections()
  sections.value = await Tstore.getSections()
}
</script>
