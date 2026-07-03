const systemPrompt = `
당신은 대학생이 선택한 진로 경로를 실행 가능한 할 일로 쪼개는 실행 코치입니다.
사용자(대학생)가 메인으로 선택한 경로와 그 목표를 받아,
"지금 당장 할 수 있는 액션"을 먼저, "중장기 마일스톤"을 그다음에 제시합니다.

작성 원칙:
- 각 할 일은 실행 가능하고 구체적인 단위로 작성한다 (예: "이력서 초안 1페이지 작성", "지원 기업 3곳 리스트업").
- 너무 추상적인 항목("열심히 한다", "실력을 키운다")은 만들지 않는다.
- title은 한국어로, 동사로 끝나는 행동 문장으로 작성한다.

우선순위 / 시점 규칙:
- timeframe 은 다음 중 하나:
  - "now"  : 오늘~이번 주 안에 시작할 수 있는 즉시 실행 액션
  - "short": 이번 달 안에 다룰 단기 과제
  - "mid"  : 1~3개월 단위의 중기 목표
  - "long" : 3개월 이상 걸리는 장기 마일스톤(최종 목표에 가까운 지점)
- priority 는 1~3 정수. 1이 가장 먼저 해야 할 일.
- isMilestone 은 그 항목이 "완료하면 눈에 띄는 진전"이 되는 중장기 이정표이면 true.
  now/short 액션은 보통 false, mid/long 마일스톤은 보통 true.

구성 규칙:
- 반드시 timeframe이 "now"인 즉시 실행 액션을 최소 2개 이상 만들어 맨 앞에 둔다.
- 반드시 mid 또는 long 마일스톤을 최소 2개 이상 포함한다.
- 전체 6~9개를 만든다.
- 배열 순서 = 실행 순서. now → short → mid → long 순으로, 같은 timeframe 안에서는 priority 오름차순으로 정렬한다.
- id는 "todo-1", "todo-2" 처럼 1부터 정렬된 순서대로 부여한다.
- done은 모두 false로 시작한다.
- title은 동사로 끝나는 짧은 액션 한 줄(공백 포함 25자 내외).
- 각 항목의 hint에는 "왜 지금/나중인지" 또는 "첫 스텝"을 아주 짧게 적는다
  (한 구절, 공백 포함 30자 내외 — 부연 설명을 붙이지 않는다).
`.trim();

const schema = {
  type: "object",
  properties: {
    todos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          timeframe: {
            type: "string",
            enum: ["now", "short", "mid", "long"],
          },
          isMilestone: { type: "boolean" },
          hint: { type: "string" },
        },
        required: ["title", "timeframe", "isMilestone", "hint"],
        additionalProperties: false,
      },
    },
  },
  required: ["todos"],
  additionalProperties: false,
};

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

function formatSelectedOptions(optionIds = [], options = []) {
  if (!Array.isArray(optionIds) || optionIds.length === 0) {
    return "선택지 정보 없음";
  }

  const optionMap = buildOptionMap(options);

  return optionIds
    .map((optionId) => {
      const option = optionMap.get(optionId);

      if (!option) {
        return `- ${optionId}: 선택지 정보 없음`;
      }

      if (option.description) {
        return `- ${option.id} ${option.title}: ${option.description}`;
      }

      return `- ${option.id} ${option.title}`;
    })
    .join("\n");
}

function buildPrompt(requestBody = {}) {
  const context =
    requestBody.context !== null &&
    typeof requestBody.context === "object" &&
    !Array.isArray(requestBody.context)
      ? requestBody.context
      : {};

  const goal =
    typeof context.goal === "string" && context.goal.trim()
      ? context.goal.trim()
      : "없음";

  const routeId =
    typeof requestBody.routeId === "string" && requestBody.routeId.trim()
      ? requestBody.routeId.trim()
      : "없음";

  const optionIds = Array.isArray(requestBody.optionIds)
    ? requestBody.optionIds
    : [];

  const options = Array.isArray(context.options)
    ? context.options
    : Array.isArray(requestBody.options)
      ? requestBody.options
      : [];

  return `
[목표] ${goal}
[선택한 경로] ${routeId}
[경로에 포함된 선택지들]
${formatSelectedOptions(optionIds, options)}

이 경로를 실행하기 위한 할 일을 만들어줘.
지금 당장 시작할 수 있는 액션을 맨 앞에 두고,
그 뒤에 이번 달·1~3개월·장기 마일스톤을 순서대로 붙여줘.
`.trim();
}

module.exports = {
  systemPrompt,
  schema,
  buildPrompt,
};
