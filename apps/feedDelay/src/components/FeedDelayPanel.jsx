function fmtTime(ms) {
  return new Date(ms).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function fmtDelay(ms) {
  if (ms === null) return '—';
  if (ms < 0)    return `+${Math.abs(ms)}ms`;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function delayClass(ms) {
  if (ms === null || ms < 0) return '';
  if (ms < 500)  return 'delay-good';
  if (ms < 1500) return 'delay-warn';
  return 'delay-bad';
}

// Count ticks that arrived within the 1-second window ending at `receivedAt`
function calcTps(history, receivedAt) {
  const windowStart = receivedAt - 1000;
  return history.filter(r => r.receivedAt >= windowStart && r.receivedAt <= receivedAt).length;
}

export default function FeedDelayPanel({ stock }) {
  const rows = stock.history;

  return (
    <div className="delay-panel">
      <div className="delay-panel-header">
        <span className="delay-panel-title">Feed Delay — {stock.sym}</span>
        <span className="delay-panel-count">{rows.length} / 100 ticks</span>
      </div>

      <div className="delay-panel-scroll">
        <table>
          <thead>
            <tr>
              <th>LTT (exchange time)</th>
              <th>Received at</th>
              <th>Feed Delay</th>
              <th>Ticks / sec</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                  Waiting for ticks…
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td>{fmtTime(r.ltt * 1000)}</td>
                  <td>{fmtTime(r.receivedAt)}</td>
                  <td className={delayClass(r.delayMs)}>
                    <strong>{fmtDelay(r.delayMs)}</strong>
                  </td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {calcTps(rows, r.receivedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
