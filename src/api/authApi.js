import api from "./apiClient";
import { errorMsg } from "./apiClient";
// ========================== GET ===============================
// ---------------------------------------------------------------
// 교수 목록
//     [{user_id: '8888001', name: '이교수'}, ]
// ---------------------------------------------------------------
export const getProfessors = async () => {
  try {
    const res = await api.get(`/modal/common/professors`);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

