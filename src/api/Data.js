export const getUsers = () => {
  const users = [
    { user_id: "1", grade_id: "1", name: "권혁일" },
    { user_id: "2", grade_id: "2", name: "김성관" },
    { user_id: "3", grade_id: "3", name: "이수민" },
    { user_id: "4", grade_id: "1", name: "박지현" },
    { user_id: "5", grade_id: "2", name: "최민호" },
    { user_id: "6", grade_id: "3", name: "정다은" },
    { user_id: "7", grade_id: "1", name: "오승현" },
    { user_id: "8", grade_id: "2", name: "한유진" },
    { user_id: "9", grade_id: "3", name: "장서연" },
    { user_id: "10", grade_id: "1", name: "조현우" }
  ];
  return users;
}

export const setTarget = (getTarget) => {
  const reTarget = (getTarget == "1") ? "1학년" :
    (getTarget == "2") ? "2학년" :
      (getTarget == "3") ? "3학년":
      (getTarget == "special") ? "특강":
              "한국어";
  return reTarget;
}

export const getCourses = () => {
  const courses = [
    { course_id: "1", courseTitle: "딥러닝", type: "정규", grade_id: "2"},
    { course_id: "2", courseTitle: "데이터구조", grade_id: "1" },
    { course_id: "3", courseTitle: "일본어",   },
    { course_id: "4", courseTitle: "켑스톤" },
  ];
  return courses;
};

// 학년 등 필터링 적용 예정
export const getClassrooms = () => {
  const classrooms = [
    { classroom_id: "101", building: "창조관", room_number: "302" },
    { classroom_id: "102", building: "창조관", room_number: "404" },
    { classroom_id: "201", building: "창조관", room_number: "404-1" },
  ];
  return classrooms;
}
