import { useState } from "react";
import CompareTable from "../components/CompareTable";
import { mockRoutes } from "../data/mockData";

const FONT_STACK =
  "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

export default function RouteComparePage({
  routes = mockRoutes,
  onSelectMain,
  onBack,
}) {
  const [selectedId, setSelectedId] = useState(routes[0]?.id);
  const selectedRoute = routes.find((r) => r.id === selectedId);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F3F5F9",
        fontFamily: FONT_STACK,
        overflow: "hidden",
      }}
    >
      {/* nav */}
      <nav
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #E2E8F4",
          padding: "0 32px",
          height: 44,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "#3B6FE0",
            letterSpacing: "-0.02em",
          }}
        >
          나로▶
        </span>
      </nav>

      {/* 콘텐츠 - flex grow로 남은 높이 채움 */}
      <div style={{ flex: 1, overflow: "auto", padding: "18px 2.5vw 16px" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#5B6478",
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          ← 지도 보기로 돌아가기
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            margin: "0 0 6px",
          }}
        >
          <h1
            style={{
              flex: "1 1 auto",
              fontSize: 24,
              fontWeight: 800,
              color: "#16213E",
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            여러 길을 비교하고, 지금의 나에게 맞는 길을 선택해요.
          </h1>
          <button
            onClick={() => onSelectMain?.(selectedRoute)}
            style={{
              background: "#3B6FE0",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "11px 20px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: FONT_STACK,
              boxShadow: "0 8px 18px rgba(59, 111, 224, 0.18)",
            }}
          >
            경로 {selectedId}를 메인 경로로 설정
          </button>
        </div>
        <p style={{ fontSize: 15, color: "#5B6478", margin: "0 0 26px" }}>
          각 경로의 장단점과 나에게 중요한 기준을 비교해 보세요.
        </p>

        <CompareTable
          routes={routes}
          selectedId={selectedId}
          onSelectRoute={setSelectedId}
        />
      </div>
    </div>
  );
}
