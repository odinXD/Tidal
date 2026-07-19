import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function NewsPage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={40} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>실시간 뉴스 피드</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>네이버 금융 뉴스 크롤링 리스트</div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={60} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>뉴스 상세 및 AI 요약</div>
          <div className={styles.panelContent}>
            <div className={styles.placeholder}>뉴스 원문 및 Gemini를 활용한 긍정/부정 감성 분석 요약</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
