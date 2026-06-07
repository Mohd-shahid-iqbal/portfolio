// Exchange numeric codes used by Pocketful
export const EXCHANGE_CODE = { NSE: 1, BSE: 2, MCX: 4 };

// Only these 4 instruments — instrument key format: "exchangeCode|token"
export const INSTRUMENT_LIST = [
  {
    key: "1|26000",
    exchange: "NSE",
    token: "26000",
    sym: "NIFTY 50",
    name: "Nifty 50 Index",
    color: "#3b82f6",
    cap: "INDEX",
  },
  {
    key: "1|26009",
    exchange: "NSE",
    token: "26009",
    sym: "NIFTY BANK",
    name: "Bank Nifty Index",
    color: "#8b5cf6",
    cap: "INDEX",
  },
  {
    key: "6|1",
    exchange: "BSE",
    token: "6",
    sym: "SENSEX",
    name: "BSE Sensex Index",
    color: "#f59e0b",
    cap: "INDEX",
  },
  {
    key: "4|488290",
    exchange: "MCX",
    token: "488290",
    sym: "MCX-488290",
    name: "MCX Commodity",
    color: "#22c55e",
    cap: "MCX",
  },
];

// key → instrument lookup
export const TOKEN_MAP = Object.fromEntries(
  INSTRUMENT_LIST.map((s) => [s.key, s]),
);

// Fallback prices shown before WS data arrives
export const FALLBACK_PRICES = {
  "1|26000": { price: 22531.05, prevClose: 22387.85 },
  "1|26009": { price: 48201.75, prevClose: 48283.9 },
  "2|1": { price: 74119.39, prevClose: 73672.51 },
  "4|488290": { price: 0, prevClose: 0 },
};

export const WS_URL =
  "wss://trade.pocketful.in/ws/v1/feeds?login_id=MD0002&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFja2xpc3Rfa2V5IjoiTUQwMDAyOjNad2RWNHdmRzZpcE1PazI0YW1ZMHciLCJjbGllbnRfaWQiOiJNRDAwMDIiLCJjbGllbnRfdG9rZW4iOiJYQ1AuT3IxVVF2MGFhSDJ4X2JaVldaYi1zbFo0WUgxS2RpUncyMUxKRnJZVWNTMHNMRml5aWFVY0p6NkQ0X1VSOXlEWmhDVGktM1FydXlZc0pWeWpNMGl0YW9nc3FhRUoxa1FYLURNM3hTT2xadXRYX1RkWjYxeVZiTkRyQkFFMDRaOExtSkU1Q0d2Q09nWjNMNml5a2dfRm8xR1Y3YTF3Wk5RSFRrZG9QSHVCM0NRNXFPTVNrcjNMeE56LVd1cXA0T1pwcXczZFNvX3VhNXoxQlZrUHREY00xMWh0IiwiZGV2aWNlIjoiYW5kcm9pZCIsImRldmljZV9pZCI6bnVsbCwiaXAiOm51bGwsImV4cCI6MTc3ODIxNjgxMzE5M30.fFtsuCsC4DUBVdnVMl8p_6UsRIVFWXhWcMPXLZ9b8XE";
