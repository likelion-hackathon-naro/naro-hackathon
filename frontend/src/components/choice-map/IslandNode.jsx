import "./IslandNode.css";

/**
 * @param {object} node - { id, type, label, x, y }
 * @param {boolean} isSelected - 현재 만들고 있는 경로에 포함됐는지
 * @param {number|null} order - 경로 내 순서 (1부터). 없으면 null
 * @param {boolean} isClickable - 경로 추가 모드일 때만 true
 * @param {boolean} isRouteStart - 경로 만들기 모드에서 기본 출발점일 때 true
 * @param {(id: string) => void} onClick
 */
export default function IslandNode({
  node,
  isSelected,
  order,
  isClickable,
  isRouteStart,
  onClick,
}) {
  return (
    <button
      type="button"
      className={[
        "island-node",
        `island-node--${node.type}`,
        isSelected ? "island-node--selected" : "",
        isClickable ? "island-node--clickable" : "",
        isRouteStart ? "island-node--route-start" : "",
      ].join(" ")}
      style={{
        left: `${(node.x / 1080) * 100}%`,
        top: `${(node.y / 560) * 100}%`,
      }}
      onClick={() => onClick?.(node.id)}
      disabled={!isClickable}
    >
      {isRouteStart && (
        <span className="island-node__route-guide">
          현재와 최종 목표는 기본으로 연결되어 있어요.
          <br />
          중간에 거칠 선택지만 순서대로 고르면 됩니다.
        </span>
      )}
      <span className="island-node__mound">
        {node.type === "start" && (
          <span className="island-node__avatar" aria-hidden="true">
            🦁
          </span>
        )}
        {node.type !== "start" && (
          <span
            className={`island-node__flag island-node__flag--${node.type}`}
          />
        )}
      </span>
      {order != null && <span className="island-node__order">{order}</span>}
      <span className="island-node__label">{node.label}</span>
      {node.metaItems?.length > 0 && (
        <span className="island-node__memo">
          <span className="island-node__memo-title">현재 진행 중</span>
          <span className="island-node__memo-list">
            {node.metaItems.map((item, idx) => (
              <span key={`${item}-${idx}`} className="island-node__memo-item">
                {item}
              </span>
            ))}
          </span>
        </span>
      )}
      {node.meta && <span className="island-node__meta">{node.meta}</span>}
    </button>
  );
}
