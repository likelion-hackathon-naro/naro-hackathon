import { useCallback, useState } from "react";

let routeIdCounter = 1;

function isSamePath(a, b) {
  return a.length === b.length && a.every((id, idx) => id === b[idx]);
}

/**
 * "경로 추가" 버튼 → 노드를 순서대로 클릭 → 경로 완성 → 목록에 저장 흐름을 관리.
 */
export default function useRouteBuilder() {
  const [isAdding, setIsAdding] = useState(false);
  const [currentPath, setCurrentPath] = useState([]); // option id 배열
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [favoriteRouteIds, setFavoriteRouteIds] = useState([]);
  const [routeMessage, setRouteMessage] = useState("");

  const startAdding = useCallback(() => {
    setIsAdding(true);
    setCurrentPath([]);
    setRouteMessage("");
  }, []);

  const cancelAdding = useCallback(() => {
    setIsAdding(false);
    setCurrentPath([]);
    setRouteMessage("");
  }, []);

  const selectNode = useCallback(
    (nodeId) => {
      if (!isAdding) return;
      setRouteMessage("");
      setCurrentPath((prev) => {
        // 같은 노드 연속 클릭 방지
        if (prev[prev.length - 1] === nodeId) return prev;
        return [...prev, nodeId];
      });
    },
    [isAdding],
  );

  const undoLastNode = useCallback(() => {
    setRouteMessage("");
    setCurrentPath((prev) => prev.slice(0, -1));
  }, []);

  const finishRoute = useCallback(() => {
    if (currentPath.length < 1) return;
    const duplicateRoute = routes.find((route) =>
      isSamePath(route.optionIds ?? route.path ?? [], currentPath),
    );

    if (duplicateRoute) {
      setSelectedRouteId(duplicateRoute.id);
      setRouteMessage("이 경로와 동일합니다");
      setIsAdding(false);
      setCurrentPath([]);
      return;
    }

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
    setRouteMessage("");
    setIsAdding(false);
    setCurrentPath([]);
  }, [currentPath, routes]);

  const removeRoute = useCallback((routeId) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    setFavoriteRouteIds((prev) => prev.filter((id) => id !== routeId));
    setSelectedRouteId((prev) => (prev === routeId ? null : prev));
    setRouteMessage("");
  }, []);

  const selectRoute = useCallback((routeId) => {
    setSelectedRouteId(routeId);
    setRouteMessage("");
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
    routeMessage,
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
