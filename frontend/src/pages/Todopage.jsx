import { useState } from "react";
import { mockTodos } from "../data/mockData";

const FONT_STACK =
  "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

const BRAND_MAIN = "#3B6FE0";

export default function TodoPage({ data = mockTodos, onResetRoute }) {
  const [todos, setTodos] = useState(data.todos);

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  const completedCount = todos.filter((todo) => todo.done).length;
  const totalCount = todos.length;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingTodos = todos.filter((todo) => !todo.done);
  const completedTodos = todos.filter((todo) => todo.done);
  const orderedTodos = [...pendingTodos, ...completedTodos];

  const getStage = () => {
    if (totalCount === 0 || completedCount === 0) {
      return { img: "/lion_0.png", msg: "아직 갈 길이 멀어요, 힘내요!" };
    }
    const pct = completedCount / totalCount;
    if (pct >= 1) {
      return { img: "/lion_100.png", msg: "모든 할 일을 완료했어요!" };
    }
    if (pct >= 0.5) {
      return { img: "/lion_50.png", msg: "절반 왔어요, 잘하고 있어요!" };
    }
    return { img: "/lion_25.png", msg: "조금씩 나아가고 있어요!" };
  };

  const stage = getStage();
  const infoRows = [
    {
      label: "선택한 주요 경로",
      value: data.selectedRoute.title,
      badge: data.selectedRoute.isMain ? "메인 경로" : null,
    },
    { label: "예상 목적지", value: data.goal },
    { label: "다음 주요 이정표", value: data.nextMilestone },
  ];

  const renderTodoRow = (todo) => {
    const done = todo.done;

    return (
      <button
        key={todo.id}
        onClick={() => toggleTodo(todo.id)}
        type="button"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "15px 16px",
          border: "none",
          borderBottom: "0.5px solid #EEF3FB",
          background: done ? "#FAFBFE" : "#fff",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FONT_STACK,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: done ? `1.5px solid ${BRAND_MAIN}` : "1.5px solid #CBD5E1",
            background: done ? BRAND_MAIN : "#fff",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {done ? "✓" : ""}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: done ? 600 : 700,
            lineHeight: 1.45,
            color: done ? "#94A3B8" : "#16213E",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {todo.title}
        </span>
      </button>
    );
  };

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
            color: BRAND_MAIN,
          }}
        >
          나로▶
        </span>
      </nav>

      <main style={{ flex: 1, overflow: "auto", padding: "18px 2.5vw 16px" }}>
        <button
          type="button"
          onClick={onResetRoute}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 600,
            color: "#5B6478",
            marginBottom: 8,
            padding: 0,
            cursor: "pointer",
            fontFamily: FONT_STACK,
          }}
        >
          ← 경로 재설정하기
        </button>

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
            선택한 길을 한 걸음씩 실행해 나가요.
          </h1>
        </div>
        <p style={{ fontSize: 15, color: "#5B6478", margin: "0 0 26px" }}>
          작은 행동이 모여 목적지에 도착할 수 있어요.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(470px, 1fr) minmax(460px, 0.95fr)",
            gap: 22,
            alignItems: "stretch",
            maxWidth: 1260,
            minHeight: "clamp(560px, calc(100vh - 190px), 760px)",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              minHeight: "100%",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "0.5px solid #E2E8F4",
                overflow: "hidden",
                boxShadow: "0 8px 18px rgba(22, 33, 62, 0.04)",
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {infoRows.map((row, index) => (
                <div
                  key={row.label}
                  style={{
                    padding: "24px 26px",
                    borderBottom:
                      index < infoRows.length - 1
                        ? "0.5px solid #F1F5FB"
                        : "none",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#94A3B8",
                      marginBottom: 8,
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#16213E",
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {row.value}
                    </span>
                    {row.badge && (
                      <span
                        style={{
                          fontSize: 12,
                          background: "#E1EAFD",
                          color: BRAND_MAIN,
                          padding: "4px 9px",
                          borderRadius: 999,
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "0.5px solid #E2E8F4",
                boxShadow: "0 8px 18px rgba(22, 33, 62, 0.04)",
                display: "grid",
                gridTemplateColumns: "220px minmax(0, 1fr)",
                gap: 26,
                alignItems: "center",
                padding: "18px 24px",
                minHeight: 190,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#16213E",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stage.msg}
                </div>
                <img
                  src={stage.img}
                  alt="진행 상태"
                  style={{
                    width: 210,
                    height: 144,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 900,
                      color: "#16213E",
                    }}
                  >
                    전체 진행률
                  </span>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: BRAND_MAIN,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {progressPct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 12,
                    background: "#E2E8F4",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      background: BRAND_MAIN,
                      borderRadius: 999,
                      transition: "width 0.25s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                  marginTop: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textAlign: "right",
                  }}
                >
                  {completedCount}/{totalCount} 완료
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "0.5px solid #E2E8F4",
              overflow: "hidden",
              boxShadow: "0 8px 18px rgba(22, 33, 62, 0.04)",
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "0.5px solid #F1F5FB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#16213E",
                }}
              >
                할 일 목록
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94A3B8",
                }}
              >
                {completedCount}/{totalCount} 완료
              </span>
            </div>

            <div
              style={{
                padding: "16px 20px 20px",
                flex: 1,
                display: "flex",
              }}
            >
              <div
                style={{
                  border: "0.5px solid #E2E8F4",
                  borderRadius: 10,
                  overflow: "hidden",
                  width: "100%",
                  minHeight: "100%",
                  background: "#fff",
                }}
              >
                {orderedTodos.map((todo) => renderTodoRow(todo))}
                {orderedTodos.length === 0 && (
                  <div
                    style={{
                      padding: "26px 16px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textAlign: "center",
                      background: "#FAFBFE",
                    }}
                  >
                    아직 할 일이 없어요.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
