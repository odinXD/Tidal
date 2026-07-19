import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await axios.get('https://m.stock.naver.com/api/stocks/marketValue/KOSPI?page=1&pageSize=10');
    // 필요한 데이터만 정제
    const stocks = response.data.stocks.map((s: any) => ({
      itemCode: s.itemCode,
      stockName: s.stockName,
      closePrice: s.closePrice,
      compareToPreviousClosePrice: s.compareToPreviousClosePrice,
      fluctuationsRatio: s.fluctuationsRatio,
    }));
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch top stocks' });
  }
}
