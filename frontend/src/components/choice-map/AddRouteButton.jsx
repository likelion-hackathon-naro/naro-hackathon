import "./AddRouteButton.css";

/**
 * @param {boolean} isAdding
 * @param {number} currentPathLength
 * @param {string} routeMessage
 * @param {() => void} onStart
 * @param {() => void} onUndo
 * @param {() => void} onCancel
 * @param {() => void} onFinish
 */
export default function AddRouteButton({
  isAdding,
  currentPathLength,
  routeMessage,
  onStart,
  onUndo,
  onCancel,
  onFinish,
}) {
  if (!isAdding) {
    return (
      <div className="add-route-area">
        <button type="button" className="add-route-btn" onClick={onStart}>
          + 경로 만들기
        </button>
        {routeMessage && (
          <span className="add-route-message">{routeMessage}</span>
        )}
      </div>
    );
  }

  return (
    <div className="add-route-controls">
      <span className="add-route-controls__hint">
        선택지 섬을 순서대로 클릭해요 ({currentPathLength}개 선택됨)
      </span>
      <div className="add-route-controls__buttons">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onUndo}
          disabled={!currentPathLength}
        >
          되돌리기
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onFinish}
          disabled={currentPathLength < 1}
        >
          경로 완성
        </button>
      </div>
    </div>
  );
}
