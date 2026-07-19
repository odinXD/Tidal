import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function ThemePage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={30} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>테마 및 업종 리스트</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>테마 목록 (AI, 전력, 원전 등)</div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={70} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>테마 상세 분석</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>선택한 테마의 소속 종목 히트맵 및 수익률 차트</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
