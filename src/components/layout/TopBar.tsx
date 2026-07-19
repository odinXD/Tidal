import { Search, Settings, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { usePriceTick } from '../../hooks/usePriceTick';
import { searchStocks } from '../../utils/stockDictionary';
import type { StockItem } from '../../utils/stockDictionary';
import styles from './TopBar.module.css';

export default function TopBar() {
  const navigate = useNavigate();
  const { indices, exchangeRates } = useMarketStore();
  
  const kospiTick = usePriceTick(indices.kospi?.closePrice);
  const kosdaqTick = usePriceTick(indices.kosdaq?.closePrice);
  const usdTick = usePriceTick(exchangeRates.usdKrw?.toString());

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchStocks(query));
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.match(/^\d{6}$/)) {
        handleNavigateToStock(searchQuery);
      } else if (searchResults.length > 0) {
        handleNavigateToStock(searchResults[0].code);
      }
    }
  };

  const handleNavigateToStock = (code: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    navigate(`/stock/${code}`);
  };

  const formatIndex = (val?: string | null) => val ? parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00';
  const formatChange = (val?: string | null) => {
    if (!val) return '0.00%';
    const num = parseFloat(val);
    if (num > 0) return `+${num}%`;
    return `${num}%`;
  };
  const getChangeClass = (val?: string | null) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (num > 0) return 'text-up';
    if (num < 0) return 'text-down';
    return '';
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.brand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Tidal
      </div>
      
      <div className={styles.searchContainer} ref={dropdownRef} style={{ position: 'relative' }}>
        <Search size={16} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="종목명, 티커 입력..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => { if (searchQuery) setIsDropdownOpen(true); }}
        />
        <div className={styles.searchShortcut}>/</div>
        
        {isDropdownOpen && searchQuery && (
          <div className={styles.searchDropdown}>
            {searchResults.length > 0 ? (
              searchResults.map(stock => (
                <div 
                  key={stock.code} 
                  className={styles.dropdownItem}
                  onClick={() => handleNavigateToStock(stock.code)}
                >
                  <span className={styles.stockName}>{stock.name}</span>
                  <span className={styles.stockCode}>{stock.code}</span>
                </div>
              ))
            ) : (
              <div className={styles.dropdownItem} style={{ justifyContent: 'center', opacity: 0.5 }}>
                {searchQuery.match(/^\d{6}$/) ? `'Enter'를 눌러 종목 이동` : '결과가 없습니다'}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.indexStrip}>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>KOSPI</span>
          <span className={`${styles.indexValue} ${kospiTick}`}>{formatIndex(indices.kospi?.closePrice)}</span>
          <span className={`${styles.indexChange} ${getChangeClass(indices.kospi?.fluctuationsRatio)}`}>{formatChange(indices.kospi?.fluctuationsRatio)}</span>
        </div>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>KOSDAQ</span>
          <span className={`${styles.indexValue} ${kosdaqTick}`}>{formatIndex(indices.kosdaq?.closePrice)}</span>
          <span className={`${styles.indexChange} ${getChangeClass(indices.kosdaq?.fluctuationsRatio)}`}>{formatChange(indices.kosdaq?.fluctuationsRatio)}</span>
        </div>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>USD/KRW</span>
          <span className={`${styles.indexValue} ${usdTick}`}>{exchangeRates.usdKrw ? exchangeRates.usdKrw.toLocaleString() : '1,380.50'}</span>
          <span className={`${styles.indexChange} text-up`}>+2.0</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} title="설정" onClick={() => navigate('/settings')}>
          <Settings size={18} />
        </button>
        <button className={styles.iconButton} title="로그인/프로필">
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
