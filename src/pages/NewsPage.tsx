import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Image as ImageIcon } from 'lucide-react';
import { naverFinanceApi } from '../services/naverFinance';
import styles from './MarketPage.module.css';

interface NewsItem {
  title: string;
  link: string;
  summary: string;
  press: string;
  date: string;
  thumbUrl?: string;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('mainnews');
  const [page, setPage] = useState(1);

  const fetchNews = async (cat: string, p: number) => {
    setLoading(true);
    try {
      const data = await naverFinanceApi.getGlobalNews(p, cat);
      if (p === 1) {
        setNewsList(data);
      } else {
        setNewsList(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category, page);
  }, [category, page]);

  const handleTabChange = (newCat: string) => {
    setCategory(newCat);
    setPage(1);
  };

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={70} minSize={50} className={styles.panel}>
          <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>실시간 시장 뉴스</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleTabChange('mainnews')}
                style={{ background: category === 'mainnews' ? 'var(--bg-panel-hover)' : 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >최신/메인</button>
              <button 
                onClick={() => handleTabChange('quant')}
                style={{ background: category === 'quant' ? 'var(--bg-panel-hover)' : 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >시황/전망</button>
            </div>
          </div>
          <div className={styles.panelContent} style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {newsList.map((news, idx) => (
              <a key={idx} href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'background-color 0.2s' }}>
                {news.thumbUrl ? (
                  <img src={news.thumbUrl} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <div style={{ width: '120px', height: '80px', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                    <ImageIcon color="var(--text-muted)" />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{news.title}</h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.summary}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{news.press}</span>
                    <span>{news.date}</span>
                  </div>
                </div>
              </a>
            ))}
            {loading && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>로딩중...</div>}
            {!loading && newsList.length > 0 && (
              <button 
                onClick={() => setPage(p => p + 1)}
                style={{ padding: '12px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >더 보기 (Page {page})</button>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={30} minSize={20} className={styles.panel}>
          <div className={styles.panelHeader}>주요 키워드 트렌드</div>
          <div className={styles.panelContent} style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              뉴스 빅데이터를 분석한 실시간 키워드 트렌드가 곧 지원될 예정입니다.
              <br/><br/>
              현재 시장은 <strong>반도체, AI, 금리인하, 밸류업 프로그램</strong> 등의 키워드에 집중하고 있습니다.
            </p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
