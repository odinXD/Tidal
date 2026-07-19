import { create } from 'zustand';
import { naverFinanceApi } from '../services/naverFinance';
import type { IndexInfo } from '../services/naverFinance';
import { globalApi } from '../services/globalApi';

interface MarketState {
  indices: {
    kospi: IndexInfo | null;
    kosdaq: IndexInfo | null;
  };
  exchangeRates: {
    usdKrw: number | null;
    change: number | null;
  };
  isLoading: boolean;
  error: string | null;
  fetchMarketData: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set) => ({
  indices: { kospi: null, kosdaq: null },
  exchangeRates: { usdKrw: null, change: null },
  isLoading: false,
  error: null,

  fetchMarketData: async () => {
    set({ isLoading: true, error: null });
    try {
      // 병렬로 데이터 호출
      const [kospiData, kosdaqData, ratesData] = await Promise.all([
        naverFinanceApi.getIndex('KOSPI').catch(() => null),
        naverFinanceApi.getIndex('KOSDAQ').catch(() => null),
        globalApi.getLatestRates().catch(() => null)
      ]);

      set({
        indices: {
          kospi: kospiData && kospiData.length > 0 ? kospiData[0] : null,
          kosdaq: kosdaqData && kosdaqData.length > 0 ? kosdaqData[0] : null,
        },
        exchangeRates: {
          usdKrw: ratesData ? ratesData.rates.KRW : null,
          change: null // Frankfurter API latest는 변동폭을 주지 않으므로 계산 로직 필요
        },
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Failed to fetch market data', isLoading: false });
    }
  }
}));
