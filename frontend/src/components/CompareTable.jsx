import { useState } from "react";
import SignalBadge from "./SignalBadge";
import TextList from "./TextList";

const ROW_CONFIG = [
  {
    key: "pros",
    label: "장점",
    icon: "👍",
    type: "list-only",
    listType: "pro",
  },
  {
    key: "cons",
    label: "단점",
    icon: "👎",
    type: "list-only",
    listType: "con",
  },
  { key: "risk", label: "리스크", icon: "⚠️", type: "signal-toggle" },
  { key: "taskLoad", label: "할 일 부담", icon: "📋", type: "signal-toggle" },
  { key: "fallback", label: "실패 시 대안", icon: "🔄", type: "list-only-dot" },
];

function Cell({ route, row, openRowKey, onToggle, selectedId }) {
  const isSelected = route.id === selectedId;
  const isOpen = openRowKey === row.key;

  if (row.type === "list-only") {
    return <TextList items={route[row.key]} type={row.listType} />;
  }

  if (row.type === "list-only-dot") {
    const data = route[row.key];
    const items = data?.options || data?.reasons || data?.tasks || [];
    return <TextList items={items} type="dot" />;
  }

  const data = route[row.key];
  if (!data) return null;
  const items = data.reasons || data.tasks || data.options || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div
        onClick={() => onToggle(row.key)}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          width: "fit-content",
        }}
      >
        <SignalBadge level={data.level} label={data.label} />
        <span style={{ fontSize: 11, color: "#94A3B8" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      {isOpen && (
        <div style={{ marginTop: 4 }}>
          <TextList items={items} type="dot" highlight={isSelected} />
        </div>
      )}
    </div>
  );
}

const BRAND_MAIN = "#3B6FE0";

export default function CompareTable({ routes, selectedId }) {
  const [openRowKey, setOpenRowKey] = useState(null);

  const handleToggle = (rowKey) => {
    setOpenRowKey((prev) => (prev === rowKey ? null : rowKey));
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "0.5px solid #E2E8F4",
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `160px repeat(${routes.length}, minmax(0, 1fr))`,
          background: "#F8FAFD",
          borderBottom: "0.5px solid #E2E8F4",
          padding: "13px 24px",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#5B6478" }}>
          비교 기준
        </span>
        {routes.map((route) => (
          <div
            key={route.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#16213E",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: BRAND_MAIN,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {route.id}
            </span>
            {route.title}
          </div>
        ))}
      </div>

      {/* 행들 */}
      {ROW_CONFIG.map((row, idx) => (
        <div
          key={row.key}
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${routes.length}, minmax(0, 1fr))`,
            padding: "10px 24px",
            gap: 10,
            borderBottom:
              idx < ROW_CONFIG.length - 1 ? "0.5px solid #F1F5FB" : "none",
            background: idx % 2 === 0 ? "#FAFBFE" : "#fff",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 15,
              fontWeight: 700,
              color: "#16213E",
              paddingTop: 2,
            }}
          >
            <span style={{ fontSize: 17 }}>{row.icon}</span>
            {row.label}
          </div>
          {routes.map((route) => (
            <Cell
              key={route.id}
              route={route}
              row={row}
              openRowKey={openRowKey}
              onToggle={handleToggle}
              selectedId={selectedId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
