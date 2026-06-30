# shared/ — 데이터 계약 · 프롬프트 · mock (담당: 한준)

FE(예림/주연)·BE(수현)가 공유하는 **데이터 계약의 단일 소스**.
AI 연결 전에도 이 폴더의 mock으로 화면을 먼저 만들 수 있다.

## 구성

```
shared/
├── schema.md              ← JSON 계약서 (전원 필독, 단일 기준)
├── prompts/
│   ├── compare.md         ← 경로 비교 AI 프롬프트 (수현)
│   └── todos.md           ← 할 일 생성 AI 프롬프트 (수현)
└── mock/
    ├── options.json       ← 선택지 카드 mock (예림)
    ├── comparison.json    ← 경로 비교 결과 mock (주연)
    └── todos.json         ← 할 일 mock (주연)
```

## 데이터 흐름

```
입력(5필드, FE 보관) → options[] 카드 시각화 → 사용자 경로 생성 routes[]
     → [경로 비교 AI] comparison[] → 메인 경로 선택
     → [할 일 생성 AI] todos[]
```

## 사용법

### FE (예림 / 주연) — mock으로 먼저 개발
```js
import optionsMock from "../../shared/mock/options.json";
import comparisonMock from "../../shared/mock/comparison.json";
import todosMock from "../../shared/mock/todos.json";
// AI 연결 전엔 위 mock으로 렌더 → BE 붙으면 fetch 결과로 교체
```

### BE (수현) — 프롬프트 + 스키마 강제
- `prompts/*.md`의 System/User 프롬프트를 그대로 사용.
- model: `claude-opus-4-8`, 응답은 각 프롬프트에 명시된 `output_config.format` JSON Schema로 강제.
- 응답 JSON이 `schema.md` 형식과 일치하는지 확인 후 그대로 반환.

## 규칙 (바꾸려면 회의 합의 → schema.md 먼저 수정)
- 신호등 enum: `green | yellow | red`
- 리스트류 최대 3개, score 0~100 정수
- key는 영어, 값 텍스트는 한국어
