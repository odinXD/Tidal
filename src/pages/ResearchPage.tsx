import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Send, Bot } from 'lucide-react';
import styles from './MarketPage.module.css';

export default function ResearchPage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup direction="horizontal">
        {/* 사이드바 - 분석 모드 선택 및 프롬프트 제안 */}
        <Panel defaultSize={25} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>리서치 모드</div>
          <div className={styles.panelContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ padding: '12px', background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: 4, textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)' }}>
                🌍 전체 시황 분석
              </button>
              <button style={{ padding: '12px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 4, textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)' }}>
                🏭 업종/테마 발굴
              </button>
              <button style={{ padding: '12px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 4, textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)' }}>
                📊 특정 종목 딥다이브
              </button>
              <button style={{ padding: '12px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 4, textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)' }}>
                📰 뉴스/공시 요약
              </button>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        {/* 메인 대화 영역 */}
        <Panel defaultSize={75} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>AI 리서치 에이전트 (Gemini)</div>
          <div className={styles.panelContent} style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
            {/* 대화 내역 */}
            <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{ flex: 1, background: 'var(--bg-panel)', padding: 16, borderRadius: 8, color: 'var(--text-primary)' }}>
                  안녕하세요. 무엇을 분석해 드릴까요? 현재 시장 데이터와 주요 뉴스를 기반으로 종목을 분석하거나 새로운 투자 아이디어를 발굴할 수 있습니다.
                </div>
              </div>
            </div>
            
            {/* 입력창 */}
            <div style={{ padding: 16, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px' }}>
                <input 
                  type="text" 
                  placeholder="분석하고 싶은 종목이나 시장에 대해 질문해보세요..." 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button style={{ background: 'var(--color-ai)', color: 'white', border: 'none', borderRadius: 4, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
