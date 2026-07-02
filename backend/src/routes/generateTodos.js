const express = require("express");
const todosMock = require("../../../shared/mock/todos.json");

const router = express.Router();

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

  if (typeof routeId !== "string") {
    return res.status(400).json({
      success: false,
      message: "routeId는 string이어야 합니다.",
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
    (optionId) => typeof optionId === "string",
  );

  if (!isValidOptionIds) {
    return res.status(400).json({
      success: false,
      message: "optionIds는 string 배열이어야 합니다.",
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

  if (typeof context.goal !== "string") {
    return res.status(400).json({
      success: false,
      message: "context.goal은 string이어야 합니다.",
    });
  }

  // TODO: AI 할 일 생성 요청
  // TODO: AI 할 일 생성 결과 가공

  // Frontend로 응답 전송
  return res.status(200).json({
    success: true,
    data: todosMock,
  });
});

module.exports = router;
