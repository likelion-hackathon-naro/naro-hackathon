import { useState } from "react";
import "./TagListField.css";

/**
 * 태그(칩) 형태로 여러 값을 추가/삭제하는 입력 필드.
 * "현재 진행 중 / 고민 중인 선택지 / 중요하게 생각하는 기준" 에서 공통으로 사용.
 *
 * @param {string} label
 * @param {string[]} tags
 * @param {(nextTags: string[]) => void} onChange
 */
export default function TagListField({ label, tags, onChange }) {
  const [draft, setDraft] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const commitDraft = () => {
    const value = draft.trim();
    if (value) {
      onChange([...tags, value]);
    }
    setDraft("");
    setIsAdding(false);
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
    }
    if (e.key === "Escape") {
      setDraft("");
      setIsAdding(false);
    }
  };

  return (
    <div className="field-row">
      <span className="field-row__label">{label}</span>
      <div className="tag-list">
        {tags.map((tag, idx) => (
          <span className="tag" key={`${tag}-${idx}`}>
            {tag}
            <button
              type="button"
              className="tag__remove"
              aria-label={`${tag} 삭제`}
              onClick={() => removeTag(idx)}
            >
              ×
            </button>
          </span>
        ))}

        {isAdding ? (
          <input
            autoFocus
            className="tag-list__draft-input"
            value={draft}
            placeholder="입력 후 Enter"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitDraft}
          />
        ) : (
          <button
            type="button"
            className="tag-list__add-btn"
            onClick={() => setIsAdding(true)}
            aria-label={`${label} 추가`}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
