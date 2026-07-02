const todosSchema = {
  type: "object",
  properties: {
    todos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          done: { type: "boolean" },
        },
        required: ["id", "title", "done"],
        additionalProperties: false,
      },
    },
  },
  required: ["todos"],
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

function buildTodosPrompt(requestBody) {
  const { routeId, optionIds, context } = requestBody;
  const optionTitleMap = buildOptionTitleMap(requestBody);

  const options = optionIds.map((optionId) => ({
    id: optionId,
    title: optionTitleMap[optionId] || optionId,
  }));

  const systemPrompt = `당신은 대학생이 선택한 진로 경로를 실행 가능한 할 일로 쪼개는 실행 코치입니다.
사용자(대학생)가 메인으로 선택한 경로와 그 목표를 받아,
지금부터 해야 할 구체적인 할 일 리스트를 만듭니다.

규칙:
- 할 일은 실행 가능하고 구체적인 단위로 작성한다.
- 너무 추상적인 항목("열심히 한다", "준비한다", "고민한다", "역량을 강화한다")은 만들지 않는다.
- 5~8개 정도의 할 일을 만든다.
- id는 "todo-1", "todo-2"처럼 1부터 순서대로 부여한다.
- done은 모두 false로 시작한다.
- title은 한국어로 작성한다.
- todo는 시간 순서대로 배열한다.
- 첫 번째 todo는 정보 확인, 리스트업, 일정 확인처럼 진입 장벽이 낮은 일로 작성한다.
- 각 todo는 사용자가 오늘 또는 이번 주에 시작할 수 있는 행동이어야 한다.
- title은 체크리스트에 바로 표시할 수 있도록 짧고 명확하게 작성한다.`;

  const userPrompt = `[목표]
${context.goal}

[선택한 경로]
${routeId}

[경로에 포함된 선택지들]
${safeStringify(options)}

이 경로를 실행하기 위해 지금부터 해야 할 일들을 체크리스트로 만들어줘.`;

  return { systemPrompt, userPrompt };
}

module.exports = {
  todosSchema,
  buildTodosPrompt,
};
