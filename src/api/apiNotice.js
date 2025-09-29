export const getNotice = () => {
  const NoticeList = [
    {
      "notice_id": 201,
      "title": "[G1] 1차 퀴즈 공지",
      "created_at": "2025-09-20",
      "course_id": "COURSE-G1-01",
      "course_title": "기초 일본어",
      "author_id": "U12345",
      "author_name": "홍길동",
      "author_role": "PROFESSOR",
      "professor_name": "김교수",
      "targets": [
        { "grade_id": "G1", "level_id": "N1", "language_id": "JP" }
      ],
      "content": "이번 주 금요일에 1차 퀴즈가 진행됩니다.",
      "attachments": [
        { "file_name": "퀴즈범위.pdf", "file_url": "https://example.com/file/퀴즈범위.pdf" }
      ]
    },
    {
      "notice_id": 202,
      "title": "[G1] 발표 자료 제출 안내",
      "created_at": "2025-09-21",
      "course_id": "COURSE-G1-01",
      "course_title": "기초 일본어",
      "author_id": "U12345",
      "author_name": "홍길동",
      "author_role": "PROFESSOR",
      "professor_name": "김교수",
      "targets": [
        { "grade_id": "G1", "level_id": "N2", "language_id": "JP" }
      ],
      "content": "발표 자료는 일요일 자정까지 업로드 바랍니다.",
      "attachments": []
    },
    {
      "notice_id": 203,
      "title": "[G1] 중간고사 일정 공지",
      "created_at": "2025-09-22",
      "course_id": "COURSE-G1-01",
      "course_title": "기초 일본어",
      "author_id": "U12345",
      "author_name": "홍길동",
      "author_role": "PROFESSOR",
      "professor_name": "김교수",
      "targets": [
        { "grade_id": "G1", "level_id": "N3", "language_id": "JP" }
      ],
      "content": "중간고사는 10월 첫째 주 수요일에 실시합니다.",
      "attachments": []
    },
    {
      "notice_id": 204,
      "title": "[G1] 과제 제출 연장 안내",
      "created_at": "2025-09-23",
      "course_id": "COURSE-G1-01",
      "course_title": "기초 일본어",
      "author_id": "U12345",
      "author_name": "홍길동",
      "author_role": "PROFESSOR",
      "professor_name": "김교수",
      "targets": [
        { "grade_id": "G1", "level_id": "N4", "language_id": "JP" }
      ],
      "content": "과제 마감 기한이 2일 연장되었습니다.",
      "attachments": [
        { "file_name": "연장공지.pdf", "file_url": "https://example.com/file/연장공지.pdf" }
      ]
    },
    {
      "notice_id": 205,
      "title": "[G1] 보충 수업 안내",
      "created_at": "2025-09-24",
      "course_id": "COURSE-G1-01",
      "course_title": "기초 일본어",
      "author_id": "U12345",
      "author_name": "홍길동",
      "author_role": "PROFESSOR",
      "professor_name": "김교수",
      "targets": [
        { "grade_id": "G1", "level_id": "N5", "language_id": "JP" }
      ],
      "content": "보충 수업은 금요일 오후 2시에 진행됩니다.",
      "attachments": []
    },
    {
      "notice_id": 206,
      "title": "[G2] 1차 퀴즈 공지",
      "created_at": "2025-09-20",
      "course_id": "COURSE-G2-01",
      "course_title": "중급 일본어",
      "author_id": "U67890",
      "author_name": "이몽룡",
      "author_role": "PROFESSOR",
      "professor_name": "박교수",
      "targets": [
        { "grade_id": "G2", "level_id": "N1", "language_id": "JP" }
      ],
      "content": "중급반 1차 퀴즈는 이번 주 토요일입니다.",
      "attachments": []
    },
    {
      "notice_id": 207,
      "title": "[G2] 발표 일정 안내",
      "created_at": "2025-09-21",
      "course_id": "COURSE-G2-01",
      "course_title": "중급 일본어",
      "author_id": "U67890",
      "author_name": "이몽룡",
      "author_role": "PROFESSOR",
      "professor_name": "박교수",
      "targets": [
        { "grade_id": "G2", "level_id": "N2", "language_id": "JP" }
      ],
      "content": "팀별 발표 순서는 첨부 파일을 참고하세요.",
      "attachments": [
        { "file_name": "발표순서.pdf", "file_url": "https://example.com/file/발표순서.pdf" }
      ]
    },
    {
      "notice_id": 208,
      "title": "[G2] 중간고사 범위 공지",
      "created_at": "2025-09-22",
      "course_id": "COURSE-G2-01",
      "course_title": "중급 일본어",
      "author_id": "U67890",
      "author_name": "이몽룡",
      "author_role": "PROFESSOR",
      "professor_name": "박교수",
      "targets": [
        { "grade_id": "G2", "level_id": "N3", "language_id": "JP" }
      ],
      "content": "중간고사 범위는 3~6과입니다.",
      "attachments": []
    },
    {
      "notice_id": 209,
      "title": "[G2] 과제 제출 방법 안내",
      "created_at": "2025-09-23",
      "course_id": "COURSE-G2-01",
      "course_title": "중급 일본어",
      "author_id": "U67890",
      "author_name": "이몽룡",
      "author_role": "PROFESSOR",
      "professor_name": "박교수",
      "targets": [
        { "grade_id": "G2", "level_id": "N4", "language_id": "JP" }
      ],
      "content": "과제는 이메일로 제출 바랍니다.",
      "attachments": []
    },
    {
      "notice_id": 210,
      "title": "[G2] 특강 안내",
      "created_at": "2025-09-24",
      "course_id": "COURSE-G2-01",
      "course_title": "중급 일본어",
      "author_id": "U67890",
      "author_name": "이몽룡",
      "author_role": "PROFESSOR",
      "professor_name": "박교수",
      "targets": [
        { "grade_id": "G2", "level_id": "N5", "language_id": "JP" }
      ],
      "content": "특강은 일본어 면접 대비 내용으로 진행됩니다.",
      "attachments": []
    },
    {
      "notice_id": 211,
      "title": "[G3] 졸업 시험 일정 안내",
      "created_at": "2025-09-20",
      "course_id": "COURSE-G3-01",
      "course_title": "고급 일본어",
      "author_id": "U13579",
      "author_name": "성춘향",
      "author_role": "PROFESSOR",
      "professor_name": "최교수",
      "targets": [
        { "grade_id": "G3", "level_id": "N1", "language_id": "JP" }
      ],
      "content": "졸업 시험은 11월 둘째 주에 실시됩니다.",
      "attachments": []
    },
    {
      "notice_id": 212,
      "title": "[G3] 논문 제출 안내",
      "created_at": "2025-09-21",
      "course_id": "COURSE-G3-01",
      "course_title": "고급 일본어",
      "author_id": "U13579",
      "author_name": "성춘향",
      "author_role": "PROFESSOR",
      "professor_name": "최교수",
      "targets": [
        { "grade_id": "G3", "level_id": "N2", "language_id": "JP" }
      ],
      "content": "졸업 논문 초안은 10월 15일까지 제출 바랍니다.",
      "attachments": []
    },
    {
      "notice_id": 213,
      "title": "[G3] 세미나 발표 안내",
      "created_at": "2025-09-22",
      "course_id": "COURSE-G3-01",
      "course_title": "고급 일본어",
      "author_id": "U13579",
      "author_name": "성춘향",
      "author_role": "PROFESSOR",
      "professor_name": "최교수",
      "targets": [
        { "grade_id": "G3", "level_id": "N3", "language_id": "JP" }
      ],
      "content": "세미나 발표는 팀별로 진행됩니다.",
      "attachments": []
    },
    {
      "notice_id": 214,
      "title": "[G3] 학술제 준비 공지",
      "created_at": "2025-09-23",
      "course_id": "COURSE-G3-01",
      "course_title": "고급 일본어",
      "author_id": "U13579",
      "author_name": "성춘향",
      "author_role": "PROFESSOR",
      "professor_name": "최교수",
      "targets": [
        { "grade_id": "G3", "level_id": "N4", "language_id": "JP" }
      ],
      "content": "학술제 준비를 위한 전체 모임이 있습니다.",
      "attachments": []
    },
    {
      "notice_id": 215,
      "title": "[G3] 종강 안내",
      "created_at": "2025-09-2",
      "course_id": "COURSE-G3-01",
      "course_title": "고급 일본어",
      "author_id": "U13579",
      "author_name": "성춘향",
      "author_role": "PROFESSOR",
      "professor_name": "최교수",
      "targets": [
        { "grade_id": "G3", "level_id": "N5", "language_id": "JP" }
      ],
      "content": "종강일은 12월 1일이며, 수료증 발급은 1주일 뒤 가능합니다.",
      "attachments": []
    }
  ]
  return NoticeList;
}

