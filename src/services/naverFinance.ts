import axios from 'axios';

// Vite 빌드 환경 분기: Vercel 배포 시에는 동일 도메인의 /api/naver를 사용
const isProd = import.meta.env.PROD;
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
const API_BASE = isProd ? '/api/naver' : `${PROXY_URL}/api/naver`;

export interface StockBasicInfo {
  stockName: string;
  closePrice: string;
  compareToPreviousClosePrice: string;
  fluctuationsRatio: string;
  marketValue?: string;
  itemCode: string;
}

export interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndexInfo {
  closePrice: string;
  compareToPreviousClosePrice: string;
  fluctuationsRatio: string;
}

export const naverFinanceApi = {
  // 1. 종목 기본 정보 조회
  getStockBasic: async (code: string): Promise<StockBasicInfo> => {
    try {
      const response = await axios.get(`${API_BASE}/stock/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch basic info for ${code}`, error);
      throw error;
    }
  },

  // 2. 지수 정보 조회
  getIndex: async (indexCode: string = 'KOSPI'): Promise<IndexInfo[]> => {
    try {
      const response = await axios.get(`${API_BASE}/index/${indexCode}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch index info for ${indexCode}`, error);
      throw error;
    }
  },

  // 3. 차트 데이터 (OHLCV) 조회
  getChartData: async (code: string, timeframe: 'day' | 'week' | 'month', startTime: string, endTime: string): Promise<ChartData[]> => {
    try {
      const response = await axios.get(`${API_BASE}/chart/${code}`, {
        params: { timeframe, startTime, endTime }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch chart data for ${code}`, error);
      throw error;
    }
  },
  
  // 4. 증권사 리포트 목록 조회
  getResearchReports: async () => {
    try {
      const response = await axios.get(`${API_BASE}/research`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch research reports`, error);
      throw error;
    }
  },

  // 5. 실시간 특징주 (시가총액 상위)
  getTopStocks: async (): Promise<StockBasicInfo[]> => {
    try {
      const response = await axios.get(`${API_BASE}/top`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch top stocks`, error);
      throw error;
    }
  },

  // 6. 메인 뉴스 가져오기
  getMainNews: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE}/news`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch main news`, error);
      throw error;
    }
  }
};
