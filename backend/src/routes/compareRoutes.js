const express = require("express");
const comparisonMock = require("../../../shared/mock/comparison.json");
const { compareRoutesWithGemini } = require("../services/geminiService");

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
      route.id.trim().length > 0 &&
      typeof route.name === "string" &&
      route.name.trim().length > 0 &&
      Array.isArray(route.optionIds) &&
      route.optionIds.length > 0 &&
      route.optionIds.every(
        (optionId) =>
          typeof optionId === "string" && optionId.trim().length > 0,
      ) &&
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
    context.goal.trim().length > 0 &&
    Array.isArray(context.criteria) &&
    context.criteria.every(
      (criterion) =>
        typeof criterion === "string" && criterion.trim().length > 0,
    ) &&
    Array.isArray(context.concerns) &&
    context.concerns.every(
      (concern) => typeof concern === "string" && concern.trim().length > 0,
    );

  if (!isValidContext) {
    return res.status(400).json({
      success: false,
      message:
        "context JSON 형식이 올바르지 않습니다. goal, criteria, concerns를 확인해주세요.",
    });
  }

  if (shouldUseMock()) {
    return res.status(200).json({
      success: true,
      data: comparisonMock,
    });
  }

  try {
    const comparisonData = await compareRoutesWithGemini(req.body);

    return res.status(200).json({
      success: true,
      data: comparisonData,
    });
  } catch (error) {
    console.error("compare-routes AI error:", error);

    // AI 실패 시 mock fallback
    return res.status(200).json({
      success: true,
      data: comparisonMock,
    });
  }
});

module.exports = router;
