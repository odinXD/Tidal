import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup } from 'react-resizable-panels';
import { naverFinanceApi } from '../services/naverFinance';
import styles from './MarketPage.module.css';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await naverFinanceApi.getMainNews();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={100} className={styles.panel}>
          <div className={styles.panelHeader}>실시간 주요 뉴스 (Naver Finance)</div>
          <div className={styles.panelContent} style={{ overflowY: 'auto' }}>
            <div style={{ padding: '0 12px' }}>
              {loading ? (
                <div style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>뉴스를 불러오는 중입니다...</div>
              ) : news.length > 0 ? (
                news.map((item, i) => (
                  <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--bg-base)' }}>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ textDecoration: 'none', color: 'var(--text-primary)' }}
                    >
                      <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
                        {item.summary}
                      </p>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {item.press} · {item.date}
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>뉴스가 없습니다.</div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
