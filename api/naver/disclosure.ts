import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { page = 1 } = req.query;
    const url = `https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258&page=${page}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const html = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(html);

    const disclosures: any[] = [];
    $('.newsList li').each((_, el) => {
      const aTag = $(el).find('dt.articleSubject a, dd.articleSubject a').first();
      const title = aTag.attr('title') || aTag.text().trim();
      let link = aTag.attr('href') || '';
      if (link.startsWith('/')) {
        link = 'https://finance.naver.com' + link;
      }
      
      const summary = $(el).find('dd.articleSummary').contents().first().text().trim();
      const press = $(el).find('dd.articleSummary .press').text().trim();
      const date = $(el).find('dd.articleSummary .wdate').text().trim();

      if (title && link) {
        disclosures.push({ title, link, summary, press, date });
      }
    });

    res.status(200).json(disclosures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch disclosures' });
  }
}
