import { useState } from "react";
import "./TagListField.css";

/**
 * 태그(칩) 형태로 여러 값을 추가/삭제하는 입력 필드.
 * "현재 진행 중 / 고민 중인 선택지 / 중요하게 생각하는 기준" 에서 공통으로 사용.
 *
 * @param {string} label
 * @param {string[]} tags
 * @param {(nextTags: string[]) => void} onChange
 * @param {boolean} isWarning
 */
export default function TagListField({ label, tags, onChange, isWarning = false }) {
  const [draft, setDraft] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingDraft, setEditingDraft] = useState("");

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

  const startEdit = (idx) => {
    setIsAdding(false);
    setEditingIndex(idx);
    setEditingDraft(tags[idx]);
  };

  const commitEdit = () => {
    if (editingIndex == null) return;
    const value = editingDraft.trim();
    if (!value) {
      removeTag(editingIndex);
    } else {
      onChange(tags.map((tag, idx) => (idx === editingIndex ? value : tag)));
    }
    setEditingIndex(null);
    setEditingDraft("");
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

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === "Escape") {
      setEditingIndex(null);
      setEditingDraft("");
    }
  };

  return (
    <div className={["field-row", isWarning ? "field-row--warning" : ""].join(" ")}>
      <span className="field-row__label">
        {label}
        {isWarning && <span className="field-row__warning-mark">!</span>}
      </span>
      <div className="tag-list">
        {tags.map((tag, idx) => (
          <span className="tag" key={`${tag}-${idx}`}>
            {editingIndex === idx ? (
              <input
                autoFocus
                className="tag__edit-input"
                value={editingDraft}
                onChange={(e) => setEditingDraft(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={commitEdit}
              />
            ) : (
              <>
                <button
                  type="button"
                  className="tag__text"
                  onClick={() => startEdit(idx)}
                  aria-label={`${tag} 수정`}
                  title="클릭해서 수정"
                >
                  {tag}
                </button>
                <button
                  type="button"
                  className="tag__remove"
                  aria-label={`${tag} 삭제`}
                  onClick={() => removeTag(idx)}
                >
                  ×
                </button>
              </>
            )}
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
