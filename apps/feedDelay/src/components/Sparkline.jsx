export default function Sparkline({ pts, up }) {
  const w = 80, h = 32;
  if (!pts || pts.length < 2) return <svg className="sparkline-svg" />;

  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;

  const points = pts
    .map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');

  const color = up ? '#22c55e' : '#ef4444';

  return (
    <svg className="sparkline-svg" viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
