import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      items: [
        { code: '005930', name: '삼성전자', averagePrice: 70000, quantity: 100 },
        { code: '000660', name: 'SK하이닉스', averagePrice: 150000, quantity: 50 },
        { code: '035420', name: 'NAVER', averagePrice: 200000, quantity: 30 },
      ],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.code === item.code);
          if (existing) {
            const totalValue = (existing.averagePrice * existing.quantity) + (item.averagePrice * item.quantity);
            const totalQuantity = existing.quantity + item.quantity;
            return {
              items: state.items.map((i) =>
                i.code === item.code
                  ? { ...i, averagePrice: totalValue / totalQuantity, quantity: totalQuantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (code) => set((state) => ({ items: state.items.filter((i) => i.code !== code) })),
    }),
    {
      name: 'tidal-portfolio-storage',
    }
  )
);
