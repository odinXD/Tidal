import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './MarketPage.module.css'; // 공유 스타일 사용

export default function MacroPage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup direction="horizontal">
        {/* 주요 매크로 지표 목록 (좌측) */}
        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>매크로 지표 모니터</div>
          <div className={styles.panelContent}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 12 }}>금리 (Interest Rates)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>한국은행 기준금리</span>
                <span className="font-mono font-bold">3.50%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>국고채 3년</span>
                <span className="font-mono font-bold">3.32%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>미국 국채 10년</span>
                <span className="font-mono font-bold">4.45%</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 12 }}>환율 (Exchange Rates)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>USD/KRW</span>
                <span className="font-mono font-bold">1,380.50</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>EUR/KRW</span>
                <span className="font-mono font-bold">1,495.20</span>
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 12 }}>원자재 (Commodities)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>WTI 원유</span>
                <span className="font-mono font-bold">$78.50</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>금 (Gold)</span>
                <span className="font-mono font-bold">$2,340.10</span>
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        {/* 선택한 매크로 지표 차트 (우측) */}
        <Panel defaultSize={75} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>지표 트렌드 분석</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>
              좌측에서 지표를 선택하면 해당 지표의 역사적 차트(lightweight-charts)와 상관관계 분석이 이곳에 표시됩니다.
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
