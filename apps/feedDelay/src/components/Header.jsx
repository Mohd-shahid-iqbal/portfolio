import { useState, useEffect } from 'react';

const STATUS_LABEL = {
  connecting: 'Connecting…',
  open:       'Market Live',
  closed:     'Disconnected',
  error:      'Error',
};

function useAgo(lastTick) {
  const [ago, setAgo] = useState('');

  useEffect(() => {
    if (!lastTick) { setAgo(''); return; }
    const update = () => {
      const s = Math.floor((Date.now() - lastTick) / 1000);
      setAgo(s < 5 ? 'just now' : `${s}s ago`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastTick]);

  return ago;
}

export default function Header({ wsStatus, lastTick }) {
  const [time,       setTime]       = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const ago = useAgo(lastTick);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pulseClass =
    wsStatus === 'open'       ? 'pulse' :
    wsStatus === 'connecting' ? 'pulse connecting' :
    'pulse disconnected';

  return (
    <>
      <header>
        <div className="logo">
          <div className="logo-icon">📈</div>
          <div className="logo-text">Pace<span>Markets</span></div>
        </div>

        <div className="header-right">
          <div className="status-bar">
            <div className={pulseClass} />
            <span>{STATUS_LABEL[wsStatus] ?? wsStatus}</span>
            {ago && <span className="clock">· {ago}</span>}
            <span className="clock">{time}</span>
          </div>
          <div className="status-bar" style={{ color: 'var(--gold)' }}>NSE · BSE</div>

          <button
            className="search-toggle"
            onClick={() => setSearchOpen(o => !o)}
            title="Search"
          >
            {searchOpen ? '✕' : '🔍'}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-overlay">
          <div className="search-iframe-wrap">
            <div className="search-iframe-bar">
              <span className="search-iframe-label">DuckDuckGo Search</span>
              <button className="search-iframe-close" onClick={() => setSearchOpen(false)}>✕</button>
            </div>
            <iframe
              src="https://duckduckgo.com/"
              title="Search"
              className="search-iframe"
              allow="fullscreen"
            />
          </div>
        </div>
      )}
    </>
  );
}
