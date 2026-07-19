import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { from, to } = req.query;
    const response = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
}
