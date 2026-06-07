import { useEffect, useState } from "react";
import {
  WS_URL,
  INSTRUMENT_LIST,
  TOKEN_MAP,
  FALLBACK_PRICES,
} from "../constants/stocks";

// ── Binary protocol helpers (matches Pocketful WebsocketUtil reference) ──────

function convert(bytes) {
  // Big-endian signed integer. Handles 1-byte and 4-byte slices.
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length === 4) return view.getInt32(0, false);
  if (bytes.length === 1) return bytes[0];
  return view.getInt32(0, false);
}

function conversionForCDS(exchange, value) {
  // CDS exchanges (3 = NSE-CDS, 6 = BSE-CDS) use 7 decimal places; others ÷100
  if (exchange === 3 || exchange === 6) return value / 100;
  return value / 100;
}

function parseCompactMarketData(binpacks) {
  const ticks = {};
  ticks.exchange = convert(binpacks.slice(1, 2));
  ticks.instrumentToken = convert(binpacks.slice(2, 6));
  ticks.ltp = conversionForCDS(ticks.exchange, convert(binpacks.slice(6, 10)));
  ticks.change = conversionForCDS(
    ticks.exchange,
    convert(binpacks.slice(10, 14)),
  );
  ticks.ltt = convert(binpacks.slice(14, 18));
  ticks.lowdpr = conversionForCDS(
    ticks.exchange,
    convert(binpacks.slice(18, 22)),
  );
  ticks.highdpr = conversionForCDS(
    ticks.exchange,
    convert(binpacks.slice(22, 26)),
  );
  ticks.currentOpenInterest = convert(binpacks.slice(26, 30));
  ticks.initialOpenInterest = convert(binpacks.slice(30, 34));
  ticks.bidPrice = conversionForCDS(
    ticks.exchange,
    convert(binpacks.slice(34, 38)),
  );
  ticks.askPrice = conversionForCDS(
    ticks.exchange,
    convert(binpacks.slice(38, 42)),
  );
  return { ticks, mode: "compactMarketData" };
}

// ── Sparkline seed ───────────────────────────────────────────────────────────

function generateSpark(basePrice) {
  if (!basePrice) return [];
  let p = basePrice * (0.985 + Math.random() * 0.03);
  const pts = [];
  for (let i = 0; i < 20; i++) {
    p += (Math.random() - 0.5) * basePrice * 0.003;
    pts.push(+p.toFixed(2));
  }
  return pts;
}

function buildInitialState() {
  return Object.fromEntries(
    INSTRUMENT_LIST.map((inst) => {
      const fb = FALLBACK_PRICES[inst.key] ?? { price: 0, prevClose: 0 };
      const chg = fb.price - fb.prevClose;
      const pct = fb.prevClose ? (chg / fb.prevClose) * 100 : 0;
      return [
        inst.key,
        {
          ...inst,
          price: fb.price,
          prevClose: fb.prevClose,
          chg,
          pct,
          vol: 0,
          spark: generateSpark(fb.price),
          flash: null,
          open: 0,
          high: 0,
          low: 0,
          ltt: 0,
          history: [], // last 100 { ltt, receivedAt, delayMs }
        },
      ];
    }),
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useMarketWebSocket() {
  const [stocks, setStocks] = useState(buildInitialState);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [lastTick, setLastTick] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      setWsStatus("open");
      INSTRUMENT_LIST.forEach((inst) => {
        const [exchCode, token] = inst.key.split("|");
        ws.send(
          JSON.stringify({
            a: "subscribe",
            v: [[parseInt(exchCode), token]],
            m: "compact_marketdata",
          }),
        );
      });

      const hbId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ a: "h", v: [], m: "" }));
        }
      }, 5000);
      ws._hbId = hbId;
    };

    ws.onmessage = (event) => {
      if (!(event.data instanceof ArrayBuffer)) return;

      const u8 = new Uint8Array(event.data);
      if (u8[0] !== 2) return;

      const { ticks } = parseCompactMarketData(u8);

      const key = `${ticks.exchange}|${ticks.instrumentToken}`;
      if (!TOKEN_MAP[key]) return;

      if (ticks.ltp > 0) {
        const price = ticks.ltp;
        const prevClose = ticks.ltp - ticks.change;
        const receivedAt = Date.now();
        // ltt is Unix seconds from the binary frame
        const ltt = ticks.ltt;
        const delayMs = ltt > 0 ? receivedAt - ltt * 1000 : null;

        // skip entries where exchange didn't send a trade time
        if (!ltt) return;

        const entry = { ltt, receivedAt, delayMs };

        setStocks((prev) => {
          const s = prev[key];
          if (!s) return prev;
          const chg = price - (prevClose > 0 ? prevClose : s.prevClose);
          const pc = prevClose > 0 ? prevClose : s.prevClose;
          const pct = pc ? (chg / pc) * 100 : 0;
          const flash =
            price > s.price ? "up" : price < s.price ? "down" : s.flash;
          const spark = [...s.spark.slice(-29), price];
          // newest first; drop the 100th when full
          const history = [entry, ...s.history.slice(0, 99)];
          return {
            ...prev,
            [key]: {
              ...s,
              price,
              prevClose: pc,
              chg,
              pct,
              flash,
              spark,
              ltt,
              history,
            },
          };
        });

        setLastTick(receivedAt);

        setTimeout(() => {
          setStocks((prev) => {
            const s = prev[key];
            if (!s) return prev;
            return { ...prev, [key]: { ...s, flash: null } };
          });
        }, 750);
      }
    };

    ws.onerror = () => setWsStatus("error");
    ws.onclose = () => {
      clearInterval(ws._hbId);
      setWsStatus("closed");
    };

    return () => {
      clearInterval(ws._hbId);
      ws.close();
    };
  }, []); // ← empty deps: connect once on mount, never again

  return { stocks, wsStatus, lastTick };
}
