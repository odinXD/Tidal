import { create } from 'zustand';

export interface PortfolioItem {
  code: string;
  name: string;
  averagePrice: number;
  quantity: number;
}

interface PortfolioState {
  items: PortfolioItem[];
  addItem: (item: PortfolioItem) => void;
  removeItem: (code: string) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  items: [
    { code: '005930', name: '삼성전자', averagePrice: 70000, quantity: 100 },
    { code: '000660', name: 'SK하이닉스', averagePrice: 150000, quantity: 50 },
    { code: '035420', name: 'NAVER', averagePrice: 200000, quantity: 30 },
  ],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (code) => set((state) => ({ items: state.items.filter((i) => i.code !== code) })),
}));
