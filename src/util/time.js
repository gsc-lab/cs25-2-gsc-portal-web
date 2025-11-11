export function time(t){
  if (t < 10) return `0${t}:00:00`
  return `${t}:00:00`
}

// 해당 주의 날짜 배열 반환
export function getWeekDates(baseDate) {
  const date = new Date(baseDate)
  const day = date.getDay() // 0:일 ~ 6:토

  // 월요일 기준으로 맞추기
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))

  // 월요일부터 일요일까지 날짜 생성
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })

  return week
}
