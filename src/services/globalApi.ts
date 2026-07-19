import axios from 'axios';

// Frankfurter API는 키 없이 무료로 사용 가능한 환율 API
const FRANKFURTER_BASE = 'https://api.frankfurter.app';

// Yahoo Finance (비공식 엔드포인트) - CORS 문제가 발생할 수 있어 프록시를 통하는 것이 안전할 수 있음
// 여기서는 직접 호출을 시도하되, 막히면 프록시로 라우팅하는 방식을 사용
const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

export const globalApi = {
  // 1. 최신 환율 (기준: USD -> KRW, EUR, JPY)
  getLatestRates: async () => {
    try {
      const response = await axios.get(`${FRANKFURTER_BASE}/latest`, {
        params: { from: 'USD', to: 'KRW,EUR,JPY' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch latest exchange rates', error);
      throw error;
    }
  },

  // 2. 환율 차트 히스토리
  getRatesHistory: async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get(`${FRANKFURTER_BASE}/${startDate}..${endDate}`, {
        params: { from: 'USD', to: 'KRW' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch historical exchange rates', error);
      throw error;
    }
  },

  // 3. 글로벌 지수 / 원자재 차트 (Yahoo Finance)
  getYahooChart: async (ticker: string, range: string = '1mo', interval: string = '1d') => {
    try {
      // CORS 문제가 발생하면 프록시 서버를 경유하도록 수정해야 할 수 있습니다.
      const response = await axios.get(`${YAHOO_BASE}/${ticker}`, {
        params: { range, interval }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Yahoo chart for ${ticker}`, error);
      throw error;
    }
  }
};
