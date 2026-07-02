const structureSchema = {
  type: "object",
  properties: {
    goal: { type: "string" },
    current: {
      type: "array",
      items: { type: "string" },
    },
    options: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
        },
        required: ["id", "title"],
        additionalProperties: false,
      },
    },
    criteria: {
      type: "array",
      items: { type: "string" },
    },
    concerns: {
      type: "array",
      items: { type: "string" },
    },
    missing: {
      type: "array",
      items: { type: "string" },
    },
    followup: { type: "string" },
  },
  required: [
    "goal",
    "current",
    "options",
    "criteria",
    "concerns",
    "missing",
    "followup",
  ],
  additionalProperties: false,
};

function safeStringify(value) {
  return JSON.stringify(value, null, 2);
}

function buildStructurePrompt({ rawText, input, text, profile }) {
  const userInput = rawText || input || text || "";
  const userProfile = profile ? safeStringify(profile) : "없음";

  const systemPrompt = `당신은 대학생의 진로/커리어 고민을 구조화하는 분석가입니다.
사용자가 자유롭게 쓴 고민 텍스트(input)와 선택적 프로필(profile: 학교/과거 경험)을 받아,
아래 5개 필드로 정리합니다.

- goal: 사용자가 도달하려는 최종 목표 (한 문장 string).
- current: 지금 진행 중인 것 / 현재 상황 (string 리스트).
- options: 고민 중인 선택지. 각 선택지를 카드 객체로 만든다.
           id는 "opt-1", "opt-2"처럼 1부터 순서대로 부여(고유). title은 간결한 제목.
- criteria: 사용자가 중요하게 보는 기준 (string 리스트).
- concerns: 걱정되는 점 (string 리스트).

규칙:
- 사용자가 명시하지 않은 선택지를 새로 지어내지 않는다.
- 텍스트에서 근거를 찾을 수 없어 비어있는 필드는 빈 배열/빈 문자열로 두고,
  그 필드명을 missing 배열에 담는다.
- missing이 있으면 followup에 "어떤 부분을 더 알려달라"는 한국어 질문을 1~2문장으로 작성한다.
  부족한 게 없으면 missing은 [], followup은 ""로 둔다.
- options의 id는 반드시 "opt-1", "opt-2", "opt-3"처럼 1부터 순서대로 부여한다.
- 모든 텍스트는 한국어로 작성한다.`;

  const userPrompt = `[사용자 고민]
${userInput}

[프로필]
${userProfile}

위 내용을 5개 필드로 구조화해줘. 비어있는 필드는 missing에 담고 followup으로 추가 질문을 만들어줘.`;

  return { systemPrompt, userPrompt };
}

module.exports = {
  structureSchema,
  buildStructurePrompt,
};
