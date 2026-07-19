import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CandleChart from '../components/charts/CandleChart';
import { naverFinanceApi } from '../services/naverFinance';
import type { StockBasicInfo, ChartData } from '../services/naverFinance';
import { STOCK_DICTIONARY } from '../utils/stockDictionary';
import styles from './MarketPage.module.css';

export default function StockDetailPage() {
  const { code } = useParams<{ code: string }>();
  const [basicInfo, setBasicInfo] = useState<StockBasicInfo | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [basic, chart] = await Promise.all([
          naverFinanceApi.getStockBasic(code),
          naverFinanceApi.getChartData(code, 'day', '', '')
        ]);
        setBasicInfo(basic);
        setChartData(chart);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

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
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <div className={styles.panelHeader}>종목 정보 ({code})</div>
          <div className={styles.panelContent}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>로딩중...</div>
            ) : error ? (
              <div style={{ color: 'var(--color-danger)' }}>{error}</div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ color: 'var(--color-accent)', margin: '0 0 8px 0' }}>{stockName}</h2>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{formatPrice(basicInfo?.closePrice)}</div>
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
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={55} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>상세 차트</div>
          <div className={styles.panelContent} style={{ padding: 0 }}>
            <div style={{ display: 'flex', gap: 16, padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
              <select style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 4 }}>
                <option>일봉</option>
                <option>주봉</option>
                <option>월봉</option>
              </select>
            </div>
            <div style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
              {loading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
                  차트 불러오는 중...
                </div>
              )}
              {!loading && chartData.length > 0 && <CandleChart data={chartData} />}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>수급 / 공시 / 리포트</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>API 연동 예정</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
