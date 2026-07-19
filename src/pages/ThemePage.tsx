import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { naverFinanceApi } from '../services/naverFinance';
import styles from './MarketPage.module.css';

interface Theme {
  name: string;
  ratio: string;
  desc: string;
}

export default function ThemePage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await naverFinanceApi.getThemes();
        setThemes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const toggleTheme = (themeName: string) => {
    if (expandedTheme === themeName) {
      setExpandedTheme(null);
    } else {
      setExpandedTheme(themeName);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={60} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader}>실시간 마켓 테마 동향</div>
          <div className={styles.panelContent} style={{ padding: '16px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>테마 데이터를 불러오는 중...</div>
            ) : themes.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>데이터가 없습니다.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {themes.map((theme, idx) => {
                  const isUp = parseFloat(theme.ratio) > 0;
                  const isExpanded = expandedTheme === theme.name;
                  return (
                    <div key={idx} style={{ 
                      background: 'var(--bg-panel)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      overflow: 'hidden' 
                    }}>
                      <div 
                        onClick={() => toggleTheme(theme.name)}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '16px', 
                          cursor: 'pointer',
                          background: isExpanded ? 'var(--bg-panel-hover)' : 'transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {isExpanded ? <ChevronDown size={20} color="var(--text-muted)"/> : <ChevronRight size={20} color="var(--text-muted)"/>}
                          <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{theme.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ 
                            color: isUp ? 'var(--color-up)' : 'var(--color-down)', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {isUp ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                            {isUp ? '+' : ''}{theme.ratio}
                          </span>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div style={{ 
                          padding: '16px', 
                          borderTop: '1px solid var(--border-color)',
                          background: 'var(--bg-base)'
                        }}>
                          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {theme.desc}
                          </p>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>이 테마는 네이버 금융 스크래핑 기반입니다. 해당 테마 관련 종목 상세는 준비 중입니다.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />
        
        <Panel defaultSize={40} minSize={30} className={styles.panel}>
          <div className={styles.panelHeader}>테마 분석 브리핑</div>
          <div className={styles.panelContent} style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '16px' }}>현재 시장 주도 테마</h3>
            {themes.length > 0 && (
              <div style={{ background: 'var(--bg-panel)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{themes[0].name}</div>
                <div style={{ color: 'var(--color-up)', fontWeight: 'bold', fontSize: '24px', marginBottom: '12px' }}>+{themes[0].ratio}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {themes[0].desc}
                </p>
              </div>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
              테마 동향은 주식 시장의 주요 자금 흐름을 보여줍니다. 급등하는 테마는 단기 모멘텀이 강하지만 높은 변동성에 주의해야 합니다.
            </p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
