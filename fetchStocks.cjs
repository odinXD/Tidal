const fetch = require('node-fetch');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const fs = require('fs');

async function main() {
  const res = await fetch('https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13');
  const buffer = await res.arrayBuffer();
  const html = iconv.decode(Buffer.from(buffer), 'euc-kr');
  const $ = cheerio.load(html);
  
  const stocks = [];
  $('tr').each((i, el) => {
    const tds = $(el).find('td');
    if (tds.length > 1) {
      stocks.push({
        name: $(tds[0]).text().trim(),
        code: $(tds[1]).text().trim()
      });
    }
  });
  
  console.log(`Found ${stocks.length} stocks.`);
  const dictContent = `export interface StockItem {
  code: string;
  name: string;
}

export const STOCK_DICTIONARY: StockItem[] = ${JSON.stringify(stocks, null, 2)};

export function searchStocks(query: string): StockItem[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return STOCK_DICTIONARY.filter(
    (stock) =>
      stock.name.toLowerCase().includes(lowerQuery) ||
      stock.code.includes(lowerQuery)
  ).slice(0, 10);
}
`;
  
  fs.writeFileSync('./src/utils/stockDictionary.ts', dictContent, 'utf-8');
  console.log('Saved to src/utils/stockDictionary.ts');
}

main();
