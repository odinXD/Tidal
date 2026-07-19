import axios from 'axios';

// Vite 빌드 환경 분기: Vercel 배포 시에는 동일 도메인의 /api/naver를 사용
const isProd = import.meta.env.PROD;
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
const API_BASE = isProd ? '/api/naver' : `${PROXY_URL}/api/naver`;

export interface StockBasicInfo {
  code?: string;
  stockName: string;
  closePrice: string;
  compareToPreviousClosePrice: string;
  fluctuationsRatio: string;
  marketValue?: string;
  // 추가 재무 정보 (integration endpoint 기준)
  per?: string;
  eps?: string;
  pbr?: string;
  bps?: string;
  dividendYield?: string;
  // 외국인/기관 수급
  dealTrends?: any[];
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
  // 1. 종목 기본 및 재무/수급 정보 가져오기 (integration 연동)
  getStockBasic: async (code: string): Promise<StockBasicInfo> => {
    try {
      const response = await axios.get(`${API_BASE}/stock/${code}`);
      const data = response.data;
      
      const basic = data.basicInfo || data;
      const keyIndicators = data.keyIndicators || [];
      const dealTrends = data.dealTrendInfos || [];
      
      const getValue = (k: string) => keyIndicators.find((i: any) => i.code === k)?.value;

      return {
        code: basic.itemCode,
        stockName: basic.stockName,
        closePrice: basic.closePrice,
        compareToPreviousClosePrice: basic.compareToPreviousClosePrice,
        fluctuationsRatio: basic.fluctuationsRatio,
        marketValue: getValue('marketValue') || basic.marketValue,
        per: getValue('per'),
        eps: getValue('eps'),
        pbr: getValue('pbr'),
        bps: getValue('bps'),
        dividendYield: getValue('dividendYieldRatio'),
        dealTrends: dealTrends
      };
    } catch (error) {
      console.error(`Failed to fetch stock basic info for ${code}`, error);
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

  // 5. 실시간 특징주 (시가총액 상위, 상승률 상위, 하락률 상위)
  getTopStocks: async (): Promise<{ marketCap: StockBasicInfo[], gainers: StockBasicInfo[], losers: StockBasicInfo[] }> => {
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
  },

  // 7. 특정 종목 뉴스 가져오기
  getStockNews: async (code: string): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE}/stock-news?code=${code}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch stock news for ${code}`, error);
      throw error;
    }
  },

  // 8. 테마 리스트 가져오기
  getThemes: async (): Promise<{name: string, ratio: string, desc: string}[]> => {
    try {
      const response = await axios.get(`${API_BASE}/themes`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch themes`, error);
      throw error;
    }
  },

  // 9. 글로벌 뉴스(전체 시장 뉴스) 가져오기
  getGlobalNews: async (page = 1, category = 'mainnews'): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE}/news?page=${page}&category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch global news`, error);
      throw error;
    }
  },

  // 10. 공시 목록 가져오기
  getDisclosures: async (page = 1): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE}/disclosure?page=${page}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch disclosures`, error);
      throw error;
    }
  }
};
