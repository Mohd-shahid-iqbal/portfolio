import { useState } from 'react';
import StockRow from './StockRow';
import FeedDelayPanel from './FeedDelayPanel';

const TABS = ['All', 'Gainers', 'Losers'];

export default function StockTable({ stocks }) {
  const [query,       setQuery]       = useState('');
  const [tab,         setTab]         = useState('All');
  const [selectedKey, setSelectedKey] = useState(null);

  const list = Object.values(stocks)
    .filter(s => {
      if (tab === 'Gainers') return s.pct >= 0;
      if (tab === 'Losers')  return s.pct <  0;
      return true;
    })
    .filter(s =>
      !query ||
      s.sym.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.exchange.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="table-wrap">
      <div className="table-header">
        <div className="table-header-left">
          <span className="table-title">Live Feed</span>
          <div className="tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`tab${tab === t ? ' active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="search-bar">
          <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Instrument</th>
            <th>LTP (₹)</th>
            <th>Change</th>
            <th>% Change</th>
            <th className="col-spark">Trend</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s, i) => (
            <StockRow
              key={s.key}
              stock={s}
              index={i}
              selected={s.key === selectedKey}
              onClick={() => setSelectedKey(prev => prev === s.key ? null : s.key)}
            />
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>
                No results for &ldquo;{query}&rdquo;
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedKey && stocks[selectedKey] && (
        <FeedDelayPanel stock={stocks[selectedKey]} />
      )}
    </div>
  );
}
