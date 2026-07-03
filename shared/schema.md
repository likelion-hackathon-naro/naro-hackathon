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
- `id`는 **고유 문자열**. 옵션 id는 구조화 AI가, 경로·할일 id는 FE/BE가 부여.

---

## 1. 자연어 입력 → 구조화 AI 요청

`POST /api/structure` 요청 바디. 사용자가 자유롭게 쓴 고민을 **그대로** 보낸다.
`profile`(대학·과거 경험 등 맞춤 정보)은 선택값 — 없으면 생략 가능.

```json
{
  "input": "나 컴공 4학년인데 졸업하고 대기업 갈지 대학원 갈지 스타트업 인턴 할지 고민이야. 성장도 중요하고 안정성도 보고 싶은데 취업 실패가 걱정돼.",
  "profile": {
    "university": "OO대학교 컴퓨터공학과",
    "experience": ["웹 개발 동아리 2년", "스타트업 인턴 3개월"]
  }
}
```

| 필드                 | 타입     | 의미                               |
| -------------------- | -------- | ---------------------------------- |
| `input`              | string   | 사용자가 쓴 고민 자연어 (필수)     |
| `profile`            | object   | 맞춤 정보 (선택)                   |
| `profile.university` | string   | 학교/학과                          |
| `profile.experience` | string[] | 과거 경험                          |

---

## 2. 구조화 AI 응답 → 5필드 + 선택지 노드

`POST /api/structure` 응답 바디. 자연어를 구조화한 결과. → FE1 지도 시각화에 사용.
사용자는 이 결과를 화면에서 **수정·추가·삭제**할 수 있다(FE 상태). 정보가 부족한 필드는
`missing`에 담고, `followup`에 추가로 물어볼 질문(자연어)을 돌려준다.

```json
{
  "goal": "졸업 후 커리어 시작",
  "current": ["컴퓨터공학과 4학년 1학기", "졸업까지 2학기 남음"],
  "options": [
    { "id": "opt-1", "title": "대기업 취업 준비", "description": "안정적인 대기업에 신입으로 지원" },
    { "id": "opt-2", "title": "대학원 진학", "description": "전공 전문성을 더 깊이 쌓는 진학 경로" },
    { "id": "opt-3", "title": "스타트업 인턴", "description": "실무 경험을 빠르게 쌓는 인턴 경로" }
  ],
  "criteria": ["성장", "안정성", "전공 활용"],
  "concerns": ["취업 실패 리스크", "준비 기간 부족"],
  "missing": [],
  "followup": ""
}
```

| 필드                    | 타입     | 의미                                                       |
| ----------------------- | -------- | ---------------------------------------------------------- |
| `goal`                  | string   | 최종 목표 (지도의 **끝** 지점)                             |
| `current`               | string[] | 현재 진행 중인 것 (지도의 **시작 섬**)                     |
| `options[].id`          | string   | 선택지 고유 id (구조화 AI 부여, 예: opt-1). 경로 참조 키   |
| `options[].title`       | string   | 선택지 제목 (지도의 **선택지 노드**)                       |
| `options[].description` | string   | 선택지 한 줄 설명 (경로 비교 AI가 이 값으로 선택지 이해)   |
| `criteria`        | string[] | 중요하게 보는 기준                                         |
| `concerns`        | string[] | 걱정되는 점                                                |
| `missing`         | string[] | 정보가 부족한 필드명 (예: `["criteria"]`). 충분하면 `[]`   |
| `followup`        | string   | 부족한 부분에 대한 추가 질문(자연어). 없으면 `""`          |

> **지도(섬) 노드 매핑**: `current` → 시작 섬(옆에 하고 있는 일 리스트), `options[]` → 가운데 선택지 노드, `goal` → 끝 지점.
> 경로는 선택지 노드들 사이에서 유저가 직접 만든다(FE, §3).
> `goal`·`criteria`·`concerns`는 이후 경로 비교(§3) 요청에 그대로 넘긴다.

---

## 3. 경로 생성 (FE) → 경로 비교 AI 요청

