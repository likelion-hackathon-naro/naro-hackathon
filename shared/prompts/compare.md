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
- summary: 경로를 한 줄로 요약 (카드 표시용).
- pros: 장점 (최대 3개).
- cons: 단점 (최대 3개).
- risk: 위험도. level은 안정="green" / 보통="yellow" / 위험="red".
        reasons는 위험 사유 (최대 3개). 사용자의 걱정거리(concerns)를 우선 반영한다.
- todoBurden: 지금 당장 해야 할 일의 부담. level은 적음="green" / 보통="yellow" / 많음="red".
              items는 해야 할 일 (최대 3개).
- fallback: 실패 시 대안 텍스트 리스트 (최대 3개). 신호등 level 없이 문자열 배열로만 작성한다.

규칙:
- level 값은 반드시 "green", "yellow", "red" 중 하나만 사용한다.
- 모든 리스트는 최대 3개까지만.
- routeId는 입력으로 받은 각 경로의 id를 그대로 사용한다.
- 모든 텍스트는 한국어로, 카드에 바로 들어갈 만큼 간결하게 작성한다.
  - summary는 한 줄(공백 포함 30자 내외).
  - pros/cons/reasons/items/fallback의 각 항목은 완결된 문장이 아니라 짧은 구로 쓴다
    (예: "인턴 실무 경험" O / "인턴을 하면 실무 경험을 쌓을 수 있어서 좋다" X).
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
각 옵션의 title·description을 보고 경로가 실제로 어떤 선택인지 파악해서 비교해.
```

> `{routes}`에는 각 경로의 id, name, optionIds와 함께 그 옵션들의 **title과 description**을
> 같이 넣어준다. description이 있어야 AI가 각 선택지의 내용을 이해하고 비교할 수 있다.
> (id·title만 주면 선택지의 실제 의미를 몰라 비교가 부정확해진다)
>
> 예시 — `{routes}`에 넣는 형태:
> ```
> [경로1] optionIds=[opt-3, opt-1]
>   - opt-3 스타트업 인턴: 실무 경험을 빠르게 쌓는 인턴 경로
>   - opt-1 대기업 취업 준비: 안정적인 대기업에 신입으로 지원
> ```

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
            "summary": { "type": "string" },
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
            "fallback": { "type": "array", "items": { "type": "string" } }
          },
          "required": [
            "routeId",
            "summary",
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
      "summary": "실무 경험 + 취업 안정성 균형형",
      "pros": ["실무 경험 확보", "졸업 후 바로 취업"],
      "cons": ["인턴·취업 동시 준비 부담"],
      "risk": { "level": "yellow", "reasons": ["서류/코테 불합격 가능"] },
      "todoBurden": {
        "level": "yellow",
        "items": ["자소서 작성", "코테 준비"]
      },
      "fallback": ["졸업 유예 후 재도전", "대학원 진학 전환"]
    }
  ]
}
```
