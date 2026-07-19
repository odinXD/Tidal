import { Panel, Group as PanelGroup } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel className={styles.panel}>
          <div className={styles.panelHeader}>설정 및 API 키 관리</div>
          <div className={styles.panelContent} style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            
            <div style={{ background: 'var(--bg-panel)', padding: 24, borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>API 키 설정 (Local Storage 저장)</h3>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>DART OpenAPI Key</label>
                <input type="password" placeholder="API Key 입력" style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 4 }} />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>한국은행 ECOS API Key</label>
                <input type="password" placeholder="API Key 입력" style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 4 }} />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Google Gemini API Key (AI 리서치용)</label>
                <input type="password" placeholder="API Key 입력" style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 4 }} />
              </div>

              <button style={{ background: 'var(--color-highlight, var(--color-accent))', color: '#000', padding: '8px 16px', borderRadius: 4, fontWeight: 'bold' }}>저장</button>
            </div>

          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
