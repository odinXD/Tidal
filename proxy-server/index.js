const express = require('express');
const cors = require('cors');
const axios = require('axios');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. 네이버 금융 - 종목 기본 정보
app.get('/api/naver/stock/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const response = await axios.get(`https://m.stock.naver.com/api/stock/${code}/basic`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock basic info' });
  }
});

// 2. 네이버 금융 - 지수 정보
app.get('/api/naver/index/:index', async (req, res) => {
  try {
    const { index } = req.params; // KOSPI, KOSDAQ 등
    const response = await axios.get(`https://m.stock.naver.com/api/index/${index}/price?pageSize=1&page=1`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch index info' });
  }
});

// 3. 네이버 금융 - 차트 데이터 (OHLCV)
app.get('/api/naver/chart/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { startTime, endTime, timeframe } = req.query; // timeframe: day, week, month
    const url = `https://api.finance.naver.com/siseJson.naver?symbol=${code}&requestType=1&startTime=${startTime}&endTime=${endTime}&timeframe=${timeframe}`;
    
    // 네이버 차트 API는 EUC-KR로 응답할 수 있음
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const decoded = iconv.decode(response.data, 'euc-kr');
    
    // siseJson 응답 포맷을 정리: [['날짜', '시가', '고가', '저가', '종가', '거래량'], ...] -> JSON 객체 배열
    // 정규식으로 불필요한 공백과 문자를 제거하고 JSON으로 파싱
    let jsonStr = decoded.replace(/'/g, '"'); // 작은따옴표를 큰따옴표로 변경
    // 불필요한 개행문자나 탭 처리
    jsonStr = jsonStr.replace(/\n|\r|\t/g, '');
    
    // 단순 무식하게 파싱하기 보다는 구조를 맞춤
    const match = jsonStr.match(/\[\[.*?\]\]/);
    if (match) {
      const dataArray = JSON.parse(match[0]);
      // 첫 번째 항목은 헤더
      const parsedData = dataArray.slice(1).map(row => ({
        date: row[0],
        open: parseFloat(row[1]),
        high: parseFloat(row[2]),
        low: parseFloat(row[3]),
        close: parseFloat(row[4]),
        volume: parseFloat(row[5])
      }));
      res.json(parsedData);
    } else {
      res.status(500).json({ error: 'Failed to parse chart data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// 4. 네이버 증권 리서치 - 리포트 크롤링
app.get('/api/naver/research', async (req, res) => {
  try {
    const url = 'https://finance.naver.com/research/company_list.naver';
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const decoded = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(decoded);
    
    const reports = [];
    $('.type_1 tbody tr').each((i, el) => {
      // 빈 tr 처리
      if ($(el).find('td').length <= 1) return;
      
      const stockName = $(el).find('td:nth-child(1)').text().trim();
      const title = $(el).find('td:nth-child(2) a').text().trim();
      const link = $(el).find('td:nth-child(2) a').attr('href');
      const broker = $(el).find('td:nth-child(3)').text().trim();
      // file link omitted for simplicity
      const date = $(el).find('td:nth-child(5)').text().trim();
      
      reports.push({
        stockName,
        title,
        link: link ? `https://finance.naver.com${link}` : '',
        broker,
        date
      });
    });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch research reports' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
