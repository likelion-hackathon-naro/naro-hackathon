import { useState } from "react";
import TagListField from "../components/worry-input/TagListField";
import "./WorryInput.css";

const INITIAL_DATA = {
  rawText: "",
  goal: "",
  inProgress: [],
  choices: [],
  criteria: [],
  concern: "",
};

/**
 * Step 2: "어떤 갈림길에 서 있나요?" 입력 화면.
 * 왼쪽엔 사용자가 처음 적은 고민 원문, 오른쪽엔 구조화된 필드들.
 *
 * @param {object} initialData - 이전 단계(랜딩 입력)에서 넘어온 원문/AI 추출 결과
 * @param {(data: object) => void} onSubmit - "선택 지도 만들기" 클릭 시 다음 단계로
 */
export default function WorryInput({ initialData, onSubmit }) {
  const [data, setData] = useState({ ...INITIAL_DATA, ...initialData });

  const updateField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = data.goal.trim() && data.choices.length > 0;

  return (
    <div className="worry-input-page">
      <h1 className="worry-input-page__title">어떤 갈림길에 서 있나요?</h1>
      <p className="worry-input-page__subtitle">
        입력한 고민을 바탕으로 목표, 선택지, 조건을 정리해 드릴게요.
      </p>

      <div className="worry-input-card">
        <div className="worry-input-card__right">
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
            label="현재 진행 중"
            tags={data.inProgress}
            onChange={(next) => updateField("inProgress", next)}
          />

          <TagListField
            label="고민 중인 선택지"
            tags={data.choices}
            onChange={(next) => updateField("choices", next)}
          />

          <TagListField
            label="중요하게 생각하는 기준"
            tags={data.criteria}
            onChange={(next) => updateField("criteria", next)}
          />

          <div className="field-row">
            <span className="field-row__label">가장 걱정되는 점</span>
            <input
              className="field-row__text-input"
              value={data.concern}
              onChange={(e) => updateField("concern", e.target.value)}
              placeholder="가장 걱정되는 점을 적어주세요."
            />
          </div>
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
          onClick={() => onSubmit(data)}
        >
          선택 지도 만들기 ›
        </button>
      </div>
    </div>
  );
}
