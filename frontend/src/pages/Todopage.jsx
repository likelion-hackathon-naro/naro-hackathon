import { useState } from "react";
import { mockTodos } from "../data/mockData";

const FONT_STACK =
  "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

export default function TodoPage({ data = mockTodos, onResetRoute }) {
  const [todos, setTodos] = useState(data.todos);

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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

      <div style={{ flex: 1, overflow: "auto", padding: "6px 2.5vw" }}>
        {/* 뒤로가기 */}
        <div
          style={{
            fontSize: 13,
            color: "#5B6478",
            marginBottom: 4,
            cursor: "pointer",
          }}
        >
          ← 지도 보기로 돌아가기
        </div>

        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#16213E",
                margin: "0 0 3px",
                letterSpacing: "-0.02em",
              }}
            >
              선택한 길을 한 걸음씩 실행해 나가요.
            </h1>
            <p style={{ fontSize: 14, color: "#5B6478", margin: 0 }}>
              작은 행동이 모여 목적지에 도착할 수 있어요.
            </p>
          </div>
          <img
            src="/lion_island.png"
            alt="island"
            style={{ height: 160, width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* 요약 헤더 카드 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            border: "0.5px solid #E2E8F4",
            padding: "12px 20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 12,
            marginBottom: 14,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 3 }}>
              선택한 주요 경로
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#16213E",
                marginBottom: 3,
              }}
            >
              {data.selectedRoute.title}
            </div>
            {data.selectedRoute.isMain && (
              <span
                style={{
                  fontSize: 10,
                  background: "#E1EAFD",
                  color: "#3B6FE0",
                  padding: "1px 7px",
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                메인 경로
              </span>
            )}
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 3 }}>
              예상 목적지
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#16213E" }}>
              {data.goal}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 3 }}>
              다음 주요 이정표
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#16213E" }}>
              {data.nextMilestone}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 4 }}>
              전체 진행률
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: "#E2E8F4",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: "100%",
                    background: "#3B6FE0",
                    borderRadius: 10,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#3B6FE0",
                  whiteSpace: "nowrap",
                }}
              >
                {progressPct}%
              </span>
            </div>
          </div>
        </div>

        {/* 할 일 목록 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            border: "0.5px solid #E2E8F4",
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "0.5px solid #F1F5FB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#16213E" }}>
              할 일 목록
            </span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>
              {completedCount}/{totalCount} 완료
            </span>
          </div>

          {/* 아이템들 */}
          <div style={{ padding: "4px 0" }}>
            {todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 20px",
                  cursor: "pointer",
                  borderBottom: "0.5px solid #F8FAFD",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `1.5px solid ${todo.done ? "#3B6FE0" : "#CBD5E1"}`,
                    background: todo.done ? "#3B6FE0" : "#fff",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  {todo.done && (
                    <span
                      style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: todo.done ? "#94A3B8" : "#16213E",
                    textDecoration: todo.done ? "line-through" : "none",
                    flex: 1,
                    transition: "all 0.15s",
                  }}
                >
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 경로 재설정 배너 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            border: "0.5px solid #E2E8F4",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 22 }}>🏝️</div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#16213E",
                marginBottom: 1,
              }}
            >
              길이 막히거나 계획이 변경되었나요?
            </div>
            <div style={{ fontSize: 11, color: "#5B6478" }}>
              상황에 맞게 경로를 재설정하여 새로운 최적의 길을 안내해 드릴게요.
            </div>
          </div>
          <button
            onClick={onResetRoute}
            style={{
              marginLeft: "auto",
              background: "#fff",
              color: "#3B6FE0",
              border: "1.5px solid #3B6FE0",
              borderRadius: 8,
              padding: "7px 16px",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: FONT_STACK,
            }}
          >
            ↺ 경로 재설정하기
          </button>
        </div>
      </div>
    </div>
  );
}
