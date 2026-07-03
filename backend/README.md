# Naro Backend API

나로 서비스의 backend API 명세입니다.

Backend는 Express 기반으로 동작하며, AI 구조화/분석 API와 선택 지도 저장 API를 제공합니다.

## Base URL

Local development:

```text
http://localhost:8080
```

## 공통 응답 형식

### 성공 응답

```json
{
  "success": true,
  "data": {}
}
```

### 실패 응답

```json
{
  "success": false,
  "message": "에러 메시지"
}
```

---

## 1. 고민 구조화 API

사용자가 입력한 자연어 고민을 AI가 선택 지도 생성을 위한 구조화 데이터로 변환합니다.

### Endpoint

```http
POST /api/structure
```

### Request Body

```json
{
  "rawText": "저는 컴퓨터공학과 4학년이고 졸업 후 진로가 고민입니다."
}
```

### Response

```json
{
  "success": true,
  "data": {
    "goal": "졸업 후 커리어 시작",
    "current": ["컴퓨터공학과 4학년", "졸업까지 2학기 남음"],
    "options": [
      {
        "id": "opt-1",
        "title": "대기업 취업 준비"
      },
      {
        "id": "opt-2",
        "title": "대학원 진학"
      },
      {
        "id": "opt-3",
        "title": "스타트업 인턴"
      }
    ],
    "criteria": ["성장 가능성", "안정성", "전공 활용"],
    "concerns": ["취업 실패 리스크", "준비 기간 부족"],
    "missing": [],
    "followup": ""
  }
}
```

### 주요 필드

| 필드       | 타입     | 설명               |
| ---------- | -------- | ------------------ |
| `goal`     | string   | 사용자의 핵심 목표 |
| `current`  | string[] | 현재 상황          |
| `options`  | object[] | 선택지 목록        |
| `criteria` | string[] | 판단 기준          |
| `concerns` | string[] | 걱정/리스크        |
| `missing`  | string[] | 추가로 필요한 정보 |
| `followup` | string   | 추가 질문          |

---

## 2. 경로 비교 API

사용자가 만든 최대 3개의 관심 경로를 AI가 비교 분석합니다.

### Endpoint

```http
POST /api/compare-routes
```

### Request Body

```json
{
  "routes": [
    {
      "id": "route-1",
      "name": "스타트업 인턴 후 대기업 취업",
      "optionIds": ["opt-3", "opt-1"],
      "favorite": true
    },
    {
      "id": "route-2",
      "name": "대학원 진학",
      "optionIds": ["opt-2"],
      "favorite": true
    }
  ],
  "context": {
    "goal": "졸업 후 커리어 시작",
    "criteria": ["성장 가능성", "안정성", "전공 활용"],
    "concerns": ["취업 실패 리스크", "준비 기간 부족"],
    "options": [
      {
        "id": "opt-1",
        "title": "대기업 취업 준비"
      },
      {
        "id": "opt-2",
        "title": "대학원 진학"
      },
      {
        "id": "opt-3",
        "title": "스타트업 인턴"
      }
    ]
  }
}
```

### Request 규칙

| 필드                 | 규칙                                                   |
| -------------------- | ------------------------------------------------------ |
| `routes`             | 비교할 경로 배열                                       |
| `routes[].id`        | 경로 ID                                                |
| `routes[].name`      | 경로 이름                                              |
| `routes[].optionIds` | 경로에 포함된 선택지 ID 배열                           |
| `routes[].favorite`  | `true`인 경로만 비교 대상                              |
| `context.options`    | AI가 optionId를 해석할 수 있도록 선택지 제목 포함 권장 |

### Response

```json
{
  "success": true,
  "data": {
    "comparison": [
      {
        "routeId": "route-1",
        "summary": "실무 경험을 쌓은 뒤 취업 안정성을 노리는 경로입니다.",
        "pros": [
          "실무 경험을 확보할 수 있습니다.",
          "취업 경쟁력을 높일 수 있습니다."
        ],
        "cons": ["인턴과 취업 준비를 병행해야 할 수 있습니다."],
        "risk": {
          "level": "yellow",
          "reasons": ["인턴 합격 여부가 불확실합니다."]
        },
        "todoBurden": {
          "level": "yellow",
          "items": ["이력서 작성", "코딩테스트 준비"]
        },
        "fallback": ["인턴 지원이 어렵다면 바로 대기업 취업 준비로 전환합니다."]
      }
    ]
  }
}
```

### 주요 필드

| 필드               | 타입     | 설명                                     |
| ------------------ | -------- | ---------------------------------------- |
| `comparison`       | object[] | 경로별 비교 결과                         |
| `routeId`          | string   | 비교 대상 경로 ID                        |
| `summary`          | string   | 경로 요약                                |
| `pros`             | string[] | 장점                                     |
| `cons`             | string[] | 단점                                     |
| `risk.level`       | string   | 리스크 수준: `green`, `yellow`, `red`    |
| `risk.reasons`     | string[] | 리스크 이유                              |
| `todoBurden.level` | string   | 실행 부담 수준: `green`, `yellow`, `red` |
| `todoBurden.items` | string[] | 주요 실행 부담                           |
| `fallback`         | string[] | 대안 또는 보완 경로                      |

---

## 3. 할 일 생성 API

사용자가 최종 선택한 경로를 기반으로 실행 가능한 todo 목록을 생성합니다.

### Endpoint

```http
POST /api/generate-todos
```

### Request Body

