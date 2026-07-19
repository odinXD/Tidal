import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Chart from 'react-apexcharts';
import { Plus, Trash2, X } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { naverFinanceApi } from '../services/naverFinance';
import { searchStocks } from '../utils/stockDictionary';
import type { StockItem } from '../utils/stockDictionary';
import styles from './MarketPage.module.css';

interface LivePortfolioItem {
  code: string;
  name: string;
  averagePrice: number;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  returnRate: number;
  returnAmount: number;
}

export default function PortfolioPage() {
  const { items, addItem, removeItem } = usePortfolioStore();
  const [liveData, setLiveData] = useState<LivePortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Stock Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [addQuantity, setAddQuantity] = useState<string>('');
  const [addPrice, setAddPrice] = useState<string>('');

  useEffect(() => {
    const fetchLivePrices = async () => {
      setLoading(true);
      try {
        const liveItems: LivePortfolioItem[] = [];
        for (const item of items) {
          try {
            const basicInfo = await naverFinanceApi.getStockBasic(item.code);
            const currentPrice = parseInt(basicInfo.closePrice.replace(/,/g, ''));
            const totalValue = currentPrice * item.quantity;
            const investAmount = item.averagePrice * item.quantity;
            const returnAmount = totalValue - investAmount;
            const returnRate = (returnAmount / investAmount) * 100;
            
            liveItems.push({
              ...item,
              currentPrice,
              totalValue,
              returnRate,
              returnAmount
            });
          } catch (e) {
            console.error(`Failed to fetch live price for ${item.code}`, e);
          }
        }
        setLiveData(liveItems);
      } finally {
        setLoading(false);
      }
    };
    
    if (items.length > 0) {
      fetchLivePrices();
    } else {
      setLiveData([]);
      setLoading(false);
    }
  }, [items]);

  const totalPortfolioValue = liveData.reduce((acc, curr) => acc + curr.totalValue, 0);
  const totalInvestAmount = liveData.reduce((acc, curr) => acc + (curr.averagePrice * curr.quantity), 0);
  const totalReturnAmount = totalPortfolioValue - totalInvestAmount;
  const totalReturnRate = totalInvestAmount > 0 ? (totalReturnAmount / totalInvestAmount) * 100 : 0;

  const pieChartOptions = {
    chart: { type: 'donut' as const, background: 'transparent' },
    labels: liveData.map(item => item.name),
    theme: { mode: 'dark' as const },
    stroke: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val: number) => `₩${val.toLocaleString()}` }
    },
    legend: { position: 'bottom' as const, labels: { colors: '#94a3b8' } }
  };

  const pieChartSeries = liveData.map(item => item.totalValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q) setSearchResults(searchStocks(q));
    else setSearchResults([]);
  };

  const handleAddStock = () => {
    if (selectedStock && addQuantity && addPrice) {
      addItem({
        code: selectedStock.code,
        name: selectedStock.name,
        averagePrice: parseFloat(addPrice),
        quantity: parseInt(addQuantity)
      });
      setShowAddModal(false);
      setSelectedStock(null);
      setSearchQuery('');
      setAddQuantity('');
      setAddPrice('');
    }
  };

  return (
    <div className={styles.pageContainer} style={{ position: 'relative' }}>
      <PanelGroup orientation="horizontal">
        <Panel defaultSize={35} minSize={25} className={styles.panel}>
          <div className={styles.panelHeader}>내 자산 비중</div>
          <div className={styles.panelContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>평가액 계산 중...</div>
            ) : liveData.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>보유 주식이 없습니다.</div>
            ) : (
              <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
                <Chart options={pieChartOptions} series={pieChartSeries} type="donut" width="350" height="350" />
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className={styles.resizeHandle} />

        <Panel defaultSize={65} minSize={40} className={styles.panel}>
          <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>포트폴리오 요약</span>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-accent)', color: 'black', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}
            >
              <Plus size={16} /> 주식 추가
            </button>
          </div>
          <div className={styles.panelContent} style={{ padding: '0 16px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', padding: '20px' }}>데이터 로딩중...</div>
            ) : (
              <>
                <div style={{ marginBottom: 24, padding: '20px', background: 'var(--bg-panel)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>총 평가 금액</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', margin: '8px 0' }}>₩{totalPortfolioValue.toLocaleString()}</div>
                  <div style={{ fontSize: 16, color: totalReturnRate > 0 ? 'var(--color-up)' : totalReturnRate < 0 ? 'var(--color-down)' : 'var(--text-primary)' }}>
                    {totalReturnRate > 0 ? '+' : ''}{totalReturnAmount.toLocaleString()} ({totalReturnRate > 0 ? '+' : ''}{totalReturnRate.toFixed(2)}%)
                  </div>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'right' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left' }}>종목</th>
                        <th style={{ padding: '12px 8px' }}>보유수량</th>
                        <th style={{ padding: '12px 8px' }}>평균단가</th>
                        <th style={{ padding: '12px 8px' }}>현재가</th>
                        <th style={{ padding: '12px 8px' }}>평가금액</th>
                        <th style={{ padding: '12px 8px' }}>수익률</th>
                        <th style={{ padding: '12px 8px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveData.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 8px', textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.code}</div>
                          </td>
                          <td style={{ padding: '12px 8px' }}>{item.quantity.toLocaleString()}</td>
                          <td style={{ padding: '12px 8px' }}>{item.averagePrice.toLocaleString()}</td>
                          <td style={{ padding: '12px 8px' }}>{item.currentPrice.toLocaleString()}</td>
                          <td style={{ padding: '12px 8px' }}>{item.totalValue.toLocaleString()}</td>
                          <td style={{ padding: '12px 8px', color: item.returnRate > 0 ? 'var(--color-up)' : item.returnRate < 0 ? 'var(--color-down)' : 'var(--text-primary)', fontWeight: 'bold' }}>
                            {item.returnRate > 0 ? '+' : ''}{item.returnRate.toFixed(2)}%
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <button onClick={() => removeItem(item.code)} style={{ color: 'var(--text-muted)', padding: '4px' }} title="삭제">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {liveData.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                            종목을 추가하여 포트폴리오를 구성해보세요.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </Panel>
      </PanelGroup>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '8px', width: '400px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>주식 추가</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} color="var(--text-muted)" /></button>
            </div>
            
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>종목 검색</label>
              <input 
                type="text" 
                value={selectedStock ? selectedStock.name : searchQuery}
                onChange={handleSearchChange}
                placeholder="삼성전자, 005930..."
                style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                disabled={!!selectedStock}
              />
              {selectedStock && (
                <button 
                  onClick={() => { setSelectedStock(null); setSearchQuery(''); }}
                  style={{ position: 'absolute', right: '10px', top: '35px', color: 'var(--color-accent)', fontSize: '12px' }}
                >
                  변경
                </button>
              )}
              
              {!selectedStock && searchResults.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-base)', border: '1px solid var(--border-color)', zIndex: 10, maxHeight: '150px', overflowY: 'auto' }}>
                  {searchResults.map(s => (
                    <div 
                      key={s.code} 
                      onClick={() => { setSelectedStock(s); setSearchResults([]); }}
                      style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
                    >
                      {s.name} ({s.code})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>평균단가 (₩)</label>
                <input 
                  type="number" 
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>수량 (주)</label>
                <input 
                  type="number" 
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                />
              </div>
            </div>

            <button 
              onClick={handleAddStock}
              disabled={!selectedStock || !addPrice || !addQuantity}
              style={{ width: '100%', padding: '12px', background: (!selectedStock || !addPrice || !addQuantity) ? 'var(--bg-base)' : 'var(--color-accent)', color: (!selectedStock || !addPrice || !addQuantity) ? 'var(--text-muted)' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: (!selectedStock || !addPrice || !addQuantity) ? 'not-allowed' : 'pointer' }}
            >
              포트폴리오에 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
