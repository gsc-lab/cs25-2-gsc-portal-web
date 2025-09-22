# GSC Portal Web

## ⭐ 실행 방법

```bash
docker-compose up --build
```

Web 실행 후:

Web 서버: http://localhost:5173

<hr style="height:3px; background:#444; border:none;" />

## 🧑‍💻 코드 규칙

- ESLint + Prettier 적용
- 세미콜론(;) 필수
- 큰따옴표(") 사용
- 들여쓰기: 스페이스 2칸
- 커밋 전에 npm run lint:fix 실행

<hr style="height:3px; background:#444; border:none;" />

## 📝 커밋 컨벤션

커밋 메시지는 다음 규칙을 따릅니다:

- ✨ feat 새로운 기능 추가
- 🐛 fix 버그 수정
- 📚 docs 문서 수정 (README, 주석 등)
- 💅 style css 추가, 작성
- ♻️ refactor 코드 리팩토링 (구조 개선)
- 🔧 chore 잡다한 작업 (설정, 패키지, 세미콜론, 공백 등)

### ✅ 예시

- ✨ feat: 로그인 기능 추가
- 🐛 fix: 버그 수정
- 📚 docs: README에 코드 규칙 작성
- 💅 style: Header 디자인 작성
- ♻️ refactor: LoginPage 구조 개선
- 🔧 chore 잡다한 작업 (설정, 패키지, 세미콜론, 공백 등)

<hr style="height:3px; background:#444; border:none;" />

## 📂 프로젝트 구조 (초기)

src/  
├─ api/ # API 통신 모듈  
├─ layouts/ # 공통 레이아웃  
├─ pages/ # 개별 페이지 (Login, Register, Main 등)  
├─ router/ # Vue Router 설정  
├─ stores/ # Pinia/Vuex 등 상태 관리  
├─ styles/ # 공통 스타일  
├─ App.vue # 루트 컴포넌트  
└─ main.js # 진입 파일
