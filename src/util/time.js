export function time(t){
  if (t < 10) return `0${t}:00:00`
  return `${t}:00:00`
}
