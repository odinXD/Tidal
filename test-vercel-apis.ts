import chartHandler from './api/naver/chart/[code].ts';
import indexHandler from './api/naver/index/[index].ts';
import stockHandler from './api/naver/stock/[code].ts';
import exchangeHandler from './api/exchange.ts';
import topHandler from './api/naver/top.ts';
import newsHandler from './api/naver/news.ts';
import stockNewsHandler from './api/naver/stock-news.ts';
import macroHandler from './api/macro.ts';

function createMockReqRes(query: any) {
  const req = { query };
  let resolve: any;
  const promise = new Promise<any>(r => resolve = r);
  
  const res = {
    statusVal: 200,
    status(code: number) { this.statusVal = code; return this; },
    json(data: any) { resolve({ status: this.statusVal, data }); },
    send(data: any) { resolve({ status: this.statusVal, data }); }
  };
  return { req, res, promise };
}

async function runTests() {
  console.log("=== Testing API: Chart (with empty dates) ===");
  let { req, res, promise } = createMockReqRes({ code: '005930', startTime: '', endTime: '', timeframe: 'day' });
  await chartHandler(req as any, res as any);
  let result = await promise;
  console.log(`Status: ${result.status}, Data is Array? ${Array.isArray(result.data)}, Length: ${result.data?.length}`);
  if (result.status !== 200 || !Array.isArray(result.data) || result.data.length === 0) {
    throw new Error("Chart API failed");
  }
  
  console.log("\n=== Testing API: Index (KOSPI) ===");
  ({ req, res, promise } = createMockReqRes({ index: 'KOSPI' }));
  await indexHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, KOSPI Close: ${result.data?.[0]?.closePrice}`);
  if (result.status !== 200 || !result.data?.[0]?.closePrice) {
    throw new Error("Index API failed");
  }

  console.log("\n=== Testing API: Stock (005930) ===");
  ({ req, res, promise } = createMockReqRes({ code: '005930' }));
  await stockHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, Stock Name: ${result.data?.stockName}`);
  if (result.status !== 200 || !result.data?.stockName) {
    throw new Error("Stock API failed");
  }

  console.log("\n=== Testing API: Exchange (USD to KRW,EUR,JPY) ===");
  ({ req, res, promise } = createMockReqRes({ from: 'USD', to: 'KRW,EUR,JPY' }));
  await exchangeHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, Rates:`, result.data?.rates);
  if (result.status !== 200 || !result.data?.rates?.KRW) {
    throw new Error("Exchange API failed");
  }

  console.log("\n=== Testing API: Top Stocks ===");
  ({ req, res, promise } = createMockReqRes({}));
  await topHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, Top Stocks Keys: ${Object.keys(result.data || {})}`);
  if (result.status !== 200 || !result.data?.marketCap || !Array.isArray(result.data.marketCap)) {
    throw new Error("Top Stocks API failed");
  }

  console.log("\n=== Testing API: Macro (^TNX) ===");
  ({ req, res, promise } = createMockReqRes({ symbol: '^TNX' }));
  await macroHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, Macro Data Length: ${result.data?.length}`);
  if (result.status !== 200 || !Array.isArray(result.data) || result.data.length === 0) {
    throw new Error("Macro API failed");
  }

  console.log("\n=== Testing API: News ===");
  ({ req, res, promise } = createMockReqRes({}));
  await newsHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, News Length: ${result.data?.length}`);
  if (result.status !== 200 || !Array.isArray(result.data) || result.data.length === 0) {
    throw new Error("News API failed");
  }

  console.log("\n=== Testing API: Stock News (005930) ===");
  ({ req, res, promise } = createMockReqRes({ code: '005930' }));
  await stockNewsHandler(req as any, res as any);
  result = await promise;
  console.log(`Status: ${result.status}, Stock News Length: ${result.data?.length}`);
  if (result.status !== 200 || !Array.isArray(result.data) || result.data.length === 0) {
    throw new Error("Stock News API failed");
  }

  console.log("\n✅ ALL VERCEL APIS VERIFIED AND WORKING PROPERLY!");
}

runTests().catch(e => {
  console.error("Test failed:", e);
  process.exit(1);
});
