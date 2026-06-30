const express = require("express");
const { mockCompareRoutesResponse } = require("../mocks/compareRoutes.mock");

const router = express.Router();

router.post("/", async (req, res) => {
  // Frontend 데이터 검증
  if (req.body === null || typeof req.body !== "object")
    return res.status(400).json({
      success: false,
      message: "request body가 비어있거나 object가 아닙니다.",
    });
  if (!("routes" in req.body))
    return res.status(400).json({
      success: false,
      message: "request body에 routes가 존재하지 않습니다.",
    });

  const routes = req.body.routes;
  if (!Array.isArray(routes))
    return res.status(400).json({
      success: false,
      message: "routes는 배열이어야 합니다.",
    });

  if (routes.length === 0)
    return res.status(400).json({
      success: false,
      message: "routes가 빈 배열입니다.",
    });

  if (
    !routes.every(
      (route) =>
        typeof route === "object" &&
        route !== null &&
        typeof route.id === "string" &&
        typeof route.title === "string" &&
        Array.isArray(route.nodeIds) &&
        route.nodeIds.length > 0 &&
        route.nodeIds.every((nodeId) => typeof nodeId === "string"),
    )
  )
    return res.status(400).json({
      success: false,
      message: "route JSON이 올바르지 않습니다.",
    });

  // TODO: AI 경로 비교 요청
  // TODO: AI 분석 결과 가공
  // Frontend로 응답 전송

  return res.status(200).json(mockCompareRoutesResponse);
});

module.exports = router;
