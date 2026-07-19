import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity } from 'lucide-react';
import { useMarketStore } from '../../store/useMarketStore';
import { usePriceTick } from '../../hooks/usePriceTick';
import { searchStocks } from '../../utils/stockDictionary';
import type { StockItem } from '../../utils/stockDictionary';
import styles from './TopBar.module.css';

export default function TopBar() {
  const navigate = useNavigate();
  const { indices, exchangeRates } = useMarketStore();
  
  const kospiPrice = indices.kospi ? parseFloat(indices.kospi.closePrice.replace(/,/g, '')) : 0;
  const kosdaqPrice = indices.kosdaq ? parseFloat(indices.kosdaq.closePrice.replace(/,/g, '')) : 0;
  
  const kospiTick = usePriceTick(indices.kospi?.closePrice);
  const kosdaqTick = usePriceTick(indices.kosdaq?.closePrice);
  const usdTick = usePriceTick(exchangeRates.usdKrw?.toString());

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      setSearchResults(searchStocks(query));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleSelectStock = (code: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/stock/${code}`);
  };

  const formatIndex = (_val?: string | null, numericVal?: number) => numericVal ? numericVal.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00';
  const formatChange = (val?: string | null) => {
    if (!val) return '0.00%';
    const num = parseFloat(val);
    if (num > 0) return `+${num}%`;
    return `${num}%`;
  };
  const getChangeClass = (val?: string | null) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (num > 0) return styles.textUp;
    if (num < 0) return styles.textDown;
    return '';
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.brand} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Activity size={20} color="var(--color-accent)" />
        <span>Tidal</span>
      </div>

      <div className={styles.searchContainer} ref={searchRef}>
        <Search size={14} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="종목명 또는 코드 검색 (예: 삼성전자, 005930)" 
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => { if(searchQuery.length > 0) setIsSearchOpen(true); }}
        />
        <div className={styles.searchShortcut}>/</div>

        {isSearchOpen && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 9999
          }}>
            {searchResults.map((stock) => (
              <div 
                key={stock.code}
                onClick={() => handleSelectStock(stock.code)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '13px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{stock.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{stock.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.indexStrip}>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>KOSPI</span>
          <span className={`${styles.indexValue} ${kospiTick}`}>{formatIndex(indices.kospi?.closePrice, kospiPrice)}</span>
          <span className={`${styles.indexChange} ${getChangeClass(indices.kospi?.fluctuationsRatio)}`}>{formatChange(indices.kospi?.fluctuationsRatio)}</span>
        </div>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>KOSDAQ</span>
          <span className={`${styles.indexValue} ${kosdaqTick}`}>{formatIndex(indices.kosdaq?.closePrice, kosdaqPrice)}</span>
          <span className={`${styles.indexChange} ${getChangeClass(indices.kosdaq?.fluctuationsRatio)}`}>{formatChange(indices.kosdaq?.fluctuationsRatio)}</span>
        </div>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>USD/KRW</span>
          <span className={`${styles.indexValue} ${usdTick}`}>{exchangeRates.usdKrw ? exchangeRates.usdKrw.toLocaleString() : '...'}</span>
        </div>
      </div>
    </header>
  );
}
