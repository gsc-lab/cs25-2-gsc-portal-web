import api from "./apiClient";
import { errorMsg } from "./apiClient";

// ========================== GET ===============================
// ---------------------------------------------------------------
// 교실 정보 조회 -> 시간표에서 사용
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

// ---------------------------------------------------------------
// 교실 정보 조회 -> 강의실에서 사용
//     [{
//      "classroom_id": "101",
//      "building": "본관",
//      "room_number": "101",
//      "room_type": "강의실"
//    },]
// ---------------------------------------------------------------
export const getClassroomsInfo = async () => {
  try{
    const res = await api.get(`/classrooms`)
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}


// ---------------------------------------------------------------
// 교실 정보 조회 -> 강의실에서 사용
//     [{
//      "classroom_id": "101",
//      "building": "본관",
//      "room_number": "101",
//      "room_type": "강의실"
//    },]
// ---------------------------------------------------------------
export const getReservation = async (classroom_id) => {
  try{
    const res = await api.get(`/classrooms/${classroom_id}/reservations`, {
      params: { date: "2025-10-13" }
    })
    console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}




// ========================== POST ===============================
// ---------------------------------------------------------------
// 강의실 예약 등록
// ---------------------------------------------------------------
export const postReservation = async (reservationData) => {
  try{
    const res = await api.post(`/classrooms/${reservationData.classroom_id}/reservations`, {
      // user_id: '2423001',// reservationData.name,
      reserve_date: reservationData.reserve_date,
      start_time: reservationData.start_time,
      end_time: reservationData.end_time
    })
    // console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}
