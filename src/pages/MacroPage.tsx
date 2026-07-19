import { useEffect, useState } from 'react';
import CandleChart from '../components/charts/CandleChart';
import { globalApi } from '../services/globalApi';
import styles from './MarketPage.module.css';

export default function MacroPage() {
  const [charts, setCharts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const MACRO_SYMBOLS = [
    { id: '^IXIC', name: 'NASDAQ Composite' },
    { id: '^GSPC', name: 'S&P 500' },
    { id: 'USDKRW=X', name: 'USD/KRW 환율' },
    { id: '^TNX', name: '미국 10년물 국채 금리' },
    { id: 'GC=F', name: '금 선물' },
    { id: 'CL=F', name: 'WTI 원유 선물' }
  ];

  useEffect(() => {
    const fetchMacro = async () => {
      try {
        const results = await Promise.all(MACRO_SYMBOLS.map(s => globalApi.getMacroChart(s.id)));
        const newCharts: Record<string, any[]> = {};
        MACRO_SYMBOLS.forEach((s, i) => {
          newCharts[s.id] = results[i];
        });
        setCharts(newCharts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMacro();
  }, []);

  const renderPanel = (title: string, data: any[]) => {
    const currentPrice = data?.[data.length - 1]?.close;
    return (
      <div className={styles.panel} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
        <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <span>{title}</span>
          {currentPrice && <span>{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>}
        </div>
        <div className={styles.panelContent} style={{ height: '300px', padding: 0, position: 'relative' }}>
          {loading ? (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>로딩중...</div>
          ) : data && data.length > 0 ? (
            <div style={{ position: 'absolute', inset: 0 }}>
              <CandleChart data={data} />
            </div>
          ) : (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--color-danger)' }}>데이터 없음</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageContainer} style={{ overflowY: 'auto', padding: '16px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        {MACRO_SYMBOLS.map(symbol => (
          <div key={symbol.id}>
            {renderPanel(symbol.name, charts[symbol.id] || [])}
          </div>
        ))}
      </div>
    </div>
  );
}
