import api from './apiClient'
import { errorMsg } from './apiClient'

// ========================== GET ===============================
// ---------------------------------------------------------------
// 교수 목록
//     [{user_id: '8888001', name: '이교수'}, ]
// ---------------------------------------------------------------
export const getProfessors = async () => {
  try {
    const res = await api.get(`/modal/common/professors`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== GET ===============================
// ---------------------------------------------------------------
// 교실 정보 조회
//     [ {
//       "id": 1,
//       "role_type": "student",
//       "name": "김성식",
//       "email": "abc@gmail.com",
//       "phone": "010-4628-5981",
// 학생 ) "is_international": true,
//       "language_id": "JLPT3",
// 교수 ) "professor_id": "P001"
//     }, {}]
// ---------------------------------------------------------------
export const getApproval = async () => {
  try {
    const res = await api.get(`/admin/users`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 등록 되어있는 외부 이메일 조회
// ---------------------------------------------------------------
export const getEmail = async () => {
  try {
    const res = await api.get(`/admin/email`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 회원정보 조회 (학생)
// ---------------------------------------------------------------
export const getUserInfo = async (grade, status) => {
  try {
    const res = await api.get(`/admin/students`, {
      params: {
        grade_id: grade,
        status: status,
      },
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 회원정보 조회 (관리자, 교수)
//[
// {
//     "user_id": "8888001",
//     "name": "이교수",
//     "email": "prof1@g.yju.ac.kr",
//     "phone": "010-8888-0001",
//     "status": "active",
//     "updated_at": "2025-11-17 11:26:21",
//     "role_type": "professor"
// }, ... ]
// ---------------------------------------------------------------
export const getAdminsInfo = async () => {
  try {
    const res = await api.get(`/admin/proadmin`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== POST ===============================
// ---------------------------------------------------------------
// 승인 / 거절 등록
// ---------------------------------------------------------------
export const postApproval = async (user_id, action) => {
  try {
    const res = await api.post(`/admin/users`, {
      user_id: user_id,
      action: action,
    })
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// Email 등록
// ---------------------------------------------------------------
export const postEmail = async (email, reason) => {
  try {
    const res = await api.post(`/admin/email`, {
      email: email,
      reason: reason,
    })
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== PUT ===============================
// ---------------------------------------------------------------
// 학생 정보 수정
// ---------------------------------------------------------------
export const putUser = async (userInfo) => {
  try {
    const res = await api.put(`/admin/students/${userInfo.user_id}`, {
      name: userInfo.name,
      phone: userInfo.phone,
      status: userInfo.status,
      grade_id: userInfo.grade_id,
      language_id: userInfo.language_id,
      class_id: userInfo.class_id,
      is_international: userInfo.is_international,
    })
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 교수,관리자 정보 수정
// ---------------------------------------------------------------
export const putAdmin = async (userInfo) => {
  try {
    const res = await api.put(`/admin/proadmin/${userInfo.user_id}`, {
      role_type: userInfo.role_type,
      name: userInfo.name,
      phone: userInfo.phone,
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== DELETE ===============================
// ---------------------------------------------------------------
// Email 삭제
// ---------------------------------------------------------------
export const delEmail = async (id) => {
  try {
    const res = await api.delete(`/admin/email/${id}`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 사용자 삭제
// ---------------------------------------------------------------
export const delUser = async (id) => {
  try {
    const res = await api.delete(`/admin/students/${id}`)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}
