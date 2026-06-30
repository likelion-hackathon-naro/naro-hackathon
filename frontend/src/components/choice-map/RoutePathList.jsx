import "./RoutePathList.css";

const ROUTE_COLORS = ["#3b6cf6", "#22a366", "#f5a524", "#a855f7", "#ef4444"];

function getNodeLabel(nodes, id) {
  return nodes.find((n) => n.id === id)?.label ?? id;
}

/**
 * @param {{id,name,path}[]} routes
 * @param {{id,label}[]} nodes
 * @param {(id:number)=>void} onRemove
 */
export default function RoutePathList({ routes, nodes, onRemove }) {
  if (routes.length === 0) {
    return (
      <div className="route-path-list route-path-list--empty">
        아직 만든 경로가 없어요. ‘경로 추가’를 눌러 첫 경로를 그려보세요.
      </div>
    );
  }

  return (
    <ul className="route-path-list">
      {routes.map((route, i) => (
        <li className="route-path-list__item" key={route.id}>
          <span
            className="route-path-list__dot"
            style={{ background: ROUTE_COLORS[i % ROUTE_COLORS.length] }}
          />
          <span className="route-path-list__name">{route.name}</span>
          <span className="route-path-list__steps">
            {route.path.map((id, idx) => (
              <span key={id} className="route-path-list__step">
                {getNodeLabel(nodes, id)}
                {idx < route.path.length - 1 && (
                  <span className="route-path-list__arrow"> → </span>
                )}
              </span>
            ))}
          </span>
          <button
            type="button"
            className="route-path-list__remove"
            onClick={() => onRemove(route.id)}
            aria-label={`${route.name} 삭제`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
