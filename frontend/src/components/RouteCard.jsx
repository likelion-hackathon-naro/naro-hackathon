import { useState } from "react";
import RouteCard from "../components/RouteCard";
import CompareTable from "../components/CompareTable";
import { mockRoutes } from "../data/mockData";

const FONT_STACK =
  "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

export default function RouteComparePage({
  routes = mockRoutes,
  onSelectMain,
}) {
  const [selectedId, setSelectedId] = useState(routes[0]?.id);
  const selectedRoute = routes.find((r) => r.id === selectedId);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F5F9",
        fontFamily: FONT_STACK,
      }}
    >
      <nav
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #E2E8F4",
          padding: "0 40px",
          height: 52,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 17,
            color: "#16213E",
            letterSpacing: "-0.02em",
          }}
        >
          나로▶
        </span>
      </nav>

      <div
        style={{ maxWidth: "none", margin: "0 auto", padding: "32px 5vw 64px" }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#5B6478",
            marginBottom: 18,
            cursor: "pointer",
          }}
        >
          ← 지도 보기로 돌아가기
        </div>

        <h1
          style={{
            fontSize: 23,
            fontWeight: 700,
            color: "#16213E",
            margin: "0 0 4px",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
          }}
        >
          여러 길을 비교하고, 지금의 나에게 맞는 길을 선택해요.
        </h1>
        <p style={{ fontSize: 13, color: "#5B6478", margin: "0 0 24px" }}>
          각 경로의 장단점과 나에게 중요한 기준을 비교해 보세요.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${routes.length}, minmax(0, 1fr))`,
            gap: 16,
            marginBottom: 28,
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

        <CompareTable routes={routes} />

        {/* 메인 경로 설정 CTA */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "0.5px solid #E2E8F4",
            padding: "22px 28px",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#3B6FE0",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            🚩
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#16213E",
                marginBottom: 3,
              }}
            >
              이 길을 나의 메인 경로로 설정할까요?
            </div>
            <div style={{ fontSize: 12, color: "#5B6478", marginBottom: 2 }}>
              선택한 경로는 내 여정의 중심이 되어 계획과 알림이 맞춤으로
              제공돼요.
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>
              ⓘ 언제든지 다른 경로로 변경할 수 있어요.
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
              padding: "11px 22px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: FONT_STACK,
            }}
          >
            Route {selectedId}를 메인 경로로 설정
          </button>
        </div>
      </div>
    </div>
  );
}
