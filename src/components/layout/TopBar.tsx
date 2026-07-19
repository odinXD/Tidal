import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, Globe, PieChart, Menu, LogOut, MessageSquare, LayoutTemplate, Briefcase } from 'lucide-react';
import { useMarketStore } from '../../store/useMarketStore';
import { usePriceTick } from '../../hooks/usePriceTick';
import { searchStocks } from '../../utils/stockDictionary';
import type { StockItem } from '../../utils/stockDictionary';
import styles from './TopBar.module.css';

export default function TopBar() {
  const navigate = useNavigate();
  const { indices, exchangeRates } = useMarketStore();
  
  // KOSPI 파싱 에러 수정 (콤마 제거)
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
    <header className={styles.topbar}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <Activity size={24} color="var(--color-accent)" />
        <span>Tidal</span>
      </div>

      <nav className={styles.nav}>
        <button onClick={() => navigate('/')} className={styles.navBtn}><LayoutTemplate size={16}/> Market</button>
        <button onClick={() => navigate('/portfolio')} className={styles.navBtn}><Briefcase size={16}/> Portfolio</button>
        <button onClick={() => navigate('/theme')} className={styles.navBtn}><PieChart size={16}/> Themes</button>
        <button onClick={() => navigate('/macro')} className={styles.navBtn}><Globe size={16}/> Macro</button>
        <button onClick={() => navigate('/news')} className={styles.navBtn}><MessageSquare size={16}/> News</button>
      </nav>
      
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

      <div className={styles.searchContainer} ref={searchRef}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search stock..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { if (searchQuery) setIsSearchOpen(true); }}
          />
        </div>
        {isSearchOpen && searchResults.length > 0 && (
          <div className={styles.dropdown}>
            {searchResults.map((stock) => (
              <div 
                key={stock.code} 
                className={styles.dropdownItem}
                onClick={() => handleSelectStock(stock.code)}
              >
                <span className={styles.dropdownName}>{stock.name}</span>
                <span className={styles.dropdownCode}>{stock.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}><Menu size={20} /></button>
        <button className={styles.iconBtn}><LogOut size={20} /></button>
      </div>
    </header>
  );
}
