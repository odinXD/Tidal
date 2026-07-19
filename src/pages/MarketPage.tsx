import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function MarketPage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <div className={styles.panelHeader}>시장 펄스 (Market Pulse)</div>
          <div className={styles.panelContent}>
            {/* TODO: 시장 상태, 유동성, 등락률 히트맵 */}
            <div className={styles.placeholder}>좌측 패널 콘텐츠</div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={55} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>KOSPI 차트</div>
          <div className={styles.panelContent}>
            {/* TODO: 메인 캔들 차트 (lightweight-charts) */}
            <div className={styles.placeholder}>중앙 차트 영역</div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>실시간 특징주 & 뉴스</div>
          <div className={styles.panelContent}>
            {/* TODO: 거래대금 상위, 실시간 뉴스 */}
            <div className={styles.placeholder}>우측 패널 콘텐츠</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
