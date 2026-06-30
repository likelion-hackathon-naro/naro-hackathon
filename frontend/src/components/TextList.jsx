// type: "pro" | "con" | "dot" — 앞에 붙는 마커 스타일
// items: string[]

const MARKER = {
  pro: { symbol: "✓", color: "#22C55E" },
  con: { symbol: "✕", color: "#EF4444" },
  dot: { symbol: "•", color: "#94A3B8" },
};

export default function TextList({ items = [], type = "dot" }) {
  const marker = MARKER[type] || MARKER.dot;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: 13,
            color: "#5B6478",
            display: "flex",
            alignItems: "flex-start",
            gap: 5,
            lineHeight: 1.55,
          }}
        >
          <span
            style={{
              color: marker.color,
              fontWeight: 700,
              fontSize: 12,
              marginTop: 2,
              flexShrink: 0,
            }}
          >
            {marker.symbol}
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
