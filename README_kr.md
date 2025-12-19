このプロジェクトの README は日本語と韓国語で提供いたします。
<br>
이 프로젝트의 README는 한국어와 일본어로 제공됩니다.

- [日本語 (Japanese)](README.md)
- [한국어 (Korean)](README_kr.md)

# GSC Portal Web
GSC Portal은 영진전문대학교 글로벌시스템융합과학생을 위해 만들어진 학생, 교수, 관리자의 역할에 따라 학사 일정을 통합 관리할 수 있는 플랫폼입니다.

## 프로젝트 배경
본 프로젝트는 **"학교 생활의 모든 정보를 한눈에 관리하고 싶다"** 는 학생의 요구에서 개발되었습니다.  
학교 소식을 카카오톡으로만 받다 보니 여러 가지 문제가 있었습니다.
1. **정보가 여기저기 흩어져 있음** : 내 레벨이나 언어 수업에 맞는 공지랑 시간표를 일일이 따로 확인해야 해서 너무 번거로웠습니다.  
2. **중요한 소식을 놓침** : 갑작스러운 휴강이나 보강 같은 일정 변경이 잘 전달되지 않아, 학교에 헛걸음하는 친구들이 생기기도 했습니다.
3. **데이터가 사라짐** : 시간이 지나면 옛날 공지 내용이나 첨부파일을 다시 볼 수 없어서 나중에 공부할 때 불편했습니다.

학생은 본 서비스를 통해이제 학생 레벨에 맞는 시간표를 바로 확인하고, 지난 공지사항도 언제든 다시 찾아볼 수 있습니다.

## 목표
- **개인화된 정보 제공** : 사용자의 소속(학년, 언어)을 식별하여 필요한 정보만 선별해서 보여주는 맞춤형 시스템을 지향합니다.  
- **통합 관리 플랫폼** : 분산되어 있던 학사 관리 기능을 하나로 모아 관리의 효율성을 극대화합니다.


## Members

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Gapsick.png" width="100"/><br/>
      <b>김성식</b><br/>
      Backend (팀장)<br/>
      <a href="https://github.com/Gapsick">@Gapsick</a>
    </td>
    <td align="center">
      <img src="https://github.com/ias-kim.png" width="100"/><br/>
      <b>김성관</b><br/>
      Backend<br/>
      <a href="https://github.com/ias-kim">@ias-kim</a>
    </td>
    <td align="center">
      <img src="https://github.com/kwonhyukil.png" width="100"/><br/>
      <b>권혁일</b><br/>
      Frontend<br/>
      <a href="https://github.com/kwonhyukil">@kwonhyukil</a>
    </td>
    <td align="center">
      <img src="https://github.com/ohiayame.png" width="100"/><br/>
      <b>아야메</b><br/>
      Frontend<br/>
      <a href="https://github.com/ohiayame">@ohiayame</a>
    </td>
  </tr>
</table>

## 기술 스택
### Frontend :  
- 프래임워크 : Vue 3  
- 상태 관리 : Pinia  
- CSS 프래임워크 : Tailwind css

### Backend : 
- Express.js 
- DB : MySQL  
( <a href="https://github.com/gsc-lab/cs25-2-gsc-portal-api">Backend Repository</a> )

<hr style="height:3px; background:#444; border:none;" />

## 기능 내용

### 1. 로그인 / 회원가입
담당 : 권혁일
- Google Oauth를 통해 로그인 시도합니다.
- 검증 완료시 회원가입으로 리다이렉트합니다.
- 사용자의 status에 따라 페이지 이동합니다.


| 로그인 (Google OAuth)                                | 회원가입 페이지                                            |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| <img src="docs/Login.png" alt="Login" width="400px"> | <img src="docs/Register.png" alt="Register" width="400px"> |

| 회원가입 완료                                                  | 승인/거절                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="docs/RegisterOk.png" alt="RegisterOk" width="400px"> | <img src="docs/Register_isRejected.png" alt="Register_isRejected" width="400px"> |

<hr style="height:3px; background:#444; border:none;" />

### 2. 메인
담당 : 권혁일
- 메인페이지에는 시간표, 공지사항, 청소, 교실 투표 현황을 보여줍니다.

<img src="docs/Main.png" alt="Main" width="800px">


<hr style="height:3px; background:#444; border:none;" />

