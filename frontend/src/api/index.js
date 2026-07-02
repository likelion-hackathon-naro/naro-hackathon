const BASE_URL = "http://localhost:8080/api";

// 경로 비교 분석
export async function compareRoutes(routes, structuredData) {
  const res = await fetch(`${BASE_URL}/compare-routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      routes: routes.map((route) => ({
        id: route.routeId,
        name: route.title,
        optionIds: [route.routeId],
        favorite: true,
      })),
      context: {
        goal: structuredData?.goal || "졸업 후 커리어 시작",
        criteria: structuredData?.criteria || [],
        concerns: structuredData?.concerns || [],
      },
    }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// 할 일 생성
export async function generateTodos(selectedRoute, structuredData) {
  const res = await fetch(`${BASE_URL}/generate-todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      routeId: selectedRoute.routeId,
      optionIds: [selectedRoute.routeId],
      context: {
        goal: structuredData?.goal || "졸업 후 커리어 시작",
      },
    }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
