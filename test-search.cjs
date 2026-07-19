const axios = require('axios');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

async function test() {
  const keyword = encodeURIComponent('삼성전자');
  const res = await axios.get(`https://finance.naver.com/search/searchList.naver?query=${keyword}`, { responseType: 'arraybuffer' });
  const html = iconv.decode(res.data, 'euc-kr');
  const $ = cheerio.load(html);
  const results = [];
  $('.tbl_search tbody tr').each((i, el) => {
    const a = $(el).find('.tit a');
    if (a.length) {
      const href = a.attr('href');
      const code = href.split('code=')[1];
      const name = a.text().trim();
      results.push({ name, code });
    }
  });
  console.log(results);
}
test();
