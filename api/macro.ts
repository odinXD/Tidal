import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { symbol } = req.query; // e.g., ^TNX, GC=F, CL=F
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(String(symbol))}?interval=1d&range=1mo`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const result = response.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    const parsedData = timestamps.map((t: number, index: number) => {
      const date = new Date(t * 1000);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      
      return {
        date: `${y}${m}${d}`,
        open: quotes.open[index] || 0,
        high: quotes.high[index] || 0,
        low: quotes.low[index] || 0,
        close: quotes.close[index] || 0,
        volume: quotes.volume[index] || 0
      };
    }).filter((d: any) => d.close > 0);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch macro data' });
  }
}
