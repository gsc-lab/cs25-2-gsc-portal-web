import apiClient from "./index";

// =============== 전체 공지사항 조회 API 요청 ===============

export const getNotice = async () => {
  const NoticeList = await apiClient.get('/notices?size=100')
  return NoticeList.data
}

// =============== 단일 공지사항 조회 API 요청 ===============

export const getNoticeView = async (noticeId) => {
  const NoticeView = await apiClient.get(`/notices/${noticeId}`)
  return NoticeView.data
}

// ============= 모든 과목 데이터 조회 API 요청 ==============

export const getCourse = async () => {
  const Course = await apiClient.get('/notices/form/courses')
  return Course.data
}

// ============ 공지사항 파일 다운로드 요청 API===============

export const getFileDownLoad = async (file_id) => {
  const file = await apiClient.get(`/files/${file_id}/download`, {
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
    response = await apiClient.post("/notices", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  } else {
    console.log("파일 x json 전송", data)
    response = await apiClient.post('/notices/', data, {
      headers: {
        "Content-Type": "application/json"
      }
    })

  }

  return response.data;
}

// ===================== 공지사항 수정 =====================

export const patchNotice = async (noticeId, data, newFiles = []) => {
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
  const res = await apiClient.patch(`/notices/${noticeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return res.data
}

// ===================== 공지사항 삭제 =====================

export const deleteNotice = async (notice_id) => {
  const deleteNotice = await apiClient.delete(`/notices/${notice_id}`)
  return deleteNotice.data
}

// ==================== 공지사항 대상 조회 ===================

export const getNoticeTarget = async (notice_id) => {
  const noticeTarget = await apiClient.get(`/notices/${notice_id}/status`)
  return noticeTarget.data
}

// ==================== 모든 학생 정보 =====================

export const getAllUser = async () => {
  const users = await apiClient.get('/admin/students');
  return users.data
}

// ==================== 공지사항 알림 정송  =====================
export const postNoticeAlarm = async (notice_id) => {
  const noticeAlarm = await apiClient.post(`/notices/${notice_id}/dispatch`)

  return noticeAlarm.data
}

// ==================== 공지사항 읽음 처리 =====================
export const patchNoticeRead = async (notice_id) => {
  const noticeRead = await apiClient.patch(`/notices/${notice_id}/read`)

  return noticeRead.data
}


// ======================= 학년 정보 =======================

export const gradeList = () => {
  const grade_id = [
    {
      grade_id: '전체',
    },
    {
      grade_id: '1',
    },
    {
      grade_id: '2',
    },
    {
      grade_id: '3',
    },
  ]
  return grade_id
}

// ===================== 과목 타입 선택 =====================

export const course_type = () => {
  const courseType = ([
    { course_type: 'general' },
    { course_type: 'regular' },
    { course_type: 'special' },
    { course_type: 'korean' }
  ])
  return courseType
}
