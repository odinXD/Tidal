import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = 'https://finance.naver.com/news/mainnews.naver';
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const html = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(html);

    const newsList: any[] = [];
    $('.mainNewsList li').each((_, el) => {
      const aTag = $(el).find('.articleSubject a');
      const title = aTag.text().trim();
      const link = 'https://finance.naver.com' + aTag.attr('href');
      const summary = $(el).find('.articleSummary').contents().first().text().trim();
      const press = $(el).find('.press').text().trim();
      const date = $(el).find('.wdate').text().trim();

      if (title) {
        newsList.push({ title, link, summary, press, date });
      }
    });

    res.status(200).json(newsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
