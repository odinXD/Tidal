export interface StockItem {
  name: string;
  code: string;
}

export const STOCK_DICTIONARY: StockItem[] = [
  { name: '삼성전자', code: '005930' },
  { name: 'SK하이닉스', code: '000660' },
  { name: 'LG에너지솔루션', code: '373220' },
  { name: '삼성바이오로직스', code: '207940' },
  { name: '현대차', code: '005380' },
  { name: '기아', code: '000270' },
  { name: '셀트리온', code: '068270' },
  { name: 'POSCO홀딩스', code: '005490' },
  { name: 'KB금융', code: '105560' },
  { name: 'NAVER', code: '035420' },
  { name: '신한지주', code: '055550' },
  { name: 'LG화학', code: '051910' },
  { name: '삼성SDI', code: '006400' },
  { name: '카카오', code: '035720' },
  { name: '현대모비스', code: '012330' },
  { name: '하나금융지주', code: '086790' },
  { name: '삼성물산', code: '028260' },
  { name: 'LG전자', code: '066570' },
  { name: '메리츠금융지주', code: '138040' },
  { name: 'SK', code: '034730' },
  { name: '한국전력', code: '015760' },
  { name: 'HMM', code: '011200' },
  { name: '크래프톤', code: '259960' },
  { name: '우리금융지주', code: '316140' },
  { name: '삼성생명', code: '032830' },
  { name: '포스코퓨처엠', code: '003670' },
  { name: '에코프로비엠', code: '247540' },
  { name: '에코프로', code: '086520' },
  { name: '알테오젠', code: '196170' },
  { name: 'HLB', code: '028300' },
  { name: '엔켐', code: '348370' },
  { name: '리노공업', code: '058470' },
  { name: 'HPSP', code: '403870' },
  { name: '클래시스', code: '214150' },
  { name: '레인보우로보틱스', code: '277810' }
];

export const searchStocks = (query: string): StockItem[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return STOCK_DICTIONARY.filter(
    (stock) => stock.name.toLowerCase().includes(lowerQuery) || stock.code.includes(lowerQuery)
  );
};
