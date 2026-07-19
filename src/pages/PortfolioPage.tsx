import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function PortfolioPage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <div className={styles.panelHeader}>나의 포트폴리오</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>포트폴리오 목록 및 그룹</div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={80} minSize={50} className={styles.panel}>
          <div className={styles.panelHeader}>포트폴리오 분석</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>
              총 평가금액, 수익률, 비중 파이차트 (ApexCharts 활용) 등
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
