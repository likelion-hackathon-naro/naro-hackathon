import { useCallback, useState } from "react";

let routeIdCounter = 1;

/**
 * "경로 추가" 버튼 → 노드를 순서대로 클릭 → 경로 완성 → 목록에 저장 흐름을 관리.
 */
export default function useRouteBuilder() {
  const [isAdding, setIsAdding] = useState(false);
  const [currentPath, setCurrentPath] = useState([]); // option id 배열
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [favoriteRouteIds, setFavoriteRouteIds] = useState([]);

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
    if (currentPath.length < 1) return;
    const id = `route-${routeIdCounter++}`;
    setRoutes((prev) => [
      ...prev,
      {
        id,
        name: `경로 ${prev.length + 1}`,
        optionIds: currentPath,
      },
    ]);
    setSelectedRouteId(id);
    setIsAdding(false);
    setCurrentPath([]);
  }, [currentPath]);

  const removeRoute = useCallback((routeId) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    setFavoriteRouteIds((prev) => prev.filter((id) => id !== routeId));
    setSelectedRouteId((prev) => (prev === routeId ? null : prev));
  }, []);

  const selectRoute = useCallback((routeId) => {
    setSelectedRouteId(routeId);
  }, []);

  const toggleFavoriteRoute = useCallback((routeId) => {
    setFavoriteRouteIds((prev) => {
      if (prev.includes(routeId)) {
        return prev.filter((id) => id !== routeId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, routeId];
    });
  }, []);

  return {
    isAdding,
    currentPath,
    routes,
    selectedRouteId,
    favoriteRouteIds,
    startAdding,
    cancelAdding,
    selectNode,
    undoLastNode,
    finishRoute,
    removeRoute,
    selectRoute,
    toggleFavoriteRoute,
  };
}
