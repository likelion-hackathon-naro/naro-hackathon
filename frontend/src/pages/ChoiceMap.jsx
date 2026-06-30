import { useMemo } from "react";
import RouteCanvas from "../components/choice-map/RouteCanvas";
import AddRouteButton from "../components/choice-map/AddRouteButton";
import RoutePathList from "../components/choice-map/RoutePathList";
import useRouteBuilder from "../hooks/useRouteBuilder";
import "./ChoiceMap.css";

/**
 * @param {object} worryData - WorryInput 단계에서 넘어온 구조화 데이터
 */

// 임의의 데이터
function buildChoiceMapData(worryData) {
  const choices = worryData?.choices?.length
    ? worryData.choices
    : ["포트폴리오 강화", "휴학", "교환학생 준비"];

  const goalLabel = worryData?.goal || "목표";

  const positions = [
    { x: 360, y: 300 },
    { x: 560, y: 420 },
    { x: 760, y: 260 },
    { x: 520, y: 160 },
  ];

  const choiceNodes = choices.map((label, idx) => ({
    id: `choice-${idx}`,
    type: "choice",
    label,
    x: positions[idx % positions.length].x,
    y: positions[idx % positions.length].y,
  }));

  return {
    nodes: [
      { id: "start", type: "start", label: "현재", x: 140, y: 420 },
      ...choiceNodes,
      { id: "goal", type: "goal", label: goalLabel, x: 940, y: 160 },
    ],
  };
}

export default function ChoiceMap({ worryData }) {
  const { nodes } = useMemo(() => buildChoiceMapData(worryData), [worryData]);

  //위의 부분 고치기

  const {
    isAdding,
    currentPath,
    routes,
    startAdding,
    cancelAdding,
    selectNode,
    undoLastNode,
    finishRoute,
    removeRoute,
  } = useRouteBuilder();

  return (
    <div className="choice-map-page">
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
              {worryData?.choices?.join(" / ") ?? "-"}
            </span>
          </div>
          <AddRouteButton
            isAdding={isAdding}
            currentPathLength={currentPath.length}
            onStart={startAdding}
            onUndo={undoLastNode}
            onCancel={cancelAdding}
            onFinish={finishRoute}
          />
        </div>

        <RouteCanvas
          nodes={nodes}
          routes={routes}
          currentPath={currentPath}
          isAdding={isAdding}
          onNodeClick={selectNode}
        />

        <div className="choice-map-card__routes">
          <h2 className="choice-map-card__routes-title">생성된 경로</h2>
          <RoutePathList nodes={nodes} routes={routes} onRemove={removeRoute} />
        </div>
      </div>
    </div>
  );
}
