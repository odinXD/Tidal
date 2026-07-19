import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CandleChart from '../components/charts/CandleChart';
import { globalApi } from '../services/globalApi';
import styles from './MarketPage.module.css';

export default function MacroPage() {
  const [tnxChart, setTnxChart] = useState<any[]>([]);
  const [goldChart, setGoldChart] = useState<any[]>([]);
  const [oilChart, setOilChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMacro = async () => {
      try {
        const [tnx, gold, oil] = await Promise.all([
          globalApi.getMacroChart('^TNX'),
          globalApi.getMacroChart('GC=F'),
          globalApi.getMacroChart('CL=F')
        ]);
        setTnxChart(tnx);
        setGoldChart(gold);
        setOilChart(oil);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMacro();
  }, []);

  const renderPanel = (title: string, data: any[], currentPrice?: number) => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{title}</span>
        {currentPrice && <span>{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>}
      </div>
      <div className={styles.panelContent} style={{ flex: 1, padding: 0, position: 'relative' }}>
        {loading ? (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>로딩중...</div>
        ) : data.length > 0 ? (
          <div style={{ position: 'absolute', inset: 0 }}>
            <CandleChart data={data} />
          </div>
        ) : (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--color-danger)' }}>데이터 없음</div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <PanelGroup orientation="vertical">
        <Panel defaultSize={33} minSize={20} className={styles.panel}>
          {renderPanel('미국 10년물 국채 금리 (^TNX)', tnxChart, tnxChart[tnxChart.length-1]?.close)}
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel defaultSize={33} minSize={20} className={styles.panel}>
          {renderPanel('금 선물 (GC=F)', goldChart, goldChart[goldChart.length-1]?.close)}
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel defaultSize={34} minSize={20} className={styles.panel}>
          {renderPanel('WTI 원유 선물 (CL=F)', oilChart, oilChart[oilChart.length-1]?.close)}
        </Panel>
      </PanelGroup>
    </div>
  );
}
