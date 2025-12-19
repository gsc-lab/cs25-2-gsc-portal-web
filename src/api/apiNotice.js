import api from "./apiClient";

// =============== 전체 공지사항 조회 API 요청 ===============

export const getNotice = async (params) => {
  const noticeList = await api.get(`/notices/`, { params })
  return noticeList.data
}

// =============== 단일 공지사항 조회 API 요청 ===============

export const getNoticeView = async (noticeId) => {
  const noticeView = await api.get(`/notices/${noticeId}`)
  return noticeView.data
}

// ============= 학년별 과목 조회 API 요청 ==============

export const getCourse = async () => {
  const course = await api.get('/notices/form/courses/')

  return course.data
}


// ============= 학년별 정규 과목 데이터 조회 API 요청 ==============

export const getCourseRegular = async (type, grade) => {
  const courseRegular = await api.get('/notices/form/courses/', {
    params: {
      course_type: type,
      grade_id: grade,
    }
  })

  console.log(courseRegular)
  return courseRegular.data
}

// ============= 특강 과목 데이터 조회 API 요청 ==============

export const getCourseSpecial = async (type, classId) => {
  const getCourseSpecial = await api.get('/notices/form/courses/', {
    params: {
      course_type: type,
      class_id: classId
    }
  })

  console.log(getCourseSpecial)
  return getCourseSpecial.data
}
// ============ 공지사항 파일 다운로드 요청 API===============

export const getFileDownLoad = async (file_id) => {
  const file = await api.get(`/files/${file_id}/download`, {
    responseType: 'blob',
  })
  return file.data
}

// ===================== 공지사항 등록 ======================

export const postNotice = async (data, files) => {
  let response;

  if (files.length > 0) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value);
      }
    })

    if (files && files.length > 0) {
      for (const file of files) {
        formData.append("files", file);
      }
    }
    console.log("파일 포함 (form Data 전송", formData)
    response = await api.post("/notices", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  } else {
    console.log("파일 x json 전송", data)
    response = await api.post('/notices/', data, {
      headers: {
        "Content-Type": "application/json"
      }
    })

  }

  return response.data;
}

// ===================== 공지사항 수정 =====================

export const patchNotice = async (noticeId, data, newFiles = []) => {
  let response;

  if ((data.existing_file_ids.length > 0) || (newFiles && newFiles.length > 0)) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    })

    if (newFiles && newFiles.length > 0) {
      for (const file of newFiles) {
        formData.append("files", file);
      }
    }
    console.log("파일 포함 (form Data 전송", formData)
    response = await api.patch(`/notices/${noticeId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  } else {
    console.log("파일 x json 전송", data)
    response = await api.patch(`/notices/${noticeId}`, data, {
      headers: { "Content-Type": "application/json" }
    })
  }
  return response.data
}
// ===================== 공지사항 삭제 =====================

export const deleteNotice = async (notice_id) => {
  const deleteNotice = await api.delete(`/notices/${notice_id}`)
  return deleteNotice.data
}

// ==================== 공지사항 대상 조회 ===================

export const getNoticeTarget = async (notice_id) => {
  const noticeTarget = await api.get(`/notices/${notice_id}/status`)
  return noticeTarget.data
}

// ==================== 모든 학생 정보 =====================

export const getAllUser = async () => {
  const users = await api.get('/admin/students');
  return users.data
}

// ==================== 공지사항 알림 정송  =====================
export const postNoticeAlarm = async (notice_id) => {
  const noticeAlarm = await api.post(`/notices/${notice_id}/dispatch`)

  return noticeAlarm.data
}

// ==================== 공지사항 읽음 처리 =====================
export const patchNoticeRead = async (notice_id) => {
  const noticeRead = await api.patch(`/notices/${notice_id}/read`)

  return noticeRead.data
}
