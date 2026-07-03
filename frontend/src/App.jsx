import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import WorryInput from "./pages/WorryInput";
import ChoiceMap from "./pages/ChoiceMap";
import RouteComparePage from "./pages/RouteComparePage";
import TodoPage from "./pages/TodoPage";
import { compareRoutes, generateTodos } from "./api/index";
import { mockRoutes, mockTodos, mockStructured } from "./data/mockData";
import "./App.css";

function App() {
  const [step, setStep] = useState("landing");
  const [worryData, setWorryData] = useState(null);
  const [routes, setRoutes] = useState(mockRoutes);
  const [todoData, setTodoData] = useState(mockTodos);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await compareRoutes(mockRoutes, mockStructured);
        console.log("compareRoutes 응답:", data);
      } catch (e) {
        console.error("compareRoutes 실패, mock data 사용:", e);
      }
    };
    if (step === "compare") fetchRoutes();
  }, [step]);

  const handleSelectMain = async (selectedRoute) => {
    setLoading(true);
    try {
      const data = await generateTodos(selectedRoute, mockStructured);
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
      setStep("todo");
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

  if (step === "landing")
    return (
      <Landing
        onStart={(data) => {
          setWorryData(data);
          setStep("input");
        }}
      />
    );
  if (step === "input")
    return (
      <WorryInput
        initialData={worryData}
        onSubmit={(data) => {
          setWorryData(data);
          setStep("map");
        }}
      />
    );
  if (step === "map")
    return (
      <ChoiceMap
        worryData={worryData}
        onCompare={(compareData) => {
          setWorryData((prev) => ({ ...prev, compareData }));
          setStep("compare");
        }}
      />
    );
  if (step === "compare")
    return (
      <RouteComparePage
        routes={routes}
        onSelectMain={handleSelectMain}
        onBack={() => setStep("map")}
      />
    );
  if (step === "todo")
    return <TodoPage data={todoData} onResetRoute={() => setStep("compare")} />;
  if (step === "todo")
    return (
      <TodoPage
        data={todoData}
        onResetRoute={() => setStep("compare")}
        onBack={() => setStep("map")}
      />
    );
}

export default App;
