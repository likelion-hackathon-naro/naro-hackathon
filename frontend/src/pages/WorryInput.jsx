import { useRef, useState } from "react";
import TagListField from "../components/worry-input/TagListField";
import { structureWorryText } from "../api/structure";
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
  const concerns = toStringList(initialData.concerns);

  return {
    ...INITIAL_DATA,
    ...initialData,
    current: toStringList(initialData.current ?? initialData.inProgress),
    options: toStringList(initialData.options ?? initialData.choices),
    criteria: toStringList(initialData.criteria),
    concerns: concerns.length ? concerns : toStringList(initialData.concern),
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
  const structureRequestIdRef = useRef(0);
  const [data, setData] = useState(() => normalizeInitialData(initialData));
  const [isEditingRawText, setIsEditingRawText] = useState(false);
  const [isStructuring, setIsStructuring] = useState(false);
  const [structureNotice, setStructureNotice] = useState("");

  const updateField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const missingFields = [
    !data.goal.trim() && "최종 목표",
    data.current.length === 0 && "현재 상황",
    data.options.length <= 1 && "고민 중인 선택지",
    data.criteria.length <= 1 && "핵심 기준",
  ].filter(Boolean);
  const shortageWarnings = [
    data.options.length <= 1 && {
      title: "고민 중인 선택지",
      example: "예: 인턴, 휴학, 교환학생",
    },
    data.criteria.length <= 1 && {
      title: "핵심 기준",
      example: "예: 졸업 시점, 성장가능성, 돈",
    },
  ].filter(Boolean);
  const isValid =
    data.goal.trim() &&
    data.current.length > 0 &&
    data.options.length > 1 &&
    data.criteria.length > 1 &&
    !isStructuring &&
    !isEditingRawText;

  const applyStructuredData = async (rawTextToStructure, showNotice = false) => {
    const trimmedRawText = rawTextToStructure.trim();
    const requestId = structureRequestIdRef.current + 1;
    structureRequestIdRef.current = requestId;

    if (!trimmedRawText) {
      setStructureNotice("고민 내용을 먼저 입력해주세요.");
      return;
    }

    setIsStructuring(true);
    if (!showNotice) setStructureNotice("");

    const structuredData = await structureWorryText(trimmedRawText);

    if (requestId !== structureRequestIdRef.current) return;

    setData((prev) =>
      normalizeInitialData({
        ...prev,
        ...structuredData,
        rawText: prev.rawText,
      }),
    );
    setIsStructuring(false);
    if (showNotice) {
      setStructureNotice("수정한 고민을 다시 정리했어요.");
    }
  };

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
    if (isStructuring) return;

    if (!isEditingRawText) {
      setIsEditingRawText(true);
      setStructureNotice("");
      requestAnimationFrame(() => rawTextRef.current?.focus());
      return;
    }

    setIsEditingRawText(false);
    applyStructuredData(data.rawText, true);
  };

  return (
    <div className="worry-input-page">
      <div className="worry-input-page__logo" aria-label="나로">
        나로<span>▶</span>
      </div>
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
            disabled={isStructuring}
          >
            {isStructuring ? "정리 중..." : isEditingRawText ? "수정 완료" : "수정하기"}
          </button>

          {shortageWarnings.length > 0 && (
            <div className="worry-input-card__shortage">
              <strong>아래 내용이 부족합니다. 조금 더 작성해주세요.</strong>
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

        <div
          className={[
            "worry-input-card__right",
            isStructuring ? "worry-input-card__right--loading" : "",
          ].join(" ")}
        >
          {isStructuring && (
            <div className="worry-input-card__loading">
              로딩중입니다. 입력한 고민을 다시 정리하고 있어요.
            </div>
          )}
          {!isStructuring && structureNotice && (
            <div className="worry-input-card__sync-notice">
              {structureNotice}
            </div>
          )}
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
            label="핵심 기준"
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
