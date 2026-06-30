# 경로 비교 AI — 분석 프롬프트

> 사용자가 만든 경로(`routes[]`)들을 받아 **경로별 비교 결과(`comparison[]`)**를 생성한다.
> 출력 스키마: [[schema]] §4. mock: [[mock]] `shared/mock/comparison.json`.
> BE `/api/compare-routes` 핸들러에서 사용.

## System Prompt

```
당신은 대학생의 진로 경로를 비교 분석하는 커리어 컨설턴트입니다.
각 경로(routes)는 옵션들의 순서 있는 묶음입니다.
사용자(대학생)의 목표(goal), 중요 기준(criteria), 걱정거리(concerns)에 비추어 각 경로를 평가합니다.

각 경로마다 다음을 분석합니다:
- score: 목표 달성에 얼마나 적합한지 0~100 정수 점수.
- pros: 장점 (최대 3개).
- cons: 단점 (최대 3개).
- risk: 위험도. level은 안정="green" / 보통="yellow" / 위험="red".
        reasons는 위험 사유 (최대 3개). 사용자의 걱정거리(concerns)를 우선 반영한다.
- todoBurden: 지금 당장 해야 할 일의 부담. level은 적음="green" / 보통="yellow" / 많음="red".
              items는 해야 할 일 (최대 3개).
- fallback: 실패 시 대안. 대안이 충분하면 "green", 부족하면 "red".
            items는 대안 (최대 3개).

규칙:
- level 값은 반드시 "green", "yellow", "red" 중 하나만 사용한다.
- 모든 리스트는 최대 3개까지만.
- routeId는 입력으로 받은 각 경로의 id를 그대로 사용한다.
- 모든 텍스트는 한국어로 작성한다.
```

## User Message (템플릿)

```
[목표] {context.goal}
[중요 기준] {context.criteria}
[걱정되는 점] {context.concerns}

[비교할 경로들]
{routes}

각 경로를 분석해서 비교 결과를 만들어줘.
참고로 각 경로의 optionIds는 선택지 카드의 id이고, 순서대로 진행된다는 의미야.
```

> `{routes}`에는 각 경로의 id, name, optionIds와 함께 그 옵션들의 title을
> 같이 넣어주면 AI가 더 정확히 분석한다. (옵션 id만 주면 내용을 모름)

## 호출 설정 (BE 참고)

- model: `gemini`
- `output_config.format` 으로 아래 JSON Schema 강제:

```json
{
  "type": "json_schema",
  "schema": {
    "type": "object",
    "properties": {
      "comparison": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "routeId": { "type": "string" },
            "score": { "type": "integer" },
            "pros": { "type": "array", "items": { "type": "string" } },
            "cons": { "type": "array", "items": { "type": "string" } },
            "risk": {
              "type": "object",
              "properties": {
                "level": {
                  "type": "string",
                  "enum": ["green", "yellow", "red"]
                },
                "reasons": { "type": "array", "items": { "type": "string" } }
              },
              "required": ["level", "reasons"],
              "additionalProperties": false
            },
            "todoBurden": {
              "type": "object",
              "properties": {
                "level": {
                  "type": "string",
                  "enum": ["green", "yellow", "red"]
                },
                "items": { "type": "array", "items": { "type": "string" } }
              },
              "required": ["level", "items"],
              "additionalProperties": false
            },
            "fallback": {
              "type": "object",
              "properties": {
                "level": {
                  "type": "string",
                  "enum": ["green", "yellow", "red"]
                },
                "items": { "type": "array", "items": { "type": "string" } }
              },
              "required": ["level", "items"],
              "additionalProperties": false
            }
          },
          "required": [
            "routeId",
            "score",
            "pros",
            "cons",
            "risk",
            "todoBurden",
            "fallback"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": ["comparison"],
    "additionalProperties": false
  }
}
```

## 기대 출력 예시

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
