import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { category = 'mainnews', page = 1, pageSize = 20 } = req.query;
    const url = `https://m.stock.naver.com/api/news/list?category=${category}&pageSize=${pageSize}&page=${page}`;
    const response = await axios.get(url);
    
    const newsList = response.data.map((item: any) => ({
      title: item.tit,
      link: `https://m.stock.naver.com/investment/news/article/${item.oid}/${item.aid}`,
      summary: item.subcontent,
      press: item.ohnm,
      date: item.dt.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5'),
      thumbUrl: item.thumbUrl
    }));

    res.status(200).json(newsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
