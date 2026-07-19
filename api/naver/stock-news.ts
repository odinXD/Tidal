import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Stock code is required' });
    }

    const url = `https://m.stock.naver.com/api/news/stock/${code}?pageSize=20&page=1`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Parse Naver mobile stock news JSON structure
    const newsList: any[] = [];
    if (Array.isArray(response.data)) {
      response.data.forEach((group: any) => {
        if (group.items && Array.isArray(group.items)) {
          group.items.forEach((item: any) => {
            newsList.push({
              title: item.title,
              link: item.mobileNewsUrl || `https://n.news.naver.com/mnews/article/${item.officeId}/${item.articleId}`,
              summary: item.body,
              press: item.officeName,
              date: item.datetime // usually YYYYMMDDHHMM
            });
          });
        }
      });
    }

    res.status(200).json(newsList);
  } catch (error) {
    console.error('Stock news fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stock news' });
  }
}
