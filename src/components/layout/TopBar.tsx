import { Search, Settings, User } from 'lucide-react';
import styles from './TopBar.module.css';

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.brand}>
        Tidal
      </div>
      
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="종목명, 티커, 혹은 명령어 입력..." 
          className={styles.searchInput}
        />
        <div className={styles.searchShortcut}>/</div>
      </div>
      
      <div className={styles.indexStrip}>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>KOSPI</span>
          <span className={styles.indexValue}>2,650.30</span>
          <span className={`${styles.indexChange} text-up`}>+0.8%</span>
        </div>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>KOSDAQ</span>
          <span className={styles.indexValue}>870.50</span>
          <span className={`${styles.indexChange} text-down`}>-0.3%</span>
        </div>
        <div className={styles.indexItem}>
          <span className={styles.indexName}>USD/KRW</span>
          <span className={styles.indexValue}>1,380.50</span>
          <span className={`${styles.indexChange} text-up`}>+2.0</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} title="설정">
          <Settings size={18} />
        </button>
        <button className={styles.iconButton} title="로그인/프로필">
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
