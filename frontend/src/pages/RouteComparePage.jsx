import { useState } from "react";
import RouteCard from "../components/RouteCard";
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
      <div style={{ flex: 1, overflow: "auto", padding: "12px 2.5vw 12px" }}>
        <div
          style={{
            fontSize: 11,
            color: "#5B6478",
            marginBottom: 4,
            cursor: "pointer",
          }}
        >
          ← 지도 보기로 돌아가기
        </div>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#16213E",
            margin: "0 0 2px",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}
        >
          여러 길을 비교하고, 지금의 나에게 맞는 길을 선택해요.
        </h1>
        <p style={{ fontSize: 11, color: "#5B6478", margin: "0 0 10px" }}>
          각 경로의 장단점과 나에게 중요한 기준을 비교해 보세요.
        </p>

        {/* 경로 카드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${routes.length}, minmax(0, 1fr))`,
            gap: 10,
            marginBottom: 10,
          }}
        >
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              selected={selectedId === route.id}
              onClick={() => setSelectedId(route.id)}
            />
          ))}
        </div>

        <CompareTable routes={routes} selectedId={selectedId} />

        {/* CTA */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            border: "0.5px solid #E2E8F4",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#3B6FE0",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
            }}
          >
            🚩
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#16213E",
                marginBottom: 1,
              }}
            >
              이 길을 나의 메인 경로로 설정할까요?
            </div>
            <div style={{ fontSize: 11, color: "#5B6478" }}>
              선택한 경로는 내 여정의 중심이 되어 계획과 알림이 맞춤으로
              제공돼요.
            </div>
          </div>
          <button
            onClick={() => onSelectMain?.(selectedRoute)}
            style={{
              marginLeft: "auto",
              background: "#3B6FE0",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: FONT_STACK,
            }}
          >
            경로 {selectedId}를 메인 경로로 설정
          </button>
        </div>
      </div>
    </div>
  );
}
