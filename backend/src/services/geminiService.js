const structurePrompt = require("../prompts/structurePrompt");
const compareRoutesPrompt = require("../prompts/compareRoutesPrompt");
const generateTodosPrompt = require("../prompts/generateTodosPrompt");

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const VALID_LEVELS = ["green", "yellow", "red"];
const VALID_TIMEFRAMES = ["now", "short", "mid", "long"];

const TIMEFRAME_ORDER = {
  now: 1,
  short: 2,
  mid: 3,
  long: 4,
};

let genAIClient = null;

async function getGeminiClient() {
  if (genAIClient) {
    return genAIClient;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY가 설정되어 있지 않습니다.");
  }

  const { GoogleGenAI } = await import("@google/genai");

  genAIClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  return genAIClient;
}

async function callGeminiJson({ systemPrompt, userPrompt, schema }) {
  if (typeof systemPrompt !== "string" || !systemPrompt.trim()) {
    throw new Error("Gemini systemPrompt가 비어 있습니다.");
  }

  if (typeof userPrompt !== "string" || !userPrompt.trim()) {
    throw new Error("Gemini userPrompt가 비어 있습니다.");
  }

  if (!schema || typeof schema !== "object") {
    throw new Error("Gemini response schema가 올바르지 않습니다.");
  }

  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const response = await client.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text =
    typeof response.text === "string"
      ? response.text
      : typeof response.text === "function"
        ? response.text()
        : "";

  if (!text.trim()) {
    throw new Error("Gemini 응답이 비어 있습니다.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Gemini JSON 파싱 실패: ${error.message}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asString(value, fallback = "") {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return fallback;
}

function asStringArray(value, maxLength = 10) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim())
    .slice(0, maxLength);
}

function normalizeLevel(value, fallback = "yellow") {
  if (VALID_LEVELS.includes(value)) {
    return value;
  }

  return fallback;
}

function normalizeTimeframe(value, index) {
  if (VALID_TIMEFRAMES.includes(value)) {
    return value;
  }

  if (index <= 1) {
    return "now";
  }

  if (index <= 3) {
    return "short";
  }

  if (index <= 5) {
    return "mid";
  }

  return "long";
}

function normalizeHint(value, timeframe) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (timeframe === "now") {
    return "오늘 바로 시작";
  }

  if (timeframe === "short") {
    return "이번 달 과제";
  }

  if (timeframe === "mid") {
    return "중기 목표";
  }

  return "장기 목표";
}

function normalizePriorityByTimeframe(todo, index, todos) {
  const sameTimeframeBefore = todos
    .slice(0, index)
    .filter((item) => item.timeframe === todo.timeframe).length;

  return Math.min(sameTimeframeBefore + 1, 3);
}

/**
 * 1. Structure API
 */

function normalizeStructuredData(data) {
  const options = Array.isArray(data.options) ? data.options : [];

  return {
    goal: asString(data.goal),
    current: asStringArray(data.current),
    options: options
      .filter((option) => isPlainObject(option))
      .map((option, index) => ({
        id:
          typeof option.id === "string" && option.id.trim()
            ? option.id.trim()
            : `opt-${index + 1}`,
        title: asString(option.title, `선택지 ${index + 1}`),
        description: asString(option.description, "선택지 설명 없음"),
      })),
    criteria: asStringArray(data.criteria),
    concerns: asStringArray(data.concerns),
    missing: asStringArray(data.missing),
    followup: asString(data.followup),
  };
}

function validateStructuredData(data) {
  if (!isPlainObject(data)) {
    throw new Error("Gemini structure 응답 형식이 올바르지 않습니다.");
  }

  const hasMinimumShape =
    typeof data.goal === "string" &&
    Array.isArray(data.current) &&
    Array.isArray(data.options) &&
    Array.isArray(data.criteria) &&
    Array.isArray(data.concerns);

  if (!hasMinimumShape) {
    throw new Error("Gemini structure 응답 필수 필드가 부족합니다.");
  }

  return normalizeStructuredData(data);
}

async function structureWithGemini(requestBody) {
  const result = await callGeminiJson({
    systemPrompt: structurePrompt.systemPrompt,
    userPrompt: structurePrompt.buildPrompt(requestBody),
    schema: structurePrompt.schema,
  });

  return validateStructuredData(result);
}

/**
 * 2. Compare Routes API
 */

