import { useState, useEffect } from "react";
import RouteComparePage from "./pages/RouteComparePage";
import TodoPage from "./pages/TodoPage";
import { compareRoutes, generateTodos } from "./api/index";
import { mockRoutes, mockTodos, mockStructured } from "./data/mockData";

function App() {
  const [page, setPage] = useState("compare");
  const [routes, setRoutes] = useState(mockRoutes);
  const [todoData, setTodoData] = useState(mockTodos);
  const [loading, setLoading] = useState(false);

  // 페이지 로드 시 경로 비교 API 호출
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await compareRoutes(mockRoutes, mockStructured);
        console.log("compareRoutes 응답:", data);
        // 응답 오면 여기서 routes 업데이트 (AI 연결되면 실제 데이터로 교체)
        // setRoutes(data.comparison.map(...));
      } catch (e) {
        console.error("compareRoutes 실패, mock data 사용:", e);
      }
    };
    fetchRoutes();
  }, []);

  const handleSelectMain = async (selectedRoute) => {
    setLoading(true);
    try {
      const data = await generateTodos(selectedRoute, mockStructured);
      console.log("generateTodos 응답:", data);
      setTodoData({
        selectedRoute: {
          id: selectedRoute.id,
          title: selectedRoute.title,
          isMain: true,
        },
        goal: mockStructured.goal,
        nextMilestone: mockTodos.nextMilestone,
        todos: data.todos,
      });
    } catch (e) {
      console.error("할 일 생성 실패, mock data 사용:", e);
    } finally {
      setLoading(false);
      setPage("todo");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Pretendard', sans-serif",
          fontSize: 16,
          color: "#5B6478",
        }}
      >
        할 일을 생성하고 있어요...
      </div>
    );
  }

  if (page === "todo") {
    return <TodoPage data={todoData} onResetRoute={() => setPage("compare")} />;
  }

  return <RouteComparePage routes={routes} onSelectMain={handleSelectMain} />;
}

export default App;
