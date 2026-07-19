import { Panel, Group as PanelGroup } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function DisclosurePage() {
  const dummyDisclosures = [
    { title: '삼성전자: 연결재무제표기준영업(잠정)실적(공정공시)', date: '2024-07-05', type: '영업실적' },
    { title: 'SK하이닉스: 타법인주식및출자증권취득결정', date: '2024-07-04', type: '투자' },
    { title: '에코프로비엠: 유상증자결정(제3자배정증자)', date: '2024-07-03', type: '유상증자' },
    { title: '현대차: 주식소각결정', date: '2024-07-02', type: '주주환원' },
    { title: 'NAVER: 주요경영사항신고(주식배당결정)', date: '2024-07-01', type: '배당' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={100} className={styles.panel}>
          <div className={styles.panelHeader}>최신 전자공시 (Mock Data)</div>
          <div className={styles.panelContent} style={{ padding: '0 12px' }}>
            {dummyDisclosures.map((d, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--bg-base)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '2px 6px', 
                    background: 'var(--bg-accent)', 
                    color: 'var(--text-primary)', 
                    fontSize: 11, 
                    borderRadius: 4, 
                    marginRight: 8 
                  }}>
                    {d.type}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.date}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {d.title}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
