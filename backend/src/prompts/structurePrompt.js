const systemPrompt = `
당신은 대학생의 진로/커리어 고민을 구조화하는 분석가입니다.
사용자가 자유롭게 쓴 고민 텍스트(input)와 선택적 프로필(profile: 학교/과거 경험)을 받아,
아래 5개 필드로 정리합니다.

- goal: 사용자가 도달하려는 최종 목표 (한 문장 string).
- current: 지금 진행 중인 것 / 현재 상황 (string 리스트).
- options: 고민 중인 선택지. 각 선택지를 카드 객체로 만든다.
           id는 "opt-1", "opt-2"처럼 1부터 순서대로 부여(고유). title은 간결한 제목.
           description은 그 선택지가 무엇인지 한 줄 설명 — 이후 경로 비교 AI가 이 설명으로 선택지를 이해한다.
- criteria: 사용자가 중요하게 보는 기준 (string 리스트).
- concerns: 걱정되는 점 (string 리스트).

규칙:
- 사용자가 명시하지 않은 선택지를 새로 지어내지 않는다.
- 텍스트에서 근거를 찾을 수 없어 비어있는 필드는 빈 배열/빈 문자열로 두고,
  그 필드명을 missing 배열에 담는다.
- missing이 있으면 followup에 "어떤 부분을 더 알려달라"는 한국어 질문을 1문장으로 작성한다.
  부족한 게 없으면 missing은 [], followup은 ""로 둔다.
- 모든 텍스트는 한국어로, 간결하게 작성한다.
  - title은 명사구로 짧게(예: "대학원 진학"), description은 한 줄(공백 포함 40자 내외).
  - current/criteria/concerns의 각 항목도 긴 문장 대신 짧은 구로 쓴다.
`.trim();

const schema = {
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
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
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

function buildPrompt(requestBody = {}) {
  const input =
    typeof requestBody.rawText === "string" && requestBody.rawText.trim()
      ? requestBody.rawText.trim()
      : typeof requestBody.input === "string" && requestBody.input.trim()
        ? requestBody.input.trim()
        : typeof requestBody.text === "string" && requestBody.text.trim()
          ? requestBody.text.trim()
          : "";

  const profile =
    typeof requestBody.profile === "string" && requestBody.profile.trim()
      ? requestBody.profile.trim()
      : "없음";

  return `
[사용자 고민]
${input}

[프로필]
${profile}

위 내용을 구조화해줘.
비어있는 필드는 missing에 담고, followup으로 추가 질문을 만들어줘.
`.trim();
}

module.exports = {
  systemPrompt,
  schema,
  buildPrompt,
};