function normalizeComparisonItem(item, index, requestBody = {}) {
  const routes = Array.isArray(requestBody.routes) ? requestBody.routes : [];
  const fallbackRoute = routes[index];

  const routeId =
    asString(item.routeId) ||
    (fallbackRoute && typeof fallbackRoute.id === "string"
      ? fallbackRoute.id
      : `route-${index + 1}`);

  return {
    routeId,
    summary: asString(item.summary, "경로 요약 없음"),
    pros: asStringArray(item.pros, 3),
    cons: asStringArray(item.cons, 3),
    risk: {
      level: normalizeLevel(item.riskLevel || item.risk?.level, "yellow"),
      reasons: asStringArray(item.riskReasons || item.risk?.reasons, 3),
    },
    todoBurden: {
      level: normalizeLevel(
        item.todoBurdenLevel || item.todoBurden?.level,
        "yellow",
      ),
      items: asStringArray(item.todoBurdenItems || item.todoBurden?.items, 3),
    },
    fallback: asStringArray(item.fallback, 3),
  };
}

function normalizeComparisonData(data, requestBody = {}) {
  const comparison = Array.isArray(data.comparison) ? data.comparison : [];

  return {
    comparison: comparison
      .filter((item) => isPlainObject(item))
      .slice(0, 3)
      .map((item, index) => normalizeComparisonItem(item, index, requestBody)),
  };
}

function validateComparisonData(data, requestBody = {}) {
  if (!isPlainObject(data) || !Array.isArray(data.comparison)) {
    throw new Error("Gemini comparison 응답 형식이 올바르지 않습니다.");
  }

  if (data.comparison.length === 0) {
    throw new Error("Gemini comparison 응답이 비어 있습니다.");
  }

  return normalizeComparisonData(data, requestBody);
}

async function compareRoutesWithGemini(requestBody) {
  const result = await callGeminiJson({
    systemPrompt: compareRoutesPrompt.systemPrompt,
    userPrompt: compareRoutesPrompt.buildPrompt(requestBody),
    schema: compareRoutesPrompt.schema,
  });

  return validateComparisonData(result, requestBody);
}

/**
 * 3. Generate Todos API
 */

function normalizeTodosData(data) {
  const rawTodos = Array.isArray(data.todos) ? data.todos : [];

  const normalizedBase = rawTodos
    .filter((todo) => isPlainObject(todo))
    .slice(0, 9)
    .map((todo, index) => {
      const timeframe = normalizeTimeframe(todo.timeframe, index);

      return {
        id: `todo-${index + 1}`,
        title: asString(todo.title, `할 일 ${index + 1} 작성하기`),
        done: false,
        timeframe,
        priority: 1,
        isMilestone:
          typeof todo.isMilestone === "boolean"
            ? todo.isMilestone
            : timeframe === "mid" || timeframe === "long",
        hint: normalizeHint(todo.hint, timeframe),
      };
    })
    .sort((a, b) => {
      const timeframeDiff =
        TIMEFRAME_ORDER[a.timeframe] - TIMEFRAME_ORDER[b.timeframe];

      if (timeframeDiff !== 0) {
        return timeframeDiff;
      }

      return 0;
    });

  const normalizedTodos = normalizedBase.map((todo, index, todos) => ({
    ...todo,
    id: `todo-${index + 1}`,
    priority: normalizePriorityByTimeframe(todo, index, todos),
  }));

  return {
    todos: normalizedTodos,
  };
}

function validateTodosData(data) {
  if (!isPlainObject(data) || !Array.isArray(data.todos)) {
    throw new Error("Gemini todos 응답 형식이 올바르지 않습니다.");
  }

  if (data.todos.length === 0) {
    throw new Error("Gemini todos 응답이 비어 있습니다.");
  }

  const hasValidMinimumTodos = data.todos.every(
    (todo) => isPlainObject(todo) && typeof todo.title === "string",
  );

  if (!hasValidMinimumTodos) {
    throw new Error("Gemini todos 응답 필수 필드가 부족합니다.");
  }

  return normalizeTodosData(data);
}

async function generateTodosWithGemini(requestBody) {
  const result = await callGeminiJson({
    systemPrompt: generateTodosPrompt.systemPrompt,
    userPrompt: generateTodosPrompt.buildPrompt(requestBody),
    schema: generateTodosPrompt.schema,
  });

  return validateTodosData(result);
}

module.exports = {
  structureWithGemini,
  compareRoutesWithGemini,
  generateTodosWithGemini,
};
