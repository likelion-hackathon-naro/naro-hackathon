const express = require("express");
const todosMock = require("../../../shared/mock/todos.json");
const { generateTodosWithGemini } = require("../services/geminiService");

const router = express.Router();

const shouldUseMock = () => process.env.USE_MOCK !== "false";

router.post("/", async (req, res) => {
  // Frontend 데이터 검증
  if (
    req.body === null ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      success: false,
      message: "request body가 비어있거나 object가 아닙니다.",
    });
  }

  const { routeId, optionIds, context } = req.body;

  if (typeof routeId !== "string" || routeId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "routeId는 비어있지 않은 string이어야 합니다.",
    });
  }

  if (!Array.isArray(optionIds)) {
    return res.status(400).json({
      success: false,
      message: "optionIds는 배열이어야 합니다.",
    });
  }

  if (optionIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "optionIds가 빈 배열입니다.",
    });
  }

  const isValidOptionIds = optionIds.every(
    (optionId) => typeof optionId === "string" && optionId.trim().length > 0,
  );

  if (!isValidOptionIds) {
    return res.status(400).json({
      success: false,
      message: "optionIds는 비어있지 않은 string 배열이어야 합니다.",
    });
  }

  if (
    context === null ||
    typeof context !== "object" ||
    Array.isArray(context)
  ) {
    return res.status(400).json({
      success: false,
      message: "context가 비어있거나 object가 아닙니다.",
    });
  }

  if (typeof context.goal !== "string" || context.goal.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "context.goal은 비어있지 않은 string이어야 합니다.",
    });
  }

  if (shouldUseMock()) {
    return res.status(200).json({
      success: true,
      data: todosMock,
    });
  }

  try {
    const todosData = await generateTodosWithGemini(req.body);

    return res.status(200).json({
      success: true,
      data: todosData,
    });
  } catch (error) {
    console.error("generate-todos AI error:", error);

    // AI 실패 시 mock fallback
    return res.status(200).json({
      success: true,
      data: todosMock,
    });
  }
});

module.exports = router;
