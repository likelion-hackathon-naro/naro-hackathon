import "./AddRouteButton.css";

/**
 * @param {boolean} isAdding
 * @param {number} currentPathLength
 * @param {() => void} onStart
 * @param {() => void} onUndo
 * @param {() => void} onCancel
 * @param {() => void} onFinish
 */
export default function AddRouteButton({
  isAdding,
  currentPathLength,
  onStart,
  onUndo,
  onCancel,
  onFinish,
}) {
  if (!isAdding) {
    return (
      <button type="button" className="add-route-btn" onClick={onStart}>
        + 경로 추가
      </button>
    );
  }

  return (
    <div className="add-route-controls">
      <span className="add-route-controls__hint">
        섬을 순서대로 클릭해 경로를 만들어 보세요 ({currentPathLength}개 선택됨)
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
          disabled={currentPathLength < 2}
        >
          경로 완성
        </button>
      </div>
    </div>
  );
}
