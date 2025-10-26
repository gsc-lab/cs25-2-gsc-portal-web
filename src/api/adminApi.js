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
export const getUserInfo = async () => {
  try{
    const res = await api.get(`/admin/student`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}
