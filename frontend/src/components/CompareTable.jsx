import { useState } from "react";
import SignalBadge from "./SignalBadge";
import TextList from "./TextList";

const ROW_CONFIG = [
  {
    key: "summary",
    label: "비교 기준",
    icon: null,
    type: "route-summary",
  },
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

  if (row.type === "route-summary") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          padding: 0,
          minHeight: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: isSelected ? BRAND_MAIN : "#16213E",
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.35,
          }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: BRAND_MAIN,
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {route.id}
          </span>
          {route.title}
        </div>
        <p
          style={{
            margin: 0,
            color: isSelected ? "#1F4FBF" : "#26324A",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1.55,
            overflowWrap: "anywhere",
          }}
        >
          <span
            style={{
              backgroundImage: isSelected
                ? "linear-gradient(transparent 56%, #DCE8FF 56%)"
                : "linear-gradient(transparent 60%, #EEF3FB 60%)",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            {route.summary || route.description}
          </span>
        </p>
        <span
          style={{
            width: "fit-content",
            borderRadius: 6,
            background: isSelected ? "#E1EAFD" : "#F2F6FE",
            color: "#2654C8",
            padding: "5px 11px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          + {route.tag}
        </span>
      </div>
    );
  }

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
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div
        onClick={() => onToggle(row.key)}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          width: "fit-content",
        }}
      >
        <SignalBadge level={data.level} label={data.label} />
        <span style={{ fontSize: 14, color: "#94A3B8" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      {isOpen && (
        <div style={{ marginTop: 6 }}>
          <TextList items={items} type="dot" highlight={isSelected} />
        </div>
      )}
    </div>
  );
}

const BRAND_MAIN = "#3B6FE0";
const TABLE_LABEL_WIDTH = 180;
const TABLE_GAP = 14;
const TABLE_PADDING_X = 26;

export default function CompareTable({ routes, selectedId, onSelectRoute }) {
  const [openRowKey, setOpenRowKey] = useState(null);
  const selectedIndex = routes.findIndex((route) => route.id === selectedId);
  const selectedFrame =
    routes.length > 0 && selectedIndex >= 0
      ? (() => {
          const fixedWidth =
            TABLE_PADDING_X * 2 + TABLE_LABEL_WIDTH + TABLE_GAP * routes.length;
          const leftPercent = (selectedIndex / routes.length) * 100;
          const leftPixels =
            TABLE_PADDING_X +
            TABLE_LABEL_WIDTH +
            TABLE_GAP +
            selectedIndex * TABLE_GAP -
            (selectedIndex * fixedWidth) / routes.length;

          return {
            left: `calc(${leftPercent}% + ${leftPixels}px)`,
            width: `calc((100% - ${fixedWidth}px) / ${routes.length})`,
          };
        })()
      : null;

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
        marginBottom: 0,
        minHeight: "clamp(540px, calc(100vh - 220px), 760px)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {selectedFrame && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: selectedFrame.left,
            width: selectedFrame.width,
            border: `3px solid ${BRAND_MAIN}`,
            borderRadius: 14,
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: 3,
            boxShadow:
              "0 10px 28px rgba(59, 111, 224, 0.14), inset 0 0 0 1px rgba(255, 255, 255, 0.9)",
          }}
        />
      )}

      {/* 행들 */}
      {ROW_CONFIG.map((row, idx) => (
        <div
          key={row.key}
          style={{
            display: "grid",
            gridTemplateColumns: `${TABLE_LABEL_WIDTH}px repeat(${routes.length}, minmax(0, 1fr))`,
            padding: "14px 26px",
            gap: TABLE_GAP,
            borderBottom:
              idx < ROW_CONFIG.length - 1 ? "0.5px solid #F1F5FB" : "none",
            background: idx % 2 === 0 ? "#FAFBFE" : "#fff",
            alignItems: "stretch",
            flex: row.type === "route-summary" ? "1.25 1 0" : "1 1 0",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 17,
              fontWeight: 800,
              color: "#16213E",
              paddingTop: 4,
            }}
          >
            {row.icon && <span style={{ fontSize: 19 }}>{row.icon}</span>}
            {row.label}
          </div>
          {routes.map((route) => {
            const isSelectedColumn = route.id === selectedId;

            return (
              <div
                key={route.id}
                onClick={
                  row.type === "route-summary"
                    ? () => onSelectRoute?.(route.id)
                    : undefined
                }
                style={{
                  minWidth: 0,
                  minHeight: "100%",
                  boxSizing: "border-box",
                  margin: "-14px 0",
                  padding: "14px 14px",
                  border: "2px solid transparent",
                  background: isSelectedColumn
                    ? "rgba(59, 111, 224, 0.045)"
                    : "transparent",
                  cursor: row.type === "route-summary" ? "pointer" : "default",
                }}
              >
                <Cell
                  route={route}
                  row={row}
                  openRowKey={openRowKey}
                  onToggle={handleToggle}
                  selectedId={selectedId}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
