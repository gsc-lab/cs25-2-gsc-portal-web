<template>
  <header v-if="userStore.userInfo && router.currentRoute.value.path !== '/login'" class="header">
    <div class="header-inner">
      <div class="header-left">
        <router-link to="/dashboard" class="logo-text">GSC-Portal</router-link>
      </div>

      <nav class="navbar">
        <div class="nav-item">
          <router-link class="menu" to="/notice">공지사항</router-link>
          <ul class="dropdown">
            <li><router-link to="/notice/grade/1">1학년 공지사항</router-link></li>
            <li><router-link to="/notice/grade/2">2학년 공지사항</router-link></li>
            <li><router-link to="/notice/grade/3">3학년 공지사항</router-link></li>
          </ul>
        </div>

        <div class="nav-item">
          <router-link class="menu" to="/timetable">시간표</router-link>
          <ul class="dropdown">
            <li><router-link to="/timetable">1학년 시간표</router-link></li>
            <li><router-link to="/timetable">2학년 시간표</router-link></li>
            <li><router-link to="/timetable">3학년 시간표</router-link></li>
          </ul>
        </div>

        <div class="nav-item">
          <router-link class="menu" to="/cleaning">청소당번</router-link>
          <ul class="dropdown">
            <li><router-link to="/cleaning">1학년 청소당번</router-link></li>
            <li><router-link to="/cleaning">2학년 청소당번</router-link></li>
            <li><router-link to="/cleaning">3학년 청소당번</router-link></li>
          </ul>
        </div>

        <router-link class="menu" to="/weekend_attendance">강의실 신청</router-link>
        <router-link class="menu" to="/profile">프로필</router-link>
      </nav>

      <div class="header-right">
        <button class="logout-btn" v-if="userStore.userInfo" @click="logout">로그아웃</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { postuserInfo } from '@/api/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()

const { logoutUser } = storeToRefs(userStore)

// v-if에서 router.path 대신 router.currentRoute.value.path를 사용해야 합니다.
// (setup 스크립트에서 router.path는 반응형이 아님)

async function logout() {
  try {
    await postuserInfo()
  } catch (err) {
    console.error('로그아웃 실패', err)
  }
  userStore.logoutUser()
  router.push('/login')
}
</script>

<style scoped>
/* ✅ 'Pretendard' 폰트가 프로젝트 전역에 설치되어 있어야 합니다.
  없다면, 이 폰트 설정을 제거하거나 다른 폰트로 변경하세요.
*/
.header {
  display: flex;
  justify-content: center; /* 내부 컨텐츠를 중앙 정렬 */
  align-items: center;
  padding: 0 2rem; /* 좌우 여백 */
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;

  /* ✅ 로그인 스타일: 그라데이션 배경 및 그림자 */
  background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  height: 80px; /* 헤더 높이 고정 */
}

/* ✅ 고정 폭 래퍼:
  화면이 줄어도 이 너비를 유지하며, 스크롤바를 생성합니다.
*/
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1440px; /* 고정 너비 */
  max-width: 1440px; /* 최대 너비 (필수) */
  height: 100%;
}

/* ===== 로고 ===== */
.logo-text {
  font-size: 2.2rem;
  font-weight: 800;
  text-decoration: none;
  color: white;

  /* ✅ 로그인 스타일: 'Montserrat' 폰트 및 텍스트 그림자 */
  font-family: 'Montserrat', sans-serif;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
.logo-text:hover {
  transform: scale(1.03);
}

/* ===== 네비게이션 ===== */
.navbar {
  display: flex;
  align-items: center;
  gap: 7rem; /* ✅ 간격 수정 (12rem -> 2.5rem) */
  height: 100%; /* 부모 높이(80px)를 꽉 채움 */
}

/* ✅ 로그인 스타일: 메뉴 아이템 (밑줄 -> 배경 호버) */
.menu,
.navbar > .nav-item > a {
  /* .nav-item 하위의 1단계 <a>도 동일하게 스타일 */
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  font-size: 1.1rem;
  text-decoration: none;
  color: white;
  font-weight: 600;
  position: relative;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.menu:hover,
.nav-item:hover > a {
  /* .nav-item에 호버 시 <a> 스타일 변경 */
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* 기존 ::after 밑줄 스타일 제거 */
.menu::after {
  display: none;
}

/* ===== 드롭다운 ===== */
.nav-item {
  position: relative;
  height: 100%; /* 부모 높이(80px)를 꽉 채움 */
}

.dropdown {
  position: absolute;
  top: 90%; /* 헤더 높이(80px) 바로 아래 (살짝 겹치게) */
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  list-style: none;
  margin: 0;
  white-space: nowrap;
  text-align: center;

  /* ✅ 로그인 스타일: 카드 디자인 */
  background: #fff;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 0.75rem 0; /* 상하 여백 */
  border: 1px solid #eee;

  /* 애니메이션 효과 */
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    visibility 0.25s;
}

.dropdown li a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  display: block;
  padding: 0.75rem 1.5rem; /* 좌우 여백 */
  transition: all 0.2s ease;
}

.dropdown li:hover {
  background-color: #f4f6ff;
}
.dropdown li:hover a {
  color: #3f2b96; /* 로그인 그라데이션의 진한 색 */
}

/* hover 시 부드럽게 표시 */
.nav-item:hover .dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* ===== 버튼 ===== */
.header-right {
  display: flex;
  align-items: center;
}

/* ✅ 로그인 스타일: 둥근 버튼 */
.logout-btn {
  background: white;
  color: #3f2b96; /* 로그인 그라데이션의 진한 색 */
  border: none;
  border-radius: 999px; /* 둥근 버튼 */
  padding: 0.7rem 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logout-btn:hover {
  background: #f4f6ff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>
