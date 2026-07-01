import comparisonData from "../../../shared/mock/comparison.json";
import todosData from "../../../shared/mock/todos.json";
import structuredData from "../../../shared/mock/structured.json";

// ── structured.json ───────────────────────────────────────────
export const mockStructured = structuredData;

// ── comparison.json → RouteComparePage용 변환 ─────────────────
const ROUTE_META = [
  {
    id: "1",
    title: "경로 1",
    description: "인턴으로 실무를 쌓고\n바로 취업까지 노리는 균형형 경로",
    tag: "균형형",
  },
  {
    id: "2",
    title: "경로 2",
    description: "전공 전문성을 깊게 파는\n대학원 중심 경로",
    tag: "전문성 집중",
  },
  {
    id: "3",
    title: "경로 3",
    description: "준비 없이 바로 취업에\n뛰어드는 속도 우선 경로",
    tag: "속도 우선",
  },
];

export const mockRoutes = comparisonData.comparison.map((item, idx) => ({
  id: ROUTE_META[idx].id,
  routeId: item.routeId,
  title: ROUTE_META[idx].title,
  description: ROUTE_META[idx].description,
  tag: ROUTE_META[idx].tag,
  pros: item.pros,
  cons: item.cons,
  risk: {
    level: item.risk.level,
    label:
      item.risk.level === "green"
        ? "안정"
        : item.risk.level === "yellow"
          ? "보통"
          : "위험",
    reasons: item.risk.reasons,
  },
  taskLoad: {
    level: item.todoBurden.level,
    label:
      item.todoBurden.level === "green"
        ? "적음"
        : item.todoBurden.level === "yellow"
          ? "보통"
          : "많음",
    tasks: item.todoBurden.items,
  },
  fallback: {
    options: item.fallback,
  },
}));

// ── todos.json → TodoPage용 ───────────────────────────────────
export const mockTodos = {
  selectedRoute: {
    id: "A",
    title: "대기업 취업 준비",
    isMain: true,
  },
  goal: structuredData.goal,
  nextMilestone: "인턴 지원 마감",
  progress: {
    completed: 0,
    total: todosData.todos.length,
  },
  todos: todosData.todos,
};
