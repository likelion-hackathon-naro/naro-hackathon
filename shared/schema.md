# JSON 데이터 명세서 (Single Source of Truth)

> 이 문서가 FE·BE가 **같이 보고 코딩하는 단일 기준**.
> 필드명/enum/최대 개수는 한 번 정하면 바꾸지 않는다. 바꿔야 하면 회의에서 합의 후 이 문서 먼저 수정.
>
> 관련: [[프롬프트]] `shared/prompts/`, [[mock]] `shared/mock/`

## 공통 규칙

- key 이름은 **영어**(코드용), 사용자에게 보이는 텍스트 값은 **한국어**.
- 신호등 enum: **`"green" | "yellow" | "red"`** — FE 색상 매핑 고정.
  - 초록 = 안정/적음 · 노랑 = 보통 · 빨강 = 위험/많음
- 리스트류(pros, cons, items, reasons 등)는 **최대 3개**.
- `id`는 **고유 문자열**. 옵션·경로·할일 id 모두 FE/BE가 부여.
- score는 **0~100 정수**.

---

## 1. 입력 (사용자 → FE 상태, 서버 호출 없음)

입력 화면(예림)에서 사용자가 채우는 5개 필드. **AI/서버로 보내지 않고 FE 상태로 보관**한다.
`options`는 곧바로 §2 선택지 카드로 시각화하고, `goal`·`criteria`·`concerns`는 이후 경로 비교(§3) 요청에 쓴다.

```json
{
  "goal": "졸업 후 커리어 시작",
  "current": "컴퓨터공학과 4학년 1학기, 졸업 2학기 남음",
  "options": ["대기업 취업 준비", "대학원 진학", "스타트업 인턴"],
  "criteria": ["성장", "안정성", "전공 활용"],
  "concerns": ["취업 실패 리스크", "준비 기간 부족"]
}
```

| 필드       | 타입     | 의미 (입력 화면 항목)                   |
| ---------- | -------- | --------------------------------------- |
| `goal`     | string   | 최종 목표 (예: 졸업 후 진로, 취업 목표) |
| `current`  | string   | 현재 상황 (학년/학기, 진행 중인 활동)   |
| `options`  | string[] | 고민 중인 선택지                        |
| `criteria` | string[] | 중요하게 생각하는 기준                  |
| `concerns` | string[] | 걱정되는 점                             |

---

## 2. 선택지 카드 → `options[]` _(FE가 입력에서 직접 생성)_

§1의 `options`(문자열 배열)를 FE가 카드 객체로 변환한다. AI 구조화 단계는 없다.
→ FE1 카드/섬 시각화에 사용.

```json
{
  "options": [{ "id": "opt-1", "title": "대기업 취업 준비" }]
}
```

| 필드              | 타입   | 의미                                                            |
| ----------------- | ------ | --------------------------------------------------------------- |
| `options[].id`    | string | 고유 id (FE 부여, 예: opt-1). React Flow 노드 id / 경로 참조 키 |
| `options[].title` | string | 선택지 제목 = 사용자가 §1에서 입력한 선택지 텍스트              |

---

## 3. 경로 생성 (사용자 → 경로 비교 AI)

`POST /api/compare-routes` 요청 바디. → FE1이 사용자가 만든 경로를 모아 보냄.

```json
{
  "routes": [
    { "id": "route-1", "name": "경로1", "optionIds": ["opt-3", "opt-1"] },
    { "id": "route-2", "name": "경로2", "optionIds": ["opt-2"] }
  ],
  "context": {
    "goal": "졸업 후 커리어 시작",
    "criteria": ["성장", "안정성", "전공 활용"],
    "concerns": ["취업 실패 리스크", "준비 기간 부족"]
  }
}
```

| 필드                 | 타입     | 의미                                       |
| -------------------- | -------- | ------------------------------------------ |
| `routes[].id`        | string   | 경로 고유 id (FE 부여)                     |
| `routes[].name`      | string   | 경로 이름 (예: "경로1")                    |
| `routes[].optionIds` | string[] | 경로에 포함된 옵션 id들 (순서 = 진행 순서) |
| `context.goal`       | string   | 비교 기준이 되는 최종 목표 (→ score 산정)  |
| `context.criteria`   | string[] | 사용자가 중요하게 보는 기준 (→ pros/cons)  |
| `context.concerns`   | string[] | 사용자가 걱정하는 점 (→ risk 분석에 반영)  |

---

## 4. 경로 비교 AI 응답 → `comparison[]`

`POST /api/compare-routes` 응답 바디. → FE2 비교 화면/메인 선택에 사용.

```json
{
  "comparison": [
    {
      "routeId": "route-1",
      "score": 82,
      "pros": ["전공 경험을 쌓고 취업 안정성 확보", "졸업 후 바로 취업 가능"],
      "cons": ["인턴·취업 동시 준비로 부담이 큼"],
      "risk": { "level": "yellow", "reasons": ["서류/코테 불합격 가능"] },
      "todoBurden": {
        "level": "yellow",
        "items": ["자기소개서 작성", "코딩테스트 준비"]
      },
      "fallback": { "level": "green", "items": ["졸업 유예 후 재도전"] }
    }
  ]
}
```

| 필드                      | 타입          | 의미                                                 |
| ------------------------- | ------------- | ---------------------------------------------------- |
| `comparison[].routeId`    | string        | 어떤 경로에 대한 결과인지 (요청`routes[].id`와 매칭) |
| `comparison[].score`      | number(0~100) | 종합 점수                                            |
| `comparison[].pros`       | string[]      | 장점 (최대 3개)                                      |
| `comparison[].cons`       | string[]      | 단점 (최대 3개)                                      |
| `comparison[].risk`       | object        | 리스크:`{ level, reasons[] }` — 사유 최대 3개        |
| `comparison[].todoBurden` | object        | 지금 해야 할 일 부담:`{ level, items[] }` — 최대 3개 |
| `comparison[].fallback`   | object        | 실패 시 대안:`{ level, items[] }` — 최대 3개         |

- `risk.level` : green(안정) / yellow(보통) / red(위험)
- `todoBurden.level` : green(적음) / yellow(보통) / red(많음)
- `fallback.level` : green(많음=대안 충분) / yellow(보통) / red(적음=대안 부족)

> ⚠️ fallback의 색 의미는 "대안이 많을수록 안전(green)". 회의에서 한 번 더 확인.

---

## 5. 할 일 생성 AI 응답 → `todos[]`

`POST /api/generate-todos` 응답 바디. → FE2 체크리스트에 사용.

요청 바디:

```json
{
  "routeId": "route-1",
  "optionIds": ["opt-3", "opt-1"],
  "context": { "goal": "졸업 후 커리어 시작" }
}
```

응답 바디:

```json
{
  "todos": [
    { "id": "todo-1", "title": "이력서/포트폴리오 작성", "done": false },
    { "id": "todo-2", "title": "지원할 기업 3곳 리스트업", "done": false }
  ]
}
```

| 필드            | 타입    | 의미                   |
| --------------- | ------- | ---------------------- |
| `todos[].id`    | string  | 할 일 고유 id          |
| `todos[].title` | string  | 할 일 제목             |
| `todos[].done`  | boolean | 완료 여부 (초기 false) |
