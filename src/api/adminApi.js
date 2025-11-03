import api from "./apiClient";
import { errorMsg } from "./apiClient";

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
  try{
    const res = await api.get(`/admin/users`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ---------------------------------------------------------------
// 등록 되어있는 외부 이메일 조회
// ---------------------------------------------------------------
export const getEmail = async () => {
  try{
    const res = await api.get(`/admin/email`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ---------------------------------------------------------------
// 회원정보 조회 (학생)
// ---------------------------------------------------------------
export const getUserInfo = async (grade, status) => {
  try{
    const res = await api.get(`/admin/students`, {
      params: {
        grade_name: grade,
        status: status
      }
})
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}


// ========================== POST ===============================
// ---------------------------------------------------------------
// 승인 / 거절 등록
// ---------------------------------------------------------------
export const postApproval = async (user_id, action) => {
  try{
    const res = await api.post(`/admin/users`, {
      user_id: user_id,
      action: action
    })
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ---------------------------------------------------------------
// Email 등록
// ---------------------------------------------------------------
export const postEmail = async (email, reason) => {
  try{
    const res = await api.post(`/admin/email`, {
      email: email,
      reason: reason
    })
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ========================== PATCH ===============================
// ---------------------------------------------------------------
// 승인 / 거절 등록
// ---------------------------------------------------------------
export const patchUser = async (user_id, userInfo) => {
  console.log(user_id, userInfo);
  try{
    const res = await api.patch(`/admin/students/${user_id}`, {
        name: userInfo.name,
        phone: userInfo.phone,
        status: userInfo.status,
        grade_id: userInfo.grade,
        language_id: userInfo.language_id,
        level_name: userInfo.level_name,
        class_name: userInfo.class_name
      })
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}


// ========================== DELETE ===============================
// ---------------------------------------------------------------
// Email 삭제
// ---------------------------------------------------------------
export const delEmail = async (id) => {
  try{
    const res = await api.delete(`/admin/email/${id}`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}


// ---------------------------------------------------------------
// 학생 삭제
// ---------------------------------------------------------------
export const delUser = async (id) => {
  try{
    const res = await api.delete(`/admin/students/${id}`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}
