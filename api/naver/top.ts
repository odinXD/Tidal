import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const fetchList = async (url: string) => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const html = iconv.decode(response.data, 'euc-kr');
      const $ = cheerio.load(html);
      
      const list: any[] = [];
      $('.type_2 tbody tr').each((_, el) => {
        if ($(el).find('td').length > 5) {
          const aTag = $(el).find('a.tltle');
          const name = aTag.text().trim();
          if (!name) return;
          
          const codeMatch = aTag.attr('href')?.match(/code=(\d+)/);
          const code = codeMatch ? codeMatch[1] : '';
          
          const tds = $(el).find('td');
          // For sise_market_sum, td index: 1 is name, 2 is price, 3 is diff, 4 is ratio
          // For sise_rise/fall, td index: 1 is name, 2 is price, 3 is diff, 4 is ratio
          let priceStr = '', diffStr = '', ratioStr = '';
          
          if (url.includes('sise_market_sum')) {
            priceStr = $(tds[2]).text().trim();
            diffStr = $(tds[3]).text().trim();
            ratioStr = $(tds[4]).text().trim();
          } else {
            priceStr = $(tds[2]).text().trim();
            diffStr = $(tds[3]).text().trim();
            ratioStr = $(tds[4]).text().trim();
          }

          list.push({
            code,
            stockName: name,
            closePrice: priceStr,
            compareToPreviousClosePrice: diffStr,
            fluctuationsRatio: ratioStr.replace('%', '').trim()
          });
        }
      });
      return list.slice(0, 10);
    };

    const [marketCap, gainers, losers] = await Promise.all([
      fetchList('https://finance.naver.com/sise/sise_market_sum.naver'),
      fetchList('https://finance.naver.com/sise/sise_rise.naver'),
      fetchList('https://finance.naver.com/sise/sise_fall.naver')
    ]);

    res.status(200).json({ marketCap, gainers, losers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch ranking stocks' });
  }
}
