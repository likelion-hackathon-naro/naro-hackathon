// level: "green" | "yellow" | "red"
// label: 화면에 보여줄 텍스트 (e.g. "보통", "적음", "위험")

const COLOR_MAP = {
  green: { bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  yellow: { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308" },
  red: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
};

export default function SignalBadge({ level, label }) {
  const color = COLOR_MAP[level] || COLOR_MAP.yellow;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 13px",
        borderRadius: 20,
        fontSize: 15,
        fontWeight: 700,
        marginBottom: 2,
        background: color.bg,
        color: color.text,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color.dot,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
