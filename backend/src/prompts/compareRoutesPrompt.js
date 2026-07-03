const systemPrompt = `
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
`.trim();

const schema = {
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
          riskLevel: {
            type: "string",
            enum: ["green", "yellow", "red"],
          },
          riskReasons: {
            type: "array",
            items: { type: "string" },
          },
          todoBurdenLevel: {
            type: "string",
            enum: ["green", "yellow", "red"],
          },
          todoBurdenItems: {
            type: "array",
            items: { type: "string" },
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
          "riskLevel",
          "riskReasons",
          "todoBurdenLevel",
          "todoBurdenItems",
          "fallback",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["comparison"],
  additionalProperties: false,
};

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function formatList(value) {
  const list = toArray(value);
  return list.length > 0 ? list.join(", ") : "없음";
}

function buildOptionMap(options = []) {
  const optionMap = new Map();

  if (!Array.isArray(options)) {
    return optionMap;
  }

  options.forEach((option) => {
    if (
      option === null ||
      typeof option !== "object" ||
      Array.isArray(option) ||
      typeof option.id !== "string"
    ) {
      return;
    }

    optionMap.set(option.id, {
      id: option.id,
      title:
        typeof option.title === "string" && option.title.trim()
          ? option.title.trim()
          : option.id,
      description:
        typeof option.description === "string" && option.description.trim()
          ? option.description.trim()
          : "",
    });
  });

  return optionMap;
}

function formatRouteOptions(route, optionMap) {
  const optionIds = Array.isArray(route.optionIds) ? route.optionIds : [];

  if (optionIds.length === 0) {
    return "  - 포함된 선택지 없음";
  }

  return optionIds
    .map((optionId) => {
      const option = optionMap.get(optionId);

      if (!option) {
        return `  - ${optionId}: 선택지 정보 없음`;
      }

      if (option.description) {
        return `  - ${option.id} ${option.title}: ${option.description}`;
      }

      return `  - ${option.id} ${option.title}: 설명 없음`;
    })
    .join("\n");
}

function formatRoutes(routes = [], options = []) {
  if (!Array.isArray(routes) || routes.length === 0) {
    return "비교할 경로 없음";
  }

  const optionMap = buildOptionMap(options);

  return routes
    .map((route, index) => {
      const routeNumber = index + 1;

      const routeId =
        typeof route.id === "string" && route.id.trim()
          ? route.id.trim()
          : `route-${routeNumber}`;

      const routeName =
        typeof route.name === "string" && route.name.trim()
          ? route.name.trim()
          : `경로 ${routeNumber}`;

      const optionIds = Array.isArray(route.optionIds)
        ? route.optionIds.join(", ")
        : "";

      return `
[경로${routeNumber}] id=${routeId} name=${routeName} optionIds=[${optionIds}]
${formatRouteOptions(route, optionMap)}
`.trim();
    })
    .join("\n\n");
}

function buildPrompt(requestBody = {}) {
  const routes = Array.isArray(requestBody.routes) ? requestBody.routes : [];

  const context =
    requestBody.context !== null &&
    typeof requestBody.context === "object" &&
    !Array.isArray(requestBody.context)
      ? requestBody.context
      : {};

  const options = Array.isArray(context.options)
    ? context.options
    : Array.isArray(requestBody.options)
      ? requestBody.options
      : [];

  const goal =
    typeof context.goal === "string" && context.goal.trim()
      ? context.goal.trim()
      : "없음";

  return `
[목표] ${goal}
[중요 기준] ${formatList(context.criteria)}
[걱정되는 점] ${formatList(context.concerns)}

[비교할 경로들]
${formatRoutes(routes, options)}

각 경로를 분석해서 비교 결과를 만들어줘.
각 경로의 optionIds는 선택지 카드의 id이고, 순서대로 진행된다는 의미야.
각 옵션의 title과 description을 보고 경로가 실제로 어떤 선택인지 파악해서 비교해.
`.trim();
}

module.exports = {
  systemPrompt,
  schema,
  buildPrompt,
};
