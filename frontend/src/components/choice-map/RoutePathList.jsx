import "./RoutePathList.css";

const ROUTE_COLORS = ["#3b6cf6", "#22a366", "#f5a524", "#a855f7", "#ef4444"];

function getNodeLabel(nodes, id) {
  return nodes.find((n) => n.id === id)?.label ?? id;
}

function getDisplayPath(route) {
  return ["start", ...(route.optionIds ?? route.path ?? []), "goal"];
}

/**
 * @param {{id,name,optionIds:string[]}[]} routes
 * @param {{id,label}[]} nodes
 * @param {string|null} selectedRouteId
 * @param {string[]} favoriteRouteIds
 * @param {(id:string)=>void} onSelect
 * @param {(id:string)=>void} onToggleFavorite
 * @param {(id:string)=>void} onRemove
 */
export default function RoutePathList({
  routes,
  nodes,
  selectedRouteId,
  favoriteRouteIds,
  onSelect,
  onToggleFavorite,
  onRemove,
}) {
  if (routes.length === 0) {
    return (
      <div className="route-path-list route-path-list--empty">
        아직 만든 경로가 없어요. ‘경로 만들기’를 눌러 첫 경로를 그려보세요.
      </div>
    );
  }

  return (
    <ul className="route-path-list">
      {routes.map((route, i) => {
        const displayPath = getDisplayPath(route);
        const isSelected = route.id === selectedRouteId;
        const isFavorite = favoriteRouteIds.includes(route.id);
        const favoriteLimitReached = favoriteRouteIds.length >= 3 && !isFavorite;

        return (
          <li
            className={[
              "route-path-list__item",
              isSelected ? "route-path-list__item--selected" : "",
            ].join(" ")}
            key={route.id}
          >
            <button
              type="button"
              className="route-path-list__select"
              onClick={() => onSelect(route.id)}
            >
              <span
                className="route-path-list__dot"
                style={{ background: ROUTE_COLORS[i % ROUTE_COLORS.length] }}
              />
              <span className="route-path-list__content">
                <span className="route-path-list__name">{route.name}</span>
                <span className="route-path-list__steps">
                  {displayPath.map((id, idx) => (
                    <span key={`${route.id}-${id}-${idx}`} className="route-path-list__step">
                      {getNodeLabel(nodes, id)}
                      {idx < displayPath.length - 1 && (
                        <span className="route-path-list__arrow"> → </span>
                      )}
                    </span>
                  ))}
                </span>
              </span>
            </button>

            <button
              type="button"
              className={[
                "route-path-list__favorite",
                isFavorite ? "route-path-list__favorite--on" : "",
              ].join(" ")}
              onClick={() => onToggleFavorite(route.id)}
              disabled={favoriteLimitReached}
              aria-label={`${route.name} 즐겨찾기`}
              title={favoriteLimitReached ? "즐겨찾기는 최대 3개까지 가능해요" : ""}
            >
              ★
            </button>

            <button
              type="button"
              className="route-path-list__remove"
              onClick={() => onRemove(route.id)}
              aria-label={`${route.name} 삭제`}
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}
