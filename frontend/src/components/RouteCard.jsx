// route: { id, title, description, tag, color }
// selected: boolean
// onClick: () => void

// 모든 경로 카드는 단일 파란 톤으로 통일
const BRAND = {
  main: "#3B6FE0",
  bgSoft: "#F2F6FE",
  tagBg: "#E1EAFD",
  tagText: "#2654C8",
};

export default function RouteCard({ route, selected, onClick }) {
  const { id, title, description, tag } = route;

  return (
    <div
      onClick={onClick}
      style={{
        border: `1.5px solid ${selected ? BRAND.main : "#E2E8F4"}`,
        borderRadius: 12,
        padding: "20px 22px",
        cursor: "pointer",
        background: selected ? BRAND.bgSoft : "#fff",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: BRAND.main,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 11,
            flexShrink: 0,
          }}
        >
          {id}
        </span>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#16213E" }}>
          {title}
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#5B6478",
          marginBottom: 12,
          lineHeight: 1.6,
          whiteSpace: "pre-line",
        }}
      >
        {description}
      </p>

      <span
        style={{
          display: "inline-block",
          padding: "3px 10px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 600,
          background: BRAND.tagBg,
          color: BRAND.tagText,
        }}
      >
        + {tag}
      </span>
    </div>
  );
}