### 3. 공지사항
담당 : 권혁일
- 사용자는 조건에 따라 공지사항을 필터링하여 확인할 수 있다.
- 교수/관리자가 학년/타입/과목을 선택하여 공지사항 작성합니다.
- 공지사항의 수정과 삭제는 작성자만 가능합니다.

<img src="docs/Notice.png" alt="Notice" width="600px">

| 공지사항 작성                                                  | 공지사항 수정                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="docs/NoticeCreate.png" alt="NoticeCreate" width="400px"> | <img src="docs/NoticeEdit.png" alt="NoticeEdit" width="400px"> |


<hr style="height:3px; background:#444; border:none;" />

### 4. 시간표
담당 : 아야메  
- 사용자에 맞춰서 정규 시간표와 일본어 특강, 휴·보강 정보를 하나의 시간표에서 함께 확인   

**관리자** : 강의 CRUD, 시간표 CRUD, 휴·보강 CRUD, 분반 등록, 상담 등록

| 시간표                                                  | 시간표 사이드바                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="docs/Timetable.png" alt="NoticeCreate" width="500px"> | <img src="docs/TimetableSidebar.png" alt="NoticeEdit" width="300px"> |

<hr style="height:3px; background:#444; border:none;" />

### 5. 청소
담당 : 권혁일
- 관리자가 조건에 맞는 항목을 선택하여 로스터를 생성합니다.
- 로스터는 백엔드에서 랜덤으로 자동 생성됩니다.

| 청소 담당 확인 페이지                                                  | 청소 설정                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="docs/Cleaning.png" alt="NoticeCreate" width="500px"> | <img src="docs/CleaningCreate.png" alt="NoticeEdit" width="300px"> |

<hr style="height:3px; background:#444; border:none;" />

### 6. 교실
담당 : 아야메  
**기능 1** : 학생들이 자유롭게 사용할 수 있는 하드췌어실습실 등 사용 예약  
**기능 2** : 학년별 주말 개방 신청 (관리자/교수님: 각 힉년 사용인원 제한 설정)

| 하드췌어실습실 사용 예약                                                  | 주말 개방 신청                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="docs/Classroom.png" alt="NoticeCreate" width="500px"> | <img src="docs/ClassroomP.png" alt="NoticeEdit" width="300px"> |

<hr style="height:3px; background:#444; border:none;" />

### 7. 프로필
담당 : 권혁일
- 사용자는 자신의 프로필 정보를 확인할 수 있습니다.
- 시험 성적을 입력하여 성적정보를 확인할 수 있습니다.

<img src="docs/Profile.png" alt="Main" width="350px">


<hr style="height:3px; background:#444; border:none;" />

### 8. 관리자
담당 : 아야메  
**기능** : 사용자 승인, 외부 이메일 등록, 학기/교실 관리, 사용자 관리  
**사용 대상** : 관리자/교수님
| 사용자 승인                                                 | 사용자 관리                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="docs/Admin.png" alt="Admin" width="450px"> | <img src="docs/Admin2.png" alt="NoticeEdit" width="500px"> |

<hr style="height:3px; background:#444; border:none;" />


## 커밋 컨벤션

커밋 메시지는 다음 규칙을 따릅니다:

- ✨ feat 새로운 기능 추가
- 🐛 fix 버그 수정
- 📚 docs 문서 수정 (README, 주석 등)
- 💅 style css 추가, 작성
- ♻️ refactor 코드 리팩토링 (구조 개선)
- 🔧 chore 잡다한 작업 (설정, 패키지, 세미콜론, 공백 등)

<hr style="height:3px; background:#444; border:none;" />

## 프로젝트 구조

```
src/
├─ api/ # API 통신 모듈
├─ layouts/ # 공통 레이아웃
├─ pages/ # 개별 페이지
|     ├─ Admin/      # 관리자 페이지
|     ├─ Classroom/  # 교실 예약/신청 페이지
|     ├─ Cleaning/   # 청소담당 페이지
|     ├─ Login/      # 로그인 페이지
|     ├─ Main/       # 메인 페이지
|     ├─ NotFound/   # 예외 페이지
|     ├─ Notice/     # 공지사항 페이지
|     ├─ Profile/    # 정보확인 페이지
|     ├─ Register/   # 회원가입 페이지
|     └─ TimeTable/  # 시간표 페이지
├─ router/ # Vue Router 설정
├─ stores/ # Pinia 상태 관리
├─ styles/ # 공통 스타일
├─ App.vue # 루트 컴포넌트
└─ main.js # 진입 파일
```
