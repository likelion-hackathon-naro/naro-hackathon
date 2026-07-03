import IslandNode from "./IslandNode";
import "./RouteCanvas.css";

const ROUTE_COLORS = ["#3b6cf6", "#22a366", "#f5a524", "#a855f7", "#ef4444"];

function getDisplayPath(route) {
  if (route.path) return route.path;
  return ["start", ...(route.optionIds ?? []), "goal"];
}

function buildLinePath(nodes, pathIds) {
  const points = pathIds
    .map((id) => nodes.find((n) => n.id === id))
    .filter(Boolean);
  if (points.length < 2) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/**
 * @param {{id,type,label,x,y}[]} nodes
 * @param {{id,name,optionIds:string[]}[]} routes - 완성된 경로들
 * @param {string[]} currentPath - 지금 만드는 중인 경로 (option id 배열)
 * @param {string|null} selectedRouteId
 * @param {boolean} isAdding - 경로 추가 모드 여부
 * @param {(id:string)=>void} onNodeClick
 */
export default function RouteCanvas({
  nodes,
  routes,
  currentPath,
  isAdding,
  selectedRouteId,
  onNodeClick,
}) {
  const previewPath =
    isAdding && currentPath.length > 0 ? ["start", ...currentPath, "goal"] : [];

  return (
    <div className="route-canvas">
      <svg
        className="route-canvas__svg"
        viewBox="0 0 1080 560"
        preserveAspectRatio="none"
      >
        {routes.map((route, i) => {
          const isSelected = route.id === selectedRouteId;
          return (
            <path
              key={route.id}
              d={buildLinePath(nodes, getDisplayPath(route))}
              stroke={isSelected ? "#2f73f6" : ROUTE_COLORS[i % ROUTE_COLORS.length]}
              strokeWidth={isSelected ? "5" : "2.5"}
              strokeDasharray={isSelected ? "none" : "7 6"}
              fill="none"
              strokeLinecap="round"
              opacity={isSelected ? "1" : "0.55"}
            />
          );
        })}
        {previewPath.length > 0 && (
          <path
            d={buildLinePath(nodes, previewPath)}
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeDasharray="4 5"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
        )}
      </svg>

      <div className="route-canvas__nodes">
        {nodes.map((node) => {
          const orderInCurrent = currentPath.indexOf(node.id);
          const isChoice = node.type === "choice";
          const isRouteStart = isAdding && node.type === "start";
          return (
            <IslandNode
              key={node.id}
              node={node}
              isClickable={isAdding && isChoice}
              isRouteStart={isRouteStart}
              isSelected={orderInCurrent !== -1}
              order={orderInCurrent !== -1 ? orderInCurrent + 1 : null}
              onClick={onNodeClick}
            />
          );
        })}
      </div>
    </div>
  );
}
