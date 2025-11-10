import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  // 환경 변수를 기본 URL로 사용
  baseURL: import.meta.env.VITE_API_URL || "https://d3suqqci6r6g4n.cloudfront.net/api",
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

// 에러 발생 시 예외 alert로 출력
export function errorMsg(e) {
  let msg = "알 수 없는 오류가 발생했습니다.";
  if (e.response) {
    const status = e.response.status;
    if (status === 400) {
      msg = "요청이 잘못되었습니다. 입력값을 확인하세요.";
    } else if (status === 500) {
      msg = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  } else if (e.request) {
    msg = "서버에 연결할 수 없습니다. 네트워크 상태를 확인하세요.";
  }
  alert(msg);
}
