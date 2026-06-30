import IslandNode from "./IslandNode";
import "./RouteCanvas.css";

const ROUTE_COLORS = ["#3b6cf6", "#22a366", "#f5a524", "#a855f7", "#ef4444"];

function buildLinePath(nodes, pathIds) {
  const points = pathIds
    .map((id) => nodes.find((n) => n.id === id))
    .filter(Boolean);
  if (points.length < 2) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/**
 * @param {{id,type,label,x,y}[]} nodes
 * @param {{id,name,path}[]} routes - 완성된 경로들
 * @param {string[]} currentPath - 지금 만드는 중인 경로 (node id 배열)
 * @param {boolean} isAdding - 경로 추가 모드 여부
 * @param {(id:string)=>void} onNodeClick
 */
export default function RouteCanvas({
  nodes,
  routes,
  currentPath,
  isAdding,
  onNodeClick,
}) {
  return (
    <div className="route-canvas">
      <svg
        className="route-canvas__svg"
        viewBox="0 0 1080 560"
        preserveAspectRatio="xMidYMid meet"
      >
        {routes.map((route, i) => (
          <path
            key={route.id}
            d={buildLinePath(nodes, route.path)}
            stroke={ROUTE_COLORS[i % ROUTE_COLORS.length]}
            strokeWidth="2.5"
            strokeDasharray="7 6"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {isAdding && currentPath.length > 0 && (
          <path
            d={buildLinePath(nodes, currentPath)}
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
          return (
            <IslandNode
              key={node.id}
              node={node}
              isClickable={isAdding}
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
