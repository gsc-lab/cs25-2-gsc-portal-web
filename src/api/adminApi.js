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

// ---------------------------------------------------------------
// 회원정보 조회 (학생)
// ---------------------------------------------------------------
export const getUserInfo = async (grade, status) => {
  try {
    console.log('grade', grade)
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
