import { useState } from "react";
import RouteComparePage from "./pages/RouteComparePage";
import TodoPage from "./pages/TodoPage";

function App() {
  const [page, setPage] = useState("compare"); // "compare" | "todo"
  const [selectedRoute, setSelectedRoute] = useState(null);

  if (page === "todo") {
    return <TodoPage onResetRoute={() => setPage("compare")} />;
  }

  return (
    <RouteComparePage
      onSelectMain={(route) => {
        setSelectedRoute(route);
        setPage("todo");
      }}
    />
  );
}

export default App;
