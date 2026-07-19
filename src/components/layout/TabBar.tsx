import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, Globe, Briefcase, Newspaper, FileText, BrainCircuit, Wallet } from 'lucide-react';
import styles from './TabBar.module.css';

const TABS = [
  { path: '/market', name: '시장 (Market)', icon: LayoutDashboard },
  { path: '/stock/005930', name: '종목 (Stock)', icon: LineChart },
  { path: '/macro', name: '매크로 (Macro)', icon: Globe },
  { path: '/theme', name: '테마 (Theme)', icon: Briefcase },
  { path: '/news', name: '뉴스 (News)', icon: Newspaper },
  { path: '/disclosure', name: '공시 (DART)', icon: FileText },
  { path: '/research', name: 'AI 리서치', icon: BrainCircuit },
  { path: '/portfolio', name: '포트폴리오', icon: Wallet },
];

export default function TabBar() {
  return (
    <div className={styles.tabBar}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => 
              `${styles.tab} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={16} />
            <span>{tab.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
