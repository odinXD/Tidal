import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Chart from 'react-apexcharts';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { naverFinanceApi } from '../services/naverFinance';
import styles from './MarketPage.module.css';

interface LivePortfolioItem {
  code: string;
  name: string;
  averagePrice: number;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  profit: number;
  profitRate: number;
}

export default function PortfolioPage() {
  const { items } = usePortfolioStore();
  const [liveData, setLiveData] = useState<LivePortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const liveItems = await Promise.all(
          items.map(async (item) => {
            const basic = await naverFinanceApi.getStockBasic(item.code);
            const currentPrice = parseInt(basic.closePrice.replace(/,/g, ''));
            const totalValue = currentPrice * item.quantity;
            const investAmount = item.averagePrice * item.quantity;
            const profit = totalValue - investAmount;
            const profitRate = (profit / investAmount) * 100;
            return {
              ...item,
              currentPrice,
              totalValue,
              profit,
              profitRate
            };
          })
        );
        setLiveData(liveItems);
      } catch (error) {
        console.error('Failed to fetch portfolio prices', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLivePrices();
  }, [items]);

  const totalInvest = liveData.reduce((acc, cur) => acc + (cur.averagePrice * cur.quantity), 0);
  const totalValue = liveData.reduce((acc, cur) => acc + cur.totalValue, 0);
  const totalProfit = totalValue - totalInvest;
  const totalProfitRate = totalInvest === 0 ? 0 : (totalProfit / totalInvest) * 100;

  const chartOptions = {
    labels: liveData.map(d => d.name),
    theme: { mode: 'dark' as const },
    chart: { background: 'transparent' },
    stroke: { show: false },
    legend: { position: 'right' as const, labels: { colors: '#94a3b8' } }
  };
  
  const chartSeries = liveData.map(d => d.totalValue);

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={30} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>나의 포트폴리오 요약</div>
          <div className={styles.panelContent}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>로딩중...</div>
            ) : (
              <div style={{ padding: '0 12px' }}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>총 자산 평가액</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{totalValue.toLocaleString()} 원</div>
                  <div style={{ color: totalProfit >= 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                    {totalProfit > 0 ? '+' : ''}{totalProfit.toLocaleString()} 원 ({totalProfitRate.toFixed(2)}%)
                  </div>
                </div>
                
                <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>보유 종목 리스트</h3>
                {liveData.map(item => (
                  <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--bg-base)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.quantity}주 (평단 {item.averagePrice.toLocaleString()})</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14 }}>{item.totalValue.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: item.profit >= 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                        {item.profitRate > 0 ? '+' : ''}{item.profitRate.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={70} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>포트폴리오 비중 분석</div>
          <div className={styles.panelContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!loading && liveData.length > 0 && (
              <Chart 
                options={chartOptions} 
                series={chartSeries} 
                type="pie" 
                width={500} 
              />
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
