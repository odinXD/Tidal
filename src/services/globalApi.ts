import axios from 'axios';

// Yahoo Finance (비공식 엔드포인트) - CORS 문제가 발생할 수 있어 프록시를 통하는 것이 안전할 수 있음
// 여기서는 직접 호출을 시도하되, 막히면 프록시로 라우팅하는 방식을 사용
const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

export const globalApi = {
  // 최신 환율 정보 조회 (Frankfurter API proxy)
  getLatestRates: async (): Promise<any> => {
    try {
      const isProd = import.meta.env.PROD;
      const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
      const API_BASE = isProd ? '/api/global' : `${PROXY_URL}/api/global`;
      
      const response = await axios.get(`${API_BASE}/rates?from=USD&to=KRW,EUR,JPY`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch exchange rates', error);
      throw error;
    }
  },

  getMacroChart: async (symbol: string): Promise<any> => {
    try {
      const isProd = import.meta.env.PROD;
      const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
      const API_BASE = isProd ? '/api' : `${PROXY_URL}/api`;
      
      const response = await axios.get(`${API_BASE}/macro?symbol=${encodeURIComponent(symbol)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch macro chart for ${symbol}`, error);
      throw error;
    }
  },

  // 2. 환율 차트 히스토리
  getRatesHistory: async (startDate: string, endDate: string) => {
    try {
      const isProd = import.meta.env.PROD;
      const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
      const API_BASE = isProd ? '/api/global' : `${PROXY_URL}/api/global`;
      
      const response = await axios.get(`${API_BASE}/history`, {
        params: { startDate, endDate, from: 'USD', to: 'KRW' }
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
