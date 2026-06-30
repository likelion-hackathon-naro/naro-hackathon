const express = require("express");
const { mockGenerateTodosResponse } = require("../mocks/generateTodos.mock");
const router = express.Router();

router.post("/", async (req, res) => {
  // Frontend 데이터 검증
  if (req.body === null || typeof req.body !== "object")
    return res.status(400).json({
      success: false,
      message: "request body가 비어있거나 object가 아닙니다.",
    });

  if (!("selectedRoute" in req.body))
    return res.status(400).json({
      success: false,
      message: "request body에 selectedRoute가 존재하지 않습니다.",
    });

  const selectedRoute = req.body.selectedRoute;
  if (selectedRoute === null || typeof selectedRoute !== "object")
    return res.status(400).json({
      success: false,
      message: "selectedRoute가 비어있거나 object가 아닙니다.",
    });

  if (
    !(
      typeof selectedRoute.id === "string" &&
      typeof selectedRoute.title === "string" &&
      Array.isArray(selectedRoute.nodeIds) &&
      selectedRoute.nodeIds.length > 0 &&
      selectedRoute.nodeIds.every((nodeId) => typeof nodeId === "string")
    )
  )
    return res.status(400).json({
      success: false,
      message: "selectedRoute JSON 형식이 올바르지 않습니다.",
    });

  // TODO: AI 할 일 생성 요청
  // TODO: AI 할 일 생성 결과 가공
  // Frontend로 응답 전송
  return res.status(200).json(mockGenerateTodosResponse);
});

module.exports = router;
