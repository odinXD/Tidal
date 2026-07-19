import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CandleChart from '../components/charts/CandleChart';
import { naverFinanceApi } from '../services/naverFinance';
import type { ChartData, StockBasicInfo } from '../services/naverFinance';
import { useMarketStore } from '../store/useMarketStore';
import styles from './MarketPage.module.css';

export default function MarketPage() {
  const navigate = useNavigate();
  const { indices } = useMarketStore();
  const [kospiChart, setKospiChart] = useState<ChartData[]>([]);
  const [kosdaqChart, setKosdaqChart] = useState<ChartData[]>([]);
  const [topStocks, setTopStocks] = useState<{marketCap: StockBasicInfo[], gainers: StockBasicInfo[], losers: StockBasicInfo[]}>({
    marketCap: [], gainers: [], losers: []
  });
  const [activeTab, setActiveTab] = useState<'marketCap'|'gainers'|'losers'>('marketCap');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kospi, kosdaq, top] = await Promise.all([
          naverFinanceApi.getChartData('KOSPI', 'day', '', ''),
          naverFinanceApi.getChartData('KOSDAQ', 'day', '', ''),
          naverFinanceApi.getTopStocks()
        ]);
        setKospiChart(kospi);
        setKosdaqChart(kosdaq);
        setTopStocks(top);
      } catch (error) {
        console.error('Failed to fetch market data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getChangeClass = (val?: string) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (num > 0) return 'text-up';
    if (num < 0) return 'text-down';
    return '';
  };

  const renderStockList = (list: StockBasicInfo[]) => {
    return (list || []).map((stock, i) => {
      const isUp = parseFloat(stock.compareToPreviousClosePrice || '0') > 0;
      return (
        <div key={i} className={styles.stockItem} onClick={() => navigate(`/stock/${stock.code}`)}>
          <div className={styles.stockInfo}>
            <span className={styles.stockRank}>{i + 1}</span>
            <span className={styles.stockName}>{stock.stockName}</span>
          </div>
          <div className={styles.stockPriceInfo}>
            <span style={{ fontWeight: 600 }}>{stock.closePrice}</span>
            <span className={`${styles.stockChange} ${getChangeClass(stock.fluctuationsRatio)}`}>
              {isUp ? '+' : ''}{stock.fluctuationsRatio}%
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        {/* 중앙 차트 영역 (코스피 / 코스닥 분할) */}
        <Panel defaultSize={70} minSize={50} className={styles.panel}>
          <PanelGroup orientation="vertical">
            <Panel defaultSize={50} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>KOSPI 지수</span>
                  <span className={getChangeClass(indices.kospi?.fluctuationsRatio)}>
                    {indices.kospi ? parseFloat(indices.kospi.closePrice.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} ({indices.kospi?.fluctuationsRatio}%)
                  </span>
                </div>
                <div className={styles.panelContent} style={{ flex: 1, padding: 0, position: 'relative' }}>
                  {loading ? (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>로딩중...</div>
                  ) : Array.isArray(kospiChart) && kospiChart.length > 0 && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <CandleChart data={kospiChart} />
                    </div>
                  )}
                </div>
              </div>
            </Panel>
            
            <PanelResizeHandle className={styles.resizeHandle} />
            
            <Panel defaultSize={50} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>KOSDAQ 지수</span>
                  <span className={getChangeClass(indices.kosdaq?.fluctuationsRatio)}>
                    {indices.kosdaq ? parseFloat(indices.kosdaq.closePrice.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} ({indices.kosdaq?.fluctuationsRatio}%)
                  </span>
                </div>
                <div className={styles.panelContent} style={{ flex: 1, padding: 0, position: 'relative' }}>
                  {loading ? (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>로딩중...</div>
                  ) : Array.isArray(kosdaqChart) && kosdaqChart.length > 0 && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <CandleChart data={kosdaqChart} />
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        {/* 우측 특징주 패널 */}
        <Panel defaultSize={30} minSize={25} className={styles.panel}>
          <div className={styles.panelHeader}>시장 주도주</div>
          
          <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
            <button 
              style={{ flex: 1, padding: '12px 0', borderBottom: activeTab === 'marketCap' ? '2px solid var(--border-highlight)' : '2px solid transparent', color: activeTab === 'marketCap' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              onClick={() => setActiveTab('marketCap')}
            >
              시가총액
            </button>
            <button 
              style={{ flex: 1, padding: '12px 0', borderBottom: activeTab === 'gainers' ? '2px solid var(--border-highlight)' : '2px solid transparent', color: activeTab === 'gainers' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              onClick={() => setActiveTab('gainers')}
            >
              급등주
            </button>
            <button 
              style={{ flex: 1, padding: '12px 0', borderBottom: activeTab === 'losers' ? '2px solid var(--border-highlight)' : '2px solid transparent', color: activeTab === 'losers' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              onClick={() => setActiveTab('losers')}
            >
              급락주
            </button>
          </div>
          
          <div className={styles.panelContent} style={{ padding: '0 12px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>데이터 로딩중...</div>
            ) : (
              <div className={styles.stockList}>
                {activeTab === 'marketCap' && renderStockList(topStocks.marketCap)}
                {activeTab === 'gainers' && renderStockList(topStocks.gainers)}
                {activeTab === 'losers' && renderStockList(topStocks.losers)}
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
