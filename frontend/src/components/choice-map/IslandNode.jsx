import "./IslandNode.css";

/**
 * @param {object} node - { id, type, label, x, y }
 * @param {boolean} isSelected - 현재 만들고 있는 경로에 포함됐는지
 * @param {number|null} order - 경로 내 순서 (1부터). 없으면 null
 * @param {boolean} isClickable - 경로 추가 모드일 때만 true
 * @param {(id: string) => void} onClick
 */
export default function IslandNode({
  node,
  isSelected,
  order,
  isClickable,
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
      ].join(" ")}
      style={{
        left: `${(node.x / 1080) * 100}%`,
        top: `${(node.y / 560) * 100}%`,
      }}
      onClick={() => onClick?.(node.id)}
      disabled={!isClickable}
    >
      <span className="island-node__mound">
        {node.type === "start" && <span className="island-node__pin" />}
        {node.type !== "start" && (
          <span
            className={`island-node__flag island-node__flag--${node.type}`}
          />
        )}
      </span>
      {order != null && <span className="island-node__order">{order}</span>}
      <span className="island-node__label">{node.label}</span>
    </button>
  );
}
