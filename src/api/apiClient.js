import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default api;


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
