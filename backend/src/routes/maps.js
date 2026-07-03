const express = require("express");
const {
  createDecisionMap,
  getDecisionMapById,
} = require("../services/supabaseService");

const router = express.Router();

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidUuid(value) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return typeof value === "string" && uuidRegex.test(value);
}

router.post("/", async (req, res) => {
  if (!isPlainObject(req.body)) {
    return res.status(400).json({
      success: false,
      message: "request body가 비어있거나 object가 아닙니다.",
    });
  }

  if (!isPlainObject(req.body.data)) {
    return res.status(400).json({
      success: false,
      message: "data는 object여야 합니다.",
    });
  }

  try {
    const decisionMap = await createDecisionMap(req.body);

    return res.status(201).json({
      success: true,
      data: decisionMap,
    });
  } catch (error) {
    console.error("create decision map error:", error);

    return res.status(500).json({
      success: false,
      message: "선택 지도 저장 중 오류가 발생했습니다.",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      success: false,
      message: "map id 형식이 올바르지 않습니다.",
    });
  }

  try {
    const decisionMap = await getDecisionMapById(id);

    if (!decisionMap) {
      return res.status(404).json({
        success: false,
        message: "선택 지도를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      data: decisionMap,
    });
  } catch (error) {
    console.error("get decision map error:", error);

    return res.status(500).json({
      success: false,
      message: "선택 지도 조회 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
