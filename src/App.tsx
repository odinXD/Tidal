import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import MarketPage from './pages/MarketPage';
import StockDetailPage from './pages/StockDetailPage';
import MacroPage from './pages/MacroPage';
import ThemePage from './pages/ThemePage';
import NewsPage from './pages/NewsPage';
import DisclosurePage from './pages/DisclosurePage';
import ResearchPage from './pages/ResearchPage';
import PortfolioPage from './pages/PortfolioPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/market" replace />} />
        <Route path="market" element={<MarketPage />} />
        <Route path="stock/:code" element={<StockDetailPage />} />
        <Route path="macro" element={<MacroPage />} />
        <Route path="theme" element={<ThemePage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="disclosure" element={<DisclosurePage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
