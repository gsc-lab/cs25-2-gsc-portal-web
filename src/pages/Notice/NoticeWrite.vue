<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="bg-bg-paper rounded-card shadow-subtle overflow-hidden border border-gray-200">
        <!-- Card Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h1 class="text-xl font-bold text-text-heading">공지사항 작성</h1>
          <button @click="openTargetModal = true" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm">
            공지사항 알림 대상 설정
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base pt-2" for="notice-title">제목</label>
            <div class="flex items-center gap-4">
              <input
                id="notice-title"
                class="flex-1 block px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                type="text"
                placeholder="공지사항 제목을 입력하세요"
                v-model="title"
              />
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notice-important"
                  v-model="isImportant"
                  @click="handleImportant"
                  class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <label for="notice-important" class="text-sm font-medium text-text-base cursor-pointer">중요</label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base pt-2" for="notice-author">작성자</label>
            <input
              id="notice-author"
              class="block px-3 py-2 border border-gray-300 rounded-base shadow-sm bg-gray-100 text-text-muted sm:text-sm cursor-not-allowed"
              type="text"
              v-model="author"
              disabled
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base pt-2" for="notice-grade">분류</label>
            <div class="flex flex-col sm:flex-row gap-4">
              <select id="notice-grade" class="block px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm w-full sm:w-auto" v-model="targetSelect">
                <option
                  v-for="notice in noticeTarget"
                  :key="notice.target"
                  :value="notice.target"
                >
                  {{ targetFilter(notice.target) }}
                </option>
              </select>
              <select class="block px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm w-full sm:w-auto" v-model="courseTypeSelect">
                <option
                  v-for="type in filterCourseType"
                  :key="type.course_type"
                  :value="type.course_type"
                >
                  <span>
                    {{ courseTypeFilter(type.course_type) }}
                  </span>
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base pt-2" for="notice-course">과목</label>
            <select
              id="notice-course"
              class="block px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm w-full sm:w-auto"
              v-if="courses.length"
              v-model="courseSelect"
            >
              <option value="">과목을 선택하세요</option>
              <option v-for="course in courses" :key="course.course_id" :value="course.course_id">
                {{ course.title }}
              </option>
            </select>
            <div v-else class="block px-3 py-2 border border-gray-300 rounded-base shadow-sm bg-gray-100 text-text-muted sm:text-sm">선택 가능한 과목이 없습니다.</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base" for="file-upload">첨부파일</label>
            <div class="flex flex-col gap-4">
              <input
                type="file"
                multiple
                @change="handleFiles"
                id="file-upload"
                class="hidden"
              />
              <label for="file-upload" class="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-primary-dark text-sm font-medium rounded-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-sm w-32 cursor-pointer">파일 선택</label>
              <ul class="list-none p-0 m-0 flex flex-col gap-2">
                <li v-for="(file, index) in files" :key="index" class="bg-gray-50 p-2 rounded-md flex justify-between items-center text-sm text-text-base">
                  <span>{{ file.name }} ( {{ (file.size / 1024).toFixed(1) }} KB)</span>
                  <button @click="removeFile(index)" class="px-2 py-1 bg-red-500 text-white text-xs rounded-sm hover:bg-red-600">삭제</button>
                </li>
              </ul>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[140px_1fr] items-start gap-4">
            <label class="block text-sm font-medium text-text-base" for="notice-content">내용</label>
            <textarea
              id="notice-content"
              class="block w-full px-3 py-2 border border-gray-300 rounded-base shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm min-h-[300px] resize-y"
              placeholder="내용을 입력하세요"
              v-model="content"
            ></textarea>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200">
          <button class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-base text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="backPage">뒤로</button>
          <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="submitNotice">등록하기</button>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="openTargetModal" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
      <div class="bg-bg-paper rounded-lg shadow-xl flex flex-col w-11/12 max-w-3xl h-5/6 animate-fade-in">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-text-heading">공지사항 알림 대상 설정</h3>
          <button class="text-gray-500 hover:text-gray-700 text-2xl" @click="openTargetModal = false">×</button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 p-6 bg-gray-50 overflow-y-hidden flex flex-col gap-4">
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="filter in gradeFilters"
              :key="filter"
              @click="modalGradeSelect = filter"
              :class="['px-4 py-2 rounded-full border border-gray-300 bg-white text-primary-dark font-medium hover:bg-gray-100 transition-all duration-200 shadow-sm', { 'bg-primary text-white border-primary shadow-sm': modalGradeSelect === filter }]"
            >
              {{ filter }}
            </button>
          </div>
          <div class="flex-1 bg-bg-paper rounded-md border border-gray-200 overflow-hidden flex flex-col">
            <div class="grid grid-cols-[80px_100px_1fr_1fr] items-center text-center text-sm font-semibold text-text-heading bg-gray-50 border-b border-gray-200 p-3">
              <div class="col-span-1">선택</div>
              <div class="col-span-1">학년</div>
              <div class="col-span-1 text-left px-2">학번</div>
              <div class="col-span-1 text-left px-2">이름</div>
            </div>
            <div class="overflow-y-auto flex-1">
              <template v-for="student in students" :key="student.user_id">
                <label v-if="modalGradeSelect === student.grade_name" :for="`student-${student.user_id}`" class="grid grid-cols-[80px_100px_1fr_1fr] items-center text-center text-sm text-text-base border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-3">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary justify-self-center"
                    v-model="modalStudentSelect"
                    :value="student.user_id"
                    :id="`student-${student.user_id}`"
                  />
                  <div class="col-span-1">{{ student.grade_name }}</div>
                  <div class="col-span-1 text-left px-2">{{ student.user_id }}</div>
                  <div class="col-span-1 text-left px-2">{{ student.name }}</div>
                </label>
              </template>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-4 p-4 border-t border-gray-200 bg-gray-50">
          <button class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-base text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="openTargetModal = false">닫기</button>
          <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-base text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="saveAndClose">저장</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { getCourseRegular, getCourseSpecial, postNotice, getAllUser } from '@/api/apiNotice'
