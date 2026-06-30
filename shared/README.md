# shared/ — 데이터 계약 · 프롬프트 · mock (담당: Data)

FE1·FE2·BE가 공유하는 **데이터 계약의 단일 소스**.
AI 연결 전에도 이 폴더의 mock으로 화면을 먼저 만들 수 있다.

## 구성

```
shared/
├── schema.md              ← JSON 계약서 (전원 필독, 단일 기준)
├── prompts/
│   ├── structure.md       ← 자연어→구조화 AI 프롬프트 (BE)
│   ├── compare.md         ← 경로 비교 AI 프롬프트 (BE)
│   └── todos.md           ← 할 일 생성 AI 프롬프트 (BE)
└── mock/
    ├── structured.json    ← 구조화 결과 mock (FE1 지도)
    ├── comparison.json    ← 경로 비교 결과 mock (FE2)
    └── todos.json         ← 할 일 mock (FE2)
```

## 데이터 흐름

```
자연어 입력 → [구조화 AI] 5필드+선택지 노드 → 지도(섬) 시각화
   → 사용자가 경로 생성 + 즐겨찾기(⭐ 최대 3개)
   → [경로 비교 AI] comparison[] → 메인 경로 선택
   → [할 일 생성 AI] todos[]
```

## 사용법

### FE (FE1 / FE2) — mock으로 먼저 개발
```js
import structuredMock from "../../shared/mock/structured.json";
import comparisonMock from "../../shared/mock/comparison.json";
import todosMock from "../../shared/mock/todos.json";
// AI 연결 전엔 위 mock으로 렌더 → BE 붙으면 fetch 결과로 교체
```

### BE — 프롬프트 + 스키마 강제
- `prompts/*.md`의 System/User 프롬프트를 그대로 사용.
- model: `gemini`, 응답은 각 프롬프트에 명시된 `output_config.format` JSON Schema로 강제.
- 응답 JSON이 `schema.md` 형식과 일치하는지 확인 후 그대로 반환.
- API 3개: `/api/structure`(자연어→구조화), `/api/compare-routes`, `/api/generate-todos`. 경로 생성은 FE.

## 규칙 (바꾸려면 회의 합의 → schema.md 먼저 수정)
- 신호등 enum: `green | yellow | red` (risk · todoBurden)
- 리스트류 최대 3개, 경로 비교는 즐겨찾기 최대 3개
- key는 영어, 값 텍스트는 한국어
