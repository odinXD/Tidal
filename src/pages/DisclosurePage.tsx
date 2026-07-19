import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { FileText } from 'lucide-react';
import { naverFinanceApi } from '../services/naverFinance';
import styles from './MarketPage.module.css';

interface DisclosureItem {
  title: string;
  link: string;
  summary: string;
  press: string;
  date: string;
}

export default function DisclosurePage() {
  const [disclosures, setDisclosures] = useState<DisclosureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchDisclosures = async (p: number) => {
    setLoading(true);
    try {
      const data = await naverFinanceApi.getDisclosures(p);
      if (p === 1) {
        setDisclosures(data);
      } else {
        setDisclosures(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisclosures(page);
  }, [page]);

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={70} minSize={50} className={styles.panel}>
          <div className={styles.panelHeader}>실시간 공시 (KIND/DART 연동)</div>
          <div className={styles.panelContent} style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {disclosures.map((item, idx) => (
              <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'background-color 0.2s' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                  <FileText color="var(--text-muted)" size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{item.press}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </a>
            ))}
            
            {loading && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>로딩중...</div>}
            
            {!loading && disclosures.length > 0 && (
              <button 
                onClick={() => setPage(p => p + 1)}
                style={{ padding: '12px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >더 보기 (Page {page})</button>
            )}
            
            {!loading && disclosures.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>공시 데이터가 없습니다.</div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={30} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>공시 캘린더 및 필터</div>
          <div className={styles.panelContent} style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              특정 기업의 실적 발표나 주총일정 필터링 기능이 곧 추가될 예정입니다.
              <br/><br/>
              본 데이터는 네이버 증권 공시 속보를 실시간으로 크롤링하여 제공됩니다.
            </p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
