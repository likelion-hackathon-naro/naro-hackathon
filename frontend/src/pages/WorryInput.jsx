import { useRef, useState } from "react";
import TagListField from "../components/worry-input/TagListField";
import "./WorryInput.css";

const INITIAL_DATA = {
  rawText: "",
  goal: "",
  current: [],
  options: [],
  criteria: [],
  concerns: [],
};

function toStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function normalizeInitialData(initialData = {}) {
  return {
    ...INITIAL_DATA,
    ...initialData,
    current: toStringList(initialData.current ?? initialData.inProgress),
    options: initialData.options ?? initialData.choices ?? [],
    concerns:
      initialData.concerns ??
      (initialData.concern ? [initialData.concern] : []),
  };
}

/**
 * Step 2: "어떤 갈림길에 서 있나요?" 입력 화면.
 * 왼쪽엔 사용자가 처음 적은 고민 원문, 오른쪽엔 구조화된 필드들.
 *
 * @param {object} initialData - 이전 단계(랜딩 입력)에서 넘어온 원문/AI 추출 결과
 * @param {(data: object) => void} onSubmit - "선택 지도 만들기" 클릭 시 다음 단계로
 */
export default function WorryInput({ initialData, onSubmit }) {
  const rawTextRef = useRef(null);
  const [data, setData] = useState(() => normalizeInitialData(initialData));
  const [isEditingRawText, setIsEditingRawText] = useState(false);

  const updateField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const missingFields = [
    !data.goal.trim() && "최종 목표",
    data.current.length === 0 && "현재 상황",
    data.options.length === 0 && "고민 중인 선택지",
  ].filter(Boolean);
  const shortageWarnings = [
    data.options.length <= 1 && {
      title: "고민 중인 선택지",
      example: "예: 인턴, 휴학, 교환학생",
    },
    data.criteria.length <= 1 && {
      title: "중요하게 생각하는 기준",
      example: "예: 졸업 시점, 성장가능성, 돈",
    },
  ].filter(Boolean);
  const isValid = data.goal.trim() && data.options.length > 0;

  const submitData = () => {
    onSubmit({
      goal: data.goal.trim(),
      current: data.current,
      options: data.options,
      criteria: data.criteria,
      concerns: data.concerns,
      rawText: data.rawText.trim(),
    });
  };

  const toggleRawTextEdit = () => {
    setIsEditingRawText((prev) => {
      const next = !prev;
      if (!prev) {
        requestAnimationFrame(() => rawTextRef.current?.focus());
      }
      return next;
    });
  };

  return (
    <div className="worry-input-page">
      <h1 className="worry-input-page__title">어떤 갈림길에 서 있나요?</h1>
      <p className="worry-input-page__subtitle">
        입력한 고민을 바탕으로 목표, 선택지, 조건을 정리해 드릴게요.
      </p>

      <div className="worry-input-card">
        <div className="worry-input-card__left">
          <span className="worry-input-card__left-title">
            내가 입력한 고민
          </span>
          <textarea
            ref={rawTextRef}
            className={[
              "worry-input-card__raw-text",
              isEditingRawText ? "worry-input-card__raw-text--editing" : "",
            ].join(" ")}
            value={data.rawText}
            onChange={(e) => updateField("rawText", e.target.value)}
            readOnly={!isEditingRawText}
            placeholder="예: 졸업 전까지 무엇을 준비해야 할지 모르겠어요. 휴학, 교환학생, 인턴 중 어떤 선택이 좋을지 고민돼요."
          />
          <button
            type="button"
            className={[
              "worry-input-card__edit-btn",
              isEditingRawText ? "worry-input-card__edit-btn--active" : "",
            ].join(" ")}
            onClick={toggleRawTextEdit}
          >
            {isEditingRawText ? "수정 완료" : "수정하기"}
          </button>

          {shortageWarnings.length > 0 && (
            <div className="worry-input-card__shortage">
              <strong>이러한 내용이 부족합니다. 조금 더 작성해주세요.</strong>
              <ul>
                {shortageWarnings.map((warning) => (
                  <li key={warning.title}>
                    <span>{warning.title}</span>
                    {warning.example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="worry-input-card__right">
          <div className="worry-input-card__edit-guide">
            아래 내용은 직접 수정, 추가, 삭제할 수 있어요.
          </div>

          {missingFields.length > 0 && (
            <div className="worry-input-card__notice">
              <strong>추가로 알려주세요</strong>
              {missingFields.join(", ")} 정보가 있으면 지도를 더 정확하게
              만들 수 있어요.
            </div>
          )}

          <div className="field-row">
            <span className="field-row__label">최종 목표</span>
            <input
              className="field-row__text-input field-row__text-input--pill"
              value={data.goal}
              onChange={(e) => updateField("goal", e.target.value)}
              placeholder="예: 2028년 2월 졸업"
            />
          </div>

          <TagListField
            label="현재 상황"
            tags={data.current}
            onChange={(next) => updateField("current", next)}
          />

          <TagListField
            label="고민 중인 선택지"
            tags={data.options}
            onChange={(next) => updateField("options", next)}
            isWarning={data.options.length <= 1}
          />

          <TagListField
            label="중요하게 생각하는 기준"
            tags={data.criteria}
            onChange={(next) => updateField("criteria", next)}
            isWarning={data.criteria.length <= 1}
          />

          <TagListField
            label="걱정되는 점"
            tags={data.concerns}
            onChange={(next) => updateField("concerns", next)}
          />
        </div>
      </div>

      <div className="worry-input-footer">
        <button type="button" className="btn btn--ghost">
          이전으로
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!isValid}
          onClick={submitData}
        >
          선택 지도 만들기 ›
        </button>
      </div>
    </div>
  );
}