경로는 **FE에서 유저가 직접** 만든다(선택지 노드를 순서대로 클릭). AI 호출 없음.
유저는 경로에 즐겨찾기(⭐)를 달 수 있고, **즐겨찾기한 경로(최대 3개)만** 분석 대상으로
`POST /api/compare-routes`에 보낸다.

```json
{
  "routes": [
    { "id": "route-1", "name": "경로1", "optionIds": ["opt-3", "opt-1"], "favorite": true },
    { "id": "route-2", "name": "경로2", "optionIds": ["opt-2"], "favorite": true }
  ],
  "context": {
    "goal": "졸업 후 커리어 시작",
    "criteria": ["성장", "안정성", "전공 활용"],
    "concerns": ["취업 실패 리스크", "준비 기간 부족"]
  }
}
```

| 필드                 | 타입     | 의미                                          |
| -------------------- | -------- | --------------------------------------------- |
| `routes[].id`        | string   | 경로 고유 id (FE 부여)                        |
| `routes[].name`      | string   | 경로 이름 (예: "경로1")                       |
| `routes[].optionIds` | string[] | 경로에 포함된 옵션 id들 (순서 = 진행 순서)    |
| `routes[].favorite`  | boolean  | 즐겨찾기 여부 (분석 대상, true인 것만 전송)   |
| `context.goal`       | string   | 경로 평가 기준이 되는 최종 목표               |
| `context.criteria`   | string[] | 사용자가 중요하게 보는 기준 (→ pros/cons)     |
| `context.concerns`   | string[] | 사용자가 걱정하는 점 (→ risk 분석에 반영)     |

> 분석은 최대 3개까지. `routes`에는 즐겨찾기한 경로만 담아 보낸다.

---

## 4. 경로 비교 AI 응답 → `comparison[]`

`POST /api/compare-routes` 응답 바디. → FE2 비교 화면/메인 선택에 사용.

```json
{
  "comparison": [
    {
      "routeId": "route-1",
      "summary": "취업 안정성과 실무 경험을 함께 노리는 균형형 경로",
      "pros": ["전공 경험을 쌓고 취업 안정성 확보", "졸업 후 바로 취업 가능"],
      "cons": ["인턴·취업 동시 준비로 부담이 큼"],
      "risk": { "level": "yellow", "reasons": ["서류/코테 불합격 가능"] },
      "todoBurden": {
        "level": "yellow",
        "items": ["자기소개서 작성", "코딩테스트 준비"]
      },
      "fallback": ["졸업 유예 후 재도전", "대학원 진학으로 전환"]
    }
  ]
}
```

| 필드                      | 타입     | 의미                                                  |
| ------------------------- | -------- | ----------------------------------------------------- |
| `comparison[].routeId`    | string   | 어떤 경로에 대한 결과인지 (요청`routes[].id`와 매칭)   |
| `comparison[].summary`    | string   | 경로 카드용 한 줄 요약                                 |
| `comparison[].pros`       | string[] | 장점 (최대 3개, **텍스트만**)                         |
| `comparison[].cons`       | string[] | 단점 (최대 3개, **텍스트만**)                         |
| `comparison[].risk`       | object   | 리스크:`{ level, reasons[] }` — 레벨+색, 클릭 시 사유 |
| `comparison[].todoBurden` | object   | 할 일 부담:`{ level, items[] }` — 레벨+색, 클릭 시 항목 |
| `comparison[].fallback`   | string[] | 실패 시 대안 리스트 (최대 3개, **텍스트만**)          |

- 표시 규칙: `pros`·`cons`·`fallback`은 **텍스트로만**, `risk`·`todoBurden`은 **레벨+색깔로만**(레벨 클릭 시 사유/항목 표시).
- `risk.level` : green(안정) / yellow(보통) / red(위험)
- `todoBurden.level` : green(적음) / yellow(보통) / red(많음)
- `fallback`은 신호등 level 없이 대안 텍스트 리스트만 가진다.

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

> 추후(MVP 외): 최종 목적지 디데이, 다음 목적지, 다른 유저 경로 구경 등.
