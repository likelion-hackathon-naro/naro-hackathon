import { useCallback, useState } from "react";

let routeIdCounter = 1;

/**
 * "경로 추가" 버튼 → 노드를 순서대로 클릭 → 경로 완성 → 목록에 저장 흐름을 관리.
 */
export default function useRouteBuilder() {
  const [isAdding, setIsAdding] = useState(false);
  const [currentPath, setCurrentPath] = useState([]); // node id 배열
  const [routes, setRoutes] = useState([]);

  const startAdding = useCallback(() => {
    setIsAdding(true);
    setCurrentPath([]);
  }, []);

  const cancelAdding = useCallback(() => {
    setIsAdding(false);
    setCurrentPath([]);
  }, []);

  const selectNode = useCallback(
    (nodeId) => {
      if (!isAdding) return;
      setCurrentPath((prev) => {
        // 같은 노드 연속 클릭 방지
        if (prev[prev.length - 1] === nodeId) return prev;
        return [...prev, nodeId];
      });
    },
    [isAdding],
  );

  const undoLastNode = useCallback(() => {
    setCurrentPath((prev) => prev.slice(0, -1));
  }, []);

  const finishRoute = useCallback(() => {
    if (currentPath.length < 2) return; // 최소 2개 노드는 있어야 경로
    setRoutes((prev) => [
      ...prev,
      {
        id: routeIdCounter++,
        name: `경로 ${prev.length + 1}`,
        path: currentPath,
      },
    ]);
    setIsAdding(false);
    setCurrentPath([]);
  }, [currentPath]);

  const removeRoute = useCallback((routeId) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
  }, []);

  return {
    isAdding,
    currentPath,
    routes,
    startAdding,
    cancelAdding,
    selectNode,
    undoLastNode,
    finishRoute,
    removeRoute,
  };
}
