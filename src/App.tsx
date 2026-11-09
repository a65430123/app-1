import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useApplySettings } from '@/lib/useApplySettings';
import Home from '@/routes/Home';
import Trades from '@/routes/Trades';
import TradeDetail from '@/routes/TradeDetail';
import Procedure from '@/routes/Procedure';
import Search from '@/routes/Search';
import Tools from '@/routes/Tools';
import CalculatorPage from '@/routes/CalculatorPage';
import Me from '@/routes/Me';
import Settings from '@/routes/Settings';
import NotFound from '@/routes/NotFound';
import { Materials, MaterialDetail, Glossary, TermDetail, Favorites, History } from '@/routes/Simple';

export default function App() {
  useApplySettings();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="trades" element={<Trades />} />
          <Route path="trades/:tradeId" element={<TradeDetail />} />
          <Route path="procedures/:id" element={<Procedure />} />
          <Route path="materials" element={<Materials />} />
          <Route path="materials/:id" element={<MaterialDetail />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="glossary/:id" element={<TermDetail />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/:calcId" element={<CalculatorPage />} />
          <Route path="search" element={<Search />} />
          <Route path="me" element={<Me />} />
          <Route path="me/favorites" element={<Favorites />} />
          <Route path="me/history" element={<History />} />
          <Route path="me/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
