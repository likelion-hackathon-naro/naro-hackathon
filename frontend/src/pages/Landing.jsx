import { useState } from "react";
import { structureWorryText } from "../api/structure";
import "./Landing.css";

const EXAMPLE_CHIPS = [
  "이직할까, 지금 회사에 남을까?",
  "창업을 할까, 더 준비할까?",
  "전공을 살릴까, 새로운 분야에 도전할까?",
  "어떤 커리어를 쌓고 싶은지 모르겠어요",
];

function DecorativeIsland({ className = "" }) {
  return (
    <span className={`landing-island ${className}`} aria-hidden="true">
      <span className="landing-island__mound" />
      <span className="landing-island__tree landing-island__tree--one" />
      <span className="landing-island__tree landing-island__tree--two" />
      <span className="landing-island__tower" />
    </span>
  );
}

export default function Landing({ onStart }) {
  const [rawText, setRawText] = useState("");
  const [isStructuring, setIsStructuring] = useState(false);

  const submit = async () => {
    const trimmedRawText = rawText.trim();

    if (!trimmedRawText || isStructuring) return;

    setIsStructuring(true);
    const structuredData = await structureWorryText(trimmedRawText);
    setIsStructuring(false);
    onStart(structuredData);
  };

  return (
    <main className="landing-page">
      <header className="landing-header">
        <button
          type="button"
          className="landing-logo"
          onClick={() => setRawText("")}
        >
          나로<span>▶</span>
        </button>
      </header>

      <DecorativeIsland className="landing-island--left" />
      <DecorativeIsland className="landing-island--right" />
      <span className="landing-cloud landing-cloud--left" aria-hidden="true" />
      <span className="landing-cloud landing-cloud--right" aria-hidden="true" />
      <span className="landing-dash landing-dash--left" aria-hidden="true" />
      <span className="landing-dash landing-dash--right" aria-hidden="true" />

      <section className="landing-hero" id="service">
        <div className="landing-badge">
          나로(路) — 복잡한 고민을 나만의 길로
        </div>
        <h1>나로</h1>
        <p>
          당신의 고민을 경로로 만들고,
          <br />
          흔들리지 않게 끝까지 함께해요.
        </p>

        <div className="landing-input-card">
          <textarea
            value={rawText}
            maxLength={500}
            onChange={(e) => setRawText(e.target.value)}
            readOnly={isStructuring}
            placeholder="지금 가장 고민되는 선택이나 목표를 자유롭게 입력해 보세요."
          />
          <div className="landing-input-card__examples">
            <span>예시</span>
            <div>
              {EXAMPLE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setRawText(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
          <div className="landing-input-card__footer">
            <button type="button" className="landing-attach" aria-label="첨부">
              ⌁
            </button>
            <span>{rawText.length}/500</span>
            <button
              type="button"
              className="landing-submit"
              onClick={submit}
              disabled={!rawText.trim() || isStructuring}
              aria-label="고민 입력 시작"
            >
              {isStructuring ? "…" : "↑"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
