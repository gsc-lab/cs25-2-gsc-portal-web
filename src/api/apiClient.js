import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

export default api

// 에러 발생 시 예외 alert로 출력
export function errorMsg(e) {
  let msg = '알 수 없는 오류가 발생했습니다.'

  // 1. 서버가 응답을 줬으나, 2xx 범위가 아닌 경우 (500 에러 등)
  if (e.response) {
    const status = e.response.status
    if (status === 400) {
      msg = '요청이 잘못되었습니다. 입력값을 확인하세요.'
    } else if (status === 500) {
      // 500 에러인데 데이터가 깨져서 올 경우 response.data가 비어있을 수 있음
      msg = e.response.data.message ?? '서버 내부 오류입니다. (백엔드 로그 확인 필요)'
    } else if (status === 401) {
      msg = '로그인이 필요하거나 세션이 만료되었습니다.'
    }
  }
  // 2. 요청은 갔으나 응답을 받지 못한 경우 (네트워크 끊김, CORS, TIME_OUT)
  else if (e.request) {
    // e.code가 ERR_NETWORK 인 경우 포함
    console.error('Network Error Detail:', e) // 개발자용 로그
    msg = '서버와 통신할 수 없습니다. 네트워크 연결이나 서버 상태를 확인하세요.'
  }
  // 3. 요청 설정 중에 에러가 발생한 경우
  else {
    msg = `요청 설정 오류: ${e.message}`
  }

  alert(msg)
}
