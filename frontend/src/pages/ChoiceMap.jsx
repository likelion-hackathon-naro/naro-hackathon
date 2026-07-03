import { useMemo } from "react";
import RouteCanvas from "../components/choice-map/RouteCanvas";
import AddRouteButton from "../components/choice-map/AddRouteButton";
import RoutePathList from "../components/choice-map/RoutePathList";
import useRouteBuilder from "../hooks/useRouteBuilder";
import "./ChoiceMap.css";

/**
 * @param {object} worryData - WorryInput 단계에서 넘어온 구조화 데이터
 */

function buildChoiceMapData(worryData) {
  const options = worryData?.options?.length
    ? worryData.options
    : worryData?.choices?.length
      ? worryData.choices
      : ["포트폴리오 강화", "휴학", "교환학생 준비"];

  const goalLabel = worryData?.goal || "목표";
  const currentItems = Array.isArray(worryData?.current)
    ? worryData.current
    : worryData?.current
      ? [worryData.current]
      : ["현재 상황"];

  const positions = [
    { x: 370, y: 205 },
    { x: 560, y: 385 },
    { x: 760, y: 215 },
    { x: 660, y: 115 },
  ];

  const choiceNodes = options.map((label, idx) => ({
    id: `opt-${idx + 1}`,
    type: "choice",
    label,
    x: positions[idx % positions.length].x,
    y: positions[idx % positions.length].y,
  }));

  return {
    options: options.map((title, idx) => ({ id: `opt-${idx + 1}`, title })),
    nodes: [
      {
        id: "start",
        type: "start",
        label: "현재",
        metaItems: currentItems,
        x: 150,
        y: 360,
      },
      ...choiceNodes,
      { id: "goal", type: "goal", label: goalLabel, x: 940, y: 405 },
    ],
  };
}

export default function ChoiceMap({ worryData, onCompare }) {
  const { nodes, options } = useMemo(
    () => buildChoiceMapData(worryData),
    [worryData],
  );
  const {
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
  } = useRouteBuilder();

  const selectedRoute = routes.find((route) => route.id === selectedRouteId);
  const compareRequestBody = {
    routes: selectedRoute
      ? [
          {
            id: selectedRoute.id,
            name: selectedRoute.name,
            optionIds: selectedRoute.optionIds,
          },
        ]
      : [],
    context: {
      goal: worryData?.goal ?? "",
      criteria: worryData?.criteria ?? [],
      concerns:
        worryData?.concerns ?? (worryData?.concern ? [worryData.concern] : []),
    },
  };

  const handleAnalyze = () => {
    if (onCompare) onCompare(compareRequestBody);
  };

  return (
    <div className="choice-map-page">
      <div className="choice-map-page__logo" aria-label="나로">
        나로<span>▶</span>
      </div>
      <h1 className="choice-map-page__title">선택지 지도가 완성됐어요</h1>
      <p className="choice-map-page__subtitle">
        섬을 순서대로 연결해 나만의 경로를 만들어 보세요.
      </p>

      <div className="choice-map-card">
        <div className="choice-map-card__toolbar">
          <div className="choice-map-card__summary">
            <span>
              <strong>최종 목표</strong> {worryData?.goal ?? "-"}
            </span>
            <span>
              <strong>주요 선택지</strong>{" "}
              {options.map((option) => option.title).join(" / ") || "-"}
            </span>
          </div>
          <AddRouteButton
            isAdding={isAdding}
            currentPathLength={currentPath.length}
            routeMessage={routeMessage}
            onStart={startAdding}
            onUndo={undoLastNode}
            onCancel={cancelAdding}
            onFinish={finishRoute}
          />
        </div>

        <div className="choice-map-card__body">
          <aside className="choice-map-card__routes">
            <div className="choice-map-card__routes-header">
              <h2 className="choice-map-card__routes-title">만든 경로</h2>
              <span className="choice-map-card__favorite-count">
                ★ {favoriteRouteIds.length}/3
              </span>
            </div>
            <RoutePathList
              nodes={nodes}
              routes={routes}
              selectedRouteId={selectedRouteId}
              favoriteRouteIds={favoriteRouteIds}
              onSelect={selectRoute}
              onToggleFavorite={toggleFavoriteRoute}
              onRemove={removeRoute}
            />

            {selectedRoute && (
              <div className="choice-map-card__route-detail">
                <span>선택한 경로</span>
                <strong>{selectedRoute.name}</strong>
                <p>
                  {selectedRoute.optionIds
                    .map(
                      (id) => nodes.find((node) => node.id === id)?.label ?? id,
                    )
                    .join(" → ")}
                </p>
              </div>
            )}

            <button
              type="button"
              className="choice-map-card__analyze-btn"
              disabled={!selectedRoute}
              onClick={handleAnalyze}
            >
              선택된 경로 분석하기
            </button>
          </aside>

          <section className="choice-map-card__map">
            <RouteCanvas
              nodes={nodes}
              routes={routes}
              currentPath={currentPath}
              isAdding={isAdding}
              selectedRouteId={selectedRouteId}
              onNodeClick={selectNode}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
