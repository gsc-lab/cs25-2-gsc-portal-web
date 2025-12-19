export function day(enDay) {
  if (enDay == 'MON') return '월요일'
  else if (enDay == 'TUE') return '화요일'
  else if (enDay == 'WED') return '수요일'
  else if (enDay == 'THU') return '목요일'
  else return '금요일'
}

export function setTarget(getTarget) {
  if (getTarget == '1') return '1학년'
  else if (getTarget == '2') return '2학년'
  else if (getTarget == '3') return '3학년'
  else if (getTarget == 'special') return '특강'
  else if (getTarget == 'korean') return '한국어'
  else return '없음'
}
