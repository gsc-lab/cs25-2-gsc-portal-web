import api from './apiClient'
import { errorMsg } from './apiClient'

// ========================== POST ===============================
// ---------------------------------------------------------------
// 과목 등록
// ---------------------------------------------------------------
export const postCourse = async (courseData) => {
  try {
    await api.post(`/timetables/registerCourses`, {
      sec_id: courseData.section,
      title: courseData.course,
      professor_id: courseData.professor_id,
      target: courseData.target,
      class_id: courseData.class_id,
      class_name: courseData.className,
    })
    alert('과목이 등록되었습니다.')
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 시간표 등록
// ---------------------------------------------------------------
export const postTimetable = async (TimetableData) => {
  try {
    await api.post(`/timetables/registerTimetable`, {
      classroom_id: TimetableData.room_id,
      course_id: TimetableData.course_id,
      day_of_week: TimetableData.day,
      start_period: TimetableData.startTime,
      end_period: TimetableData.endTime,
    })
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 휴 보강 등록
// ---------------------------------------------------------------
export const postEvent = async (SpecialData) => {
  try {
    console.log(SpecialData.event)
    const res = await api.post(`/timetables/registerHoliday`, {
      event_type: SpecialData.event, //  "CANCEL"/ "MAKEUP"
      event_date: SpecialData.date, // "2025-10-05",
      classroom: SpecialData.classroom_label, // "본관-101"
      start_period: SpecialData.startTime, // [휴] 1
      end_period: SpecialData.endTime, // [휴] 2
      course_id: SpecialData.course_id, // [휴] "C001"
      cancel_event_ids: SpecialData.course_id, // [보] ["E002", "E003"]
    })
    console.log(res.data)
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 기본 상담 학생 등록
// ---------------------------------------------------------------
export const postFukaStudents = async (fukaData) => {
  try {
    await api.post(`/timetables/huka/student`, {
      student_ids: fukaData.student_ids,
      sec_id: fukaData.section,
      day_of_week: fukaData.day,
      start_slot: fukaData.startTime,
      end_slot: fukaData.endTime,
      location: fukaData.room,
    })
    alert('등록 완료')
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// Custom 상담 학생 등록
// ---------------------------------------------------------------
export const postFukaCustomStudents = async (fukaData) => {
  try {
    await api.post(`/timetables/huka/student/custom`, {
      student_ids: fukaData.student_ids,
      date: fukaData.date,
      start_slot: fukaData.startTime,
      end_slot: fukaData.endTime,
      location: fukaData.room,
    })
    alert('등록 완료')
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 분반 학생 등록
// ---------------------------------------------------------------
export const postClassStudents = async (class_id, student_ids) => {
  try {
    await api.post(`/timetables/classes/${class_id}/assign`, {
      student_ids: student_ids,
    })
    alert('등록 완료')
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 학기 등록
// ---------------------------------------------------------------
export const postSection = async (section) => {
  try {
    const res = await api.post(`/modal/common/sections`, {
      year: section.year,
      semester: section.semester,
      start_date: section.start_date,
      end_date: section.end_date,
    })
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== GET ===============================
// ---------------------------------------------------------------
// 과목 정보 조회
// ---------------------------------------------------------------
export const getCourses = async (sec_id) => {
  try {
    const res = await api.get(`/modal/subjects/courses/all/${sec_id}`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 시간표 정보 조회
// ---------------------------------------------------------------
export const getStudentTimetable = async (today) => {
  try {
    const res = await api.get(`/timetables/student`, {
      params: {
        date: today,
      },
    })
    console.log('학생 시간표 정보 조회', res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 시간표 정보 조회
// ---------------------------------------------------------------
export const getAdminTimetable = async (today) => {
  try {
    const res = await api.get(`/timetables/admin`, {
      params: {
        date: today,
      },
    })
    console.log('시간표 정보 조회', res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 휴보강 이력 조회
//
// ---------------------------------------------------------------
export const getEvent = async () => {
  try {
    const res = await api.get(`/timetables/events`)
    console.log('휴보강 이력', res.data)
    return res.data.result
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 휴강 정보 조회
/* {
    "event_id": "E001",
    "event_date": "2025-04-15",
    "course_title": "인공지능 개론",
    "grade_id": "2",
    "period": "1",
    "start_time": "09:00:00",
    "end_time": "09:50:00"
  },*/
// ---------------------------------------------------------------
export const getCancelSchedule = async (grade) => {
  try {
    const res = await api.get(`/modal/subjects/holidays?grade_id=${grade}`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// Special 반 조회
// ---------------------------------------------------------------
export const getSpecialClasses = async () => {
  try {
    const res = await api.get(`/modal/subjects/courses/special/classes`)
    console.log('Special 반 : ', res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// Korean 반 조회
// ---------------------------------------------------------------
export const getKoreanClasses = async () => {
  try {
    const res = await api.get(`/modal/subjects/courses/korean/classes`)
    console.log('Korean 반 : ', res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 분반 학생정보 조회
// ---------------------------------------------------------------
export const getClassStudents = async (class_id) => {
  try {
    const res = await api.get(`/modal/subjects/courses/${class_id}/students`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 학기 정보 조회
// ---------------------------------------------------------------
export const getSections = async () => {
  try {
    const res = await api.get(`/modal/common/sections`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== PUT ===============================
// ---------------------------------------------------------------
// 과목 수정
// ---------------------------------------------------------------
export const putCourse = async (Data) => {
  console.log('putCourse', Data)
  try {
    const res = await api.put(`/timetables/registerCourses/${Data.course_id}`, {
      sec_id: Data.data.section,
      title: Data.data.title,
      professor_id: Data.data.professor_id,
      target: Data.data.target,
      class_id: Data.data.class_id,
    })
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}
// ---------------------------------------------------------------
// 시간표 등록
// ---------------------------------------------------------------
export const putTimetable = async (Data) => {
  try {
    await api.put(`/timetables/registerTimetable/${Data.timetable_ids}`, {
      classroom_id: Data.data.room_id,
      course_id: Data.course_id,
      day_of_week: Data.data.day,
      start_period: Data.data.start_period,
      end_period: Data.data.end_period,
    })
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 분반 학생 수정
// ---------------------------------------------------------------
export const putClassStudents = async (class_id, student_ids) => {
  try {
    await api.put(`/timetables/classes/${class_id}/assign`, {
      student_ids: student_ids,
    })
    alert('등록 완료')
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== DEL ===============================
// ---------------------------------------------------------------
// 과목 삭제
// ---------------------------------------------------------------
export const delCourse = async (course_id) => {
  try {
    const res = await api.delete(`/timetables/registerCourses/${course_id}`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 시간표 삭제
// ---------------------------------------------------------------
export const delTimetable = async (schedule_ids) => {
  console.log(schedule_ids)
  try {
    const res = await api.delete(`/timetables/registerTimetable/${schedule_ids}`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}
// ---------------------------------------------------------------
// 휴보강 삭제
// ---------------------------------------------------------------
export const delEvent = async (id) => {
  try {
    const res = await api.delete(`/timetables/registerHoliday/${id}`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}
