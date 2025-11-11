import {ref} from 'vue'

// 배열은 받고 그 중의 시작 시간과 종료시간 찾기
export function lengthHour(arr) {
  const len = arr.length
  console.log("time", len);

  const startTime = ref();
  const endTime = ref
  if (arr[0].hour > arr[len - 1].hour) {
    startTime.value = arr[len - 1].hour
    endTime.value = arr[0].hour
  } else {
    startTime.value = arr[0].hour
    endTime.value = arr[len - 1].hour
  }

  return [startTime.value, endTime.value];
}
