function fmt(n) {
  return n > 0
    ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—';
}

// instrument key → card config
const INDEX_CARDS = [
  { key: '1|26000', label: 'NIFTY 50',   icon: '📊' },
  { key: '2|1',     label: 'SENSEX',     icon: '🏦' },
  { key: '1|26009', label: 'BANK NIFTY', icon: '📉' },
];

function IndexCard({ stock }) {
  if (!stock) return null;
  const up    = stock.pct >= 0;
  const arrow = up ? '▲' : '▼';
  const cls   = up ? 'up' : 'down';

  return (
    <div className="card">
      <span className="card-icon">{stock._icon}</span>
      <div className="card-label">{stock._label}</div>
      <div className={`card-value${stock.flash ? ` flash-${stock.flash}` : ''}`}>
        {stock.price > 0 ? `₹${fmt(stock.price)}` : '—'}
      </div>
      <div className={`card-sub ${cls}`}>
        {stock.price > 0
          ? `${arrow} ${Math.abs(stock.chg).toFixed(2)} (${Math.abs(stock.pct).toFixed(2)}%)`
          : '—'}
      </div>
    </div>
  );
}

export default function SummaryCards({ stocks }) {
  const arr = Object.values(stocks);

  const topGainer = arr.reduce((best, s) => s.pct > best.pct ? s : best, arr[0]);
  const topLoser  = arr.reduce((best, s) => s.pct < best.pct ? s : best, arr[0]);

  return (
    <div className="cards">
      {INDEX_CARDS.map(cfg => {
        const s = stocks[cfg.key];
        return (
          <IndexCard
            key={cfg.key}
            stock={s ? { ...s, _label: cfg.label, _icon: cfg.icon } : null}
          />
        );
      })}

      {topGainer && (
        <div className="card">
          <span className="card-icon">🔥</span>
          <div className="card-label">Top Gainer</div>
          <div className="card-value" style={{ fontSize: '1.2rem', color: 'var(--green)' }}>
            {topGainer.sym}
          </div>
          <div className="card-sub up">▲ +{topGainer.pct.toFixed(2)}% · ₹{fmt(topGainer.price)}</div>
        </div>
      )}

      {topLoser && (
        <div className="card">
          <span className="card-icon">🧊</span>
          <div className="card-label">Top Loser</div>
          <div className="card-value" style={{ fontSize: '1.2rem', color: 'var(--red)' }}>
            {topLoser.sym}
          </div>
          <div className="card-sub down">▼ {topLoser.pct.toFixed(2)}% · ₹{fmt(topLoser.price)}</div>
        </div>
      )}
    </div>
  );
}
