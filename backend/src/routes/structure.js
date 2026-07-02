const express = require("express");
const structuredMock = require("../../../shared/mock/structured.json");
const { generateStructuredData } = require("../services/geminiService");

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

  const rawText = req.body.rawText || req.body.input || req.body.text;

  if (typeof rawText !== "string" || rawText.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "rawText는 비어있지 않은 string이어야 합니다.",
    });
  }

  if (shouldUseMock()) {
    return res.status(200).json({
      success: true,
      data: structuredMock,
    });
  }

  try {
    const structuredData = await generateStructuredData(req.body);

    return res.status(200).json({
      success: true,
      data: structuredData,
    });
  } catch (error) {
    console.error("structure AI error:", error);

    // AI 실패 시 mock fallback
    return res.status(200).json({
      success: true,
      data: structuredMock,
    });
  }
});

module.exports = router;
