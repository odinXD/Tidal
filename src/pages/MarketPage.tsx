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
  const [topStocks, setTopStocks] = useState<StockBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [chartData, topData] = await Promise.all([
          naverFinanceApi.getChartData('KOSPI', 'day', '', ''),
          naverFinanceApi.getTopStocks()
        ]);
        setKospiChart(chartData);
        setTopStocks(topData);
      } catch (e) {
        console.error('Failed to fetch market data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  const formatPrice = (val?: string | null) => val ? parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00';

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <div className={styles.panelHeader}>시장 펄스 (Market Pulse)</div>
          <div className={styles.panelContent}>
            <div style={{ padding: '0 12px' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>오늘의 시장 요약</h3>
              <div style={{ background: 'var(--bg-base)', padding: 12, borderRadius: 6, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>코스피 지수</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {formatPrice(indices.kospi?.closePrice)}
                </div>
              </div>
              <div style={{ background: 'var(--bg-base)', padding: 12, borderRadius: 6 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>코스닥 지수</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {formatPrice(indices.kosdaq?.closePrice)}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={55} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>KOSPI 일봉 차트</div>
          <div className={styles.panelContent} style={{ padding: 0 }}>
            <div style={{ height: '100%', position: 'relative' }}>
              {loading ? (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
                  차트 불러오는 중...
                </div>
              ) : kospiChart.length > 0 ? (
                <CandleChart data={kospiChart} />
              ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--color-danger)' }}>
                  데이터가 없습니다
                </div>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>시가총액 상위 특징주</div>
          <div className={styles.panelContent} style={{ overflowY: 'auto' }}>
            <div style={{ padding: '0 12px' }}>
              {loading ? (
                <div style={{ color: 'var(--text-muted)', padding: '12px 0' }}>불러오는 중...</div>
              ) : topStocks.length > 0 ? (
                topStocks.map((stock) => {
                  const changeNum = parseFloat(stock.fluctuationsRatio);
                  const isUp = changeNum > 0;
                  const isDown = changeNum < 0;
                  const changeColor = isUp ? 'var(--color-danger)' : isDown ? 'var(--color-primary)' : 'var(--text-primary)';
                  const changeSign = isUp ? '+' : '';
                  
                  return (
                    <div 
                      key={stock.itemCode} 
                      style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--bg-base)', cursor: 'pointer' }}
                      onClick={() => navigate(`/stock/${stock.itemCode}`)}
                    >
                      <div>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{stock.stockName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stock.itemCode}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>{parseFloat(stock.closePrice.replace(/,/g, '')).toLocaleString()}</div>
                        <div style={{ fontSize: 12, color: changeColor }}>{changeSign}{stock.fluctuationsRatio}%</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: 'var(--text-muted)', padding: '12px 0' }}>데이터가 없습니다.</div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
