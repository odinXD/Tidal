import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CandleChart from '../components/charts/CandleChart';
import { naverFinanceApi } from '../services/naverFinance';
import type { StockBasicInfo, ChartData } from '../services/naverFinance';
import { STOCK_DICTIONARY } from '../utils/stockDictionary';
import { usePriceTick } from '../hooks/usePriceTick';
import OrderBook from '../components/market/OrderBook';
import styles from './MarketPage.module.css';

export default function StockDetailPage() {
  const { code } = useParams<{ code: string }>();
  const [basicInfo, setBasicInfo] = useState<StockBasicInfo | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const tickClass = usePriceTick(basicInfo?.closePrice);

  useEffect(() => {
    if (!code) return;
    
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [basic, chart, newsData] = await Promise.all([
          naverFinanceApi.getStockBasic(code),
          naverFinanceApi.getChartData(code, timeframe, '', ''),
          naverFinanceApi.getStockNews(code)
        ]);
        setBasicInfo(basic);
        setChartData(chart);
        setNews(newsData);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [code]);

  useEffect(() => {
    if (!code || loading) return;
    const fetchChartOnly = async () => {
      setChartLoading(true);
      try {
        const chart = await naverFinanceApi.getChartData(code, timeframe, '', '');
        setChartData(chart);
      } catch (err) {
        console.error('Failed to change timeframe', err);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartOnly();
  }, [timeframe]);

  const stockName = basicInfo?.stockName || STOCK_DICTIONARY.find(s => s.code === code)?.name || code;

  const formatPrice = (val?: string) => {
    if (!val) return '0';
    return parseInt(val.replace(/,/g, '')).toLocaleString();
  };

  const getChangeClass = (val?: string) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (num > 0) return 'text-up';
    if (num < 0) return 'text-down';
    return '';
  };

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={22} minSize={20} className={styles.panel}>
          <PanelGroup orientation="vertical">
            <Panel defaultSize={35} minSize={25} className={styles.panelContent} style={{ padding: '16px' }}>
              <div className={styles.panelHeader} style={{ padding: 0, marginBottom: 12, border: 'none' }}>종목 정보 ({code})</div>
              {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>로딩중...</div>
              ) : error ? (
                <div style={{ color: 'var(--color-danger)' }}>{error}</div>
              ) : (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <h2 style={{ color: 'var(--color-accent)', margin: '0 0 8px 0' }}>{stockName}</h2>
                    <div className={tickClass} style={{ display: 'inline-block', fontSize: 24, fontWeight: 'bold' }}>{formatPrice(basicInfo?.closePrice)}</div>
                    <div className={getChangeClass(basicInfo?.fluctuationsRatio)}>
                      {parseFloat(basicInfo?.compareToPreviousClosePrice || '0') > 0 ? '+' : ''}{basicInfo?.compareToPreviousClosePrice} ({basicInfo?.fluctuationsRatio}%)
                    </div>
                  </div>
                  
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>시가총액</span>
                      <span style={{ color: 'var(--text-primary)' }}>{basicInfo?.marketValue}억</span>
                    </div>
                  </div>
                </>
              )}
            </Panel>
            <PanelResizeHandle className={styles.resizeHandle} />
            <Panel defaultSize={65} minSize={30} className={styles.panelContent} style={{ padding: 0 }}>
              <OrderBook currentPrice={basicInfo?.closePrice} />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={55} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>상세 차트</div>
          <div className={styles.panelContent} style={{ padding: 0 }}>
            <div style={{ display: 'flex', gap: 16, padding: '8px 12px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as 'day'|'week'|'month')}
                style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '4px 8px' }}
              >
                <option value="day">일봉</option>
                <option value="week">주봉</option>
                <option value="month">월봉</option>
              </select>
            </div>
            <div style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
              {(loading || chartLoading) && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
                  차트 불러오는 중...
                </div>
              )}
              {!(loading || chartLoading) && chartData.length > 0 && <CandleChart data={chartData} />}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>종목 뉴스</div>
          <div className={styles.panelContent} style={{ overflowY: 'auto' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', padding: '12px' }}>뉴스 불러오는 중...</div>
            ) : news.length > 0 ? (
              <div style={{ padding: '0 12px' }}>
                {news.map((item, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--bg-base)' }}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                      <h4 style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.4 }}>{item.title}</h4>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.press} · {item.date}</div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', padding: '12px' }}>관련 뉴스가 없습니다.</div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
