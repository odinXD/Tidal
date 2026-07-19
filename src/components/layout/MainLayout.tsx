import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import TopBar from './TopBar';
import TabBar from './TabBar';
import StatusBar from './StatusBar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const { fetchMarketData } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
    // 1분마다 갱신
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  return (
    <div className={styles.layoutContainer}>
      <TopBar />
      <TabBar />
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      
      <StatusBar />
    </div>
  );
}
