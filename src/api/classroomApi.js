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
// 교실 예약 정보
//     {
//       SUN: [{
//      "id": "1"
//      "classroom": "CR001",
//      "date": "2000-00-00",
//      "start": "00:00:00",
//      "end": "00:00:00",
//      "user": "홍길동"
//      },{}]
//    }
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


// ---------------------------------------------------------------
// 주말 투표 현황 데이터
//   [{
//      "poll_id": "P001",
//      "grade_name": "1학년",
//      "poll_date": "2025-10-17",
//      "day_of_week": "토요일",
//      "required_count": 8,
//      "vote_count": 4,
//      "is_opened": false,
//      "user_voted": true
//     },{}]
// ---------------------------------------------------------------
export const getPoll = async (date) => {
  console.log("getPoll: " , date);
  try{
    const res = await api.get(`/classrooms/polls`, {
      params: {
        date: "2025-04-02" // date
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

// ---------------------------------------------------------------
// 강의실 등록
// ---------------------------------------------------------------
export const postClassroom = async (CRdata) => {
  try{
    const res = await api.post(`/classrooms`, {
      building: CRdata.building,
      room_number: CRdata.room_number,
      room_type: CRdata.room_type,

      // mode: CRdata.mode,
      // limit: CRdata.limit,
    })
    // console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ---------------------------------------------------------------
// 신청 등록 / 취소
// ---------------------------------------------------------------
export const postPoll = async (poll_id, action) => {
  try{
    const res = await api.post(`/classrooms/polls/${poll_id}/vote`, {
      action: action,
    })
    // console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// ========================== patch ===============================
// ---------------------------------------------------------------
// 강의실 수정
// ---------------------------------------------------------------
export const patchClassroom = async (CRdata) => {
  try{
    const res = await api.patch(`/classrooms`, {
      building: CRdata.building,
      room_number: CRdata.room_number,
      room_type: CRdata.room_type,

      // mode: CRdata.mode,
      // limit: CRdata.limit,
    })
    // console.log(res.data);
    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}
