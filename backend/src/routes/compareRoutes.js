const express = require("express");
const comparisonMock = require("../../../shared/mock/comparison.json");

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

  if (!("routes" in req.body)) {
    return res.status(400).json({
      success: false,
      message: "request body에 routes가 존재하지 않습니다.",
    });
  }

  if (!("context" in req.body)) {
    return res.status(400).json({
      success: false,
      message: "request body에 context가 존재하지 않습니다.",
    });
  }

  const { routes, context } = req.body;

  if (!Array.isArray(routes)) {
    return res.status(400).json({
      success: false,
      message: "routes는 배열이어야 합니다.",
    });
  }

  if (routes.length === 0) {
    return res.status(400).json({
      success: false,
      message: "routes가 빈 배열입니다.",
    });
  }

  if (routes.length > 3) {
    return res.status(400).json({
      success: false,
      message: "분석 가능한 경로는 최대 3개입니다.",
    });
  }

  const isValidRouteList = routes.every(
    (route) =>
      route !== null &&
      typeof route === "object" &&
      !Array.isArray(route) &&
      typeof route.id === "string" &&
      typeof route.name === "string" &&
      Array.isArray(route.optionIds) &&
      route.optionIds.length > 0 &&
      route.optionIds.every((optionId) => typeof optionId === "string") &&
      typeof route.favorite === "boolean" &&
      route.favorite === true,
  );

  if (!isValidRouteList) {
    return res.status(400).json({
      success: false,
      message:
        "route JSON 형식이 올바르지 않습니다. id, name, optionIds, favorite를 확인해주세요.",
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

  const isValidContext =
    typeof context.goal === "string" &&
    Array.isArray(context.criteria) &&
    context.criteria.every((criterion) => typeof criterion === "string") &&
    Array.isArray(context.concerns) &&
    context.concerns.every((concern) => typeof concern === "string");

  if (!isValidContext) {
    return res.status(400).json({
      success: false,
      message:
        "context JSON 형식이 올바르지 않습니다. goal, criteria, concerns를 확인해주세요.",
    });
  }

  // TODO: AI 경로 비교 요청
  // TODO: AI 경로 비교 결과 가공

  // Frontend로 응답 전송
  return res.status(200).json({
    success: true,
    data: comparisonMock,
  });
});

module.exports = router;
