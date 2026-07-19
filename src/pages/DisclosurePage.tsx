import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function DisclosurePage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={40} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>DART 공시 검색</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>공시 검색 필터 및 결과 리스트</div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={60} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>공시 원문 및 재무제표 뷰어</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>공시 원문 또는 재무제표 렌더링</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
