const compareRoutesSchema = {
  type: "object",
  properties: {
    comparison: {
      type: "array",
      items: {
        type: "object",
        properties: {
          routeId: { type: "string" },
          summary: { type: "string" },
          pros: {
            type: "array",
            items: { type: "string" },
          },
          cons: {
            type: "array",
            items: { type: "string" },
          },
          risk: {
            type: "object",
            properties: {
              level: {
                type: "string",
                enum: ["green", "yellow", "red"],
              },
              reasons: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["level", "reasons"],
            additionalProperties: false,
          },
          todoBurden: {
            type: "object",
            properties: {
              level: {
                type: "string",
                enum: ["green", "yellow", "red"],
              },
              items: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["level", "items"],
            additionalProperties: false,
          },
          fallback: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "routeId",
          "summary",
          "pros",
          "cons",
          "risk",
          "todoBurden",
          "fallback",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["comparison"],
  additionalProperties: false,
};

function safeStringify(value) {
  return JSON.stringify(value, null, 2);
}

function buildOptionTitleMap(requestBody) {
  const optionSources = [
    requestBody.options,
    requestBody.context?.options,
    requestBody.structured?.options,
  ];

  const optionTitleMap = {};

  optionSources.forEach((source) => {
    if (!Array.isArray(source)) {
      return;
    }

    source.forEach((option) => {
      if (
        option &&
        typeof option === "object" &&
        typeof option.id === "string" &&
        typeof option.title === "string"
      ) {
        optionTitleMap[option.id] = option.title;
      }
    });
  });

  return optionTitleMap;
}

function enrichRoutesWithOptionTitles(requestBody) {
  const optionTitleMap = buildOptionTitleMap(requestBody);

  return requestBody.routes.map((route) => ({
    id: route.id,
    name: route.name,
    optionIds: route.optionIds,
    favorite: route.favorite,
    options: route.optionIds.map((optionId) => ({
      id: optionId,
      title: optionTitleMap[optionId] || optionId,
    })),
  }));
}

function buildCompareRoutesPrompt(requestBody) {
  const { context } = requestBody;
  const enrichedRoutes = enrichRoutesWithOptionTitles(requestBody);

  const systemPrompt = `당신은 대학생의 진로 경로를 비교 분석하는 커리어 컨설턴트입니다.
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
- 각 경로의 차이가 드러나도록 비교한다.
- 사용자의 criteria와 concerns를 반드시 분석에 반영한다.
- 너무 일반적인 조언보다 해당 경로에서 실제로 생길 수 있는 장단점과 리스크를 작성한다.
- 모든 텍스트는 한국어로 작성한다.`;

  const userPrompt = `[목표]
${context.goal}

[중요 기준]
${safeStringify(context.criteria)}

[걱정되는 점]
${safeStringify(context.concerns)}

[비교할 경로들]
${safeStringify(enrichedRoutes)}

각 경로를 분석해서 비교 결과를 만들어줘.
참고로 각 경로의 optionIds는 선택지 카드의 id이고, 순서대로 진행된다는 의미야.`;

  return { systemPrompt, userPrompt };
}

module.exports = {
  compareRoutesSchema,
  buildCompareRoutesPrompt,
};
