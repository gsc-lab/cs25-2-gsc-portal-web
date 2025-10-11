import api from "./apiClient";
import { errorMsg } from "./apiClient";

// ========================== POST ===============================
// ---------------------------------------------------------------
// 과목 등록
// ---------------------------------------------------------------
export const postCourse = async (courseData) => {
  try{
    await api.post(`/timetables/registerCourses`, {
        sec_id: courseData.section,
        title: courseData.course,
        professor_id: courseData.professor_id,
        target: courseData.target
    });
    alert("과목이 등록되었습니다.")
  } catch (e) {
    errorMsg(e);
  }
};

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
      end_period: TimetableData.endTime
    });
  } catch (e) {
    errorMsg(e);
  }
};

// ---------------------------------------------------------------
// 휴 보강 등록
// ---------------------------------------------------------------
export const postEvent = async (SpecialData) => {
  try {
    console.log(SpecialData.event);
    await api.post(`/timetables/registerHoliday`, {
        event_type: SpecialData.event,           //  "CANCEL"/ "MAKEUP"
        event_date: SpecialData.date,            // "2025-10-05",
        classroom: SpecialData.classroom_label,  // "본관-101"
        start_period: SpecialData.startTime,     // [휴] 1
        end_period: SpecialData.endTime,         // [휴] 2
        course_id: SpecialData.course_id,        // [휴] "C001"
        cancel_event_ids: SpecialData.course_id, // [보] ["E002", "E003"]
    });
    alert("등록 완료")
  } catch (e) {
    errorMsg(e);
  }
};

// ========================== GET ===============================
// ---------------------------------------------------------------
// 과목 정보 조회
//
// ---------------------------------------------------------------
export const getCourses = async () => {
  try {
    const res = await api.get(`/modal/subjects/courses/all`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}



// ---------------------------------------------------------------
// 시간표 정보 조회
//
// ---------------------------------------------------------------
export const getAdminTimetable = async (today) => {
  try {
    const res = await api.get(`/timetables/admin`, {
      params: {
        date: "2025-06-01",
        }
    })
    console.log("시간표 정보 조회", res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ---------------------------------------------------------------
// 휴보강 이력 조회
//
// ---------------------------------------------------------------
export const getEvent = async () => {
  try {
    const res = await api.get(`/timetables/events`)
    console.log("휴보강 이력", res.data);
    return res.data.result;
  } catch (e) {
    errorMsg(e);
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
  try{
    const res = await api.get(`/modal/subjects/holidays?grade_id=${grade}`)
    return res.data;
  } catch (e) {
    errorMsg(e);
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
export const getLevels = async () => {
  try{
    const res = await api.get(`/modal/levels`)
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}
