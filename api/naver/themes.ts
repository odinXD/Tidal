import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await axios.get('https://finance.naver.com/sise/theme.naver', { responseType: 'arraybuffer' });
    const html = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(html);
    
    const themes: any[] = [];
    $('.type_1 tbody tr').each((_, el) => {
      const tds = $(el).find('td');
      if (tds.length > 2) {
        const name = $(tds[0]).text().trim();
        const ratio = $(tds[1]).text().trim();
        const desc = $(tds[2]).text().trim();
        if (name && ratio) {
          themes.push({ name, ratio, desc });
        }
      }
    });

    res.status(200).json(themes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
}
