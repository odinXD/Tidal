import { useParams } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CandleChart from '../components/charts/CandleChart';
import styles from './MarketPage.module.css'; // 같은 패널 스타일 공유

export default function StockDetailPage() {
  const { code } = useParams<{ code: string }>();

  // 더미 차트 데이터 (실제로는 API에서 불러와야 함)
  const dummyChartData = [
    { date: '20240101', open: 70000, high: 71000, low: 69000, close: 70500, volume: 1000000 },
    { date: '20240102', open: 70500, high: 72000, low: 70000, close: 71500, volume: 1200000 },
    { date: '20240103', open: 71000, high: 71500, low: 70500, close: 71000, volume: 800000 },
    { date: '20240104', open: 71000, high: 73000, low: 70500, close: 72500, volume: 1500000 },
    { date: '20240105', open: 72500, high: 73500, low: 72000, close: 72000, volume: 1100000 },
  ];

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <div className={styles.panelHeader}>종목 정보 ({code})</div>
          <div className={styles.panelContent}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: 'var(--color-accent)' }}>삼성전자</h2>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>72,000</div>
              <div className="text-up">+2.1%</div>
            </div>
            
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>시가총액</span>
                <span style={{ color: 'var(--text-primary)' }}>430조</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>PER</span>
                <span style={{ color: 'var(--text-primary)' }}>15.2</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>PBR</span>
                <span style={{ color: 'var(--text-primary)' }}>1.3</span>
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={55} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>상세 차트</div>
          <div className={styles.panelContent} style={{ padding: 0 }}>
            {/* 상단 컨트롤 바 */}
            <div style={{ display: 'flex', gap: 16, padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
              <select style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 4 }}>
                <option>1M</option>
                <option>3M</option>
                <option>1Y</option>
              </select>
              <select style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 4 }}>
                <option>1D</option>
                <option>1W</option>
              </select>
            </div>
            <div style={{ height: 'calc(100% - 40px)' }}>
              <CandleChart data={dummyChartData} />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>수급 / 공시 / 리포트</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>우측 패널 콘텐츠</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
