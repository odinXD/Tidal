import { Wifi, Database, Activity } from 'lucide-react';
import styles from './StatusBar.module.css';

export default function StatusBar() {
  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        <span className={styles.statusItem}>
          <Activity size={14} className={styles.iconConnected} />
          <span>네이버 금융 (시세)</span>
        </span>
        <span className={styles.statusItem}>
          <Database size={14} className={styles.iconWarning} />
          <span>DART (API 키 필요)</span>
        </span>
        <span className={styles.statusItem}>
          <Database size={14} className={styles.iconWarning} />
          <span>ECOS (API 키 필요)</span>
        </span>
      </div>
      
      <div className={styles.right}>
        <span className={styles.statusItem}>
          <Wifi size={14} className={styles.iconConnected} />
          <span>Connected</span>
        </span>
        <span className={styles.time}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
