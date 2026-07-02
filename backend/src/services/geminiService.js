const {
  structureSchema,
  buildStructurePrompt,
} = require("../prompts/structurePrompt");

const {
  compareRoutesSchema,
  buildCompareRoutesPrompt,
} = require("../prompts/compareRoutesPrompt");

const {
  todosSchema,
  buildTodosPrompt,
} = require("../prompts/generateTodosPrompt");

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

let geminiClient = null;

async function getGeminiClient() {
  if (geminiClient) {
    return geminiClient;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY가 설정되어 있지 않습니다.");
  }

  const { GoogleGenAI } = await import("@google/genai");

  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  return geminiClient;
}

function parseJsonOutput(outputText) {
  if (!outputText || typeof outputText !== "string") {
    throw new Error("Gemini 응답이 비어있습니다.");
  }

  try {
    return JSON.parse(outputText);
  } catch (error) {
    console.error("Gemini raw output:", outputText);
    throw new Error("Gemini 응답을 JSON으로 파싱하지 못했습니다.");
  }
}

async function callGeminiJson({ systemPrompt, userPrompt, schema }) {
  const client = await getGeminiClient();

  const response = await client.models.generateContent({
    model: DEFAULT_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const outputText = response.text || "";

  return parseJsonOutput(outputText);
}

function isStringArray(value) {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isValidLevel(value) {
  return ["green", "yellow", "red"].includes(value);
}

/**
 * 1. Structure API
 */

function validateStructuredData(data) {
  const isValidOptions =
    Array.isArray(data.options) &&
    data.options.every(
      (option) =>
        option !== null &&
        typeof option === "object" &&
        !Array.isArray(option) &&
        typeof option.id === "string" &&
        typeof option.title === "string",
    );

  const isValid =
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    typeof data.goal === "string" &&
    isStringArray(data.current) &&
    isValidOptions &&
    isStringArray(data.criteria) &&
    isStringArray(data.concerns) &&
    isStringArray(data.missing) &&
    typeof data.followup === "string";

  if (!isValid) {
    throw new Error("Gemini structure 응답 형식이 올바르지 않습니다.");
  }

  return data;
}

async function generateStructuredData(requestBody) {
  const { systemPrompt, userPrompt } = buildStructurePrompt(requestBody);

  const result = await callGeminiJson({
    systemPrompt,
    userPrompt,
    schema: structureSchema,
  });

  return validateStructuredData(result);
}

/**
 * 2. Compare Routes API
 */

function normalizeComparisonData(data) {
  return {
    comparison: data.comparison.map((item) => ({
      routeId: item.routeId,
      summary: item.summary,
      pros: item.pros.slice(0, 3),
      cons: item.cons.slice(0, 3),
      risk: {
        level: item.risk.level,
        reasons: item.risk.reasons.slice(0, 3),
      },
      todoBurden: {
        level: item.todoBurden.level,
        items: item.todoBurden.items.slice(0, 3),
      },
      fallback: item.fallback.slice(0, 3),
    })),
  };
}

function validateComparisonData(data) {
  const isValidComparison =
    Array.isArray(data.comparison) &&
    data.comparison.every((item) => {
      const isValidRisk =
        item.risk !== null &&
        typeof item.risk === "object" &&
        !Array.isArray(item.risk) &&
        isValidLevel(item.risk.level) &&
        isStringArray(item.risk.reasons);

      const isValidTodoBurden =
        item.todoBurden !== null &&
        typeof item.todoBurden === "object" &&
        !Array.isArray(item.todoBurden) &&
        isValidLevel(item.todoBurden.level) &&
        isStringArray(item.todoBurden.items);

      return (
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        typeof item.routeId === "string" &&
        typeof item.summary === "string" &&
        isStringArray(item.pros) &&
        isStringArray(item.cons) &&
        isValidRisk &&
        isValidTodoBurden &&
        isStringArray(item.fallback)
      );
    });

  const isValid =
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    isValidComparison;

  if (!isValid) {
    throw new Error("Gemini comparison 응답 형식이 올바르지 않습니다.");
  }

  return normalizeComparisonData(data);
}

async function compareRoutesWithGemini(requestBody) {
  const { systemPrompt, userPrompt } = buildCompareRoutesPrompt(requestBody);

  const result = await callGeminiJson({
    systemPrompt,
    userPrompt,
    schema: compareRoutesSchema,
  });

  return validateComparisonData(result);
}

/**
 * 3. Generate Todos API
 */

function normalizeTodosData(data) {
  return {
    todos: data.todos.slice(0, 8).map((todo, index) => ({
      id: todo.id || `todo-${index + 1}`,
      title: todo.title,
      done: false,
    })),
  };
}

function validateTodosData(data) {
  const isValidTodos =
    Array.isArray(data.todos) &&
    data.todos.every(
      (todo) =>
        todo !== null &&
        typeof todo === "object" &&
        !Array.isArray(todo) &&
        typeof todo.id === "string" &&
        typeof todo.title === "string" &&
        typeof todo.done === "boolean",
    );

  const isValid =
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    isValidTodos;

  if (!isValid) {
    throw new Error("Gemini todos 응답 형식이 올바르지 않습니다.");
  }

  return normalizeTodosData(data);
}

async function generateTodosWithGemini(requestBody) {
  const { systemPrompt, userPrompt } = buildTodosPrompt(requestBody);

  const result = await callGeminiJson({
    systemPrompt,
    userPrompt,
    schema: todosSchema,
  });

  return validateTodosData(result);
}

module.exports = {
  generateStructuredData,
  compareRoutesWithGemini,
  generateTodosWithGemini,
};
