import { useState } from "react";
import "./Landing.css";

const EXAMPLE_CHIPS = [
  "이직할까, 지금 회사에 남을까?",
  "창업을 할까, 더 준비할까?",
  "전공을 살릴까, 새로운 분야에 도전할까?",
  "어떤 커리어를 쌓고 싶은지 모르겠어요",
];

const SAMPLE_CARDS = [
  {
    tag: "진로 고민",
    title: "이직할까, 지금 회사에 남을까?",
    color: "blue",
  },
  {
    tag: "커리어 선택",
    title: "전공을 살릴까, 새로운 분야에 도전할까?",
    color: "green",
  },
  {
    tag: "진학 vs 취업",
    title: "대학원을 진학할까, 취업할까?",
    color: "purple",
  },
  {
    tag: "단기 로드맵",
    title: "알찬 방학을 보내고 싶은데, 하고 싶은 게 너무 많아.",
    color: "orange",
  },
];

function MiniMap({ color = "blue" }) {
  return (
    <div className={`mini-map mini-map--${color}`} aria-hidden="true">
      <span className="mini-map__route" />
      <span className="mini-map__island mini-map__island--a">
        <span className="mini-map__flag" />
      </span>
      <span className="mini-map__island mini-map__island--b">
        <span className="mini-map__flag mini-map__flag--muted" />
      </span>
      <span className="mini-map__start" />
    </div>
  );
}

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

function buildInitialData(rawText) {
  return {
    rawText,
    goal: "2028년 2월 졸업",
    current: "2026년 여름, 산학협력 프로젝트와 웹개발 해커톤 진행 중",
    options: ["포트폴리오 강화", "휴학", "교환학생 준비", "겨울 인턴"],
    criteria: ["졸업 시점 유지", "실무 경험", "방향성", "번아웃 방지"],
    concerns: ["교환학생이나 인턴이 잘 되지 않았을 때 계획 수정"],
  };
}

export default function Landing({ onStart }) {
  const [rawText, setRawText] = useState("");

  const submit = () => {
    onStart(buildInitialData(rawText.trim()));
  };

  return (
    <main className="landing-page">
      <header className="landing-header">
        <button type="button" className="landing-logo" onClick={() => setRawText("")}>
          나로<span>▶</span>
        </button>
        <nav className="landing-nav" aria-label="주요 메뉴">
          <a href="#service">서비스 소개</a>
          <a href="#how">이용 방법</a>
          <a href="#blog">블로그</a>
          <button type="button">로그인</button>
        </nav>
      </header>

      <DecorativeIsland className="landing-island--left" />
      <DecorativeIsland className="landing-island--right" />
      <span className="landing-cloud landing-cloud--left" aria-hidden="true" />
      <span className="landing-cloud landing-cloud--right" aria-hidden="true" />
      <span className="landing-dash landing-dash--left" aria-hidden="true" />
      <span className="landing-dash landing-dash--right" aria-hidden="true" />

      <section className="landing-hero" id="service">
        <div className="landing-badge">복잡한 고민, 한눈에 길이 되도록</div>
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
              aria-label="고민 입력 시작"
            >
              ↑
            </button>
          </div>
        </div>
      </section>

      <section className="landing-examples" id="how">
        <div className="landing-examples__heading">
          <h2>나로로 보는 고민의 예시</h2>
          <p>다양한 선택을 지도 위에서 비교해 보세요.</p>
        </div>
        <div className="landing-example-grid">
          {SAMPLE_CARDS.map((card) => (
            <article className="landing-example-card" key={card.title}>
              <div>
                <span className={`landing-example-card__tag landing-example-card__tag--${card.color}`}>
                  {card.tag}
                </span>
                <button type="button" aria-label={`${card.title} 보기`}>
                  ›
                </button>
              </div>
              <h3>{card.title}</h3>
              <MiniMap color={card.color} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