import AppLayout from '@/layouts/AppLayout.vue'
import router from '@/router'
import { useNoticeStore } from '@/stores/notice'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'

const user = useUserStore()
const noticeStore = useNoticeStore()

const { course_type, noticeTarget, targetSelect, courseTypeSelect, courseSelect } =
  storeToRefs(noticeStore)

// ======================================================================

const openTargetModal = ref(false)
const title = ref('') // 제목
const isImportant = ref(false) // 중요
const author = ref(user.userInfo.name) // 작성자
// const courseSelect = ref('') // 과목명 선택
const files = ref([]) // 파일 배열
const content = ref('') // 내용
// ======================================================================

const gradeFilters = ref(['1학년', '2학년', '3학년']) // 모달) 학년 목록
const modalGradeSelect = ref('1학년') // 모달) 학년 선택 (기본값 1학년)
const modalStudentSelect = ref([]) // 모달) 선택된 학생들

// ======================================================================

// API 요청받은값 저장
const courses = ref([]) // 과목 선택 배열
const students = ref([]) // 학생 목록 배열

// ======================================================================

// ======================================================================

onMounted(async () => {
  try {
    // courses.value = await getCourse()
    students.value = await getAllUser()
    // console.log('과목 목록', courses.value)
    // console.log('학생 정보', students.value)
  } catch (err) {
    console.error('데이터 로드 실패', err)
  }
})

// ======================================================================

const handleImportant = () => {
  // 클릭 시 값 토글 (true -> false, false -> true)
  isImportant.value = !isImportant.value
}

const filterCourseType = computed(() => {
  if (targetSelect.value === '전체') {
    return course_type.value.filter((type) => type.course_type === 'general')
  }
  if (['1', '2', '3'].includes(targetSelect.value)) {
    const typeList = ['general', 'regular']
    return course_type.value.filter((type) => typeList.includes(type.course_type))
  }
  if (['special', 'korean'].includes(targetSelect.value)) {
    const typeList = ['A', 'B']
    return course_type.value.filter((type) => typeList.includes(type.course_type))
  }

  return []
})

// 과목 배열에서 과목의 ID 값을 이용하여 선택된 과목의 값이 일치하는 값 저장
const selectedCourseId = computed(() => {
  const selected = courses.value.find((course) => course.course_id === courseSelect.value)
  return selected ? selected.course_id : null
})

const selectedCourseTitle = computed(() => {
  const selected = courses.value.find((course) => course.course_id === selectedCourseId.value)
  return selected ? selected.title : null
})

