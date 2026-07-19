import axios from 'axios';

const getEcosApiKey = () => localStorage.getItem('ECOS_API_KEY') || import.meta.env.VITE_ECOS_API_KEY || 'sample';

const API_BASE = 'https://ecos.bok.or.kr/api';

export const ecosApi = {
  // 1. 통계 조회
  getStatisticSearch: async (
    statCode: string, 
    cycle: string, 
    startDate: string, 
    endDate: string,
    itemCode1: string = '?'
  ) => {
    const key = getEcosApiKey();
    if (!key) throw new Error('ECOS API Key is missing');

    try {
      // URL format: /StatisticSearch/{API_KEY}/json/kr/1/100/{statCode}/{cycle}/{startDate}/{endDate}/{itemCode1}
      const url = `${API_BASE}/StatisticSearch/${key}/json/kr/1/100/${statCode}/${cycle}/${startDate}/${endDate}/${itemCode1}`;
      const response = await axios.get(url);
      
      // ECOS API 에러 처리 (API 성공 200이라도 내부 결과에 에러 코드가 있을 수 있음)
      if (response.data.RESULT && response.data.RESULT.CODE.startsWith('E')) {
        throw new Error(response.data.RESULT.MESSAGE);
      }
      
      return response.data.StatisticSearch;
    } catch (error) {
      console.error(`Failed to fetch ECOS statistic ${statCode}`, error);
      throw error;
    }
  },

  // 한국은행 기준금리 간편 조회 (코드: 722Y001, 월간)
  getBaseRate: async (startDate: string, endDate: string) => {
    return ecosApi.getStatisticSearch('722Y001', 'M', startDate, endDate, '0101000');
  },

  // 원/달러 환율 종가 간편 조회 (코드: 731Y001, 일간)
  getUsdKrwRate: async (startDate: string, endDate: string) => {
    return ecosApi.getStatisticSearch('731Y001', 'D', startDate, endDate, '0000001');
  }
};
