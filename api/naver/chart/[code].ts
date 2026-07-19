import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import iconv from 'iconv-lite';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code, timeframe = 'day' } = req.query;
    let { startTime, endTime } = req.query;
    
    // 기본값 설정: 최근 1년 데이터
    if (!startTime || !endTime) {
      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      
      const formatDate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
      };
      
      if (!startTime) startTime = formatDate(start);
      if (!endTime) endTime = formatDate(end);
    }

    const url = `https://api.finance.naver.com/siseJson.naver?symbol=${code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=${timeframe}`;
    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const decoded = iconv.decode(response.data, 'euc-kr');
    
    let jsonStr = decoded.replace(/'/g, '"');
    jsonStr = jsonStr.replace(/\n|\r|\t/g, '');
    
    const match = jsonStr.match(/\[\[.*?\]\]/);
    if (match) {
      const dataArray = JSON.parse(match[0]);
      const parsedData = dataArray.slice(1).map((row: any) => ({
        date: row[0],
        open: parseFloat(row[1]),
        high: parseFloat(row[2]),
        low: parseFloat(row[3]),
        close: parseFloat(row[4]),
        volume: parseFloat(row[5])
      }));
      res.status(200).json(parsedData);
    } else {
      res.status(500).json({ error: 'Failed to parse chart data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
}
