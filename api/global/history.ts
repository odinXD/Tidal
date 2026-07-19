import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { startDate, endDate, from = 'USD', to = 'KRW' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const response = await axios.get(`https://api.frankfurter.app/${startDate}..${endDate}?from=${from}&to=${to}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch historical exchange rates' });
  }
}
