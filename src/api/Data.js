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
    { classroom_id: "101", label: "창조관-302" },
    { classroom_id: "102", label: "창조관-404" },
    { classroom_id: "201", label: "창조관-404-1" },
  ];
  return classrooms;
}

export const getTimetable = () => {
  const timetable = {
    MON: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null,
        12: null
    },
    TUE: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null,
        12: null
    },
    WED: {
        1: null,
        2: {
            course_id: "C001",
            title: "인공지능 개론",
            room: "본관-101",
            professor: "이교수",
            level: null,
            event: null
        },
        3: {
            course_id: "C001",
            title: "인공지능 개론",
            room: "본관-101",
            professor: "이교수",
            level: null,
            event: null
        },
        4: {
            course_id: "C008",
            title: "TOPIK 4급 한국어 특강",
            room: "실습동-202",
            professor: "박교수",
            level: "TOPIC 4급",
            event: null
        },
        5: {
            course_id: "C006",
            title: "네트워크",
            room: "실습동-201",
            professor: "이교수",
            level: null,
            event: null
        },
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null,
        12: null
    },
    THU: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: {
            course_id: "C008",
            title: "TOPIK 4급 한국어 특강",
            room: "실습동-202",
            professor: "박교수",
            level: "TOPIC 4급",
            event: null
        },
        12: null
    },
    FRI: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: {
            course_id: "C006",
            title: "네트워크",
            room: "실습동-201",
            professor: "이교수",
            level: null,
            event: null
        },
        9: {
            course_id: "C006",
            title: "네트워크",
            room: "실습동-201",
            professor: "이교수",
            level: null,
            event: null
        },
        10: null,
        11: null,
        12: null
    }
  }
  return timetable;
}
