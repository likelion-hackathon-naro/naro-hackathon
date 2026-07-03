import { useState } from "react";
import { mockTodos } from "../data/mockData";

const FONT_STACK =
  "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

export default function TodoPage({ data = mockTodos, onResetRoute, onBack }) {
  const [todos, setTodos] = useState(data.todos);

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const getStage = (completed, total) => {
    if (total === 0 || completed === 0)
      return { img: "/lion_0.png", msg: "아직 갈 길이 멀어요, 힘내요! 🌱" };
    const pct = completed / total;
    if (pct >= 1)
      return {
        img: "/lion_100.png",
        msg: "모든 할 일을 완료했어요! 축하해요! 🎉",
      };
    if (pct >= 0.5)
      return { img: "/lion_50.png", msg: "절반 왔어요! 잘 하고 있어요 💪" };
    return { img: "/lion_25.png", msg: "조금씩 나아가고 있어요! 🔥" };
  };

  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const stage = getStage(completedCount, totalCount);

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
            color: "#3B6FE0",
            letterSpacing: "-0.02em",
          }}
        >
          나로▶
        </span>
      </nav>

      <div style={{ flex: 1, overflow: "auto", padding: "0 2.5vw" }}>
        {/* 뒤로가기 */}
        <div
          onClick={onBack}
          style={{
            fontSize: 13,
            color: "#5B6478",
            marginBottom: 2,
            cursor: "pointer",
            paddingTop: 6,
          }}
        >
          ← 지도 보기로 돌아가기
        </div>

        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ paddingTop: 2 }}>
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

          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                bottom: "65%",
                right: "105%",
                marginRight: 4,
                background: "#fff",
                border: "1.5px solid #E2E8F4",
                borderRadius: 12,
                padding: "7px 12px",
                fontSize: 12,
                fontWeight: 600,
                color: "#16213E",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {stage.msg}
              <div
                style={{
                  position: "absolute",
                  right: -8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "8px solid #fff",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: "9px solid #E2E8F4",
                  zIndex: -1,
                }}
              />
            </div>
            <img
              src={stage.img}
              alt="island"
              style={{
                width: 220,
                height: 160,
                objectFit: "contain",
                objectPosition: "center top",
                display: "block",
                marginTop: -10,
              }}
            />
          </div>
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
            marginBottom: 12,
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              height: 280,
            }}
          >
            {/* 왼쪽 - 미완료 */}
            <div
              style={{
                borderRight: "0.5px solid #F1F5FB",
                overflowY: "auto",
                height: "100%",
              }}
            >
              <div
                style={{
                  padding: "6px 0",
                  borderBottom: "0.5px solid #F1F5FB",
                }}
              >
                <span
                  style={{ fontSize: 11, color: "#94A3B8", padding: "0 16px" }}
                >
                  진행 중
                </span>
              </div>
              {todos
                .filter((t) => !t.done)
                .map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "0.5px solid #F8FAFD",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: "1.5px solid #CBD5E1",
                        background: "#fff",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#16213E", flex: 1 }}>
                      {todo.title}
                    </span>
                  </div>
                ))}
              {todos.filter((t) => !t.done).length === 0 && (
                <div
                  style={{
                    padding: "20px 16px",
                    fontSize: 12,
                    color: "#94A3B8",
                    textAlign: "center",
                  }}
                >
                  모두 완료했어요! 🎉
                </div>
              )}
            </div>
            {/* 오른쪽 - 완료 */}
            <div style={{ overflowY: "auto", height: "100%" }}>
              <div
                style={{
                  padding: "6px 0",
                  borderBottom: "0.5px solid #F1F5FB",
                }}
              >
                <span
                  style={{ fontSize: 11, color: "#94A3B8", padding: "0 16px" }}
                >
                  완료
                </span>
              </div>
              {todos
                .filter((t) => t.done)
                .map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "0.5px solid #F8FAFD",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: "1.5px solid #3B6FE0",
                        background: "#3B6FE0",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}
                      >
                        ✓
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#94A3B8",
                        textDecoration: "line-through",
                        flex: 1,
                      }}
                    >
                      {todo.title}
                    </span>
                  </div>
                ))}
              {todos.filter((t) => t.done).length === 0 && (
                <div
                  style={{
                    padding: "20px 16px",
                    fontSize: 12,
                    color: "#94A3B8",
                    textAlign: "center",
                  }}
                >
                  완료한 항목이 없어요
                </div>
              )}
            </div>
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