const selectClassId = computed(() => {
  return courses.value.filter((course) => course.course_id === courseSelect.value)
})

const handleFiles = (event) => {
  const selected = event.target.files
  files.value = [...files.value, ...Array.from(selected)]
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const targetList = {
  1: '1학년',
  2: '2학년',
  3: '3학년',
  special: '일본어 특강',
  korean: '한국어',
}

const targetFilter = (target) => {
  return targetList[target] || target
}

const courseTypeFilter = (type) => {
  if (type === 'A' || type === 'B') {
    return type + '반'
  }
  if (type === 'general') {
    return '전체'
  }
  if (type === 'regular') {
    return '정규'
  }
}

const isLoading = ref(false)

// 공지사항 등록 ( API POST 요청 )
const submitNotice = async () => {
  if (title.value === '' || content.value === '') {
    alert('제목 및 내용을 입력해주세요')
    return
  }

  if (isLoading.value) return // 등록 요청중이면 중단

  isLoading.value = true

  const noticeData = {
    title: title.value,
    author: author.value,
    is_pinned: isImportant.value ? 1 : 0,
    course_id: selectedCourseId.value || null,
    course_title: selectedCourseTitle.value || null,
    specific_users: modalStudentSelect.value || [],
    course_type: courseTypeSelect.value === 'regular' ? 'regular' : 'special',
    content: content.value,
  }

  // 학년 선택 정보가 있을 경우
  if (targetSelect.value !== '전체') {
    noticeData.targets = [
      {
        grade_id: null,
        class_id: null,
        language_id: null,
      },
    ]
    if (['1', '2', '3'].includes(targetSelect.value)) {
      noticeData.targets[0].grade_id = targetSelect.value
    } else if (['special', 'korean'].includes(targetSelect.value)) {
      if (courseSelect.value && courseTypeSelect.value) {
        noticeData.targets[0].class_id = selectClassId.value[0]?.targets[0]?.class_id || null
      }
      if (targetSelect.value === 'special') {
        noticeData.targets[0].language_id = 'JP'
      }
      if (targetSelect.value === 'korean') {
        noticeData.targets[0].language_id = 'KR'
      }
    }

    // 학년 전체일 경우 빈 객체 [] 로 전달
  } else {
    noticeData.targets = []
  }

  console.log('등록 데이터', noticeData)

  try {
    await postNotice(noticeData, files.value)
    alert('공지사항이 업로드 되었습니다.')
    router.push({ path: '/notice' })
  } catch (err) {
    console.error(err)
    alert('업로드 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// watch(gradeSelect, (newGrade) => {
//   if (newGrade === '전체') {
//     courseTypeSelect.value = 'general'
//   } else {
//     courseTypeSelect.value = 'regular'
//   }
// })

watchEffect(() => {
  console.log('선택된 학년: ', targetSelect.value)
  console.log('선택된 과목 타입: ', courseTypeSelect.value)
  console.log('선택과목 아이디: ', courseSelect.value)
  console.log('필터링: ', selectedCourseId.value)
  console.log('선택된 과목이름: ', selectedCourseTitle.value)
})

watch(targetSelect, (newTarget) => {
  if (newTarget === '전체') {
    courseTypeSelect.value = 'general'
  } else if (['1', '2', '3'].includes(newTarget)) {
    courseTypeSelect.value = 'regular'
  } else if (['special', 'korean'].includes(newTarget)) {
    courseTypeSelect.value = 'A'
  }
})

watch([courseTypeSelect, targetSelect], async ([newType, newTarget]) => {
  // 정규 과목 호출 API
  if (['1', '2', '3'].includes(newTarget)) {
    try {
      courses.value = await getCourseRegular(newType, newTarget)
      console.log('학년 별 정규 과목 조회', courses.value)
    } catch (err) {
      console.error('정규 과목 요청 실패', err)
    }
  }
  // 특강 과목 호출 API
  if (['special', 'korean'].includes(newTarget)) {
    try {
      courses.value = await getCourseSpecial(newTarget, newType)
      console.log('특강 과목 조회', courses.value)
    } catch (err) {
      console.error('과목 조회 실패', err)
    }
  }
})

const saveAndClose = () => {
  console.log(modalStudentSelect.value)
  openTargetModal.value = false
}

const backPage = () => {
  router.push({ path: '/notice' })
}
</script>