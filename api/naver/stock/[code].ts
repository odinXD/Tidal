import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code } = req.query;
    const response = await axios.get(`https://m.stock.naver.com/api/stock/${code}/integration`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock basic info' });
  }
}
