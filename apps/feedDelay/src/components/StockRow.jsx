import Sparkline from './Sparkline';

function fmt(n) {
  return n > 0
    ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—';
}

export default function StockRow({ stock, index, selected, onClick }) {
  const up    = stock.pct >= 0;
  const arrow = up ? '▲' : '▼';
  const cls   = up ? 'up' : 'down';

  return (
    <tr className={selected ? 'row-selected' : ''} onClick={onClick} style={{ cursor: 'pointer' }}>
      <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
        {String(index + 1).padStart(2, '0')}
      </td>

      <td>
        <div className="sym-cell">
          <div
            className="sym-avatar"
            style={{ background: `${stock.color}22`, color: stock.color }}
          >
            {stock.exchange}
          </div>
          <div>
            <div className="sym-name">{stock.sym}</div>
            <div className="sym-full">{stock.name}</div>
          </div>
        </div>
      </td>

      <td className={`price-cell${stock.flash ? ` flash-${stock.flash}` : ''}`}>
        {stock.price > 0 ? `₹${fmt(stock.price)}` : '—'}
      </td>

      <td className={cls} style={{ fontSize: '0.85rem' }}>
        {stock.price > 0 ? `${arrow} ₹${Math.abs(stock.chg).toFixed(2)}` : '—'}
      </td>

      <td>
        {stock.price > 0
          ? <span className={`badge ${cls}`}>{arrow} {Math.abs(stock.pct).toFixed(2)}%</span>
          : <span style={{ color: 'var(--muted)' }}>—</span>}
      </td>

      <td className="col-spark">
        <Sparkline pts={stock.spark} up={up} />
      </td>

      <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
        {stock.cap}
      </td>
    </tr>
  );
}
