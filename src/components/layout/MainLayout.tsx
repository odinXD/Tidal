import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import TabBar from './TabBar';
import StatusBar from './StatusBar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
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
