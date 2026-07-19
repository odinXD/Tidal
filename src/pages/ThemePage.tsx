import { Panel, Group as PanelGroup } from 'react-resizable-panels';
import styles from './MarketPage.module.css';

export default function ThemePage() {
  const dummyThemes = [
    { name: '반도체 대표주', return: '+4.5%', leader: 'SK하이닉스' },
    { name: '이차전지 소재', return: '-1.2%', leader: '에코프로비엠' },
    { name: '온디바이스 AI', return: '+8.2%', leader: '가온칩스' },
    { name: '저PBR 금융', return: '+0.5%', leader: '하나금융지주' },
    { name: '전력설비/전선', return: '+12.4%', leader: 'HD현대일렉트릭' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={100} className={styles.panel}>
          <div className={styles.panelHeader}>오늘의 주도 테마 (Mock Data)</div>
          <div className={styles.panelContent} style={{ padding: '0 12px' }}>
            {dummyThemes.map((theme, i) => {
              const isUp = theme.return.startsWith('+');
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--bg-base)' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>{theme.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>대장주: {theme.leader}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: isUp ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                    {theme.return}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
