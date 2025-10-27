import api from './apiClient.js';
import { errorMsg } from './apiClient.js';

// 청소 당번 조회 API
export const fetchCleaningRoster = async (cleaningData) => {
  try {
    const res = await api.get('/cleaning-rosters/', {
      params: cleaningData,
    });

    return res.data;
  } catch (e) {
    errorMsg(e);
  }
}

// 청소 당번 등록 API
export const craeteCleaningRoster = async (cleaningData) => {
  try {
    return await api.post('/cleaning-rosters/generate', cleaningData)
  } catch (e) {
    errorMsg(e);
  }
}

// 해당 섹션 청소 당번 삭제 API
export const deleteCleaningRoster = async (cleaningData) => {
  try {
    const res = await api.delete('/cleaning-rosters/', {
      params: cleaningData,
    })

    return res.data;
  } catch (e) {
    errorMsg(e)
  }
}

