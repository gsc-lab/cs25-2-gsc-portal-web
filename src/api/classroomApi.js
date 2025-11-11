import api from "./apiClient";
import { errorMsg } from "./apiClient";

// ========================== GET ===============================
// ---------------------------------------------------------------
// 교실 정보 조회
//     [{ classroom_id: "101", label: "본관-101" },]
// ---------------------------------------------------------------
export const getClassrooms = async () => {
  try{
    const res = await api.get(`/modal/common/classrooms`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}
