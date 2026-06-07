import './App.css';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import StockTable from './components/StockTable';
import { useMarketWebSocket } from './hooks/useMarketWebSocket';

export default function App() {
  const { stocks, wsStatus, lastTick } = useMarketWebSocket();

  return (
    <div className="wrapper">
      <Header wsStatus={wsStatus} lastTick={lastTick} />
      <SummaryCards stocks={stocks} />
      <StockTable stocks={stocks} />
    </div>
  );
}
