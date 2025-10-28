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
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
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

  console.log([...formData.entries()])
  const response = await apiClient.post('/notices/', formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return response.data;
}

// ===================== 공지사항 수정 =====================

export const patchNotice = async (noticeId, data, newFiles = []) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
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
  return deleteNotice
}

// ==================== 모든 학생 정보 =====================

export const getAllUser = async () => {
  const users = await apiClient.get('/admin/students');
  return users.data
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
  const courseType = [
    {
      course_type: 'general',
    },
    {
      course_type: 'regular',
    },
    {
      course_type: 'special',
    },
    {
      course_type: 'korean'
    }
  ]
  return courseType
}
