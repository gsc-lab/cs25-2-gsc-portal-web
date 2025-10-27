import api from "./apiClient"
import { errorMsg } from './apiClient.js'

// 해당 학기 조회 API
export async function getSection() {
    try {
        const res = await api.get('/modal/common/sections')
        return res.data
    } catch (error) {
        errorMsg(error)
    }
}

// 강의실 목록 조회 API
export async function getClassroom() {
    try {
        const res = await api.get('/modal/common/classrooms')
        return res.data
    } catch (error) {
        errorMsg(error);
    }
}

// // 학년 조회 API
// export function getStudentByGrade() {
//     try {
//         const res = api.get('/')
//         return res.data
//     } catch (error) {
//         errorMsg(error);
//     }
// }