```json
{
  "routeId": "route-1",
  "optionIds": ["opt-3", "opt-1"],
  "context": {
    "goal": "졸업 후 커리어 시작",
    "options": [
      {
        "id": "opt-1",
        "title": "대기업 취업 준비"
      },
      {
        "id": "opt-2",
        "title": "대학원 진학"
      },
      {
        "id": "opt-3",
        "title": "스타트업 인턴"
      }
    ]
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": "todo-1",
        "title": "지원할 인턴 기업 3곳 리스트업",
        "done": false
      },
      {
        "id": "todo-2",
        "title": "이력서 초안 작성",
        "done": false
      }
    ]
  }
}
```

### 주요 필드

| 필드            | 타입     | 설명                      |
| --------------- | -------- | ------------------------- |
| `todos`         | object[] | 생성된 할 일 목록         |
| `todos[].id`    | string   | todo ID                   |
| `todos[].title` | string   | 할 일 제목                |
| `todos[].done`  | boolean  | 완료 여부, 기본값 `false` |

---

## 4. 선택 지도 저장 API

현재 사용자의 선택 지도 상태를 Supabase `decision_maps` 테이블에 저장합니다.

저장 대상에는 구조화 결과, 경로, 비교 결과, 최종 선택 경로, todo 목록이 포함됩니다.

### Endpoint

```http
POST /api/maps
```

### Request Body

```json
{
  "title": "졸업 후 커리어 시작 선택 지도",
  "rawText": "저는 컴퓨터공학과 4학년이고 졸업까지 2학기 남았습니다.",
  "data": {
    "structuredData": {
      "goal": "졸업 후 커리어 시작",
      "current": ["컴퓨터공학과 4학년", "졸업까지 2학기 남음"],
      "options": [
        {
          "id": "opt-1",
          "title": "대기업 취업 준비"
        },
        {
          "id": "opt-2",
          "title": "대학원 진학"
        },
        {
          "id": "opt-3",
          "title": "스타트업 인턴"
        }
      ],
      "criteria": ["성장 가능성", "안정성", "전공 활용"],
      "concerns": ["취업 실패 리스크", "준비 기간 부족"],
      "missing": [],
      "followup": ""
    },
    "routes": [
      {
        "id": "route-1",
        "name": "스타트업 인턴 후 대기업 취업",
        "optionIds": ["opt-3", "opt-1"],
        "favorite": true
      }
    ],
    "comparisonResult": {
      "comparison": []
    },
    "selectedRoute": {
      "id": "route-1",
      "name": "스타트업 인턴 후 대기업 취업",
      "optionIds": ["opt-3", "opt-1"],
      "favorite": true
    },
    "todos": [
      {
        "id": "todo-1",
        "title": "지원할 인턴 기업 3곳 리스트업",
        "done": false
      }
    ]
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "생성된-map-id",
    "title": "졸업 후 커리어 시작 선택 지도",
    "rawText": "저는 컴퓨터공학과 4학년이고 졸업까지 2학기 남았습니다.",
    "goal": "졸업 후 커리어 시작",
    "selectedRouteId": "route-1",
    "mapData": {
      "structuredData": {},
      "routes": [],
      "comparisonResult": {},
      "selectedRoute": {},
      "todos": []
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

## 5. 선택 지도 조회 API

저장된 선택 지도를 ID 기준으로 조회합니다.

### Endpoint

```http
GET /api/maps/:id
```

### Example

```http
GET /api/maps/00000000-0000-0000-0000-000000000000
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "00000000-0000-0000-0000-000000000000",
    "title": "졸업 후 커리어 시작 선택 지도",
    "rawText": "저는 컴퓨터공학과 4학년이고 졸업까지 2학기 남았습니다.",
    "goal": "졸업 후 커리어 시작",
    "selectedRouteId": "route-1",
    "mapData": {
      "structuredData": {},
      "routes": [],
      "comparisonResult": {},
      "selectedRoute": {},
      "todos": []
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### Not Found Response

```json
{
  "success": false,
  "message": "선택 지도를 찾을 수 없습니다."
}
```

---

## 환경변수

`backend/.env`에 아래 값이 필요합니다.

```env
PORT=8080
USE_MOCK=true

GEMINI_MODEL=gemini-3.5-flash
GEMINI_API_KEY=your_gemini_api_key

SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

실제 `.env` 파일은 GitHub에 올리지 않습니다.

`.env.example`에는 실제 key가 아닌 placeholder만 작성합니다.

---

## Mock / AI 동작 방식

`USE_MOCK=true`일 때는 shared mock 데이터를 반환합니다.

```env
USE_MOCK=true
```

`USE_MOCK=false`일 때는 Gemini API를 호출합니다.

```env
USE_MOCK=false
```

Gemini 호출 실패 시에는 mock 데이터를 fallback으로 반환합니다.

---

## Frontend 연동 요약

### 전체 흐름

```text
1. 사용자가 고민 입력
2. POST /api/structure 호출
3. 구조화 결과로 선택 지도 표시
4. 사용자가 경로 생성
5. POST /api/compare-routes 호출
6. 사용자가 메인 경로 선택
7. POST /api/generate-todos 호출
8. POST /api/maps 호출하여 전체 선택 지도 저장
9. GET /api/maps/:id로 저장된 선택 지도 조회
```

### FE에서 저장 시 전달할 data 예시

```js
{
  title: structuredData.goal,
  rawText,
  data: {
    structuredData,
    routes,
    comparisonResult,
    selectedRoute,
    todos,
  },
}
```
