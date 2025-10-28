import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  // 환경 변수를 기본 URL로 사용
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  // 보내는 데이터 형식 지정
  headers: {
    "Content-Type": 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config
})

export default apiClient;
