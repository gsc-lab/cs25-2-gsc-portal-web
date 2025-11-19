import api from './apiClient'
import { errorMsg } from './apiClient'

// ========================== GET ===============================
// ---------------------------------------------------------------
// 교실 정보 조회 -> 시간표에서 사용
//     [{ classroom_id: "101", label: "본관-101" },]
// ---------------------------------------------------------------
export const getClassrooms = async () => {
  try {
    const res = await api.get(`/modal/common/classrooms`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
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
  try {
    const res = await api.get(`/classrooms`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 교실 신청제 설정 조회
//     [{
//       "rule_id": "r001",
//       "grade_name": "1학년",
//       "grade_id": "1",
//       "required_count": 5,
//       "start_date": "2025-11-18"
//    },]
// ---------------------------------------------------------------
export const getPollClassrooms = async () => {
  try {
    const res = await api.get(`/classrooms/polls/rules`)
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
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
export const getReservation = async (classroom_id, date) => {
  try {
    const res = await api.get(`/classrooms/${classroom_id}/reservations`, {
      params: { date: date },
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
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
  try {
    const res = await api.get(`/classrooms/polls`, {
      params: {
        date: date,
      },
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== POST ===============================
// ---------------------------------------------------------------
// 강의실 예약 등록
// ---------------------------------------------------------------
export const postReservation = async (classroom_id, data) => {
  try {
    const res = await api.post(`/classrooms/${classroom_id}/reservations`, {
      reserve_date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 강의실 등록
// ---------------------------------------------------------------
export const postClassroom = async (CRdata) => {
  try {
    const res = await api.post(`/classrooms`, {
      building: CRdata.building,
      room_number: CRdata.room_number,
      room_type: String(CRdata.room_type),

      // mode: CRdata.mode,
      // limit: CRdata.limit,
    })
    // console.log(res.data);
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 강의실 신청제 등록
// ---------------------------------------------------------------
export const postPollClassroom = async (data) => {
  try {
    const res = await api.post(`/classrooms/polls`, {
      grade_id: data.grade_id,
      required_count: data.required_count,
    })
    // console.log(res.data);
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 신청 등록 / 취소
// ---------------------------------------------------------------
export const postPoll = async (poll_id, action) => {
  try {
    const res = await api.post(`/classrooms/polls/${poll_id}/vote`, {
      action: action,
    })
    // console.log(res.data);
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== patch ===============================
// ---------------------------------------------------------------
// 강의실 수정
// ---------------------------------------------------------------
export const patchClassroom = async (CRdata) => {
  try {
    const res = await api.patch(`/classrooms`, {
      building: CRdata.building,
      room_number: CRdata.room_number,
      room_type: CRdata.room_type,
    })
    // console.log(res.data);
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ---------------------------------------------------------------
// 강의실 신청제 수정
// ---------------------------------------------------------------
export const putPollClassroom = async (data) => {
  try {
    const res = await api.put(`classrooms/polls/rules`, {
      rule_id: data.rule_id,
      required_count: data.required_count,
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}

// ========================== delete ===============================
// ---------------------------------------------------------------
// 강의실 예약 삭제
// ---------------------------------------------------------------
export const deleteReservation = async (classroom_id, reservation_id) => {
  try {
    const res = await api.delete(`/classrooms/${classroom_id}/reservations/${reservation_id}`)
    // console.log(res.data);
    return res.data
  } catch (e) {
    errorMsg(e)
  }
}
