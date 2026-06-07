import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Orbiting particles: [orbit-radius, speed(s), size(px), color, delay(s)]
const PARTICLES = [
  // Inner ring — 3 particles
  [105, 4.0, 7, "#6366f1", 0],
  [105, 4.0, 5, "#a78bfa", -1.33],
  [105, 4.0, 6, "#06b6d4", -2.66],
  // Mid ring — 4 particles
  [155, 7.0, 5, "#8b5cf6", 0],
  [155, 7.0, 6, "#6366f1", -1.75],
  [155, 7.0, 4, "#22d3ee", -3.5],
  [155, 7.0, 5, "#818cf8", -5.25],
  // Outer ring — 5 particles
  [205, 11.5, 5, "#6366f1", 0],
  [205, 11.5, 4, "#c4b5fd", -2.3],
  [205, 11.5, 6, "#67e8f9", -4.6],
  [205, 11.5, 4, "#818cf8", -6.9],
  [205, 11.5, 3, "#a78bfa", -9.2],
];

function PowerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v6" />
      <path d="M8.93 4.93A8 8 0 1 0 15.07 4.93" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H13L14 2H13z" />
    </svg>
  );
}

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [isSupported] = useState(() => "wakeLock" in navigator);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [justToggled, setJustToggled] = useState(false);
  const wakeLockRef = useRef(null);
  const timerRef = useRef(null);

  // Duration counter
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Re-acquire on tab focus
  useEffect(() => {
    const reacquire = async () => {
      if (
        document.visibilityState === "visible" &&
        isActive &&
        !wakeLockRef.current
      ) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch {
          /* silently ignore */
        }
      }
    };
    document.addEventListener("visibilitychange", reacquire);
    return () => document.removeEventListener("visibilitychange", reacquire);
  }, [isActive]);

  const toggle = useCallback(async () => {
    if (!isSupported) return;
    setError(null);
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 600);

    if (isActive) {
      await wakeLockRef.current?.release();
      wakeLockRef.current = null;
      setIsActive(false);
    } else {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          setIsActive(false);
          wakeLockRef.current = null;
        });
        setIsActive(true);
      } catch (err) {
        setError(err.message);
      }
    }
  }, [isActive, isSupported]);

  return (
    <div
      className={`app${isActive ? " app--active" : ""}${justToggled ? " app--toggled" : ""}`}
    >
      {/* Background layers */}
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-vignette" />

      {/* Header */}
      <header className="header">
        <div className="wordmark">
          <span className="wordmark-icon">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span className="wordmark-text">Wake Guard</span>
        </div>
        <p className="header-sub">Screen Sleep Prevention · Wake Lock API</p>
      </header>

      {/* ── Stage ──────────────────────────────────── */}
      <div className="stage">
        {/* Pulse waves radiate outward when active */}
        {isActive && (
          <>
            <div className="pulse pw1" />
            <div className="pulse pw2" />
            <div className="pulse pw3" />
          </>
        )}

        {/* Orbit rings */}
        <div className="ring r4" />
        <div className="ring r3" />
        <div className="ring r2" />
        <div className="ring r1" />

        {/* Orbiting particles — only when active */}
        {isActive &&
          PARTICLES.map(([orbit, speed, size, color, delay], i) => (
            <div
              key={i}
              className="orbit-wrap"
              style={{
                width: orbit * 2,
                height: orbit * 2,
                animationDuration: `${speed}s`,
                animationDelay: `${delay}s`,
                animationDirection: i % 2 === 0 ? "normal" : "reverse",
              }}
            >
              <div
                className="particle"
                style={{
                  width: size,
                  height: size,
                  marginTop: -(size / 2),
                  marginLeft: -(size / 2),
                  background: color,
                  boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 5}px ${color}55`,
                }}
              />
            </div>
          ))}

        {/* ── Core button ── */}
        <button
          className={`core${isActive ? " core--on" : " core--off"}`}
          onClick={toggle}
          disabled={!isSupported}
          aria-pressed={isActive}
          aria-label={isActive ? "Deactivate wake lock" : "Activate wake lock"}
        >
          {/* Spinning rainbow border (active only) */}
          {isActive && <div className="core-ring-border" />}

          {/* Icon + label */}
          <div className="core-body">
            <div className="core-icon">
              {isActive ? <BoltIcon /> : <PowerIcon />}
            </div>
            <span className="core-label">
              {isActive ? "DEACTIVATE" : "ACTIVATE"}
            </span>
          </div>
        </button>
      </div>
      {/* ────────────────────────────────────────────── */}

      {/* Status line */}
      <div className="status-row">
        <span className={`dot${isActive ? " dot--on" : ""}`} />
        <span className="status-text">
          {!isSupported
            ? "Wake Lock API not supported in this browser"
            : error
              ? `Error: ${error}`
              : isActive
                ? "Screen sleep prevention is active — screen will stay on"
                : "Click ACTIVATE to prevent your screen from sleeping"}
        </span>
      </div>

      {/* Active duration */}
      <div
        className={`timer${isActive ? " timer--show" : ""}`}
        aria-live="polite"
      >
        <span className="timer-label">ACTIVE FOR</span>
        <span className="timer-value">{formatTime(duration)}</span>
      </div>

      {/* Bottom badges */}
      <div className="badges">
        {[
          ["⚡", "Wake Lock API"],
          [
            isActive ? "🔓" : "🔒",
            isActive ? "Screen locked awake" : "System default",
          ],
          [isActive ? "🟢" : "⚫", isActive ? "Protected" : "Unprotected"],
        ].map(([icon, text]) => (
          <span className="badge" key={text}>
            <span>{icon}</span>
            <span>{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
