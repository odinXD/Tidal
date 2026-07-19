import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import iconv from 'iconv-lite';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = 'https://finance.naver.com/research/company_list.naver';
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const decoded = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(decoded);
    
    const reports: any[] = [];
    $('.type_1 tbody tr').each((i, el) => {
      if ($(el).find('td').length <= 1) return;
      
      const stockName = $(el).find('td:nth-child(1)').text().trim();
      const title = $(el).find('td:nth-child(2) a').text().trim();
      const link = $(el).find('td:nth-child(2) a').attr('href');
      const broker = $(el).find('td:nth-child(3)').text().trim();
      const date = $(el).find('td:nth-child(5)').text().trim();
      
      reports.push({
        stockName,
        title,
        link: link ? `https://finance.naver.com${link}` : '',
        broker,
        date
      });
    });
    
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch research reports' });
  }
}
